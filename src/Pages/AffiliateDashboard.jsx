import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isBasicAccount } from '../utils/accountType';

/**
 * Standalone affiliate dashboard route.
 * Prefer /dashboard?tab=affiliates — redirects so Basic vs Business chrome stays correct.
 */
const AffiliateDashboard = () => {
  const navigate = useNavigate();
  const { logIn, userDetail } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!logIn) {
      navigate('/login', {
        state: { from: '/dashboard?tab=affiliates&sub=promoting' },
      });
      return;
    }
    if (isBasicAccount(userDetail)) {
      navigate('/dashboard?tab=affiliates&mode=buying&sub=promoting', { replace: true });
      return;
    }
    navigate('/dashboard?tab=affiliates&mode=selling&sub=selling', { replace: true });
  }, [logIn, userDetail, navigate]);

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center text-slate-500">
      Opening affiliate dashboard…
    </div>
  );
};

export default AffiliateDashboard;
