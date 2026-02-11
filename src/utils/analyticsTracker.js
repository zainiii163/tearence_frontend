import { trackEvent } from "../slice/AnalyticsSlice";
import store from "../store";

/**
 * Analytics Tracker Utility
 * 
 * Provides helper functions to track analytics events throughout the application.
 * Events can be tracked without authentication (for views), but other events require auth.
 */

/**
 * Track a view event for a listing
 * @param {number} listingId - Listing ID
 * @param {Object} [metadata] - Additional metadata
 */
export const trackView = (listingId, metadata = {}) => {
  if (!listingId) return;
  
  // Track view without requiring authentication (views can be tracked anonymously)
  store.dispatch(trackEvent({
    listing_id: listingId,
    event_type: "view",
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
    },
  })).catch(() => {
    // Silently fail - don't disrupt user experience
  });
};

/**
 * Track a click event for a listing
 * @param {number} listingId - Listing ID
 * @param {Object} [metadata] - Additional metadata
 */
export const trackClick = (listingId, metadata = {}) => {
  if (!listingId) return;
  
  store.dispatch(trackEvent({
    listing_id: listingId,
    event_type: "click",
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
    },
  })).catch(() => {
    // Silently fail
  });
};

/**
 * Track a favorite event for a listing
 * @param {number} listingId - Listing ID
 * @param {boolean} isFavorite - Whether listing is favorited
 * @param {Object} [metadata] - Additional metadata
 */
export const trackFavorite = (listingId, isFavorite, metadata = {}) => {
  if (!listingId) return;
  
  store.dispatch(trackEvent({
    listing_id: listingId,
    event_type: "favorite",
    metadata: {
      ...metadata,
      is_favorite: isFavorite,
      timestamp: new Date().toISOString(),
    },
  })).catch(() => {
    // Silently fail
  });
};

/**
 * Track a share event for a listing
 * @param {number} listingId - Listing ID
 * @param {string} shareMethod - Share method (email, social, etc.)
 * @param {Object} [metadata] - Additional metadata
 */
export const trackShare = (listingId, shareMethod, metadata = {}) => {
  if (!listingId) return;
  
  store.dispatch(trackEvent({
    listing_id: listingId,
    event_type: "share",
    metadata: {
      ...metadata,
      share_method: shareMethod,
      timestamp: new Date().toISOString(),
    },
  })).catch(() => {
    // Silently fail
  });
};

/**
 * Track a contact event for a listing
 * @param {number} listingId - Listing ID
 * @param {string} contactMethod - Contact method (phone, email, form, etc.)
 * @param {Object} [metadata] - Additional metadata
 */
export const trackContact = (listingId, contactMethod, metadata = {}) => {
  if (!listingId) return;
  
  store.dispatch(trackEvent({
    listing_id: listingId,
    event_type: "contact",
    metadata: {
      ...metadata,
      contact_method: contactMethod,
      timestamp: new Date().toISOString(),
    },
  })).catch(() => {
    // Silently fail
  });
};

/**
 * Track an application event for a job listing
 * @param {number} listingId - Listing ID
 * @param {Object} [metadata] - Additional metadata
 */
export const trackApplication = (listingId, metadata = {}) => {
  if (!listingId) return;
  
  store.dispatch(trackEvent({
    listing_id: listingId,
    event_type: "application",
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
    },
  })).catch(() => {
    // Silently fail
  });
};

/**
 * Generic event tracker
 * @param {number} listingId - Listing ID
 * @param {string} eventType - Event type (view, click, favorite, share, contact, application)
 * @param {Object} [metadata] - Additional metadata
 */
export const trackListingEvent = (listingId, eventType, metadata = {}) => {
  if (!listingId || !eventType) return;
  
  const validEventTypes = ["view", "click", "favorite", "share", "contact", "application"];
  if (!validEventTypes.includes(eventType)) {
    console.warn(`Invalid event type: ${eventType}. Valid types: ${validEventTypes.join(", ")}`);
    return;
  }
  
  store.dispatch(trackEvent({
    listing_id: listingId,
    event_type: eventType,
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
    },
  })).catch(() => {
    // Silently fail
  });
};
