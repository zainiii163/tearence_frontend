import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Briefcase, 
  User, 
  Building, 
  MapPin, 
  DollarSign, 
  Clock, 
  FileText, 
  Upload, 
  Star, 
  Check, 
  AlertCircle,
  Globe,
  Heart,
  Award,
  TrendingUp,
  Zap,
  Crown
} from 'lucide-react';
import jobService from '../../services/JobServices';

const JobsPostForm = ({ onClose, onJobPosted }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [postType, setPostType] = useState('');
  const [selectedTier, setSelectedTier] = useState('');
  const [formData, setFormData] = useState({
    // Employer Vacancy Form
    jobTitle: '',
    companyName: '',
    industryCategory: '',
    country: '',
    city: '',
    workType: '',
    salaryRange: '',
    currency: 'USD',
    benefits: [],
    overview: '',
    responsibilities: '',
    requirements: '',
    skillsNeeded: '',
    jobEducationLevel: '',
    experienceLevel: '',
    applicationMethod: 'email',
    applicationEmail: '',
    applicationWebsite: '',
    companyLogo: null,
    companyWebsite: '',
    companySocial: [],
    verifiedEmployer: false,
    
    // Job Seeker Profile Form
    fullName: '',
    email: '',
    phone: '',
    profession: '',
    location: '',
    remoteAvailability: false,
    yearsExperience: '',
    keySkills: [],
    education: '',
    educationLevel: 'high_school',
    educationDetails: '',
    experienceSummary: '',
    cvFile: null,
    profilePhoto: '',
    bio: '',
    desiredRole: '',
    salaryExpectation: '',
    workType: 'Full-time',
    state: '',
    latitude: null,
    longitude: null,
    preferredLocations: [],
    industriesInterested: [],
    additionalLinks: [],
    portfolioLink: '',
    linkedinLink: '',
    githubLink: '',
    websiteUrl: '',
    willingToRelocate: false,
    
    // Common
    termsAccepted: false,
    accuracyConfirmed: false
  });

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const workTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Freelance',
    'Internship',
    'Temporary'
  ];

  const salaryRanges = [
    { label: 'Under $30,000', value: '0-30000' },
    { label: '$30,000 - $50,000', value: '30000-50000' },
    { label: '$50,000 - $75,000', value: '50000-75000' },
    { label: '$75,000 - $100,000', value: '75000-100000' },
    { label: '$100,000 - $150,000', value: '100000-150000' },
    { label: '$150,000 - $200,000', value: '150000-200000' },
    { label: 'Over $200,000', value: '200000+' }
  ];

  const benefits = [
    'Health Insurance',
    'Paid Leave',
    'Bonus',
    'Remote Work',
    'Flexible Hours',
    'Stock Options',
    'Retirement Plan',
    'Training & Development',
    'Gym Membership',
    'Company Car'
  ];

  const promotionTiers = [
    {
      id: 'promoted',
      name: 'Promoted',
      price: '$29',
      period: '/month',
      icon: Star,
      color: 'from-blue-500 to-blue-600',
      features: [
        'Highlighted listing',
        'Appears above standard posts',
        'Promoted badge',
        '2x visibility',
        'Basic analytics'
      ],
      recommended: false
    },
    {
      id: 'featured',
      name: 'Featured',
      price: '$49',
      period: '/month',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      features: [
        'Top of category pages',
        'Larger listing card',
        'Priority search placement',
        'Featured badge',
        'Included in weekly email',
        'Advanced analytics',
        '3x visibility'
      ],
      recommended: true
    },
    {
      id: 'sponsored',
      name: 'Sponsored',
      price: '$99',
      period: '/month',
      icon: Zap,
      color: 'from-orange-500 to-orange-600',
      features: [
        'Homepage placement',
        'Category top placement',
        'Homepage slider inclusion',
        'Sponsored badge',
        'Email newsletters',
        'Priority support',
        '5x visibility',
        'Social media promotion'
      ],
      recommended: false
    },
    {
      id: 'network',
      name: 'Network-Wide Boost',
      price: '$199',
      period: '/month',
      icon: Crown,
      color: 'from-yellow-500 to-yellow-600',
      features: [
        'Appears across all pages',
        'Homepage spotlight',
        'Category pages',
        'Related adverts',
        'Email newsletters',
        'Push notifications',
        'Top Spotlight badge',
        'Dedicated support',
        '10x visibility',
        'Premium analytics'
      ],
      recommended: false
    }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePostTypeSelect = (type) => {
    setPostType(type);
    setCurrentStep(2);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBenefitToggle = (benefit) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit)
        : [...prev.benefits, benefit]
    }));
  };

  const handleSubmit = async () => {
    try {
      // Client-side validation
      if (postType === 'jobseeker') {
        if (!formData.fullName || formData.fullName.trim() === '') {
          alert('Please enter your full name.');
          return;
        }
        if (!formData.profession || formData.profession.trim() === '') {
          alert('Please enter your profession.');
          return;
        }
        if (!formData.location || formData.location.trim() === '') {
          alert('Please enter your location (e.g., "New York, USA").');
          return;
        }
        if (!formData.yearsExperience) {
          alert('Please select your years of experience.');
          return;
        }
        if (!formData.bio || formData.bio.trim() === '') {
          alert('Please enter your bio.');
          return;
        }
      }

      if (postType === 'employer') {
        // Create job posting
        const jobData = {
          title: formData.jobTitle,
          description: formData.overview,
          responsibilities: formData.responsibilities,
          requirements: formData.requirements,
          benefits: formData.benefits.join(', '),
          skills_needed: formData.skills || '',
          company_name: formData.companyName,
          company_description: formData.companyDescription || '',
          company_size: formData.companySize || '',
          company_industry: formData.companyIndustry || '',
          company_founded: formData.companyFounded || '',
          company_website: formData.companyWebsite || '',
          country: formData.country,
          city: formData.city,
          state: formData.state || '',
          work_type: formData.workType,
          salary_range: formData.salaryRange,
          currency: formData.currency,
          experience_level: formData.experienceLevel || '',
          education_level: formData.educationLevel || '',
          remote_available: formData.remoteAvailable || false,
          application_method: formData.applicationMethod,
          application_email: formData.applicationEmail,
          application_website: formData.applicationWebsite || '',
          application_phone: formData.applicationPhone || '',
          application_instructions: formData.applicationInstructions || '',
          category_id: formData.categoryId || null,
          verified_employer: formData.verifiedEmployer || false,
          terms_accepted: formData.termsAccepted,
          accurate_info: formData.accuracyConfirmed
        };

        const response = await jobService.createJob(jobData);
        
        if (response.success) {
          // Save the created job data to localStorage for display
          const createdJob = {
            ...response.data,
            posted_at: new Date().toISOString(),
            status: 'active'
          };
          
          // Get existing posted jobs or create new array
          const existingJobs = JSON.parse(localStorage.getItem('myPostedJobs') || '[]');
          existingJobs.unshift(createdJob);
          localStorage.setItem('myPostedJobs', JSON.stringify(existingJobs));
          
          // Create upsell if selected
          if (selectedTier && selectedTier !== 'basic') {
            const upsellData = {
              upsellable_type: 'job_listing',
              upsellable_id: response.data.id,
              upsell_type: selectedTier,
              price: promotionTiers.find(t => t.id === selectedTier)?.price || 0,
              currency: 'USD'
            };
            
            await jobService.createUpsell(upsellData);
          }
          
          // Show success message with job details
          alert(`Job "${createdJob.title}" posted successfully! Your job is now live and visible to job seekers.`);
          
          // Pass the created job data back to parent
          if (onJobPosted) {
            onJobPosted(createdJob);
          }
          
          onClose();
        }
      } else if (postType === 'jobseeker') {
        // Parse location into country and city
        const locationParts = formData.location ? formData.location.split(',').map(p => p.trim()) : ['', ''];
        const country = locationParts[locationParts.length - 1] || '';
        const city = locationParts[0] || '';

        // Create seeker profile
        const profileData = {
          bio: formData.bio || '',
          profile_photo: typeof formData.profilePhoto === 'string' ? formData.profilePhoto : '',
          cv_file: typeof formData.cvFile === 'string' ? formData.cvFile : '',
          portfolio_link: formData.portfolioLink || '',
          linkedin_url: formData.linkedinLink || '',
          github_url: formData.githubLink || '',
          website_url: formData.websiteUrl || '',
          experience_level: formData.experienceLevel || 'mid',
          years_of_experience: parseInt(formData.yearsExperience) || 3,
          education_level: formData.educationLevel || 'bachelor',
          key_skills: Array.isArray(formData.keySkills) ? formData.keySkills.join(', ') : formData.keySkills || '',
          desired_role: formData.desiredRole || '',
          industries_interested: formData.industriesInterested ? formData.industriesInterested.join(', ') : '',
          salary_expectation_min: formData.salaryExpectation ? parseFloat(formData.salaryExpectation) : null,
          salary_expectation_max: null,
          salary_currency: 'USD',
          preferred_work_type: formData.workType === 'Full-time' ? 'full_time' : formData.workType === 'Part-time' ? 'part_time' : formData.workType === 'Contract' ? 'contract' : 'any',
          is_remote_available: formData.remoteAvailability || false,
          country: country,
          city: city,
          latitude: formData.latitude || null,
          longitude: formData.longitude || null,
          location_name: formData.location || '',
          willing_to_relocate: formData.willingToRelocate || false
        };

        const response = await jobService.createSeekerProfile(profileData);
        
        if (response.success) {
          // Save the created profile data to localStorage for display
          const createdProfile = {
            ...response.data,
            created_at: new Date().toISOString(),
            status: 'active'
          };
          
          // Get existing profiles or create new array
          const existingProfiles = JSON.parse(localStorage.getItem('mySeekerProfiles') || '[]');
          existingProfiles.unshift(createdProfile);
          localStorage.setItem('mySeekerProfiles', JSON.stringify(existingProfiles));
          
          // Also save to jobSeekerProfile key for JobDetailPage compatibility
          localStorage.setItem('jobSeekerProfile', JSON.stringify(createdProfile));
          
          // Create upsell if selected
          if (selectedTier && selectedTier !== 'basic') {
            const upsellData = {
              upsellable_type: 'job_seeker',
              upsellable_id: response.data.id,
              upsell_type: selectedTier,
              price: promotionTiers.find(t => t.id === selectedTier)?.price || 0,
              currency: 'USD'
            };
            
            await jobService.createUpsell(upsellData);
          }
          
          // Show success message with profile details
          alert(`Profile "${createdProfile.full_name}" created successfully! Your profile is now visible to employers.`);
          
          // Pass the created profile data back to parent
          if (onJobPosted) {
            onJobPosted(createdProfile);
          }
          
          onClose();
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit. Please try again.');
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Post Type</h2>
        <p className="text-gray-600 mb-8">Choose what you want to post on our platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employer Option */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handlePostTypeSelect('employer')}
          className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Employer</h3>
              <p className="text-sm text-gray-600">Post a Vacancy</p>
            </div>
          </div>
          <p className="text-gray-700">
            Post job openings and find qualified candidates for your company
          </p>
          <div className="mt-4 flex items-center text-blue-600">
            <span className="text-sm font-medium">Continue as Employer</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </motion.button>

        {/* Job Seeker Option */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handlePostTypeSelect('jobseeker')}
          className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Job Seeker</h3>
              <p className="text-sm text-gray-600">Post My Profile</p>
            </div>
          </div>
          <p className="text-gray-700">
            Create your professional profile and let employers find you
          </p>
          <div className="mt-4 flex items-center text-green-600">
            <span className="text-sm font-medium">Continue as Job Seeker</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </motion.button>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      {postType === 'employer' ? (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Details</h2>
          
          {/* Job Basics */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => handleFormChange('jobTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Senior Frontend Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleFormChange('companyName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. TechCorp Solutions"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Category *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => handleFormChange('categoryId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  <option value="1">Technology & IT</option>
                  <option value="2">Healthcare & Medical</option>
                  <option value="3">Finance & Accounting</option>
                  <option value="4">Sales & Marketing</option>
                  <option value="5">Engineering & Construction</option>
                  <option value="6">Education & Training</option>
                  <option value="7">Hospitality & Tourism</option>
                  <option value="8">Retail & Customer Service</option>
                  <option value="9">Logistics & Transport</option>
                  <option value="10">Creative & Media</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Type *
                </label>
                <select
                  value={formData.workType}
                  onChange={(e) => handleFormChange('workType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Work Type</option>
                  {workTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleFormChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. United States"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City / Region *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleFormChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. New York"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State / Province
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleFormChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. New York"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleFormChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education Level
                </label>
                <select
                  value={formData.jobEducationLevel}
                  onChange={(e) => handleFormChange('jobEducationLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Level</option>
                  <option value="high_school">High School</option>
                  <option value="associate">Associate Degree</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="master">Master's Degree</option>
                  <option value="doctorate">Doctorate</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Range *
                </label>
                <select
                  value={formData.salaryRange}
                  onChange={(e) => handleFormChange('salaryRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Salary Range</option>
                  {salaryRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level *
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => handleFormChange('experienceLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Level</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="executive">Executive Level</option>
                </select>
              </div>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefits (multi-select)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {benefits.map(benefit => (
                  <label key={benefit} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.benefits.includes(benefit)}
                      onChange={() => handleBenefitToggle(benefit)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Overview *
              </label>
              <textarea
                value={formData.overview}
                onChange={(e) => handleFormChange('overview', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Provide a brief overview of the role..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsibilities *
              </label>
              <textarea
                value={formData.responsibilities}
                onChange={(e) => handleFormChange('responsibilities', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="List the key responsibilities..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements *
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => handleFormChange('requirements', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="List the required qualifications and skills..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills Needed *
              </label>
              <input
                type="text"
                value={formData.skillsNeeded}
                onChange={(e) => handleFormChange('skillsNeeded', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. React, JavaScript, CSS, Node.js (comma separated)"
              />
            </div>

            {/* Application Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Method *
              </label>
              <select
                value={formData.applicationMethod}
                onChange={(e) => handleFormChange('applicationMethod', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="email">Apply via Email</option>
                <option value="website">Apply via Website Link</option>
                <option value="platform">Apply via Platform Messaging</option>
              </select>
            </div>

            {formData.applicationMethod === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Email *
                </label>
                <input
                  type="email"
                  value={formData.applicationEmail}
                  onChange={(e) => handleFormChange('applicationEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="careers@company.com"
                />
              </div>
            )}

            {formData.applicationMethod === 'website' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Website URL *
                </label>
                <input
                  type="url"
                  value={formData.applicationWebsite}
                  onChange={(e) => handleFormChange('applicationWebsite', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://company.com/careers"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Phone (Optional)
              </label>
              <input
                type="tel"
                value={formData.applicationPhone}
                onChange={(e) => handleFormChange('applicationPhone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Instructions (Optional)
              </label>
              <textarea
                value={formData.applicationInstructions}
                onChange={(e) => handleFormChange('applicationInstructions', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional instructions for applicants..."
              />
            </div>

            {/* Company Branding */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Branding</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFormChange('companyLogo', e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Website
                  </label>
                  <input
                    type="url"
                    value={formData.companyWebsite}
                    onChange={(e) => handleFormChange('companyWebsite', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://company.com"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Description
                </label>
                <textarea
                  value={formData.companyDescription}
                  onChange={(e) => handleFormChange('companyDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about your company..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size
                  </label>
                  <select
                    value={formData.companySize}
                    onChange={(e) => handleFormChange('companySize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Industry
                  </label>
                  <input
                    type="text"
                    value={formData.companyIndustry}
                    onChange={(e) => handleFormChange('companyIndustry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Technology"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Founded
                  </label>
                  <input
                    type="text"
                    value={formData.companyFounded}
                    onChange={(e) => handleFormChange('companyFounded', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. 2010"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.remoteAvailable}
                    onChange={(e) => handleFormChange('remoteAvailable', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Remote work available</span>
                </label>
              </div>

              <div className="mt-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.verifiedEmployer}
                    onChange={(e) => handleFormChange('verifiedEmployer', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Get Verified Employer Badge (+$10/month)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Seeker Profile</h2>
          
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleFormChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleFormChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profession / Job Title *
                </label>
                <input
                  type="text"
                  value={formData.profession}
                  onChange={(e) => handleFormChange('profession', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Frontend Developer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleFormChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="New York, USA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience *
                </label>
                <select
                  value={formData.yearsExperience}
                  onChange={(e) => handleFormChange('yearsExperience', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Experience</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.remoteAvailability}
                  onChange={(e) => handleFormChange('remoteAvailability', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Available for remote work</span>
              </label>
            </div>

            {/* Skills and Education */}
            <h3 className="text-lg font-semibold text-gray-900 mt-6">Experience & Skills</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Skills *
              </label>
              <input
                type="text"
                value={formData.keySkills.join(', ')}
                onChange={(e) => handleFormChange('keySkills', e.target.value.split(',').map(s => s.trim()))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="React, JavaScript, CSS, Node.js (comma separated)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education Level *
              </label>
              <select
                value={formData.educationLevel}
                onChange={(e) => handleFormChange('educationLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="high_school">High School</option>
                <option value="diploma">Diploma</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="phd">PhD</option>
                <option value="none">None</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education Details
              </label>
              <textarea
                value={formData.educationDetails}
                onChange={(e) => handleFormChange('educationDetails', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your educational background, degrees, certifications..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload CV (PDF)
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFormChange('cvFile', e.target.files[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Job Preferences */}
            <h3 className="text-lg font-semibold text-gray-900 mt-6">Job Preferences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desired Role *
                </label>
                <input
                  type="text"
                  value={formData.desiredRole}
                  onChange={(e) => handleFormChange('desiredRole', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Senior Frontend Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Expectation
                </label>
                <input
                  type="text"
                  value={formData.salaryExpectation}
                  onChange={(e) => handleFormChange('salaryExpectation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. $80,000 - $120,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Type Preference *
              </label>
              <select
                value={formData.workTypePreference}
                onChange={(e) => handleFormChange('workTypePreference', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Preference</option>
                {workTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Personal Branding */}
            <h3 className="text-lg font-semibold text-gray-900 mt-6">Personal Branding</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFormChange('profilePhoto', e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio Link
                </label>
                <input
                  type="url"
                  value={formData.portfolioLink}
                  onChange={(e) => handleFormChange('portfolioLink', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Bio *
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleFormChange('bio', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief introduction about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn Profile
              </label>
              <input
                type="url"
                value={formData.linkedInLink}
                onChange={(e) => handleFormChange('linkedInLink', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </div>
        </>
      )}
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Premium Visibility Options</h2>
      
      {/* Smart Recommendation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              Smart Recommendation
            </p>
            <p className="text-sm text-blue-700">
              Featured listings get 5× more applications on average.
            </p>
          </div>
        </div>
      </div>

      {/* Promotion Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {promotionTiers.map((tier) => {
          const Icon = tier.icon;
          return (
            <motion.div
              key={tier.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedTier(tier.id)}
              className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all ${
                selectedTier === tier.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${tier.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{tier.name}</h3>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-bold text-gray-900">{tier.price}</span>
                      <span className="text-sm text-gray-600">{tier.period}</span>
                    </div>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedTier === tier.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedTier === tier.id && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>

              <ul className="space-y-2">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {/* Comparison Table */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compare All Features</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-4">Feature</th>
                <th className="text-center py-2 px-4">Basic (Free)</th>
                <th className="text-center py-2 px-4">Promoted</th>
                <th className="text-center py-2 px-4">Featured</th>
                <th className="text-center py-2 px-4">Sponsored</th>
                <th className="text-center py-2 px-4">Network</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-4">Standard Visibility</td>
                <td className="text-center py-2 px-4">✓</td>
                <td className="text-center py-2 px-4">✓</td>
                <td className="text-center py-2 px-4">✓</td>
                <td className="text-center py-2 px-4">✓</td>
                <td className="text-center py-2 px-4">✓</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-4">Highlighted Listing</td>
                <td className="text-center py-2 px-4">-</td>
                <td className="text-center py-2 px-4">✓</td>
                <td className="text-center py-2 px-4">✓</td>
                <td className="text-center py-2 px-4">✓</td>
                <td className="text-center py-2 px-4">✓</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-4">Priority Placement</td>
                <td className="text-center py-2 px-4">-</td>
                <td className="text-center py-2 px-4">-</td>
                <td className="text-center py-2 px-4">✓</td>
                <td className="text-center py-2 px-4">✓</td>
                <td className="text-center py-2 px-4">✓</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-4">Homepage Placement</td>
                <td className="text-center py-2 px-4">-</td>
                <td className="text-center py-2 px-4">-</td>
                <td className="text-center py-2 px-4">-</td>
                <td className="text-center py-2 px-4">✓</td>
                <td className="text-center py-2 px-4">✓</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-4">Network-Wide Exposure</td>
                <td className="text-center py-2 px-4">-</td>
                <td className="text-center py-2 px-4">-</td>
                <td className="text-center py-2 px-4">-</td>
                <td className="text-center py-2 px-4">-</td>
                <td className="text-center py-2 px-4">✓</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-medium">Visibility Boost</td>
                <td className="text-center py-2 px-4">1x</td>
                <td className="text-center py-2 px-4">2x</td>
                <td className="text-center py-2 px-4">3x</td>
                <td className="text-center py-2 px-4">5x</td>
                <td className="text-center py-2 px-4">10x</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sticky Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 sticky bottom-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Selected Plan</p>
            <p className="text-lg font-semibold text-gray-900">
              {selectedTier ? promotionTiers.find(t => t.id === selectedTier)?.name : 'Basic (Free)'}
            </p>
            <p className="text-2xl font-bold text-blue-600">
              {selectedTier ? promotionTiers.find(t => t.id === selectedTier)?.price : 'Free'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-2">Total Cost</p>
            <p className="text-2xl font-bold text-gray-900">
              {selectedTier ? promotionTiers.find(t => t.id === selectedTier)?.price : 'Free'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Final Submission</h2>
      
      {/* Terms and Conditions */}
      <div className="space-y-4">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={(e) => handleFormChange('termsAccepted', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
          />
          <span className="text-sm text-gray-700">
            I agree to the{' '}
            <a href="/help/terms-and-condition" className="text-blue-600 hover:underline">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="/help/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </span>
        </label>

        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.accuracyConfirmed}
            onChange={(e) => handleFormChange('accuracyConfirmed', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
          />
          <span className="text-sm text-gray-700">
            I confirm that all information provided is accurate and truthful
          </span>
        </label>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Post Type:</strong> {postType === 'employer' ? 'Employer Vacancy' : 'Job Seeker Profile'}</p>
          {postType === 'employer' && formData.jobTitle && (
            <p><strong>Job Title:</strong> {formData.jobTitle}</p>
          )}
          {postType === 'employer' && formData.companyName && (
            <p><strong>Company:</strong> {formData.companyName}</p>
          )}
          {postType === 'jobseeker' && formData.fullName && (
            <p><strong>Name:</strong> {formData.fullName}</p>
          )}
          {postType === 'jobseeker' && formData.profession && (
            <p><strong>Profession:</strong> {formData.profession}</p>
          )}
          <p><strong>Promotion:</strong> {selectedTier ? promotionTiers.find(t => t.id === selectedTier)?.name : 'Basic (Free)'}</p>
          <p><strong>Total Cost:</strong> {selectedTier ? promotionTiers.find(t => t.id === selectedTier)?.price : 'Free'}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {postType === 'employer' ? 'Post a Job' : postType === 'jobseeker' ? 'Create Profile' : 'Post to Jobs'}
                  </h2>
                  <p className="text-gray-600">
                    {postType === 'employer' 
                      ? 'Find the perfect candidate for your role'
                      : postType === 'jobseeker'
                      ? 'Let employers discover your talent'
                      : 'Get started with jobs'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {postType && (
              <div className="flex items-center space-x-4">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">
                  Step {currentStep} of {totalSteps}
                </span>
              </div>
            )}
          </div>

          {/* Form Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          {postType && (
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={currentStep === 1 ? () => setCurrentStep(1) : handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2 px-6 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{currentStep === 1 ? 'Back' : 'Previous'}</span>
                </button>

                <div className="flex items-center space-x-4">
                  {currentStep === totalSteps ? (
                    <>
                      <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={!formData.termsAccepted || !formData.accuracyConfirmed}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {postType === 'employer' ? 'Submit Job' : 'Submit Profile'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JobsPostForm;
