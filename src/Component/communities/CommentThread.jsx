import React, { useState, useEffect } from 'react';
import { FaComment, FaHeart, FaReply, FaEllipsisV, FaQuestionCircle, FaStar, FaLightbulb, FaFlag, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { communitiesAPI } from '../../api/communities';

const CommentThread = ({ targetType, targetId, showFullThread = false }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showAll, setShowAll] = useState(showFullThread);

  useEffect(() => {
    loadComments();
  }, [targetType, targetId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const response = await communitiesAPI.getComments(targetType, targetId);
      setComments(response.data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (commentId) => {
    try {
      await communitiesAPI.reactToComment(commentId, 'like');
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes_count: (comment.likes_count || 0) + 1, is_liked: true }
          : comment
      ));
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleReply = async (parentId) => {
    if (!replyText.trim()) return;

    try {
      const response = await communitiesAPI.createComment({
        post_id: targetId,
        parent_id: parentId,
        content: replyText,
        comment_type: 'general'
      });
      
      setComments(comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), response.data],
            comments_count: (comment.comments_count || 0) + 1
          };
        }
        return comment;
      }));
      
      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error replying to comment:', error);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'question':
        return <FaQuestionCircle className="h-3 w-3 text-blue-500" />;
      case 'review':
        return <FaStar className="h-3 w-3 text-yellow-500" />;
      case 'tip':
        return <FaLightbulb className="h-3 w-3 text-green-500" />;
      case 'report':
        return <FaFlag className="h-3 w-3 text-red-500" />;
      default:
        return <FaComment className="h-3 w-3 text-gray-500" />;
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      question: 'Question',
      review: 'Review',
      tip: 'Tip',
      report: 'Report',
      answer: 'Answer',
      experience: 'Experience',
      reply: 'Reply'
    };
    return labels[type] || 'Comment';
  };

  const CommentItem = ({ comment, isReply = false }) => (
    <div className={`${isReply ? 'ml-8 mt-3 border-l-2 border-border pl-3' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {comment.author?.avatar ? (
            <img 
              src={comment.author.avatar} 
              alt={comment.author.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <FaComment className="h-4 w-4 text-primary" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{comment.author?.name || 'User'}</span>
            {comment.type && comment.type !== 'reply' && (
              <span className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-accent">
                {getTypeIcon(comment.type)}
                <span>{getTypeLabel(comment.type)}</span>
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">{comment.content}</p>
          
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => handleLike(comment.id)}
              className={`flex items-center gap-1 hover:text-primary transition-colors ${
                comment.is_liked ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <FaHeart className={`h-3 w-3 ${comment.is_liked ? 'fill-current' : ''}`} />
              <span>{comment.likes_count || 0}</span>
            </button>
            
            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="flex items-center gap-1 hover:text-primary transition-colors text-muted-foreground"
            >
              <FaReply className="h-3 w-3" />
              <span>Reply</span>
            </button>
          </div>
          
          {replyingTo === comment.id && (
            <div className="mt-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyText('');
                  }}
                  className="text-xs px-3 py-1.5 rounded-md hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReply(comment.id)}
                  className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Reply
                </button>
              </div>
            </div>
          )}
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.slice(0, showAll ? comment.replies.length : 2).map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply={true} />
              ))}
              {!showAll && comment.replies.length > 2 && (
                <button
                  onClick={() => setShowAll(true)}
                  className="text-xs text-primary hover:underline mt-2"
                >
                  View {comment.replies.length - 2} more replies
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-start gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-muted"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FaComment className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentThread;
