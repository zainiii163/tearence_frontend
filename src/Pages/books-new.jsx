import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Plus, 
  Search,
  Grid,
  List,
  Star,
  TrendingUp,
  Users,
  BookMarked
} from 'lucide-react';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import BooksListing from '../Component/books/BooksListing';
import BookDetails from '../Component/books/BookDetails';
import CreateBookForm from '../Component/books/CreateBookForm';
import BooksAPI from '../services/booksAPI';

const BooksPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchPageData = async () => {
    try {
      // Fetch statistics for the overview
      const statsResponse = await BooksAPI.getStatistics();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // Fetch featured books for the overview
      const featuredResponse = await BooksAPI.getFeaturedBooks({ per_page: 6 });
      if (featuredResponse.success) {
        setFeaturedBooks(featuredResponse.data.items || []);
      }
    } catch (error) {
      console.error('Error fetching page data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostBook = () => {
    navigate('/books/create');
  };

  const isCreatePage = location.pathname === '/books/create';
  const isDetailPage = location.pathname.startsWith('/books/') && !isCreatePage;

  // Get the post button configuration for UnifiedNavbar
  const getPostButtonConfig = () => {
    return {
      text: 'Post Book',
      icon: <Plus className="h-4 w-4" />,
      postRoute: '/books/create',
      message: 'You must be logged in to post a book advert.'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar 
          showBackButton={false}
          postButtonConfig={getPostButtonConfig()}
        />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading books...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar 
        showBackButton={isDetailPage}
        postButtonConfig={getPostButtonConfig()}
      />
      
      <Routes>
        <Route path="/books" element={
          <div className="pt-16">
            {/* Hero Section */}
            {!isCreatePage && !isDetailPage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
              >
                <div className="max-w-7xl mx-auto px-4 py-16">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Discover Your Next Great Read
                      </h1>
                      <p className="text-xl mb-8 text-blue-100">
                        Browse thousands of books from independent authors and publishers. 
                        Find fiction, non-fiction, academic texts, and more.
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <button
                          onClick={() => navigate('/books')}
                          className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                        >
                          Browse Books
                        </button>
                        <button
                          onClick={handlePostBook}
                          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors font-medium"
                        >
                          Post Your Book
                        </button>
                      </div>
                    </div>
                    
                    {/* Stats Cards */}
                    {stats && (
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4"
                        >
                          <div className="flex items-center gap-3">
                            <BookOpen className="w-8 h-8 text-blue-200" />
                            <div>
                              <div className="text-3xl font-bold">{stats.total_books?.toLocaleString() || 0}</div>
                              <div className="text-sm text-blue-100">Total Books</div>
                            </div>
                          </div>
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 }}
                          className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4"
                        >
                          <div className="flex items-center gap-3">
                            <Users className="w-8 h-8 text-blue-200" />
                            <div>
                              <div className="text-3xl font-bold">{stats.verified_authors?.toLocaleString() || 0}</div>
                              <div className="text-sm text-blue-100">Verified Authors</div>
                            </div>
                          </div>
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 }}
                          className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4"
                        >
                          <div className="flex items-center gap-3">
                            <Star className="w-8 h-8 text-blue-200" />
                            <div>
                              <div className="text-3xl font-bold">{stats.average_rating || 0}</div>
                              <div className="text-sm text-blue-100">Avg Rating</div>
                            </div>
                          </div>
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 }}
                          className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4"
                        >
                          <div className="flex items-center gap-3">
                            <TrendingUp className="w-8 h-8 text-blue-200" />
                            <div>
                              <div className="text-3xl font-bold">{stats.most_popular_genre || 'N/A'}</div>
                              <div className="text-sm text-blue-100">Popular Genre</div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Featured Books Section */}
            {!isCreatePage && !isDetailPage && featuredBooks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="max-w-7xl mx-auto px-4 py-12"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Books</h2>
                  <p className="text-lg text-gray-600">Discover standout titles from our community</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredBooks.map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      onClick={() => navigate(`/books/${book.slug}`)}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all"
                    >
                      <div className="flex gap-4">
                        <img
                          src={book.cover_image}
                          alt={book.title}
                          className="w-20 h-28 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{book.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">by {book.author_name}</p>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                              {[...Array(Math.floor(book.rating || 0))].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">({book.rating || 0})</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold text-blue-600">
                              ${book.price} {book.currency}
                            </div>
                            {book.advert_type !== 'basic' && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                {book.advert_type}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="text-center mt-8">
                  <button
                    onClick={() => navigate('/books')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    View All Books
                  </button>
                </div>
              </motion.div>
            )}

            {/* Main Books Listing */}
            <BooksListing />
          </div>
        } />
        
        <Route path="/books/create" element={
          <div className="pt-16">
            <CreateBookForm />
          </div>
        } />
        
        <Route path="/books/:slug" element={
          <div className="pt-16">
            <BookDetails />
          </div>
        } />
      </Routes>
    </div>
  );
};

export default BooksPage;
