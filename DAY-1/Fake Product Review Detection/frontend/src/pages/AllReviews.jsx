/**
 * All Reviews Page.
 * Shows all reviews across all products, paginated.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';
import {
  HiOutlineShieldCheck,
  HiOutlineExclamationTriangle,
  HiOutlineClock,
  HiOutlineMagnifyingGlass,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineFunnel,
} from 'react-icons/hi2';

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('all'); // all, genuine, fake
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/review/all/reviews?page=${page}&limit=15`);
      setReviews(response.data.data.reviews);
      setTotalPages(response.data.data.pages);
      setTotal(response.data.data.total);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    // Filter by prediction
    if (filter === 'genuine' && review.prediction?.label !== 'Genuine') return false;
    if (filter === 'fake' && review.prediction?.label !== 'Fake') return false;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        review.productName?.toLowerCase().includes(searchLower) ||
        review.reviewText?.toLowerCase().includes(searchLower) ||
        review.user?.name?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-100">All Reviews</h1>
          <p className="text-dark-400 mt-1">{total} total reviews across all products</p>
        </div>
        <Link to="/add-review" className="btn-primary">
          + Add Review
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="glass-card p-4 flex items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 py-2.5"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          <HiOutlineFunnel className="text-dark-500" />
          {['all', 'genuine', 'fake'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                filter === f
                  ? f === 'genuine'
                    ? 'bg-accent-500/15 text-accent-400 border border-accent-500/30'
                    : f === 'fake'
                    ? 'bg-danger-500/15 text-danger-400 border border-danger-500/30'
                    : 'bg-primary-500/15 text-primary-400 border border-primary-500/30'
                  : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800/50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <LoadingSpinner message="Loading reviews..." />
      ) : filteredReviews.length > 0 ? (
        <div className="space-y-4">
          {filteredReviews.map((review, index) => (
            <div
              key={review._id}
              className="glass-card p-5 animate-fade-in hover:border-primary-500/20 transition-all"
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <div className="flex items-start gap-4">
                {/* User Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {review.user?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-dark-200">{review.user?.name || 'Anonymous'}</span>
                    <span className="text-dark-600">•</span>
                    <Link
                      to={`/reviews/${review.productId}`}
                      className="text-sm text-primary-400 hover:text-primary-300 font-medium"
                    >
                      {review.productName}
                    </Link>
                    <span className="text-dark-600">•</span>
                    <span className="text-xs text-dark-500 flex items-center gap-1">
                      <HiOutlineClock className="text-sm" />
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </span>
                    
                    {/* Prediction Badge */}
                    <span className={`ml-auto ${
                      review.prediction?.label === 'Genuine' ? 'badge-genuine' :
                      review.prediction?.label === 'Fake' ? 'badge-fake' : 'badge-pending'
                    }`}>
                      {review.prediction?.label === 'Genuine' && <HiOutlineShieldCheck className="inline mr-1" />}
                      {review.prediction?.label === 'Fake' && <HiOutlineExclamationTriangle className="inline mr-1" />}
                      {review.prediction?.label || 'Pending'}
                      {review.prediction?.confidence > 0 && (
                        <span className="ml-1 opacity-70">
                          ({(review.prediction.confidence * 100).toFixed(0)}%)
                        </span>
                      )}
                    </span>
                  </div>

                  <StarRating rating={review.rating} readonly size="sm" />
                  <p className="text-sm text-dark-400 mt-2 leading-relaxed line-clamp-2">{review.reviewText}</p>

                  {/* Sentiment */}
                  {review.sentiment?.sentiment && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        review.sentiment.sentiment === 'positive' ? 'bg-accent-500/10 text-accent-400' :
                        review.sentiment.sentiment === 'negative' ? 'bg-danger-500/10 text-danger-400' :
                        'bg-dark-700 text-dark-400'
                      }`}>
                        {review.sentiment.sentiment}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <p className="text-dark-500 text-lg">No reviews found.</p>
          <Link to="/add-review" className="btn-primary inline-block mt-4">
            Add your first review
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-dark-800/50 text-dark-400 hover:text-dark-100 hover:bg-dark-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <HiOutlineChevronLeft /> Previous
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-xl font-medium text-sm transition-all ${
                    page === pageNum
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-800/50 text-dark-400 hover:text-dark-100 hover:bg-dark-800'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-dark-800/50 text-dark-400 hover:text-dark-100 hover:bg-dark-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next <HiOutlineChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default AllReviews;
