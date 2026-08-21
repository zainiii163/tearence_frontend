import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSafeInternalPath } from '../utils/safeRedirect';

/**
 * Custom hook to handle authentication redirects for posting forms
 *
 * Usage:
 * const { requireAuth, isAuthenticated } = useAuthRedirect();
 *
 * // In your component:
 * const handlePostClick = () => {
 *   requireAuth('/your-posting-route', 'You must be logged in to create a listing.');
 * };
 */
export const useAuthRedirect = () => {
  const { logIn, token } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [redirectMessage] = useState('');

  const isAuthenticated = logIn === true || token;

  const requireAuth = (targetRoute, message = 'You must be logged in to create a listing.', options = {}) => {
    const safeTarget = getSafeInternalPath(targetRoute, '/');

    if (!isAuthenticated) {
      sessionStorage.setItem('authRedirect', safeTarget);
      sessionStorage.setItem('authMessage', message);

      // Soft gate: show modal, stay on page (Social Hub guests can keep browsing)
      if (options.soft !== false && options.mode === 'modal') {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('wwa-auth-required', {
              detail: { message, from: safeTarget },
            })
          );
        }
        return false;
      }

      navigate('/Login', {
        state: {
          from: safeTarget,
          message,
        },
      });
      return false;
    }

    return true;
  };

  /** Prefer modal over hard redirect (Social Hub / community actions). */
  const requireAuthModal = (
    targetRoute,
    message = 'You need an account to like, comment, or create posts.'
  ) => requireAuth(targetRoute, message, { mode: 'modal' });

  const getRedirectAfterLogin = () => {
    const sessionRedirect = sessionStorage.getItem('authRedirect');
    if (sessionRedirect) {
      sessionStorage.removeItem('authRedirect');
      return getSafeInternalPath(sessionRedirect, null);
    }

    if (location.state?.from) {
      return getSafeInternalPath(location.state.from, null);
    }

    const params = new URLSearchParams(location.search);
    const redirectParam = params.get('redirect');
    if (redirectParam) {
      return getSafeInternalPath(redirectParam, null);
    }

    return null;
  };

  const getAuthMessage = () => {
    const sessionMessage = sessionStorage.getItem('authMessage');
    if (sessionMessage) {
      sessionStorage.removeItem('authMessage');
      return sessionMessage;
    }

    if (location.state?.message) {
      return location.state.message;
    }

    const params = new URLSearchParams(location.search);
    const messageParam = params.get('message');
    if (messageParam) {
      return messageParam;
    }

    return 'You must be logged in to access this page.';
  };

  const clearRedirect = () => {
    sessionStorage.removeItem('authRedirect');
    sessionStorage.removeItem('authMessage');
  };

  return {
    isAuthenticated,
    requireAuth,
    requireAuthModal,
    getRedirectAfterLogin,
    getAuthMessage,
    clearRedirect,
    redirectMessage,
  };
};

export const ProtectedPostingRoute = ({ children, message }) => {
  const { requireAuth } = useAuthRedirect();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    requireAuth(currentPath, message || 'You must be logged in to create a listing.');
  }, [location.pathname, location.search]);

  const { isAuthenticated } = useAuthRedirect();

  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export const usePostingAuth = (postRoute, customMessage) => {
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const navigate = useNavigate();

  const handlePostClick = () => {
    if (requireAuth(postRoute, customMessage)) {
      navigate(getSafeInternalPath(postRoute, '/'));
    }
  };

  return {
    handlePostClick,
    isAuthenticated,
  };
};

export default useAuthRedirect;
