import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  uploadBookPDF, 
  createExternalBook, 
  uploadAudiobook 
} from '../../slice/BookMarketplaceSlice';
import {
  FaBook,
  FaArrowLeft,
  FaFilePdf,
  FaTimes,
  FaCheck,
  FaDollarSign,
  FaLink,
  FaImage,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import ReactQuillWrapper from "../ReactQuillWrapper";
import 'react-quill/dist/quill.snow.css';

const BookUploadForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uploading, loading } = useSelector((state) => state.bookMarketplace);
  const userDetails = useSelector((state) => state.auth?.userDetail?.data);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    isbn: '',
    publisher: '',
    language: '',
    genre: '',
    pages: '',
    year_published: '',
    price: '',
    book_type: 'pdf', // pdf, audiobook, external
    external_url: '', // for external website books
    website_url: '', // external website URL
    is_downloadable: true,
    cover_image: null,
    pdf_file: null,
    audiobook_file: null,
    audiobook_duration: '',
    audiobook_format: 'mp3', // mp3, wav, m4a
  });

  const [dragActive, setDragActive] = useState(false);
  const [pdfDragActive, setPdfDragActive] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // 1: Basic Info, 2: File Upload, 3: Pricing & Submit

  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const genres = [
    'Action',
    'Education',
    'Drama',
    'Thriller',
    'Fiction',
    'Non-Fiction',
    'Textbook',
    'Romance',
    'Mystery',
    'Sci-Fi',
    'Fantasy',
    'Biography',
    'Self-Help',
    'Business',
    'Children',
  ];

  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Chinese',
    'Japanese',
    'Korean',
    'Russian',
    'Arabic',
    'Hindi',
    'Other',
  ];

  const conditions = [
    'New',
    'Like New',
    'Very Good',
    'Good',
    'Acceptable',
    'Used',
  ];

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      
      if (name === 'cover_image' && file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCoverPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else if (name === 'pdf_file' && file) {
        setPdfFileName(file.name);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleQuillChange = (value) => {
    setFormData({ ...formData, description: value });
    if (errors.description) {
      setErrors({ ...errors, description: '' });
    }
  };

  // Drag and drop handlers for cover image
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setFormData({ ...formData, cover_image: file });
        const reader = new FileReader();
        reader.onloadend = () => {
          setCoverPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please upload an image file for the cover');
      }
    }
  };

  // Drag and drop handlers for PDF
  const handlePdfDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setPdfDragActive(true);
    } else if (e.type === 'dragleave') {
      setPdfDragActive(false);
    }
  };

  const handlePdfDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPdfDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        setFormData({ ...formData, pdf_file: file });
        setPdfFileName(file.name);
      } else {
        toast.error('Please upload a PDF file');
      }
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.author.trim()) newErrors.author = 'Author is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.genre) newErrors.genre = 'Genre is required';
      if (!formData.language) newErrors.language = 'Language is required';
      if (!formData.book_type) newErrors.book_type = 'Book type is required';
      
      if (formData.book_type === 'external' && !formData.external_url.trim()) {
        newErrors.external_url = 'Website URL is required for external books';
      }
    }

    if (currentStep === 2) {
      if (!formData.cover_image) newErrors.cover_image = 'Cover image is required';
      if (formData.book_type === 'pdf' && !formData.pdf_file) {
        newErrors.pdf_file = 'PDF file is required for PDF books';
      }
      if (formData.book_type === 'audiobook' && !formData.audiobook_file) {
        newErrors.audiobook_file = 'Audio file is required for audiobooks';
      }
    }

    if (currentStep === 3) {
      if (!formData.price || parseFloat(formData.price) <= 0) {
        newErrors.price = 'Price must be greater than 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) {
      return;
    }

    try {
      // Check if user has location set
      if (!userDetails?.location?.location_id) {
        toast.error('Please update your location in your profile before posting.');
        navigate('/account?component=AccountInfo');
        return;
      }
      
      // Handle different book types
      if (formData.book_type === 'pdf') {
        const submissionData = new FormData();
        
        // Add book info
        submissionData.append('title', formData.title);
        submissionData.append('author', formData.author);
        submissionData.append('description', formData.description);
        submissionData.append('genre', formData.genre);
        submissionData.append('language', formData.language);
        submissionData.append('price', formData.price);
        submissionData.append('isbn', formData.isbn);
        submissionData.append('publisher', formData.publisher);
        submissionData.append('pages', formData.pages);
        submissionData.append('year_published', formData.year_published);
        submissionData.append('book_type', 'pdf');
        submissionData.append('is_downloadable', formData.is_downloadable);
        
        // Add files
        submissionData.append('pdf_file', formData.pdf_file);
        if (formData.cover_image) {
          submissionData.append('cover_image', formData.cover_image);
        }
        
        // Add user info
        submissionData.append('user_id', userDetails.customer_id);
        submissionData.append('location_id', userDetails.location.location_id);
        
        await dispatch(uploadBookPDF(submissionData)).unwrap();
        
      } else if (formData.book_type === 'audiobook') {
        const submissionData = new FormData();
        
        // Add book info
        submissionData.append('title', formData.title);
        submissionData.append('author', formData.author);
        submissionData.append('description', formData.description);
        submissionData.append('genre', formData.genre);
        submissionData.append('language', formData.language);
        submissionData.append('price', formData.price);
        submissionData.append('isbn', formData.isbn);
        submissionData.append('publisher', formData.publisher);
        submissionData.append('year_published', formData.year_published);
        submissionData.append('book_type', 'audiobook');
        submissionData.append('audiobook_duration', formData.audiobook_duration);
        submissionData.append('audiobook_format', formData.audiobook_format);
        submissionData.append('is_downloadable', formData.is_downloadable);
        
        // Add files
        submissionData.append('audiobook_file', formData.audiobook_file);
        if (formData.cover_image) {
          submissionData.append('cover_image', formData.cover_image);
        }
        
        // Add user info
        submissionData.append('user_id', userDetails.customer_id);
        submissionData.append('location_id', userDetails.location.location_id);
        
        await dispatch(uploadAudiobook(submissionData)).unwrap();
        
      } else if (formData.book_type === 'external') {
        const bookData = {
          title: formData.title,
          author: formData.author,
          description: formData.description,
          genre: formData.genre,
          language: formData.language,
          price: formData.price,
          isbn: formData.isbn,
          publisher: formData.publisher,
          year_published: formData.year_published,
          book_type: 'external',
          external_url: formData.external_url,
          website_url: formData.external_url,
          user_id: userDetails.customer_id,
          location_id: userDetails.location.location_id,
        };
        
        if (formData.cover_image) {
          const submissionData = new FormData();
          Object.keys(bookData).forEach(key => {
            submissionData.append(key, bookData[key]);
          });
          submissionData.append('cover_image', formData.cover_image);
          await dispatch(createExternalBook(submissionData)).unwrap();
        } else {
          await dispatch(createExternalBook(bookData)).unwrap();
        }
      }
      
      toast.success('Book listing created successfully!');
      navigate('/book-marketplace');
      
    } catch (error) {
      toast.error(error.message || 'Failed to create book listing');
    }
  };

  const removeCoverImage = () => {
    setFormData({ ...formData, cover_image: null });
    setCoverPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePdfFile = () => {
    setFormData({ ...formData, pdf_file: null });
    setPdfFileName('');
    if (pdfInputRef.current) {
      pdfInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <FaArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FaBook className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                List Your Book for Sale
              </h1>
              <p className="text-muted-foreground">
                Share your books with our community - PDFs, physical books, or external links
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step >= stepNumber
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 ${
                    step > stepNumber ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-center mt-2 space-x-8 text-xs text-muted-foreground">
            <span>Basic Info</span>
            <span>Files</span>
            <span>Pricing</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter book title"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Author *
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.author ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter author name"
                    />
                    {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description *
                    </label>
                    <div className={`border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}>
                      <ReactQuillWrapper
                        value={formData.description}
                        onChange={handleQuillChange}
                        theme="snow"
                        placeholder="Describe your book in detail..."
                        style={{ height: '200px', marginBottom: '42px' }}
                      />
                    </div>
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Genre *
                      </label>
                      <select
                        name="genre"
                        value={formData.genre}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                          errors.genre ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Genre</option>
                        {genres.map(genre => (
                          <option key={genre} value={genre.toLowerCase().replace(/\s+/g, '-')}>
                            {genre}
                          </option>
                        ))}
                      </select>
                      {errors.genre && <p className="text-red-500 text-sm mt-1">{errors.genre}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Language *
                      </label>
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                          errors.language ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Language</option>
                        {languages.map(language => (
                          <option key={language} value={language.toLowerCase()}>
                            {language}
                          </option>
                        ))}
                      </select>
                      {errors.language && <p className="text-red-500 text-sm mt-1">{errors.language}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Format *
                    </label>
                    <select
                      name="format"
                      value={formData.format}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.format ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="pdf">PDF Download</option>
                      <option value="physical">Physical Book</option>
                      <option value="website">External Website</option>
                      <option value="ebook">E-book</option>
                      <option value="audiobook">Audiobook</option>
                    </select>
                    {errors.format && <p className="text-red-500 text-sm mt-1">{errors.format}</p>}
                  </div>

                  {formData.format === 'website' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Website URL *
                      </label>
                      <div className="relative">
                        <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="url"
                          name="external_url"
                          value={formData.external_url}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors.external_url ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="https://example.com/book"
                        />
                      </div>
                      {errors.external_url && <p className="text-red-500 text-sm mt-1">{errors.external_url}</p>}
                    </div>
                  )}

                  {formData.format === 'physical' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Condition *
                      </label>
                      <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                          errors.condition ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        {conditions.map(condition => (
                          <option key={condition} value={condition.toLowerCase().replace(/\s+/g, '-')}>
                            {condition}
                          </option>
                        ))}
                      </select>
                      {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        ISBN
                      </label>
                      <input
                        type="text"
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="978-3-16-148410-0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Publisher
                      </label>
                      <input
                        type="text"
                        name="publisher"
                        value={formData.publisher}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Publisher name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Year Published
                      </label>
                      <input
                        type="number"
                        name="year_published"
                        value={formData.year_published}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="2023"
                        min="1800"
                        max={new Date().getFullYear() + 1}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Pages
                      </label>
                      <input
                        type="number"
                        name="pages"
                        value={formData.pages}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="350"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: File Upload */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
                
                {/* Cover Image Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Cover Image *
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                      dragActive
                        ? 'border-primary bg-primary/5 scale-105'
                        : 'border-input hover:border-primary/50'
                    } ${errors.cover_image ? 'border-red-500' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <FaImage className={`h-8 w-8 mx-auto mb-2 transition-colors ${
                      dragActive ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      name="cover_image"
                      onChange={handleInputChange}
                      className="hidden"
                      id="cover-upload"
                    />
                    <label
                      htmlFor="cover-upload"
                      className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {dragActive ? 'Drop image here' : 'Click to upload cover image or drag and drop'}
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                  
                  {errors.cover_image && <p className="text-red-500 text-sm mt-1">{errors.cover_image}</p>}
                  
                  {/* Cover Preview */}
                  {coverPreview && (
                    <div className="mt-4">
                      <p className="text-sm text-foreground mb-2">Cover Preview:</p>
                      <div className="relative inline-block">
                        <img
                          src={coverPreview}
                          alt="Cover preview"
                          className="w-32 h-48 object-cover rounded-lg border border-input"
                        />
                        <button
                          type="button"
                          onClick={removeCoverImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* PDF Upload (only for PDF format) */}
                {formData.format === 'pdf' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      PDF File *
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                        pdfDragActive
                          ? 'border-primary bg-primary/5 scale-105'
                          : 'border-input hover:border-primary/50'
                      } ${errors.pdf_file ? 'border-red-500' : ''}`}
                      onDragEnter={handlePdfDrag}
                      onDragLeave={handlePdfDrag}
                      onDragOver={handlePdfDrag}
                      onDrop={handlePdfDrop}
                    >
                      <FaFilePdf className={`h-8 w-8 mx-auto mb-2 transition-colors ${
                        pdfDragActive ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <input
                        ref={pdfInputRef}
                        type="file"
                        accept="application/pdf"
                        name="pdf_file"
                        onChange={handleInputChange}
                        className="hidden"
                        id="pdf-upload"
                      />
                      <label
                        htmlFor="pdf-upload"
                        className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {pdfDragActive ? 'Drop PDF here' : 'Click to upload PDF or drag and drop'}
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF files up to 50MB
                      </p>
                    </div>
                    
                    {errors.pdf_file && <p className="text-red-500 text-sm mt-1">{errors.pdf_file}</p>}
                    
                    {/* PDF File Info */}
                    {pdfFileName && (
                      <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FaFilePdf className="h-5 w-5 text-red-600" />
                          <span className="text-sm text-foreground">{pdfFileName}</span>
                        </div>
                        <button
                          type="button"
                          onClick={removePdfFile}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Pricing */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-xl font-semibold mb-4">Pricing & Review</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Price ($) *
                  </label>
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0.01"
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="9.99"
                    />
                  </div>
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                {/* Review Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Review Your Listing</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <span className="font-medium">Title:</span> {formData.title}
                    </div>
                    <div>
                      <span className="font-medium">Author:</span> {formData.author}
                    </div>
                    <div>
                      <span className="font-medium">Format:</span> {formData.format}
                    </div>
                    <div>
                      <span className="font-medium">Genre:</span> {formData.genre}
                    </div>
                    <div>
                      <span className="font-medium">Price:</span> ${formData.price}
                    </div>
                    {formData.isbn && (
                      <div>
                        <span className="font-medium">ISBN:</span> {formData.isbn}
                      </div>
                    )}
                    {formData.external_url && (
                      <div>
                        <span className="font-medium">Website:</span> {formData.external_url}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <button
              type="button"
              onClick={step === 1 ? () => navigate(-1) : handlePrevStep}
              className="inline-flex items-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium transition-colors"
            >
              <FaArrowLeft className="h-4 w-4" />
              {step === 1 ? 'Cancel' : 'Previous'}
            </button>
            
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2 text-sm font-medium transition-colors"
              >
                Next
                <FaCheck className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || uploading}
                className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 h-10 px-6 py-2 text-sm font-medium transition-colors"
              >
                {loading || uploading ? 'Creating...' : 'Create Listing'}
                <FaCheck className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookUploadForm;
