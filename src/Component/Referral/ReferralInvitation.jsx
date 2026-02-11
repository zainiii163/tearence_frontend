import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaShareAlt, FaCopy, FaGift, FaUsers, FaChartLine, FaEnvelope, FaWhatsapp, FaFacebook, FaTwitter, FaLink } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { getUserDetails } from '../../slice/AuthSlice';
import { generateReferralCode, generateReferralLink } from '../../utils/referralHelper';

const ReferralInvitation = () => {
  const dispatch = useDispatch();
  const { userDetail } = useSelector(state => state.auth);
  const [referralData, setReferralData] = useState({
    referralCode: '',
    referralLink: '',
    totalInvitations: 0,
    successfulInvitations: 0,
    pendingInvitations: 0,
    totalEarned: 0,
    discountPercentage: 10, // 10% for referrers
    inviteeDiscountPercentage: 20 // 20% for new users
  });
  const [email, setEmail] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);

  const generateReferralData = useCallback(() => {
    const userId = userDetail?.customer_id || userDetail?.id;
    const userName = userDetail?.name || userDetail?.username || 'User';
    const referralCode = generateReferralCode(userId, userName);
    const referralLink = generateReferralLink(referralCode);

    setReferralData(prev => ({
      ...prev,
      referralCode,
      referralLink,
      // Mock data - in real app, this would come from API
      totalInvitations: Math.floor(Math.random() * 50),
      successfulInvitations: Math.floor(Math.random() * 20),
      pendingInvitations: Math.floor(Math.random() * 10),
      totalEarned: (Math.floor(Math.random() * 200) * 5).toFixed(2)
    }));
  }, [userDetail]);

  useEffect(() => {
    if (!userDetail) {
      dispatch(getUserDetails());
    } else {
      generateReferralData();
    }
  }, [userDetail, dispatch, generateReferralData]);

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied to clipboard!`);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const shareOnSocialMedia = (platform) => {
    const message = `Join me on WWA Platform and get ${referralData.inviteeDiscountPercentage}% discount on your first advert! Use my referral code: ${referralData.referralCode}`;
    const url = referralData.referralLink;

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`;
        break;
      case 'email':
        setShowEmailModal(true);
        return;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const sendEmailInvitation = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      // Mock API call - in real app, this would call your backend
      const invitationData = {
        recipientEmail: email,
        referralCode: referralData.referralCode,
        referralLink: referralData.referralLink,
        customMessage: customMessage,
        inviterName: userDetail?.name || userDetail?.username || 'Someone'
      };

      console.log('Sending email invitation:', invitationData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Invitation sent successfully!');
      setEmail('');
      setCustomMessage('');
      setShowEmailModal(false);
      
      // Update invitation count
      setReferralData(prev => ({
        ...prev,
        totalInvitations: prev.totalInvitations + 1,
        pendingInvitations: prev.pendingInvitations + 1
      }));
    } catch (error) {
      toast.error('Failed to send invitation');
    }
  };

  const EmailModal = () => (
    showEmailModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">Send Email Invitation</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="friend@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Message (Optional)
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Add a personal message..."
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowEmailModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={sendEmailInvitation}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Send Invitation
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Invite & Earn</h2>
        <p className="text-gray-600">Invite friends and earn discounts on advertisements</p>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <FaUsers className="text-blue-600 text-2xl mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">{referralData.totalInvitations}</div>
          <div className="text-sm text-gray-600">Total Invitations</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <FaChartLine className="text-green-600 text-2xl mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">{referralData.successfulInvitations}</div>
          <div className="text-sm text-gray-600">Successful</div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <FaGift className="text-yellow-600 text-2xl mx-auto mb-2" />
          <div className="text-2xl font-bold text-yellow-600">${referralData.totalEarned}</div>
          <div className="text-sm text-gray-600">Total Earned</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <FaShareAlt className="text-purple-600 text-2xl mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-600">{referralData.discountPercentage}%</div>
          <div className="text-sm text-gray-600">Your Discount</div>
        </div>
      </div>

      {/* Referral Code and Link */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Your Referral Information</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Referral Code
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={referralData.referralCode}
                readOnly
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md"
              />
              <button
                onClick={() => copyToClipboard(referralData.referralCode, 'Referral code')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <FaCopy className="mr-2" />
                Copy
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Referral Link
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={referralData.referralLink}
                readOnly
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
              />
              <button
                onClick={() => copyToClipboard(referralData.referralLink, 'Referral link')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <FaLink className="mr-2" />
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Options */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Share Your Referral</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => shareOnSocialMedia('email')}
            className="flex items-center justify-center p-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <FaEnvelope className="mr-2" />
            Email
          </button>
          
          <button
            onClick={() => shareOnSocialMedia('whatsapp')}
            className="flex items-center justify-center p-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FaWhatsapp className="mr-2" />
            WhatsApp
          </button>
          
          <button
            onClick={() => shareOnSocialMedia('facebook')}
            className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaFacebook className="mr-2" />
            Facebook
          </button>
          
          <button
            onClick={() => shareOnSocialMedia('twitter')}
            className="flex items-center justify-center p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
          >
            <FaTwitter className="mr-2" />
            Twitter
          </button>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Referral Benefits</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-blue-600 mb-2">For You (Inviter)</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Get {referralData.discountPercentage}% discount on your next advert
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Discount applied automatically when referral is successful
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Unlimited referrals - no earning cap
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-purple-600 mb-2">For Your Friend (Invitee)</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Get {referralData.inviteeDiscountPercentage}% discount on first advert
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Welcome discount applied automatically
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Join the platform with exclusive benefits
              </li>
            </ul>
          </div>
        </div>
      </div>

      <EmailModal />
    </div>
  );
};

export default ReferralInvitation;
