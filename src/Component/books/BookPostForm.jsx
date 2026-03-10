import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, Check, Star, Globe, MapPin, CreditCard, Shield, Crown, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookPostForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Section 1: Book Type
    bookType: '',
    
    // Section 2: Basic Information
    title: '',
    subtitle: '',
    author: '',
    genre: '',
    country: '',
    language: '',
    price: '',
    format: '',
    
    // Section 3: Media Upload
    coverImage: null,
    additionalImages: [],
    trailerVideo: '',
    
    // Section 4: Book Description
    overview: '',
    keyThemes: '',
    targetAudience: '',
    whyRead: '',
    authorNote: '',
    
    // Section 5: Additional Details
    isbn: '',
    publisher: '',
    publicationDate: '',
    pages: '',
    ageRange: '',
    seriesName: '',
    edition: '',
    
    // Section 6: Upload Extras
    samplePages: null,
    audiobookSample: null,
    
    // Section 7: Author Information
    authorPhoto: null,
    authorBio: '',
    authorWebsite: '',
    authorSocial: {
      twitter: '',
      instagram: '',
      facebook: '',
      linkedin: ''
    },
    authorEmail: '',
    verifiedAuthor: false,
    
    // Section 8: Purchase Links
    purchaseLinks: {
      amazon: '',
      kobo: '',
      appleBooks: '',
      googlePlay: '',
      bookshop: '',
      audible: '',
      authorWebsite: ''
    },
    
    // Section 9: Location Map
    location: {
      enabled: false,
      lat: null,
      lng: null,
      address: ''
    },
    
    // Section 10: Premium Upsell
    promotionTier: '',
    
    // Final: Terms
    termsAccepted: false,
    accurateInfo: false
  });

  const [totalCost, setTotalCost] = useState(0);

  const bookTypes = [
    { id: 'fiction', name: 'Fiction', icon: '📚', description: 'Novels, stories, and narrative fiction' },
    { id: 'non-fiction', name: 'Non-Fiction', icon: '📖', description: 'Factual books, biographies, and educational content' },
    { id: 'children', name: "Children's Book", icon: '🧸', description: 'Books for young readers and children' },
    { id: 'poetry', name: 'Poetry', icon: '📝', description: 'Poetry collections and verse' },
    { id: 'academic', name: 'Academic/Educational', icon: '🎓', description: 'Textbooks and scholarly works' },
    { id: 'self-help', name: 'Self-Help', icon: '💡', description: 'Personal development and self-improvement' },
    { id: 'business', name: 'Business/Finance', icon: '💼', description: 'Business, finance, and entrepreneurship' },
    { id: 'other', name: 'Other', icon: '📄', description: 'Other book types and categories' }
  ];

  const genres = [
    'Fiction', 'Non-Fiction', 'Romance', 'Thriller', 'Mystery', 'Fantasy', 
    'Sci-Fi', 'Self-Help', 'Business', "Children's Books", 'Poetry', 
    'Biographies', 'Spirituality', 'Academic'
  ];

  const formats = ['Paperback', 'Hardcover', 'eBook', 'Audiobook'];

  const promotionTiers = [
    {
      id: 'free',
      name: 'Basic Listing',
      price: 0,
      duration: '30 days',
      features: ['Basic listing', 'Standard visibility', 'No promotion badge'],
      badge: null,
      icon: Globe,
      color: 'from-gray-400 to-gray-600'
    },
    {
      id: 'promoted',
      name: 'Promoted',
      price: 29,
      duration: '30 days',
      features: ['Enhanced visibility', 'Promoted badge', 'Priority placement', 'Basic analytics'],
      badge: 'Promoted',
      icon: Star,
      color: 'from-blue-400 to-blue-600',
      popular: false
    },
    {
      id: 'featured',
      name: 'Featured',
      price: 49,
      duration: '30 days',
      features: ['Premium placement', 'Featured badge', 'Homepage showcase', 'Advanced analytics', 'Social media promotion'],
      badge: 'Featured',
      icon: Crown,
      color: 'from-purple-400 to-purple-600',
      popular: true
    },
    {
      id: 'sponsored',
      name: 'Sponsored',
      price: 99,
      duration: '30 days',
      features: ['Maximum visibility', 'Sponsored badge', 'Top placement', 'Premium analytics', 'Full promotion campaign', 'Dedicated support'],
      badge: 'Sponsored',
      icon: Zap,
      color: 'from-green-400 to-green-600',
      popular: false
    }
  ];

  useEffect(() => {
    const tier = promotionTiers.find(t => t.id === formData.promotionTier);
    setTotalCost(tier ? tier.price : 0);
  }, [formData.promotionTier]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parentField, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [field]: value
      }
    }));
  };

  const handleFileUpload = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleMultipleFileUpload = (field, files) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ...files]
    }));
  };

  const handleNext = () => {
    if (currentStep < 10) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBackToBooks = () => {
    navigate('/books');
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', formData);
    // Navigate to payment or success page
    navigate('/books?success=true');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Book Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleInputChange('bookType', type.id)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    formData.bookType === type.id
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{type.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{type.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Book Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Book Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter book title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Optional subtitle or tagline"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author Name *</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Author name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Genre *</label>
                <select
                  value={formData.genre}
                  onChange={(e) => handleInputChange('genre', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Select genre</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Select country</option>
                  <option value="usa">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="canada">Canada</option>
                  <option value="australia">Australia</option>
                  <option value="india">India</option>
                  <option value="nigeria">Nigeria</option>
                  <option value="germany">Germany</option>
                  <option value="france">France</option>
                  <option value="japan">Japan</option>
                  <option value="brazil">Brazil</option>
                  <option value="mexico">Mexico</option>
                  <option value="south-africa">South Africa</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="e.g., English, Spanish, French"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Format *</label>
                <select
                  value={formData.format}
                  onChange={(e) => handleInputChange('format', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Select format</option>
                  {formats.map(format => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Media Upload</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Book Cover Image *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Upload book cover image</p>
                <p className="text-sm text-gray-500">Recommended: 1400 x 2100 pixels, max 5MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('coverImage', e.target.files[0])}
                  className="hidden"
                  id="cover-upload"
                />
                <label
                  htmlFor="cover-upload"
                  className="inline-block bg-yellow-400 text-yellow-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 cursor-pointer transition-colors"
                >
                  Choose File
                </label>
                {formData.coverImage && (
                  <div className="mt-4 text-sm text-green-600">
                    ✓ {formData.coverImage.name}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">Upload additional images</p>
                <p className="text-sm text-gray-500">Interior pages, author photos, etc.</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleMultipleFileUpload('additionalImages', Array.from(e.target.files))}
                  className="hidden"
                  id="additional-upload"
                />
                <label
                  htmlFor="additional-upload"
                  className="inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 cursor-pointer transition-colors"
                >
                  Add Images
                </label>
                {formData.additionalImages.length > 0 && (
                  <div className="mt-4 text-sm text-green-600">
                    ✓ {formData.additionalImages.length} images selected
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Book Trailer Video (Optional)</label>
              <input
                type="url"
                value={formData.trailerVideo}
                onChange={(e) => handleInputChange('trailerVideo', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="YouTube or Vimeo video URL"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Description</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Overview / Synopsis *</label>
              <textarea
                value={formData.overview}
                onChange={(e) => handleInputChange('overview', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Provide a compelling overview of your book..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Themes</label>
              <textarea
                value={formData.keyThemes}
                onChange={(e) => handleInputChange('keyThemes', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Main themes and topics covered in your book..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
              <textarea
                value={formData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Who is this book for? Describe your ideal readers..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Why Readers Will Love This Book</label>
              <textarea
                value={formData.whyRead}
                onChange={(e) => handleInputChange('whyRead', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="What makes your book special and compelling..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author Note (Optional)</label>
              <textarea
                value={formData.authorNote}
                onChange={(e) => handleInputChange('authorNote', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Personal message from the author to readers..."
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Book Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ISBN (Optional)</label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => handleInputChange('isbn', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="ISBN-10 or ISBN-13"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Publisher (Optional)</label>
                <input
                  type="text"
                  value={formData.publisher}
                  onChange={(e) => handleInputChange('publisher', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Publisher name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Publication Date</label>
                <input
                  type="date"
                  value={formData.publicationDate}
                  onChange={(e) => handleInputChange('publicationDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Pages</label>
                <input
                  type="number"
                  value={formData.pages}
                  onChange={(e) => handleInputChange('pages', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Page count"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Range (Optional)</label>
                <input
                  type="text"
                  value={formData.ageRange}
                  onChange={(e) => handleInputChange('ageRange', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="e.g., 8-12 years, Young Adult, Adult"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Series Name (Optional)</label>
                <input
                  type="text"
                  value={formData.seriesName}
                  onChange={(e) => handleInputChange('seriesName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="If part of a series"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Edition (Optional)</label>
                <input
                  type="text"
                  value={formData.edition}
                  onChange={(e) => handleInputChange('edition', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="e.g., First Edition, Revised Edition"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Extras</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sample Pages (PDF)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">Upload sample pages PDF</p>
                <p className="text-sm text-gray-500">Let readers preview your book</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload('samplePages', e.target.files[0])}
                  className="hidden"
                  id="sample-upload"
                />
                <label
                  htmlFor="sample-upload"
                  className="inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 cursor-pointer transition-colors"
                >
                  Choose PDF
                </label>
                {formData.samplePages && (
                  <div className="mt-4 text-sm text-green-600">
                    ✓ {formData.samplePages.name}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Audiobook Sample (MP3)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">Upload audiobook sample</p>
                <p className="text-sm text-gray-500">For audiobooks only</p>
                <input
                  type="file"
                  accept=".mp3,.wav,.m4a"
                  onChange={(e) => handleFileUpload('audiobookSample', e.target.files[0])}
                  className="hidden"
                  id="audio-upload"
                />
                <label
                  htmlFor="audio-upload"
                  className="inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 cursor-pointer transition-colors"
                >
                  Choose Audio
                </label>
                {formData.audiobookSample && (
                  <div className="mt-4 text-sm text-green-600">
                    ✓ {formData.audiobookSample.name}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Author Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author Photo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">Upload author photo</p>
                <p className="text-sm text-gray-500">Professional headshot recommended</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('authorPhoto', e.target.files[0])}
                  className="hidden"
                  id="author-photo-upload"
                />
                <label
                  htmlFor="author-photo-upload"
                  className="inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 cursor-pointer transition-colors"
                >
                  Choose Photo
                </label>
                {formData.authorPhoto && (
                  <div className="mt-4 text-sm text-green-600">
                    ✓ {formData.authorPhoto.name}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author Bio *</label>
              <textarea
                value={formData.authorBio}
                onChange={(e) => handleInputChange('authorBio', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Tell readers about yourself and your writing..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author Website</label>
                <input
                  type="url"
                  value={formData.authorWebsite}
                  onChange={(e) => handleInputChange('authorWebsite', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="https://authorwebsite.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.authorEmail}
                  onChange={(e) => handleInputChange('authorEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="author@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Social Media Links</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="url"
                  value={formData.authorSocial.twitter}
                  onChange={(e) => handleNestedInputChange('authorSocial', 'twitter', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Twitter URL"
                />
                <input
                  type="url"
                  value={formData.authorSocial.instagram}
                  onChange={(e) => handleNestedInputChange('authorSocial', 'instagram', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Instagram URL"
                />
                <input
                  type="url"
                  value={formData.authorSocial.facebook}
                  onChange={(e) => handleNestedInputChange('authorSocial', 'facebook', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Facebook URL"
                />
                <input
                  type="url"
                  value={formData.authorSocial.linkedin}
                  onChange={(e) => handleNestedInputChange('authorSocial', 'linkedin', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="LinkedIn URL"
                />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.verifiedAuthor}
                  onChange={(e) => handleInputChange('verifiedAuthor', e.target.checked)}
                  className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Get Verified Author Badge</span>
                  <p className="text-sm text-gray-600">Add credibility to your profile with verification (+$10)</p>
                </div>
              </label>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Purchase Links</h2>
            <p className="text-gray-600 mb-6">Add links where readers can purchase your book</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amazon Link</label>
                <input
                  type="url"
                  value={formData.purchaseLinks.amazon}
                  onChange={(e) => handleNestedInputChange('purchaseLinks', 'amazon', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Amazon purchase URL"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kobo Link</label>
                <input
                  type="url"
                  value={formData.purchaseLinks.kobo}
                  onChange={(e) => handleNestedInputChange('purchaseLinks', 'kobo', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Kobo purchase URL"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apple Books Link</label>
                <input
                  type="url"
                  value={formData.purchaseLinks.appleBooks}
                  onChange={(e) => handleNestedInputChange('purchaseLinks', 'appleBooks', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Apple Books URL"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Google Play Books Link</label>
                <input
                  type="url"
                  value={formData.purchaseLinks.googlePlay}
                  onChange={(e) => handleNestedInputChange('purchaseLinks', 'googlePlay', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Google Play Books URL"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bookshop Link</label>
                <input
                  type="url"
                  value={formData.purchaseLinks.bookshop}
                  onChange={(e) => handleNestedInputChange('purchaseLinks', 'bookshop', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Bookshop.org URL"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Audible Link</label>
                <input
                  type="url"
                  value={formData.purchaseLinks.audible}
                  onChange={(e) => handleNestedInputChange('purchaseLinks', 'audible', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Audible URL"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Author Website Purchase Link</label>
                <input
                  type="url"
                  value={formData.purchaseLinks.authorWebsite}
                  onChange={(e) => handleNestedInputChange('purchaseLinks', 'authorWebsite', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Direct purchase from your website"
                />
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Location Map (Optional)</h2>
            <p className="text-gray-600 mb-6">Useful for book signings, local events, or regional sales</p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <label className="flex items-center space-x-3 mb-6">
                <input
                  type="checkbox"
                  checked={formData.location.enabled}
                  onChange={(e) => handleNestedInputChange('location', 'enabled', e.target.checked)}
                  className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                />
                <span className="font-medium text-gray-900">Enable location for this book</span>
              </label>

              {formData.location.enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={formData.location.address}
                      onChange={(e) => handleNestedInputChange('location', 'address', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Enter address or select 'Not Applicable'"
                    />
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> You can also select "Not Applicable" if this is a digital-only book with no physical location.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 10:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Premium Upsell Options</h2>
            <p className="text-gray-600 mb-6">Boost your book's visibility with our promotion tiers</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {promotionTiers.map((tier) => {
                const IconComponent = tier.icon;
                return (
                  <div
                    key={tier.id}
                    onClick={() => handleInputChange('promotionTier', tier.id)}
                    className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all ${
                      formData.promotionTier === tier.id
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-2">{tier.name}</h3>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      ${tier.price}
                      <span className="text-sm text-gray-500 font-normal">/{tier.duration}</span>
                    </div>
                    
                    <ul className="space-y-2 mt-4">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Comparison Table */}
            <div className="mt-8 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-4 font-semibold text-gray-900">Features</th>
                    {promotionTiers.map((tier) => (
                      <th key={tier.id} className="text-center p-4 font-semibold text-gray-900">
                        {tier.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 text-gray-700">Basic Listing</td>
                    {promotionTiers.map((tier) => (
                      <td key={tier.id} className="text-center p-4">
                        {tier.features.includes('Basic listing') ? '✓' : '✗'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 text-gray-700">Priority Placement</td>
                    {promotionTiers.map((tier) => (
                      <td key={tier.id} className="text-center p-4">
                        {tier.features.includes('Priority placement') ? '✓' : '✗'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 text-gray-700">Homepage Showcase</td>
                    {promotionTiers.map((tier) => (
                      <td key={tier.id} className="text-center p-4">
                        {tier.features.includes('Homepage showcase') ? '✓' : '✗'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 text-gray-700">Social Media Promotion</td>
                    {promotionTiers.map((tier) => (
                      <td key={tier.id} className="text-center p-4">
                        {tier.features.includes('Social media promotion') ? '✓' : '✗'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToBooks}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Books</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Step {currentStep} of 10</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {renderStepContent()}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-8 border-t">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>

            {currentStep < 10 ? (
              <button
                onClick={handleNext}
                className="bg-yellow-400 text-yellow-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
              >
                Next Step
              </button>
            ) : (
              <div className="space-y-4">
                {/* Final checkboxes */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.accurateInfo}
                      onChange={(e) => handleInputChange('accurateInfo', e.target.checked)}
                      className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                    <span className="text-gray-700">
                      I confirm this book advert information is accurate
                    </span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                      className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                    <span className="text-gray-700">
                      I agree to the terms and conditions
                    </span>
                  </label>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleSubmit}
                    disabled={!formData.accurateInfo || !formData.termsAccepted}
                    className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                      formData.accurateInfo && formData.termsAccepted
                        ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Submit Book Advert
                  </button>
                  
                  <div className="text-lg font-semibold text-gray-900">
                    Total: ${totalCost}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPostForm;
