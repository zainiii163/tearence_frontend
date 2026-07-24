import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaBook,
  FaEye,
  FaHeart,
  FaPlus,
  FaChartLine,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaDollarSign,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

const BooksDashboard = () => {
  const { logIn, userDetail } = useSelector((store) => store.auth);
  
  const [booksStats, setBooksStats] = useState({
    totalBooks: 0,
    activeBooks: 0,
    pendingBooks: 0,
    totalViews: 0,
    totalSaves: 0,
    totalRevenue: 0,
  });
  
  const [recentBooks, setRecentBooks] = useState([]);
  const [analytics, setAnalytics] = useState({
    viewsChart: [],
    savesChart: [],
    topGenres: [],
    performanceMetrics: [],
  });
  const [loading, setLoading] = useState({
    stats: false,
    books: false,
    analytics: false,
  });

  useEffect(() => {
    if (logIn) {
      loadBooksStats();
      loadRecentBooks();
      loadAnalytics();
    }
  }, [logIn]);

  const loadBooksStats = async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      
      // In real implementation, call API
      // const response = await BooksAPI.getUserBooksStats();
      
      // Mock data for now
      setBooksStats({
        totalBooks: 12,
        activeBooks: 8,
        pendingBooks: 2,
        totalViews: 15420,
        totalSaves: 892,
        totalRevenue: 1250.00,
      });
    } catch (error) {
      console.error('Failed to load books stats:', error);
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  const loadRecentBooks = async () => {
    try {
      setLoading(prev => ({ ...prev, books: true }));
      
      // In real implementation, call API
      // const response = await BooksAPI.getMyBooks({ per_page: 5 });
      
      // Mock data for now
      setRecentBooks([
        {
          id: 1,
          title: "The Great Adventure",
          genre: "Fiction",
          status: "active",
          views: 1250,
          saves: 89,
          price: 19.99,
          advertType: "featured",
          createdAt: "2024-03-10T10:00:00Z",
        },
        {
          id: 2,
          title: "Business Success Guide",
          genre: "Business",
          status: "pending",
          views: 450,
          saves: 23,
          price: 29.99,
          advertType: "basic",
          createdAt: "2024-03-09T15:30:00Z",
        },
        {
          id: 3,
          title: "Cooking Masterclass",
          genre: "Cooking",
          status: "active",
          views: 890,
          saves: 67,
          price: 24.99,
          advertType: "promoted",
          createdAt: "2024-03-08T09:15:00Z",
        },
      ]);
    } catch (error) {
      console.error('Failed to load recent books:', error);
    } finally {
      setLoading(prev => ({ ...prev, books: false }));
    }
  };

  const loadAnalytics = async () => {
    try {
      setLoading(prev => ({ ...prev, analytics: true }));
      
      // Mock analytics data
      setAnalytics({
        viewsChart: [
          { date: '2024-03-06', views: 120 },
          { date: '2024-03-07', views: 145 },
          { date: '2024-03-08', views: 189 },
          { date: '2024-03-09', views: 167 },
          { date: '2024-03-10', views: 234 },
          { date: '2024-03-11', views: 298 },
        ],
        savesChart: [
          { date: '2024-03-06', saves: 12 },
          { date: '2024-03-07', saves: 18 },
          { date: '2024-03-08', saves: 24 },
          { date: '2024-03-09', saves: 21 },
          { date: '2024-03-10', saves: 32 },
          { date: '2024-03-11', saves: 38 },
        ],
        topGenres: [
          { genre: 'Fiction', count: 45, percentage: 37.5 },
          { genre: 'Business', count: 28, percentage: 23.3 },
          { genre: 'Cooking', count: 22, percentage: 18.3 },
          { genre: 'Self-Help', count: 15, percentage: 12.5 },
          { genre: 'Other', count: 10, percentage: 8.3 },
        ],
        performanceMetrics: [
          { metric: 'Avg. Views per Book', value: 1285, change: '+12%' },
          { metric: 'Avg. Saves per Book', value: 74, change: '+8%' },
          { metric: 'Conversion Rate', value: '5.8%', change: '+2.1%' },
          { metric: 'Revenue per Book', value: '$104.17', change: '+15%' },
        ],
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(prev => ({ ...prev, analytics: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAdvertTypeBadge = (type) => {
    switch (type) {
      case 'featured': return { color: 'bg-purple-100 text-purple-800', label: 'Featured' };
      case 'promoted': return { color: 'bg-blue-100 text-blue-800', label: 'Promoted' };
      case 'sponsored': return { color: 'bg-amber-100 text-amber-800', label: 'Sponsored' };
      default: return { color: 'bg-gray-100 text-gray-800', label: 'Basic' };
    }
  };

  if (!logIn) {
    return <div>Please log in to access your books dashboard.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="page-container">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                  <FaBook className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Books Dashboard</h1>
                  <p className="text-sm text-gray-500">Manage your books and track performance</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/books?postForm=true"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <FaPlus className="mr-2" />
                Post New Book
              </Link>
              <Link
                to="/books/my-books"
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Manage Books
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-container py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-500 text-white mr-4">
                <FaBook className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-semibold text-gray-900">{booksStats.totalBooks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500 text-white mr-4">
                <FaCheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-semibold text-gray-900">{booksStats.activeBooks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-500 text-white mr-4">
                <FaClock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{booksStats.pendingBooks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-500 text-white mr-4">
                <FaEye className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-semibold text-gray-900">{booksStats.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-500 text-white mr-4">
                <FaHeart className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Saves</p>
                <p className="text-2xl font-semibold text-gray-900">{booksStats.totalSaves.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-600 text-white mr-4">
                <FaDollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">${booksStats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Books */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Recent Books</h2>
                <Link to="/books/my-books" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  View All
                </Link>
              </div>
              <div className="divide-y divide-gray-200">
                {loading.books ? (
                  <div className="p-6 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2">Loading books...</p>
                  </div>
                ) : recentBooks.length > 0 ? (
                  recentBooks.map((book) => {
                    const advertBadge = getAdvertTypeBadge(book.advertType);
                    return (
                      <div key={book.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-sm font-medium text-gray-900">{book.title}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(book.status)}`}>
                                {book.status}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${advertBadge.color}`}>
                                {advertBadge.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{book.genre}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center">
                                <FaEye className="mr-1" /> {book.views.toLocaleString()}
                              </span>
                              <span className="flex items-center">
                                <FaHeart className="mr-1" /> {book.saves}
                              </span>
                              <span className="flex items-center">
                                <FaDollarSign className="mr-1" /> {book.price}
                              </span>
                              <span className="flex items-center">
                                <FaCalendarAlt className="mr-1" /> {new Date(book.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <FaEdit className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600">
                              <FaTrash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <FaBook className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No books yet. Create your first book to get started!</p>
                    <Link
                      to="/books?postForm=true"
                      className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      <FaPlus className="mr-2" />
                      Create Book
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Genres */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Top Genres</h2>
              </div>
              <div className="p-6">
                {analytics.topGenres.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.topGenres.map((genre, index) => (
                      <div key={genre.genre} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-indigo-600 font-semibold text-sm">{index + 1}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{genre.genre}</p>
                            <p className="text-xs text-gray-500">{genre.count} books</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">{genre.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <FaChartLine className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No genre data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Performance Metrics</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analytics.performanceMetrics.map((metric, index) => (
                <div key={metric.metric} className="text-center">
                  <p className="text-sm font-medium text-gray-600">{metric.metric}</p>
                  <p className="text-xl font-semibold text-gray-900 mt-1">{metric.value}</p>
                  <div className="flex items-center justify-center mt-1">
                    <FaChartLine className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{metric.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/books?postForm=true"
                className="flex items-center p-4 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <FaPlus className="h-5 w-5 mr-3" />
                <span className="font-medium">Post New Book</span>
              </Link>
              <Link
                to="/books/my-books"
                className="flex items-center p-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaBook className="h-5 w-5 mr-3" />
                <span className="font-medium">Manage Books</span>
              </Link>
              <Link
                to="/books/analytics"
                className="flex items-center p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                <FaChartLine className="h-5 w-5 mr-3" />
                <span className="font-medium">View Analytics</span>
              </Link>
              <Link
                to="/books/payments"
                className="flex items-center p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <FaDollarSign className="h-5 w-5 mr-3" />
                <span className="font-medium">Payment History</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksDashboard;
