import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  ExternalLink, 
  Star, 
  Eye, 
  BookOpen,
  User,
  Calendar,
  Globe,
  Tag,
  FileText,
  Download,
  Loader2,
  Check,
  X
} from 'lucide-react';
import BooksAPI from '../../services/booksAPI';
import { getBookCoverUrl, getBookMediaUrl } from '../../utils/bookFormHelpers';

const BookDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [coverError, setCoverError] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchBookDetails();
    }
  }, [slug]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await BooksAPI.getBookBySlug(slug);
      
      if (response.success) {
        setBook(response.data);
        setIsSaved(response.data.is_saved || false);
        setCoverError(false);
        setCurrentImageIndex(0);
        
        // Track view
        await BooksAPI.incrementViews(response.data.id, {
          user_agent: navigator.userAgent,
          referrer: document.referrer
        });
      }
    } catch (error) {
      setError(error.message || 'Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBook = async () => {
    if (!book || saving) return;
    
    setSaving(true);
    try {
      const response = await BooksAPI.saveBook(book.id, !isSaved);
      
      if (response.success) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error('Error saving book:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: book.description,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handlePurchaseClick = (link) => {
    window.open(link.url, '_blank');
  };

  const handleSampleDownload = (sample) => {
    window.open(sample.url, '_blank');
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <Star className="w-5 h-5 fill-yellow-200 text-yellow-400" />}
        <span className="ml-2 text-lg font-medium text-gray-700">{rating}</span>
      </div>
    );
  };

  const nextImage = () => {
    if (book && book.additional_images && book.additional_images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === book.additional_images.length ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (book && book.additional_images && book.additional_images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? book.additional_images.length : prev - 1
      );
    }
  };

  useEffect(() => {
    setCoverError(false);
  }, [currentImageIndex]);

  const coverUrl = book ? getBookCoverUrl(book) : null;

  const getCurrentImage = () => {
    if (!book) return null;

    if (currentImageIndex === 0) {
      return coverUrl;
    }

    const extra = book.additional_images?.[currentImageIndex - 1];
    return getBookMediaUrl(extra) || coverUrl;
  };

  const currentImageUrl = getCurrentImage();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <p className="font-medium text-lg">Error</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => navigate('/books')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-600">Book not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/books')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Books</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2">
            {/* Book Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Book Cover and Image Gallery */}
                <div className="flex-shrink-0">
                  <div className="relative group">
                    {!coverError && currentImageUrl ? (
                      <img
                        src={currentImageUrl}
                        alt={book.title}
                        className="w-48 h-72 object-cover rounded-lg shadow-md"
                        onError={() => setCoverError(true)}
                      />
                    ) : (
                      <div className="w-48 h-72 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg shadow-md flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-blue-600" />
                      </div>
                    )}
                    
                    {/* Image Navigation */}
                    {book && book.additional_images && book.additional_images.length > 0 && (
                      <div className="absolute inset-0 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={prevImage}
                          className="p-2 bg-black bg-opacity-50 text-white rounded-full mx-2 hover:bg-opacity-70"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="p-2 bg-black bg-opacity-50 text-white rounded-full mx-2 hover:bg-opacity-70"
                        >
                          <ArrowLeft className="w-4 h-4 rotate-180" />
                        </button>
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {book.verified_author && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          ✓ Verified Author
                        </span>
                      )}
                      {book.advert_type !== 'basic' && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {book.advert_type}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Image Thumbnails */}
                  {book && book.additional_images && book.additional_images.length > 0 && (
                    <div className="flex gap-2 mt-2 overflow-x-auto">
                      <div
                        onClick={() => setCurrentImageIndex(0)}
                        className={`flex-shrink-0 w-16 h-20 rounded cursor-pointer border-2 ${
                          currentImageIndex === 0 ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={coverUrl}
                          alt="Cover"
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                      {book.additional_images.map((img, index) => (
                        <div
                          key={index}
                          onClick={() => setCurrentImageIndex(index + 1)}
                          className={`flex-shrink-0 w-16 h-20 rounded cursor-pointer border-2 ${
                            currentImageIndex === index + 1 ? 'border-blue-500' : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={getBookMediaUrl(img)}
                            alt={`Additional ${index + 1}`}
                            className="w-full h-full object-cover rounded"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Book Information */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                  <p className="text-lg text-gray-600 mb-4">by {book.author_name}</p>
                  
                  {/* Rating and Stats */}
                  <div className="flex items-center gap-4 mb-4">
                    {book.rating && renderStars(book.rating)}
                    <div className="flex items-center gap-1 text-gray-600">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">{book.views_count?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{book.saves_count?.toLocaleString() || 0}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-blue-600">
                      ${book.price} {book.currency}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleSaveBook}
                      disabled={saving}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isSaved
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      } disabled:opacity-50`}
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      )}
                      <span>{isSaved ? 'Saved' : 'Save'}</span>
                    </button>
                    
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    
                    <button
                      onClick={() => setShowContactModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Contact Author</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {book.description}
              </p>
            </motion.div>

            {/* Purchase Links */}
            {book && book.purchase_links && book.purchase_links.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Purchase Options</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {book.purchase_links.map((link, index) => (
                    <div
                      key={index}
                      onClick={() => handlePurchaseClick(link)}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{link.platform}</div>
                          <div className="text-sm text-gray-600">${link.price}</div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Sample Files */}
            {book && book.sample_files && book.sample_files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Sample Files</h2>
                <div className="space-y-3">
                  {book.sample_files.map((sample, index) => (
                    <div
                      key={index}
                      onClick={() => handleSampleDownload(sample)}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium text-gray-900">{sample.title}</div>
                          <div className="text-sm text-gray-600 uppercase">{sample.type}</div>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1">
            {/* Book Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Details</h3>
              <div className="space-y-3">
                {book.publisher && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Publisher:</span>
                    <span className="font-medium text-gray-900">{book.publisher}</span>
                  </div>
                )}
                
                {book.isbn && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">ISBN:</span>
                    <span className="font-medium text-gray-900">{book.isbn}</span>
                  </div>
                )}
                
                {book.genre && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Genre:</span>
                    <span className="font-medium text-gray-900">{book.genre}</span>
                  </div>
                )}
                
                {book.format && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Format:</span>
                    <span className="font-medium text-gray-900 capitalize">{book.format}</span>
                  </div>
                )}
                
                {book.pages && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pages:</span>
                    <span className="font-medium text-gray-900">{book.pages}</span>
                  </div>
                )}
                
                {book.language && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language:</span>
                    <span className="font-medium text-gray-900">{book.language}</span>
                  </div>
                )}
                
                {book.publication_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Published:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(book.publication_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                {book.country && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Country:</span>
                    <span className="font-medium text-gray-900">{book.country}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Author Information */}
            {book.author_bio && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {book.author_bio}
                </p>
                
                {book.author_social_links && (
                  <div className="space-y-2">
                    {book.author_social_links.website && (
                      <a
                        href={book.author_social_links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        <span className="text-sm">Website</span>
                      </a>
                    )}
                    
                    {book.author_social_links.twitter && (
                      <a
                        href={book.author_social_links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm">Twitter</span>
                      </a>
                    )}
                    
                    {book.author_social_links.instagram && (
                      <a
                        href={book.author_social_links.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm">Instagram</span>
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Pricing Plan */}
            {book.pricing_plan && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Promotion Plan</h3>
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="font-medium text-blue-900 mb-2">{book.pricing_plan.name}</div>
                  <div className="text-sm text-blue-700 mb-2">
                    {book.pricing_plan.duration_days} days duration
                  </div>
                  <div className="text-lg font-bold text-blue-900">
                    ${book.pricing_plan.price}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Author Modal */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Contact Author</h3>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your message to the author..."
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowContactModal(false)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send Message
                  </button>
                  <button
                    onClick={() => setShowContactModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookDetails;
