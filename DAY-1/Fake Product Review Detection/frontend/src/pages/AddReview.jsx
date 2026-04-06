/**
 * Add Review Page.
 * Submit a new product review for ML analysis.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import StarRating from '../components/StarRating';
import TrustScoreGauge from '../components/TrustScoreGauge';
import {
  HiOutlinePaperAirplane,
  HiOutlineShieldCheck,
  HiOutlineExclamationTriangle,
  HiOutlineBeaker,
  HiOutlineSparkles,
} from 'react-icons/hi2';

const AddReview = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    reviewText: '',
    rating: 0,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productId || !formData.productName || !formData.reviewText || !formData.rating) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.reviewText.length < 10) {
      toast.error('Review must be at least 10 characters');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await api.post('/review/add', formData);
      const review = response.data.data.review;
      
      setResult({
        prediction: review.prediction,
        sentiment: review.sentiment,
        suspiciousPatterns: review.suspiciousPatterns,
      });

      toast.success('Review submitted and analyzed!');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to submit review';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ productId: '', productName: '', reviewText: '', rating: 0 });
    setResult(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-100">Add Review</h1>
        <p className="text-dark-400 mt-1">Submit a product review for fake detection analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ============================================================
            Review Form
            ============================================================ */}
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-500/15 flex items-center justify-center">
              <HiOutlineBeaker className="text-xl text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-dark-100">Review Details</h2>
              <p className="text-xs text-dark-500">Fill in the product review information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Product ID</label>
                <input
                  id="product-id"
                  name="productId"
                  type="text"
                  value={formData.productId}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., PROD-001"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Product Name</label>
                <input
                  id="product-name"
                  name="productName"
                  type="text"
                  value={formData.productName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Wireless Headphones"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Rating</label>
              <StarRating
                rating={formData.rating}
                onRate={(r) => setFormData({ ...formData, rating: r })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Review Text
                <span className="text-dark-500 font-normal ml-2">
                  ({formData.reviewText.length}/2000)
                </span>
              </label>
              <textarea
                id="review-text"
                name="reviewText"
                value={formData.reviewText}
                onChange={handleChange}
                className="input-field h-40 resize-none"
                placeholder="Write your product review here... The ML model will analyze it for authenticity."
                maxLength={2000}
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                id="submit-review"
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <HiOutlinePaperAirplane className="text-lg" />
                    <span>Submit & Analyze</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-3 rounded-xl border border-dark-700 text-dark-400 hover:text-dark-200 hover:border-dark-500 transition-all font-medium"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* ============================================================
            Analysis Results
            ============================================================ */}
        <div className="space-y-6">
          {result ? (
            <>
              {/* Prediction Result */}
              <div className={`glass-card p-8 ${
                result.prediction?.label === 'Genuine' 
                  ? 'border-accent-500/30' 
                  : result.prediction?.label === 'Fake' 
                  ? 'border-danger-500/30' 
                  : ''
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    {result.prediction?.label === 'Genuine' ? (
                      <div className="w-12 h-12 rounded-xl bg-accent-500/15 flex items-center justify-center">
                        <HiOutlineShieldCheck className="text-2xl text-accent-400" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-danger-500/15 flex items-center justify-center">
                        <HiOutlineExclamationTriangle className="text-2xl text-danger-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-dark-100">ML Prediction</h3>
                      <p className="text-xs text-dark-500">Analysis complete</p>
                    </div>
                  </div>
                  <span className={
                    result.prediction?.label === 'Genuine' ? 'badge-genuine text-base px-4 py-1' : 'badge-fake text-base px-4 py-1'
                  }>
                    {result.prediction?.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-dark-800/40">
                    <p className="text-xs text-dark-500 mb-1">Confidence Score</p>
                    <p className="text-2xl font-bold text-dark-100">
                      {(result.prediction?.confidence * 100).toFixed(1)}%
                    </p>
                    <div className="mt-2 h-2 bg-dark-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          result.prediction?.label === 'Genuine' ? 'bg-accent-500' : 'bg-danger-500'
                        }`}
                        style={{ width: `${result.prediction?.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-dark-800/40">
                    <p className="text-xs text-dark-500 mb-1">Probabilities</p>
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-accent-400">Genuine</span>
                        <span className="text-dark-300">{((result.prediction?.probabilities?.genuine || 0) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-danger-400">Fake</span>
                        <span className="text-dark-300">{((result.prediction?.probabilities?.fake || 0) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sentiment Analysis */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <HiOutlineSparkles className="text-xl text-warning-400" />
                  <h3 className="text-lg font-semibold text-dark-100">Sentiment Analysis</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-dark-800/40 text-center">
                    <p className="text-xs text-dark-500 mb-1">Sentiment</p>
                    <p className={`text-sm font-bold capitalize ${
                      result.sentiment?.sentiment === 'positive' ? 'text-accent-400' :
                      result.sentiment?.sentiment === 'negative' ? 'text-danger-400' : 'text-dark-400'
                    }`}>
                      {result.sentiment?.sentiment || 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-dark-800/40 text-center">
                    <p className="text-xs text-dark-500 mb-1">Polarity</p>
                    <p className="text-sm font-bold text-dark-200">{result.sentiment?.polarity?.toFixed(3) || 0}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-dark-800/40 text-center">
                    <p className="text-xs text-dark-500 mb-1">Subjectivity</p>
                    <p className="text-sm font-bold text-dark-200">{result.sentiment?.subjectivity?.toFixed(3) || 0}</p>
                  </div>
                </div>
              </div>

              {/* Suspicious Patterns */}
              {result.suspiciousPatterns && (
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold text-dark-100 mb-4">Suspicious Pattern Indicators</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'excessive_caps', label: 'Excessive Capitals' },
                      { key: 'excessive_exclamation', label: 'Excessive Exclamation' },
                      { key: 'repetitive_superlatives', label: 'Repetitive Superlatives' },
                      { key: 'urgency_language', label: 'Urgency Language' },
                      { key: 'vague_description', label: 'Vague Description' },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-2 p-2 rounded-lg bg-dark-800/30">
                        <div className={`w-2 h-2 rounded-full ${
                          result.suspiciousPatterns[key] ? 'bg-danger-400' : 'bg-accent-400'
                        }`}></div>
                        <span className="text-xs text-dark-300">{label}</span>
                        <span className={`ml-auto text-xs font-semibold ${
                          result.suspiciousPatterns[key] ? 'text-danger-400' : 'text-accent-400'
                        }`}>
                          {result.suspiciousPatterns[key] ? 'Detected' : 'Clear'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-3 rounded-xl bg-dark-800/40 text-center">
                    <p className="text-xs text-dark-500 mb-1">Overall Suspicion Score</p>
                    <p className="text-lg font-bold text-dark-100">
                      {((result.suspiciousPatterns?.suspicion_score || 0) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate(`/reviews/${formData.productId}`)}
                className="w-full py-3 rounded-xl border border-primary-500/30 text-primary-400 hover:bg-primary-500/10 transition-all font-medium"
              >
                View All Reviews for This Product →
              </button>
            </>
          ) : (
            /* Placeholder when no result */
            <div className="glass-card p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
              <div className="w-20 h-20 rounded-2xl bg-dark-800/50 flex items-center justify-center mb-6">
                <HiOutlineBeaker className="text-4xl text-dark-600" />
              </div>
              <h3 className="text-xl font-semibold text-dark-300 mb-2">Analysis Results</h3>
              <p className="text-dark-500 max-w-sm">
                Submit a review to see the ML model's prediction, sentiment analysis, and suspicious pattern detection results here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddReview;
