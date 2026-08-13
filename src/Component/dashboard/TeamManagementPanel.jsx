import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers } from 'react-icons/fi';
import BusinessMembersManager from '../BusinessMembersManager';
import businessService from '../../services/BusinessService';

/**
 * Team & roles — dedicated dashboard sidebar tab.
 */
const TeamManagementPanel = () => {
  const [businessId, setBusinessId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await businessService.getMyBusiness();
        const biz = data?.data || data;
        const id = biz?.id || biz?.business_id;
        if (!cancelled && id) setBusinessId(id);
      } catch {
        if (!cancelled) setBusinessId(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
          <FiUsers className="text-indigo-600" /> Team &amp; roles
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Invite staff to manage your business page (admin, manager, editor, viewer).
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {loading ? (
          <p className="text-sm text-slate-500">Loading business…</p>
        ) : businessId ? (
          <BusinessMembersManager businessId={businessId} isOwner />
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Create or open your{' '}
            <Link to="/my-business" className="font-semibold underline">
              business store
            </Link>{' '}
            first, then invite team members here.
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamManagementPanel;
