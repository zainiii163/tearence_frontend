import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import booksAPI from '../../services/booksAPI';
import {
  FaBook,
  FaUpload,
  FaImage,
  FaFilePdf,
  FaHeadphones,
  FaDollarSign,
  FaTimes,
  FaPlus,
  FaCheck,
  FaSpinner,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const CreateBookForm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const imagesInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    book_type: 'physical',
    genre: '',
    author: '',
    isbn: '',
    format: 'physical',
    condition: 'new',
    website_url: '',
    is_downloadable: false,
    location_id: '',
    publisher: '',
    language: '',
    pages: '',
    year_published: '',
  });
  
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tagInput, setTagInput] = useState('');

  // Genres options - matching API documentation
  const genres = [
    { value: 'action', label: 'Action' },
    { value: 'education', label: 'Education' },
    { value: 'drama', label: 'Drama' },
    { value: 'thriller', label: 'Thriller' },
    { value: 'fiction', label: 'Fiction' },
    { value: 'non_fiction', label: 'Non-Fiction' },
    { value: 'textbook', label: 'Textbook' },
    { value: 'romance', label: 'Romance' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'scifi', label: 'Sci-Fi' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'biography', label: 'Biography' },
    { value: 'self_help', label: 'Self-Help' },
    { value: 'business', label: 'Business' },
    { value: 'children', label: 'Children' },
  ];

  // Book types - matching API documentation
  const bookTypes = [
    { value: 'physical', label: 'Physical Books' },
    { value: 'pdf', label: 'PDF Downloads' },
    { value: 'audiobook', label: 'Audiobooks' },
  ];

  // Formats - matching API documentation
  const formats = [
    { value: 'physical', label: 'Physical Book' },
    { value: 'e_book', label: 'E-book' },
    { value: 'audiobook', label: 'Audiobook' },
  ];

  // Conditions - matching API documentation
  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'like_new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
  ];

  // Languages (available but not used in current form)
  // const languages = [
  //   'English',
  //   'Spanish',
  //   'French',
  //   'German',
  //   'Italian',
  //   'Portuguese',
  //   'Chinese',
  //   'Japanese',
  //   'Korean',
  //   'Russian',
  //   'Arabic',
  //   'Hindi',
  //   'Other',
  // ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file size (50MB max)
      if (selectedFile.size > 50 * 1024 * 1024) {
        toast.error('File size must be less than 50MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = formData.book_type === 'audiobook' 
        ? ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/m4a']
        : ['application/pdf'];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error(`Invalid file type. Please upload ${formData.book_type === 'audiobook' ? 'MP3, WAV, or M4A' : 'PDF'} files.`);
        return;
      }
      
      setFile(selectedFile);
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const handleImagesChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    
    // Validate total images (max 5)
    if (images.length + selectedImages.length > 5) {
      toast.error('You can upload up to 5 images');
      return;
    }
    
    // Validate each image
    const validImages = selectedImages.filter(img => {
      if (img.size > 2 * 1024 * 1024) {
        toast.error(`${img.name} is too large. Max size is 2MB per image.`);
        return false;
      }
      if (!img.type.startsWith('image/')) {
        toast.error(`${img.name} is not a valid image file.`);
        return false;
      }
      return true;
    });
    
    setImages(prev => [...prev, ...validImages]);
    setErrors(prev => ({ ...prev, images: '' }));
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim()) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }
    
    if (!formData.genre) {
      newErrors.genre = 'Genre is required';
    }
    
    if (!formData.price || parseFloat(formData.price) < 0) {
      newErrors.price = 'Valid price is required';
    }
    
    if (formData.is_downloadable && !file) {
      newErrors.file = 'Book file is required for downloadable books';
    }
    
    if (images.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    
    if (formData.website_url && !isValidUrl(formData.website_url)) {
      newErrors.website_url = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setSubmitting(true);
    setUploadProgress(0);
    
    try {
      const formDataToSend = new FormData();
      
      // Add all form fields according to API documentation
      Object.keys(formData).forEach(key => {
        if (key !== 'is_downloadable' || formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add file if downloadable
      if (file && formData.is_downloadable) {
        formDataToSend.append('file', file);
      }
      
      // Add images as attachments
      images.forEach((image, index) => {
        formDataToSend.append(`attachments[${index}]`, image);
      });

      await booksAPI.createBook(formDataToSend);
      toast.success('Book created successfully!');
      
      // Redirect to book details or my listings
      navigate('/book-marketplace/my-listings');
    } catch (error) {
      toast.error('Failed to create book: ' + error.message);
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  const getFileIcon = () => {
    switch (formData.book_type) {
      case 'pdf':
        return <FaFilePdf className="w-8 h-8 text-red-500" />;
      case 'audiobook':
        return <FaHeadphones className="w-8 h-8 text-blue-500" />;
      default:
        return <FaBook className="w-8 h-8 text-gray-500" />;
    }
  };

  const getFileAcceptTypes = () => {
    switch (formData.book_type) {
      case 'audiobook':
        return '.mp3,.m4a,.wav';
      case 'pdf':
        return '.pdf';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md">
          {/* Header */}
          <div className="px-6 py-4 border-b">
            <h1 className="text-2xl font-bold text-gray-900">Create New Book Listing</h1>
            <p className="text-gray-600 mt-1">Fill in the details to list your book for sale</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter book title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.author ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter author name"
                  />
                  {errors.author && (
                    <p className="mt-1 text-sm text-red-600">{errors.author}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ISBN
                  </label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="978-1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe your book, its condition, and any other relevant details..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
            </div>

            {/* Book Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Book Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Book Type *
                  </label>
                  <select
                    name="book_type"
                    value={formData.book_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {bookTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genre *
                  </label>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.genre ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Genre</option>
                    {genres.map(genre => (
                      <option key={genre.value} value={genre.value}>
                        {genre.label}
                      </option>
                    ))}
                  </select>
                  {errors.genre && (
                    <p className="mt-1 text-sm text-red-600">{errors.genre}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Format *
                  </label>
                  <select
                    name="format"
                    value={formData.format}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {formats.map(format => (
                      <option key={format.value} value={format.value}>
                        {format.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {conditions.map(condition => (
                      <option key={condition.value} value={condition.value}>
                        {condition.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (Max 10)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add tags (e.g., bestseller, classic, textbook)"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <FaPlus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Digital Options */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Digital Options</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_downloadable"
                    checked={formData.is_downloadable}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Allow download after purchase
                  </label>
                </div>

                {formData.is_downloadable && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Book File {formData.book_type !== 'physical' && '*'}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {file ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getFileIcon()}
                            <div>
                              <p className="font-medium text-gray-900">{file.name}</p>
                              <p className="text-sm text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={removeFile}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTimes className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          {getFileIcon()}
                          <p className="mt-2 text-sm text-gray-600">
                            Upload {formData.book_type === 'audiobook' ? 'audio' : 'PDF'} file
                          </p>
                          <p className="text-xs text-gray-500">
                            Max 50MB • {formData.book_type === 'audiobook' ? 'MP3, M4A, WAV' : 'PDF'}
                          </p>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                          >
                            Choose File
                          </button>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      accept={getFileAcceptTypes()}
                      className="hidden"
                    />
                    {errors.file && (
                      <p className="mt-1 text-sm text-red-600">{errors.file}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    External Website URL
                  </label>
                  <input
                    type="url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.website_url ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://example.com/book"
                  />
                  {errors.website_url && (
                    <p className="mt-1 text-sm text-red-600">{errors.website_url}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Cover Images */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Cover Images</h2>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <FaImage className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload book cover and additional images
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Up to 5 images • Max 2MB each • JPG, PNG, GIF
                    </p>
                    <button
                      type="button"
                      onClick={() => imagesInputRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                      <FaUpload className="w-4 h-4 inline mr-2" />
                      Choose Images
                    </button>
                  </div>
                  <input
                    ref={imagesInputRef}
                    type="file"
                    multiple
                    onChange={handleImagesChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.images && (
                  <p className="text-sm text-red-600">{errors.images}</p>
                )}
              </div>
            </div>

            {/* Progress bar */}
            {submitting && uploadProgress > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Uploading...</span>
                  <span className="text-sm text-gray-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FaCheck className="w-4 h-4" />
                    Create Book Listing
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBookForm;
