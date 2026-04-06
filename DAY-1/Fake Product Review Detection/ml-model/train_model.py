"""
Train the Fake Review Detection ML Model.

This script:
1. Loads the review dataset
2. Preprocesses text (lowercase, stopwords removal, stemming)
3. Applies TF-IDF vectorization
4. Trains a Logistic Regression model
5. Evaluates performance metrics
6. Saves model artifacts using joblib
"""

import os
import re
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

# Download required NLTK data
nltk.download('stopwords', quiet=True)
nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)

# Initialize stemmer and stopwords
stemmer = PorterStemmer()
stop_words = set(stopwords.words('english'))


def preprocess_text(text):
    """
    Preprocess review text for ML model input.
    
    Steps:
    1. Convert to lowercase
    2. Remove special characters and numbers
    3. Remove extra whitespace
    4. Remove stopwords
    5. Apply stemming
    
    Args:
        text: Raw review text string
    
    Returns:
        Preprocessed text string
    """
    if not isinstance(text, str):
        return ""
    
    # Lowercase
    text = text.lower()
    
    # Remove special characters, keeping only letters and spaces
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Tokenize, remove stopwords, and stem
    words = text.split()
    words = [stemmer.stem(word) for word in words if word not in stop_words]
    
    return ' '.join(words)


def train_model():
    """
    Train the fake review detection model end-to-end.
    
    Returns:
        tuple: (model, vectorizer, accuracy)
    """
    # ============================================================
    # 1. Load Dataset
    # ============================================================
    data_path = os.path.join(os.path.dirname(__file__), "data", "reviews_dataset.csv")
    
    if not os.path.exists(data_path):
        print("⚠️  Dataset not found. Generating dataset first...")
        from generate_dataset import generate_dataset
        dataset = generate_dataset(2000)
        os.makedirs(os.path.dirname(data_path), exist_ok=True)
        dataset.to_csv(data_path, index=False)
        print("✅ Dataset generated!")
    
    df = pd.read_csv(data_path)
    print(f"📊 Dataset loaded: {len(df)} samples")
    print(f"   - Genuine (0): {len(df[df['label'] == 0])}")
    print(f"   - Fake (1): {len(df[df['label'] == 1])}")
    
    # ============================================================
    # 2. Preprocess Text
    # ============================================================
    print("\n🔄 Preprocessing text...")
    df['processed_text'] = df['text'].apply(preprocess_text)
    
    # Remove any empty rows after preprocessing
    df = df[df['processed_text'].str.len() > 0]
    
    X = df['processed_text']
    y = df['label']
    
    # ============================================================
    # 3. Split Data
    # ============================================================
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"\n📐 Train/Test split:")
    print(f"   - Training samples: {len(X_train)}")
    print(f"   - Testing samples: {len(X_test)}")
    
    # ============================================================
    # 4. TF-IDF Vectorization
    # ============================================================
    print("\n🔄 Applying TF-IDF vectorization...")
    tfidf_vectorizer = TfidfVectorizer(
        max_features=5000,      # Top 5000 features
        ngram_range=(1, 2),     # Unigrams and bigrams
        min_df=2,               # Minimum document frequency
        max_df=0.95,            # Maximum document frequency
        sublinear_tf=True       # Apply sublinear TF scaling
    )
    
    X_train_tfidf = tfidf_vectorizer.fit_transform(X_train)
    X_test_tfidf = tfidf_vectorizer.transform(X_test)
    
    print(f"   - Feature matrix shape: {X_train_tfidf.shape}")
    
    # ============================================================
    # 5. Train Logistic Regression Model
    # ============================================================
    print("\n🧠 Training Logistic Regression model...")
    model = LogisticRegression(
        max_iter=1000,
        C=1.0,
        solver='lbfgs',
        class_weight='balanced',  # Handle class imbalance
        random_state=42
    )
    model.fit(X_train_tfidf, y_train)
    
    # ============================================================
    # 6. Evaluate Model
    # ============================================================
    y_pred = model.predict(X_test_tfidf)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\n📈 Model Evaluation:")
    print(f"   Accuracy: {accuracy:.4f}")
    print(f"\n   Classification Report:")
    print(classification_report(y_test, y_pred, target_names=['Genuine', 'Fake']))
    
    cm = confusion_matrix(y_test, y_pred)
    print(f"   Confusion Matrix:")
    print(f"   {cm}")
    
    # ============================================================
    # 7. Save Model Artifacts
    # ============================================================
    models_dir = os.path.join(os.path.dirname(__file__), "models")
    os.makedirs(models_dir, exist_ok=True)
    
    model_path = os.path.join(models_dir, "fake_review_model.joblib")
    vectorizer_path = os.path.join(models_dir, "tfidf_vectorizer.joblib")
    
    joblib.dump(model, model_path)
    joblib.dump(tfidf_vectorizer, vectorizer_path)
    
    print(f"\n💾 Model saved to: {model_path}")
    print(f"💾 Vectorizer saved to: {vectorizer_path}")
    
    return model, tfidf_vectorizer, accuracy


if __name__ == "__main__":
    print("=" * 60)
    print("🚀 Fake Review Detection - Model Training")
    print("=" * 60)
    
    model, vectorizer, accuracy = train_model()
    
    # ============================================================
    # Quick Test with sample reviews
    # ============================================================
    print("\n" + "=" * 60)
    print("🧪 Quick Test with Sample Reviews")
    print("=" * 60)
    
    test_reviews = [
        "I bought this laptop and it works great. Battery lasts about 8 hours. The keyboard is comfortable for typing.",
        "AMAZING PRODUCT!!! BEST THING EVER!!! BUY IT NOW!!! YOU WON'T REGRET IT!!! PERFECT!!!",
        "Decent headphones for the price. Sound quality is good but the ear cushions could be more comfortable.",
        "THIS IS THE MOST INCREDIBLE PRODUCT IN THE WORLD!!! I BOUGHT 10 OF THEM!!! ABSOLUTELY PHENOMENAL!!!",
        "After using this camera for 3 months, I'm satisfied. Image quality is sharp and the autofocus is reliable.",
    ]
    
    for review in test_reviews:
        processed = preprocess_text(review)
        vectorized = vectorizer.transform([processed])
        prediction = model.predict(vectorized)[0]
        probability = model.predict_proba(vectorized)[0]
        confidence = max(probability)
        label = "Fake" if prediction == 1 else "Genuine"
        
        print(f"\n📝 Review: \"{review[:80]}...\"")
        print(f"   ➡️  Prediction: {label} (Confidence: {confidence:.2f})")
    
    print(f"\n✅ Model training complete! Accuracy: {accuracy:.4f}")
