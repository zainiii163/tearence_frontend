import React, { useState, useEffect } from 'react';
import { FaTrophy, FaGift, FaTimes, FaShare, FaCheck, FaRocket, FaSparkles } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ReferralSuccessModal = ({ 
  isOpen, 
  onClose, 
  referralData, 
  referredUserName, 
  discountAmount, 
  rewardType 
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      setCurrentStep(0);
      
      // Auto-advance through celebration steps
      const timer = setTimeout(() => {
        setCurrentStep(1);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'I just earned a discount!',
        text: `I got ${discountAmount}% discount by referring ${referredUserName} to WWA Platform. Join now and get 20% off your first advert!`,
        url: referralData.referralLink
      });
    } else {
      navigator.clipboard.writeText(referralData.referralLink);
      toast.success('Referral link copied!');
    }
  };

  const celebrationSteps = [
    {
      icon: FaRocket,
      title: 'Referral Successful!',
      message: `${referredUserName} has joined the platform`,
      color: 'text-blue-600'
    },
    {
      icon: FaGift,
      title: 'Reward Earned!',
      message: `You got ${discountAmount}% discount on your next advert`,
      color: 'text-green-600'
    },
    {
      icon: FaTrophy,
      title: 'Keep Going!',
      message: 'Invite more friends to earn more rewards',
      color: 'text-yellow-600'
    }
  ];

  if (!isOpen) return null;

  const stepColor = celebrationSteps[currentStep].color;
  const stepIcon = celebrationSteps[currentStep].icon;
  const stepTitle = celebrationSteps[currentStep].title;
  const stepMessage = celebrationSteps[currentStep].message;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Confetti Background */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              >
                {'🎉🎊✨🌟💫🎁🏆⭐'.charAt(Math.floor(Math.random() * 8))}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
              <FaCheck className="text-white text-3xl" />
            </div>
            <div className="absolute -top-2 -right-2">
              <FaSparkles className="text-yellow-500 text-xl animate-spin" />
            </div>
          </div>
        </div>

        {/* Dynamic Content Based on Step */}
        <div className="text-center mb-6">
          <div className={`flex justify-center mb-4 ${stepColor}`}>
            <stepIcon className="text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {stepTitle}
          </h2>
          <p className="text-gray-600">
            {stepMessage}
          </p>
        </div>

        {/* Reward Details */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Your Reward</p>
              <p className="text-2xl font-bold text-green-600">
                {discountAmount}% OFF
              </p>
            </div>
            <FaGift className="text-3xl text-green-500" />
          </div>
        </div>

        {/* Referral Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {referralData.totalInvitations}
            </div>
            <div className="text-xs text-gray-600">Total Invites</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {referralData.successfulInvitations}
            </div>
            <div className="text-xs text-gray-600">Successful</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {referralData.totalEarned}
            </div>
            <div className="text-xs text-gray-600">Total Earned</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaShare />
            Share the Good News
          </button>
          
          <button
            onClick={() => {
              // Navigate to referral dashboard
              window.location.href = '/referral';
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaTrophy />
            View All Referrals
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2 mt-6">
          {celebrationSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Success Message */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            🎉 Keep inviting friends to earn more rewards!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReferralSuccessModal;
