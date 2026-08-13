import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Check,
  Upload,
  Plus,
  Trash2,
  DollarSign,
  Calendar,
  Target,
  FileText,
  Shield,
  Video,
  Globe,
  MapPin,
  Users,
  Star,
  Crown,
  Gem,
  Sparkles,
  AlertCircle,
  Loader2
} from 'lucide-react';
import fundingAPI from '../../api/fundingAPI';
import VerificationFields from '../shared/VerificationFields';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { maybeCheckoutAfterCreate } from '../../utils/listingPayment';

const FundingPostFormModal = ({ onClose, onSubmit, editData = null, prefillData = null, demoMode = false }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [metadata, setMetadata] = useState(null);
  const [loadingMetadata, setLoadingMetadata] = useState(true);
  const [coverImagePreviewUrl, setCoverImagePreviewUrl] = useState(null);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [companyNumber, setCompanyNumber] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [contactVerification, setContactVerification] = useState({ phoneVerified: false, isFullyVerified: false });

  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    tagline: '',
    project_type: 'startup',
    category: 'technology',
    country: '',
    city: '',
    description: '',
    
    // Story & Vision
    problem_solving: '',
    vision_mission: '',
    why_now: '',
    
    // Funding Details
    funding_goal: '',
    currency: 'USD',
    minimum_contribution: '',
    funding_model: 'loan',
    funding_starts_at: '',
    funding_ends_at: '',
    
    // Use of Funds
    use_of_funds: [{ item: '', amount: '' }],
    
    // Milestones
    milestones: [{ milestone: '', expected_date: '' }],
    
    // Team Members
    team_members: [{ name: '', role: '', photo: null }],
    
    // Verification
    identity_verification: null,
    business_registration_number: '',
    business_registration_document: null,
    website: '',
    social_links: [{ platform: 'facebook', url: '' }],
    
    // Media
    cover_image: null,
    additional_images: [],
    pitch_video: '',
    documents: [],
    
    // Rewards
    rewards: [{ title: '', description: '', minimum_contribution: '', limit: '', estimated_delivery: '' }],
    
    // Promotion
    promotion_tier: 'free',
    
    // Agreements
    agreeTerms: false,
    confirmAccuracy: false
  });

  useEffect(() => {
    loadMetadata();
    if (editData) {
      const mappedRewards = Array.isArray(editData.rewards) && editData.rewards.length
        ? editData.rewards.map((r) => ({
            id: r.id,
            title: r.title || '',
            description: r.description || '',
            minimum_contribution: r.minimum_contribution?.toString?.() || r.minimum_contribution || '',
            limit: r.limit == null ? '' : String(r.limit),
            estimated_delivery: (r.estimated_delivery_date || r.estimated_delivery || '')
              .toString()
              .slice(0, 10),
            estimated_delivery_date: (r.estimated_delivery_date || r.estimated_delivery || '')
              .toString()
              .slice(0, 10),
          }))
        : [{ title: '', description: '', minimum_contribution: '', limit: '', estimated_delivery: '' }];

      setFormData((prev) => ({
        ...prev,
        ...editData,
        city: editData.region || editData.city || prev.city || '',
        rewards: mappedRewards,
        cover_image: prev.cover_image || editData.cover_image,
        additional_images:
          prev.additional_images.length > 0
            ? prev.additional_images
            : editData.additional_images || [],
        documents:
          prev.documents.length > 0 ? prev.documents : editData.documents || [],
      }));
    }
  }, [editData]);

  useEffect(() => {
    if (!prefillData || editData) return;
    const { coverImageUrl, ...fields } = prefillData;
    setFormData((prev) => ({ ...prev, ...fields }));
    if (coverImageUrl) setCoverImagePreviewUrl(coverImageUrl);
  }, [prefillData, editData]);

  const loadMetadata = async () => {
    try {
      setLoadingMetadata(true);
      const response = await fundingAPI.getMetadata();
      if (response.success && response.data) {
        setMetadata(response.data);
      }
    } catch (error) {
      console.error('Error loading metadata:', error);
    } finally {
      setLoadingMetadata(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation errors when user starts fixing the field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      // If no errors left, clear the main error message
      if (Object.keys(validationErrors).length === 1) {
        setSubmitError(null);
      }
    }
  };

  const handleArrayChange = (field, index, key, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? { ...item, [key]: value } : item
      )
    }));
  };

  const addArrayItem = (field, defaultItem) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultItem]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (field, file) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleMultipleFilesChange = (field, files) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ...Array.from(files)]
    }));
  };

  const removeFile = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (demoMode) return;

    if (!contactVerification.phoneVerified) {
      toast.error('Please verify your mobile number before posting.');
      return;
    }
    if (!companyNumber.trim()) {
      toast.error('Company registration number is required for funding campaigns.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Validation
      if (!formData.title || !formData.description || !formData.funding_goal) {
        throw new Error('Please fill in all required fields');
      }

      // Check if cover_image is a valid File object
      console.log('Cover image check:', formData.cover_image);
      console.log('Is File?', formData.cover_image instanceof File);
      if (!formData.cover_image || !(formData.cover_image instanceof File)) {
        throw new Error('Please upload a cover image');
      }

      if (!formData.agreeTerms || !formData.confirmAccuracy) {
        throw new Error('Please agree to the terms and confirm accuracy');
      }

      const submissionData = {
        title: formData.title,
        tagline: formData.tagline || '',
        project_type: formData.project_type,
        category: formData.category,
        country: formData.country,
        city: formData.city || '',
        description: formData.description,
        problem_solving: formData.problem_solving || '',
        vision_mission: formData.vision_mission || '',
        why_now: formData.why_now || '',
        funding_goal: parseFloat(formData.funding_goal),
        currency: formData.currency,
        minimum_contribution: formData.minimum_contribution ? parseFloat(formData.minimum_contribution) : null,
        funding_model: formData.funding_model,
        website: formData.website || '',
        pitch_video: formData.pitch_video || '',
        business_registration_number: formData.business_registration_number || '',
        promotion_tier: formData.promotion_tier,
        cover_image: formData.cover_image,
        additional_images: formData.additional_images.filter(img => img instanceof File) || [],
        documents: formData.documents.filter(doc => doc instanceof File) || [],
        identity_verification: formData.identity_verification instanceof File ? formData.identity_verification : null,
        business_registration_document: formData.business_registration_document instanceof File ? formData.business_registration_document : null,
        use_of_funds: formData.use_of_funds.filter(item => item.item && item.amount).map(item => ({
          item: item.item,
          amount: parseFloat(item.amount)
        })),
        milestones: formData.milestones.filter(item => item.milestone && item.expected_date),
        team_members: formData.team_members.filter(member => member.name && member.role),
        social_links: formData.social_links.filter(link => link.platform && link.url),
        rewards: formData.rewards
          .filter((reward) => reward.title && reward.minimum_contribution)
          .map((reward) => ({
            id: reward.id || undefined,
            title: reward.title,
            description: reward.description || '',
            minimum_contribution: parseFloat(reward.minimum_contribution),
            limit: reward.limit === '' || reward.limit == null ? null : parseInt(reward.limit, 10),
            estimated_delivery_date:
              reward.estimated_delivery_date ||
              reward.estimated_delivery ||
              null,
            is_active: reward.is_active !== false,
          })),
      };

      // Only include funding dates if both are provided and valid
      if (formData.funding_starts_at && formData.funding_ends_at) {
        const startDate = new Date(formData.funding_starts_at);
        const endDate = new Date(formData.funding_ends_at);
        if (endDate > startDate) {
          submissionData.funding_starts_at = formData.funding_starts_at;
          submissionData.funding_ends_at = formData.funding_ends_at;
        }
      }

      let response;
      if (editData && editData.id) {
        response = await fundingAPI.updateProject(editData.id, submissionData);
      } else {
        response = await fundingAPI.createProject(submissionData);
      }

      if (response.success || response.data) {
        if (!editData?.id) {
          const selected = promotionTiers.find((t) => t.id === formData.promotion_tier);
          if (
            maybeCheckoutAfterCreate(navigate, response, {
              amount: selected?.price || 0,
              description: `Funding campaign: ${formData.title}`,
              upsellType: 'funding',
              returnTo: '/dashboard?tab=funding',
            })
          ) {
            return;
          }
        }
        onSubmit(response.data);
        onClose();
      } else {
        throw new Error('Failed to save project');
      }
    } catch (error) {
      console.error('Project submission error:', error);
      
      // Handle validation errors from API
      if (error.response && error.response.data && error.response.data.errors) {
        setValidationErrors(error.response.data.errors);
        setSubmitError('Please fix the validation errors below.');
      } else {
        setValidationErrors({});
        setSubmitError(error.response?.data?.message || error.message || 'Failed to save project. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const promotionTiers = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      icon: <Star className="w-6 h-6" />,
      color: 'from-slate-400 to-slate-500',
      benefits: ['Standard listing', '3 days live', 'Free badge']
    },
    {
      id: 'paid',
      name: 'Paid',
      price: 10,
      icon: <Star className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      benefits: ['Search priority', 'Paid badge', '1 week live']
    },
    {
      id: 'promoted',
      name: 'Promoted',
      price: 20,
      icon: <Star className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      benefits: ['Highlighted card', 'Promoted badge', '1 week live']
    },
    {
      id: 'featured',
      name: 'Featured',
      price: 30,
      icon: <Crown className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-600',
      benefits: ['Top of category', 'Featured badge', '1 week live']
    },
    {
      id: 'sponsored',
      name: 'Sponsored',
      price: 40,
      icon: <Gem className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-600',
      benefits: ['Homepage placement', 'Sponsored badge', '1 week live']
    }
  ];

  if (loadingMetadata) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

        {/* Modal */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editData ? 'Edit Funding Campaign' : 'Start a Funding Request'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Business loan or share partnership — crowdfund your growth
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
              {demoMode && (
                <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-emerald-900">Demo preview — PixMuse sample campaign</p>
                  <p className="text-sm text-emerald-800 mt-1">
                    Pre-filled with data from{' '}
                    <a href="https://pixmuse.io" target="_blank" rel="noopener noreferrer" className="underline font-medium">
                      pixmuse.io
                    </a>
                    . Submit is disabled in demo mode.
                  </p>
                </div>
              )}

              {submitError && (
                <div className="mb-6 bg-red-50 border-2 border-red-500 rounded-lg p-4 shadow-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-bold text-red-800 text-lg mb-2">Submission Error</h4>
                      <p className="text-red-700 mb-3">{submitError}</p>
                      {Object.keys(validationErrors).length > 0 && (
                        <div className="mt-3 pt-3 border-t border-red-200">
                          <p className="font-semibold text-red-800 text-sm mb-2">Please fix the following errors:</p>
                          <ul className="space-y-1">
                            {Object.entries(validationErrors).map(([field, errors]) => (
                              <li key={field} className="text-red-700 text-sm flex items-start gap-2">
                                <span className="font-medium">{field}:</span>
                                <span>{Array.isArray(errors) ? errors.join(', ') : errors}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-6">
                <VerificationFields
                  mode="phone"
                  email={contactEmail}
                  phone={contactPhone}
                  onEmailChange={setContactEmail}
                  onPhoneChange={setContactPhone}
                  showBusinessFields
                  companyNumber={companyNumber}
                  vatNumber={vatNumber}
                  country={formData.country}
                  onCompanyNumberChange={setCompanyNumber}
                  onVatNumberChange={setVatNumber}
                  onCountryChange={(v) => handleInputChange('country', v)}
                  onVerificationChange={setContactVerification}
                  compact
                />
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tagline (max 80 characters)
                      </label>
                      <input
                        type="text"
                        value={formData.tagline}
                        onChange={(e) => handleInputChange('tagline', e.target.value)}
                        maxLength={80}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.project_type}
                        onChange={(e) => handleInputChange('project_type', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="personal">Personal Project</option>
                        <option value="startup">Startup / Business Project</option>
                        <option value="community">Community / Charity Project</option>
                        <option value="creative">Creative / Innovation Project</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="technology">Technology</option>
                        <option value="creative_arts">Creative Arts</option>
                        <option value="community_social_impact">Community & Social Impact</option>
                        <option value="health_wellness">Health & Wellness</option>
                        <option value="education">Education</option>
                        <option value="real_estate">Real Estate</option>
                        <option value="environment">Environment</option>
                        <option value="startups_business">Startups & Business</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Story & Vision */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Story & Vision
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        The Problem You're Solving
                      </label>
                      <textarea
                        value={formData.problem_solving}
                        onChange={(e) => handleInputChange('problem_solving', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Vision / Mission
                      </label>
                      <textarea
                        value={formData.vision_mission}
                        onChange={(e) => handleInputChange('vision_mission', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Why This Matters Now
                      </label>
                      <textarea
                        value={formData.why_now}
                        onChange={(e) => handleInputChange('why_now', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Funding Details */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Funding Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Funding Goal <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          {formData.currency}
                        </span>
                        <input
                          type="number"
                          value={formData.funding_goal}
                          onChange={(e) => handleInputChange('funding_goal', e.target.value)}
                          className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                      </label>
                      <select
                        value={formData.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="USD">USD</option>
                        <option value="GBP">GBP</option>
                        <option value="EUR">EUR</option>
                        <option value="AUD">AUD</option>
                        <option value="CAD">CAD</option>
                        <option value="INR">INR</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Contribution <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.minimum_contribution}
                        onChange={(e) => handleInputChange('minimum_contribution', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Funding type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.funding_model}
                        onChange={(e) => handleInputChange('funding_model', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02a95c] focus:border-transparent"
                      >
                        <option value="loan">Business loan — repayable funding</option>
                        <option value="equity">Share partnership — equity / profit share</option>
                        <option value="hybrid">Hybrid — loan + partnership mix</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Funding Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.funding_starts_at}
                        onChange={(e) => handleInputChange('funding_starts_at', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Funding End Date
                      </label>
                      <input
                        type="date"
                        value={formData.funding_ends_at}
                        onChange={(e) => handleInputChange('funding_ends_at', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Use of Funds */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Use of Funds Breakdown
                      </label>
                      <button
                        type="button"
                        onClick={() => addArrayItem('use_of_funds', { item: '', amount: '' })}
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" /> Add Item
                      </button>
                    </div>
                    {formData.use_of_funds.map((item, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Item description"
                          value={item.item}
                          onChange={(e) => handleArrayChange('use_of_funds', index, 'item', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder="Amount"
                          value={item.amount}
                          onChange={(e) => handleArrayChange('use_of_funds', index, 'amount', e.target.value)}
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('use_of_funds', index)}
                          className="p-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Milestones */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Milestones
                      </label>
                      <button
                        type="button"
                        onClick={() => addArrayItem('milestones', { milestone: '', expected_date: '' })}
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" /> Add Milestone
                      </button>
                    </div>
                    {formData.milestones.map((milestone, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Milestone description"
                          value={milestone.milestone}
                          onChange={(e) => handleArrayChange('milestones', index, 'milestone', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="date"
                          value={milestone.expected_date}
                          onChange={(e) => handleArrayChange('milestones', index, 'expected_date', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('milestones', index)}
                          className="p-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cover Image */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Cover Image <span className="text-red-500">*</span>
                  </h3>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#02a95c] transition-colors">
                    {formData.cover_image instanceof File ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(formData.cover_image)}
                          alt="Cover preview"
                          className="max-h-64 mx-auto rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleFileChange('cover_image', null)}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : coverImagePreviewUrl ? (
                      <div className="relative">
                        <img
                          src={coverImagePreviewUrl}
                          alt="Cover preview"
                          className="max-h-64 mx-auto rounded-lg"
                          onError={(e) => {
                            e.target.src = '/img/NoImage.png';
                          }}
                        />
                        {!demoMode && (
                          <button
                            type="button"
                            onClick={() => setCoverImagePreviewUrl(null)}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">Click to upload cover image</p>
                        <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange('cover_image', e.target.files[0])}
                          className="hidden"
                          id="cover-upload"
                          required
                        />
                        <label
                          htmlFor="cover-upload"
                          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                        >
                          Choose File
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Images */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Additional Images
                  </h3>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors mb-4">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Upload additional images</p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleMultipleFilesChange('additional_images', e.target.files)}
                      className="hidden"
                      id="additional-upload"
                    />
                    <label
                      htmlFor="additional-upload"
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      Choose Files
                    </label>
                  </div>

                  {formData.additional_images.length > 0 && (
                    <div className="grid grid-cols-4 gap-4">
                      {formData.additional_images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Additional ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile('additional_images', index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Team Members */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Team Members
                  </h3>
                  
                  <button
                    type="button"
                    onClick={() => addArrayItem('team_members', { name: '', role: '', photo: null })}
                    className="mb-4 text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Team Member
                  </button>

                  {formData.team_members.map((member, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => handleArrayChange('team_members', index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                          <input
                            type="text"
                            value={member.role}
                            onChange={(e) => handleArrayChange('team_members', index, 'role', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleArrayChange('team_members', index, 'photo', e.target.files[0])}
                          className="hidden"
                          id={`team-photo-${index}`}
                        />
                        <label
                          htmlFor={`team-photo-${index}`}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer text-sm"
                        >
                          Upload Photo
                        </label>
                        {member.photo && (
                          <span className="text-sm text-green-600">Photo selected</span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeArrayItem('team_members', index)}
                          className="ml-auto text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rewards */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Rewards (for reward-based funding)
                  </h3>
                  
                  <button
                    type="button"
                    onClick={() => addArrayItem('rewards', { title: '', description: '', minimum_contribution: '', limit: '', estimated_delivery: '' })}
                    className="mb-4 text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Reward Tier
                  </button>

                  {formData.rewards.map((reward, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Reward Title</label>
                          <input
                            type="text"
                            value={reward.title}
                            onChange={(e) => handleArrayChange('rewards', index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Contribution</label>
                          <input
                            type="number"
                            value={reward.minimum_contribution}
                            onChange={(e) => handleArrayChange('rewards', index, 'minimum_contribution', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={reward.description}
                          onChange={(e) => handleArrayChange('rewards', index, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Limit (optional)</label>
                          <input
                            type="number"
                            value={reward.limit}
                            onChange={(e) => handleArrayChange('rewards', index, 'limit', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery</label>
                          <input
                            type="date"
                            value={reward.estimated_delivery || reward.estimated_delivery_date || ''}
                            onChange={(e) => {
                              handleArrayChange('rewards', index, 'estimated_delivery', e.target.value);
                              handleArrayChange('rewards', index, 'estimated_delivery_date', e.target.value);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('rewards', index)}
                        className="mt-4 text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Remove Reward
                      </button>
                    </div>
                  ))}
                </div>

                {/* Promotion Tier */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Promotion Options
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {promotionTiers.map((tier) => (
                      <div
                        key={tier.id}
                        onClick={() => handleInputChange('promotion_tier', tier.id)}
                        className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.promotion_tier === tier.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {tier.id === 'featured' && (
                          <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                            Popular
                          </div>
                        )}
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tier.color} flex items-center justify-center text-white mb-3`}>
                          {tier.icon}
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">{tier.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">${tier.price}</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          {tier.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-center gap-1">
                              <Check className="w-3 h-3 text-green-500" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Agreements */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Terms & Conditions
                  </h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.agreeTerms}
                        onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                        className="mt-1"
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the terms and conditions of the funding platform
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.confirmAccuracy}
                        onChange={(e) => handleInputChange('confirmAccuracy', e.target.checked)}
                        className="mt-1"
                      />
                      <span className="text-sm text-gray-700">
                        I confirm that all information provided is accurate and truthful
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || demoMode}
                  className="px-6 py-2 bg-[#02a95c] text-white rounded-lg font-medium hover:bg-[#028a4a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {demoMode ? (
                    'Demo preview only'
                  ) : isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                      Saving...
                    </>
                  ) : (
                    editData ? 'Update Campaign' : 'Create Campaign'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FundingPostFormModal;
