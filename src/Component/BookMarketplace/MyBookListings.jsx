import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchMarketplaceBooks,
  updateBookListing,
  deleteBookListing,
  setCurrentBook,
} from '../../slice/BookMarketplaceSlice';
import {
  FaBook,
  FaEdit,
  FaTrash,
  FaEye,
  FaChartBar,
  FaDollarSign,
  FaFilePdf,
  FaHeadphones,
  FaExternalLinkAlt,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const MyBookListings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { books, loading, error } = useSelector((state) => state.bookMarketplace);
  const userDetails = useSelector((state) => state.auth?.userDetail?.data || {});

  const [editingBook, setEditingBook] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalSales: 0,
    totalRevenue: 0,
    pdfBooks: 0,
    physicalBooks: 0,
    websiteBooks: 0,
  });

  useEffect(() => {
    // Fetch user's books only
    dispatch(fetchMarketplaceBooks({ user_id: userDetails?.customer_id }));
  }, [dispatch, userDetails]);

  useEffect(() => {
    // Calculate stats
    const userBooks = books.filter(book => book.user_id === userDetails?.customer_id);
    setStats({
      totalBooks: userBooks.length,
      totalSales: userBooks.reduce((sum, book) => sum + (book.sales_count || 0), 0),
      totalRevenue: userBooks.reduce((sum, book) => sum + (book.total_revenue || 0), 0),
      pdfBooks: userBooks.filter(book => book.format === 'pdf').length,
      physicalBooks: userBooks.filter(book => book.format === 'physical').length,
      websiteBooks: userBooks.filter(book => book.format === 'website').length,
    });
  }, [books, userDetails]);

  const userBooks = books.filter(book => book.user_id === userDetails?.customer_id);

  const handleEdit = (book) => {
    setEditingBook(book);
    setEditForm({
      title: book.title,
      author: book.author,
      description: book.description,
      price: book.price,
      genre: book.genre,
      language: book.language,
      isbn: book.isbn,
      publisher: book.publisher,
      pages: book.pages,
      year_published: book.year_published,
      condition: book.condition,
      external_url: book.external_url,
    });
  };

  const handleSaveEdit = async () => {
    try {
      await dispatch(updateBookListing({
        bookId: editingBook.book_id,
        bookData: editForm,
      })).unwrap();
      
      toast.success('Book listing updated successfully!');
      setEditingBook(null);
      setEditForm({});
    } catch (error) {
      toast.error(error.message || 'Failed to update book listing');
    }
  };

  const handleDelete = async (bookId) => {
    try {
      await dispatch(deleteBookListing(bookId)).unwrap();
      toast.success('Book listing deleted successfully!');
      setShowDeleteModal(null);
    } catch (error) {
      toast.error(error.message || 'Failed to delete book listing');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'pdf':
        return <FaFilePdf className="h-4 w-4 text-red-600" />;
      case 'audiobook':
        return <FaHeadphones className="h-4 w-4 text-blue-600" />;
      case 'website':
        return <FaExternalLinkAlt className="h-4 w-4 text-green-600" />;
      default:
        return <FaBook className="h-4 w-4 text-gray-600" />;
    }
  };

  const getFormatBadge = (format) => {
    const formatConfig = {
      pdf: { bg: 'bg-red-100', text: 'text-red-800', label: 'PDF' },
      physical: { bg: 'bg-green-100', text: 'text-green-800', label: 'Physical' },
      website: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Website' },
      ebook: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'E-book' },
      audiobook: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Audiobook' },
    };

    const config = formatConfig[format] || formatConfig.physical;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {getFormatIcon(format)}
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FaBook className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  My Book Listings
                </h1>
                <p className="text-muted-foreground">
                  Manage your book marketplace listings
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/book-marketplace/upload')}
              className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 text-sm font-medium transition-colors"
            >
              <FaBook className="h-4 w-4" />
              Add New Book
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Books</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalBooks}</p>
              </div>
              <FaBook className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalSales}</p>
              </div>
              <FaChartBar className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold text-foreground">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <FaDollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">PDF Books</p>
                <p className="text-2xl font-bold text-foreground">{stats.pdfBooks}</p>
              </div>
              <FaFilePdf className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {userBooks.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto mb-4">
              <FaBook className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No books listed yet</h3>
            <p className="text-muted-foreground mb-4">
              Start selling your books by creating your first listing
            </p>
            <button
              onClick={() => navigate('/book-marketplace/upload')}
              className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 text-sm font-medium transition-colors"
            >
              <FaBook className="h-4 w-4" />
              Create Your First Listing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {userBooks.map((book) => (
              <div
                key={book.book_id}
                className="group rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-t-lg bg-muted relative">
                  <img
                    className="h-full w-full object-cover"
                    src={book.cover_image || '/img/NoImage.png'}
                    alt={book.title}
                    onError={(e) => {
                      e.target.src = '/img/NoImage.png';
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    {getFormatBadge(book.format)}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold leading-tight text-foreground line-clamp-2">
                      {book.title}
                    </h3>
                    <div className="flex items-center gap-1 text-lg font-semibold text-primary">
                      <FaDollarSign className="h-4 w-4" />
                      {book.price}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    by {book.author}
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div className="bg-gray-50 rounded p-2 text-center">
                      <p className="font-medium">{book.sales_count || 0}</p>
                      <p className="text-muted-foreground text-xs">Sales</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2 text-center">
                      <p className="font-medium">${book.total_revenue || 0}</p>
                      <p className="text-muted-foreground text-xs">Revenue</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(book)}
                      className="flex-1 inline-flex items-center justify-center gap-1 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-2 text-xs font-medium transition-colors"
                    >
                      <FaEdit className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(book)}
                      className="flex-1 inline-flex items-center justify-center gap-1 rounded-md border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 h-8 px-2 text-xs font-medium transition-colors"
                    >
                      <FaTrash className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setEditingBook(null)}
            />
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Edit Book Listing</h2>
                  <button
                    onClick={() => setEditingBook(null)}
                    className="rounded-full p-2 hover:bg-gray-100"
                  >
                    <FaTimes className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Author</label>
                    <input
                      type="text"
                      name="author"
                      value={editForm.author}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={editForm.price}
                        onChange={handleEditChange}
                        step="0.01"
                        min="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Genre</label>
                      <input
                        type="text"
                        name="genre"
                        value={editForm.genre}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  {editingBook.format === 'website' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Website URL</label>
                      <input
                        type="url"
                        name="external_url"
                        value={editForm.external_url}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setEditingBook(null)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 text-sm font-medium transition-colors"
                  >
                    <FaCheck className="h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowDeleteModal(null)}
            />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <FaExclamationTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Delete Book Listing
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete "{showDeleteModal.title}"? This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteModal.book_id)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-red-600 text-white hover:bg-red-700 h-10 px-4 py-2 text-sm font-medium transition-colors"
                >
                  <FaTrash className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookListings;
