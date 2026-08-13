import React from 'react';
import { Link } from 'react-router-dom';
import DashboardListThumbnail from '../DashboardListThumbnail';
import { formatListingDate } from '../../../utils/dashboardImageHelpers';

const CategoryRecentListings = ({ listings = [], loading = false, postPath = '#' }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 rounded-xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!listings.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
        <p className="text-sm text-slate-600">No listings yet in this category.</p>
        <Link to={postPath} className="mt-2 inline-block text-sm font-semibold text-indigo-700 hover:underline">
          Post your first listing →
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Listing</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hidden sm:table-cell">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hidden md:table-cell">Views</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hidden lg:table-cell">Posted</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {listings.map((row) => (
            <tr key={row.id || row.title} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <DashboardListThumbnail
                    item={{ ...row, display_image_url: row.image_url }}
                    className="h-11 w-11"
                    rounded="rounded-lg"
                  />
                  <span className="font-medium text-slate-900 truncate">{row.title}</span>
                </div>
              </td>
              <td className="px-4 py-3 hidden sm:table-cell">
                <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 capitalize">
                  {row.status || 'active'}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600 hidden md:table-cell tabular-nums">
                {(row.views ?? 0).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">
                {formatListingDate(row)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryRecentListings;
