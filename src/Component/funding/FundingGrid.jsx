import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Heart, 
  Share2, 
  Clock, 
  Users, 
  Target,
  Shield,
  TrendingUp,
  ExternalLink,
  Globe,
  Calendar,
  DollarSign
} from 'lucide-react';
import fundingService from '../../services/FundingService';

const FundingCard = ({ project, viewMode, onBackProject, onSaveProject, onShareProject }) => {
  const [isSaved, setIsSaved] = useState(project.is_saved || false);
  const [isBacking, setIsBacking] = useState(false);
  
  // Handle API data structure
  const fundingPercentage = project.funding_goal > 0 
    ? Math.round((project.amount_raised || 0) / project.funding_goal * 100)
    : 0;
  const daysLeft = project.days_remaining || project.daysLeft || 0;
  const isUrgent = daysLeft <= 7;

  const handleBackProject = async () => {
    if (!onBackProject) return;
    
    setIsBacking(true);
    try {
      await onBackProject(project.id);
    } catch (error) {
      console.error('Error backing project:', error);
    } finally {
      setIsBacking(false);
    }
  };

  const handleSaveProject = async () => {
    if (!onSaveProject) return;
    
    try {
      await onSaveProject(project.id);
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleShareProject = () => {
    if (onShareProject) {
      onShareProject(project);
    } else {
      // Fallback to native share
      if (navigator.share) {
        navigator.share({
          title: project.title,
          text: project.tagline,
          url: window.location.origin + `/funding/${project.id}`
        });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      {/* Project Image */}
      <div className={`relative ${viewMode === 'list' ? 'w-48 h-32' : 'h-48'} bg-gray-100`}>
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {project.verifiedCreator && (
            <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              <Shield className="w-3 h-3" />
              Verified
            </div>
          )}
          {isUrgent && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Urgent
            </div>
          )}
          {project.featured && (
            <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </div>
          )}
          {project.promoted && (
            <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Promoted
            </div>
          )}
        </div>

        {/* Risk Level Badge */}
        <div className="absolute top-2 right-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            project.riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
            project.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {project.riskLevel} Risk
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveProject}
          className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
      </div>

      {/* Project Content */}
      <div className="p-4 flex-1">
        {/* Project Header */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
            {project.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {project.tagline || project.description}
          </p>
        </div>

        {/* Meta Information */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
            {project.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Globe className="w-3 h-3" />
            {project.country}
          </div>
        </div>

        {/* Funding Progress */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-900">
              ${(project.amount_raised || project.currentFunding || 0).toLocaleString()} / ${project.funding_goal?.toLocaleString() || project.fundingGoal?.toLocaleString() || 0}
            </span>
            <span className="text-sm font-medium text-blue-600">
              {fundingPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Project Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{project.backer_count || project.backers || 0} backers</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span className={isUrgent ? 'text-red-600 font-medium' : ''}>
              {daysLeft} days left
            </span>
          </div>
        </div>

        {/* Creator Info */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">by</p>
            <p className="text-sm font-medium text-gray-900">{project.creator_name || project.creatorName}</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleShareProject}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button 
              onClick={handleBackProject}
              disabled={isBacking}
              className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBacking ? (
                <span>Backing...</span>
              ) : (
                <span>Back</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FundingGrid = ({ projects, viewMode, onBackProject, onSaveProject, onShareProject }) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
        <p className="text-gray-600">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className={
      viewMode === 'grid'
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'space-y-4'
    }>
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <FundingCard 
            project={project} 
            viewMode={viewMode} 
            onBackProject={onBackProject}
            onSaveProject={onSaveProject}
            onShareProject={onShareProject}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FundingGrid;
