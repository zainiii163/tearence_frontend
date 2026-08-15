import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { FaRocket, FaImage } from 'react-icons/fa';

export const PAID_ADVERT_TABS = [
  { id: 'promoted', label: 'Promoted Ads', to: '/paid-adverts?tab=promoted', icon: FaRocket },
  { id: 'banners', label: 'Banner Ads', to: '/paid-adverts?tab=banners', icon: FaImage },
];

const PaidAdvertsTabs = ({ className = '' }) => {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const tab = String(params.get('tab') || '').toLowerCase();
  const bannersActive =
    pathname.includes('banner') || tab === 'banners' || tab === 'banner';

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-2 ${className}`}
      role="tablist"
      aria-label="Paid advert types"
    >
      {PAID_ADVERT_TABS.map((item) => {
        const Icon = item.icon;
        const active = item.id === 'banners' ? bannersActive : !bannersActive;
        return (
          <Link
            key={item.id}
            to={item.to}
            role="tab"
            aria-selected={active}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold border transition ${
              active
                ? 'bg-white text-rose-800 border-white shadow-sm'
                : 'bg-white/15 text-white border-white/30 hover:bg-white/25'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};

export default PaidAdvertsTabs;
