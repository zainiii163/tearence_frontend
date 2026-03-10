import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import BooksPostForm from '../Component/books/BooksPostForm';
import BooksFilters from '../Component/books/BooksFilters';
import BooksGrid from '../Component/books/BooksGrid';
import BooksActivityFeed from '../Component/books/BooksActivityFeed';
import BooksAPI from '../services/booksAPI';
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
  ArrowRight
} from 'lucide-react';

const BooksMarketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
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
      setShowPostForm(true);
    }

    // Load initial data
    loadStats();
    loadFeaturedBooks();
    loadTrendingGenres();
  }, [searchParams]);

  const loadStats = async () => {
    try {
      const response = await BooksAPI.getStatistics();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
      // Set mock data for demo
      setStats({
        totalBooks: 45234,
        totalAuthors: 8921,
        totalViews: 12500000,
        totalSaves: 234000
      });
    }
  };

  const loadFeaturedBooks = async () => {
    try {
      const response = await BooksAPI.getFeaturedBooks({ per_page: 6 });
      if (response.success) {
        setFeaturedBooks(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to load featured books:', error);
      // Set mock data for demo
      setFeaturedBooks([
        {
          id: 1,
          title: 'The Great Adventure',
          author_name: 'John Smith',
          genre: 'Fiction',
          price: '19.99',
          currency: 'USD',
          format: 'paperback',
          cover_image_url: null,
          views_count: 5420,
          saves_count: 234,
          rating: 4.5,
          reviews_count: 89,
          verified_author: true,
          advert_type: 'featured',
          country: 'United States',
          slug: 'the-great-adventure'
        },
        {
          id: 2,
          title: 'Digital Marketing Mastery',
          author_name: 'Sarah Johnson',
          genre: 'Business',
          price: '29.99',
          currency: 'USD',
          format: 'ebook',
          cover_image_url: null,
          views_count: 3210,
          saves_count: 156,
          rating: 4.8,
          reviews_count: 67,
          verified_author: true,
          advert_type: 'promoted',
          country: 'United Kingdom',
          slug: 'digital-marketing-mastery'
        }
      ]);
    }
  };

  const loadTrendingGenres = async () => {
    // Set mock trending genres
    setTrendingGenres([
      { name: 'Fiction', count: 12450, growth: '+12%' },
      { name: 'Non-Fiction', count: 8920, growth: '+8%' },
      { name: 'Mystery & Thriller', count: 6780, growth: '+15%' },
      { name: 'Romance', count: 5430, growth: '+6%' },
      { name: 'Science Fiction', count: 4560, growth: '+18%' },
      { name: 'Self-Help', count: 3890, growth: '+10%' }
    ]);
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
    setShowPostForm(true);
    setSearchParams({ postForm: 'true' });
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
  );
};

export default BooksMarketplace;
