import React, { useState, useEffect, useRef } from 'react';
import { FaEnvelope, FaPaperPlane, FaSearch, FaUserCircle, FaTimes, FaReply, FaForward, FaTrash, FaStar, FaCheck, FaCheckDouble } from 'react-icons/fa';
import api from '../../api';
import toast from 'react-hot-toast';

const InternalMessagingSystem = ({ currentUser, recipientId, recipientName, onSendMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      // Mark messages as read
      markMessagesAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check for unread messages periodically
    const interval = setInterval(() => {
      if (isOpen) {
        fetchUnreadCount();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isOpen]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/messages/conversations');
      setConversations(response.data?.data || []);
      fetchUnreadCount();
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await api.get(`/messages/conversations/${conversationId}`);
      setMessages(response.data?.data?.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/messages/unread-count');
      setUnreadCount(response.data?.count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markMessagesAsRead = async (conversationId) => {
    try {
      await api.post(`/messages/conversations/${conversationId}/read`);
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      conversation_id: selectedConversation?.id,
      recipient_id: selectedConversation?.other_user?.id || recipientId,
      message: newMessage.trim(),
      message_type: 'text'
    };

    try {
      setSendingMessage(true);
      const response = await api.post('/messages/send', messageData);
      
      if (response.data.success) {
        // Add message to local state immediately for better UX
        const tempMessage = {
          id: response.data.data.id,
          message: newMessage.trim(),
          sender_id: currentUser?.id,
          created_at: new Date().toISOString(),
          status: 'sent'
        };
        
        setMessages(prev => [...prev, tempMessage]);
        setNewMessage('');
        
        // Update conversation last message
        if (selectedConversation) {
          setSelectedConversation(prev => ({
            ...prev,
            last_message: newMessage.trim(),
            last_message_time: new Date().toISOString()
          }));
        }
        
        if (onSendMessage) {
          onSendMessage(response.data.data);
        }
        
        toast.success('Message sent');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const startNewConversation = async () => {
    if (!recipientId) return;

    try {
      const response = await api.post('/messages/conversations', {
        recipient_id: recipientId
      });
      
      if (response.data.success) {
        const newConversation = response.data.data;
        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversation(newConversation);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Failed to start conversation');
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await api.delete(`/messages/${messageId}`);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success('Message deleted');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case 'sent': return <FaCheck className="h-3 w-3 text-gray-400" />;
      case 'delivered': return <FaCheckDouble className="h-3 w-3 text-gray-400" />;
      case 'read': return <FaCheckDouble className="h-3 w-3 text-blue-500" />;
      default: return null;
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.other_user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.last_message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Message Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <FaEnvelope className="h-4 w-4" />
        <span>Message</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Messaging Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
          <div className="bg-white w-full max-w-6xl h-full mx-auto flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaEnvelope className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                    <p className="text-sm text-gray-600">
                      {unreadCount > 0 && `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Conversations List */}
              <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
                {/* Search */}
                <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* New Conversation Button */}
                {recipientId && !selectedConversation && (
                  <div className="p-4 border-b border-gray-200">
                    <button
                      onClick={startNewConversation}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Start conversation with {recipientName}
                    </button>
                  </div>
                )}

                {/* Conversations */}
                <div className="flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                    </div>
                  ) : filteredConversations.length > 0 ? (
                    filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors ${
                          selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                            {conversation.other_user?.avatar ? (
                              <img src={conversation.other_user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <FaUserCircle className="h-10 w-10 text-gray-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-gray-900 truncate">
                                {conversation.other_user?.name || 'Unknown User'}
                              </h4>
                              <span className="text-xs text-gray-500">
                                {formatTime(conversation.last_message_time)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {conversation.last_message}
                            </p>
                            {conversation.unread_count > 0 && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                                {conversation.unread_count}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FaEnvelope className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No conversations yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages Area */}
              {selectedConversation ? (
                <div className="flex-1 flex flex-col">
                  {/* Conversation Header */}
                  <div className="bg-white border-b border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        {selectedConversation.other_user?.avatar ? (
                          <img src={selectedConversation.other_user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <FaUserCircle className="h-10 w-10 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {selectedConversation.other_user?.name || 'Unknown User'}
                        </h3>
                        <p className="text-sm text-gray-600">Active now</p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => {
                      const isOwn = message.sender_id === currentUser?.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isOwn
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{message.message}</p>
                            <div className={`flex items-center justify-between mt-1 text-xs ${
                              isOwn ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              <span>{formatTime(message.created_at)}</span>
                              {isOwn && getMessageStatusIcon(message.status)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="bg-white border-t border-gray-200 p-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || sendingMessage}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {sendingMessage ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <FaPaperPlane className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center text-gray-500">
                    <FaEnvelope className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Select a conversation</p>
                    <p className="text-sm">Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InternalMessagingSystem;
