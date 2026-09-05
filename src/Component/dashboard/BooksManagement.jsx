import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaEdit, FaTrash, FaBook } from 'react-icons/fa';
import BooksAPI from '../../services/booksAPI';
import DashboardBookForm from './forms/DashboardBookForm';
import { extractListItems } from '../../utils/apiResponseHelpers';
import DashboardListThumbnail from './DashboardListThumbnail';
import { ListingStatusFilterBar, ListingStatusCell, filterListingsByLifecycle } from './ListingStatusControls';

const BooksManagement = ({ openCreateOnMount = false, onCreateOpened }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await BooksAPI.getMyBooks();
      setBooks(extractListItems(response));
    } catch (err) {
      setError('Failed to load books');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    if (openCreateOnMount) {
      setEditingBook(null);
      setShowForm(true);
      onCreateOpened?.();
    }
  }, [openCreateOnMount]);

  const handleCreate = () => {
    setEditingBook(null);
    setShowForm(true);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await BooksAPI.deleteBook(bookId);
      setBooks((prev) => prev.filter((book) => book.id !== bookId));
    } catch (err) {
      setError('Failed to delete book');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingBook(null);
    loadBooks();
  };

  const filteredBooks = useMemo(
    () => filterListingsByLifecycle(books, filterStatus),
    [books, filterStatus]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Books, courses & guides</h2>
        <button
          type="button"
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Submit publication
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      <ListingStatusFilterBar
        value={filterStatus}
        onChange={setFilterStatus}
        items={books}
        id="books-status-filter"
      />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cover</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBooks.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  <FaBook className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  {books.length === 0
                    ? 'No publications yet. Submit a book, course, guide, or manual.'
                    : 'No items match this status filter.'}
                </td>
              </tr>
            ) : (
              filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <DashboardListThumbnail item={book} fallback={FaBook} className="h-12 w-9" />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{book.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 capitalize">{book.content_kind || 'book'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{book.author_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {book.is_free || Number(book.price) <= 0
                        ? 'Free'
                        : `${book.currency || 'USD'} ${book.price}`}
                    </td>
                    <td className="px-6 py-4">
                      <ListingStatusCell item={book} upsellType="books" onPaid={loadBooks} />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button type="button" onClick={() => handleEdit(book)} className="text-blue-600 hover:text-blue-900">
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button type="button" onClick={() => handleDelete(book.id)} className="text-red-600 hover:text-red-900">
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <DashboardBookForm
          book={editingBook}
          onClose={() => { setShowForm(false); setEditingBook(null); }}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default BooksManagement;
