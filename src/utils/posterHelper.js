import { useSelector } from 'react-redux';

/**
 * Get the appropriate poster name based on the posting context
 * - Business pages: use business name
 * - Store pages: use store name  
 * - Admin dashboard: use business/store name
 * - Regular users: use user name
 */
export const getPosterName = (user, businessStore, storeDetail, isAdmin = false) => {
  // If posting from admin dashboard and there's a business/store context
  if (isAdmin) {
    if (businessStore?.name) {
      return businessStore.name;
    }
    if (storeDetail?.name) {
      return storeDetail.name;
    }
  }

  // If posting from business page
  if (businessStore?.name) {
    return businessStore.name;
  }

  // If posting from store page
  if (storeDetail?.name) {
    return storeDetail.name;
  }

  // Default to user name
  return user?.name || user?.username || 'Anonymous';
};

/**
 * Hook to get poster name with automatic context detection
 */
export const usePosterName = () => {
  const auth = useSelector(state => state.auth);
  const store = useSelector(state => state.store);
  
  const user = auth.userDetail?.data || auth.userInfo;
  const businessStore = store.businessStore?.data || store.businessStore;
  const storeDetail = store.storeDetail?.data || store.storeDetail;
  
  // Check if current context is admin dashboard (you may need to adjust this logic)
  const isAdmin = window.location.pathname.includes('/admin') || user?.role === 'admin';
  
  return getPosterName(user, businessStore, storeDetail, isAdmin);
};

/**
 * Enhanced createListing service that handles business/store names
 */
export const createListingWithPosterName = async (listingData, user, businessStore, storeDetail, isAdmin = false) => {
  const posterName = getPosterName(user, businessStore, storeDetail, isAdmin);
  
  // Determine poster type and ID
  let posterType = 'user';
  let posterId = user?.customer_id || user?.id;
  
  if (businessStore?.id) {
    posterType = 'business';
    posterId = businessStore.id;
  } else if (storeDetail?.id) {
    posterType = 'store';
    posterId = storeDetail.id;
  }
  
  // Enhanced listing data with poster information
  const enhancedListingData = {
    ...listingData,
    poster_name: posterName,
    poster_type: posterType,
    poster_id: posterId,
    // Keep original fields for backward compatibility
    customer_id: user?.customer_id,
    user_id: user?.id
  };
  
  return enhancedListingData;
};
