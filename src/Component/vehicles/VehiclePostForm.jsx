import React, { useState, useEffect } from 'react';
import { Upload, X, Check, ArrowLeft } from 'lucide-react';
import { createVehicle, updateVehicle, getVehicle, uploadImage } from '../../services/vehiclesAPI';
import { getVehicleCategories, getVehicleMakes, getVehicleModels } from '../../services/vehiclesAPI';
import { mapVehicleToForm, resolveStorageUrl } from '../../utils/dashboardEditMappers';

const VehiclePostForm = ({ onClose, onSuccess, editVehicle = null }) => {
  const isEditing = Boolean(editVehicle?.id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [existingAdditionalPaths, setExistingAdditionalPaths] = useState([]);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const [formData, setFormData] = useState({
    advert_type: '',
    title: '',
    tagline: '',
    category_id: '',
    make_id: '',
    model_id: '',
    custom_model: '',
    year: '',
    mileage: '',
    fuel_type: '',
    transmission: '',
    condition: '',
    price: '',
    price_type: 'fixed',
    is_negotiable: false,
    main_image: null,
    videoUrl: '',
    engine_size: '',
    doors: '',
    seats: '',
    color: '',
    body_type: '',
    vin: '',
    registration_number: '',
    description: '',
    contact_name: '',
    business_name: '',
    contact_phone: '',
    contact_email: '',
    website: '',
    address: '',
    city: '',
    country: '',
    show_exact_location: false,
    pricing_plan_id: 2,
  });

  const advertTypes = [
    { value: 'sale', label: 'Vehicle for Sale', description: 'Sell your vehicle to interested buyers' },
    { value: 'hire', label: 'Vehicle for Hire', description: 'Rent out your vehicle for short term use' },
    { value: 'lease', label: 'Vehicle for Lease', description: 'Long term leasing options available' },
    { value: 'transport_service', label: 'Transport Service', description: 'Offer taxi, chauffeur, or shuttle services' }
  ];

  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'LPG'];
  const transmissions = ['Manual', 'Automatic', 'Semi-Automatic'];
  const bodyTypes = ['Sedan', 'Hatchback', 'SUV', 'Coupe', 'Convertible', 'Wagon', 'Pickup', 'Van', 'Truck'];
  const conditions = ['New', 'Used', 'Certified Pre-Owned'];

  const promotionTiers = [
    { id: 'promoted', name: 'Paid', price: 10, planId: 2, features: ['Higher in search results', '2× more visibility'] },
    { id: 'featured', name: 'Featured', price: 25, planId: 3, features: ['Top of category', '5× more visibility'], popular: true },
    { id: 'sponsored', name: 'Sponsored', price: 50, planId: 4, features: ['Homepage placement', 'Maximum visibility'] },
  ];

  useEffect(() => {
    const loadInitialData = async () => {
      setLoadingData(true);
      try {
        const [categoriesData, makesData] = await Promise.all([
          getVehicleCategories(),
          getVehicleMakes(),
        ]);

        console.log('Categories data:', categoriesData);
        console.log('Makes data:', makesData);

        if (Array.isArray(categoriesData)) setCategories(categoriesData);
        else if (categoriesData.data && Array.isArray(categoriesData.data)) setCategories(categoriesData.data);

        if (Array.isArray(makesData)) setMakes(makesData);
        else if (makesData.data && Array.isArray(makesData.data)) setMakes(makesData.data);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load vehicle data');
      } finally {
        setLoadingData(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!editVehicle?.id) return;
    let cancelled = false;

    const loadEditData = async () => {
      try {
        const response = await getVehicle(editVehicle.id);
        const vehicle = response?.data ?? response;
        if (cancelled || !vehicle) return;
        setFormData(mapVehicleToForm(vehicle));
        if (vehicle.main_image) {
          setMainImagePreview(resolveStorageUrl(vehicle.main_image));
          setFormData((prev) => ({ ...prev, main_image: vehicle.main_image }));
        }
        const extras = Array.isArray(vehicle.additional_images) ? vehicle.additional_images : [];
        if (extras.length) {
          setExistingAdditionalPaths(extras);
          setAdditionalImagePreviews(extras.map((p) => resolveStorageUrl(p)).filter(Boolean));
        }
        if (vehicle.make_id) {
          const modelsData = await getVehicleModels(vehicle.make_id);
          setModels(Array.isArray(modelsData?.data) ? modelsData.data : modelsData || []);
        }
      } catch {
        setFormData(mapVehicleToForm(editVehicle));
        if (editVehicle.main_image) {
          setMainImagePreview(resolveStorageUrl(editVehicle.main_image));
        }
        const extras = Array.isArray(editVehicle.additional_images) ? editVehicle.additional_images : [];
        if (extras.length) {
          setExistingAdditionalPaths(extras);
          setAdditionalImagePreviews(extras.map((p) => resolveStorageUrl(p)).filter(Boolean));
        }
      }
    };

    loadEditData();
    return () => { cancelled = true; };
  }, [editVehicle]);

  useEffect(() => {
    if (formData.make_id) {
      const loadModels = async () => {
        try {
          const response = await getVehicleModels(formData.make_id);
          if (Array.isArray(response)) setModels(response);
          else if (response.data?.length) setModels(response.data);
        } catch (error) {
          console.error('Error loading models:', error);
        }
      };
      loadModels();
    }
  }, [formData.make_id]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be less than 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Image file must be JPEG, PNG, JPG, GIF, or WebP format');
      return;
    }

    setMainImageFile(file);
    setMainImagePreview(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, main_image: file.name }));
    setError('');
  };

  const handleAdditionalImagesUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setAdditionalImageFiles((prev) => [...prev, ...files]);
    setAdditionalImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      const requiredFields = ['title', 'category_id', 'make_id', 'model_id', 'year', 'condition', 'advert_type', 'price_type', 'country', 'city'];
      const missingFields = requiredFields.filter(field => !formData[field]);

      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }

      if (!mainImageFile && !isEditing && !formData.main_image) {
        setError('Please upload a main vehicle image');
        return;
      }

      setUploadingImage(true);
      let mainImagePath = typeof formData.main_image === 'string' && formData.main_image.includes('/')
        ? formData.main_image
        : null;

      if (mainImageFile) {
        const uploaded = await uploadImage(mainImageFile);
        mainImagePath = uploaded?.data?.path || uploaded?.data?.url || uploaded?.path || uploaded?.url;
      }

      const extraPaths = [...existingAdditionalPaths];
      for (const file of additionalImageFiles) {
        const uploaded = await uploadImage(file);
        const path = uploaded?.data?.path || uploaded?.data?.url || uploaded?.path || uploaded?.url;
        if (path) extraPaths.push(path);
      }
      setUploadingImage(false);

      const payload = new FormData();
      const appendField = (key, value) => {
        if (value !== null && value !== undefined && value !== '') {
          payload.append(key, value);
        }
      };

      appendField('title', formData.title);
      appendField('tagline', formData.tagline);
      appendField('description', formData.description);
      appendField('advert_type', formData.advert_type || 'sale');
      appendField('category_id', formData.category_id);
      appendField('make_id', formData.make_id);
      appendField('model_id', formData.model_id);
      appendField('year', parseInt(formData.year, 10));
      appendField('mileage', formData.mileage ? parseInt(formData.mileage, 10) : '');
      appendField('fuel_type', formData.fuel_type?.toLowerCase() || 'petrol');
      appendField('transmission', formData.transmission?.toLowerCase() === 'semi-automatic' ? 'automatic' : (formData.transmission?.toLowerCase() || 'manual'));
      appendField('condition', formData.condition?.toLowerCase() || 'used');
      appendField('engine_size', formData.engine_size);
      appendField('color', formData.color);
      appendField('doors', formData.doors);
      appendField('seats', formData.seats);
      appendField('body_type', formData.body_type?.toLowerCase() || 'sedan');
      appendField('vin', formData.vin);
      appendField('registration_number', formData.registration_number);
      appendField('price', formData.price ? parseFloat(formData.price) : '');
      appendField('price_type', formData.price_type || 'fixed');
      appendField('negotiable', formData.is_negotiable ? '1' : '0');
      appendField('video_link', formData.videoUrl);
      appendField('country', formData.country);
      appendField('city', formData.city);
      appendField('address', formData.address);
      appendField('show_exact_location', formData.show_exact_location ?? true ? '1' : '0');
      appendField('contact_name', formData.contact_name);
      appendField('contact_phone', formData.contact_phone);
      appendField('contact_email', formData.contact_email);
      appendField('website', formData.website);
      if (mainImagePath) appendField('main_image', mainImagePath);
      extraPaths.forEach((path, index) => {
        payload.append(`additional_images[${index}]`, path);
      });

      if (isEditing) {
        await updateVehicle(editVehicle.id, payload);
      } else {
        await createVehicle(payload);
      }
      setSubmissionSuccess(true);
      onSuccess?.();
    } catch (error) {
      if (error.response?.status === 422) {
        setValidationErrors(error.response.data.errors || {});
        setError('Please fix the validation errors below');
      } else {
        setError(error.message || 'Failed to submit vehicle');
      }
    } finally {
      setUploadingImage(false);
      setLoading(false);
    }
  };

  const FieldError = ({ fieldName }) => {
    const errors = validationErrors[fieldName];
    if (!errors?.length) return null;
    return (
      <div className="mt-1 flex items-center text-sm text-red-600">
        <X className="h-4 w-4 mr-1" />
        <span>{errors[0]}</span>
      </div>
    );
  };

  if (submissionSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Posted Successfully!</h2>
          <button onClick={onClose} className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 mt-6">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900">Post Vehicle Advert</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="px-6 py-6 overflow-y-auto flex-1" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Advert Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {advertTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleInputChange('advert_type', type.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.advert_type === type.value ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h4 className="font-semibold">{type.label}</h4>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </button>
                ))}
              </div>
              <FieldError fieldName="advert_type" />
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 2020 BMW 3 Series"
                  />
                  <FieldError fieldName="title" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => handleInputChange('category_id', e.target.value)}
                    disabled={loadingData}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">{loadingData ? 'Loading...' : 'Select category'}</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  <FieldError fieldName="category_id" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Make *</label>
                  <select
                    value={formData.make_id}
                    onChange={(e) => handleInputChange('make_id', e.target.value)}
                    disabled={loadingData}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">{loadingData ? 'Loading...' : 'Select make'}</option>
                    {makes.map(make => (
                      <option key={make.id} value={make.id}>{make.name}</option>
                    ))}
                  </select>
                  <FieldError fieldName="make_id" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                  <select
                    value={formData.model_id}
                    onChange={(e) => handleInputChange('model_id', e.target.value)}
                    disabled={!formData.make_id}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select model</option>
                    {models.map(model => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                  <FieldError fieldName="model_id" />
                </div>
                {formData.model_id === 'other' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Custom Model *</label>
                    <input
                      type="text"
                      value={formData.custom_model}
                      onChange={(e) => handleInputChange('custom_model', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="2020"
                  />
                  <FieldError fieldName="year" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mileage</label>
                  <input
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange('mileage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select condition</option>
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                  <FieldError fieldName="condition" />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                  <select
                    value={formData.fuel_type}
                    onChange={(e) => handleInputChange('fuel_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select fuel type</option>
                    {fuelTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                  <select
                    value={formData.transmission}
                    onChange={(e) => handleInputChange('transmission', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select transmission</option>
                    {transmissions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Body Type</label>
                  <select
                    value={formData.body_type}
                    onChange={(e) => handleInputChange('body_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select body type</option>
                    {bodyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                  <FieldError fieldName="price" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Type *</label>
                  <select
                    value={formData.price_type}
                    onChange={(e) => handleInputChange('price_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="negotiable">Negotiable</option>
                  </select>
                  <FieldError fieldName="price_type" />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Images</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Image *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500">
                  {mainImagePreview ? (
                    <div className="relative inline-block">
                      <img src={mainImagePreview} alt="Preview" className="max-h-48 rounded-lg" />
                      <button
                        onClick={() => {
                          setMainImagePreview(null);
                          handleInputChange('main_image', null);
                        }}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-2">Click to upload main image</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageUpload}
                        disabled={false}
                        className="hidden"
                        id="mainImageInput"
                      />
                      <label htmlFor="mainImageInput" className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer">
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
                <FieldError fieldName="main_image" />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalImagesUpload}
                  className="w-full text-sm"
                />
                {additionalImagePreviews.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {additionalImagePreviews.map((src, idx) => (
                      <img key={`${src}-${idx}`} src={src} alt="" className="h-20 w-28 rounded object-cover" />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                placeholder="Describe your vehicle..."
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                  <FieldError fieldName="country" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                  <FieldError fieldName="city" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                  <input
                    type="text"
                    value={formData.contact_name}
                    onChange={(e) => handleInputChange('contact_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={formData.business_name}
                    onChange={(e) => handleInputChange('business_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Premium Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {promotionTiers.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => handleInputChange('pricing_plan_id', tier.planId)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.pricing_plan_id === tier.planId
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {tier.popular && (
                      <div className="inline-block px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded-full mb-2">
                        Most Popular
                      </div>
                    )}
                    <h4 className="font-semibold text-lg">{tier.name}</h4>
                    <div className="text-2xl font-bold text-gray-900 mb-2">${tier.price}</div>
                    <ul className="space-y-1">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600">• {feature}</li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Vehicle Advert'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehiclePostForm;
