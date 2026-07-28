import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaPlus,
  FaTrash,
  FaDownload,
  FaStar,
  FaPause,
  FaPlay,
  FaFileAlt,
  FaShoppingBag,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import businessTemplatesAPI from '../../api/businessTemplatesAPI';
import BusinessTemplatePostForm from '../shared/BusinessTemplatePostForm';
import { extractListItems } from '../../utils/apiResponseHelpers';

const STATUS_COLORS = {
  active: 'bg-green-100 text-green-800',
  paused: 'bg-yellow-100 text-yellow-800',
  draft: 'bg-gray-100 text-gray-700',
  sold: 'bg-blue-100 text-blue-800',
};

const TemplatesManagement = ({ openCreateOnMount = false, onCreateOpened }) => {
  const [subTab, setSubTab] = useState('listings');
  const [listings, setListings] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [premiumFee, setPremiumFee] = useState(5);
  const [premiumDays, setPremiumDays] = useState(30);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [templatesRes, purchasesRes, settingsRes] = await Promise.all([
        businessTemplatesAPI.myTemplates({ per_page: 50 }),
        businessTemplatesAPI.myPurchases({ per_page: 50 }),
        businessTemplatesAPI.getSettings().catch(() => null),
      ]);

      setListings(extractListItems(templatesRes));
      setPurchases(extractListItems(purchasesRes));

      const settings = settingsRes?.data || {};
      if (settings.premium_monthly_fee != null) setPremiumFee(Number(settings.premium_monthly_fee));
      if (settings.premium_duration_days != null) setPremiumDays(Number(settings.premium_duration_days));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load your templates');
      setListings([]);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (openCreateOnMount) {
      setShowForm(true);
      onCreateOpened?.();
    }
  }, [openCreateOnMount, onCreateOpened]);

  const setStatus = async (item, status) => {
    setBusyId(item.id);
    try {
      await businessTemplatesAPI.update(item.id, { status });
      toast.success(`Listing ${status}`);
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to update status');
    } finally {
      setBusyId(null);
    }
  };

  const promote = async (item) => {
    if (
      !window.confirm(
        `Promote “${item.title}” as premium for $${Number(premiumFee).toFixed(2)} / ${premiumDays} days?`
      )
    ) {
      return;
    }
    setBusyId(item.id);
    try {
      await businessTemplatesAPI.promote(item.id);
      toast.success('Premium activated');
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to promote');
    } finally {
      setBusyId(null);
    }
  };

  const removeListing = async (item) => {
    if (item.is_catalog) {
      toast.error('Catalog packs cannot be deleted from your dashboard');
      return;
    }
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    setBusyId(item.id);
    try {
      await businessTemplatesAPI.remove(item.id);
      toast.success('Template deleted');
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to delete');
    } finally {
      setBusyId(null);
    }
  };

  const downloadPurchase = (purchase) => {
    const token = purchase.download_token;
    const url =
      purchase.download_url ||
      (token
        ? `${process.env.REACT_APP_API_URL || 'https://api.worldwideadverts.info/api/v1'}/business-templates/download/${token}`
        : purchase.file_url);
    if (!url) {
      toast.error('Download not available');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const activeCount = listings.filter((i) => i.status === 'active').length;
  const premiumCount = listings.filter((i) => i.is_premium_active || i.is_premium).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Templates</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage listings you sell and templates you bought.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/buy-sell/templates"
            className="inline-flex items-center px-3 py-2 text-sm font-semibold rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          >
            Browse shop
          </Link>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-violet-700 text-white rounded-lg hover:bg-violet-800 text-sm font-semibold"
          >
            <FaPlus className="mr-2" />
            Sell a template
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ['My listings', listings.length, FaFileAlt, 'bg-violet-500'],
          ['Active', activeCount, FaPlay, 'bg-green-500'],
          ['Premium', premiumCount, FaStar, 'bg-amber-500'],
          ['Purchases', purchases.length, FaShoppingBag, 'bg-blue-500'],
        ].map(([label, value, Icon, color]) => (
          <div key={label} className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-full ${color} text-white`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'listings', label: 'My listings' },
          { id: 'purchases', label: 'My purchases' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSubTab(t.id)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              subTab === t.id
                ? 'border-violet-700 text-violet-800'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === 'listings' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Section</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Premium</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {listings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <FaFileAlt className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                      <p>No templates listed yet.</p>
                      <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="mt-3 text-sm font-semibold text-violet-700 hover:underline"
                      >
                        Sell your first template
                      </button>
                    </td>
                  </tr>
                ) : (
                  listings.map((item) => {
                    const isPremium = item.is_premium_active || item.is_premium;
                    const busy = busyId === item.id;
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.template_type || '—'}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.vertical}</td>
                        <td className="px-4 py-3 text-sm font-semibold">
                          ${Number(item.price || 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                              STATUS_COLORS[item.status] || STATUS_COLORS.draft
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {isPremium ? (
                            <span className="text-amber-700 font-semibold text-xs">
                              Yes
                              {item.premium_until
                                ? ` · until ${new Date(item.premium_until).toLocaleDateString()}`
                                : ''}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">No</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            {item.status === 'active' ? (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => setStatus(item, 'paused')}
                                className="text-xs font-semibold text-amber-700 hover:underline disabled:opacity-50"
                                title="Pause"
                              >
                                <FaPause className="inline mr-1" />
                                Pause
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => setStatus(item, 'active')}
                                className="text-xs font-semibold text-green-700 hover:underline disabled:opacity-50"
                              >
                                <FaPlay className="inline mr-1" />
                                Activate
                              </button>
                            )}
                            {!isPremium && (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => promote(item)}
                                className="text-xs font-semibold text-amber-600 hover:underline disabled:opacity-50"
                              >
                                <FaStar className="inline mr-1" />
                                Premium ${Number(premiumFee).toFixed(0)}
                              </button>
                            )}
                            {!item.is_catalog && (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => removeListing(item)}
                                className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
                              >
                                <FaTrash className="inline mr-1" />
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'purchases' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Template</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purchased</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {purchases.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      <FaShoppingBag className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                      <p>No purchases yet.</p>
                      <Link
                        to="/business/templates"
                        className="mt-3 inline-block text-sm font-semibold text-violet-700 hover:underline"
                      >
                        Browse business templates
                      </Link>
                    </td>
                  </tr>
                ) : (
                  purchases.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{p.title}</p>
                        <p className="text-xs text-gray-500">{p.template_slug || '—'}</p>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold">
                        ${Number(p.price_paid || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => downloadPurchase(p)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:underline"
                        >
                          <FaDownload />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <BusinessTemplatePostForm
          defaultVertical="business"
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            setSubTab('listings');
            load();
          }}
        />
      )}
    </div>
  );
};

export default TemplatesManagement;
