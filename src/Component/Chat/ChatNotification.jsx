import React, { useState, useEffect, useCallback } from 'react';
import { FaComments } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { chatService } from '../../services/chatService';

const ChatNotification = ({ className = '' }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [shouldPoll, setShouldPoll] = useState(true);
  const { logIn } = useSelector((store) => store.auth);
  const customerId = useSelector((store) => store.auth.customerId);

  const loadUnreadCount = useCallback(async () => {
    try {
      const response = await chatService.getUnreadCount();
      if (response?.success) {
        setUnreadCount(response.data?.unread_count || 0);
      }
    } catch (error) {
      // Stop polling if authentication has permanently failed
      if (error?.status === 401 && error?.refreshExpired) {
        console.log('Authentication expired - stopping chat notification polling');
        setShouldPoll(false);
        setUnreadCount(0);
        return;
      }
      
      // Silently handle expected 404 errors (endpoint may not be available yet)
      // Only log unexpected errors in development
      if (process.env.NODE_ENV === 'development' && error?.status !== 404) {
        console.error('Error loading unread count:', error?.message || error);
      }
      // Reset unread count to 0 on error
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    // Reset polling state when user logs in
    if (logIn) {
      setShouldPoll(true);
    }
  }, [logIn]);

  useEffect(() => {
    if (logIn && customerId && shouldPoll) {
      loadUnreadCount();
      // Set up polling for unread count
      const interval = setInterval(loadUnreadCount, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [logIn, customerId, loadUnreadCount, shouldPoll]);

  // Don't show if user is not logged in
  if (!logIn) {
    return null;
  }

  return (
    <Link
      to="/messages"
      className={`relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground ${className}`}
      title="Messages"
    >
      <FaComments className="h-4 w-4" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-destructive-foreground bg-destructive rounded-full min-w-[18px] h-[18px]">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default ChatNotification;