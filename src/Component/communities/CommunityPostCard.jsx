import React, { useState } from 'react';
import { communitiesAPI } from '../../api/communities';
import { FaHeart, FaComment, FaShare, FaBookmark, FaFlag, FaMapMarkerAlt, FaClock, FaStar, FaPin } from 'react-icons/fa';

const CommunityPostCard = ({ 
  post, 
  onPostClick, 
  onReact, 
  onSave, 
  onShare, 
  onFlag, 
  onPin,
  showCommunity = true 
}) => {
  const [isReacted, setIsReacted] = useState(false);
  const [reactionType, setReactionType] = useState('like');
  const [isSaved, setIsSaved] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const handleReact = async () => {
    if (isReacted) {
      // Remove reaction
      await onReact(post.post_id, null);
      setIsReacted(false);
    } else {
      // Add reaction
      await onReact(post.post_id, reactionType);
      setIsReacted(true);
    }
  };

  const handleSave = async () => {
    await onSave(post.post_id);
    setIsSaved(!isSaved);
  };

  const handleShare = async () => {
    await onShare(post.post_id);
  };

  const handleFlag = async () => {
    const reason = prompt('Why are you flagging this post?');
    if (reason) {
      await onFlag(post.post_id, reason);
    }
  };

  const handlePin = async () => {
    await onPin(post.post_id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div 
      className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onPostClick(post.post_id)}
    >
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-semibold">
              {post.user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <div className="font-semibold">{post.user?.name || 'Anonymous'}</div>
            <div className="text-sm text-muted-foreground">
              {post.user?.handle || '@anonymous'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {post.is_pinned && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
              <FaPin className="h-3 w-3" />
              Pinned
            </span>
          )}
          {post.is_featured && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
              <FaStar className="h-3 w-3" />
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Post Title */}
      <h3 className="text-lg font-semibold mb-2">{post.title}</h3>

      {/* Post Content */}
      {post.content && (
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {post.content}
        </p>
      )}

      {/* Post Type Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          post.post_type === 'ad_thread' 
            ? 'bg-blue-100 text-blue-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {post.post_type === 'ad_thread' ? '📢 Ad Thread' : '💬 Discussion'}
        </span>
        
        {post.discussion_type && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
            {post.discussion_type}
          </span>
        )}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {post.tags.map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Location */}
      {post.location && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <FaMapMarkerAlt className="h-3 w-3" />
          <span>{post.location}</span>
        </div>
      )}

      {/* Community Info */}
      {showCommunity && post.community && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span>in</span>
          <span className="font-medium text-foreground">{post.community.name}</span>
        </div>
      )}

      {/* Post Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <FaClock className="h-3 w-3" />
            <span>{formatDate(post.created_at)}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <FaHeart className="h-3 w-3" />
            <span>{post.reactions_count || 0}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <FaComment className="h-3 w-3" />
            <span>{post.comments_count || 0}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <FaBookmark className="h-3 w-3" />
            <span>{post.saves_count || 0}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span>{post.views_count || 0} views</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowReactions(!showReactions);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              isReacted 
                ? 'bg-primary text-primary-foreground' 
                : 'border border-border bg-background hover:bg-accent'
            }`}
          >
            <FaHeart className="h-4 w-4" />
            <span>{post.reactions_count || 0}</span>
          </button>
          
          {/* Reactions Dropdown */}
          {showReactions && (
            <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-md shadow-lg p-2 z-10">
              <div className="grid grid-cols-5 gap-2">
                {['like', 'love', 'laugh', 'helpful', 'disagree'].map((reaction) => (
                  <button
                    key={reaction}
                    onClick={(e) => {
                      e.stopPropagation();
                      setReactionType(reaction);
                      setShowReactions(false);
                      handleReact();
                    }}
                    className="flex items-center justify-center w-8 h-8 rounded hover:bg-accent transition-colors"
                    title={reaction}
                  >
                    {reaction === 'like' && '👍'}
                    {reaction === 'love' && '❤️'}
                    {reaction === 'laugh' && '😄'}
                    {reaction === 'helpful' && '👌'}
                    {reaction === 'disagree' && '👎'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSave();
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            isSaved 
              ? 'bg-primary text-primary-foreground' 
              : 'border border-border bg-background hover:bg-accent'
          }`}
        >
          <FaBookmark className="h-4 w-4" />
          <span>{isSaved ? 'Saved' : 'Save'}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border border-border bg-background hover:bg-accent transition-colors"
        >
          <FaShare className="h-4 w-4" />
          <span>Share</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFlag();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border border-border bg-background hover:bg-accent transition-colors text-red-600"
        >
          <FaFlag className="h-4 w-4" />
          <span>Flag</span>
        </button>
      </div>
    </div>
  );
};

export default CommunityPostCard;
