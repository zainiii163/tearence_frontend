import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import BooksAPI from '../../../services/booksAPI';
import {
  BOOK_GENRES,
  BOOK_TYPES,
  BOOK_FORMATS,
  BOOK_LANGUAGES,
  BOOK_CURRENCIES,
  BOOK_COUNTRIES,
  isValidIsbn,
  normalizeIsbn,
  getBookCoverUrl,
} from '../../../utils/bookFormHelpers';

const emptyForm = {
  book_type: 'fiction',
  title: '',
  short_description: '',
  description: '',
  author_name: '',
  language: 'English',
  genre: '',
  format: 'paperback',
  price: '',
  currency: 'USD',
  country: '',
  isbn: '',
  publisher: '',
  pages: '',
  publication_date: '',
  trailer_video_url: '',
  author_bio: '',
  agreed_to_terms: false,
};

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

const DashboardBookForm = ({ book, onClose, onSuccess }) => {
  const isEdit = Boolean(book?.id);
  const [form, setForm] = useState(emptyForm);
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!book) return;
    setForm({
      book_type: book.book_type || 'fiction',
      title: book.title || '',
      short_description: book.short_description || '',
      description: book.description || '',
      author_name: book.author_name || '',
      language: book.language || 'English',
      genre: book.genre || '',
      format: book.format || 'paperback',
      price: book.price ?? '',
      currency: book.currency || 'USD',
      country: book.country || '',
      isbn: book.isbn || '',
      publisher: book.publisher || '',
      pages: book.pages ?? '',
      publication_date: book.publication_date?.slice?.(0, 10) || book.publication_date || '',
      trailer_video_url: book.trailer_video_url || '',
      author_bio: book.author_bio || '',
      agreed_to_terms: true,
    });
    setCoverPreview(getBookCoverUrl(book) || '');
  }, [book]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let next = type === 'checkbox' ? checked : value;
    if (name === 'currency' && typeof next === 'string') {
      next = next.toUpperCase();
    }
    setForm((prev) => ({ ...prev, [name]: next }));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.description || !form.author_name || !form.genre || !form.format || !form.price || !form.country) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.description.trim().length < 50) {
      setError('Description must be at least 50 characters.');
      return;
    }
    if (!isEdit && !coverImage) {
      setError('Cover image is required.');
      return;
    }
    if (!isEdit && !form.agreed_to_terms) {
      setError('You must agree to the terms and conditions.');
      return;
    }
    if (!isValidIsbn(form.isbn)) {
      setError('ISBN may only contain digits, X, and hyphens (e.g. 978-0-123456-78-9). Leave blank if unknown.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        currency: (form.currency || 'USD').toUpperCase(),
        price: parseFloat(form.price),
        pages: form.pages !== '' ? parseInt(form.pages, 10) : undefined,
        isbn: normalizeIsbn(form.isbn) || undefined,
        cover_image: coverImage || undefined,
      };

      const response = isEdit
        ? await BooksAPI.updateBook(book.id, payload)
        : await BooksAPI.createBook(payload);

      if (response?.success === false) {
        throw new Error(response.message || 'Request failed');
      }
      onSuccess?.(response?.data || response);
      onClose?.();
    } catch (err) {
      setError(err.message || 'Failed to save book');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold">{isEdit ? 'Edit Book' : 'Create Book'}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Book Type <span className="text-red-500">*</span></label>
              <select name="book_type" value={form.book_type} onChange={handleChange} className={inputCls} required>
                {BOOK_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Format <span className="text-red-500">*</span></label>
              <select name="format" value={form.format} onChange={handleChange} className={inputCls} required>
                {BOOK_FORMATS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Title <span className="text-red-500">*</span></label>
            <input name="title" value={form.title} onChange={handleChange} className={inputCls} required />
          </div>

          <div>
            <label className={labelCls}>Short description</label>
            <input
              name="short_description"
              value={form.short_description}
              onChange={handleChange}
              className={inputCls}
              maxLength={255}
              placeholder="One-line summary for cards"
            />
          </div>

          <div>
            <label className={labelCls}>Description <span className="text-red-500">*</span></label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className={inputCls} required minLength={50} />
            <p className="text-xs text-gray-500 mt-1">Minimum 50 characters ({form.description.length}/50)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Author Name <span className="text-red-500">*</span></label>
              <input name="author_name" value={form.author_name} onChange={handleChange} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Genre <span className="text-red-500">*</span></label>
              <select name="genre" value={form.genre} onChange={handleChange} className={inputCls} required>
                <option value="">Select genre</option>
                {BOOK_GENRES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Price <span className="text-red-500">*</span></label>
              <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Currency</label>
              <select name="currency" value={form.currency} onChange={handleChange} className={inputCls}>
                {BOOK_CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Language <span className="text-red-500">*</span></label>
              <select name="language" value={form.language} onChange={handleChange} className={inputCls} required>
                {BOOK_LANGUAGES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Country <span className="text-red-500">*</span></label>
              <select name="country" value={form.country} onChange={handleChange} className={inputCls} required>
                <option value="">Select country</option>
                {BOOK_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>ISBN <span className="text-gray-400 font-normal">(optional)</span></label>
              <input
                name="isbn"
                value={form.isbn}
                onChange={handleChange}
                className={inputCls}
                placeholder="978-0-123456-78-9"
                maxLength={20}
                pattern="[0-9Xx\-]*"
              />
              <p className="text-xs text-gray-500 mt-1">Digits, X, and hyphens only. Leave empty if not applicable.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Publisher</label>
              <input name="publisher" value={form.publisher} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Pages</label>
              <input name="pages" type="number" min="1" value={form.pages} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Publication Date</label>
              <input name="publication_date" type="date" value={form.publication_date} onChange={handleChange} className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Author Bio</label>
            <textarea name="author_bio" value={form.author_bio} onChange={handleChange} rows={2} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Trailer / sample video URL</label>
            <input
              name="trailer_video_url"
              type="url"
              value={form.trailer_video_url}
              onChange={handleChange}
              className={inputCls}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className={labelCls}>
              Cover Image {!isEdit && <span className="text-red-500">*</span>}
            </label>
            <input type="file" accept="image/*" onChange={handleCoverChange} className={inputCls} />
            {coverPreview && (
              <img src={coverPreview} alt="Cover preview" className="mt-2 h-32 w-auto object-cover rounded border" />
            )}
          </div>

          {!isEdit && (
            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input type="checkbox" name="agreed_to_terms" checked={form.agreed_to_terms} onChange={handleChange} className="mt-1" />
              I agree to the terms and conditions <span className="text-red-500">*</span>
            </label>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50">
              <FaSave className="mr-2" />
              {submitting ? 'Saving...' : isEdit ? 'Update Book' : 'Create Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardBookForm;
