/**
 * Product Reviews Page.
 * Displays all reviews for a specific product with trust score.
 */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import TrustScoreGauge from '../components/TrustScoreGauge';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';
import {
  HiOutlineArrowLeft,
  HiOutlineTrash,
  HiOutlineShieldCheck,
  HiOutlineExclamationTriangle,
  HiOutlineClock,
} from 'react-icons/hi2';

const ProductReviews = () => {
  const { productId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/review/${productId}`);
      setReviews(response.data.data.reviews);
      setProduct(response.data.data.product);
    } catch (error) {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await api.delete(`/review/${reviewId}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  if (loading) return <LoadingSpinner message="Loading reviews..." size="lg" />;

  const genuineCount = reviews.filter(r => r.prediction?.label === 'Genuine').length;
  const fakeCount = reviews.filter(r => r.prediction?.label === 'Fake').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back Button + Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/dashboard"
          className="w-10 h-10 rounded-xl bg-dark-800/50 flex items-center justify-center text-dark-400 hover:text-dark-100 hover:bg-dark-800 transition-all"
        >
          <HiOutlineArrowLeft className="text-xl" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-dark-100">
            {product?.productName || `Product ${productId}`}
          </h1>
          <p className="text-dark-400 mt-1">Product ID: {productId} • {reviews.length} reviews</p>
        </div>
      </div>

      {/* Trust Score & Stats */}
      {product && (
        <div className="glass-card p-8">
          <div className="flex items-center gap-8 flex-wrap">
            <TrustScoreGauge score={product.trustScore} size={140} strokeWidth={10} />
            
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-dark-800/40 text-center">
                <p className="text-xs text-dark-500 mb-1">Total Reviews</p>
                <p className="text-2xl font-bold text-dark-100">{product.totalReviews}</p>
              </div>
              <div className="p-4 rounded-xl bg-dark-800/40 text-center">
                <p className="text-xs text-dark-500 mb-1">Genuine</p>
                <p className="text-2xl font-bold text-accent-400">{genuineCount}</p>
              </div>
              <div className="p-4 rounded-xl bg-dark-800/40 text-center">
                <p className="text-xs text-dark-500 mb-1">Fake</p>
                <p className="text-2xl font-bold text-danger-400">{fakeCount}</p>
              </div>
              <div className="p-4 rounded-xl bg-dark-800/40 text-center">
                <p className="text-xs text-dark-500 mb-1">Avg Rating</p>
                <p className="text-2xl font-bold text-warning-400">{product.averageRating || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-dark-100">All Reviews</h2>
        
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div
              key={review._id}
              className="glass-card p-6 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                    {review.user?.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dark-200">{review.user?.name || 'Anonymous'}</p>
                    <div className="flex items-center gap-2 text-xs text-dark-500">
                      <HiOutlineClock className="text-sm" />
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={
                    review.prediction?.label === 'Genuine' ? 'badge-genuine' :
                    review.prediction?.label === 'Fake' ? 'badge-fake' : 'badge-pending'
                  }>
                    {review.prediction?.label === 'Genuine' && <HiOutlineShieldCheck className="inline mr-1" />}
                    {review.prediction?.label === 'Fake' && <HiOutlineExclamationTriangle className="inline mr-1" />}
                    {review.prediction?.label || 'Pending'}
                    {review.prediction?.confidence > 0 && (
                      <span className="ml-1 opacity-70">
                        ({(review.prediction.confidence * 100).toFixed(0)}%)
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="p-2 rounded-lg text-dark-600 hover:text-danger-400 hover:bg-danger-500/10 transition-all"
                    title="Delete review"
                  >
                    <HiOutlineTrash className="text-lg" />
                  </button>
                </div>
              </div>

              <StarRating rating={review.rating} readonly size="sm" />

              <p className="text-dark-300 mt-3 leading-relaxed">{review.reviewText}</p>

              {/* Sentiment Badge */}
              {review.sentiment?.sentiment && (
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-dark-800/50">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    review.sentiment.sentiment === 'positive' ? 'bg-accent-500/10 text-accent-400' :
                    review.sentiment.sentiment === 'negative' ? 'bg-danger-500/10 text-danger-400' :
                    'bg-dark-700 text-dark-400'
                  }`}>
                    {review.sentiment.sentiment}
                  </span>
                  <span className="text-xs text-dark-500">
                    Polarity: {review.sentiment.polarity?.toFixed(2)}
                  </span>
                  <span className="text-xs text-dark-500">
                    Subjectivity: {review.sentiment.subjectivity?.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="glass-card p-12 text-center">
            <p className="text-dark-500 text-lg">No reviews found for this product.</p>
            <Link to="/add-review" className="btn-primary inline-block mt-4">
              Add a Review
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
