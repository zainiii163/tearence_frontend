import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import booksAPI from '../../services/booksAPI';
import './Books.css';
import {
  FaBook,
  FaDownload,
  FaShoppingCart,
  FaExternalLinkAlt,
  FaDollarSign,
  FaStar,
  FaHeart,
  FaShareAlt,
  FaArrowLeft,
  FaUser,
  FaFlag,
  FaCheckCircle,
  FaSpinner,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, review: '' });
  const [activeTab, setActiveTab] = useState('description');

  const fetchReviews = useCallback(async () => {
    setLoadingReviews(true);
    try {
      const response = await booksAPI.getBookReviews(id);
      setReviews(response.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  }, [id]);

  const fetchSimilarBooks = useCallback(async () => {
    try {
      const response = await booksAPI.getBooks({}, { 
        genre: book?.genre, 
        per_page: 5,
        exclude_id: book?.listing_id 
      });
      setSimilarBooks(response.data?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching similar books:', error);
    }
  }, [book?.genre, book?.listing_id]);

  const checkFavoriteStatus = useCallback(async () => {
    try {
      const favorites = await booksAPI.getFavoriteBooks();
      setIsFavorite(favorites.data?.some(fav => fav.listing_id === parseInt(id)));
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  }, [id]);

  const fetchBook = useCallback(async () => {
    setLoading(true);
    try {
      const response = await booksAPI.getBook(id);
      setBook(response.data);
      
      // Fetch additional data
      fetchReviews();
      fetchSimilarBooks();
      checkFavoriteStatus();
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error('Failed to load book details');
    } finally {
      setLoading(false);
    }
  }, [id, fetchReviews, fetchSimilarBooks, checkFavoriteStatus]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  const handlePurchase = async () => {
    if (!book) return;
    
    setPurchasing(true);
    try {
      await booksAPI.purchaseBook(book.listing_id, 'credit_card');
      toast.success('Book purchased successfully!');
      // Refresh book data to show purchase status
      fetchBook();
    } catch (error) {
      toast.error('Purchase failed: ' + error.message);
    } finally {
      setPurchasing(false);
    }
  };

  const handleDownload = async () => {
    if (!book || !book.download_token) return;
    
    setDownloading(true);
    try {
      const blob = await booksAPI.downloadBook(book.download_token);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${book.title} - ${book.author}.${book.file_type || 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Download started!');
    } catch (error) {
      toast.error('Download failed: ' + error.message);
    } finally {
      setDownloading(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await booksAPI.removeFromFavorites(id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await booksAPI.addToFavorites(id);
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const shareBook = () => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Check out "${book.title}" by ${book.author}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await booksAPI.rateBook(id, reviewData.rating, reviewData.review);
      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
      setReviewData({ rating: 5, review: '' });
      fetchReviews(); // Refresh reviews
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  const reportBook = async () => {
    const reason = prompt('Please provide a reason for reporting this book:');
    if (reason) {
      try {
        await booksAPI.reportBook(id, reason);
        toast.success('Book reported successfully');
      } catch (error) {
        toast.error('Failed to report book');
      }
    }
  };

  const getBookTypeIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <span className="w-5 h-5 text-red-500">PDF</span>;
      case 'audiobook':
        return <span className="w-5 h-5 text-blue-500">🎧</span>;
      default:
        return <FaBook className="w-5 h-5 text-gray-500" />;
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Book not found</h2>
          <p className="text-gray-600 mb-4">The book you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/books')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFavorite}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <FaHeart
                  className={`w-5 h-5 ${
                    isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'
                  }`}
                />
              </button>
              <button
                onClick={shareBook}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <FaShareAlt className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={reportBook}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <FaFlag className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book cover and basic info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Book cover */}
              <div className="relative h-96 bg-gradient-to-br from-blue-50 to-indigo-100">
                {book.images && book.images.length > 0 ? (
                  <img
                    src={book.images[0].image_path}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FaBook className="w-24 h-24 text-gray-300" />
                  </div>
                )}
                
                {/* Book type badge */}
                <div className="absolute top-4 left-4">
                  <span className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                    {getBookTypeIcon(book.book_type)}
                    {book.book_type}
                  </span>
                </div>

                {/* Downloadable badge */}
                {book.is_downloadable && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full flex items-center gap-1">
                      <FaDownload className="w-3 h-3" />
                      Downloadable
                    </span>
                  </div>
                )}
              </div>

              {/* Purchase section */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FaDollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">
                      ${book.price}
                    </span>
                  </div>
                  {book.is_downloadable && (
                    <FaDownload className="w-5 h-5 text-blue-600" />
                  )}
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                  {book.is_purchased ? (
                    book.download_token ? (
                      <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {downloading ? (
                          <>
                            <FaSpinner className="w-4 h-4 animate-spin" />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <FaDownload className="w-4 h-4" />
                            Download Now
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="w-full px-4 py-3 bg-gray-100 text-gray-600 rounded-lg text-center">
                        Download not available
                      </div>
                    )
                  ) : (
                    <button
                      onClick={handlePurchase}
                      disabled={purchasing}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {purchasing ? (
                        <>
                          <FaSpinner className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaShoppingCart className="w-4 h-4" />
                          Purchase Book
                        </>
                      )}
                    </button>
                  )}

                  {book.website_url && (
                    <a
                      href={book.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      <FaExternalLinkAlt className="w-4 h-4" />
                      Visit Website
                    </a>
                  )}
                </div>

                {/* Book stats */}
                <div className="mt-6 pt-6 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{book.view_count || 0}</div>
                      <div className="text-gray-600">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{book.download_count || 0}</div>
                      <div className="text-gray-600">Downloads</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Book details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {/* Book header */}
              <div className="p-6 border-b">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                <p className="text-lg text-gray-600 mb-4">by {book.author}</p>
                
                {/* Rating and reviews */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {renderStars(book.rating || 0)}
                    <span className="text-sm text-gray-600 ml-1">
                      ({book.reviews_count || 0} reviews)
                    </span>
                  </div>
                  {book.is_purchased && (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <FaCheckCircle className="w-4 h-4" />
                      Purchased
                    </span>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    {book.genre}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    {book.format}
                  </span>
                  {book.condition && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {book.condition}
                    </span>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b">
                <nav className="flex space-x-8 px-6">
                  {['description', 'details', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab content */}
              <div className="p-6">
                {activeTab === 'description' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{book.description}</p>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {book.isbn && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">ISBN:</span>
                          <span className="font-medium">{book.isbn}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Format:</span>
                        <span className="font-medium">{book.format}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{book.book_type}</span>
                      </div>
                      {book.condition && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Condition:</span>
                          <span className="font-medium">{book.condition}</span>
                        </div>
                      )}
                      {book.file_size && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">File Size:</span>
                          <span className="font-medium">{book.formatted_file_size}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Listed:</span>
                        <span className="font-medium">
                          {new Date(book.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {book.total_revenue > 0 && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Total Revenue:</span>
                          <span className="font-medium">${book.total_revenue}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
                      {book.is_purchased && (
                        <button
                          onClick={() => setShowReviewForm(!showReviewForm)}
                          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          Write Review
                        </button>
                      )}
                    </div>

                    {showReviewForm && (
                      <form onSubmit={handleReviewSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating
                          </label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                                className="p-1"
                              >
                                <FaStar
                                  className={`w-6 h-6 ${
                                    star <= reviewData.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Review
                          </label>
                          <textarea
                            value={reviewData.review}
                            onChange={(e) => setReviewData(prev => ({ ...prev, review: e.target.value }))}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Submit Review
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowReviewForm(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}

                    {loadingReviews ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-2">Loading reviews...</p>
                      </div>
                    ) : reviews.length > 0 ? (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <FaUser className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="font-medium">{review.user_name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex">{renderStars(review.rating)}</div>
                                <span className="text-sm text-gray-500">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-700">{review.review}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600">No reviews yet. Be the first to review this book!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Similar books */}
            {similarBooks.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Similar Books</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {similarBooks.map((similarBook) => (
                    <div
                      key={similarBook.listing_id}
                      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => navigate(`/books/${similarBook.listing_id}`)}
                    >
                      <div className="h-32 bg-gradient-to-br from-blue-50 to-indigo-100">
                        {similarBook.images && similarBook.images.length > 0 ? (
                          <img
                            src={similarBook.images[0].image_path}
                            alt={similarBook.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <FaBook className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                          {similarBook.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">{similarBook.author}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-green-600 font-semibold">${similarBook.price}</span>
                          <div className="flex">{renderStars(similarBook.rating || 0)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
