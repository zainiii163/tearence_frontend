import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaChartLine,
  FaHeart,
  FaComments,
  FaShoppingBag,
  FaClock,
  FaBell,
  FaShieldAlt,
  FaPercent,
  FaBuilding,
} from 'react-icons/fa';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { dashboardInsightsAPI } from '../../api/twoFactorAPI';

/**
 * Clive analytics overview: sold, favourites, messages, ending promos, notifications, 2FA.
 * Basic/personal: buyer activity only (no seller revenue / ads ending).
 */
const DashboardInsightsOverview = ({ accountHint = 'personal' }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await dashboardInsightsAPI.get();
        if (!cancelled) setData(res?.data || null);
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-slate-500 mb-6">Loading analytics…</p>;
  }

  if (!data) {
    return null;
  }

  const isBusiness =
    accountHint === 'business' ||
    (data.account_type || accountHint) === 'business';

  const cards = isBusiness
    ? [
        {
          label: 'Completed sales',
          value: data.sales?.sold_items ?? 0,
          icon: FaShoppingBag,
          tone: 'bg-emerald-600',
        },
        {
          label: 'Net seller revenue',
          value: `$${Number(data.sales?.seller_revenue || 0).toLocaleString()}`,
          icon: FaChartLine,
          tone: 'bg-slate-800',
        },
        {
          label: 'Favourites saved',
          value: data.favourites?.saved_by_you ?? 0,
          icon: FaHeart,
          tone: 'bg-rose-600',
          href: '/favorite-ads',
        },
        {
          label: 'Saves on your ads',
          value: data.favourites?.received_on_listings ?? 0,
          icon: FaHeart,
          tone: 'bg-pink-500',
        },
        {
          label: 'Unread notifications',
          value: data.notifications?.unread ?? 0,
          icon: FaBell,
          tone: 'bg-amber-600',
        },
        {
          label: 'Messages',
          value: data.messages?.unread ?? 0,
          icon: FaComments,
          tone: 'bg-sky-600',
          href: '/messages',
        },
      ]
    : [
        {
          label: 'Favourites saved',
          value: data.favourites?.saved_by_you ?? 0,
          icon: FaHeart,
          tone: 'bg-rose-600',
          href: '/favorite-ads',
        },
        {
          label: 'Unread notifications',
          value: data.notifications?.unread ?? 0,
          icon: FaBell,
          tone: 'bg-amber-600',
        },
        {
          label: 'Messages',
          value: data.messages?.unread ?? 0,
          icon: FaComments,
          tone: 'bg-sky-600',
          href: '/messages',
        },
        {
          label: 'My purchases',
          value: 'View →',
          icon: FaShoppingBag,
          tone: 'bg-emerald-600',
          href: '/dashboard?tab=purchases&mode=buying',
        },
      ];

  const ending = Array.isArray(data.ending_promotions) ? data.ending_promotions : [];
  const recent = Array.isArray(data.notifications?.recent) ? data.notifications.recent : [];

  const activityChart = isBusiness
    ? [
        { name: 'Sold', value: Number(data.sales?.sold_items ?? 0) },
        { name: 'Favourites', value: Number(data.favourites?.saved_by_you ?? 0) },
        { name: 'Saves on ads', value: Number(data.favourites?.received_on_listings ?? 0) },
        { name: 'Unread', value: Number(data.notifications?.unread ?? 0) },
        { name: 'Messages', value: Number(data.messages?.unread ?? 0) },
      ]
    : [
        { name: 'Favourites', value: Number(data.favourites?.saved_by_you ?? 0) },
        { name: 'Unread', value: Number(data.notifications?.unread ?? 0) },
        { name: 'Messages', value: Number(data.messages?.unread ?? 0) },
      ];

  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {isBusiness ? 'Business analytics' : 'Your activity'}
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">Dashboard insights</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isBusiness && (
            <Link
              to="/dashboard?tab=overview&mode=selling"
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              <FaBuilding /> My category workspace
            </Link>
          )}
          {isBusiness && (
            <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
              <FaPercent className="text-slate-500" />
              Platform sale fee {data.platform_fee_percent ?? 15}%
            </div>
          )}
        </div>
      </div>

      <div
        className={`grid gap-3 ${
          isBusiness
            ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
            : 'grid-cols-2 lg:grid-cols-4'
        }`}
      >
        {cards.map((card) => {
          const Inner = (
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition-colors h-full">
              <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg text-white ${card.tone}`}>
                <card.icon className="h-4 w-4" />
              </div>
              <p className="text-xs text-slate-500">{card.label}</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{card.value}</p>
            </div>
          );
          return card.href ? (
            <Link key={card.label} to={card.href}>{Inner}</Link>
          ) : (
            <div key={card.label}>{Inner}</div>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <FaChartLine className="text-indigo-600" />
          <h3 className="font-semibold text-slate-900">Activity overview</h3>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityChart} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="value" fill="#036aa1" radius={[6, 6, 0, 0]} animationDuration={700} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`grid gap-4 ${isBusiness ? 'lg:grid-cols-2' : ''}`}>
        {isBusiness && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <FaClock className="text-amber-600" />
              <h3 className="font-semibold text-slate-900">Ending soon</h3>
            </div>
            {ending.length === 0 ? (
              <p className="text-sm text-slate-500">No featured, promoted or sponsored ads ending in the next 7 days.</p>
            ) : (
              <ul className="space-y-2">
                {ending.slice(0, 6).map((item) => (
                  <li key={item.listing_id || item.title} className="flex justify-between gap-3 text-sm border-b border-slate-100 pb-2">
                    <span className="font-medium text-slate-800 truncate">{item.title || 'Listing'}</span>
                    <span className="shrink-0 text-xs text-amber-700">
                      {item.featured_expires_at || item.promoted_expires_at || item.end_date
                        ? new Date(
                            item.featured_expires_at || item.promoted_expires_at || item.end_date
                          ).toLocaleDateString()
                        : 'Soon'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FaBell className="text-slate-700" />
              <h3 className="font-semibold text-slate-900">Recent alerts</h3>
            </div>
            <Link
              to={`/dashboard?tab=notifications&mode=${isBusiness ? 'selling' : 'buying'}`}
              className="text-xs font-semibold text-slate-600 hover:underline"
            >
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-slate-500">No alerts yet. Expiry reminders appear here automatically.</p>
          ) : (
            <ul className="space-y-2">
              {recent.slice(0, 5).map((n) => (
                <li key={n.id} className="text-sm border-b border-slate-100 pb-2">
                  <p className="font-medium text-slate-800">{n.title || n.type}</p>
                  <p className="text-slate-500 line-clamp-2">{n.message}</p>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to={`/dashboard?tab=security&section=security&mode=${isBusiness ? 'selling' : 'buying'}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
            >
              <FaShieldAlt /> Account settings
            </Link>
            <Link
              to="/favorite-ads"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700"
            >
              <FaHeart /> Favourites
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardInsightsOverview;
