import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Building, AlertCircle } from 'lucide-react';
import jobsAPI from '../../api/jobsAPI';
import { getStorageAssetUrl } from '../../utils/jobsHelpers';

const JobsModalForm = ({ onClose, onSuccess, defaultPostType = 'employer', lockPostType = false, editSeekerId = null, initialSeekerData = null }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [postType, setPostType] = useState(defaultPostType);
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState({ company_logo: false, profile_photo: false, cv_file: false });
  const [previewUrls, setPreviewUrls] = useState({ company_logo: '', profile_photo: '', cv_file: '' });
  const [localPreviews, setLocalPreviews] = useState({ company_logo: '', profile_photo: '', cv_file: '' });
  const [pendingFiles, setPendingFiles] = useState({ company_logo: null, profile_photo: null, cv_file: null });

  const isUploading = Object.values(uploading).some(Boolean);

  const uploadFile = async (file, type) => {
    const result = await jobsAPI.uploadFile(file, type);
    const fileUrl = result?.data?.file_url || result?.file_url;
    if (!result?.success || !fileUrl) {
      throw new Error(result?.error || result?.message || 'Upload failed');
    }
    return fileUrl;
  };

  const ensureFileUploaded = async (type, currentUrl, pendingFile) => {
    if (currentUrl) return currentUrl;
    if (!pendingFile) return '';
    if (uploading[type]) {
      throw new Error('Please wait for the file upload to finish');
    }
    setUploading((prev) => ({ ...prev, [type]: true }));
    try {
      const fileUrl = await uploadFile(pendingFile, type);
      setPreviewUrls((prev) => ({ ...prev, [type]: fileUrl }));
      setPendingFiles((prev) => ({ ...prev, [type]: null }));
      return fileUrl;
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  // -------- Employer (Job) state -- mirrors JobController@store validation --------
  const [employerData, setEmployerData] = useState({
    title: '',
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: '',
    skills_needed: '',
    company_name: '',
    company_description: '',
    company_size: '',
    company_industry: '',
    company_founded: '',
    company_logo: '',
    company_website: '',
    company_social_linkedin: '',
    company_social_twitter: '',
    company_social_facebook: '',
    category_id: '',
    country: '',
    city: '',
    state: '',
    address: '',
    latitude: '',
    longitude: '',
    work_type: 'Full-time',
    salary_range: '',
    currency: 'USD',
    experience_level: '',
    education_level: '',
    remote_available: false,
    application_method: 'email',
    application_email: '',
    application_phone: '',
    application_website: '',
    application_instructions: '',
    verified_employer: false,
    terms_accepted: false,
    accurate_info: false,
  });

  // -------- Job Seeker state -- mirrors JobSeekerController@store validation --------
  const [seekerData, setSeekerData] = useState({
    title: '',
    bio: '',
    profile_photo: '',
    cv_file: '',
    portfolio_link: '',
    linkedin_url: '',
    github_url: '',
    website_url: '',
    experience_level: '',
    years_of_experience: '',
    education_level: '',
    key_skills: '',
    desired_role: '',
    industries_interested: '',
    salary_expectation_min: '',
    salary_expectation_max: '',
    salary_currency: 'USD',
    preferred_work_type: '',
    is_remote_available: false,
    country: '',
    city: '',
    latitude: '',
    longitude: '',
    location_name: '',
    willing_to_relocate: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const response = await jobsAPI.getCategories();
        if (response?.data) setCategories(response.data);
      } catch (e) {
        console.error('Error loading categories:', e);
      }
    })();
  }, []);

  useEffect(() => {
    if (!initialSeekerData) return;
    setPostType('jobseeker');
    setSeekerData((prev) => ({
      ...prev,
      title: initialSeekerData.title || '',
      bio: initialSeekerData.bio || '',
      profile_photo: initialSeekerData.profile_photo || '',
      cv_file: initialSeekerData.cv_file || '',
      portfolio_link: initialSeekerData.portfolio_link || '',
      linkedin_url: initialSeekerData.linkedin_url || '',
      github_url: initialSeekerData.github_url || '',
      website_url: initialSeekerData.website_url || '',
      experience_level: initialSeekerData.experience_level || '',
      years_of_experience: initialSeekerData.years_of_experience ?? '',
      education_level: initialSeekerData.education_level || '',
      key_skills: initialSeekerData.key_skills || '',
      desired_role: initialSeekerData.desired_role || '',
      industries_interested: initialSeekerData.industries_interested || '',
      salary_expectation_min: initialSeekerData.salary_expectation_min ?? '',
      salary_expectation_max: initialSeekerData.salary_expectation_max ?? '',
      salary_currency: initialSeekerData.salary_currency || 'USD',
      preferred_work_type: initialSeekerData.preferred_work_type || '',
      is_remote_available: Boolean(initialSeekerData.is_remote_available),
      country: initialSeekerData.country || '',
      city: initialSeekerData.city || '',
      latitude: initialSeekerData.latitude ?? '',
      longitude: initialSeekerData.longitude ?? '',
      location_name: initialSeekerData.location_name || '',
      willing_to_relocate: Boolean(initialSeekerData.willing_to_relocate),
    }));
    if (initialSeekerData.profile_photo) {
      setPreviewUrls((prev) => ({ ...prev, profile_photo: initialSeekerData.profile_photo }));
    }
  }, [initialSeekerData]);

  const handleEmployerChange = (field, value) => {
    setEmployerData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSeekerChange = (field, value) => {
    setSeekerData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;

    setPendingFiles((prev) => ({ ...prev, [type]: file }));

    const localPreview = URL.createObjectURL(file);
    setLocalPreviews((prev) => ({ ...prev, [type]: localPreview }));

    setUploading((prev) => ({ ...prev, [type]: true }));
    setError('');
    try {
      const fileUrl = await uploadFile(file, type);

      if (type === 'company_logo') {
        setEmployerData((prev) => ({ ...prev, company_logo: fileUrl }));
      } else {
        setSeekerData((prev) => ({ ...prev, [type]: fileUrl }));
      }

      setPreviewUrls((prev) => ({ ...prev, [type]: fileUrl }));
      setPendingFiles((prev) => ({ ...prev, [type]: null }));
      setLocalPreviews((prev) => ({ ...prev, [type]: '' }));
      URL.revokeObjectURL(localPreview);
    } catch (e) {
      console.error('Upload error:', e);
      setError(e.message || 'Failed to upload file. It will retry when you submit.');
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const submitEmployer = async () => {
    if (!employerData.title || !employerData.description || !employerData.company_name ||
        !employerData.category_id || !employerData.country || !employerData.city ||
        !employerData.work_type || !employerData.experience_level || !employerData.application_method) {
      setError('Please fill in all required fields (including category)');
      return;
    }
    if (!employerData.terms_accepted || !employerData.accurate_info) {
      setError('You must accept the terms and confirm the information is accurate');
      return;
    }
    if (isUploading) {
      setError('Please wait for file uploads to finish');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const companyLogo = await ensureFileUploaded(
        'company_logo',
        employerData.company_logo,
        pendingFiles.company_logo
      );

      const { company_social_linkedin, company_social_twitter, company_social_facebook, ...rest } = employerData;
      const payload = { ...rest, company_logo: companyLogo || rest.company_logo };
      const companySocial = {};
      if (company_social_linkedin) companySocial.linkedin = company_social_linkedin;
      if (company_social_twitter) companySocial.twitter = company_social_twitter;
      if (company_social_facebook) companySocial.facebook = company_social_facebook;
      if (Object.keys(companySocial).length) payload.company_social = companySocial;
      if (payload.latitude !== '') payload.latitude = parseFloat(payload.latitude);
      if (payload.longitude !== '') payload.longitude = parseFloat(payload.longitude);
      Object.keys(payload).forEach((k) => {
        if (payload[k] === '' || payload[k] === null || payload[k] === undefined) delete payload[k];
      });
      const response = await jobsAPI.createJob(payload);
      if (response?.data || response?.success) {
        if (onSuccess) onSuccess(response?.data || response);
        onClose();
      }
    } catch (e) {
      console.error('Error creating job:', e);
      setError(e.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitSeeker = async () => {
    if (!seekerData.title || !seekerData.country || !seekerData.city) {
      setError('Profile title, country, and city are required');
      return;
    }
    if (isUploading) {
      setError('Please wait for file uploads to finish');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const profilePhoto = await ensureFileUploaded(
        'profile_photo',
        seekerData.profile_photo,
        pendingFiles.profile_photo
      );
      const cvFile = await ensureFileUploaded(
        'cv_file',
        seekerData.cv_file,
        pendingFiles.cv_file
      );

      const payload = {
        ...seekerData,
        profile_photo: profilePhoto || seekerData.profile_photo,
        cv_file: cvFile || seekerData.cv_file,
      };
      if (payload.years_of_experience !== '' && payload.years_of_experience != null) {
        payload.years_of_experience = parseInt(payload.years_of_experience, 10) || 0;
      }
      if (payload.salary_expectation_min !== '') payload.salary_expectation_min = parseFloat(payload.salary_expectation_min);
      if (payload.salary_expectation_max !== '') payload.salary_expectation_max = parseFloat(payload.salary_expectation_max);
      if (payload.latitude !== '') payload.latitude = parseFloat(payload.latitude);
      if (payload.longitude !== '') payload.longitude = parseFloat(payload.longitude);
      Object.keys(payload).forEach((k) => {
        if (payload[k] === '' || payload[k] === null || payload[k] === undefined) delete payload[k];
      });
      const response = editSeekerId
        ? await jobsAPI.updateSeekerProfile(editSeekerId, payload)
        : await jobsAPI.createSeekerProfile(payload);
      if (response?.data || response?.success) {
        if (onSuccess) onSuccess(response?.data || response);
        onClose();
      }
    } catch (e) {
      console.error('Error creating seeker profile:', e);
      setError(e.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (postType === 'employer') submitEmployer();
    else submitSeeker();
  };

  const inputCls =
    'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Post to Jobs Platform</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Post Type Switcher */}
          {!lockPostType && (
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => { setPostType('employer'); setError(''); }}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  postType === 'employer'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Building className="h-5 w-5" />
                  <span className="font-semibold">Post Job Vacancy</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => { setPostType('jobseeker'); setError(''); }}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  postType === 'jobseeker'
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="font-semibold">Post Job Seeker Profile</span>
                </div>
              </button>
            </div>
          </div>
          )}

          {/* Form Body */}
          <div className="overflow-y-auto flex-1 px-6 py-4">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {postType === 'employer' ? (
                <>
                  {/* Section: Job Details */}
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Job Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Job Title <span className="text-red-500">*</span></label>
                      <input type="text" value={employerData.title}
                        onChange={(e) => handleEmployerChange('title', e.target.value)}
                        className={inputCls} placeholder="e.g. Senior Frontend Developer" required maxLength={255} />
                    </div>
                    <div>
                      <label className={labelCls}>Category <span className="text-red-500">*</span></label>
                      <select value={employerData.category_id}
                        onChange={(e) => handleEmployerChange('category_id', e.target.value)} className={inputCls} required>
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Description <span className="text-red-500">*</span></label>
                    <textarea rows={3} value={employerData.description}
                      onChange={(e) => handleEmployerChange('description', e.target.value)} className={inputCls}
                      placeholder="Describe the role..." required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Responsibilities</label>
                      <textarea rows={2} value={employerData.responsibilities}
                        onChange={(e) => handleEmployerChange('responsibilities', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Requirements</label>
                      <textarea rows={2} value={employerData.requirements}
                        onChange={(e) => handleEmployerChange('requirements', e.target.value)} className={inputCls} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Benefits</label>
                      <textarea rows={2} value={employerData.benefits}
                        onChange={(e) => handleEmployerChange('benefits', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Skills Needed</label>
                      <input type="text" value={employerData.skills_needed}
                        onChange={(e) => handleEmployerChange('skills_needed', e.target.value)} className={inputCls}
                        placeholder="e.g. React, Node.js (comma separated)" />
                    </div>
                  </div>

                  {/* Section: Company */}
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 pt-2">Company</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Company Name <span className="text-red-500">*</span></label>
                      <input type="text" value={employerData.company_name}
                        onChange={(e) => handleEmployerChange('company_name', e.target.value)} className={inputCls}
                        required maxLength={255} />
                    </div>
                    <div>
                      <label className={labelCls}>Company Logo</label>
                      <div className="space-y-2">
                        <input type="file" accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'company_logo');
                          }}
                          className={inputCls} />
                        {uploading.company_logo && <p className="text-sm text-blue-600">Uploading...</p>}
                        {(localPreviews.company_logo || previewUrls.company_logo) && (
                          <img
                            src={localPreviews.company_logo || getStorageAssetUrl(previewUrls.company_logo)}
                            alt="Logo preview"
                            className="h-20 w-auto object-contain border rounded"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Company Website</label>
                    <input type="url" value={employerData.company_website}
                      onChange={(e) => handleEmployerChange('company_website', e.target.value)} className={inputCls}
                      placeholder="https://example.com" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>Company Size</label>
                      <select value={employerData.company_size}
                        onChange={(e) => handleEmployerChange('company_size', e.target.value)} className={inputCls}>
                        <option value="">Select</option>
                        <option value="1-10">1-10</option>
                        <option value="11-50">11-50</option>
                        <option value="51-200">51-200</option>
                        <option value="201-500">201-500</option>
                        <option value="500+">500+</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Industry</label>
                      <input type="text" value={employerData.company_industry}
                        onChange={(e) => handleEmployerChange('company_industry', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Founded Year</label>
                      <input type="text" value={employerData.company_founded}
                        onChange={(e) => handleEmployerChange('company_founded', e.target.value)} className={inputCls}
                        placeholder="e.g. 2010" maxLength={20} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Company Description</label>
                    <textarea rows={2} value={employerData.company_description}
                      onChange={(e) => handleEmployerChange('company_description', e.target.value)} className={inputCls} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>Company LinkedIn</label>
                      <input type="url" value={employerData.company_social_linkedin}
                        onChange={(e) => handleEmployerChange('company_social_linkedin', e.target.value)} className={inputCls}
                        placeholder="https://linkedin.com/company/..." />
                    </div>
                    <div>
                      <label className={labelCls}>Company Twitter/X</label>
                      <input type="url" value={employerData.company_social_twitter}
                        onChange={(e) => handleEmployerChange('company_social_twitter', e.target.value)} className={inputCls}
                        placeholder="https://twitter.com/..." />
                    </div>
                    <div>
                      <label className={labelCls}>Company Facebook</label>
                      <input type="url" value={employerData.company_social_facebook}
                        onChange={(e) => handleEmployerChange('company_social_facebook', e.target.value)} className={inputCls}
                        placeholder="https://facebook.com/..." />
                    </div>
                  </div>

                  {/* Section: Location */}
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 pt-2">Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>Country <span className="text-red-500">*</span></label>
                      <input type="text" value={employerData.country}
                        onChange={(e) => handleEmployerChange('country', e.target.value)} className={inputCls} required maxLength={100} />
                    </div>
                    <div>
                      <label className={labelCls}>City <span className="text-red-500">*</span></label>
                      <input type="text" value={employerData.city}
                        onChange={(e) => handleEmployerChange('city', e.target.value)} className={inputCls} required maxLength={100} />
                    </div>
                    <div>
                      <label className={labelCls}>State/Province</label>
                      <input type="text" value={employerData.state}
                        onChange={(e) => handleEmployerChange('state', e.target.value)} className={inputCls} maxLength={100} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Address</label>
                    <input type="text" value={employerData.address}
                      onChange={(e) => handleEmployerChange('address', e.target.value)} className={inputCls} maxLength={500} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Latitude</label>
                      <input type="number" step="any" value={employerData.latitude}
                        onChange={(e) => handleEmployerChange('latitude', e.target.value)} className={inputCls}
                        placeholder="e.g. 40.7128" />
                    </div>
                    <div>
                      <label className={labelCls}>Longitude</label>
                      <input type="number" step="any" value={employerData.longitude}
                        onChange={(e) => handleEmployerChange('longitude', e.target.value)} className={inputCls}
                        placeholder="e.g. -74.0060" />
                    </div>
                  </div>

                  {/* Section: Specifications */}
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 pt-2">Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>Work Type <span className="text-red-500">*</span></label>
                      <select value={employerData.work_type}
                        onChange={(e) => handleEmployerChange('work_type', e.target.value)} className={inputCls} required>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Internship">Internship</option>
                        <option value="Temporary">Temporary</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Experience Level <span className="text-red-500">*</span></label>
                      <select value={employerData.experience_level}
                        onChange={(e) => handleEmployerChange('experience_level', e.target.value)} className={inputCls} required>
                        <option value="">Select</option>
                        <option value="entry">Entry</option>
                        <option value="mid">Mid</option>
                        <option value="senior">Senior</option>
                        <option value="executive">Executive</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Education Level</label>
                      <select value={employerData.education_level}
                        onChange={(e) => handleEmployerChange('education_level', e.target.value)} className={inputCls}>
                        <option value="">Select</option>
                        <option value="high_school">High School</option>
                        <option value="associate">Associate</option>
                        <option value="bachelor">Bachelor</option>
                        <option value="master">Master</option>
                        <option value="doctorate">Doctorate</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>Salary Range</label>
                      <input type="text" value={employerData.salary_range}
                        onChange={(e) => handleEmployerChange('salary_range', e.target.value)} className={inputCls}
                        placeholder="e.g. 50000-75000" />
                    </div>
                    <div>
                      <label className={labelCls}>Currency</label>
                      <select value={employerData.currency}
                        onChange={(e) => handleEmployerChange('currency', e.target.value)} className={inputCls}>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="CAD">CAD</option>
                        <option value="AUD">AUD</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={employerData.remote_available}
                          onChange={(e) => handleEmployerChange('remote_available', e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded" />
                        <span className="text-sm font-medium text-gray-700">Remote Available</span>
                      </label>
                    </div>
                  </div>

                  {/* Section: Application */}
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 pt-2">Application</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Application Method <span className="text-red-500">*</span></label>
                      <select value={employerData.application_method}
                        onChange={(e) => handleEmployerChange('application_method', e.target.value)} className={inputCls} required>
                        <option value="email">Email</option>
                        <option value="website">Website</option>
                        <option value="phone">Phone</option>
                        <option value="in_person">In Person</option>
                        <option value="platform">Platform</option>
                      </select>
                    </div>
                    {employerData.application_method === 'email' && (
                      <div>
                        <label className={labelCls}>Application Email <span className="text-red-500">*</span></label>
                        <input type="email" value={employerData.application_email}
                          onChange={(e) => handleEmployerChange('application_email', e.target.value)} className={inputCls} required />
                      </div>
                    )}
                    {employerData.application_method === 'website' && (
                      <div>
                        <label className={labelCls}>Application Website <span className="text-red-500">*</span></label>
                        <input type="url" value={employerData.application_website}
                          onChange={(e) => handleEmployerChange('application_website', e.target.value)} className={inputCls} required />
                      </div>
                    )}
                    {employerData.application_method === 'phone' && (
                      <div>
                        <label className={labelCls}>Application Phone <span className="text-red-500">*</span></label>
                        <input type="tel" value={employerData.application_phone}
                          onChange={(e) => handleEmployerChange('application_phone', e.target.value)} className={inputCls} required />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Application Instructions</label>
                    <textarea rows={2} value={employerData.application_instructions}
                      onChange={(e) => handleEmployerChange('application_instructions', e.target.value)} className={inputCls} />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input type="checkbox" id="verified_employer" checked={employerData.verified_employer}
                      onChange={(e) => handleEmployerChange('verified_employer', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded" />
                    <label htmlFor="verified_employer" className="text-sm font-medium text-gray-700">Verified Employer</label>
                  </div>

                  {/* Terms */}
                  <div className="border-t pt-4 space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={employerData.terms_accepted}
                        onChange={(e) => handleEmployerChange('terms_accepted', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded" required />
                      <span className="text-sm text-gray-700">I accept the terms and conditions <span className="text-red-500">*</span></span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={employerData.accurate_info}
                        onChange={(e) => handleEmployerChange('accurate_info', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded" required />
                      <span className="text-sm text-gray-700">I confirm that all information is accurate <span className="text-red-500">*</span></span>
                    </label>
                  </div>
                </>
              ) : (
                <>
                  {/* Section: Profile */}
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Profile</h3>
                  <div>
                    <label className={labelCls}>Profile Title <span className="text-red-500">*</span></label>
                    <input type="text" value={seekerData.title}
                      onChange={(e) => handleSeekerChange('title', e.target.value)} className={inputCls}
                      placeholder="e.g. Senior Full Stack Developer" required maxLength={200} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Profile Photo</label>
                      <div className="space-y-2">
                        <input type="file" accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'profile_photo');
                          }}
                          className={inputCls} />
                        {uploading.profile_photo && <p className="text-sm text-blue-600">Uploading...</p>}
                        {(localPreviews.profile_photo || previewUrls.profile_photo) && (
                          <img
                            src={localPreviews.profile_photo || getStorageAssetUrl(previewUrls.profile_photo)}
                            alt="Preview"
                            className="h-20 w-20 object-cover border rounded-full"
                          />
                        )}
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>CV File</label>
                      <div className="space-y-2">
                        <input type="file" accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'cv_file');
                          }}
                          className={inputCls} />
                        {uploading.cv_file && <p className="text-sm text-blue-600">Uploading...</p>}
                        {previewUrls.cv_file && (
                          <p className="text-sm text-green-600">File uploaded: {previewUrls.cv_file.split('/').pop()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Bio</label>
                    <textarea rows={3} value={seekerData.bio}
                      onChange={(e) => handleSeekerChange('bio', e.target.value)} className={inputCls}
                      placeholder="Tell us about yourself..." />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Desired Role</label>
                      <input type="text" value={seekerData.desired_role}
                        onChange={(e) => handleSeekerChange('desired_role', e.target.value)} className={inputCls}
                        placeholder="e.g. Senior Full Stack Developer" />
                    </div>
                    <div>
                      <label className={labelCls}>Industries Interested</label>
                      <input type="text" value={seekerData.industries_interested}
                        onChange={(e) => handleSeekerChange('industries_interested', e.target.value)} className={inputCls}
                        placeholder="e.g. Tech, Finance, Healthcare" />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Key Skills</label>
                    <input type="text" value={seekerData.key_skills}
                      onChange={(e) => handleSeekerChange('key_skills', e.target.value)} className={inputCls}
                      placeholder="e.g. React, Node.js, Python (comma separated)" />
                  </div>

                  {/* Section: Experience & Education */}
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 pt-2">Experience & Education</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>Experience Level</label>
                      <select value={seekerData.experience_level}
                        onChange={(e) => handleSeekerChange('experience_level', e.target.value)} className={inputCls}>
                        <option value="">Select</option>
                        <option value="entry">Entry</option>
                        <option value="junior">Junior</option>
                        <option value="mid">Mid</option>
                        <option value="senior">Senior</option>
                        <option value="executive">Executive</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Years of Experience</label>
                      <input type="number" min="0" value={seekerData.years_of_experience}
                        onChange={(e) => handleSeekerChange('years_of_experience', e.target.value)} className={inputCls}
                        placeholder="e.g. 5" />
                    </div>
                    <div>
                      <label className={labelCls}>Education Level</label>
                      <select value={seekerData.education_level}
                        onChange={(e) => handleSeekerChange('education_level', e.target.value)} className={inputCls}>
                        <option value="">Select</option>
                        <option value="high_school">High School</option>
                        <option value="diploma">Diploma</option>
                        <option value="bachelor">Bachelor</option>
                        <option value="master">Master</option>
                        <option value="phd">PhD</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>

                  {/* Section: Salary & Work Preference */}
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 pt-2">Salary & Work Preference</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>Salary Min</label>
                      <input type="number" min="0" value={seekerData.salary_expectation_min}
                        onChange={(e) => handleSeekerChange('salary_expectation_min', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Salary Max</label>
                      <input type="number" min="0" value={seekerData.salary_expectation_max}
                        onChange={(e) => handleSeekerChange('salary_expectation_max', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Currency</label>
                      <select value={seekerData.salary_currency}
                        onChange={(e) => handleSeekerChange('salary_currency', e.target.value)} className={inputCls}>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Preferred Work Type</label>
                      <select value={seekerData.preferred_work_type}
                        onChange={(e) => handleSeekerChange('preferred_work_type', e.target.value)} className={inputCls}>
                        <option value="">Select</option>
                        <option value="full_time">Full-time</option>
                        <option value="part_time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="temporary">Temporary</option>
                        <option value="internship">Internship</option>
                        <option value="remote">Remote</option>
                        <option value="any">Any</option>
                      </select>
                    </div>
                    <div className="flex items-end gap-6">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={seekerData.is_remote_available}
                          onChange={(e) => handleSeekerChange('is_remote_available', e.target.checked)}
                          className="w-4 h-4 text-green-600 rounded" />
                        <span className="text-sm font-medium text-gray-700">Remote Available</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={seekerData.willing_to_relocate}
                          onChange={(e) => handleSeekerChange('willing_to_relocate', e.target.checked)}
                          className="w-4 h-4 text-green-600 rounded" />
                        <span className="text-sm font-medium text-gray-700">Willing to Relocate</span>
                      </label>
                    </div>
                  </div>

                  {/* Section: Location */}
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 pt-2">Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>Country <span className="text-red-500">*</span></label>
                      <input type="text" value={seekerData.country}
                        onChange={(e) => handleSeekerChange('country', e.target.value)} className={inputCls} required maxLength={100} />
                    </div>
                    <div>
                      <label className={labelCls}>City <span className="text-red-500">*</span></label>
                      <input type="text" value={seekerData.city}
                        onChange={(e) => handleSeekerChange('city', e.target.value)} className={inputCls} required maxLength={100} />
                    </div>
                    <div>
                      <label className={labelCls}>Location Name</label>
                      <input type="text" value={seekerData.location_name}
                        onChange={(e) => handleSeekerChange('location_name', e.target.value)} className={inputCls}
                        placeholder="e.g. Downtown Manhattan" maxLength={255} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Latitude</label>
                      <input type="number" step="any" value={seekerData.latitude}
                        onChange={(e) => handleSeekerChange('latitude', e.target.value)} className={inputCls}
                        placeholder="e.g. 40.7128" />
                    </div>
                    <div>
                      <label className={labelCls}>Longitude</label>
                      <input type="number" step="any" value={seekerData.longitude}
                        onChange={(e) => handleSeekerChange('longitude', e.target.value)} className={inputCls}
                        placeholder="e.g. -74.0060" />
                    </div>
                  </div>

                  {/* Section: Links */}
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 pt-2">Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>LinkedIn URL</label>
                      <input type="url" value={seekerData.linkedin_url}
                        onChange={(e) => handleSeekerChange('linkedin_url', e.target.value)} className={inputCls}
                        placeholder="https://linkedin.com/in/yourprofile" maxLength={500} />
                    </div>
                    <div>
                      <label className={labelCls}>GitHub URL</label>
                      <input type="url" value={seekerData.github_url}
                        onChange={(e) => handleSeekerChange('github_url', e.target.value)} className={inputCls}
                        placeholder="https://github.com/yourusername" maxLength={500} />
                    </div>
                    <div>
                      <label className={labelCls}>Portfolio Link</label>
                      <input type="url" value={seekerData.portfolio_link}
                        onChange={(e) => handleSeekerChange('portfolio_link', e.target.value)} className={inputCls}
                        placeholder="https://yourportfolio.com" maxLength={500} />
                    </div>
                    <div>
                      <label className={labelCls}>Personal Website</label>
                      <input type="url" value={seekerData.website_url}
                        onChange={(e) => handleSeekerChange('website_url', e.target.value)} className={inputCls}
                        placeholder="https://yourwebsite.com" maxLength={500} />
                    </div>
                  </div>
                </>
              )}
            </form>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || isUploading}
              className={`px-6 py-2 rounded-lg text-white font-medium transition-all ${
                postType === 'employer' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
              } ${loading || isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Submitting...' : isUploading ? 'Uploading...' : 'Submit'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JobsModalForm;
