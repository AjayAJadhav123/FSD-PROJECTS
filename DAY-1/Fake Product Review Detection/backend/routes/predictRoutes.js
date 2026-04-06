/**
 * Predict Routes
 * 
 * POST /api/predict - Direct proxy to ML model prediction
 */
const express = require('express');
const axios = require('axios');
const { protect } = require('../middleware/auth');

const router = express.Router();

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5001';

/**
 * @route   POST /api/predict
 * @desc    Send review text to ML model and get prediction
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide review text'
      });
    }

    // Call ML API
    const mlResponse = await axios.post(`${ML_API_URL}/predict`, {
      text
    }, { timeout: 15000 });

    res.status(200).json({
      success: true,
      data: mlResponse.data
    });
  } catch (error) {
    console.error('ML Prediction error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'ML service is unavailable. Please ensure the ML API is running.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error getting prediction from ML service'
    });
  }
});

/**
 * @route   GET /api/predict/health
 * @desc    Check ML service health
 * @access  Private
 */
router.get('/health', protect, async (req, res) => {
  try {
    const mlResponse = await axios.get(`${ML_API_URL}/health`, { timeout: 5000 });
    res.status(200).json({
      success: true,
      data: mlResponse.data
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'ML service is unavailable'
    });
  }
});

module.exports = router;
