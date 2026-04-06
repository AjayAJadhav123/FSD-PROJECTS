"""
Flask REST API for Fake Review Detection ML Service.

Endpoints:
- POST /predict       - Predict if a review is fake or genuine
- POST /predict/batch - Batch prediction for multiple reviews
- GET  /health        - Health check endpoint
- GET  /model/info    - Get model information
"""

import os
import re
import joblib
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from textblob import TextBlob
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

# Load environment variables
load_dotenv()

# Download required NLTK data
nltk.download('stopwords', quiet=True)
nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# ============================================================
# Initialize NLP components
# ============================================================
stemmer = PorterStemmer()
stop_words = set(stopwords.words('english'))

# ============================================================
# Load trained model and vectorizer
# ============================================================
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
model = None
vectorizer = None


def load_model():
    """Load the trained model and vectorizer from disk."""
    global model, vectorizer
    
    model_path = os.path.join(MODEL_DIR, "fake_review_model.joblib")
    vectorizer_path = os.path.join(MODEL_DIR, "tfidf_vectorizer.joblib")
    
    if not os.path.exists(model_path) or not os.path.exists(vectorizer_path):
        print("⚠️  Model files not found. Training model first...")
        from train_model import train_model
        model, vectorizer, _ = train_model()
    else:
        model = joblib.load(model_path)
        vectorizer = joblib.load(vectorizer_path)
        print("✅ Model and vectorizer loaded successfully!")


def preprocess_text(text):
    """
    Preprocess review text for prediction.
    Must match the preprocessing used during training.
    """
    if not isinstance(text, str):
        return ""
    
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    
    words = text.split()
    words = [stemmer.stem(word) for word in words if word not in stop_words]
    
    return ' '.join(words)


def analyze_sentiment(text):
    """
    Perform sentiment analysis using TextBlob.
    
    Returns:
        dict with polarity (-1 to 1) and subjectivity (0 to 1)
    """
    blob = TextBlob(text)
    return {
        "polarity": round(blob.sentiment.polarity, 3),
        "subjectivity": round(blob.sentiment.subjectivity, 3),
        "sentiment": "positive" if blob.sentiment.polarity > 0.1 
                     else "negative" if blob.sentiment.polarity < -0.1 
                     else "neutral"
    }


def detect_suspicious_patterns(text):
    """
    Detect suspicious patterns commonly found in fake reviews.
    
    Returns:
        dict with suspicion indicators
    """
    indicators = {
        "excessive_caps": len(re.findall(r'[A-Z]{3,}', text)) > 2,
        "excessive_exclamation": text.count('!') > 3,
        "repetitive_superlatives": bool(re.search(
            r'\b(best|amazing|perfect|incredible|fantastic|phenomenal)\b.*\b(best|amazing|perfect|incredible|fantastic|phenomenal)\b',
            text.lower()
        )),
        "urgency_language": bool(re.search(
            r'\b(buy now|must have|don\'t hesitate|hurry|limited time)\b',
            text.lower()
        )),
        "vague_description": len(text.split()) < 10,
        "no_specific_details": not bool(re.search(
            r'\b(\d+\s*(hours?|days?|weeks?|months?|years?|GB|MB|inches?|lbs?|kg))\b',
            text
        )),
    }
    
    suspicion_score = sum(indicators.values()) / len(indicators)
    indicators["suspicion_score"] = round(suspicion_score, 3)
    
    return indicators


# ============================================================
# API Routes
# ============================================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "service": "Fake Review Detection ML API"
    })


@app.route('/model/info', methods=['GET'])
def model_info():
    """Get information about the loaded model."""
    if model is None:
        return jsonify({"error": "Model not loaded"}), 503
    
    return jsonify({
        "model_type": type(model).__name__,
        "vectorizer_type": type(vectorizer).__name__,
        "n_features": vectorizer.max_features if hasattr(vectorizer, 'max_features') else None,
        "classes": model.classes_.tolist(),
        "status": "ready"
    })


@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict if a review is fake or genuine.
    
    Request body:
        { "text": "review text here" }
    
    Response:
        {
            "prediction": "Fake" or "Genuine",
            "confidence": 0.87,
            "sentiment": { ... },
            "suspicious_patterns": { ... }
        }
    """
    if model is None:
        return jsonify({"error": "Model not loaded"}), 503
    
    data = request.get_json()
    
    if not data or 'text' not in data:
        return jsonify({"error": "Missing 'text' field in request body"}), 400
    
    review_text = data['text']
    
    if not review_text or len(review_text.strip()) == 0:
        return jsonify({"error": "Review text cannot be empty"}), 400
    
    # Preprocess the text
    processed_text = preprocess_text(review_text)
    
    # Vectorize
    text_vector = vectorizer.transform([processed_text])
    
    # Predict
    prediction = model.predict(text_vector)[0]
    probabilities = model.predict_proba(text_vector)[0]
    confidence = float(max(probabilities))
    
    # Sentiment analysis (bonus feature)
    sentiment = analyze_sentiment(review_text)
    
    # Suspicious pattern detection (bonus feature)
    patterns = detect_suspicious_patterns(review_text)
    
    result = {
        "prediction": "Fake" if prediction == 1 else "Genuine",
        "confidence": round(confidence, 4),
        "probabilities": {
            "genuine": round(float(probabilities[0]), 4),
            "fake": round(float(probabilities[1]), 4)
        },
        "sentiment": sentiment,
        "suspicious_patterns": patterns
    }
    
    return jsonify(result)


@app.route('/predict/batch', methods=['POST'])
def predict_batch():
    """
    Batch prediction for multiple reviews.
    
    Request body:
        { "reviews": ["review 1", "review 2", ...] }
    
    Response:
        { "predictions": [ ... ] }
    """
    if model is None:
        return jsonify({"error": "Model not loaded"}), 503
    
    data = request.get_json()
    
    if not data or 'reviews' not in data:
        return jsonify({"error": "Missing 'reviews' field"}), 400
    
    reviews = data['reviews']
    
    if not isinstance(reviews, list) or len(reviews) == 0:
        return jsonify({"error": "Reviews must be a non-empty array"}), 400
    
    # Limit batch size
    if len(reviews) > 100:
        return jsonify({"error": "Maximum batch size is 100 reviews"}), 400
    
    predictions = []
    for review_text in reviews:
        if not isinstance(review_text, str) or len(review_text.strip()) == 0:
            predictions.append({"error": "Invalid review text"})
            continue
        
        processed = preprocess_text(review_text)
        vectorized = vectorizer.transform([processed])
        pred = model.predict(vectorized)[0]
        probs = model.predict_proba(vectorized)[0]
        sentiment = analyze_sentiment(review_text)
        
        predictions.append({
            "text": review_text[:100] + "..." if len(review_text) > 100 else review_text,
            "prediction": "Fake" if pred == 1 else "Genuine",
            "confidence": round(float(max(probs)), 4),
            "sentiment": sentiment
        })
    
    return jsonify({
        "predictions": predictions,
        "total": len(predictions)
    })


# ============================================================
# Run the Flask app
# ============================================================
if __name__ == '__main__':
    print("=" * 60)
    print("🚀 Fake Review Detection ML API")
    print("=" * 60)
    
    # Load model on startup
    load_model()
    
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    print(f"\n📡 Server starting on port {port}")
    print(f"   Health: http://localhost:{port}/health")
    print(f"   Predict: http://localhost:{port}/predict")
    print(f"   Batch: http://localhost:{port}/predict/batch")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
