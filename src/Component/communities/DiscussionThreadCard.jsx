import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaComment, 
  FaBookmark, 
  FaShare, 
  FaClock, 
  FaUsers, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaThumbsUp,
  FaThumbsDown,
  FaStar,
  FaMapMarkerAlt,
  FaIndustry
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { communitiesAPI } from '../../api/communities';

const DiscussionThreadCard = ({ discussion, onSave, onShare }) => {
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const getCategoryInfo = (category) => {
    // Handle case where category is an object from API response
    const categoryKey = typeof category === 'string' ? category : 
                      (category?.slug || category?.name || 'general');
    
    const categoryMap = {
      'property': { label: 'Property & Real Estate', icon: '🏠', color: 'blue' },
      'funding': { label: 'Funding & Investment', icon: '💰', color: 'green' },
      'jobs': { label: 'Jobs & Vacancies', icon: '💼', color: 'purple' },
      'vehicles': { label: 'Vehicles & Transport', icon: '🚗', color: 'orange' },
      'charities': { label: 'Charities & Donations', icon: '❤️', color: 'red' },
      'events': { label: 'Events & Entertainment', icon: '🎉', color: 'pink' },
      'services': { label: 'Services & Solutions', icon: '⚙️', color: 'gray' },
      'business': { label: 'Business & Companies', icon: '🏢', color: 'indigo' },
      'general': { label: 'General Discussion', icon: '💬', color: 'gray' }
    };
    
    // If category is an object with name property, use that as fallback
    if (typeof category === 'object' && category?.name) {
      return { label: category.name, icon: '💬', color: 'gray' };
    }
    
    return categoryMap[categoryKey] || { label: categoryKey, icon: '💬', color: 'gray' };
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

  const categoryInfo = getCategoryInfo(discussion.category);

  const handleSave = async () => {
    try {
      if (saved) {
        // Unsave discussion
        await communitiesAPI.unsaveDiscussion(discussion.id);
      } else {
        // Save discussion
        await communitiesAPI.saveDiscussion(discussion.id);
      }
      setSaved(!saved);
      onSave?.(discussion);
    } catch (error) {
      console.error('Error saving/unsaving discussion:', error);
    }
  };

  const handleShare = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: discussion.title,
        text: discussion.content,
        url: `${window.location.origin}/community/${discussion.community?.id}/discussion/${discussion.id}`
      });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/community/${discussion.community?.id}/discussion/${discussion.id}`);
      alert('Link copied to clipboard!');
    }
    onShare?.(discussion);
  };

  const handleComment = async () => {
    if (commentText.trim()) {
      try {
        await communitiesAPI.addCommentToDiscussion(discussion.id, {
          content: commentText,
          type: 'comment'
        });
        setCommentText('');
        console.log('Comment posted successfully');
      } catch (error) {
        console.error('Error posting comment:', error);
      }
    }
  };

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
              {discussion.author?.avatar ? (
                <img 
                  src={discussion.author.avatar} 
                  alt={discussion.author.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUsers className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">{discussion.author?.name || 'Anonymous'}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  discussion.author?.type === 'business' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {discussion.author?.type === 'business' ? 'Business' : 'Individual'}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                  Discussion
                </span>
                <span>{categoryInfo.label}</span>
                <span>•</span>
                <FaMapMarkerAlt className="h-3 w-3" />
                <span>{discussion.location || 'Global'}</span>
                <span>•</span>
                <FaClock className="h-3 w-3" />
                <span>{formatTimestamp(discussion.created_at)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Trust Indicators */}
            {discussion.pinned && (
              <div className="flex items-center space-x-1 text-yellow-600">
                <FaExclamationTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Pinned</span>
              </div>
            )}
            
            {discussion.verified && (
              <div className="flex items-center space-x-1 text-green-600">
                <FaCheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Verified Discussion</span>
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
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">
            Discussion • {categoryInfo.label}
          </span>
          {discussion.tags && discussion.tags.length > 0 && (
            <div className="flex items-center gap-1">
              {discussion.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{discussion.title}</h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {discussion.content}
        </p>

        {/* Community Context */}
        {discussion.community && (
          <div className="mb-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Community:</p>
            <Link
              to={`/community/${discussion.community.id}`}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              {discussion.community.name}
            </Link>
          </div>
        )}

        {/* Trust & Quality Indicators */}
        <div className="flex items-center space-x-4 mb-4">
          {discussion.moderated && (
            <div className="flex items-center space-x-1 text-blue-600">
              <FaCheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Moderated</span>
            </div>
          )}
          {discussion.helpful_count > 0 && (
            <div className="flex items-center space-x-1 text-green-600">
              <FaThumbsUp className="h-4 w-4" />
              <span className="text-sm font-medium">{discussion.helpful_count} Helpful</span>
            </div>
          )}
          {discussion.rules && (
            <div className="flex items-center space-x-1 text-gray-600">
              <FaIndustry className="h-4 w-4" />
              <span className="text-sm font-medium">Follows Rules</span>
            </div>
          )}
        </div>
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
            {discussion.comments_count > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                {discussion.comments_count}
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
        </div>
        
        <div className="flex items-center gap-2">
          {/* Engagement Stats */}
          {discussion.views && (
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span className="font-medium">{discussion.views}</span>
              <span>views</span>
            </div>
          )}
          {discussion.participants && (
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span className="font-medium">{discussion.participants}</span>
              <span>participants</span>
            </div>
          )}
        </div>
      </div>

      {/* Discussion Preview */}
      {showComments && discussion.comments && discussion.comments.length > 0 && (
        <div className="px-4 py-3 border-t bg-accent/30">
          <div className="space-y-3">
            {discussion.comments.slice(0, 3).map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <img
                  src={comment.author?.avatar || '/images/default-avatar.png'}
                  alt={comment.author?.name}
                  className="w-6 h-6 rounded-full flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm text-gray-900">{comment.author?.name}</span>
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
            
            {discussion.comments_count > 3 && (
              <button className="text-sm text-primary hover:underline">
                View full thread ({discussion.comments_count} replies)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Full Comments Section */}
      {showComments && (
        <div className="px-4 py-3 border-t">
          <div className="space-y-3 mb-4">
            {discussion.comments && discussion.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <img
                  src={comment.author?.avatar || '/images/default-avatar.png'}
                  alt={comment.author?.name}
                  className="w-6 h-6 rounded-full flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm text-gray-900">{comment.author?.name}</span>
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
                placeholder="Add a comment..."
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
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DiscussionThreadCard;
