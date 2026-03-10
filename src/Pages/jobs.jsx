import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Users, 
  Search, 
  Filter,
  ChevronDown,
  Globe,
  TrendingUp,
  Star,
  Building,
  User,
  Menu,
  X,
  ArrowLeft,
  Heart,
  Eye,
  Send,
  Bookmark
} from 'lucide-react';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

// Import styles
import '../styles/jobs.css';

// Import Components
import JobsNavbar from '../Component/jobs/JobsNavbar';
import JobsHero from '../Component/jobs/JobsHero';
import JobsCategoryGrid from '../Component/jobs/JobsCategoryGrid';
import JobsFilters from '../Component/jobs/JobsFilters';
import JobsGrid from '../Component/jobs/JobsGrid';
import JobsActivityFeed from '../Component/jobs/JobsActivityFeed';
import JobsPostForm from '../Component/jobs/JobsPostForm';
import JobsFooter from '../Component/jobs/JobsFooter';

// Sample Jobs Data
const sampleJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechCorp Solutions',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop',
    location: 'New York, USA',
    country: 'US',
    countryFlag: '🇺🇸',
    salary: '$120,000 - $180,000',
    type: 'Full-time',
    remote: true,
    category: 'Technology & IT',
    badges: ['Featured', 'Remote'],
    description: 'We are looking for an experienced Frontend Developer to join our growing team...',
    requirements: '5+ years of experience with React, TypeScript, and modern CSS...',
    posted: '2 days ago',
    views: 245,
    applicants: 12,
    urgent: false,
    companyVerified: true,
    benefits: ['Health Insurance', 'Remote Work', 'Stock Options'],
    skills: ['React', 'TypeScript', 'CSS', 'Node.js']
  },
  {
    id: 2,
    title: 'Marketing Manager',
    company: 'Global Brands Inc',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop',
    location: 'London, UK',
    country: 'GB',
    countryFlag: '🇬🇧',
    salary: '£65,000 - £85,000',
    type: 'Full-time',
    remote: false,
    category: 'Sales & Marketing',
    badges: ['Urgent Hire'],
    description: 'Leading marketing strategies for our global brand portfolio...',
    requirements: 'Experience in digital marketing, team leadership, and campaign management...',
    posted: '1 day ago',
    views: 189,
    applicants: 8,
    urgent: true,
    companyVerified: true,
    benefits: ['Health Insurance', 'Bonus', 'Flexible Hours'],
    skills: ['Marketing', 'Leadership', 'Analytics', 'Strategy']
  },
  {
    id: 3,
    title: 'Registered Nurse',
    company: 'City Medical Center',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop',
    location: 'Toronto, Canada',
    country: 'CA',
    countryFlag: '🇨🇦',
    salary: '$65,000 - $85,000',
    type: 'Full-time',
    remote: false,
    category: 'Healthcare & Medical',
    badges: ['Featured'],
    description: 'Join our healthcare team providing exceptional patient care...',
    requirements: 'Valid nursing license, 2+ years of experience...',
    posted: '3 days ago',
    views: 156,
    applicants: 15,
    urgent: false,
    companyVerified: true,
    benefits: ['Health Insurance', 'Paid Leave', 'Retirement Plan'],
    skills: ['Nursing', 'Patient Care', 'Medical Records', 'CPR']
  },
  {
    id: 4,
    title: 'Data Scientist',
    company: 'AI Innovations Lab',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop',
    location: 'San Francisco, USA',
    country: 'US',
    countryFlag: '🇺🇸',
    salary: '$140,000 - $200,000',
    type: 'Full-time',
    remote: true,
    category: 'Technology & IT',
    badges: ['Sponsored', 'Remote'],
    description: 'Advanced data science role working on cutting-edge AI projects...',
    requirements: 'PhD or Masters in relevant field, experience with machine learning...',
    posted: '1 week ago',
    views: 412,
    applicants: 23,
    urgent: false,
    companyVerified: true,
    benefits: ['Health Insurance', 'Remote Work', 'Stock Options', 'Flexible Hours'],
    skills: ['Python', 'Machine Learning', 'Statistics', 'TensorFlow']
  },
  {
    id: 5,
    title: 'Financial Analyst',
    company: 'Investment Partners',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop',
    location: 'Dubai, UAE',
    country: 'AE',
    countryFlag: '🇦🇪',
    salary: '$80,000 - $120,000',
    type: 'Full-time',
    remote: false,
    category: 'Finance & Accounting',
    badges: [],
    description: 'Financial analysis and investment strategy development...',
    requirements: 'CFA certification preferred, 3+ years experience...',
    posted: '4 days ago',
    views: 98,
    applicants: 6,
    urgent: false,
    companyVerified: false,
    benefits: ['Health Insurance', 'Bonus', 'Housing Allowance'],
    skills: ['Finance', 'Excel', 'Analysis', 'Investment']
  },
  {
    id: 6,
    title: 'UX/UI Designer',
    company: 'Creative Studio',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop',
    location: 'Amsterdam, Netherlands',
    country: 'NL',
    countryFlag: '🇳🇱',
    salary: '€55,000 - €75,000',
    type: 'Contract',
    remote: true,
    category: 'Creative & Media',
    badges: ['Remote'],
    description: 'Creating beautiful and functional user experiences...',
    requirements: 'Portfolio required, 3+ years UX design experience...',
    posted: '5 days ago',
    views: 167,
    applicants: 19,
    urgent: false,
    companyVerified: true,
    benefits: ['Flexible Hours', 'Remote Work', 'Creative Environment'],
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research']
  }
];

const JobsMarketplacePage = () => {
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [urlSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState(sampleJobs);
  const [filteredJobs, setFilteredJobs] = useState(sampleJobs);
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    salaryRange: [0, 200000],
    remoteOnly: false,
    verifiedEmployers: false,
    experienceLevel: '',
    educationLevel: ''
  });

  // Handle post form with authentication
  const handlePostClick = () => {
    if (requireAuth('/jobs?postForm=true', 'You must be logged in to post a job vacancy.')) {
      setShowPostForm(true);
    }
  };

  // Handle URL parameter for post form (only if authenticated)
  useEffect(() => {
    const postFormParam = urlSearchParams.get('postForm');
    if (postFormParam === 'true' && isAuthenticated) {
      setShowPostForm(true);
    }
  }, [urlSearchParams, isAuthenticated]);

  const [sortBy, setSortBy] = useState('Most Recent');
  const [viewMode, setViewMode] = useState('grid');
  const [savedJobs, setSavedJobs] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [showEmployerProfile, setShowEmployerProfile] = useState(null);
  const [showJobSeekerProfile, setShowJobSeekerProfile] = useState(false);
  const [jobSeekerProfile, setJobSeekerProfile] = useState(null);

  // Load saved jobs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      setSavedJobs(JSON.parse(saved));
    }
    
    const viewed = localStorage.getItem('recentlyViewedJobs');
    if (viewed) {
      setRecentlyViewed(JSON.parse(viewed));
    }

    const profile = localStorage.getItem('jobSeekerProfile');
    if (profile) {
      setJobSeekerProfile(JSON.parse(profile));
    }
  }, []);

  // Filter jobs based on search and filters
  useEffect(() => {
    let filtered = jobs;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Remote filter
    if (filters.remote) {
      filtered = filtered.filter(job => job.remote);
    }

    // Job type filter
    if (filters.jobType) {
      filtered = filtered.filter(job => job.type === filters.jobType);
    }

    // Verified employers filter
    if (filters.verifiedEmployers) {
      filtered = filtered.filter(job => job.companyVerified);
    }

    // Sort jobs
    switch (sortBy) {
      case 'Highest Salary':
        filtered = [...filtered].sort((a, b) => {
          const aSalary = parseInt(a.salary.replace(/[^0-9]/g, ''));
          const bSalary = parseInt(b.salary.replace(/[^0-9]/g, ''));
          return bSalary - aSalary;
        });
        break;
      case 'Most Viewed':
        filtered = [...filtered].sort((a, b) => b.views - a.views);
        break;
      case 'Trending':
        filtered = [...filtered].sort((a, b) => b.applicants - a.applicants);
        break;
      default: // Most Recent
        filtered = [...filtered].sort((a, b) => new Date(b.posted) - new Date(a.posted));
    }

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, selectedCategory, filters, sortBy]);

  const handleSaveJob = (jobId) => {
    const newSavedJobs = savedJobs.includes(jobId)
      ? savedJobs.filter(id => id !== jobId)
      : [...savedJobs, jobId];
    
    setSavedJobs(newSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
  };

  const handleViewJob = (job) => {
    const newViewed = [job.id, ...recentlyViewed.filter(id => id !== job.id)].slice(0, 10);
    setRecentlyViewed(newViewed);
    localStorage.setItem('recentlyViewedJobs', JSON.stringify(newViewed));
  };

  const handleApplyJob = (job) => {
    if (!jobSeekerProfile) {
      setShowJobSeekerProfile(true);
      return;
    }

    // One-click apply logic
    const application = {
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      applicantProfile: jobSeekerProfile,
      appliedAt: new Date().toISOString(),
      status: 'New'
    };

    // Store application (in real app, this would be sent to backend)
    const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    applications.push(application);
    localStorage.setItem('jobApplications', JSON.stringify(applications));

    // Show success message
    alert(`Application submitted to ${job.company} for ${job.title}!`);
  };

  const handleCreateJobSeekerProfile = (profile) => {
    setJobSeekerProfile(profile);
    localStorage.setItem('jobSeekerProfile', JSON.stringify(profile));
    setShowJobSeekerProfile(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <JobsNavbar />

      {/* Hero Section */}
      <JobsHero 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        setFilters={setFilters}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <JobsFilters
              filters={filters}
              setFilters={setFilters}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>

          {/* Jobs Content */}
          <div className="lg:w-3/4">
            {/* Category Grid */}
            <JobsCategoryGrid 
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            {/* Jobs Grid */}
            <JobsGrid
              jobs={filteredJobs}
              viewMode={viewMode}
              setViewMode={setViewMode}
              savedJobs={savedJobs}
              handleSaveJob={handleSaveJob}
              handleViewJob={handleViewJob}
              handleApplyJob={handleApplyJob}
              showEmployerProfile={showEmployerProfile}
              setShowEmployerProfile={setShowEmployerProfile}
              hasJobSeekerProfile={!!jobSeekerProfile}
            />

            {/* Activity Feed */}
            <JobsActivityFeed />
          </div>
        </div>
      </div>

      {/* Post Job Button */}
      <button
        onClick={handlePostClick}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110 z-40"
      >
        <Briefcase className="w-6 h-6" />
      </button>

      {/* Job Post Form Modal */}
      <AnimatePresence>
        {showPostForm && (
          <JobsPostForm onClose={() => setShowPostForm(false)} />
        )}
      </AnimatePresence>

      {/* Job Seeker Profile Modal */}
      <AnimatePresence>
        {showJobSeekerProfile && (
          <JobSeekerProfileForm
            onClose={() => setShowJobSeekerProfile(false)}
            onSave={handleCreateJobSeekerProfile}
            existingProfile={jobSeekerProfile}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <JobsFooter />
    </div>
  );
};

// Job Seeker Profile Form Component
const JobSeekerProfileForm = ({ onClose, onSave, existingProfile }) => {
  const [formData, setFormData] = useState(existingProfile || {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    skills: [],
    workExperience: '',
    education: '',
    portfolio: '',
    linkedIn: '',
    resume: null,
    coverLetter: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
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
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {existingProfile ? 'Edit Your Profile' : 'Create Your Job Seeker Profile'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Complete your profile once to apply to any job with one click!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
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
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="New York, USA"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills (comma separated) *
            </label>
            <input
              type="text"
              required
              value={formData.skills.join(', ')}
              onChange={(e) => setFormData({...formData, skills: e.target.value.split(',').map(s => s.trim())})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="React, JavaScript, CSS, Node.js"
            />
          </div>

          {/* Work Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Experience *
            </label>
            <textarea
              required
              value={formData.workExperience}
              onChange={(e) => setFormData({...formData, workExperience: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your work experience, years of experience, key achievements..."
            />
          </div>

          {/* Education */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Education *
            </label>
            <textarea
              required
              value={formData.education}
              onChange={(e) => setFormData({...formData, education: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your educational background, degrees, certifications..."
            />
          </div>

          {/* Portfolio & Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio Website
              </label>
              <input
                type="url"
                value={formData.portfolio}
                onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://yourportfolio.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn Profile
              </label>
              <input
                type="url"
                value={formData.linkedIn}
                onChange={(e) => setFormData({...formData, linkedIn: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter (Optional)
            </label>
            <textarea
              value={formData.coverLetter}
              onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="A brief introduction about yourself..."
            />
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume (PDF)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFormData({...formData, resume: e.target.files[0]})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {existingProfile ? 'Update Profile' : 'Create Profile'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default JobsMarketplacePage;
