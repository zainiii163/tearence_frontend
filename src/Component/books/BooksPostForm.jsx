import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Star, 
  BookOpen, 
  Upload,
  DollarSign,
  Globe,
  Phone,
  Mail,
  FileText,
  CreditCard,
  Shield,
  Zap,
  Crown,
  Rocket,
  Camera,
  User,
  MapPin,
  Calendar,
  Hash,
  Link2,
  Image as ImageIcon,
  Video,
  Save
} from 'lucide-react';
import BooksAPI from '../../services/booksAPI';

const BooksPostForm = ({ onClose, initialData = null }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pricingPlans, setPricingPlans] = useState([]);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    book_type: '',
    title: '',
    subtitle: '',
    description: '',
    short_description: '',
    
    // Step 2: Author & Publishing
    author_name: '',
    author_bio: '',
    author_photo: null,
    author_social_links: [],
    publisher: '',
    publication_date: '',
    isbn: '',
    pages: '',
    language: '',
    
    // Step 3: Classification & Pricing
    genre: '',
    format: '',
    price: '',
    currency: 'USD',
    age_range: '',
    series_name: '',
    edition: '',
    
    // Step 4: Media Upload
    cover_image: null,
    additional_images: [],
    trailer_video_url: '',
    sample_files: [],
    
    // Step 5: Purchase Links
    purchase_links: [],
    
    // Step 6: Location
    country: '',
    location_address: '',
    latitude: null,
    longitude: null,
    
    // Step 7: Premium Upsell
    upsell_tier: '1',
    
    // Step 8: Review & Submit
    agreed_to_terms: false,
    verified_author: false
  });

  const totalSteps = 8;

  const steps = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Add the essential details about your book',
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      id: 2,
      title: 'Author & Publishing',
      description: 'Author information and publishing details',
      icon: <User className="w-5 h-5" />
    },
    {
      id: 3,
      title: 'Classification & Pricing',
      description: 'Genre, format, pricing and categorization',
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      id: 4,
      title: 'Media Upload',
      description: 'Upload cover, images and media files',
      icon: <Camera className="w-5 h-5" />
    },
    {
      id: 5,
      title: 'Purchase Links',
      description: 'Add links where readers can purchase',
      icon: <Link2 className="w-5 h-5" />
    },
    {
      id: 6,
      title: 'Location',
      description: 'Set your book\'s location and availability',
      icon: <MapPin className="w-5 h-5" />
    },
    {
      id: 7,
      title: 'Premium Promotion',
      description: 'Choose promotion options for better visibility',
      icon: <Rocket className="w-5 h-5" />
    },
    {
      id: 8,
      title: 'Review & Submit',
      description: 'Review your listing and submit',
      icon: <Check className="w-5 h-5" />
    }
  ];

  const bookTypes = [
    { id: 'fiction', name: 'Fiction', description: 'Novels, stories, and fictional works' },
    { id: 'non-fiction', name: 'Non-Fiction', description: 'Biographies, educational, and factual content' },
    { id: 'children', name: 'Children\'s Books', description: 'Books for children and young readers' },
    { id: 'academic', name: 'Academic', description: 'Textbooks, research, and educational materials' },
    { id: 'comics', name: 'Comics & Graphic Novels', description: 'Comic books and graphic novels' },
    { id: 'poetry', name: 'Poetry', description: 'Poetry collections and verses' }
  ];

  const genres = [
    'Action & Adventure', 'Biography', 'Business', 'Children\'s', 'Comics', 'Cooking',
    'Fantasy', 'Fiction', 'Health & Fitness', 'History', 'Horror', 'Mystery',
    'Non-Fiction', 'Poetry', 'Romance', 'Science Fiction', 'Self-Help', 'Thriller',
    'Travel', 'Young Adult', 'Academic', 'Religion', 'Science', 'Art & Design'
  ];

  const formats = [
    { id: 'paperback', name: 'Paperback' },
    { id: 'hardcover', name: 'Hardcover' },
    { id: 'ebook', name: 'E-book' },
    { id: 'audiobook', name: 'Audiobook' },
    { id: 'pdf', name: 'PDF' }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' }
  ];

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France',
    'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland',
    'Japan', 'China', 'India', 'Brazil', 'Mexico', 'Argentina', 'Chile', 'Peru',
    'South Africa', 'Egypt', 'Nigeria', 'Kenya', 'Morocco', 'Ghana'
  ];

  useEffect(() => {
    loadPricingPlans();
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const loadPricingPlans = async () => {
    try {
      const response = await BooksAPI.getPricingPlans();
      if (response.success) {
        setPricingPlans(response.data);
      }
    } catch (error) {
      console.error('Failed to load pricing plans:', error);
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = () => {
    setError('');
    
    switch (currentStep) {
      case 1:
        if (!formData.book_type) {
          setError('Please select a book type');
          return false;
        }
        if (!formData.title.trim()) {
          setError('Please enter a book title');
          return false;
        }
        if (!formData.description.trim()) {
          setError('Please enter a book description');
          return false;
        }
        return true;
      
      case 2:
        if (!formData.author_name.trim()) {
          setError('Please enter the author name');
          return false;
        }
        if (!formData.publisher.trim()) {
          setError('Please enter the publisher name');
          return false;
        }
        return true;
      
      case 3:
        if (!formData.genre) {
          setError('Please select a genre');
          return false;
        }
        if (!formData.format) {
          setError('Please select a format');
          return false;
        }
        if (!formData.price || formData.price <= 0) {
          setError('Please enter a valid price');
          return false;
        }
        return true;
      
      case 4:
        if (!formData.cover_image) {
          setError('Please upload a cover image');
          return false;
        }
        return true;
      
      case 5:
        if (formData.purchase_links.length === 0) {
          setError('Please add at least one purchase link');
          return false;
        }
        return true;
      
      case 6:
        if (!formData.country) {
          setError('Please select a country');
          return false;
        }
        return true;
      
      case 7:
        if (!formData.upsell_tier) {
          setError('Please select a promotion tier');
          return false;
        }
        return true;
      
      case 8:
        if (!formData.agreed_to_terms) {
          setError('Please agree to the terms and conditions');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const submitData = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'cover_image' && formData[key]) {
          submitData.append('cover_image', formData[key]);
        } else if (key === 'additional_images' && formData[key].length > 0) {
          formData[key].forEach((file, index) => {
            submitData.append(`additional_images[${index}]`, file);
          });
        } else if (key === 'sample_files' && formData[key].length > 0) {
          formData[key].forEach((file, index) => {
            submitData.append(`sample_files[${index}]`, file);
          });
        } else if (key === 'author_photo' && formData[key]) {
          submitData.append('author_photo', formData[key]);
        } else if (key === 'purchase_links') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key === 'author_social_links') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });
      
      const response = await BooksAPI.createBook(submitData);
      
      if (response.success) {
        // Handle successful submission
        if (response.payment_required) {
          // Redirect to payment
          window.location.href = `/books/payment/${response.data.id}`;
        } else {
          // Success message and close
          alert('Book posted successfully!');
          onClose();
        }
      } else {
        setError(response.message || 'Failed to post book');
      }
    } catch (error) {
      setError(error.message || 'An error occurred while posting your book');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addPurchaseLink = () => {
    setFormData(prev => ({
      ...prev,
      purchase_links: [...prev.purchase_links, { platform: '', url: '' }]
    }));
  };

  const updatePurchaseLink = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      purchase_links: prev.purchase_links.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const removePurchaseLink = (index) => {
    setFormData(prev => ({
      ...prev,
      purchase_links: prev.purchase_links.filter((_, i) => i !== index)
    }));
  };

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      author_social_links: [...prev.author_social_links, '']
    }));
  };

  const updateSocialLink = (index, value) => {
    setFormData(prev => ({
      ...prev,
      author_social_links: prev.author_social_links.map((link, i) => 
        i === index ? value : link
      )
    }));
  };

  const removeSocialLink = (index) => {
    setFormData(prev => ({
      ...prev,
      author_social_links: prev.author_social_links.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (field, file) => {
    if (field === 'additional_images') {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], file]
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  const removeFile = (field, index) => {
    if (field === 'additional_images') {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: null }));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookTypes.map((type) => (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateFormData('book_type', type.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.book_type === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <h4 className="font-semibold text-gray-900 mb-1">{type.name}</h4>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </motion.button>
              ))}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your book title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => updateFormData('subtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter subtitle (optional)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.short_description}
                  onChange={(e) => updateFormData('short_description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief summary (max 200 characters)"
                  maxLength={200}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Detailed description of your book..."
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Author & Publishing Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author Name *</label>
                <input
                  type="text"
                  value={formData.author_name}
                  onChange={(e) => updateFormData('author_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Author name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publisher *</label>
                <input
                  type="text"
                  value={formData.publisher}
                  onChange={(e) => updateFormData('publisher', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Publisher name"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author Bio</label>
              <textarea
                value={formData.author_bio}
                onChange={(e) => updateFormData('author_bio', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief author biography..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload('author_photo', e.target.files[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {formData.author_photo && (
                <div className="mt-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">Photo uploaded</span>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author Social Links</label>
              {formData.author_social_links.map((link, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => updateSocialLink(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://twitter.com/author"
                  />
                  <button
                    type="button"
                    onClick={() => removeSocialLink(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSocialLink}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200"
              >
                + Add Social Link
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publication Date</label>
                <input
                  type="date"
                  value={formData.publication_date}
                  onChange={(e) => updateFormData('publication_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => updateFormData('isbn', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="978-1234567890"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pages</label>
                <input
                  type="number"
                  value={formData.pages}
                  onChange={(e) => updateFormData('pages', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="350"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select
                  value={formData.language}
                  onChange={(e) => updateFormData('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select language</option>
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                <input
                  type="text"
                  value={formData.age_range}
                  onChange={(e) => updateFormData('age_range', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="12+"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Edition</label>
                <input
                  type="text"
                  value={formData.edition}
                  onChange={(e) => updateFormData('edition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="First Edition"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Classification & Pricing</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Genre *</label>
                <select
                  value={formData.genre}
                  onChange={(e) => updateFormData('genre', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select genre</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Format *</label>
                <select
                  value={formData.format}
                  onChange={(e) => updateFormData('format', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select format</option>
                  {formats.map(format => (
                    <option key={format.id} value={format.id}>{format.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => updateFormData('price', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="19.99"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => updateFormData('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Series Name</label>
                <input
                  type="text"
                  value={formData.series_name}
                  onChange={(e) => updateFormData('series_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Adventure Series"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Media Upload</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('cover_image', e.target.files[0])}
                  className="hidden"
                  id="cover-image"
                />
                <label htmlFor="cover-image" className="cursor-pointer">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Click to upload cover image</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                </label>
              </div>
              {formData.cover_image && (
                <div className="mt-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">{formData.cover_image.name}</span>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    Array.from(e.target.files).forEach(file => {
                      handleFileUpload('additional_images', file);
                    });
                  }}
                  className="hidden"
                  id="additional-images"
                />
                <label htmlFor="additional-images" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Click to upload additional images</p>
                  <p className="text-sm text-gray-500">Multiple files allowed</p>
                </label>
              </div>
              {formData.additional_images.length > 0 && (
                <div className="mt-2 space-y-1">
                  {formData.additional_images.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile('additional_images', index)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trailer Video URL</label>
              <input
                type="url"
                value={formData.trailer_video_url}
                onChange={(e) => updateFormData('trailer_video_url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sample Files</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".pdf,.epub,.mobi"
                  multiple
                  onChange={(e) => {
                    Array.from(e.target.files).forEach(file => {
                      handleFileUpload('sample_files', file);
                    });
                  }}
                  className="hidden"
                  id="sample-files"
                />
                <label htmlFor="sample-files" className="cursor-pointer">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Click to upload sample chapters</p>
                  <p className="text-sm text-gray-500">PDF, EPUB, MOBI files</p>
                </label>
              </div>
              {formData.sample_files.length > 0 && (
                <div className="mt-2 space-y-1">
                  {formData.sample_files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile('sample_files', index)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Purchase Links</h3>
            
            {formData.purchase_links.map((link, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                    <input
                      type="text"
                      value={link.platform}
                      onChange={(e) => updatePurchaseLink(index, 'platform', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Amazon, Apple Books, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updatePurchaseLink(index, 'url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removePurchaseLink(index)}
                  className="mt-2 text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg text-sm"
                >
                  Remove Link
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addPurchaseLink}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200"
            >
              + Add Purchase Link
            </button>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Location Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
              <select
                value={formData.country}
                onChange={(e) => updateFormData('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select country</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location Address</label>
              <textarea
                value={formData.location_address}
                onChange={(e) => updateFormData('location_address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter address where book is available or based"
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Premium Promotion</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pricingPlans.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateFormData('upsell_tier', plan.id.toString())}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    formData.upsell_tier === plan.id.toString()
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  } ${plan.is_featured ? 'ring-2 ring-purple-500' : ''}`}
                >
                  {plan.is_featured && (
                    <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full inline-block mb-2">
                      Most Popular
                    </div>
                  )}
                  <h4 className="font-semibold text-gray-900 mb-1">{plan.name}</h4>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    ${plan.price}
                    {plan.duration_days && (
                      <span className="text-sm text-gray-600 font-normal">
                        /{plan.duration_days} days
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                  <ul className="space-y-1">
                    {plan.features?.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Review & Submit</h3>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Book Summary</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Title:</strong> {formData.title}</div>
                <div><strong>Author:</strong> {formData.author_name}</div>
                <div><strong>Genre:</strong> {formData.genre}</div>
                <div><strong>Format:</strong> {formats.find(f => f.id === formData.format)?.name}</div>
                <div><strong>Price:</strong> {formData.currency} {formData.price}</div>
                <div><strong>Cover Image:</strong> {formData.cover_image ? 'Uploaded' : 'Not uploaded'}</div>
                <div><strong>Purchase Links:</strong> {formData.purchase_links.length} added</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.agreed_to_terms}
                  onChange={(e) => updateFormData('agreed_to_terms', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">
                  I agree to the terms and conditions and privacy policy
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.verified_author}
                  onChange={(e) => updateFormData('verified_author', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">
                  I want to apply for verified author status (additional verification required)
                </span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Post Your Book</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="mt-4">
            <div className="flex items-center justify-between">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    currentStep >= step.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <div className={`ml-2 text-sm ${
                    currentStep >= step.id ? 'text-blue-600 font-medium' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  {step.id < totalSteps && (
                    <div className={`ml-4 w-8 h-0.5 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
            
            <div className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </div>
            
            {currentStep === totalSteps ? (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Submit Book
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksPostForm;
