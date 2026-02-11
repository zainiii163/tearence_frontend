import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReferralStats, trackClick } from "../services/AffiliateServices";
import toast from "react-hot-toast";

const ReferralTracker = ({ referralCode, targetUrl, children }) => {
  const [isTracking, setIsTracking] = useState(false);
  const dispatch = useDispatch();

  const handleReferralClick = async (e) => {
    if (referralCode && targetUrl) {
      e.preventDefault();
      setIsTracking(true);

      try {
        // Track the click
        await trackClick(referralCode, targetUrl);
        
        // Store referral info in localStorage for conversion tracking
        localStorage.setItem('referralCode', referralCode);
        localStorage.setItem('referralTimestamp', Date.now().toString());
        
        // Show success message
        toast.success("Referral tracked! Redirecting...");
        
        // Redirect after a short delay
        setTimeout(() => {
          window.open(targetUrl, '_blank');
        }, 500);
        
      } catch (error) {
        console.error('Error tracking referral:', error);
        // Still redirect even if tracking fails
        window.open(targetUrl, '_blank');
      } finally {
        setIsTracking(false);
      }
    } else {
      // Normal click if no referral tracking needed
      window.open(targetUrl, '_blank');
    }
  };

  // Check for existing referral on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    
    if (ref && !localStorage.getItem('referralCode')) {
      localStorage.setItem('referralCode', ref);
      localStorage.setItem('referralTimestamp', Date.now().toString());
    }
  }, []);

  return (
    <div onClick={handleReferralClick} className="cursor-pointer">
      {isTracking ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          Tracking referral...
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default ReferralTracker;
