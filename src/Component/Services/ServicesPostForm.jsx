import React, { useState, useEffect, useCallback } from 'react';
import { X, Upload, Check, Briefcase, MapPin, Clock, Award, TrendingUp, Package, Plus, Trash2 } from 'lucide-react';
import { servicesApi } from '../../services/servicesSolutionsApi';
import { parseCategoriesResponse } from '../../utils/serviceCategoryUtils';
import { IT_SERVICE_CATEGORY_DEFS } from '../../constants/itServiceCategories';
import { formatCountry } from '../../utils/apiResponseHelpers';
import { getStorageAssetUrl } from '../../utils/jobsHelpers';
import VerificationFields from '../shared/VerificationFields';
import toast from 'react-hot-toast';

const mapServiceToForm = (service) => ({
  service_type: service.service_type || 'freelance',
  category_id: service.category_id?.toString() || service.category?.id?.toString() || '',
  title: service.title || '',
  tagline: service.tagline || '',
  description: service.description || '',
  whats_included: Array.isArray(service.whats_included) && service.whats_included.length
    ? service.whats_included
    : [''],
  whats_not_included: Array.isArray(service.whats_not_included) && service.whats_not_included.length
    ? service.whats_not_included
    : [''],
  requirements: service.requirements || '',
  starting_price: service.starting_price?.toString() || service.price?.toString() || '',
  currency: service.currency || 'USD',
  delivery_time: service.delivery_time?.toString() || '',
  availability: service.availability || { days: [], hours: '' },
  country: formatCountry(service.country) || '',
  city: service.city || '',
  latitude: service.latitude?.toString() || '',
  longitude: service.longitude?.toString() || '',
  service_area_radius: service.service_area_radius?.toString() || '',
  languages: Array.isArray(service.languages) && service.languages.length ? service.languages : [''],
  packages: Array.isArray(service.packages) ? service.packages : [],
  addons: Array.isArray(service.addons) ? service.addons : [],
  promotion_type: service.promotion_type || 'promoted',
  terms_accurate: true,
  terms_agree: true,
});

const ServicesPostForm = ({ onClose, onSubmit, initialService = null, serviceId = null, initialCategoryId = null }) => {
  const isEditing = Boolean(serviceId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [phoneVerification, setPhoneVerification] = useState({ phoneVerified: false });
  const [contactPhone, setContactPhone] = useState('');
  const onPhoneVerificationChange = useCallback((v) => setPhoneVerification(v), []);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [, setPromotionOptions] = useState({});
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [formData, setFormData] = useState({
    service_type: 'freelance',
    category_id: initialCategoryId ? String(initialCategoryId) : '',
    title: '',
    tagline: '',
    description: '',
    whats_included: [''],
    whats_not_included: [''],
    requirements: '',
    starting_price: '',
    currency: 'USD',
    delivery_time: '',
    availability: { days: [], hours: '' },
    country: '',
    city: '',
    latitude: '',
    longitude: '',
    service_area_radius: '',
    languages: [''],
    packages: [],
    addons: [],
    promotion_type: 'promoted',
    terms_accurate: false,
    terms_agree: false
  });

  // Load live categories from API (Services & Solutions tree)
  useEffect(() => {
    const loadMeta = async () => {
      setLoadingMeta(true);
      try {
        const [catRes, promoRes] = await Promise.all([
          servicesApi.getCategories().catch(() => ({ data: [], mains: [] })),
          servicesApi.getPromotionOptions().catch(() => ({ data: {} })),
        ]);
        const parsed = parseCategoriesResponse(catRes);
        let techCats = (parsed.flat || []).filter((c) => c && c.is_active !== false);

        // Also expose parent categories that accept direct posts (no children)
        (parsed.mains || []).forEach((m) => {
          if (!(m.children || []).length && !techCats.some((c) => c.slug === m.slug)) {
            techCats.push({
              id: m.id,
              slug: m.slug,
              name: m.name,
              label: m.name,
              emoji: m.emoji,
              is_active: true,
            });
          }
        });

        if (!techCats.length) {
          techCats = IT_SERVICE_CATEGORY_DEFS.map((d, i) => ({
            id: `local-${d.slug}`,
            slug: d.slug,
            name: d.name,
            label: d.parentSlug ? `${d.name} (${d.parentSlug})` : d.name,
            emoji: d.emoji,
            sort_order: i + 1,
            is_active: true,
          }));
        } else {
          // Prefer showing "Parent › Child" labels for subtypes
          const parentName = Object.fromEntries(
            (parsed.mains || []).map((m) => [m.slug, m.name])
          );
          techCats = techCats.map((c) => ({
            ...c,
            label:
              c.parent_slug || c.group_slug
                ? `${parentName[c.parent_slug || c.group_slug] || c.group_name || ''} › ${c.name}`.replace(/^ › /, '')
                : c.name || c.label,
          }));
        }

        setCategories(techCats);

        // Resolve initial slug → category_id for post form
        if (initialCategoryId && !/^[0-9]+$/.test(String(initialCategoryId))) {
          const match = techCats.find((c) => c.slug === initialCategoryId);
          if (match?.id) {
            setFormData((prev) => ({ ...prev, category_id: String(match.id) }));
          }
        }

        setPromotionOptions(promoRes?.data || promoRes || {});
      } catch (err) {
        console.error('Error loading form metadata:', err);
      } finally {
        setLoadingMeta(false);
      }
    };
    loadMeta();
  }, [initialCategoryId]);

  useEffect(() => {
    if (!initialCategoryId || initialService || !categories.length) return;
    const match = categories.find(
      (c) =>
        String(c.id) === String(initialCategoryId) ||
        String(c.slug) === String(initialCategoryId)
    );
    if (!match) return;
    setFormData((prev) => ({
      ...prev,
      category_id: String(match.id),
    }));
  }, [initialCategoryId, initialService, categories]);

  useEffect(() => {
    if (initialService) {
      setFormData(mapServiceToForm(initialService));
      const media = Array.isArray(initialService.media) ? initialService.media : [];
      setExistingImages(media.filter((item) => item.type === 'image' || !item.type));
      setImageFiles([]);
      setImagePreviews([]);
    }
  }, [initialService]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayItemChange = (field, index, value) => {
    setFormData(prev => {
      const arr = [...prev[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => {
      const arr = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: arr.length === 0 ? [''] : arr };
    });
  };

  const addPackage = () => {
    setFormData(prev => ({
      ...prev,
      packages: [...prev.packages, { name: '', description: '', price: '', delivery_time: '', features: [''], revisions: 1 }]
    }));
  };

  const removePackage = (index) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.filter((_, i) => i !== index)
    }));
  };

  const updatePackage = (index, field, value) => {
    setFormData(prev => {
      const pkgs = [...prev.packages];
      pkgs[index] = { ...pkgs[index], [field]: value };
      return { ...prev, packages: pkgs };
    });
  };

  const updatePackageFeature = (pkgIndex, featIndex, value) => {
    setFormData(prev => {
      const pkgs = [...prev.packages];
      const features = [...pkgs[pkgIndex].features];
      features[featIndex] = value;
      pkgs[pkgIndex] = { ...pkgs[pkgIndex], features };
      return { ...prev, packages: pkgs };
    });
  };

  const addPackageFeature = (pkgIndex) => {
    setFormData(prev => {
      const pkgs = [...prev.packages];
      pkgs[pkgIndex] = { ...pkgs[pkgIndex], features: [...pkgs[pkgIndex].features, ''] };
      return { ...prev, packages: pkgs };
    });
  };

  const addAddon = () => {
    setFormData(prev => ({
      ...prev,
      addons: [...prev.addons, { title: '', description: '', price: '', delivery_time: '' }]
    }));
  };

  const removeAddon = (index) => {
    setFormData(prev => ({
      ...prev,
      addons: prev.addons.filter((_, i) => i !== index)
    }));
  };

  const updateAddon = (index, field, value) => {
    setFormData(prev => {
      const addons = [...prev.addons];
      addons[index] = { ...addons[index], [field]: value };
      return { ...prev, addons };
    });
  };

  const toggleDay = (day) => {
    setFormData(prev => {
      const days = prev.availability.days.includes(day)
        ? prev.availability.days.filter(d => d !== day)
        : [...prev.availability.days, day];
      return { ...prev, availability: { ...prev.availability, days } };
    });
  };

  const handleImageSelect = (event) => {
    const selected = Array.from(event.target.files || []);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    const validFiles = selected.filter((file) => {
      if (!allowedTypes.includes(file.type)) return false;
      if (file.size > 10 * 1024 * 1024) return false;
      return true;
    });

    if (validFiles.length !== selected.length) {
      setSubmitError('Images must be JPEG, PNG, GIF, or WebP and under 10MB each.');
    }

    const totalCount = existingImages.length + imageFiles.length + validFiles.length;
    if (totalCount > 10) {
      setSubmitError('You can upload up to 10 images per service.');
      return;
    }

    setImageFiles((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...validFiles.map((file) => URL.createObjectURL(file))]);
    event.target.value = '';
  };

  const removeNewImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      const next = [...prev];
      if (next[index]) URL.revokeObjectURL(next[index]);
      return next.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = async (mediaId) => {
    if (!serviceId) return;
    try {
      await servicesApi.deleteMedia(serviceId, mediaId);
      setExistingImages((prev) => prev.filter((item) => item.id !== mediaId));
    } catch (err) {
      setSubmitError('Failed to remove image. Please try again.');
    }
  };

  const uploadPendingImages = async (targetServiceId) => {
    if (!targetServiceId || imageFiles.length === 0) return;
    const hasExistingThumbnail = existingImages.some((item) => item.is_thumbnail);
    await servicesApi.uploadImages(targetServiceId, imageFiles, {
      markFirstAsThumbnail: !hasExistingThumbnail,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!isEditing && !phoneVerification.phoneVerified) {
      toast.error('Please verify your mobile number before posting.');
      setSubmitError('Please verify your mobile number before posting.');
      return;
    }

    setIsSubmitting(true);

    if (!formData.terms_accurate || !formData.terms_agree) {
      setSubmitError('Please accept both checkboxes before submitting.');
      setIsSubmitting(false);
      return;
    }

    if (!isEditing && imageFiles.length === 0) {
      setSubmitError('Please upload at least one service image.');
      setIsSubmitting(false);
      return;
    }

    if (isEditing && imageFiles.length === 0 && existingImages.length === 0) {
      setSubmitError('Please keep at least one service image.');
      setIsSubmitting(false);
      return;
    }

    try {
      const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const availabilityPayload = {};
      dayLabels.forEach((label, i) => {
        availabilityPayload[dayKeys[i]] = formData.availability.days.includes(label);
      });
      const hasAnyDay = Object.values(availabilityPayload).some(Boolean);

      const payload = {
        service_type: formData.service_type,
        category_id: parseInt(formData.category_id, 10),
        title: formData.title,
        tagline: formData.tagline || null,
        description: formData.description,
        whats_included: formData.whats_included.filter(i => i.trim()),
        whats_not_included: formData.whats_not_included.filter(i => i.trim()),
        requirements: formData.requirements || null,
        starting_price: parseFloat(formData.starting_price),
        currency: formData.currency,
        delivery_time: formData.delivery_time ? parseInt(formData.delivery_time, 10) : null,
        availability: hasAnyDay ? availabilityPayload : null,
        country: formData.country,
        city: formData.city || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        service_area_radius: formData.service_area_radius ? parseInt(formData.service_area_radius, 10) : null,
        languages: formData.languages.filter(l => l.trim()),
        promotion_type: formData.promotion_type || 'promoted',
        status: 'active',
      };

      if (formData.packages.length > 0) {
        payload.packages = formData.packages
          .filter(p => p.name && p.price)
          .map((p, i) => ({
            name: p.name,
            description: p.description || p.name,
            price: parseFloat(p.price),
            delivery_time: parseInt(p.delivery_time) || 7,
            features: (p.features || []).filter(f => f.trim()),
            revisions: parseInt(p.revisions) || 1,
            sort_order: i,
          }));
      }

      if (formData.addons.length > 0) {
        payload.addons = formData.addons
          .filter(a => a.title && a.price)
          .map((a, i) => ({
            title: a.title,
            description: a.description || null,
            price: parseFloat(a.price),
            delivery_time: a.delivery_time ? parseInt(a.delivery_time) : null,
            sort_order: i,
          }));
      }

      const response = isEditing
        ? await servicesApi.updateService(serviceId, payload)
        : await servicesApi.createService(payload);

      const savedService = response?.data || response;
      const targetServiceId = serviceId || savedService?.id;

      if (targetServiceId && imageFiles.length > 0) {
        await uploadPendingImages(targetServiceId);
      }

      setSubmitSuccess(true);
      if (onSubmit) onSubmit(savedService);
    } catch (err) {
      console.error('Service creation failed:', err);
      const msg = err?.message || err?.errors
        ? Object.values(err.errors || {}).flat().join(', ')
        : 'Failed to create service. Please check all required fields.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceTypes = [
    {
      id: 'freelance',
      name: 'Online / Freelance',
      description: 'Digital tech services delivered remotely',
      icon: '💻',
      color: 'blue',
    },
    {
      id: 'business',
      name: 'B2B Online Service',
      description: 'Professional remote IT for businesses',
      icon: '💼',
      color: 'purple',
    },
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const promotionTiers = [
    { id: 'promoted', name: 'Paid', price: '$29', color: 'blue', benefits: ['Higher in search results', 'Appears above standard', '2× visibility'] },
    { id: 'featured', name: 'Featured', price: '$59', color: 'purple', popular: true, benefits: ['Top of category pages', 'Larger card', 'Newsletter inclusion'] },
    { id: 'sponsored', name: 'Sponsored', price: '$99', color: 'orange', benefits: ['Homepage placement', 'Social media promotion', 'Priority support'] },
  ];

  // Success screen
  if (submitSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{isEditing ? 'Service Updated!' : 'Service Posted!'}</h3>
          <p className="text-gray-600 mb-6">{isEditing ? 'Your service has been updated.' : 'Your service has been submitted and is now live.'}</p>
          <button onClick={onClose} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Service' : 'Post a Tech Service'}</h2>
            <p className="text-sm text-gray-500">{isEditing ? 'Update your service details below' : 'IT & Computing only — web, apps, design, marketing & more'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {loadingMeta && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Loading form data...</p>
            </div>
          )}

          {/* === SECTION 1: Service Type === */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-blue-600" /> Service Type *
            </h3>
            <p className="text-sm text-gray-500 mb-3">Choose the type that best describes your service</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {serviceTypes.map(type => (
                <button key={type.id} type="button" onClick={() => handleChange('service_type', type.id)}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${formData.service_type === type.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <span className="text-2xl">{type.icon}</span>
                  <h4 className="font-semibold text-gray-900 mt-1">{type.name}</h4>
                  <p className="text-xs text-gray-500">{type.description}</p>
                </button>
              ))}
            </div>
          </section>

          {/* === SECTION 2: Basic Details === */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center">
              <Award className="w-5 h-5 mr-2 text-blue-600" /> Service Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" required maxLength={255} value={formData.title}
                  onChange={e => handleChange('title', e.target.value)}
                  placeholder="e.g. Professional Logo Design for Your Brand"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                <input type="text" maxLength={80} value={formData.tagline}
                  onChange={e => handleChange('tagline', e.target.value)}
                  placeholder="A short catchy tagline"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) => handleChange('category_id', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label || cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency *</label>
                <select required value={formData.currency} onChange={e => handleChange('currency', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="AUD">AUD (A$)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price *</label>
                <input type="number" required min="0" step="0.01" value={formData.starting_price}
                  onChange={e => handleChange('starting_price', e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time (days)</label>
                <input type="number" min="1" value={formData.delivery_time}
                  onChange={e => handleChange('delivery_time', e.target.value)}
                  placeholder="e.g. 7"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
          </section>

          {/* === SECTION: Service Images === */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center">
              <Upload className="w-5 h-5 mr-2 text-blue-600" /> Service Images *
            </h3>
            <p className="text-sm text-gray-500 mb-3">Upload up to 10 images. The first image is used as the listing thumbnail.</p>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <label htmlFor="serviceImageUpload" className="cursor-pointer">
                <span className="block text-sm font-medium text-gray-900">Click to upload images</span>
                <span className="block text-xs text-gray-500 mt-1">PNG, JPG, GIF, WebP up to 10MB each</span>
              </label>
              <input
                id="serviceImageUpload"
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                multiple
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>

            {(existingImages.length > 0 || imagePreviews.length > 0) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {existingImages.map((media) => (
                    <div key={`existing-${media.id}`} className="relative group">
                      <img
                        src={getStorageAssetUrl(media.full_url || media.file_path)}
                        alt={media.file_name || 'Service image'}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      {media.is_thumbnail && (
                        <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">Thumbnail</span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeExistingImage(media.id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-90 hover:opacity-100"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                {imagePreviews.map((preview, idx) => (
                  <div key={`new-${preview}`} className="relative group">
                    <img src={preview} alt={`New upload ${idx + 1}`} className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                    {existingImages.length === 0 && idx === 0 && (
                      <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">Thumbnail</span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-90 hover:opacity-100"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* === SECTION 3: Description === */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Description *</h3>
            <textarea required rows={5} value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Describe your service in detail. What makes you unique? What can clients expect?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Requirements from Buyer</label>
              <textarea rows={3} value={formData.requirements}
                onChange={e => handleChange('requirements', e.target.value)}
                placeholder="What do you need from the buyer to get started?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </section>

          {/* === SECTION 4: What's Included / Not Included === */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What's Included</label>
                {formData.whats_included.map((item, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input type="text" value={item}
                      onChange={e => handleArrayItemChange('whats_included', idx, e.target.value)}
                      placeholder="e.g. Source files included"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
                    <button type="button" onClick={() => removeArrayItem('whats_included', idx)}
                      className="p-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('whats_included')}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center mt-1">
                  <Plus className="w-3 h-3 mr-1" /> Add item
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What's Not Included</label>
                {formData.whats_not_included.map((item, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input type="text" value={item}
                      onChange={e => handleArrayItemChange('whats_not_included', idx, e.target.value)}
                      placeholder="e.g. Hosting fees"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
                    <button type="button" onClick={() => removeArrayItem('whats_not_included', idx)}
                      className="p-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('whats_not_included')}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center mt-1">
                  <Plus className="w-3 h-3 mr-1" /> Add item
                </button>
              </div>
            </div>
          </section>

          {/* === SECTION 5: Location === */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" /> Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                <input type="text" required maxLength={100} value={formData.country}
                  onChange={e => handleChange('country', e.target.value)}
                  placeholder="e.g. United Kingdom"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" maxLength={100} value={formData.city}
                  onChange={e => handleChange('city', e.target.value)}
                  placeholder="e.g. London"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              {formData.service_type === 'local' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input type="number" step="any" value={formData.latitude}
                      onChange={e => handleChange('latitude', e.target.value)}
                      placeholder="e.g. 51.5074"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input type="number" step="any" value={formData.longitude}
                      onChange={e => handleChange('longitude', e.target.value)}
                      placeholder="e.g. -0.1278"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Area Radius (km)</label>
                    <input type="number" min="0" value={formData.service_area_radius}
                      onChange={e => handleChange('service_area_radius', e.target.value)}
                      placeholder="e.g. 50"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </>
              )}
            </div>
          </section>

          {/* === SECTION 6: Languages === */}
          <section>
            <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken</label>
            {formData.languages.map((lang, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input type="text" value={lang}
                  onChange={e => handleArrayItemChange('languages', idx, e.target.value)}
                  placeholder="e.g. English (Fluent)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
                <button type="button" onClick={() => removeArrayItem('languages', idx)}
                  className="p-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('languages')}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center mt-1">
              <Plus className="w-3 h-3 mr-1" /> Add language
            </button>
          </section>

          {/* === SECTION 7: Availability === */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" /> Availability
            </h3>
            <p className="text-sm text-gray-500 mb-3">Select your available days</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {daysOfWeek.map(day => (
                <button key={day} type="button" onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    formData.availability.days.includes(day)
                      ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
            <input type="text" value={formData.availability.hours}
              onChange={e => setFormData(prev => ({ ...prev, availability: { ...prev.availability, hours: e.target.value } }))}
              placeholder="e.g. 9am - 6pm GMT"
              className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </section>

          {/* === SECTION 8: Packages (Optional) === */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-blue-600" /> Service Packages
                </h3>
                <p className="text-sm text-gray-500">Optional: offer multiple packages</p>
              </div>
              <button type="button" onClick={addPackage}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 flex items-center">
                <Plus className="w-4 h-4 mr-1" /> Add Package
              </button>
            </div>
            {formData.packages.map((pkg, pkgIdx) => (
              <div key={pkgIdx} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Package {pkgIdx + 1}</h4>
                  <button type="button" onClick={() => removePackage(pkgIdx)}
                    className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" value={pkg.name} placeholder="Package Name (e.g. Basic)"
                    onChange={e => updatePackage(pkgIdx, 'name', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
                  <input type="number" min="0" step="0.01" value={pkg.price} placeholder="Price"
                    onChange={e => updatePackage(pkgIdx, 'price', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
                  <input type="number" min="1" value={pkg.delivery_time} placeholder="Delivery days"
                    onChange={e => updatePackage(pkgIdx, 'delivery_time', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
                  <input type="number" min="0" value={pkg.revisions} placeholder="Revisions"
                    onChange={e => updatePackage(pkgIdx, 'revisions', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
                  <div className="md:col-span-2">
                    <input type="text" value={pkg.description} placeholder="Description"
                      onChange={e => updatePackage(pkgIdx, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Features</label>
                  {(pkg.features || []).map((feat, fIdx) => (
                    <div key={fIdx} className="flex gap-2 mb-1">
                      <input type="text" value={feat} placeholder="Feature"
                        onChange={e => updatePackageFeature(pkgIdx, fIdx, e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
                    </div>
                  ))}
                  <button type="button" onClick={() => addPackageFeature(pkgIdx)}
                    className="text-xs text-blue-600 mt-1 flex items-center"><Plus className="w-3 h-3 mr-1" /> Add feature</button>
                </div>
              </div>
            ))}
          </section>

          {/* === SECTION 9: Add-ons (Optional) === */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Add-on Services</h3>
                <p className="text-sm text-gray-500">Optional: offer extras to increase earnings</p>
              </div>
              <button type="button" onClick={addAddon}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 flex items-center">
                <Plus className="w-4 h-4 mr-1" /> Add Add-on
              </button>
            </div>
            {formData.addons.map((addon, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">Add-on {idx + 1}</h4>
                  <button type="button" onClick={() => removeAddon(idx)}
                    className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input type="text" value={addon.title} placeholder="Title (e.g. Extra Revisions)"
                    onChange={e => updateAddon(idx, 'title', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  <input type="number" min="0" step="0.01" value={addon.price} placeholder="Price"
                    onChange={e => updateAddon(idx, 'price', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  <input type="number" min="1" value={addon.delivery_time} placeholder="Extra days"
                    onChange={e => updateAddon(idx, 'delivery_time', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  <div className="md:col-span-3">
                    <input type="text" value={addon.description} placeholder="Description"
                      onChange={e => updateAddon(idx, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* === SECTION 10: Promotion === */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" /> Promote Your Service
            </h3>
            <p className="text-sm text-gray-500 mb-4">Get more visibility with a promotion tier</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {promotionTiers.map(tier => (
                <button key={tier.id} type="button" onClick={() => handleChange('promotion_type', tier.id)}
                  className={`relative p-4 border-2 rounded-xl text-left transition-all ${
                    formData.promotion_type === tier.id ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  {tier.popular && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Popular</span>
                  )}
                  <h4 className="font-semibold text-gray-900 text-sm">{tier.name}</h4>
                  <p className="text-lg font-bold text-blue-600">{tier.price}</p>
                  <ul className="mt-2 space-y-1">
                    {tier.benefits.map((b, i) => (
                      <li key={i} className="text-[11px] text-gray-600 flex items-start">
                        <Check className="w-3 h-3 text-green-500 mr-1 mt-0.5 shrink-0" />{b}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </section>

          {!isEditing && (
            <section className="bg-gray-50 rounded-xl p-4">
              <VerificationFields
                mode="phone"
                phone={contactPhone}
                onPhoneChange={setContactPhone}
                onVerificationChange={onPhoneVerificationChange}
                compact
              />
            </section>
          )}

          {/* === SECTION 11: Terms === */}
          <section className="bg-gray-50 rounded-xl p-4">
            <div className="space-y-3">
              <label className="flex items-start cursor-pointer">
                <input type="checkbox" checked={formData.terms_accurate}
                  onChange={e => handleChange('terms_accurate', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 mt-1 mr-3" />
                <span className="text-sm text-gray-700">I confirm this information is accurate and I have the authority to provide this service</span>
              </label>
              <label className="flex items-start cursor-pointer">
                <input type="checkbox" checked={formData.terms_agree}
                  onChange={e => handleChange('terms_agree', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 mt-1 mr-3" />
                <span className="text-sm text-gray-700">I agree to the <a href="/help/terms-of-use" className="text-blue-600 hover:underline">terms and conditions</a> and <a href="/help/ads-policies" className="text-blue-600 hover:underline">community guidelines</a></span>
              </label>
            </div>
          </section>

          {/* Error Display */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              {submitError}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 shrink-0">
          <button type="button" onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" onClick={handleSubmit} disabled={isSubmitting || !formData.terms_accurate || !formData.terms_agree}
            className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Posting...
              </>
            ) : 'Post Service'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesPostForm;
