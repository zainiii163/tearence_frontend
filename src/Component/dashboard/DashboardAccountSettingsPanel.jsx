import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaBuilding, FaShieldAlt, FaUser, FaCoins } from 'react-icons/fa';
import AccountInfo from '../AccountInfo';
import BusinessProfileCompletion from '../Business/BusinessProfileCompletion';
import DashboardSecurityPanel from './DashboardSecurityPanel';
import CryptoWalletSettings from './CryptoWalletSettings';
import { getDashboardCategory } from '../Business/businessCategoryDashboardConfig';

/**
 * Account settings inside the dashboard shell (profile + category business profile + 2FA).
 */
const DashboardAccountSettingsPanel = ({
  isBusinessUser = false,
  businessCategoryId = null,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryMeta = businessCategoryId
    ? getDashboardCategory(businessCategoryId)
    : null;

  const sections = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'crypto', label: 'Crypto wallet', icon: FaCoins },
    ...(isBusinessUser
      ? [
          {
            id: 'category',
            label: categoryMeta
              ? `${categoryMeta.name} profile`
              : 'Category profile',
            icon: FaBuilding,
          },
        ]
      : []),
    { id: 'security', label: 'Security / 2FA', icon: FaShieldAlt },
  ];

  const sectionFromUrl = searchParams.get('section');
  const validIds = sections.map((s) => s.id);
  const resolvedSection =
    sectionFromUrl && validIds.includes(sectionFromUrl)
      ? sectionFromUrl
      : 'profile';
  const [section, setSection] = useState(resolvedSection);

  useEffect(() => {
    setSection(resolvedSection);
  }, [resolvedSection]);

  const openSection = (id) => {
    setSection(id);
    const next = new URLSearchParams(searchParams);
    next.set('tab', 'security');
    next.set('section', id);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 text-center">Account settings</h1>
        <p className="mt-1 text-sm text-slate-500 text-center">
          Manage your profile
          {isBusinessUser && categoryMeta
            ? `, ${categoryMeta.name} business details,`
            : ''}{' '}
          and security without leaving the dashboard.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => openSection(id)}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              section === id
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {section === 'profile' && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <AccountInfo />
        </div>
      )}

      {section === 'crypto' && <CryptoWalletSettings />}

      {section === 'category' && isBusinessUser && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              {categoryMeta ? `${categoryMeta.name} business profile` : 'Business profile'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Company details for your locked category workspace.
            </p>
          </div>
          <BusinessProfileCompletion initialCategoryId={businessCategoryId} />
        </div>
      )}

      {section === 'security' && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <DashboardSecurityPanel />
        </div>
      )}
    </div>
  );
};

export default DashboardAccountSettingsPanel;
