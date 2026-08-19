import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaCheckDouble, FaTrash } from 'react-icons/fa';
import notificationService from '../../services/NotificationService';
import LocalAreaAlertsPanel from './LocalAreaAlertsPanel';

const typeLabel = (type) => {
  const map = {
    admin: 'Admin',
    advert_expiring: 'Advert expiry',
    promotion_ending: 'Promotion ending',
    featured_ending: 'Featured ending',
    sponsored_ending: 'Sponsored ending',
    subscription: 'Subscription',
    message: 'Message',
    seller_enquiry: 'Buyer enquiry',
    sale: 'Sale',
    system: 'System',
  };
  return map[type] || type || 'Update';
};

const notificationHref = (item) => {
  const url = item?.data?.url || item?.data?.link;
  if (typeof url === 'string' && url.startsWith('/')) return url;
  if (item?.type === 'seller_enquiry' && item?.data?.listing_id) {
    return `/item/${item.data.listing_id}`;
  }
  return null;
};

const DashboardNotificationsPanel = () => {
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [listRes, countRes, settingsRes] = await Promise.all([
        notificationService.getNotifications({ per_page: 30 }),
        notificationService.getUnreadCount(),
        notificationService.getNotificationSettings().catch(() => null),
      ]);
      const rows =
        listRes?.data?.data ||
        listRes?.data?.items ||
        listRes?.data ||
        [];
      setItems(Array.isArray(rows) ? rows : []);
      setUnread(countRes?.data?.unread_count ?? countRes?.unread_count ?? 0);
      setSettings(settingsRes?.data || null);
    } catch (e) {
      setError(e?.response?.data?.message || 'Could not load notifications.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markAll = async () => {
    await notificationService.markAllAsRead();
    load();
  };

  const markOne = async (id) => {
    await notificationService.markAsRead(id);
    load();
  };

  const removeOne = async (id) => {
    await notificationService.deleteNotification(id);
    load();
  };

  const toggleSetting = async (key) => {
    if (!settings) return;
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    await notificationService.updateNotificationSettings(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Notifications</h2>
          <p className="text-sm text-slate-600">
            Account alerts plus parking and traffic updates for your area only.
            {unread > 0 ? ` · ${unread} unread` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={markAll}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <FaCheckDouble /> Mark all read
        </button>
      </div>

      <LocalAreaAlertsPanel />

      {settings && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-800 mb-3">Reminder preferences</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['advert_expiry', 'Advert expiry / renewal'],
              ['promotion_ending', 'Featured / promoted / sponsored ending'],
              ['subscription', 'Subscription reminders'],
              ['admin', 'Admin messages'],
              ['messages', 'Buyer / seller messages'],
              ['sales', 'Sale confirmations'],
              ['email', 'Also send by email'],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={!!settings[key]}
                  onChange={() => toggleSetting(key)}
                  className="rounded border-slate-300"
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      )}

      {loading && <p className="text-sm text-slate-500">Loading…</p>}
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      {!loading && items.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <FaBell className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm text-slate-600">No notifications yet.</p>
        </div>
      )}

      <ul className="space-y-2">
        {items.map((n) => {
          const href = notificationHref(n);
          return (
          <li
            key={n.id}
            className={`rounded-xl border bg-white p-4 shadow-sm ${
              n.read_at ? 'border-slate-100 opacity-80' : 'border-amber-200'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  {typeLabel(n.type)}
                </p>
                <p className="text-sm font-semibold text-slate-900">{n.title || typeLabel(n.type)}</p>
                <p className="mt-1 text-sm text-slate-600">{n.message}</p>
                {href && (
                  <Link
                    to={href}
                    className="mt-2 inline-block text-xs font-semibold text-teal-700 hover:underline"
                  >
                    View listing
                  </Link>
                )}
                <p className="mt-2 text-xs text-slate-400">
                  {n.created_at ? new Date(n.created_at).toLocaleString() : ''}
                </p>
              </div>
              <div className="flex gap-2">
                {!n.read_at && (
                  <button
                    type="button"
                    onClick={() => markOne(n.id)}
                    className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Mark read
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeOne(n.id)}
                  className="rounded-lg border border-red-100 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50"
                  aria-label="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DashboardNotificationsPanel;
