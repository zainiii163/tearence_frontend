import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BooksPostForm from '../Component/books/BooksPostForm';
import BooksNavbar from '../Component/books/BooksNavbar';
import { BooksFilters, BooksGrid, BooksActivityFeed } from '../Component/books';
import BooksAPI from '../services/booksAPI';
import useAuthRedirect from '../hooks/useAuthRedirect';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Star, 
  TrendingUp, 
  Globe,
  Users,
  Eye,
  Heart,
  Shield,
  Crown,
  Zap,
  Rocket,
  DollarSign,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

const BooksMarketplace = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState({
    stats: false,
    featured: false,
    genres: false
  });
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalAuthors: 0,
    totalViews: 0,
    totalSaves: 0
  });
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [trendingGenres, setTrendingGenres] = useState([]);

  useEffect(() => {
    // Check for postForm parameter
    if (searchParams.get('postForm') === 'true') {
      // Only show form if authenticated
      if (isAuthenticated) {
        setShowPostForm(true);
      } else {
        // Clear the parameter and redirect to login
        setSearchParams({});
        requireAuth('/books?postForm=true', 'You must be logged in to post a book.');
      }
    }

    // Load initial data
    loadStats();
    loadFeaturedBooks();
    loadTrendingGenres();
  }, [searchParams]);

  const loadStats = async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      const response = await BooksAPI.getStatistics();
      if (response.success) {
        setStats(response.data);
      } else {
        console.error('Failed to load stats:', response.message);
        setStats({
          totalBooks: 0,
          totalAuthors: 0,
          totalViews: 0,
          totalSaves: 0
        });
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
      setStats({
        totalBooks: 0,
        totalAuthors: 0,
        totalViews: 0,
        totalSaves: 0
      });
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  const loadFeaturedBooks = async () => {
    try {
      setLoading(prev => ({ ...prev, featured: true }));
      const response = await BooksAPI.getFeaturedBooks({ per_page: 6 });
      if (response.success) {
        setFeaturedBooks(response.data.data || response.data || []);
      } else {
        console.error('Failed to load featured books:', response.message);
        setFeaturedBooks([]);
      }
    } catch (error) {
      console.error('Failed to load featured books:', error);
      setFeaturedBooks([]);
    } finally {
      setLoading(prev => ({ ...prev, featured: false }));
    }
  };

  const loadTrendingGenres = async () => {
    try {
      setLoading(prev => ({ ...prev, genres: true }));
      const response = await BooksAPI.getTrendingGenres();
      if (response.success) {
        setTrendingGenres(response.data);
      } else {
        console.error('Failed to load trending genres:', response.message);
        setTrendingGenres([]);
      }
    } catch (error) {
      console.error('Failed to load trending genres:', error);
      setTrendingGenres([]);
    } finally {
      setLoading(prev => ({ ...prev, genres: false }));
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm
    }));
  };

  const handleViewBook = (book) => {
    setSelectedBook(book);
    // In a real app, this would navigate to book details
    console.log('View book:', book);
  };

  const handleSaveBook = async (bookId, isSaved) => {
    console.log('Save book:', bookId, isSaved);
  };

  const handleShareBook = (book) => {
    console.log('Share book:', book);
  };

  const handleContactAuthor = (book) => {
    console.log('Contact author:', book);
  };

  const handlePostBook = () => {
    // Require authentication before showing post form
    if (requireAuth('/books?postForm=true', 'You must be logged in to post a book.')) {
      // User is authenticated, show the form
      setShowPostForm(true);
      setSearchParams({ postForm: 'true' });
    }
  };

  const handleClosePostForm = () => {
    setShowPostForm(false);
    setSearchParams({});
  };

  if (showPostForm) {
    return <BooksPostForm onClose={handleClosePostForm} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Books Navbar */}
      <BooksNavbar />
      
      {/* Add padding to account for fixed navbar */}
      <div className="pt-16">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </button>
      </div>

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Books API Debug Info:</h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <p>Featured Books: {featuredBooks.length} {loading.featured && '(Loading...)'}</p>
            <p>Trending Genres: {trendingGenres.length} {loading.genres && '(Loading...)'}</p>
            <p>Total Books: {stats.totalBooks} {loading.stats && '(Loading...)'}</p>
            <p>Total Authors: {stats.totalAuthors}</p>
            <p>Total Views: {stats.totalViews}</p>
            <p>Total Saves: {stats.totalSaves}</p>
            <p>Post Form: {showPostForm ? 'Open' : 'Closed'}</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <BookOpen className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Books Marketplace
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                Discover, buy, and sell books from authors around the world. 
                From fiction to academic, find your next great read.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search books by title, author, or genre..."
                  className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-lg focus:ring-4 focus:ring-blue-300 focus:outline-none"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BookOpen className="w-6 h-6" />
                <div className="text-3xl font-bold">
                  {stats.totalBooks.toLocaleString()}
                </div>
              </div>
              <div className="text-blue-100">Total Books</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-6 h-6" />
                <div className="text-3xl font-bold">
                  {stats.totalAuthors.toLocaleString()}
                </div>
              </div>
              <div className="text-blue-100">Authors</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Eye className="w-6 h-6" />
                <div className="text-3xl font-bold">
                  {(stats.totalViews / 1000000).toFixed(1)}M
                </div>
              </div>
              <div className="text-blue-100">Total Views</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="w-6 h-6" />
                <div className="text-3xl font-bold">
                  {(stats.totalSaves / 1000).toFixed(0)}K
                </div>
              </div>
              <div className="text-blue-100">Saves</div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <button
              onClick={handlePostBook}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Post Your Book
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Filters */}
            <BooksFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onSearch={handleSearch}
            />

            {/* Activity Feed */}
            <BooksActivityFeed compact={true} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Books */}
            {featuredBooks.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-500" />
                    Featured Books
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredBooks.map((book) => (
                    <div key={book.id} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">{book.title}</h3>
                        {book.advert_type && (
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            book.advert_type === 'featured' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {book.advert_type === 'featured' ? <Crown className="w-3 h-3 inline" /> : <Zap className="w-3 h-3 inline" />}
                            {book.advert_type}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">by {book.author_name}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-green-600 font-bold">
                          <DollarSign className="w-4 h-4" />
                          {book.price}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Eye className="w-3 h-3" />
                          {book.views_count}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Genres */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                Trending Genres
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {trendingGenres.map((genre) => (
                  <motion.div
                    key={genre.name}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-lg border border-gray-200 p-4 text-center hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {genre.count.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-700 mb-2">{genre.name}</div>
                    <div className="text-xs text-green-600 font-medium">
                      {genre.growth}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Books Grid */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">All Books</h2>
              <BooksGrid
                filters={filters}
                onViewBook={handleViewBook}
                onSaveBook={handleSaveBook}
                onShareBook={handleShareBook}
                onContactAuthor={handleContactAuthor}
                compact={false}
                showFilters={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Premium Promotion Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Promote Your Book</h2>
          <p className="text-xl mb-8 text-purple-100">
            Get your book in front of thousands of readers with our premium promotion packages
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Zap className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Promoted</h3>
              <div className="text-2xl font-bold mb-1">$29</div>
              <div className="text-sm text-purple-200">2x visibility</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border-2 border-yellow-400">
              <Crown className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
              <h3 className="font-semibold mb-2">Featured</h3>
              <div className="text-2xl font-bold mb-1">$79</div>
              <div className="text-sm text-purple-200">Top placement</div>
              <div className="text-xs text-yellow-400 mt-2">Most Popular</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Rocket className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Sponsored</h3>
              <div className="text-2xl font-bold mb-1">$149</div>
              <div className="text-sm text-purple-200">Homepage placement</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Star className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Top of Category</h3>
              <div className="text-2xl font-bold mb-1">$299</div>
              <div className="text-sm text-purple-200">Pinned top</div>
            </div>
          </div>
          <button
            onClick={handlePostBook}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-700 font-semibold rounded-lg hover:bg-purple-50 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Post Your Book with Premium
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default BooksMarketplace;
