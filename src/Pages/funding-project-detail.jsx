import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Users, 
  Target, 
  Calendar,
  DollarSign,
  Clock,
  MapPin,
  Award,
  Star,
  CheckCircle,
  AlertCircle,
  Play,
  FileText,
  Shield,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Briefcase,
  Globe,
  Mail,
  Phone,
  ExternalLink,
  ChevronRight,
  Zap,
  Eye
} from 'lucide-react';
import { useProject, useProjectRewards, useProjectMarketingAssets } from '../hooks/useFundingData';
import fundingService from '../services/FundingService';

const FundingProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showBackModal, setShowBackModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [backingAmount, setBackingAmount] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const { project, loading: projectLoading, error: projectError } = useProject(id);
  const { rewards, loading: rewardsLoading } = useProjectRewards(id);
  const { marketingAssets } = useProjectMarketingAssets(id);

  const progress = project?.funding_goal > 0 
    ? (project?.current_funding / project?.funding_goal) * 100 
    : 0;

  const daysLeft = project?.end_date 
    ? Math.ceil((new Date(project.end_date) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  const handleBackProject = () => {
    if (selectedReward) {
      setBackingAmount(selectedReward.minimum_contribution);
    }
    setShowBackModal(true);
  };

  const handleSaveProject = async () => {
    try {
      // Implement save functionality
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleShareProject = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: project?.title,
          text: project?.description,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } catch (error) {
      console.error('Error sharing project:', error);
    }
  };

  if (projectLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Project not found</h3>
          <p className="text-gray-600 mb-4">{projectError || 'This project does not exist or has been removed.'}</p>
          <button
            onClick={() => navigate('/funding/projects')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Project Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="page-container py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Projects
            </button>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSaveProject}
                className={`p-2 rounded-lg transition-colors ${
                  isSaved ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShareProject}
                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="page-container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Project Info */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'active' ? 'bg-green-500 text-white' :
                    project.status === 'completed' ? 'bg-blue-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}>
                    {project.status}
                  </span>
                  {project.promotion_tier !== 'basic' && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.promotion_tier === 'sponsored' ? 'bg-purple-500 text-white' :
                      project.promotion_tier === 'featured' ? 'bg-yellow-500 text-white' :
                      'bg-blue-500 text-white'
                    }`}>
                      {project.promotion_tier}
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
                <p className="text-xl text-blue-100 mb-6">{project.tagline}</p>
                <p className="text-lg leading-relaxed mb-8">{project.description}</p>
              </div>

              {/* Project Meta */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <Target className="w-8 h-8 mx-auto mb-2 text-blue-200" />
                  <p className="text-sm text-blue-200">Category</p>
                  <p className="font-semibold capitalize">{project.project_type}</p>
                </div>
                <div className="text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-2 text-blue-200" />
                  <p className="text-sm text-blue-200">Location</p>
                  <p className="font-semibold">{project.location || 'Global'}</p>
                </div>
                <div className="text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-blue-200" />
                  <p className="text-sm text-blue-200">Backers</p>
                  <p className="font-semibold">{project.backer_count || 0}</p>
                </div>
                <div className="text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-200" />
                  <p className="text-sm text-blue-200">Duration</p>
                  <p className="font-semibold">{daysLeft !== null ? `${daysLeft} days left` : 'Ongoing'}</p>
                </div>
              </div>
            </div>

            {/* Funding Progress Card */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold mb-4">Funding Progress</h3>
                
                <div className="mb-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-3xl font-bold">${project.current_funding?.toLocaleString() || 0}</span>
                    <span className="text-sm text-blue-100">of ${project.funding_goal?.toLocaleString() || 0}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3 mb-2">
                    <div 
                      className="bg-white h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{progress.toFixed(1)}% funded</span>
                    {daysLeft !== null && <span>{daysLeft} days left</span>}
                  </div>
                </div>

                <button
                  onClick={handleBackProject}
                  className="w-full py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold mb-3"
                >
                  Back This Project
                </button>
                
                <div className="text-center text-sm text-blue-100">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Secure payment powered by WorldwideAdverts
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="page-container">
          <div className="flex space-x-8">
            {['overview', 'story', 'rewards', 'updates', 'comments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="page-container py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Story Section */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Story</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{project.story}</p>
                </div>
              </div>

              {/* Vision Section */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Vision & Goals</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{project.vision}</p>
                </div>
              </div>

              {/* Pitch Video */}
              {marketingAssets?.pitch_video_url && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Pitch Video</h2>
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                      src={marketingAssets.pitch_video_url}
                      className="w-full h-full"
                      allowFullScreen
                      title="Project Pitch Video"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Creator Info */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Creator</h3>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {project.user_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{project.user_name || 'Anonymous'}</p>
                    <p className="text-sm text-gray-600">Project Creator</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact available
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Shield className="w-4 h-4 mr-2" />
                    Verified Creator
                  </div>
                </div>
              </div>

              {/* Documents */}
              {marketingAssets?.documents?.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
                  <div className="space-y-3">
                    {marketingAssets.documents.map((doc, index) => (
                      <a
                        key={index}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-sm font-medium text-gray-700">{doc.name}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Stats */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Views</span>
                    <span className="font-medium">{project.view_count || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shares</span>
                    <span className="font-medium">{project.share_count || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Updates</span>
                    <span className="font-medium">{project.update_count || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Comments</span>
                    <span className="font-medium">{project.comment_count || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Backer Rewards</h2>
            {rewardsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading rewards...</p>
              </div>
            ) : rewards.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No rewards available</h3>
                <p className="text-gray-600">This project doesn't offer any rewards yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.map((reward) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{reward.title}</h3>
                      <span className="text-2xl font-bold text-blue-600">
                        ${reward.minimum_contribution}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{reward.description}</p>
                    {reward.estimated_delivery && (
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Calendar className="w-4 h-4 mr-1" />
                        Estimated delivery: {new Date(reward.estimated_delivery).toLocaleDateString()}
                      </div>
                    )}
                    {reward.limit_quantity && (
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Users className="w-4 h-4 mr-1" />
                        Limited: {reward.limit_quantity} available
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setSelectedReward(reward);
                        handleBackProject();
                      }}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Select Reward
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Other tabs (placeholder content) */}
        {activeTab !== 'overview' && activeTab !== 'rewards' && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-xl font-bold capitalize">{activeTab.charAt(0)}</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2 capitalize">{activeTab}</h3>
            <p className="text-gray-600">This section is coming soon.</p>
          </div>
        )}
      </div>

      {/* Back Project Modal */}
      <AnimatePresence>
        {showBackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowBackModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Back This Project</h3>
              
              {selectedReward && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-900 mb-1">{selectedReward.title}</p>
                  <p className="text-sm text-blue-700">{selectedReward.description}</p>
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Backing Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={backingAmount}
                    onChange={(e) => setBackingAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    // Process payment
                    console.log('Processing payment:', backingAmount);
                    setShowBackModal(false);
                  }}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Continue to Payment
                </button>
                <button
                  onClick={() => setShowBackModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FundingProjectDetail;
