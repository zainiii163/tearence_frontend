import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBriefcase,
  FaTags,
  FaFileAlt,
  FaShoppingBag,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { servicesApi } from '../../services/servicesSolutionsApi';
import { buysellAPI } from '../../api/buysell';
import businessTemplatesAPI from '../../api/businessTemplatesAPI';
import { extractListItems } from '../../utils/apiResponseHelpers';

const money = (n, currency = 'USD') => {
  const amount = Number(n) || 0;
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
};

/**
 * Buyer hub — purchases across Services, Buy & Sell, and Templates.
 */
const BuyerPurchasesHub = () => {
  const [loading, setLoading] = useState(true);
  const [serviceOrders, setServiceOrders] = useState([]);
  const [buySellPurchases, setBuySellPurchases] = useState([]);
  const [templatePurchases, setTemplatePurchases] = useState([]);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [svc, bs, tpl] = await Promise.all([
        servicesApi.getBuyerOrders({ per_page: 30 }).catch(() => ({ data: [] })),
        buysellAPI.myPurchases({ per_page: 30 }).catch(() => ({ data: [] })),
        businessTemplatesAPI.myPurchases({ per_page: 30 }).catch(() => ({ data: [] })),
      ]);

      setServiceOrders(extractListItems(svc));
      setBuySellPurchases(extractListItems(bs));
      setTemplatePurchases(extractListItems(tpl));
    } catch (e) {
      const msg =
        (typeof e?.message === 'string' && e.message) ||
        'Could not load purchases';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <p className="text-sm text-gray-500 py-8">Loading your purchases…</p>;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">
        {error}
        <button type="button" onClick={load} className="ml-3 underline">
          Retry
        </button>
      </div>
    );
  }

  const sections = [
    {
      key: 'services',
      title: 'Service orders',
      icon: FaBriefcase,
      empty: 'No service orders yet.',
      browse: '/services',
      browseLabel: 'Browse services',
      rows: serviceOrders.map((o) => ({
        id: o.id,
        title: o.service?.title || o.title || `Order #${o.id}`,
        meta: o.payment_status === 'paid' || o.payment_status === 'completed'
          ? `Paid · ${o.status || 'pending'}`
          : `${o.payment_status || 'unpaid'} · ${o.status || 'pending'}`,
        amount: o.total_price ?? o.amount,
        href: o.service_id ? `/services/${o.service_id}` : '/services',
      })),
    },
    {
      key: 'buysell',
      title: 'Buy & Sell purchases',
      icon: FaTags,
      empty: 'No marketplace purchases yet.',
      browse: '/buy-sell',
      browseLabel: 'Browse Buy & Sell',
      rows: buySellPurchases.map((p) => ({
        id: p.id,
        title: p.title || p.advert?.title || `Purchase #${p.id}`,
        meta: p.payment_status === 'paid' ? 'Paid' : p.payment_status || 'pending',
        amount: p.price,
        currency: p.currency,
        href: p.buysell_advert_id || p.advert?.id ? `/item/${p.buysell_advert_id || p.advert?.id}` : '/buy-sell',
      })),
    },
    {
      key: 'templates',
      title: 'Template downloads',
      icon: FaFileAlt,
      empty: 'No template purchases yet.',
      browse: '/business/templates',
      browseLabel: 'Browse templates',
      rows: templatePurchases.map((p) => ({
        id: p.id,
        title: p.title || p.template_slug || `Template #${p.id}`,
        meta: p.payment_status === 'completed' || p.payment_status === 'paid' ? 'Paid' : p.payment_status || 'pending',
        amount: p.price_paid ?? p.price,
        href: p.download_url || null,
        download: p.download_url,
      })),
    },
  ];

  const totalCount =
    serviceOrders.length + buySellPurchases.length + templatePurchases.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 inline-flex items-center gap-2">
            <FaShoppingBag className="text-[#1e3a5f]" />
            My purchases
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Orders and downloads from services, marketplace, and templates ({totalCount}).
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="text-sm font-semibold text-[#1e3a5f] hover:underline"
        >
          Refresh
        </button>
      </div>

      {sections.map((section) => (
        <section key={section.key} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-3">
            <h3 className="font-semibold text-gray-900 inline-flex items-center gap-2">
              <section.icon className="text-gray-500" />
              {section.title}
            </h3>
            <Link to={section.browse} className="text-xs font-semibold text-blue-700 hover:underline">
              {section.browseLabel}
            </Link>
          </div>

          {section.rows.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-500">{section.empty}</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {section.rows.map((row) => (
                <li key={`${section.key}-${row.id}`} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{row.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{row.meta}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {row.amount != null && (
                      <span className="text-sm font-bold text-gray-900">
                        {money(row.amount, row.currency || 'USD')}
                      </span>
                    )}
                    {row.download ? (
                      <a
                        href={row.download}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1"
                      >
                        Download <FaExternalLinkAlt className="h-3 w-3" />
                      </a>
                    ) : row.href ? (
                      <Link
                        to={row.href}
                        className="text-xs font-semibold text-blue-700 hover:underline"
                      >
                        View
                      </Link>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
};

export default BuyerPurchasesHub;
