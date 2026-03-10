import React, { useState, useEffect } from "react";
import { 
  FaUserCheck, 
  FaChartLine, 
  FaLink, 
  FaShareAlt, 
  FaCopy,
  FaCheckCircle,
  FaRocket,
  FaHandshake,
  FaGift,
  FaTrophy,
  FaUsers,
  FaEye,
  FaShoppingCart,
  FaCalendarAlt,
  FaDownload,
  FaFilter,
  FaStar,
  FaClock,
  FaExclamationTriangle,
  FaInfoCircle
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import AffiliateServices from "../services/AffiliateServices";
import toast from "react-hot-toast";

const AffiliateProgramJoin = ({ programId, className = "" }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationData, setApplicationData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    
    // Professional Information
    website: "",
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      youtube: ""
    },
    
    // Traffic & Marketing
    trafficSources: [],
    monthlyVisitors: "",
    marketingMethods: [],
    targetAudience: "",
    
    // Experience
    affiliateExperience: "",
    previousPrograms: "",
    promotionalStrategy: "",
    
    // Payment Information
    paymentMethod: "paypal",
    paypalEmail: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      routingNumber: "",
      bankName: "",
      swiftCode: ""
    },
    
    // Preferences
    preferredCommissionType: "percentage",
    minimumPayout: "50",
    communicationPreference: "email",
    
    // Agreement
    agreeToTerms: false,
    agreeToMarketing: false
  });
  
  const [programDetails, setProgramDetails] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [referralData, setReferralData] = useState(null);

  const steps = [
    { id: 1, title: "Personal Information", icon: <FaUserCheck /> },
    { id: 2, title: "Marketing Profile", icon: <FaChartLine /> },
    { id: 3, title: "Experience & Strategy", icon: <FaRocket /> },
    { id: 4, title: "Payment Setup", icon: <FaGift /> },
    { id: 5, title: "Review & Submit", icon: <FaCheckCircle /> }
  ];

  const trafficSourceOptions = [
    "Website/Blog",
    "Social Media",
    "Email Marketing", 
    "YouTube Channel",
    "Paid Advertising",
    "SEO/Organic Search",
    "Mobile App",
    "Community/Forum",
    "Influencer Marketing",
    "Other"
  ];

  const marketingMethodOptions = [
    "Content Marketing",
    "Social Media Marketing",
    "Email Marketing",
    "Paid Advertising",
    "Influencer Partnerships",
    "Product Reviews",
    "Comparison Sites",
    "Video Marketing",
    "Community Building",
    "Other"
  ];

  const experienceLevels = [
    { value: "beginner", label: "Beginner (0-1 year)" },
    { value: "intermediate", label: "Intermediate (1-3 years)" },
    { value: "advanced", label: "Advanced (3-5 years)" },
    { value: "expert", label: "Expert (5+ years)" }
  ];

  useEffect(() => {
    if (programId) {
      loadProgramDetails();
    }
    checkExistingApplication();
  }, [programId]);

  const loadProgramDetails = async () => {
    try {
      // In production, replace with actual API call
      // const response = await AffiliateServices.getAffiliateProgramDetails(programId);
      
      // Mock program details
      setProgramDetails({
        id: programId,
        name: "Premium Affiliate Program",
        company: "TechCorp Inc.",
        description: "Join our premium affiliate program and earn generous commissions promoting our world-class software solutions.",
        commissionStructure: {
          type: "percentage",
          rates: {
            basic: "15%",
            professional: "20%", 
            enterprise: "25%"
          },
          recurring: true,
          recurringDuration: "12 months"
        },
        benefits: [
          "Up to 25% commission rates",
          "12-month recurring commissions",
          "Dedicated affiliate manager",
          "Promotional materials and creatives",
          "Real-time tracking and reporting",
          "Monthly performance bonuses",
          "Tier-based commission increases"
        ],
        requirements: [
          "Minimum 1,000 monthly visitors",
          "Professional website or social media presence",
          "Experience in digital marketing",
          "Compliance with FTC guidelines"
        ],
        support: {
          email: "affiliates@techcorp.com",
          phone: "1-800-AFFILIATE",
          knowledgeBase: "https://help.techcorp.com/affiliates"
        }
      });
    } catch (error) {
      console.error("Error loading program details:", error);
      toast.error("Failed to load program details");
    }
  };

  const checkExistingApplication = async () => {
    try {
      // Check if user already has an application
      // const response = await AffiliateServices.checkApplicationStatus(programId);
      // setApplicationStatus(response.data.status);
    } catch (error) {
      console.error("Error checking application status:", error);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setApplicationData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setApplicationData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleMultiSelectChange = (field, value) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const validateStep = (step) => {
    const errors = {};
    
    switch (step) {
      case 1:
        if (!applicationData.firstName.trim()) errors.firstName = "First name is required";
        if (!applicationData.lastName.trim()) errors.lastName = "Last name is required";
        if (!applicationData.email.trim()) errors.email = "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicationData.email)) errors.email = "Invalid email format";
        break;
        
      case 2:
        if (applicationData.trafficSources.length === 0) errors.trafficSources = "Select at least one traffic source";
        if (!applicationData.monthlyVisitors) errors.monthlyVisitors = "Monthly visitors estimate is required";
        if (applicationData.marketingMethods.length === 0) errors.marketingMethods = "Select at least one marketing method";
        break;
        
      case 3:
        if (!applicationData.affiliateExperience) errors.affiliateExperience = "Experience level is required";
        if (!applicationData.promotionalStrategy.trim()) errors.promotionalStrategy = "Describe your promotional strategy";
        break;
        
      case 4:
        if (!applicationData.paymentMethod) errors.paymentMethod = "Select a payment method";
        if (applicationData.paymentMethod === "paypal" && !applicationData.paypalEmail.trim()) {
          errors.paypalEmail = "PayPal email is required";
        }
        break;
        
      case 5:
        if (!applicationData.agreeToTerms) errors.agreeToTerms = "You must agree to the terms and conditions";
        break;
        
      default:
        break;
    }
    
    return errors;
  };

  const nextStep = () => {
    const errors = validateStep(currentStep);
    if (Object.keys(errors).length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const submitApplication = async () => {
    try {
      setLoading(true);
      
      const submissionData = {
        ...applicationData,
        programId,
        submittedAt: new Date().toISOString(),
        status: "pending_review"
      };
      
      // In production, replace with actual API call
      // await AffiliateServices.submitAffiliateApplication(submissionData);
      
      // Mock submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setApplicationStatus("submitted");
      toast.success("Application submitted successfully! We'll review it within 3-5 business days.");
      
      // Generate referral data for approved applicants (mock)
      const referralCode = `AFF${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setReferralData({
        referralCode,
        referralLink: `${window.location.origin}?ref=${referralCode}`,
        welcomeBonus: "50",
        commissionRate: "20%",
        dashboardUrl: `${window.location.origin}/affiliate/dashboard`,
        supportEmail: "affiliates@wwa.com"
      });
      
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type} copied to clipboard!`);
    }).catch(() => {
      toast.error("Failed to copy to clipboard");
    });
  };

  const shareReferralLink = () => {
    if (navigator.share && referralData) {
      navigator.share({
        title: "Join me in the WWA Affiliate Program!",
        text: `Earn great commissions by joining WWA. Use my referral code: ${referralData.referralCode}`,
        url: referralData.referralLink
      }).catch(() => {
        copyToClipboard(referralData.referralLink, "Referral link");
      });
    } else {
      copyToClipboard(referralData.referralLink, "Referral link");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  value={applicationData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  value={applicationData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                value={applicationData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john.doe@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={applicationData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company/Organization</label>
              <input
                type="text"
                value={applicationData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Doe Marketing Inc."
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Marketing Profile</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                type="url"
                value={applicationData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://yourwebsite.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Social Media Profiles</label>
              <div className="space-y-3">
                <input
                  type="url"
                  value={applicationData.socialMedia.facebook}
                  onChange={(e) => handleInputChange('socialMedia.facebook', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Facebook Profile URL"
                />
                <input
                  type="url"
                  value={applicationData.socialMedia.twitter}
                  onChange={(e) => handleInputChange('socialMedia.twitter', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Twitter Profile URL"
                />
                <input
                  type="url"
                  value={applicationData.socialMedia.youtube}
                  onChange={(e) => handleInputChange('socialMedia.youtube', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="YouTube Channel URL"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Traffic Sources *</label>
              <div className="grid grid-cols-2 gap-3">
                {trafficSourceOptions.map(source => (
                  <label key={source} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={applicationData.trafficSources.includes(source)}
                      onChange={() => handleMultiSelectChange('trafficSources', source)}
                      className="rounded text-blue-600 mr-2"
                    />
                    <span className="text-sm">{source}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Monthly Visitors *</label>
              <select
                value={applicationData.monthlyVisitors}
                onChange={(e) => handleInputChange('monthlyVisitors', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select range</option>
                <option value="0-1000">0 - 1,000</option>
                <option value="1000-5000">1,000 - 5,000</option>
                <option value="5000-10000">5,000 - 10,000</option>
                <option value="10000-50000">10,000 - 50,000</option>
                <option value="50000+">50,000+</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marketing Methods *</label>
              <div className="grid grid-cols-2 gap-3">
                {marketingMethodOptions.map(method => (
                  <label key={method} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={applicationData.marketingMethods.includes(method)}
                      onChange={() => handleMultiSelectChange('marketingMethods', method)}
                      className="rounded text-blue-600 mr-2"
                    />
                    <span className="text-sm">{method}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
              <textarea
                value={applicationData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your target audience..."
              />
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Experience & Strategy</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Affiliate Marketing Experience *</label>
              <select
                value={applicationData.affiliateExperience}
                onChange={(e) => handleInputChange('affiliateExperience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select experience level</option>
                {experienceLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Previous Affiliate Programs</label>
              <textarea
                value={applicationData.previousPrograms}
                onChange={(e) => handleInputChange('previousPrograms', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="List previous affiliate programs you've worked with..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Promotional Strategy *</label>
              <textarea
                value={applicationData.promotionalStrategy}
                onChange={(e) => handleInputChange('promotionalStrategy', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe how you plan to promote our products..."
              />
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Payment Setup</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Payment Method *</label>
              <select
                value={applicationData.paymentMethod}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="paypal">PayPal</option>
                <option value="stripe">Stripe</option>
                <option value="wire">Wire Transfer</option>
                <option value="check">Check</option>
              </select>
            </div>
            
            {applicationData.paymentMethod === "paypal" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PayPal Email Address *</label>
                <input
                  type="email"
                  value={applicationData.paypalEmail}
                  onChange={(e) => handleInputChange('paypalEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="paypal@example.com"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Payout Threshold</label>
              <select
                value={applicationData.minimumPayout}
                onChange={(e) => handleInputChange('minimumPayout', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="25">$25</option>
                <option value="50">$50</option>
                <option value="100">$100</option>
                <option value="250">$250</option>
                <option value="500">$500</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Communication Preference</label>
              <select
                value={applicationData.communicationPreference}
                onChange={(e) => handleInputChange('communicationPreference', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="both">Both Email and SMS</option>
              </select>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Review & Submit</h3>
            
            {programDetails && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Program Details</h4>
                <div className="space-y-2">
                  <p><strong>Program:</strong> {programDetails.name}</p>
                  <p><strong>Commission:</strong> Up to {programDetails.commissionStructure.rates.enterprise}</p>
                  <p><strong>Recurring:</strong> {programDetails.commissionStructure.recurring ? 'Yes' : 'No'}</p>
                </div>
              </div>
            )}
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Application Summary</h4>
              <div className="space-y-2">
                <p><strong>Name:</strong> {applicationData.firstName} {applicationData.lastName}</p>
                <p><strong>Email:</strong> {applicationData.email}</p>
                <p><strong>Experience:</strong> {experienceLevels.find(l => l.value === applicationData.affiliateExperience)?.label}</p>
                <p><strong>Traffic Sources:</strong> {applicationData.trafficSources.join(', ')}</p>
                <p><strong>Payment Method:</strong> {applicationData.paymentMethod}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={applicationData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  className="rounded text-blue-600 mt-1"
                />
                <span className="text-sm text-gray-700">
                  I agree to the terms and conditions of the affiliate program and certify that all information provided is accurate.
                </span>
              </label>
              
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={applicationData.agreeToMarketing}
                  onChange={(e) => handleInputChange('agreeToMarketing', e.target.checked)}
                  className="rounded text-blue-600 mt-1"
                />
                <span className="text-sm text-gray-700">
                  I agree to receive marketing communications and program updates via email.
                </span>
              </label>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (applicationStatus === "submitted" && referralData) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-8 ${className}`}>
        <div className="text-center">
          <FaCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your application has been submitted successfully. We'll review it within 3-5 business days.
          </p>
          
          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Your Referral Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Referral Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={referralData.referralCode}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(referralData.referralCode, "Referral code")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <FaCopy />
                    Copy
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Referral Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={referralData.referralLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(referralData.referralLink, "Referral link")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <FaCopy />
                    Copy
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={shareReferralLink}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <FaShareAlt />
                  Share Link
                </button>
                <a
                  href={referralData.dashboardUrl}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center justify-center gap-2"
                >
                  <FaChartLine />
                  Dashboard
                </a>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-left bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaInfoCircle />
                Next Steps
              </h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-blue-600">1.</span>
                  <span>Wait for application review (3-5 business days)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-blue-600">2.</span>
                  <span>Receive approval email with welcome kit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-blue-600">3.</span>
                  <span>Access affiliate dashboard and promotional materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-blue-600">4.</span>
                  <span>Start promoting and earning commissions!</span>
                </li>
              </ol>
            </div>
            
            <div className="text-left bg-yellow-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaGift />
                Your Benefits
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  <span>{referralData.commissionRate} commission rate</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  <span>${referralData.welcomeBonus} welcome bonus</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  <span>Real-time tracking dashboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  <span>Monthly performance bonuses</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              Need help? Contact us at <a href={`mailto:${referralData.supportEmail}`} className="text-blue-600 hover:underline">{referralData.supportEmail}</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-8 ${className}`}>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {step.icon}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {currentStep < steps.length ? (
          <button
            onClick={nextStep}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={submitApplication}
            disabled={loading || !applicationData.agreeToTerms}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        )}
      </div>
    </div>
  );
};

export default AffiliateProgramJoin;
