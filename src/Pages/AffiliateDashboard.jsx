import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';
import AffiliateManagement from '../Component/dashboard/AffiliateManagement';

/**
 * Standalone affiliate dashboard route.
 * Prefer /dashboard?tab=affiliates — this page embeds the same management UI
 * so older bookmarks keep working.
 */
const AffiliateDashboard = () => {
  const navigate = useNavigate();
  const { logIn } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!logIn) {
      navigate('/login', { state: { from: '/dashboard?tab=affiliates' } });
    }
  }, [logIn, navigate]);

  if (!logIn) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center text-slate-500">
        Redirecting to sign in…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto">
        <div className="px-4 pt-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            Full account tools also live under{' '}
            <button
              type="button"
              className="font-semibold text-primary hover:underline"
              onClick={() => navigate('/dashboard?tab=affiliates')}
            >
              Dashboard → Affiliates
            </button>
          </p>
          <a href="/affiliates" className="text-xs font-semibold text-primary hover:underline">
            Browse marketplace →
          </a>
        </div>
        <AffiliateManagement />
      </main>
      <Footer />
    </div>
  );
};

export default AffiliateDashboard;
