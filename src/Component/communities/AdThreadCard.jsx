import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaComment, 
  FaBookmark, 
  FaShare, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock, 
  FaUsers, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaThumbsUp,
  FaThumbsDown,
  FaStar,
  FaHome,
  FaCar,
  FaBriefcase,
  FaBuilding,
  FaHeart,
  FaCalendar,
  FaDollarSign,
  FaIndustry
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { communitiesAPI } from '../../api/communities';

const AdThreadCard = ({ ad, onDiscuss, onSave, onShare, onContact }) => {
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentType, setCommentType] = useState('question');

  const handleSave = async () => {
    try {
      if (saved) {
        // Unsave post
        await communitiesAPI.unsavePost(ad.id);
      } else {
        // Save post
        await communitiesAPI.savePost(ad.id);
      }
      setSaved(!saved);
      onSave?.(ad);
    } catch (error) {
      console.error('Error saving/unsaving post:', error);
    }
  };

  const handleShare = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: ad.title,
        text: ad.description,
        url: `${window.location.origin}/community/${ad.communities?.[0]?.id}/post/${ad.id}`
      });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/community/${ad.communities?.[0]?.id}/post/${ad.id}`);
      alert('Link copied to clipboard!');
    }
    onShare?.(ad);
  };

  const handleContact = () => {
    // Implement contact functionality
    if (ad.contact_email) {
      window.location.href = `mailto:${ad.contact_email}`;
    } else {
      // Fallback: Navigate to contact form or show modal
      alert('Contact information not available for this listing');
    }
    onContact?.(ad);
  };

  const handleComment = async () => {
    if (commentText.trim()) {
      try {
        await communitiesAPI.addComment(ad.id, {
          content: commentText,
          type: commentType
        });
        setCommentText('');
        setCommentType('question');
        console.log('Comment posted successfully');
      } catch (error) {
        console.error('Error posting comment:', error);
      }
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const getCategoryInfo = (category) => {
    const categoryMap = {
      'property': { label: 'Property & Real Estate', icon: '🏠', color: 'blue' },
      'funding': { label: 'Funding & Investment', icon: '💰', color: 'green' },
      'jobs': { label: 'Jobs & Vacancies', icon: '💼', color: 'purple' },
      'vehicles': { label: 'Vehicles & Transport', icon: '🚗', color: 'orange' },
      'charities': { label: 'Charities & Donations', icon: '❤️', color: 'red' },
      'events': { label: 'Events & Entertainment', icon: '🎉', color: 'pink' },
      'services': { label: 'Services & Solutions', icon: '⚙️', color: 'gray' },
      'business': { label: 'Business & Companies', icon: '🏢', color: 'indigo' },
    };
    return categoryMap[category] || { label: category, icon: '📢', color: 'gray' };
  };

  const getCategoryKeyInfo = (category) => {
    const keyInfoMap = {
      'property': [
        ad.price && `Price: ${ad.price}`,
        ad.type && `Type: ${ad.type}`,
        ad.bedrooms && `${ad.bedrooms} bed`,
        ad.availability && `Available: ${ad.availability}`
      ].filter(Boolean),
      'funding': [
        ad.ticket_size && `Ticket: ${ad.ticket_size}`,
        ad.stage && `Stage: ${ad.stage}`,
        ad.sector && `Sector: ${ad.sector}`,
        ad.region && `Region: ${ad.region}`
      ].filter(Boolean),
      'jobs': [
        ad.role && `Role: ${ad.role}`,
        ad.company && `Company: ${ad.company}`,
        ad.salary && `Salary: ${ad.salary}`,
        ad.work_type && `Type: ${ad.work_type}`
      ].filter(Boolean),
      'vehicles': [
        ad.price && `Price: ${ad.price}`,
        ad.make_model && `${ad.make_model}`,
        ad.year && `Year: ${ad.year}`,
        ad.mileage && `Mileage: ${ad.mileage}`
      ].filter(Boolean),
      'charities': [
        ad.cause_type && `Cause: ${ad.cause_type}`,
        ad.region && `Region: ${ad.region}`,
        ad.donation_methods && `Methods: ${ad.donation_methods}`
      ].filter(Boolean),
      'events': [
        ad.date && `Date: ${ad.date}`,
        ad.venue && `Venue: ${ad.venue}`,
        ad.city && `City: ${ad.city}`,
        ad.ticket_link && 'Tickets Available'
      ].filter(Boolean),
      'services': [
        ad.service_type && `Service: ${ad.service_type}`,
        ad.industry && `Industry: ${ad.industry}`,
        ad.response_time && `Response: ${ad.response_time}`
      ].filter(Boolean),
      'business': [
        ad.service_type && `Service: ${ad.service_type}`,
        ad.industry && `Industry: ${ad.industry}`,
        ad.response_time && `Response: ${ad.response_time}`
      ].filter(Boolean)
    };
    return keyInfoMap[category] || [];
  };

  const categoryInfo = getCategoryInfo(ad.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {ad.author?.avatar ? (
                <img 
                  src={ad.author.avatar} 
                  alt={ad.author.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUsers className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">{ad.author?.name || 'Advertiser'}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  ad.author?.type === 'business' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {ad.author?.type === 'business' ? 'Business' : 'Individual'}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                  Ad
                </span>
                <span>{categoryInfo.label}</span>
                <span>•</span>
                <FaMapMarkerAlt className="h-3 w-3" />
                <span>{ad.location || 'Location not specified'}</span>
                <span>•</span>
                <FaClock className="h-3 w-3" />
                <span>{formatTimestamp(ad.created_at)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Trust Indicators */}
            {ad.verified && (
              <div className="flex items-center space-x-1 text-green-600">
                <FaCheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Verified Listing</span>
              </div>
            )}
            {ad.community_verified && (
              <div className="flex items-center space-x-1 text-blue-600">
                <FaUsers className="h-4 w-4" />
                <span className="text-sm font-medium">Community Verified</span>
              </div>
            )}
            {ad.under_review && (
              <div className="flex items-center space-x-1 text-yellow-600">
                <FaExclamationTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Under Review</span>
              </div>
            )}
            
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <FaIndustry className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Media */}
        {ad.images && ad.images.length > 0 && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <div className="relative">
              <img
                src={ad.images[0]} 
                alt={ad.title}
                className="w-full h-64 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => window.open(`/ads-detail/${ad.slug}`, '_blank')}
              />
              {ad.images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                  +{ad.images.length - 1} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Title and Summary */}
        <div className="mb-3">
          <h3 
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
            onClick={() => window.open(`/ads-detail/${ad.slug}`, '_blank')}
          >
            {ad.title}
          </h3>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {ad.description || ad.summary}
          </p>
        </div>

        {/* Category-Aware Key Info Strip */}
        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-muted/30 rounded-lg">
          {getCategoryKeyInfo(ad.category).map((info, index) => (
            <span 
              key={index}
              className={`text-xs px-2 py-1 rounded-full bg-${categoryInfo.color}-100 text-${categoryInfo.color}-700 font-medium`}
            >
              {info}
            </span>
          ))}
        </div>

        {/* Community Context */}
        {ad.communities && ad.communities.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Communities:</p>
            <div className="flex flex-wrap gap-2">
              {ad.communities.map((community) => (
                <Link
                  key={community.id}
                  to={`/community/${community.id}`}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  {community.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <FaComment className="h-4 w-4" />
            <span className="text-sm font-medium">Discuss</span>
            {ad.comments_count > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                {ad.comments_count}
              </span>
            )}
          </button>
          
          <button
            onClick={handleSave}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
              saved 
                ? 'text-primary bg-primary/10' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <FaBookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <FaShare className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
          
          <button
            onClick={handleContact}
            className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <FaEnvelope className="h-4 w-4" />
            <span className="hidden sm:inline">Contact</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Reputation Score */}
          {ad.author?.reputation && (
            <div className="flex items-center space-x-1 text-sm">
              <FaStar className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">{ad.author.reputation.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Discussion Preview */}
      {showComments && ad.comments && ad.comments.length > 0 && (
        <div className="px-4 py-3 border-t bg-accent/30">
          <div className="space-y-3">
            {ad.comments.slice(0, 3).map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <img
                  src={comment.author?.avatar || '/images/default-avatar.png'}
                  alt={comment.author?.name}
                  className="w-6 h-6 rounded-full flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm text-gray-900">{comment.author?.name}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      comment.type === 'question' ? 'bg-blue-100 text-blue-700' :
                      comment.type === 'review' ? 'bg-green-100 text-green-700' :
                      comment.type === 'tip' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {comment.type}
                    </span>
                    <span className="text-xs text-gray-500">{formatTimestamp(comment.created_at)}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <button className="text-gray-400 hover:text-green-600">
                      <FaThumbsUp className="h-3 w-3" />
                    </button>
                    <button className="text-gray-400 hover:text-red-600">
                      <FaThumbsDown className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {ad.comments_count > 3 && (
              <button 
                onClick={() => onDiscuss?.(ad)}
                className="text-sm text-primary hover:underline font-medium"
              >
                View full thread ({ad.comments_count} replies)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Full Comments Section */}
      {showComments && (
        <div className="px-4 py-3 border-t">
          <div className="space-y-3 mb-4">
            {/* Comment Type Selector */}
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sm font-medium text-gray-700">Comment as:</span>
              {['question', 'review', 'tip'].map((type) => (
                <button
                  key={type}
                  onClick={() => setCommentType(type)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    commentType === type
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            
            {ad.comments && ad.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <img
                  src={comment.author?.avatar || '/images/default-avatar.png'}
                  alt={comment.author?.name}
                  className="w-6 h-6 rounded-full flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm text-gray-900">{comment.author?.name}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      comment.type === 'question' ? 'bg-blue-100 text-blue-700' :
                      comment.type === 'review' ? 'bg-green-100 text-green-700' :
                      comment.type === 'tip' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {comment.type}
                    </span>
                    <span className="text-xs text-gray-500">{formatTimestamp(comment.created_at)}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <button className="text-gray-400 hover:text-green-600">
                      <FaThumbsUp className="h-3 w-3" />
                    </button>
                    <button className="text-gray-400 hover:text-red-600">
                      <FaThumbsDown className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Add Comment */}
          <div className="flex space-x-3">
            <img
              src="/images/default-avatar.png"
              alt="You"
              className="w-6 h-6 rounded-full flex-shrink-0"
            />
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={`Add a ${commentType}...`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <FaThumbsUp className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <FaThumbsDown className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={handleComment}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  Post {commentType.charAt(0).toUpperCase() + commentType.slice(1)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdThreadCard;
