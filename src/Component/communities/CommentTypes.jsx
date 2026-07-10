import React, { useState } from 'react';
import { FaQuestionCircle, FaStar, FaLightbulb, FaFlag, FaHeart, FaReply, FaEllipsisV } from 'react-icons/fa';

const CommentTypes = ({ comment, onReply, onReact, onFlag, user }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [selectedType, setSelectedType] = useState('general');

  const commentTypes = {
    question: { icon: FaQuestionCircle, label: 'Question', color: 'blue' },
    review: { icon: FaStar, label: 'Review', color: 'yellow' },
    tip: { icon: FaLightbulb, label: 'Tip', color: 'green' },
    report: { icon: FaFlag, label: 'Report Experience', color: 'red' },
    general: { icon: FaComment, label: 'Comment', color: 'gray' }
  };

  const CommentTypeIcon = commentTypes[comment.type || 'general']?.icon || FaComment;
  const commentTypeInfo = commentTypes[comment.type || 'general'];

  const handleReply = () => {
    if (replyText.trim()) {
      onReply({
        content: replyText,
        type: selectedType,
        parent_id: comment.id
      });
      setReplyText('');
      setShowReplyForm(false);
    }
  };

  return (
    <div className="border-l-2 border-muted pl-4 py-2">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          {comment.author?.avatar ? (
            <img 
              src={comment.author.avatar} 
              alt={comment.author.name}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-primary font-semibold text-sm">
              {comment.author?.name?.[0] || 'U'}
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{comment.author?.name || 'Anonymous'}</span>
            {comment.author?.verified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs">
                ✓ Verified
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>

          {/* Comment Type Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-${commentTypeInfo.color}-100 text-${commentTypeInfo.color}-700 text-xs font-medium`}>
              <CommentTypeIcon className="h-3 w-3" />
              {commentTypeInfo.label}
            </span>
            {comment.helpful_count > 0 && (
              <span className="text-xs text-muted-foreground">
                {comment.helpful_count} found this helpful
              </span>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-3">{comment.content}</p>

          {/* Comment Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onReact(comment.id, 'like')}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
            >
              <FaHeart className="h-3 w-3" />
              {comment.reactions_count || 0}
            </button>
            
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
            >
              <FaReply className="h-3 w-3" />
              Reply
            </button>
            
            <button
              onClick={() => onFlag(comment.id)}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            >
              <FaFlag className="h-3 w-3" />
              Flag
            </button>
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-3 p-3 bg-accent/30 rounded-lg">
              <div className="mb-2">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Reply Type:</label>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(commentTypes).map(([type, info]) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
                        selectedType === type
                          ? `bg-${info.color}-100 text-${info.color}-700`
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <info.icon className="h-3 w-3" />
                      {info.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Write a ${selectedType === 'general' ? 'reply' : selectedType}...`}
                className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
              />
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {replyText.length}/500 characters
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowReplyForm(false)}
                    className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                    className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-2">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium">
                      {reply.author?.name?.[0] || 'A'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-xs">{reply.author?.name || 'Anonymous'}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(reply.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{reply.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentTypes;
