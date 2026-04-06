/**
 * Review Controller
 * 
 * Handles review CRUD operations, ML prediction integration,
 * trust score calculation, and dashboard statistics.
 */
const axios = require('axios');
const Review = require('../models/Review');
const Product = require('../models/Product');

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5001';

/**
 * @route   POST /api/review/add
 * @desc    Submit a new product review and get ML prediction
 * @access  Private
 */
const addReview = async (req, res) => {
  try {
    const { productId, productName, reviewText, rating } = req.body;

    if (!productId || !productName || !reviewText || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Please provide productId, productName, reviewText, and rating'
      });
    }

    if (reviewText.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Review must be at least 10 characters long'
      });
    }

    // ============================================================
    // Call ML API for prediction
    // ============================================================
    let predictionData = {
      label: 'Pending',
      confidence: 0,
      probabilities: { genuine: 0, fake: 0 }
    };
    let sentimentData = { polarity: 0, subjectivity: 0, sentiment: 'neutral' };
    let patternsData = {};

    try {
      const mlResponse = await axios.post(`${ML_API_URL}/predict`, {
        text: reviewText
      }, { timeout: 10000 });

      if (mlResponse.data) {
        predictionData = {
          label: mlResponse.data.prediction,
          confidence: mlResponse.data.confidence,
          probabilities: mlResponse.data.probabilities || { genuine: 0, fake: 0 }
        };
        sentimentData = mlResponse.data.sentiment || sentimentData;
        patternsData = mlResponse.data.suspicious_patterns || {};
      }
    } catch (mlError) {
      console.warn('⚠️  ML API unavailable, saving review without prediction:', mlError.message);
    }

    // ============================================================
    // Save the review
    // ============================================================
    const review = await Review.create({
      user: req.user.id,
      productId,
      productName,
      reviewText,
      rating,
      prediction: predictionData,
      sentiment: sentimentData,
      suspiciousPatterns: patternsData
    });

    // ============================================================
    // Update product trust score
    // ============================================================
    await updateProductTrustScore(productId, productName);

    // Populate user info before sending response
    await review.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Review submitted and analyzed successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding review'
    });
  }
};

/**
 * @route   GET /api/review/:productId
 * @desc    Get all reviews for a product
 * @access  Private
 */
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    // Get product trust score
    const product = await Product.findOne({ productId });

    res.status(200).json({
      success: true,
      data: {
        reviews,
        product: product || null,
        total: reviews.length
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
};

/**
 * @route   GET /api/review/all/reviews
 * @desc    Get all reviews across all products
 * @access  Private
 */
const getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
};

/**
 * @route   GET /api/review/dashboard/stats
 * @desc    Get dashboard statistics
 * @access  Private
 */
const getDashboardStats = async (req, res) => {
  try {
    // Total reviews
    const totalReviews = await Review.countDocuments();

    // Fake vs Genuine counts
    const fakeCount = await Review.countDocuments({ 'prediction.label': 'Fake' });
    const genuineCount = await Review.countDocuments({ 'prediction.label': 'Genuine' });
    const pendingCount = await Review.countDocuments({ 'prediction.label': 'Pending' });

    // Average confidence score
    const confidenceAgg = await Review.aggregate([
      { $match: { 'prediction.label': { $ne: 'Pending' } } },
      { $group: { _id: null, avgConfidence: { $avg: '$prediction.confidence' } } }
    ]);
    const avgConfidence = confidenceAgg.length > 0 ? confidenceAgg[0].avgConfidence : 0;

    // Product trust scores
    const products = await Product.find().sort({ trustScore: 1 }).limit(10);

    // Reviews over time (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const reviewsByDay = await Review.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: 1 },
          fake: {
            $sum: { $cond: [{ $eq: ['$prediction.label', 'Fake'] }, 1, 0] }
          },
          genuine: {
            $sum: { $cond: [{ $eq: ['$prediction.label', 'Genuine'] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Sentiment distribution
    const sentimentDist = await Review.aggregate([
      {
        $group: {
          _id: '$sentiment.sentiment',
          count: { $sum: 1 }
        }
      }
    ]);

    // Rating distribution
    const ratingDist = await Review.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Recent reviews
    const recentReviews = await Review.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalReviews,
        fakeCount,
        genuineCount,
        pendingCount,
        avgConfidence: Math.round(avgConfidence * 100) / 100,
        fakePercentage: totalReviews > 0 ? Math.round((fakeCount / totalReviews) * 100) : 0,
        genuinePercentage: totalReviews > 0 ? Math.round((genuineCount / totalReviews) * 100) : 0,
        products,
        reviewsByDay,
        sentimentDistribution: sentimentDist,
        ratingDistribution: ratingDist,
        recentReviews
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard stats'
    });
  }
};

/**
 * @route   GET /api/review/products/all
 * @desc    Get all products with trust scores
 * @access  Private
 */
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ lastUpdated: -1 });

    res.status(200).json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
};

/**
 * @route   DELETE /api/review/:reviewId
 * @desc    Delete a review (admin only)
 * @access  Private/Admin
 */
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Only admin or review owner can delete
    if (req.user.role !== 'admin' && review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const productId = review.productId;
    const productName = review.productName;
    
    await review.deleteOne();

    // Update product trust score
    await updateProductTrustScore(productId, productName);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting review'
    });
  }
};

/**
 * Helper: Update product trust score after review changes.
 */
async function updateProductTrustScore(productId, productName) {
  try {
    const reviews = await Review.find({ productId });
    
    const totalReviews = reviews.length;
    const genuineReviews = reviews.filter(r => r.prediction.label === 'Genuine').length;
    const fakeReviews = reviews.filter(r => r.prediction.label === 'Fake').length;
    
    const avgRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;
    
    const avgSentiment = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + (r.sentiment?.polarity || 0), 0) / totalReviews
      : 0;

    const trustScore = totalReviews > 0
      ? Math.round((genuineReviews / totalReviews) * 100)
      : 100;

    await Product.findOneAndUpdate(
      { productId },
      {
        productId,
        productName,
        trustScore,
        totalReviews,
        genuineReviews,
        fakeReviews,
        averageRating: Math.round(avgRating * 10) / 10,
        averageSentiment: Math.round(avgSentiment * 1000) / 1000,
        lastUpdated: Date.now()
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Update trust score error:', error);
  }
}

module.exports = {
  addReview,
  getProductReviews,
  getAllReviews,
  getDashboardStats,
  getAllProducts,
  deleteReview
};
