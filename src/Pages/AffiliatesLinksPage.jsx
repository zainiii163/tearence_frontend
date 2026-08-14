import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Legacy /affiliates/links → landing Affiliate Ads page.
 * Kept so old bookmarks and emails still work.
 */
const AffiliatesLinksPage = () => <Navigate to="/affiliates" replace />;

export default AffiliatesLinksPage;
