import React, { useState } from 'react';
import { FaShare, FaTimes, FaFacebook, FaTwitter, FaWhatsapp, FaEnvelope, FaLink, FaMobile } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ReferralMobileShareWidget = ({ 
  referralCode, 
  referralLink, 
  userName, 
  isVisible, 
  onClose 
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleShare = async (platform) => {
    const message = `Join me on WWA Platform and get 20% discount on your first advert! Use my referral code: ${referralCode}`;
    const url = referralLink;

    try {
      switch (platform) {
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`, '_blank');
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message + ' ' + url)}`, '_blank');
          break;
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`, '_blank');
          break;
        case 'email':
          window.location.href = `mailto:?subject=Join WWA Platform&body=${encodeURIComponent(message + '\n\n' + url)}`;
          break;
        case 'copy':
          await navigator.clipboard.writeText(url);
          toast.success('Link copied to clipboard!');
          break;
        case 'native':
          if (navigator.share) {
            await navigator.share({
              title: 'Join WWA Platform',
              text: message,
              url: url
            });
          } else {
            // Fallback to copying
            await navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard!');
          }
          break;
      }
    } catch (error) {
      toast.error('Failed to share');
    }
    setShowOptions(false);
    onClose();
  };

  const shareOptions = [
    { id: 'native', icon: FaShare, label: 'Share', color: 'bg-blue-600' },
    { id: 'facebook', icon: FaFacebook, label: 'Facebook', color: 'bg-blue-800' },
    { id: 'twitter', icon: FaTwitter, label: 'Twitter', color: 'bg-sky-500' },
    { id: 'whatsapp', icon: FaWhatsapp, label: 'WhatsApp', color: 'bg-green-600' },
    { id: 'email', icon: FaEnvelope, label: 'Email', color: 'bg-red-600' },
    { id: 'copy', icon: FaLink, label: 'Copy Link', color: 'bg-gray-600' }
  ];

  if (!isVisible) return null;

  return (
    <>
      {/* Mobile Share Button */}
      <div className="md:hidden fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all hover:scale-110 animate-bounce"
        >
          <FaShare className="text-xl" />
        </button>
      </div>

      {/* Share Options Modal */}
      {showOptions && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => {
              setShowOptions(false);
              onClose();
            }}
          />

          {/* Share Options */}
          <div className="fixed bottom-20 right-4 z-50 bg-white rounded-2xl shadow-2xl p-4 w-64">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FaShare className="text-blue-600" />
                <span className="font-semibold text-gray-900">Share Referral</span>
              </div>
              <button
                onClick={() => {
                  setShowOptions(false);
                  onClose();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Referral Info */}
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <div className="text-center">
                <p className="text-xs text-blue-800 font-medium mb-1">
                  {userName}'s Referral
                </p>
                <p className="text-lg font-bold text-blue-900">
                  {referralCode}
                </p>
                <p className="text-xs text-blue-600">
                  20% discount for friends!
                </p>
              </div>
            </div>

            {/* Share Options */}
            <div className="grid grid-cols-3 gap-2">
              {shareOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleShare(option.id)}
                  className={`${option.color} text-white rounded-lg p-3 flex flex-col items-center justify-center hover:opacity-90 transition-all`}
                >
                  <option.icon className="text-lg mb-1" />
                  <span className="text-xs">{option.label}</span>
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(referralCode);
                    toast.success('Referral code copied!');
                  }}
                  className="bg-gray-100 text-gray-700 rounded-lg p-2 text-xs hover:bg-gray-200 transition-colors"
                >
                  Copy Code
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(referralLink);
                    toast.success('Link copied!');
                  }}
                  className="bg-gray-100 text-gray-700 rounded-lg p-2 text-xs hover:bg-gray-200 transition-colors"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

// Floating Action Button Component
export const ReferralFloatingButton = ({ 
  referralCode, 
  referralLink, 
  userName, 
  onClick 
}) => {
  return (
    <div className="md:hidden fixed bottom-4 right-4 z-40">
      <button
        onClick={onClick}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110 animate-pulse"
      >
        <FaShare className="text-xl" />
      </button>
    </div>
  );
};

// Bottom Sheet Component for Mobile
export const ReferralBottomSheet = ({ 
  referralCode, 
  referralLink, 
  userName, 
  isVisible, 
  onClose 
}) => {
  const handleShare = async (platform) => {
    const message = `Join me on WWA Platform and get 20% discount on your first advert! Use my referral code: ${referralCode}`;
    const url = referralLink;

    try {
      switch (platform) {
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`, '_blank');
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message + ' ' + url)}`, '_blank');
          break;
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`, '_blank');
          break;
        case 'email':
          window.location.href = `mailto:?subject=Join WWA Platform&body=${encodeURIComponent(message + '\n\n' + url)}`;
          break;
        case 'copy':
          await navigator.clipboard.writeText(url);
          toast.success('Link copied to clipboard!');
          break;
      }
    } catch (error) {
      toast.error('Failed to share');
    }
  };

  const shareOptions = [
    { id: 'facebook', icon: FaFacebook, label: 'Facebook', color: 'bg-blue-800' },
    { id: 'twitter', icon: FaTwitter, label: 'Twitter', color: 'bg-sky-500' },
    { id: 'whatsapp', icon: FaWhatsapp, label: 'WhatsApp', color: 'bg-green-600' },
    { id: 'email', icon: FaEnvelope, label: 'Email', color: 'bg-red-600' },
    { id: 'copy', icon: FaLink, label: 'Copy Link', color: 'bg-gray-600' }
  ];

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-out">
        {/* Handle */}
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaShare className="text-blue-600" />
              <span className="font-semibold text-gray-900">Share Referral</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-6">
          {/* Referral Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
            <div className="text-center">
              <p className="text-sm text-blue-800 font-medium mb-1">
                {userName}'s Referral
              </p>
              <p className="text-2xl font-bold text-blue-900">
                {referralCode}
              </p>
              <p className="text-sm text-blue-600">
                20% discount for friends!
              </p>
            </div>
          </div>

          {/* Share Options */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {shareOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleShare(option.id)}
                className={`${option.color} text-white rounded-lg p-4 flex flex-col items-center justify-center hover:opacity-90 transition-all`}
              >
                <option.icon className="text-xl mb-2" />
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(referralCode);
                toast.success('Referral code copied!');
              }}
              className="bg-gray-100 text-gray-700 rounded-lg p-3 text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <FaLink className="text-gray-500" />
              Copy Code
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(referralLink);
                toast.success('Link copied!');
              }}
              className="bg-gray-100 text-gray-700 rounded-lg p-3 text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <FaLink className="text-gray-500" />
              Copy Link
            </button>
          </div>

          {/* Stats */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-center text-xs text-gray-600">
              <FaMobile className="inline mr-1" />
              Share with friends to earn rewards!
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferralMobileShareWidget;
