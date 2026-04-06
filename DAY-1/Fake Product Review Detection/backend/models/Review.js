/**
 * Review Model - MongoDB Schema for product reviews.
 * 
 * Stores review text, ML prediction results, sentiment analysis,
 * and links to user and product.
 */
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: String,
    required: [true, 'Please provide a product ID'],
    trim: true,
    index: true
  },
  productName: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true
  },
  reviewText: {
    type: String,
    required: [true, 'Please provide review text'],
    minlength: [10, 'Review must be at least 10 characters'],
    maxlength: [2000, 'Review cannot exceed 2000 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  // ML Prediction Results
  prediction: {
    label: {
      type: String,
      enum: ['Fake', 'Genuine', 'Pending'],
      default: 'Pending'
    },
    confidence: {
      type: Number,
      default: 0,
      min: 0,
      max: 1
    },
    probabilities: {
      genuine: { type: Number, default: 0 },
      fake: { type: Number, default: 0 }
    }
  },
  // Sentiment Analysis Results
  sentiment: {
    polarity: { type: Number, default: 0 },
    subjectivity: { type: Number, default: 0 },
    sentiment: { type: String, default: 'neutral' }
  },
  // Suspicious Pattern Indicators
  suspiciousPatterns: {
    excessive_caps: { type: Boolean, default: false },
    excessive_exclamation: { type: Boolean, default: false },
    repetitive_superlatives: { type: Boolean, default: false },
    urgency_language: { type: Boolean, default: false },
    vague_description: { type: Boolean, default: false },
    suspicion_score: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient product queries
reviewSchema.index({ productId: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
