import React, { useState, useEffect } from 'react';
import { FaHeart, FaReply, FaFlag, FaUser } from 'react-icons/fa';
import { communitiesAPI } from '../../api/communities';

const CommentSection = ({ postId, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const loadComments = async () => {
    try {
      const data = await communitiesAPI.getComments(postId);
      setComments(data.data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const data = await communitiesAPI.createComment({
        post_id: postId,
        content: newComment.trim(),
        comment_type: 'general'
      });
      
      setComments([data.data, ...comments]);
      setNewComment('');
      
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleReply = async (commentId) => {
    if (!replyText.trim()) return;

    try {
      const data = await communitiesAPI.createComment({
        post_id: postId,
        parent_id: commentId,
        content: replyText.trim(),
        comment_type: 'general'
      });
      
      // Update comments with reply
      const updateComments = (comments) => {
        return comments.map(comment => {
          if (comment.comment_id === commentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), data.data],
              replies_count: (comment.replies_count || 0) + 1
            };
          }
          return comment;
        });
      };
      
      setComments(updateComments(comments));
      setReplyText('');
      setReplyingTo(null);
      
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const handleReact = async (commentId, reactionType = 'like') => {
    try {
      await communitiesAPI.reactToComment(commentId, reactionType);
      
      // Update comment reaction counts
      const updateComments = (comments) => {
        return comments.map(comment => {
          if (comment.comment_id === commentId) {
            return {
              ...comment,
              reactions_count: (comment.reactions_count || 0) + 1,
              is_reacted: true
            };
          }
          return comment;
        });
      };
      
      setComments(updateComments(comments));
    } catch (error) {
      console.error('Error reacting to comment:', error);
    }
  };

  const handleFlag = async (commentId) => {
    const reason = prompt('Why are you flagging this comment?');
    if (!reason) return;

    try {
      await communitiesAPI.flagComment(commentId, reason);
      
      // Update comment flagged status
      const updateComments = (comments) => {
        return comments.map(comment => {
          if (comment.comment_id === commentId) {
            return {
              ...comment,
              is_flagged: true
            };
          }
          return comment;
        });
      };
      
      setComments(updateComments(comments));
    } catch (error) {
      console.error('Error flagging comment:', error);
    }
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

  const CommentItem = ({ comment, isReply = false }) => (
    <div className={`${isReply ? 'ml-8' : ''}`}>
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          {comment.user?.avatar ? (
            <img 
              src={comment.user.avatar} 
              alt={comment.user.name}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <FaUser className="h-4 w-4 text-primary" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{comment.user?.name || 'Anonymous'}</span>
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.created_at)}
            </span>
            
            {comment.is_flagged && (
              <span className="text-xs text-red-600">Flagged</span>
            )}
          </div>
          
          <p className="text-sm text-foreground mb-2">{comment.content}</p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleReact(comment.comment_id)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                comment.is_reacted
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-background hover:bg-accent'
              }`}
            >
              <FaHeart className="h-3 w-3" />
              <span>{comment.reactions_count || 0}</span>
            </button>
            
            <button
              onClick={() => {
                setReplyingTo(comment.comment_id);
                setReplyText('');
              }}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border border-border bg-background hover:bg-accent transition-colors"
            >
              <FaReply className="h-3 w-3" />
              Reply
            </button>
            
            <button
              onClick={() => handleFlag(comment.comment_id)}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border border-border bg-background hover:bg-accent transition-colors text-red-600"
            >
              <FaFlag className="h-3 w-3" />
              Flag
            </button>
          </div>
          
          {/* Reply Form */}
          {replyingTo === comment.comment_id && (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="w-full p-2 border border-border rounded-md bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => handleReply(comment.comment_id)}
                  disabled={!replyText.trim()}
                  className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reply
                </button>
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyText('');
                  }}
                  className="px-3 py-1 rounded-md border border-border bg-background text-xs font-medium hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem 
                  key={reply.comment_id} 
                  comment={reply} 
                  isReply={true} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    loadComments();
  }, [postId]);

  return (
    <div className="space-y-4">
      {/* Add Comment Form */}
      <div className="bg-card rounded-lg p-4">
        <h3 className="font-semibold mb-4">Join the Discussion</h3>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full p-3 border border-border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          rows={4}
        />
        <div className="flex items-center justify-between mt-3">
          <div className="text-sm text-muted-foreground">
            {newComment.length}/500 characters
          </div>
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post Comment
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-2 text-muted-foreground text-sm">Loading comments...</p>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem 
              key={comment.comment_id} 
              comment={comment} 
            />
          ))
        ) : (
          <div className="text-center py-8 bg-card rounded-lg">
            <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
