import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaCar, FaHome, FaBook, FaLaptop, FaCamera, FaMusic, FaBaby, FaTools, FaDog, FaTshirt, FaGamepad, FaDumbbell, FaUtensils, FaPlane, FaHeartbeat, FaGraduationCap, FaBriefcase, FaStore, FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';
import api from '../../api';
import toast from 'react-hot-toast';

const SubcategoryPostingForm = () => {
  const { category, subcategory } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: category,
    subcategory: subcategory,
    condition: 'good',
    location: {
      city: '',
      state: '',
      country: '',
      address: ''
    },
    contact: {
      phone: '',
      email: '',
      preferred_contact: 'phone'
    },
    images: [],
    specifications: {},
    additional_info: ''
  });

  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  // Category-specific field configurations
  const categoryConfigs = {
    vehicles: {
      icon: <FaCar className="h-6 w-6" />,
      title: 'Vehicle Listing',
      color: 'from-blue-500 to-blue-600',
      fields: {
        specifications: {
          make: '',
          model: '',
          year: '',
          mileage: '',
          fuel_type: 'gasoline',
          transmission: 'manual',
          body_type: 'sedan',
          color: '',
          vin: '',
          engine_size: '',
          features: []
        }
      },
      conditions: ['new', 'like_new', 'excellent', 'good', 'fair', 'poor'],
      fuelTypes: ['gasoline', 'diesel', 'electric', 'hybrid', 'lpg', 'other'],
      transmissions: ['manual', 'automatic', 'cvt', 'semi-automatic'],
      bodyTypes: ['sedan', 'hatchback', 'suv', 'truck', 'van', 'convertible', 'coupe', 'wagon', 'other'],
      features: ['air_conditioning', 'power_steering', 'abs', 'cruise_control', 'navigation', 'bluetooth', 'leather_seats', 'sunroof', 'alloy_wheels', 'parking_sensors', 'backup_camera']
    },
    property: {
      icon: <FaHome className="h-6 w-6" />,
      title: 'Property Listing',
      color: 'from-green-500 to-green-600',
      fields: {
        specifications: {
          property_type: 'house',
          bedrooms: 1,
          bathrooms: 1,
          square_feet: '',
          lot_size: '',
          year_built: '',
          parking_spaces: 0,
          garage: false,
          pool: false,
          furnished: false,
          pet_friendly: false,
          heating: 'central',
          cooling: 'central',
          amenities: []
        }
      },
      conditions: ['new', 'like_new', 'excellent', 'good', 'fair', 'needs_renovation'],
      propertyTypes: ['house', 'apartment', 'condo', 'townhouse', 'villa', 'cottage', 'land', 'commercial', 'other'],
      amenities: ['air_conditioning', 'heating', 'parking', 'garden', 'balcony', 'storage', 'security_system', 'elevator', 'gym', 'pool', 'playground', 'near_school', 'near_transit']
    },
    electronics: {
      icon: <FaLaptop className="h-6 w-6" />,
      title: 'Electronics Listing',
      color: 'from-purple-500 to-purple-600',
      fields: {
        specifications: {
          brand: '',
          model: '',
          condition: 'used',
          warranty: false,
          original_price: '',
          accessories: [],
          specifications: {}
        }
      },
      conditions: ['brand_new', 'like_new', 'excellent', 'good', 'fair', 'for_parts'],
      brands: ['Apple', 'Samsung', 'Sony', 'LG', 'Microsoft', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Toshiba', 'Other'],
      accessories: ['charger', 'case', 'screen_protector', 'headphones', 'keyboard', 'mouse', 'cables', 'manual', 'original_box', 'warranty_card']
    },
    fashion: {
      icon: <FaTshirt className="h-6 w-6" />,
      title: 'Fashion Listing',
      color: 'from-pink-500 to-pink-600',
      fields: {
        specifications: {
          brand: '',
          size: '',
          color: '',
          material: '',
          condition: 'used',
          gender: 'unisex',
          season: '',
          style: '',
          occasion: ''
        }
      },
      conditions: ['brand_new_with_tags', 'like_new', 'excellent', 'good', 'fair', 'worn'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'],
      materials: ['cotton', 'polyester', 'wool', 'silk', 'denim', 'leather', 'linen', 'rayon', 'spandex', 'velvet', 'other'],
      genders: ['men', 'women', 'unisex', 'kids', 'boys', 'girls'],
      seasons: ['spring', 'summer', 'fall', 'winter', 'all_season']
    },
    books: {
      icon: <FaBook className="h-6 w-6" />,
      title: 'Book Listing',
      color: 'from-indigo-500 to-indigo-600',
      fields: {
        specifications: {
          author: '',
          isbn: '',
          publisher: '',
          year_published: '',
          genre: '',
          language: 'english',
          condition: 'good',
          pages: '',
          hardcover: false,
          edition: '',
          signed: false
        }
      },
      conditions: ['brand_new', 'like_new', 'excellent', 'good', 'fair', 'poor', 'very_poor'],
      genres: ['fiction', 'non-fiction', 'biography', 'history', 'science', 'technology', 'business', 'self_help', 'children', 'textbook', 'romance', 'mystery', 'thriller', 'fantasy', 'other'],
      languages: ['english', 'spanish', 'french', 'german', 'italian', 'portuguese', 'chinese', 'japanese', 'arabic', 'russian', 'other']
    }
  };

  const currentConfig = categoryConfigs[category] || categoryConfigs.vehicles;

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      category,
      subcategory,
      specifications: currentConfig.fields.specifications
    }));
  }, [category, subcategory]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecificationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value
      }
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
    
    setPreviewImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Add basic fields
      Object.keys(formData).forEach(key => {
        if (key === 'images') {
          formData.images.forEach((img, index) => {
            formDataToSend.append(`images[${index}]`, img.file);
          });
        } else if (key === 'specifications') {
          formDataToSend.append('specifications', JSON.stringify(formData.specifications));
        } else if (key === 'location') {
          formDataToSend.append('location', JSON.stringify(formData.location));
        } else if (key === 'contact') {
          formDataToSend.append('contact', JSON.stringify(formData.contact));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await api.post('/listings/create', formDataToSend);
      
      if (response.data.success) {
        toast.success('Listing created successfully!');
        navigate(`/ads-detail/${response.data.slug}`);
      } else {
        toast.error(response.data.message || 'Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const renderSpecificationFields = () => {
    const specs = formData.specifications;
    const config = currentConfig.fields.specifications;

    switch (category) {
      case 'vehicles':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
              <input
                type="text"
                value={specs.make}
                onChange={(e) => handleSpecificationChange('make', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Toyota, Honda, Ford"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
              <input
                type="text"
                value={specs.model}
                onChange={(e) => handleSpecificationChange('model', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Camry, Civic, F-150"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <input
                type="number"
                value={specs.year}
                onChange={(e) => handleSpecificationChange('year', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 2020"
                min="1900"
                max={new Date().getFullYear() + 1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mileage</label>
              <input
                type="number"
                value={specs.mileage}
                onChange={(e) => handleSpecificationChange('mileage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 50000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
              <select
                value={specs.fuel_type}
                onChange={(e) => handleSpecificationChange('fuel_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {currentConfig.fuelTypes.map(type => (
                  <option key={type} value={type}>{type.replace('_', ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
              <select
                value={specs.transmission}
                onChange={(e) => handleSpecificationChange('transmission', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {currentConfig.transmissions.map(type => (
                  <option key={type} value={type}>{type.replace('_', ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Body Type</label>
              <select
                value={specs.body_type}
                onChange={(e) => handleSpecificationChange('body_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {currentConfig.bodyTypes.map(type => (
                  <option key={type} value={type}>{type.replace('_', ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <input
                type="text"
                value={specs.color}
                onChange={(e) => handleSpecificationChange('color', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Black, White, Silver"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {currentConfig.features.map(feature => (
                  <label key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={specs.features?.includes(feature)}
                      onChange={(e) => {
                        const features = specs.features || [];
                        if (e.target.checked) {
                          handleSpecificationChange('features', [...features, feature]);
                        } else {
                          handleSpecificationChange('features', features.filter(f => f !== feature));
                        }
                      }}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{feature.replace('_', ' ').toUpperCase()}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'property':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                value={specs.property_type}
                onChange={(e) => handleSpecificationChange('property_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {currentConfig.propertyTypes.map(type => (
                  <option key={type} value={type}>{type.replace('_', ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
              <input
                type="number"
                value={specs.bedrooms}
                onChange={(e) => handleSpecificationChange('bedrooms', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
                max="20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
              <input
                type="number"
                value={specs.bathrooms}
                onChange={(e) => handleSpecificationChange('bathrooms', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
                max="20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Square Feet</label>
              <input
                type="number"
                value={specs.square_feet}
                onChange={(e) => handleSpecificationChange('square_feet', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 1500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year Built</label>
              <input
                type="number"
                value={specs.year_built}
                onChange={(e) => handleSpecificationChange('year_built', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 2005"
                min="1800"
                max={new Date().getFullYear() + 1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Parking Spaces</label>
              <input
                type="number"
                value={specs.parking_spaces}
                onChange={(e) => handleSpecificationChange('parking_spaces', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={specs.garage}
                  onChange={(e) => handleSpecificationChange('garage', e.target.checked)}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Garage</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={specs.pool}
                  onChange={(e) => handleSpecificationChange('pool', e.target.checked)}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Pool</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={specs.furnished}
                  onChange={(e) => handleSpecificationChange('furnished', e.target.checked)}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Furnished</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {currentConfig.amenities.map(amenity => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={specs.amenities?.includes(amenity)}
                      onChange={(e) => {
                        const amenities = specs.amenities || [];
                        if (e.target.checked) {
                          handleSpecificationChange('amenities', [...amenities, amenity]);
                        } else {
                          handleSpecificationChange('amenities', amenities.filter(a => a !== amenity));
                        }
                      }}
                      className="mr-2 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{amenity.replace('_', ' ').toUpperCase()}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <p>No specific fields available for this category.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${currentConfig.color} text-white`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              to={`/category/${category}`}
              className="inline-flex items-center px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <FaArrowLeft className="h-4 w-4 mr-2" />
              Back to {category}
            </Link>
            <div className="flex items-center gap-3">
              {currentConfig.icon}
              <h1 className="text-2xl font-bold">{currentConfig.title}</h1>
            </div>
          </div>
          <p className="text-white/90">
            Create a specialized listing for {category} {subcategory && `- ${subcategory.replace('-', ' ')}`}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter a descriptive title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Provide a detailed description of your item"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {currentConfig.conditions.map(condition => (
                      <option key={condition} value={condition}>
                        {condition.replace('_', ' ').toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Category-Specific Specifications */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Specifications</h2>
              {renderSpecificationFields()}
            </div>

            {/* Location */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.location.city}
                    onChange={(e) => handleInputChange('location', {
                      ...formData.location,
                      city: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., New York"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                  <input
                    type="text"
                    value={formData.location.state}
                    onChange={(e) => handleInputChange('location', {
                      ...formData.location,
                      state: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., California"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={formData.location.country}
                    onChange={(e) => handleInputChange('location', {
                      ...formData.location,
                      country: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., United States"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={formData.location.address}
                    onChange={(e) => handleInputChange('location', {
                      ...formData.location,
                      address: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Street address"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={formData.contact.phone}
                    onChange={(e) => handleInputChange('contact', {
                      ...formData.contact,
                      phone: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(123) 456-7890"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => handleInputChange('contact', {
                      ...formData.contact,
                      email: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact</label>
                  <select
                    value={formData.contact.preferred_contact}
                    onChange={(e) => handleInputChange('contact', {
                      ...formData.contact,
                      preferred_contact: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="phone">Phone</option>
                    <option value="email">Email</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Images</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaSave className="mr-2 h-4 w-4" />
                    Upload Images
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Upload up to 10 images. Supported formats: JPG, PNG, GIF
                  </p>
                </div>
                
                {previewImages.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {previewImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.preview}
                          alt={image.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTimes className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Information</h2>
              <textarea
                value={formData.additional_info}
                onChange={(e) => handleInputChange('additional_info', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Any additional information that might be helpful for buyers"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <FaSave className="h-4 w-4" />
                    Create Listing
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubcategoryPostingForm;
