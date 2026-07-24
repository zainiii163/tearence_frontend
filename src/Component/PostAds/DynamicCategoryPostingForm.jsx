import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiUpload, FiX } from 'react-icons/fi';
import { FaCar, FaHome, FaBook, FaTshirt, FaMobile, FaLaptop, FaChair, FaDumbbell, FaBaby, FaGamepad, FaCamera, FaMusic, FaPaintBrush } from 'react-icons/fa';
import toast from 'react-hot-toast';
import ListServices from '../../services/ListServices';
import Api from '../../api';

// Category-specific field configurations
const categoryFormConfigs = {
  vehicles: {
    icon: <FaCar />,
    fields: [
      { name: 'make', label: 'Make', type: 'text', required: true },
      { name: 'model', label: 'Model', type: 'text', required: true },
      { name: 'year', label: 'Year', type: 'number', required: true },
      { name: 'mileage', label: 'Mileage', type: 'number', required: true },
      { name: 'condition', label: 'Condition', type: 'select', options: ['New', 'Like New', 'Excellent', 'Good', 'Fair'], required: true },
      { name: 'fuel_type', label: 'Fuel Type', type: 'select', options: ['Petrol', 'Diesel', 'Electric', 'Hybrid'], required: true },
      { name: 'transmission', label: 'Transmission', type: 'select', options: ['Manual', 'Automatic', 'CVT'], required: true },
      { name: 'price', label: 'Price', type: 'number', required: true },
      { name: 'location', label: 'Location', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true }
    ]
  },
  property: {
    icon: <FaHome />,
    fields: [
      { name: 'property_type', label: 'Property Type', type: 'select', options: ['House', 'Apartment', 'Condo', 'Land', 'Commercial'], required: true },
      { name: 'bedrooms', label: 'Bedrooms', type: 'number', required: true },
      { name: 'bathrooms', label: 'Bathrooms', type: 'number', required: true },
      { name: 'area', label: 'Area (sq ft)', type: 'number', required: true },
      { name: 'price', label: 'Price', type: 'number', required: true },
      { name: 'location', label: 'Location', type: 'text', required: true },
      { name: 'furnished', label: 'Furnished', type: 'select', options: ['Yes', 'No', 'Partially'], required: true },
      { name: 'parking', label: 'Parking', type: 'select', options: ['Available', 'Not Available'], required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true }
    ]
  },
  books: {
    icon: <FaBook />,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'author', label: 'Author', type: 'text', required: true },
      { name: 'isbn', label: 'ISBN', type: 'text', required: false },
      { name: 'genre', label: 'Genre', type: 'select', options: ['Fiction', 'Non-Fiction', 'Educational', 'Technical', 'Children', 'Biography'], required: true },
      { name: 'condition', label: 'Condition', type: 'select', options: ['New', 'Like New', 'Good', 'Fair', 'Poor'], required: true },
      { name: 'price', label: 'Price', type: 'number', required: true },
      { name: 'format', label: 'Format', type: 'select', options: ['Hardcover', 'Paperback', 'E-book', 'Audiobook'], required: true },
      { name: 'language', label: 'Language', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true }
    ]
  },
  clothing: {
    icon: <FaTshirt />,
    fields: [
      { name: 'item_type', label: 'Item Type', type: 'select', options: ['Shirt', 'Pants', 'Dress', 'Jacket', 'Shoes', 'Accessories'], required: true },
      { name: 'brand', label: 'Brand', type: 'text', required: false },
      { name: 'size', label: 'Size', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'], required: true },
      { name: 'condition', label: 'Condition', type: 'select', options: ['New', 'Like New', 'Good', 'Fair'], required: true },
      { name: 'color', label: 'Color', type: 'text', required: true },
      { name: 'material', label: 'Material', type: 'text', required: false },
      { name: 'price', label: 'Price', type: 'number', required: true },
      { name: 'gender', label: 'Gender', type: 'select', options: ['Men', 'Women', 'Unisex', 'Kids'], required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true }
    ]
  },
  electronics: {
    icon: <FaMobile />,
    fields: [
      { name: 'item_type', label: 'Item Type', type: 'select', options: ['Smartphone', 'Laptop', 'Tablet', 'Desktop', 'TV', 'Camera', 'Gaming Console', 'Other'], required: true },
      { name: 'brand', label: 'Brand', type: 'text', required: true },
      { name: 'model', label: 'Model', type: 'text', required: true },
      { name: 'condition', label: 'Condition', type: 'select', options: ['New', 'Like New', 'Good', 'Fair', 'For Parts'], required: true },
      { name: 'price', label: 'Price', type: 'number', required: true },
      { name: 'warranty', label: 'Warranty', type: 'select', options: ['Yes', 'No', 'Expired'], required: true },
      { name: 'age', label: 'Age (months)', type: 'number', required: false },
      { name: 'description', label: 'Description', type: 'textarea', required: true }
    ]
  },
  furniture: {
    icon: <FaChair />,
    fields: [
      { name: 'item_type', label: 'Item Type', type: 'select', options: ['Sofa', 'Chair', 'Table', 'Bed', 'Wardrobe', 'Shelf', 'Desk', 'Other'], required: true },
      { name: 'material', label: 'Material', type: 'text', required: true },
      { name: 'condition', label: 'Condition', type: 'select', options: ['New', 'Like New', 'Good', 'Fair'], required: true },
      { name: 'color', label: 'Color', type: 'text', required: true },
      { name: 'dimensions', label: 'Dimensions (LxWxH)', type: 'text', required: true },
      { name: 'price', label: 'Price', type: 'number', required: true },
      { name: 'assembly_required', label: 'Assembly Required', type: 'select', options: ['Yes', 'No'], required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true }
    ]
  },
  sports: {
    icon: <FaDumbbell />,
    fields: [
      { name: 'item_type', label: 'Item Type', type: 'select', options: ['Equipment', 'Apparel', 'Footwear', 'Accessories', 'Other'], required: true },
      { name: 'sport', label: 'Sport', type: 'text', required: true },
      { name: 'brand', label: 'Brand', type: 'text', required: false },
      { name: 'condition', label: 'Condition', type: 'select', options: ['New', 'Like New', 'Good', 'Fair'], required: true },
      { name: 'size', label: 'Size', type: 'text', required: false },
      { name: 'price', label: 'Price', type: 'number', required: true },
      { name: 'age', label: 'Age (months)', type: 'number', required: false },
      { name: 'description', label: 'Description', type: 'textarea', required: true }
    ]
  },
  baby: {
    icon: <FaBaby />,
    fields: [
      { name: 'item_type', label: 'Item Type', type: 'select', options: ['Clothing', 'Toys', 'Furniture', 'Stroller', 'Car Seat', 'Feeding', 'Other'], required: true },
      { name: 'age_range', label: 'Age Range', type: 'text', required: true },
      { name: 'brand', label: 'Brand', type: 'text', required: false },
      { name: 'condition', label: 'Condition', type: 'select', options: ['New', 'Like New', 'Good', 'Fair'], required: true },
      { name: 'gender', label: 'Gender', type: 'select', options: ['Boy', 'Girl', 'Unisex'], required: false },
      { name: 'price', label: 'Price', type: 'number', required: true },
      { name: 'safety_certified', label: 'Safety Certified', type: 'select', options: ['Yes', 'No', 'Unknown'], required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true }
    ]
  },
  gaming: {
    icon: <FaGamepad />,
    fields: [
      { name: 'item_type', label: 'Item Type', type: 'select', options: ['Console', 'Games', 'Accessories', 'PC Components', 'Other'], required: true },
      { name: 'platform', label: 'Platform', type: 'select', options: ['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile'], required: true },
      { name: 'title', label: 'Title', type: 'text', required: false },
      { name: 'brand', label: 'Brand', type: 'text', required: false },
      { name: 'condition', label: 'Condition', type: 'select', options: ['New', 'Like New', 'Good', 'Fair'], required: true },
      { name: 'price', label: 'Price', type: 'number', required: true },
      { name: 'age_rating', label: 'Age Rating', type: 'select', options: ['E', 'E10+', 'T', 'M', 'AO'], required: false },
      { name: 'description', label: 'Description', type: 'textarea', required: true }
    ]
  },
  cameras: {
    icon: <FaCamera />,
    fields: [
      { name: 'item_type', label: 'Item Type', type: 'select', options: ['DSLR', 'Mirrorless', 'Point & Shoot', 'Action Camera', 'Video Camera', 'Lenses', 'Accessories'], required: true },
      { name: 'brand', label: 'Brand', type: 'text', required: true },
      { name: 'model', label: 'Model', type: 'text', required: true },
      { name: 'condition', label: 'Condition', type: 'select', options: ['New', 'Like New', 'Good', 'Fair'], required: true },
      { name: 'megapixels', label: 'Megapixels', type: 'number', required: false },
      { name: 'price', label: 'Price', type: 'number', required: true },
      { name: 'includes', label: 'Includes', type: 'textarea', required: false },
      { name: 'description', label: 'Description', type: 'textarea', required: true }
    ]
  },
  music: {
    icon: <FaMusic />,
    fields: [
      { name: 'item_type', label: 'Item Type', type: 'select', options: ['Instrument', 'Audio Equipment', 'Accessories', 'Sheet Music', 'Other'], required: true },
      { name: 'instrument_type', label: 'Instrument Type', type: 'text', required: false },
      { name: 'brand', label: 'Brand', type: 'text', required: false },
      { name: 'condition', label: 'Condition', type: 'select', options: ['New', 'Like New', 'Good', 'Fair'], required: true },
      { name: 'price', label: 'Price', type: 'number', required: true },
      { name: 'skill_level', label: 'Skill Level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced', 'Professional'], required: false },
      { name: 'description', label: 'Description', type: 'textarea', required: true }
    ]
  },
  art: {
    icon: <FaPaintBrush />,
    fields: [
      { name: 'item_type', label: 'Item Type', type: 'select', options: ['Painting', 'Sculpture', 'Print', 'Photography', 'Digital Art', 'Craft', 'Other'], required: true },
      { name: 'artist', label: 'Artist', type: 'text', required: false },
      { name: 'medium', label: 'Medium', type: 'text', required: true },
      { name: 'dimensions', label: 'Dimensions', type: 'text', required: true },
      { name: 'condition', label: 'Condition', type: 'select', options: ['New', 'Like New', 'Good', 'Fair'], required: true },
      { name: 'price', label: 'Price', type: 'number', required: true },
      { name: 'framed', label: 'Framed', type: 'select', options: ['Yes', 'No'], required: true },
      { name: 'year_created', label: 'Year Created', type: 'number', required: false },
      { name: 'description', label: 'Description', type: 'textarea', required: true }
    ]
  }
};

// Subcategory configurations
const subcategoryConfigs = {
  'vehicles/cars': {
    parent: 'vehicles',
    additionalFields: [
      { name: 'body_type', label: 'Body Type', type: 'select', options: ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Truck', 'Van'], required: true },
      { name: 'drivetrain', label: 'Drivetrain', type: 'select', options: ['FWD', 'RWD', 'AWD', '4WD'], required: true }
    ]
  },
  'vehicles/bikes': {
    parent: 'vehicles',
    additionalFields: [
      { name: 'bike_type', label: 'Bike Type', type: 'select', options: ['Sport', 'Cruiser', 'Touring', 'Off-road', 'Scooter'], required: true },
      { name: 'engine_capacity', label: 'Engine Capacity (cc)', type: 'number', required: true }
    ]
  },
  'electronics/computers': {
    parent: 'electronics',
    additionalFields: [
      { name: 'cpu', label: 'CPU', type: 'text', required: false },
      { name: 'ram', label: 'RAM (GB)', type: 'number', required: false },
      { name: 'storage', label: 'Storage', type: 'text', required: false },
      { name: 'graphics', label: 'Graphics Card', type: 'text', required: false }
    ]
  },
  'property/apartments': {
    parent: 'property',
    additionalFields: [
      { name: 'floor_number', label: 'Floor Number', type: 'number', required: false },
      { name: 'elevator', label: 'Elevator', type: 'select', options: ['Yes', 'No'], required: true },
      { name: 'balcony', label: 'Balcony', type: 'select', options: ['Yes', 'No'], required: true }
    ]
  }
};

const DynamicCategoryPostingForm = () => {
  const { category, subcategory } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    // Determine the form configuration based on category and subcategory
    let formConfig = null;
    
    if (subcategory && subcategoryConfigs[`${category}/${subcategory}`]) {
      const subcategoryConfig = subcategoryConfigs[`${category}/${subcategory}`];
      const parentConfig = categoryFormConfigs[subcategoryConfig.parent];
      
      if (parentConfig) {
        formConfig = {
          ...parentConfig,
          fields: [...parentConfig.fields, ...subcategoryConfig.additionalFields]
        };
      }
    } else if (categoryFormConfigs[category]) {
      formConfig = categoryFormConfigs[category];
    } else {
      // Default generic form
      formConfig = {
        icon: <FaTshirt />,
        fields: [
          { name: 'title', label: 'Title', type: 'text', required: true },
          { name: 'price', label: 'Price', type: 'number', required: true },
          { name: 'condition', label: 'Condition', type: 'select', options: ['New', 'Like New', 'Good', 'Fair'], required: true },
          { name: 'location', label: 'Location', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'textarea', required: true }
        ]
      };
    }
    
    setConfig(formConfig);
    
    // Initialize form data
    const initialData = {};
    formConfig?.fields.forEach(field => {
      if (field.type === 'select') {
        initialData[field.name] = field.options?.[0] || '';
      } else {
        initialData[field.name] = '';
      }
    });
    setFormData(initialData);
  }, [category, subcategory]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || '' : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      const missingFields = config?.fields
        .filter(field => field.required && !formData[field.name])
        .map(field => field.label);

      if (missingFields?.length > 0) {
        toast.error(`Please fill in required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Prepare listing data for API
      const listingData = {
        title: formData.title || `${category} - ${formData.make || formData.item_type || 'Item'}`,
        description: formData.description || 'Description for this listing',
        category: category,
        subcategory: subcategory || null,
        price: formData.price || 0,
        currency: 'USD',
        condition: formData.condition || 'Good',
        location: formData.location || '',
        // Add category-specific fields
        specifications: {
          ...formData,
          category: category,
          subcategory: subcategory
        },
        // Remove fields that are already at top level
        title: undefined,
        description: undefined,
        category: undefined,
        subcategory: undefined,
        price: undefined,
        currency: undefined,
        condition: undefined,
        location: undefined
      };

      // Upload images first if any
      let uploadedImages = [];
      if (images.length > 0) {
        try {
          const imageFormData = new FormData();
          images.forEach((image, index) => {
            imageFormData.append(`images[${index}]`, image.file);
          });
          
          const imageResponse = await Api.post('v1/upload/images', imageFormData);
          uploadedImages = imageResponse.data?.images || [];
        } catch (imageError) {
          console.error('Error uploading images:', imageError);
          toast.error('Failed to upload images. Please try again.');
          return;
        }
      }

      // Add images to listing data
      if (uploadedImages.length > 0) {
        listingData.images = uploadedImages;
      }

      // Create the listing using the real API
      const response = await ListServices.createAdsList(listingData);
      
      if (response.data?.success || response.status === 'Success') {
        toast.success('Advert posted successfully!');
        
        // Redirect to category page or advert detail page
        const advertSlug = response.data?.data?.slug || response.data?.slug;
        if (advertSlug) {
          navigate(`/ads-detail/${advertSlug}`);
        } else {
          navigate(`/category/${category}`);
        }
      } else {
        throw new Error(response.data?.message || 'Failed to create listing');
      }
      
    } catch (error) {
      console.error('Error posting advert:', error);
      toast.error(error.message || 'Failed to post advert. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(`/category/${category}`);
    }
  };

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-container py-8 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FiArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Post in {subcategory ? `${subcategory} - ` : ''}{category?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h1>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Icon and Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <div className="text-blue-600 text-2xl">
                  {config.icon}
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Create Your Listing
              </h2>
              <p className="text-gray-600 mt-2">
                Fill in the details below to post your advert
              </p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.fields.map((field) => (
                <div key={field.name} className={`${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  
                  {field.type === 'select' ? (
                    <select
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={field.required}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      required={field.required}
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                  <FiUpload className="h-4 w-4 mr-2" />
                  Upload Images
                </label>
                <p className="text-gray-500 mt-2 text-sm">
                  Upload up to 10 images. JPG, PNG, GIF up to 5MB each.
                </p>
              </div>
              
              {/* Image Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {images.map((image, index) => (
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
                        <FiX className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleGoBack}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Posting...
                  </>
                ) : (
                  <>
                    <FiSave className="h-4 w-4 mr-2" />
                    Post Advert
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

export default DynamicCategoryPostingForm;
