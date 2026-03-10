import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../../services/chatService';
import { FaUser, FaPaperPlane, FaTimes, FaArrowLeft } from 'react-icons/fa';
import moment from 'moment';

const ChatWindow = ({ conversation, onClose, showMobileHeader = false }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversation) {
      loadMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await chatService.getMessages(conversation.conversation_id);
      if (response.success) {
        setMessages(response.data.messages);
      }
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const messageData = {
        message: newMessage.trim(),
        message_type: 'text'
      };

      const response = await chatService.sendMessage(conversation.conversation_id, messageData);
      if (response.success) {
        setMessages(prev => [...prev, {
          ...response.data,
          is_own_message: true
        }]);
        setNewMessage('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/30 p-4">
        <div className="text-center text-muted-foreground max-w-xs">
          <div className="flex justify-center mb-4">
            <FaUser className="text-4xl opacity-50" />
          </div>
          <p className="text-base font-medium">Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Mobile back button */}
            {showMobileHeader && (
              <button
                onClick={onClose}
                className="md:hidden inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 mr-2"
              >
                <FaArrowLeft className="h-4 w-4" />
              </button>
            )}
            
            {conversation.other_participant.avatar ? (
              <img
                src={conversation.other_participant.avatar}
                alt={conversation.other_participant.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-full flex items-center justify-center border border-border">
                <FaUser className="text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-foreground text-sm sm:text-base truncate">
                {conversation.other_participant.name}
              </h3>
              {conversation.listing && (
                <p className="text-xs sm:text-sm text-primary truncate">
                  Re: {conversation.listing.title}
                </p>
              )}
            </div>
          </div>
          
          {/* Desktop close button */}
          {!showMobileHeader && (
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4 bg-muted/30">
        {loading ? (
          <div className="space-y-3 sm:space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[280px] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-lg animate-pulse ${
                  i % 2 === 0 ? 'bg-muted' : 'bg-primary/20'
                }`}>
                  <div className="h-4 bg-gray-300 rounded w-32 mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p className="text-sm sm:text-base">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.message_id}
              className={`flex ${message.is_own_message ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[280px] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-lg shadow-sm ${
                  message.is_own_message
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-card-foreground border border-border'
                }`}
              >
                <p className="text-sm leading-relaxed break-words">{message.message}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.is_own_message ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}
                >
                  {moment(message.created_at).format('HH:mm')}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-3 sm:p-4 border-t border-border bg-card">
        {error && (
          <div className="mb-3 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-destructive hover:text-destructive/80 ml-2"
              >
                <FaTimes className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 flex h-10 sm:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-10 sm:w-auto sm:px-4"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
            ) : (
              <FaPaperPlane className="h-4 w-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;