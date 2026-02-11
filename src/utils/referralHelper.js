/**
 * Referral Helper Utilities
 * Provides helper functions for referral operations
 */

/**
 * Generate referral code based on user ID and name
 * Creates 8-character unique codes (e.g., "ABC12345")
 */
export const generateReferralCode = (userId, userName) => {
  // Take first 3 letters of username (uppercase) and add 5 random digits/letters
  const namePrefix = userName.replace(/\s+/g, '').toUpperCase().slice(0, 3);
  const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  const code = (namePrefix + randomSuffix).slice(0, 8);
  
  // Ensure we have exactly 8 characters
  return code.padEnd(8, 'X').slice(0, 8);
};

/**
 * Generate referral link
 */
export const generateReferralLink = (referralCode, baseUrl = window.location.origin) => {
  return `${baseUrl}/signup?ref=${referralCode}`;
};

/**
 * Calculate discount amount
 */
export const calculateDiscount = (originalPrice, discountPercentage) => {
  const discountAmount = (originalPrice * discountPercentage) / 100;
  return {
    originalPrice,
    discountPercentage,
    discountAmount,
    finalPrice: originalPrice - discountAmount
  };
};

/**
 * Format referral message for social media
 */
export const formatReferralMessage = (inviterName, referralCode, discountPercentage, referralLink) => {
  return `Join me on WWA Platform and get ${discountPercentage}% discount on your first advert! 
Use my referral code: ${referralCode}
Sign up here: ${referralLink}`;
};

/**
 * Validate referral code format
 * Validates 8-character codes (e.g., "ABC12345")
 */
export const validateReferralCode = (referralCode) => {
  const regex = /^[A-Z0-9]{8}$/;
  return regex.test(referralCode);
};

/**
 * Extract referral code from URL
 */
export const extractReferralCodeFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('ref');
};

/**
 * Store referral code in session storage
 */
export const storeReferralCode = (referralCode) => {
  if (referralCode && validateReferralCode(referralCode)) {
    sessionStorage.setItem('referralCode', referralCode);
    return true;
  }
  return false;
};

/**
 * Get stored referral code
 */
export const getStoredReferralCode = () => {
  return sessionStorage.getItem('referralCode');
};

/**
 * Clear stored referral code
 */
export const clearStoredReferralCode = () => {
  sessionStorage.removeItem('referralCode');
};

/**
 * Check if user is eligible for referral discount
 */
export const isEligibleForReferralDiscount = (user, referralCode) => {
  // User shouldn't be eligible if:
  // 1. User is not new (already has adverts)
  // 2. Referral code is invalid or belongs to the same user
  // 3. User already used a referral code
  
  if (!user || !referralCode) return false;
  if (!validateReferralCode(referralCode)) return false;
  
  // Check if user already has adverts (mock check - in real app, this would be an API call)
  const hasAdverts = user.total_adverts > 0;
  if (hasAdverts) return false;
  
  return true;
};

/**
 * Get referral benefits configuration
 */
export const getReferralBenefits = () => {
  return {
    inviter: {
      discountPercentage: 10, // 10% discount on next advert
      creditPerReferral: 0, // No credit - just discount percentage
      maxReferrals: null // Unlimited referrals
    },
    invitee: {
      discountPercentage: 20, // 20% discount on first advert
      bonusCredits: 0, // No bonus credits - just discount
      freeFeatures: [] // No additional features in basic implementation
    }
  };
};

/**
 * Track referral event
 */
export const trackReferralEvent = (eventType, data) => {
  // This would typically send data to analytics service
  const eventData = {
    event: `referral_${eventType}`,
    timestamp: new Date().toISOString(),
    ...data
  };
  
  console.log('Tracking referral event:', eventData);
  
  // In production, this would send to Google Analytics, Mixpanel, etc.
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventType, {
      event_category: 'referral',
      ...data
    });
  }
};

/**
 * Generate referral statistics
 */
export const generateReferralStats = (referralData) => {
  const {
    total_invitations = 0,
    successful_invitations = 0,
    pending_invitations = 0,
    total_earned = 0,
    conversion_rate = 0
  } = referralData;

  return {
    totalInvitations: total_invitations,
    successfulInvitations: successful_invitations,
    pendingInvitations: pending_invitations,
    conversionRate: conversion_rate || (total_invitations > 0 ? (successful_invitations / total_invitations) * 100 : 0),
    totalEarned: total_earned,
    averageEarningsPerReferral: successful_invitations > 0 ? total_earned / successful_invitations : 0,
    nextRewardThreshold: Math.ceil(successful_invitations / 5) * 5 // Next milestone every 5 referrals
  };
};
