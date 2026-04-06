/**
 * Product Model - MongoDB Schema for product trust scores.
 * 
 * Aggregates review data to calculate trust scores for products.
 */
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    default: 'General',
    trim: true
  },
  // Trust Score Metrics
  trustScore: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  genuineReviews: {
    type: Number,
    default: 0
  },
  fakeReviews: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  averageSentiment: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Recalculate trust score based on review statistics.
 * Trust Score = (genuineReviews / totalReviews) * 100
 */
productSchema.methods.calculateTrustScore = function() {
  if (this.totalReviews === 0) {
    this.trustScore = 100;
    return;
  }
  
  this.trustScore = Math.round((this.genuineReviews / this.totalReviews) * 100);
  this.lastUpdated = Date.now();
};

module.exports = mongoose.model('Product', productSchema);
