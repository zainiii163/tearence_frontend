import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  Loader2,
  Check,
  AlertCircle,
  BookOpen,
  DollarSign,
  Calendar,
  FileText,
  User,
  Globe,
  Tag
} from 'lucide-react';
import BooksAPI from '../../services/booksAPI';

const CreateBookForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author_name: '',
    publisher: '',
    isbn: '',
    genre: '',
    book_type: '',
    language: '',
    format: '',
    pages: '',
    publication_date: '',
    price: '',
    currency: 'USD',
    country: '',
    author_bio: '',
    agreed_to_terms: false
  });

  // File states
  const [coverImage, setCoverImage] = useState('');
  const [additionalImages, setAdditionalImages] = useState([]);
  const [sampleFiles, setSampleFiles] = useState([]);
  const [purchaseLinks, setPurchaseLinks] = useState([]);
  const [authorSocialLinks, setAuthorSocialLinks] = useState({});
  const [selectedPricingPlan, setSelectedPricingPlan] = useState('');

  // UI states
  const [showPreview, setShowPreview] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Available options
  const availableGenres = [
    'Fiction', 'Non-Fiction', 'Romance', 'Mystery', 'Sci-Fi', 
    'Biography', 'History', 'Self-Help', 'Business', 'Programming',
    'Fantasy', 'Thriller', 'Horror', 'Poetry', 'Drama'
  ];

  const availableBookTypes = ['Fiction', 'Non-Fiction', 'Academic', 'Biography'];
  const availableLanguages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];
  const availableFormats = ['paperback', 'hardcover', 'ebook', 'audiobook'];
  const availableCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];

  useEffect(() => {
    fetchPricingPlans();
  }, []);

  const fetchPricingPlans = async () => {
    try {
      const response = await BooksAPI.getPricingPlans();
      if (response.success) {
        setPricingPlans(response.data);
      }
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
    }
  };

  const handleInputChange = (e) => {
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

  const handleImageUpload = (e, type) => {
    const files = Array.from(e.target.files);
    
    if (type === 'cover') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setCoverImage(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      // Additional images
      const newImages = files.map(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          return event.target.result;
        };
        reader.readAsDataURL(file);
        return reader.result;
      });
      
      Promise.all(newImages).then(results => {
        setAdditionalImages(prev => [...prev, ...results]);
      });
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSampleFiles(prev => [...prev, {
          type: file.type.includes('pdf') ? 'pdf' : 'epub',
          file: event.target.result,
          title: file.name.replace(/\.[^/.]+$/, "")
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const addPurchaseLink = () => {
    setPurchaseLinks(prev => [...prev, { platform: '', url: '', price: '' }]);
  };

  const updatePurchaseLink = (index, field, value) => {
    setPurchaseLinks(prev => prev.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    ));
  };

  const removePurchaseLink = (index) => {
    setPurchaseLinks(prev => prev.filter((_, i) => i !== index));
  };

  const removeAdditionalImage = (index) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeSampleFile = (index) => {
    setSampleFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.author_name.trim()) newErrors.author_name = 'Author name is required';
    if (!formData.genre) newErrors.genre = 'Genre is required';
    if (!formData.format) newErrors.format = 'Format is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!coverImage) newErrors.cover_image = 'Cover image is required';
    if (!formData.agreed_to_terms) newErrors.agreed_to_terms = 'You must agree to terms and conditions';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      const submissionData = {
        ...formData,
        cover_image: coverImage,
        additional_images: additionalImages,
        sample_files: sampleFiles,
        purchase_links: purchaseLinks.filter(link => link.platform && link.url),
        author_social_links: authorSocialLinks,
        pricing_plan_id: selectedPricingPlan
      };
      
      const response = await BooksAPI.createBook(submissionData);
      
      if (response.success) {
        setSuccess('Book advert created successfully!');
        setTimeout(() => {
          navigate('/books');
        }, 2000);
      } else {
        setError(response.message || 'Failed to create book advert');
      }
    } catch (error) {
      setError(error.message || 'An error occurred while creating book advert');
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-yellow-400 rounded-full" />
        ))}
        {hasHalfStar && <div className="w-4 h-4 bg-yellow-200 rounded-full" />}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/books')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Create New Book Advert</h1>
                <p className="text-sm text-gray-600">List your book for sale or promotion</p>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step <= currentStep ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-8 h-1 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>{success}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Book Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your book title"
                    required
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="author_name"
                    value={formData.author_name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.author_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter author name"
                    required
                  />
                  {errors.author_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.author_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Publisher</label>
                  <input
                    type="text"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter publisher name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="978-1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genre <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.genre ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select Genre</option>
                    {availableGenres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                  {errors.genre && (
                    <p className="mt-1 text-sm text-red-600">{errors.genre}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Book Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="book_type"
                    value={formData.book_type}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.book_type ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select Type</option>
                    {availableBookTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.book_type && (
                    <p className="mt-1 text-sm text-red-600">{errors.book_type}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.language ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select Language</option>
                    {availableLanguages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                  {errors.language && (
                    <p className="mt-1 text-sm text-red-600">{errors.language}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Format <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="format"
                    value={formData.format}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.format ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select Format</option>
                    {availableFormats.map(format => (
                      <option key={format} value={format}>
                        {format.charAt(0).toUpperCase() + format.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.format && (
                    <p className="mt-1 text-sm text-red-600">{errors.format}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pages</label>
                  <input
                    type="number"
                    name="pages"
                    value={formData.pages}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Number of pages"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Publication Date</label>
                  <input
                    type="date"
                    name="publication_date"
                    value={formData.publication_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                      required
                    />
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {availableCurrencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Country of publication"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe your book in detail..."
                    required
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => navigate('/books')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next Step
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Media and Files */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Media and Files</h2>
              
              {/* Cover Image */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'cover')}
                      className="hidden"
                      id="cover-image"
                      required
                    />
                    <label
                      htmlFor="cover-image"
                      className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        errors.cover_image ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      <Upload className="w-5 h-5 mr-2 text-gray-400" />
                      <span>Choose Cover Image</span>
                    </label>
                  </div>
                  
                  {coverImage && (
                    <div className="relative group">
                      <img
                        src={coverImage}
                        alt="Cover preview"
                        className="w-24 h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => setCoverImage('')}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                {errors.cover_image && (
                  <p className="mt-1 text-sm text-red-600">{errors.cover_image}</p>
                )}
              </div>

              {/* Additional Images */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e, 'additional')}
                    className="hidden"
                    id="additional-images"
                  />
                  <label
                    htmlFor="additional-images"
                    className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2 text-gray-400" />
                    <span>Add Additional Images</span>
                  </label>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {additionalImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Additional ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(index)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sample Files */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sample Files (PDF/EPUB)</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept=".pdf,.epub"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="sample-files"
                  />
                  <label
                    htmlFor="sample-files"
                    className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                  >
                    <FileText className="w-5 h-5 mr-2 text-gray-400" />
                    <span>Add Sample Files</span>
                  </label>
                  
                  <div className="space-y-2">
                    {sampleFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-900">{file.title}</div>
                            <div className="text-sm text-gray-600 uppercase">{file.type}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSampleFile(index)}
                          className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Purchase Links */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Links</label>
                <div className="space-y-3">
                  {purchaseLinks.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Platform (e.g., Amazon)"
                        value={link.platform}
                        onChange={(e) => updatePurchaseLink(index, 'platform', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="url"
                        placeholder="Purchase URL"
                        value={link.url}
                        onChange={(e) => updatePurchaseLink(index, 'url', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={link.price}
                        onChange={(e) => updatePurchaseLink(index, 'price', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removePurchaseLink(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addPurchaseLink}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Purchase Link
                  </button>
                </div>
              </div>

              <div className="flex justify-between gap-3 mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Previous Step
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next Step
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Author Information and Pricing */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Author Information & Pricing</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Author Bio */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author Biography</label>
                  <textarea
                    name="author_bio"
                    value={formData.author_bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell readers about yourself..."
                  />
                </div>

                {/* Social Links */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author Website</label>
                  <input
                    type="url"
                    name="website"
                    value={authorSocialLinks.website || ''}
                    onChange={(e) => setAuthorSocialLinks(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://authorwebsite.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Twitter Profile</label>
                  <input
                    type="url"
                    name="twitter"
                    value={authorSocialLinks.twitter || ''}
                    onChange={(e) => setAuthorSocialLinks(prev => ({ ...prev, twitter: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://twitter.com/authorname"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Profile</label>
                  <input
                    type="url"
                    name="instagram"
                    value={authorSocialLinks.instagram || ''}
                    onChange={(e) => setAuthorSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://instagram.com/authorname"
                  />
                </div>

                {/* Pricing Plans */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Pricing Plan</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {pricingPlans.map((plan) => (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPricingPlan(plan.id)}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedPricingPlan === plan.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="font-medium text-gray-900 mb-2">{plan.name}</div>
                        <div className="text-sm text-gray-600 mb-2">{plan.description}</div>
                        <div className="text-sm text-gray-700 mb-2">
                          Duration: {plan.duration_days} days
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          ${plan.price}
                        </div>
                        <div className="mt-2 space-y-1">
                          {plan.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                              <Check className="w-3 h-3 text-green-500" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedPricingPlan && (
                    <p className="mt-2 text-sm text-green-600">
                      ✓ Selected: {pricingPlans.find(p => p.id === selectedPricingPlan)?.name}
                    </p>
                  )}
                </div>

                {/* Terms Agreement */}
                <div className="md:col-span-2">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreed_to_terms"
                      checked={formData.agreed_to_terms}
                      onChange={handleInputChange}
                      className={`mt-1 mr-3 rounded text-blue-600 focus:ring-blue-500 ${
                        errors.agreed_to_terms ? 'border-red-500' : ''
                      }`}
                      required
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the terms and conditions of the platform. I confirm that I have the rights to publish this book and that all information provided is accurate.
                    </span>
                  </label>
                  {errors.agreed_to_terms && (
                    <p className="mt-1 text-sm text-red-600">{errors.agreed_to_terms}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between gap-3 mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Previous Step
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4" />
                      Create Book Advert
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateBookForm;
