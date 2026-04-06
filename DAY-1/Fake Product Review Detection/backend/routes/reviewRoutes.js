/**
 * Review Routes
 * 
 * POST   /api/review/add            - Submit a new review
 * GET    /api/review/dashboard/stats - Get dashboard statistics
 * GET    /api/review/products/all    - Get all products with trust scores
 * GET    /api/review/all/reviews     - Get all reviews (paginated)
 * GET    /api/review/:productId      - Get reviews for a specific product
 * DELETE /api/review/:reviewId       - Delete a review
 */
const express = require('express');
const {
  addReview,
  getProductReviews,
  getAllReviews,
  getDashboardStats,
  getAllProducts,
  deleteReview
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All review routes require authentication
router.use(protect);

// Dashboard stats
router.get('/dashboard/stats', getDashboardStats);

// Get all products with trust scores
router.get('/products/all', getAllProducts);

// Get all reviews (paginated)
router.get('/all/reviews', getAllReviews);

// Submit a new review
router.post('/add', addReview);

// Get reviews for a specific product
router.get('/:productId', getProductReviews);

// Delete a review
router.delete('/:reviewId', deleteReview);

module.exports = router;
