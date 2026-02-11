import React, { useState, useEffect } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { chatService } from '../../services/chatService';
import Navbar from '../Navbar';
import Footer from '../Footer';

const ChatPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUnreadCount();
    // Set up polling for unread count (optional)
    const interval = setInterval(loadUnreadCount, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const response = await chatService.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data.unread_count);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    // Update unread count when selecting a conversation
    setTimeout(loadUnreadCount, 1000);
  };

  const handleCloseChat = () => {
    setSelectedConversation(null);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background">
      <Navbar />
      
      <div className="w-full flex justify-center pt-28 sm:pt-20">
        <div className="container px-2 sm:px-4 lg:px-8 py-2 sm:py-6">
          {/* Header - Hide on mobile when chat window is open */}
          <div className={`mb-4 sm:mb-6 ${selectedConversation ? 'hidden md:block' : 'block'}`}>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Messages</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Communicate with buyers and sellers</p>
          </div>
          
          {/* Mobile: Full screen chat layout */}
          <div className="md:hidden">
            {!selectedConversation ? (
              <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden h-[calc(100vh-8rem)]">
                <ChatList
                  onSelectConversation={handleSelectConversation}
                  selectedConversationId={selectedConversation?.conversation_id}
                />
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden h-[calc(100vh-6rem)]">
                <ChatWindow
                  conversation={selectedConversation}
                  onClose={handleCloseChat}
                  showMobileHeader={true}
                />
              </div>
            )}
          </div>
          
          {/* Desktop: Side-by-side layout */}
          <div className="hidden md:block">
            <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden h-[calc(100vh-12rem)] min-h-[500px]">
              <div className="flex h-full">
                {/* Chat List Sidebar */}
                <div className="w-1/3 border-r border-border">
                  <ChatList
                    onSelectConversation={handleSelectConversation}
                    selectedConversationId={selectedConversation?.conversation_id}
                  />
                </div>

                {/* Chat Window */}
                <div className="flex-1">
                  <ChatWindow
                    conversation={selectedConversation}
                    onClose={handleCloseChat}
                    showMobileHeader={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ChatPage;