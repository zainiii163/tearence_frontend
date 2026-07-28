import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import adminTemplatesAPI from '../../api/adminTemplatesAPI';

const STATUS_OPTIONS = ['all', 'active', 'paused', 'draft', 'sold'];

const AdminTemplatesPanel = () => {
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [view, setView] = useState('listings');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [fee, setFee] = useState('5.00');
  const [durationDays, setDurationDays] = useState('30');
  const [savingFee, setSavingFee] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, listRes, settingsRes, purchasesRes] = await Promise.all([
        adminTemplatesAPI.stats(),
        adminTemplatesAPI.list({
          search: search || undefined,
          status: status !== 'all' ? status : undefined,
          is_premium: premiumOnly ? true : undefined,
          per_page: 50,
        }),
        adminTemplatesAPI.getSettings(),
        adminTemplatesAPI.purchases({ per_page: 50 }),
      ]);

      setStats(statsRes?.data || null);
      const rows = listRes?.data?.data || listRes?.data || [];
      setItems(Array.isArray(rows) ? rows : []);
      const purchaseRows = purchasesRes?.data?.data || purchasesRes?.data || [];
      setPurchases(Array.isArray(purchaseRows) ? purchaseRows : []);

      const settings = settingsRes?.data || {};
      if (settings.premium_monthly_fee != null) {
        setFee(String(settings.premium_monthly_fee));
      }
      if (settings.premium_duration_days != null) {
        setDurationDays(String(settings.premium_duration_days));
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to load templates admin data');
    } finally {
      setLoading(false);
    }
  }, [search, status, premiumOnly]);

  useEffect(() => {
    load();
  }, [load]);

  const savePricing = async () => {
    setSavingFee(true);
    try {
      const res = await adminTemplatesAPI.updateSettings({
        premium_monthly_fee: Number(fee),
        premium_duration_days: Number(durationDays),
      });
      toast.success(res?.message || 'Premium pricing saved');
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to save pricing');
    } finally {
      setSavingFee(false);
    }
  };

  const togglePremium = async (item) => {
    const currentlyPremium = Boolean(item.is_premium_active || item.is_premium);
    try {
      await adminTemplatesAPI.setPremium(item.id, !currentlyPremium);
      toast.success(currentlyPremium ? 'Premium removed' : 'Marked premium');
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to update premium');
    }
  };

  const setItemStatus = async (item, nextStatus) => {
    try {
      await adminTemplatesAPI.update(item.id, { status: nextStatus });
      toast.success(`Status set to ${nextStatus}`);
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to update status');
    }
  };

  const removeItem = async (item) => {
    if (!window.confirm(`Delete template “${item.title}”?`)) return;
    try {
      await adminTemplatesAPI.remove(item.id);
      toast.success('Template deleted');
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Business Templates</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage catalog &amp; seller listings. Premium monthly fee is editable below (not hard-coded).
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="px-3 py-2 text-sm font-medium rounded-md border bg-white hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
          {[
            ['Total', stats.total],
            ['Active', stats.active],
            ['Premium', stats.premium],
            ['Catalog', stats.catalog],
            ['Seller', stats.seller_listings],
            ['Purchases', stats.purchases],
            ['Fee revenue', `$${Number(stats.revenue || 0).toFixed(2)}`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border bg-card p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
              <p className="text-2xl font-bold mt-1">{value ?? 0}</p>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-lg border bg-card p-5 space-y-4">
        <h3 className="font-semibold">Premium listing fee</h3>
        <p className="text-sm text-muted-foreground">
          Sellers pay this amount to feature a template as premium for one period (default ≈ 1 month).
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">Monthly fee (USD)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className="w-36 px-3 py-2 text-sm rounded-md border"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Duration (days)</label>
            <input
              type="number"
              min="1"
              max="365"
              value={durationDays}
              onChange={(e) => setDurationDays(e.target.value)}
              className="w-28 px-3 py-2 text-sm rounded-md border"
            />
          </div>
          <button
            type="button"
            disabled={savingFee}
            onClick={savePricing}
            className="px-4 py-2 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {savingFee ? 'Saving…' : 'Save pricing'}
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b">
        {[
          { id: 'listings', label: 'Listings' },
          { id: 'purchases', label: 'Purchases' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setView(t.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              view === t.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {view === 'listings' && (
        <div className="rounded-lg border bg-card p-5 space-y-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-medium mb-1">Search</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Title, slug…"
                className="w-full px-3 py-2 text-sm rounded-md border"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-3 py-2 text-sm rounded-md border"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s === 'all' ? 'All statuses' : s}
                  </option>
                ))}
              </select>
            </div>
            <label className="inline-flex items-center gap-2 text-sm pb-2">
              <input
                type="checkbox"
                checked={premiumOnly}
                onChange={(e) => setPremiumOnly(e.target.checked)}
              />
              Premium only
            </label>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Loading templates…</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No templates found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Title</th>
                    <th className="py-2 pr-3 font-medium">Vertical</th>
                    <th className="py-2 pr-3 font-medium">Price</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                    <th className="py-2 pr-3 font-medium">Premium</th>
                    <th className="py-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="py-2.5 pr-3">
                        <p className="font-medium line-clamp-1">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.slug}</p>
                      </td>
                      <td className="py-2.5 pr-3">{item.vertical}</td>
                      <td className="py-2.5 pr-3">${Number(item.price || 0).toFixed(2)}</td>
                      <td className="py-2.5 pr-3">
                        <select
                          value={item.status}
                          onChange={(e) => setItemStatus(item, e.target.value)}
                          className="text-xs border rounded px-1.5 py-1"
                        >
                          {['active', 'paused', 'draft', 'sold'].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2.5 pr-3">
                        {item.is_premium_active || item.is_premium ? (
                          <span className="text-amber-700 font-semibold text-xs">Yes</span>
                        ) : (
                          <span className="text-muted-foreground text-xs">No</span>
                        )}
                      </td>
                      <td className="py-2.5">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => togglePremium(item)}
                            className="text-xs font-semibold text-amber-700 hover:underline"
                          >
                            {item.is_premium_active || item.is_premium ? 'Remove premium' : 'Make premium'}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item)}
                            className="text-xs font-semibold text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {view === 'purchases' && (
        <div className="rounded-lg border bg-card p-5 space-y-4">
          {loading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Loading purchases…</p>
          ) : purchases.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No purchases yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Title</th>
                    <th className="py-2 pr-3 font-medium">Paid</th>
                    <th className="py-2 pr-3 font-medium">Platform fee</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                    <th className="py-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-2.5 pr-3">
                        <p className="font-medium">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.template_slug}</p>
                      </td>
                      <td className="py-2.5 pr-3">${Number(p.price_paid || 0).toFixed(2)}</td>
                      <td className="py-2.5 pr-3">${Number(p.platform_fee || 0).toFixed(2)}</td>
                      <td className="py-2.5 pr-3">{p.payment_status}</td>
                      <td className="py-2.5">
                        {p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminTemplatesPanel;
