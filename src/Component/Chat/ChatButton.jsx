import React, { useState } from 'react';
import { FaComments } from 'react-icons/fa';
import StartChatModal from './StartChatModal';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ChatButton = ({ 
  sellerId, 
  sellerName, 
  listing = null, 
  className = '',
  variant = 'primary' // 'primary', 'secondary', 'icon'
}) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  
  // Use Redux auth state like other components
  const { logIn } = useSelector((store) => store.auth);
  const userDetails = useSelector((store) => store.auth?.userDetail?.data || {});
  const customerId = useSelector((store) => store.auth.customerId);

  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    switch (variant) {
      case 'secondary':
        return `${baseClasses} border border-input bg-background hover:bg-accent hover:text-accent-foreground`;
      case 'icon':
        return `${baseClasses} text-primary hover:text-primary/80 hover:bg-accent`;
      default: // primary
        return `${baseClasses} bg-primary text-primary-foreground hover:bg-primary/90`;
    }
  };

  // Don't show chat button if user is not logged in - show login prompt instead
  if (!logIn) {
    return (
      <button
        onClick={() => navigate('/Login')}
        className={`${getButtonClasses()} ${className}`}
        title="Login to send message"
      >
        <FaComments className={`${variant === 'icon' ? 'h-4 w-4' : 'mr-2 h-4 w-4'}`} />
        {variant !== 'icon' && 'Contact Seller'}
      </button>
    );
  }

  // Don't show if user is the seller
  if (customerId && customerId === sellerId) {
    return null;
  }

  // Debug logging (remove in production)
  console.log('ChatButton Debug:', {
    logIn: logIn,
    customerId: customerId,
    sellerId: sellerId,
    sellerName: sellerName,
    userDetails: userDetails,
    isSeller: customerId === sellerId
  });

  const handleChatStart = (conversationId) => {
    setShowModal(false);
    if (conversationId) {
      // Navigate to chat page with the new conversation
      navigate('/messages');
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`${getButtonClasses()} ${className}`}
        title={`Send message to ${sellerName}`}
      >
        <FaComments className={`${variant === 'icon' ? 'h-4 w-4' : 'mr-2 h-4 w-4'}`} />
        {variant !== 'icon' && 'Contact Seller'}
      </button>

      <StartChatModal
        isOpen={showModal}
        onClose={handleChatStart}
        sellerId={sellerId}
        sellerName={sellerName}
        listing={listing}
      />
    </>
  );
};

export default ChatButton;