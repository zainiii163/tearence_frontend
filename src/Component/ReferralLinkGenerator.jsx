import React, { useState, useEffect } from "react";
import { FaLink, FaCopy, FaCheckCircle, FaShareAlt, FaEnvelope, FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { getReferralLink } from "../services/AffiliateServices";
import toast from "react-hot-toast";

const ReferralLinkGenerator = ({ userId, className = "" }) => {
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateReferralLink = async () => {
      try {
        setLoading(true);
        
        // For demo purposes, generate a simple referral link
        // In production, this would come from your API
        const baseUrl = window.location.origin;
        const referralCode = userId || `USER${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const generatedLink = `${baseUrl}?ref=${referralCode}`;
        
        setReferralLink(generatedLink);
        
        // In production, you would call your API:
        // const response = await getReferralLink();
        // setReferralLink(response.data.referralLink);
        
      } catch (error) {
        console.error('Error generating referral link:', error);
        // Fallback to generated link
        const baseUrl = window.location.origin;
        const referralCode = `USER${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        setReferralLink(`${baseUrl}?ref=${referralCode}`);
      } finally {
        setLoading(false);
      }
    };

    generateReferralLink();
  }, [userId]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Referral link copied to clipboard!");
      
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const shareOnSocial = (platform) => {
    const shareText = "Check out this amazing platform!";
    const shareUrl = referralLink;
    
    let shareLink = "";
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent('Check this out!')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(shareLink, '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center mb-4">
        <FaLink className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Your Referral Link</h3>
      </div>
      
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
          />
          <button
            onClick={copyToClipboard}
            className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
              copied 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {copied ? (
              <>
                <FaCheckCircle />
                Copied!
              </>
            ) : (
              <>
                <FaCopy />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      <div className="border-t pt-4">
        <p className="text-sm text-gray-600 mb-3">Share on social media:</p>
        <div className="flex gap-2">
          <button
            onClick={() => shareOnSocial('facebook')}
            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            title="Share on Facebook"
          >
            <FaFacebook className="h-4 w-4" />
          </button>
          <button
            onClick={() => shareOnSocial('twitter')}
            className="p-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors"
            title="Share on Twitter"
          >
            <FaTwitter className="h-4 w-4" />
          </button>
          <button
            onClick={() => shareOnSocial('whatsapp')}
            className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            title="Share on WhatsApp"
          >
            <FaWhatsapp className="h-4 w-4" />
          </button>
          <button
            onClick={() => shareOnSocial('email')}
            className="p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            title="Share via Email"
          >
            <FaEnvelope className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>How it works:</strong> Share this link with friends. When they sign up and become paying customers, you'll earn commissions!
        </p>
      </div>
    </div>
  );
};

export default ReferralLinkGenerator;
