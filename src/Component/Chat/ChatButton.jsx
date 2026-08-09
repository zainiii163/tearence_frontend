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
  variant = 'primary', // 'primary', 'secondary', 'icon'
  label = 'Live Chat',
}) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const { logIn } = useSelector((store) => store.auth);
  const customerId = useSelector((store) => store.auth.customerId);

  const getButtonClasses = () => {
    const baseClasses =
      'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';

    switch (variant) {
      case 'secondary':
        return `${baseClasses} border border-input bg-background hover:bg-accent hover:text-accent-foreground`;
      case 'icon':
        return `${baseClasses} text-primary hover:text-primary/80 hover:bg-accent`;
      case 'custom':
        return baseClasses;
      default:
        return `${baseClasses} bg-primary text-primary-foreground hover:bg-primary/90`;
    }
  };

  if (!sellerId) {
    return null;
  }

  if (!logIn) {
    return (
      <button
        type="button"
        onClick={() => navigate('/Login')}
        className={`${getButtonClasses()} ${className}`}
        title="Login to start live chat"
      >
        <FaComments className={`${variant === 'icon' ? 'h-4 w-4' : 'mr-2 h-4 w-4'}`} />
        {variant !== 'icon' && label}
      </button>
    );
  }

  if (customerId != null && String(customerId) === String(sellerId)) {
    return null;
  }

  const handleChatStart = (conversationId) => {
    setShowModal(false);
    if (conversationId) {
      navigate(`/messages?c=${conversationId}`);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className={`${getButtonClasses()} ${className}`}
        title={`Live chat with ${sellerName || 'seller'}`}
      >
        <FaComments className={`${variant === 'icon' ? 'h-4 w-4' : 'mr-2 h-4 w-4'}`} />
        {variant !== 'icon' && label}
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
