import React, { useState, useEffect } from 'react';
import { chatService } from '../../services/chatService';
import { FaUser, FaComments, FaClock } from 'react-icons/fa';
import moment from 'moment';
import SkeletonList from '../skeletons/SkeletonList';

const ChatList = ({ onSelectConversation, selectedConversationId }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadConversations(true);
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadConversations(false);
      }
    }, 8000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadConversations = async (showSpinner = true) => {
    try {
      if (showSpinner) setLoading(true);
      const response = await chatService.getConversations();
      if (response.success) {
        setConversations(response.data || []);
        setError(null);
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
      if (showSpinner) {
        setError(`Failed to load conversations: ${err.response?.data?.message || err.message}`);
      }
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-background">
        <div className="p-3 sm:p-4 border-b border-border bg-card">
          <div className="h-5 sm:h-6 bg-muted rounded w-24 sm:w-32 animate-pulse"></div>
        </div>
        <SkeletonList itemCount={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-3 sm:p-4">
        <p className="text-sm">{error}</p>
        <button 
          onClick={loadConversations}
          className="mt-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-3 sm:p-4 border-b border-border bg-card">
        <h2 className="text-base sm:text-lg font-semibold text-foreground flex items-center">
          <FaComments className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Messages
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="text-center text-muted-foreground p-6 sm:p-8">
            <FaComments className="mx-auto text-3xl sm:text-4xl mb-4 opacity-50" />
            <p className="text-sm sm:text-base font-medium">No conversations yet</p>
            <p className="text-xs sm:text-sm">Start chatting with sellers!</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {conversations.map((conversation) => (
              <div
                key={conversation.conversation_id}
                onClick={() => onSelectConversation(conversation)}
                className={`p-3 sm:p-4 cursor-pointer hover:bg-accent transition-colors active:bg-accent/80 ${
                  selectedConversationId === conversation.conversation_id
                    ? 'bg-accent border-r-2 border-primary'
                    : ''
                }`}
                style={{ minHeight: '72px' }} // Ensure minimum touch target size
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {conversation.other_participant.avatar ? (
                      <img
                        src={conversation.other_participant.avatar}
                        alt={conversation.other_participant.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-full flex items-center justify-center border border-border">
                        <FaUser className="text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm sm:text-base font-medium text-foreground truncate pr-2">
                        {conversation.other_participant.name}
                      </p>
                      {conversation.unread_count > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-destructive-foreground bg-destructive rounded-full min-w-[20px] h-[20px] flex-shrink-0">
                          {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
                        </span>
                      )}
                    </div>
                    
                    {conversation.listing && (
                      <p className="text-xs sm:text-sm text-primary truncate mb-1">
                        Re: {conversation.listing.title}
                      </p>
                    )}
                    
                    {conversation.last_message && (
                      <p className="text-sm text-muted-foreground truncate mb-1">
                        {conversation.last_message.message}
                      </p>
                    )}
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <FaClock className="mr-1 h-3 w-3 flex-shrink-0" />
                      <span className="truncate">
                        {conversation.last_message_at 
                          ? moment(conversation.last_message_at).fromNow()
                          : 'No messages yet'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;