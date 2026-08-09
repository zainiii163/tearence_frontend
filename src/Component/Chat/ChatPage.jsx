import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { chatService } from '../../services/chatService';
import Navbar from '../Navbar';
import Footer from '../Footer';

const ChatPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const openFromQuery = async () => {
      const conversationId = searchParams.get('c');
      if (!conversationId) return;

      try {
        const response = await chatService.getConversations();
        if (response.success) {
          const list = response.data || [];
          const match = list.find(
            (c) => String(c.conversation_id) === String(conversationId)
          );
          if (match) {
            setSelectedConversation(match);
          }
        }
      } catch (error) {
        console.error('Error opening conversation from URL:', error);
      }
    };

    openFromQuery();
  }, [searchParams]);

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
    setSearchParams({ c: String(conversation.conversation_id) }, { replace: true });
    setTimeout(loadUnreadCount, 1000);
  };

  const handleCloseChat = () => {
    setSelectedConversation(null);
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background">
      <Navbar />

      <div className="w-full flex justify-center pt-28 sm:pt-20">
        <div className="container px-2 sm:px-4 lg:px-8 py-2 sm:py-6">
          <div className={`mb-4 sm:mb-6 ${selectedConversation ? 'hidden md:block' : 'block'}`}>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Live Chat</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Message buyers and sellers in real time across every category
            </p>
          </div>

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

          <div className="hidden md:block">
            <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden h-[calc(100vh-12rem)] min-h-[500px]">
              <div className="flex h-full">
                <div className="w-1/3 border-r border-border">
                  <ChatList
                    onSelectConversation={handleSelectConversation}
                    selectedConversationId={selectedConversation?.conversation_id}
                  />
                </div>

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
