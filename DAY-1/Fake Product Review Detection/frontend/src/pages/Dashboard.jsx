/**
 * Dashboard Page - Admin Panel.
 * Shows statistics, charts, and insights about reviews.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import TrustScoreGauge from '../components/TrustScoreGauge';
import {
  HiOutlineDocumentText,
  HiOutlineShieldCheck,
  HiOutlineExclamationTriangle,
  HiOutlineChartBar,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
} from 'react-icons/hi2';

// Register Chart.js components
ChartJS.register(
  ArcElement, CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, Title, Tooltip, Legend, Filler
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/review/dashboard/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." size="lg" />;

  // Chart configurations
  const doughnutData = {
    labels: ['Genuine', 'Fake', 'Pending'],
    datasets: [{
      data: [stats?.genuineCount || 0, stats?.fakeCount || 0, stats?.pendingCount || 0],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(245, 158, 11, 0.8)',
      ],
      borderColor: [
        'rgba(16, 185, 129, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(245, 158, 11, 1)',
      ],
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          padding: 20,
          font: { size: 13, family: 'Inter' },
          usePointStyle: true,
          pointStyleWidth: 12,
        },
      },
    },
    cutout: '65%',
  };

  const lineData = {
    labels: stats?.reviewsByDay?.map(d => {
      const date = new Date(d._id);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }) || [],
    datasets: [
      {
        label: 'Total',
        data: stats?.reviewsByDay?.map(d => d.total) || [],
        borderColor: '#818cf8',
        backgroundColor: 'rgba(129, 140, 248, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#818cf8',
      },
      {
        label: 'Genuine',
        data: stats?.reviewsByDay?.map(d => d.genuine) || [],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#10b981',
      },
      {
        label: 'Fake',
        data: stats?.reviewsByDay?.map(d => d.fake) || [],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#ef4444',
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8',
          font: { size: 12, family: 'Inter' },
          usePointStyle: true,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: '#64748b', font: { size: 11 } },
        beginAtZero: true,
      },
    },
  };

  const ratingData = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [{
      label: 'Reviews',
      data: [1, 2, 3, 4, 5].map(r => {
        const found = stats?.ratingDistribution?.find(d => d._id === r);
        return found ? found.count : 0;
      }),
      backgroundColor: [
        'rgba(239, 68, 68, 0.7)',
        'rgba(249, 115, 22, 0.7)',
        'rgba(245, 158, 11, 0.7)',
        'rgba(132, 204, 22, 0.7)',
        'rgba(16, 185, 129, 0.7)',
      ],
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: '#64748b', font: { size: 11 } },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-100">Dashboard</h1>
        <p className="text-dark-400 mt-1">Overview of review analysis and trust metrics</p>
      </div>

      {/* ============================================================
          Stats Cards
          ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Reviews */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary-500/15 flex items-center justify-center">
              <HiOutlineDocumentText className="text-2xl text-primary-400" />
            </div>
            <HiOutlineArrowTrendingUp className="text-xl text-accent-400" />
          </div>
          <p className="text-3xl font-bold text-dark-100">{stats?.totalReviews || 0}</p>
          <p className="text-sm text-dark-400 mt-1">Total Reviews</p>
        </div>

        {/* Genuine Reviews */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent-500/15 flex items-center justify-center">
              <HiOutlineShieldCheck className="text-2xl text-accent-400" />
            </div>
            <span className="badge-genuine">{stats?.genuinePercentage || 0}%</span>
          </div>
          <p className="text-3xl font-bold text-dark-100">{stats?.genuineCount || 0}</p>
          <p className="text-sm text-dark-400 mt-1">Genuine Reviews</p>
        </div>

        {/* Fake Reviews */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-danger-500/15 flex items-center justify-center">
              <HiOutlineExclamationTriangle className="text-2xl text-danger-400" />
            </div>
            <span className="badge-fake">{stats?.fakePercentage || 0}%</span>
          </div>
          <p className="text-3xl font-bold text-dark-100">{stats?.fakeCount || 0}</p>
          <p className="text-sm text-dark-400 mt-1">Fake Reviews</p>
        </div>

        {/* Avg Confidence */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-warning-500/15 flex items-center justify-center">
              <HiOutlineChartBar className="text-2xl text-warning-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-dark-100">
            {stats?.avgConfidence ? (stats.avgConfidence * 100).toFixed(0) : 0}%
          </p>
          <p className="text-sm text-dark-400 mt-1">Avg ML Confidence</p>
        </div>
      </div>

      {/* ============================================================
          Charts Row
          ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fake vs Genuine Doughnut */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-dark-100 mb-4">Review Classification</h3>
          <div className="h-64">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* Reviews Trend Line */}
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-dark-100 mb-4">Reviews Trend (Last 7 Days)</h3>
          <div className="h-64">
            {stats?.reviewsByDay?.length > 0 ? (
              <Line data={lineData} options={lineOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-dark-500">
                No data available yet. Start adding reviews!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================
          Second Charts Row
          ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-dark-100 mb-4">Rating Distribution</h3>
          <div className="h-56">
            <Bar data={ratingData} options={barOptions} />
          </div>
        </div>

        {/* Product Trust Scores */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-dark-100 mb-4">Product Trust Scores</h3>
          {stats?.products?.length > 0 ? (
            <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
              {stats.products.map((product, index) => (
                <Link
                  key={product._id}
                  to={`/reviews/${product.productId}`}
                  className="flex items-center gap-4 p-3 rounded-xl bg-dark-800/40 hover:bg-dark-800/70 transition-all group"
                >
                  <TrustScoreGauge score={product.trustScore} size={48} strokeWidth={4} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-dark-200 group-hover:text-dark-100 truncate">
                      {product.productName}
                    </p>
                    <p className="text-xs text-dark-500">
                      {product.totalReviews} reviews • {product.genuineReviews} genuine • {product.fakeReviews} fake
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-56 text-dark-500">
              No products yet. Add a review to get started!
            </div>
          )}
        </div>
      </div>

      {/* ============================================================
          Recent Reviews
          ============================================================ */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dark-100">Recent Reviews</h3>
          <Link to="/all-reviews" className="text-sm text-primary-400 hover:text-primary-300 font-medium">
            View All →
          </Link>
        </div>
        {stats?.recentReviews?.length > 0 ? (
          <div className="space-y-3">
            {stats.recentReviews.map((review) => (
              <div key={review._id} className="flex items-start gap-4 p-4 rounded-xl bg-dark-800/30 hover:bg-dark-800/50 transition-all">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {review.user?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-dark-200">{review.user?.name || 'Unknown'}</span>
                    <span className="text-xs text-dark-600">•</span>
                    <span className="text-xs text-dark-500">{review.productName}</span>
                    <span className={`ml-auto ${
                      review.prediction?.label === 'Genuine' ? 'badge-genuine' : 
                      review.prediction?.label === 'Fake' ? 'badge-fake' : 'badge-pending'
                    }`}>
                      {review.prediction?.label || 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-dark-400 line-clamp-2">{review.reviewText}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-dark-500 text-center py-8">No reviews yet. Start by adding a review!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
