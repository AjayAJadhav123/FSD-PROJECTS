/**
 * Express Server - Fake Product Review Detection Backend
 * 
 * Main entry point for the Node.js backend API.
 * Connects to MongoDB, configures middleware, and registers routes.
 */
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ============================================================
// Connect to MongoDB
// ============================================================
connectDB();

// ============================================================
// Security Middleware
// ============================================================
app.use(helmet());

// Rate limiting - 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { 
    success: false, 
    message: 'Too many requests, please try again later' 
  }
});
app.use('/api/', limiter);

// ============================================================
// General Middleware
// ============================================================
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ============================================================
// API Routes
// ============================================================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/review', require('./routes/reviewRoutes'));
app.use('/api/predict', require('./routes/predictRoutes'));

// ============================================================
// Health Check
// ============================================================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Fake Review Detection API is running',
    timestamp: new Date().toISOString()
  });
});

// ============================================================
// Error Handling Middleware
// ============================================================
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// ============================================================
// Start Server
// ============================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║  🚀 Fake Review Detection API Server            ║
║  📡 Port: ${PORT}                                  ║
║  🌍 Environment: ${process.env.NODE_ENV || 'development'}                  ║
║  📊 API: http://localhost:${PORT}/api               ║
╚══════════════════════════════════════════════════╝
  `);
});

module.exports = app;
