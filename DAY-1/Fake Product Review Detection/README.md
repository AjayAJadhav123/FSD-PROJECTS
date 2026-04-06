# 🛡️ ReviewGuard – Fake Product Review Detection System

A full-stack AI-powered web application that detects fake product reviews using NLP and Machine Learning, and assigns a **trust score** (0–100%) to products based on review authenticity.

---

## 🎯 Features

| Feature | Details |
|---|---|
| 🔐 **User Authentication** | JWT + bcrypt, role-based (user/admin) |
| 📝 **Review Submission** | Submit reviews for any product |
| 🤖 **ML Detection** | TF-IDF + Logistic Regression via Python/Flask API |
| 💯 **Trust Score** | 0–100% score per product based on genuine review ratio |
| 📊 **Admin Dashboard** | Charts (Chart.js), statistics, fake vs genuine breakdown |
| 😊 **Sentiment Analysis** | Polarity & subjectivity via TextBlob |
| 🔍 **Pattern Detection** | Detects excessive caps, exclamation, urgency language |
| 📱 **Responsive UI** | Dark-themed, glassmorphism, React + Tailwind CSS |

---

## 🛠️ Tech Stack

```
Frontend:   React 19 + Vite + Tailwind CSS v4 + Chart.js
Backend:    Node.js + Express.js + MongoDB + Mongoose
ML API:     Python 3.9+ + Flask + Scikit-learn + NLTK + TextBlob
Auth:       JWT + bcrypt
```

---

## 📁 Project Structure

```
Fake Product Review Detection/
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx          # Sidebar layout
│   │   │   ├── LoadingSpinner.jsx  # Loading indicator
│   │   │   ├── ProtectedRoute.jsx  # Auth guard
│   │   │   ├── StarRating.jsx      # Star rating input
│   │   │   └── TrustScoreGauge.jsx # SVG trust gauge
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Auth state management
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── Register.jsx        # Register page
│   │   │   ├── Dashboard.jsx       # Admin dashboard
│   │   │   ├── AddReview.jsx       # Review submission
│   │   │   ├── ProductReviews.jsx  # Per-product reviews
│   │   │   └── AllReviews.jsx      # All reviews list
│   │   └── utils/
│   │       └── api.js              # Axios API client
│   ├── .env
│   └── vite.config.js
│
├── backend/                     # Node.js API
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js       # Register/Login/Me
│   │   └── reviewController.js     # Review CRUD + stats
│   ├── middleware/
│   │   └── auth.js                 # JWT middleware
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   ├── Review.js               # Review schema
│   │   └── Product.js              # Product trust schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── predictRoutes.js
│   ├── .env
│   └── server.js
│
└── ml-model/                    # Python ML service
    ├── data/
    │   └── reviews_dataset.csv     # Training data
    ├── models/
    │   ├── fake_review_model.joblib # Trained model
    │   └── tfidf_vectorizer.joblib  # Vectorizer
    ├── generate_dataset.py         # Dataset generator
    ├── train_model.py              # Model training
    ├── app.py                      # Flask API
    └── requirements.txt
```

---

## 🚀 Setup & Installation

### Prerequisites

- **Node.js** v18+ and npm
- **Python** 3.9+
- **MongoDB** (local or Atlas)

---

### Step 1: ML Model Setup

```bash
cd ml-model

# Create & activate virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Generate dataset & train model (auto-runs if model missing)
python train_model.py

# Start the Flask ML API
python app.py
# → Runs on http://localhost:5001
```

> **Note:** The Flask server auto-trains the model if no saved model is found.

---

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
# Edit .env and set your MongoDB URI:
# MONGO_URI=mongodb://localhost:27017/fake-review-detection

# Start development server
npm run dev
# → Runs on http://localhost:5000
```

---

### Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies (already done by Vite setup)
npm install

# Start development server
npm run dev
# → Runs on http://localhost:5173
```

---

## 🔗 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login, receive JWT | Public |  
| GET | `/api/auth/me` | Get current user | ✅ Required |

### Reviews

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/review/add` | Submit + analyze review | ✅ Required |
| GET | `/api/review/:productId` | Get product reviews | ✅ Required |
| GET | `/api/review/all/reviews` | All reviews (paginated) | ✅ Required |
| GET | `/api/review/dashboard/stats` | Dashboard stats | ✅ Required |
| GET | `/api/review/products/all` | All product trust scores | ✅ Required |
| DELETE | `/api/review/:reviewId` | Delete review | ✅ Required |

### ML Prediction

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/predict` | Analyze review text | ✅ Required |
| GET | `/api/predict/health` | ML service health | ✅ Required |

### ML API (Flask – port 5001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict` | Single review prediction |
| POST | `/predict/batch` | Batch prediction |
| GET | `/health` | Health check |
| GET | `/model/info` | Model information |

---

## 🧠 ML Model Details

- **Algorithm:** Logistic Regression with TF-IDF features
- **Preprocessing:** Lowercase → remove special chars → remove stopwords → Porter stemming
- **Vectorizer:** TF-IDF (5000 features, unigrams + bigrams)
- **Training Data:** 2000 synthetic reviews (50% genuine, 50% fake)
- **Bonus:** Sentiment analysis (TextBlob) + suspicious pattern detection

### ML API Response Format

```json
{
  "prediction": "Fake",
  "confidence": 0.9234,
  "probabilities": {
    "genuine": 0.0766,
    "fake": 0.9234
  },
  "sentiment": {
    "polarity": 0.85,
    "subjectivity": 0.95,
    "sentiment": "positive"
  },
  "suspicious_patterns": {
    "excessive_caps": true,
    "excessive_exclamation": true,
    "repetitive_superlatives": false,
    "urgency_language": false,
    "vague_description": false,
    "suspicion_score": 0.4
  }
}
```

---

## 🎨 Pages & Screenshots

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | JWT auth, dark glassmorphism UI |
| Register | `/register` | Create account |
| Dashboard | `/dashboard` | Stats + charts + recent reviews |
| Add Review | `/add-review` | Submit review + see live prediction |
| Product Reviews | `/reviews/:productId` | All reviews for a product + trust score |
| All Reviews | `/all-reviews` | Full paginated review list with search/filter |

---

## 💯 Trust Score Formula

```
Trust Score = (Genuine Reviews / Total Reviews) × 100

Example:
  8 genuine, 2 fake → Trust Score = 80%
  3 genuine, 7 fake → Trust Score = 30%
```

---

## 🔒 Default Admin Account

Register normally and update the `role` field in MongoDB to `"admin"` to get admin access:

```js
// In MongoDB shell / Compass:
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

---

## 🌐 Deployment

| Service | Platform |
|---------|----------|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) or [Railway](https://railway.app) |
| ML API | [Render](https://render.com) |
| Database | [MongoDB Atlas](https://www.mongodb.com/atlas) |

Update `.env` files with production URLs before deployment.

---

## 📦 Dependencies

### Backend
```
express, mongoose, jsonwebtoken, bcryptjs, axios,
cors, helmet, morgan, express-rate-limit, express-validator
```

### Frontend
```
react, react-router-dom, axios, chart.js, react-chartjs-2,
react-icons, react-hot-toast, tailwindcss
```

### ML
```
flask, flask-cors, scikit-learn, pandas, numpy,
nltk, joblib, textblob, gunicorn, python-dotenv
```

---

## 🏗️ Built With

- **React 19** + Vite 8
- **Tailwind CSS v4** (new @theme API)
- **Chart.js** for visualizations
- **Scikit-learn** TF-IDF + Logistic Regression
- **TextBlob** for sentiment analysis
- **JWT** stateless authentication
- **MongoDB** with Mongoose ODM

---

*Made with ❤️ as a Full Stack + ML capstone project.*
