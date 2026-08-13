import React, { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { FaCrown, FaArrowRight } from 'react-icons/fa';

function Ring({ value = 0, label }) {
  const p = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="flex flex-col items-center gap-2 min-w-[4.75rem]">
      <div className="dash-ring" style={{ ['--p']: p }}>
        <span>{Math.round(p)}%</span>
      </div>
      {label ? (
        <p className="text-[11px] text-center text-[color:var(--dash-muted)] leading-tight max-w-[5.5rem]">
          {label}
        </p>
      ) : null}
    </div>
  );
}

function MiniCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = now.toLocaleString(undefined, { month: 'long' }).toUpperCase();
  const cells = [];
  for (let i = 0; i < firstDow; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);

  return (
    <div className="dash-card p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold tracking-wide">{monthName}</h3>
        <span className="text-xs text-[color:var(--dash-muted)]">{year}</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-[10px] text-center text-[color:var(--dash-muted)] mb-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={`${d}-${i}`}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs text-center">
        {cells.map((d, i) => (
          <span
            key={`${d}-${i}`}
            className={`py-1.5 rounded-full ${
              d === today
                ? 'bg-[color:var(--dash-accent)] text-slate-900 font-bold'
                : d
                  ? 'text-white/90'
                  : ''
            }`}
          >
            {d || ''}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Overview board matching the dark teal mockup:
 * ring gauges · concentric gauges · activity timeline · charts · calendar
 */
export default function DashboardMockOverview({
  isBusinessUser = false,
  overviewStats = {},
  insights = null,
  pendingItems = [],
  onOpenTab,
}) {
  const [weekData] = useState(() => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return days.map((name, i) => ({
      name,
      views: Math.max(4, Math.round((overviewStats.totalViews || 20) / 7) + (i % 3) * 4),
      saves: Math.max(1, Math.round((overviewStats.totalSaves || 8) / 7) + (i % 2) * 2),
    }));
  });

  const rings = useMemo(() => {
    const total = Number(overviewStats.totalPosts || 0);
    const active = Number(overviewStats.activePosts || 0);
    const views = Number(overviewStats.totalViews || 0);
    const saves = Number(overviewStats.totalSaves || 0);
    const unread = Number(insights?.notifications?.unread || 0);
    const sold = Number(insights?.sales?.sold_items || 0);

    const pct = (n, den) => (den > 0 ? Math.round((n / den) * 100) : n > 0 ? 75 : 20);

    return [
      { label: 'Active ads', value: total ? pct(active, total) : 40 },
      { label: 'Engagement', value: views ? Math.min(95, 35 + Math.round(Math.log10(views + 1) * 18)) : 75 },
      { label: 'Saves rate', value: views ? pct(saves, views) : 20 },
      { label: isBusinessUser ? 'Sales pulse' : 'Purchases', value: isBusinessUser ? (sold ? Math.min(90, 40 + sold * 8) : 80) : 60 },
      { label: 'Alerts clear', value: unread ? Math.max(15, 100 - unread * 12) : 60 },
    ];
  }, [overviewStats, insights, isBusinessUser]);

  const concentric = rings.slice(0, 3);

  const timeline = useMemo(() => {
    if (pendingItems.length) {
      return pendingItems.slice(0, 5).map((item) => ({
        title: item.title || 'Pending listing',
        body: item.message || 'Awaiting payment — clear invoice to go live.',
        tone: 'pending',
      }));
    }
    const recent = Array.isArray(insights?.notifications?.recent)
      ? insights.notifications.recent
      : [];
    if (recent.length) {
      return recent.slice(0, 5).map((n) => ({
        title: n.title || n.type || 'Update',
        body: n.message || 'Recent dashboard activity',
      }));
    }
    return [
      {
        title: isBusinessUser ? 'Post a listing' : 'Browse marketplace',
        body: isBusinessUser
          ? 'Create an ad and choose Free or Paid promotion.'
          : 'Find products, services, and deals across categories.',
      },
      {
        title: 'Track pending invoices',
        body: 'Paid promotions stay Pending until checkout clears.',
      },
      {
        title: 'Watch performance',
        body: 'Views, saves, and sales update here as activity comes in.',
      },
    ];
  }, [pendingItems, insights, isBusinessUser]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--dash-muted)]">
            {isBusinessUser ? 'Business control room' : 'Your control room'}
          </p>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Dashboard
            {isBusinessUser ? <FaCrown className="text-amber-300 text-base" /> : null}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => onOpenTab?.(isBusinessUser ? 'buy-sell' : 'purchases')}
          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--dash-accent)] text-slate-900 px-4 py-2 text-xs font-bold hover:brightness-110"
        >
          {isBusinessUser ? 'Manage ads' : 'My purchases'}
          <FaArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Top rings strip */}
        <div className="xl:col-span-7 dash-card p-5">
          <p className="text-xs font-semibold text-[color:var(--dash-muted)] mb-4">
            Performance snapshot
          </p>
          <div className="flex flex-wrap items-start justify-between gap-4">
            {rings.map((r) => (
              <Ring key={r.label} value={r.value} label={r.label} />
            ))}
          </div>
        </div>

        {/* Weekly chart */}
        <div className="xl:col-span-5 dash-card p-5">
          <p className="text-xs font-semibold text-[color:var(--dash-muted)] mb-2">Weekly views</p>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekData}>
                <defs>
                  <linearGradient id="dashViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8ef05a" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#036aa1" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fill: '#9db8c4', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: '#0a2f3d',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="views" stroke="#8ef05a" fill="url(#dashViews)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Concentric / stacked rings */}
        <div className="xl:col-span-3 dash-card p-5 flex flex-col items-center justify-center gap-5">
          {concentric.map((r) => (
            <div key={r.label} className="text-center">
              <div
                className="dash-ring mx-auto"
                style={{
                  ['--p']: r.value,
                  width: '5.5rem',
                  height: '5.5rem',
                }}
              >
                <span className="!text-base">{Math.round(r.value)}%</span>
              </div>
              <button
                type="button"
                onClick={() => onOpenTab?.(isBusinessUser ? 'buy-sell' : 'purchases')}
                className="mt-2 text-[11px] font-bold text-[color:var(--dash-accent)] hover:underline"
              >
                Get started
              </button>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="xl:col-span-5 dash-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold">Activity timeline</h3>
            <button
              type="button"
              onClick={() => onOpenTab?.('notifications')}
              className="text-[11px] font-semibold text-[color:var(--dash-accent-2)] hover:underline"
            >
              View all
            </button>
          </div>
          <div className="dash-timeline">
            {timeline.map((item, idx) => (
              <div key={`${item.title}-${idx}`} className="dash-timeline-item">
                <p className="text-sm font-bold text-white">{item.title}</p>
                <p className="text-xs text-[color:var(--dash-muted)] mt-0.5 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dual wave + calendar */}
        <div className="xl:col-span-4 space-y-4">
          <div className="dash-card p-5">
            <p className="text-xs font-semibold text-[color:var(--dash-muted)] mb-2">Views vs saves</p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weekData}>
                  <defs>
                    <linearGradient id="dashA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5eead4" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#5eead4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="dashB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8ef05a" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#8ef05a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fill: '#9db8c4', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9db8c4', fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip
                    contentStyle={{
                      background: '#0a2f3d',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="views" stroke="#5eead4" fill="url(#dashA)" strokeWidth={2} />
                  <Area type="monotone" dataKey="saves" stroke="#8ef05a" fill="url(#dashB)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <MiniCalendar />
        </div>
      </div>
    </div>
  );
}
