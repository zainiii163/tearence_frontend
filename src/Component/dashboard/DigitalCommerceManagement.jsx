import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FaDownload,
  FaShoppingBag,
  FaStore,
  FaImage,
  FaCode,
  FaFileAlt,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import businessTemplatesAPI from '../../api/businessTemplatesAPI';
import imagesAPI from '../../services/imagesAPI';
import {
  ALL_SOFTWARE_ITEMS,
  getSoftwarePurchases,
  triggerSoftwareFileDownload,
} from '../../data/softwareMarketplace';
import { extractListItems } from '../../utils/apiResponseHelpers';
import { isBasicAccount } from '../../utils/accountType';

/**
 * Digital commerce: Basic = purchases only; Business = sales + purchases.
 */
const DigitalCommerceManagement = () => {
  const [searchParams] = useSearchParams();
  const { userDetail } = useSelector((store) => store.auth);
  const isBuyerOnly =
    searchParams.get('mode') === 'buying' || isBasicAccount(userDetail);

  const [subTab, setSubTab] = useState(() => {
    const s = searchParams.get('sub');
    return s === 'sales' || s === 'purchases' ? s : 'purchases';
  });
  const [loading, setLoading] = useState(true);
  const [templatePurchases, setTemplatePurchases] = useState([]);
  const [templateSales, setTemplateSales] = useState([]);
  const [salesSummary, setSalesSummary] = useState({ orders: 0, revenue: 0 });
  const [myImages, setMyImages] = useState([]);
  const [myTemplates, setMyTemplates] = useState([]);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  const softwarePurchases = useMemo(() => {
    void tick;
    const map = getSoftwarePurchases();
    return Object.entries(map)
      .map(([id, meta]) => {
        const product = ALL_SOFTWARE_ITEMS.find((p) => p.id === id);
        return {
          id,
          title: meta.title || product?.title || id,
          amount: meta.amount ?? product?.price ?? 0,
          paidAt: meta.paidAt,
          product,
        };
      })
      .sort((a, b) => String(b.paidAt || '').localeCompare(String(a.paidAt || '')));
  }, [tick]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (isBuyerOnly) {
        const purchasesRes = await businessTemplatesAPI.myPurchases({ per_page: 50 }).catch(() => null);
        setTemplatePurchases(extractListItems(purchasesRes));
        setTemplateSales([]);
        setSalesSummary({ orders: 0, revenue: 0 });
        setMyTemplates([]);
        setMyImages([]);
      } else {
        const [purchasesRes, salesRes, templatesRes, imagesRes] = await Promise.all([
          businessTemplatesAPI.myPurchases({ per_page: 50 }).catch(() => null),
          businessTemplatesAPI.mySales({ per_page: 50 }).catch(() => null),
          businessTemplatesAPI.myTemplates({ per_page: 50 }).catch(() => null),
          imagesAPI.getMyImages({ per_page: 50, page: 1 }).catch(() => null),
        ]);

        setTemplatePurchases(extractListItems(purchasesRes));
        setTemplateSales(extractListItems(salesRes));
        setSalesSummary(salesRes?.summary || { orders: 0, revenue: 0 });
        setMyTemplates(extractListItems(templatesRes));

        const imgList = extractListItems(imagesRes);
        setMyImages(Array.isArray(imgList) ? imgList : []);
      }
    } catch (e) {
      setError(e?.message || 'Could not load sales & purchases');
    } finally {
      setLoading(false);
      setTick((n) => n + 1);
    }
  }, [isBuyerOnly]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (isBuyerOnly && subTab === 'sales') setSubTab('purchases');
  }, [isBuyerOnly, subTab]);

  useEffect(() => {
    const s = searchParams.get('sub');
    if (s === 'sales' || s === 'purchases') setSubTab(s);
  }, [searchParams]);

  const downloadTemplate = (purchase) => {
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

  const imageSalesHint = myImages.reduce(
    (sum, img) => sum + (Number(img.downloads_count) || 0),
    0
  );
  const templateSalesFromListings = myTemplates.reduce(
    (sum, t) => sum + (Number(t.sales_count) || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const kpiCards = isBuyerOnly
    ? [
        ['Templates bought', templatePurchases.length, FaFileAlt, 'bg-violet-600'],
        ['Software bought', softwarePurchases.length, FaCode, 'bg-blue-600'],
        ['Browse software', 'Shop →', FaShoppingBag, 'bg-teal-600'],
        ['Browse images', 'Shop →', FaImage, 'bg-amber-500'],
      ]
    : [
        ['Template sales', salesSummary.orders || templateSalesFromListings, FaStore, 'bg-emerald-500'],
        [
          'Seller revenue',
          `$${Number(salesSummary.revenue || 0).toFixed(0)}`,
          FaShoppingBag,
          'bg-teal-600',
        ],
        ['Software bought', softwarePurchases.length, FaCode, 'bg-blue-600'],
        ['Image downloads', imageSalesHint, FaImage, 'bg-amber-500'],
      ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 text-center sm:text-left">
            {isBuyerOnly ? 'My digital purchases' : 'Sales & Purchases'}
          </h2>
          <p className="text-sm text-gray-500 mt-1 text-center sm:text-left">
            {isBuyerOnly
              ? 'Downloads and digital goods you bought — templates, software, and more.'
              : 'See products you sold and digital goods you bought — templates, software, images.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
          <Link
            to="/software"
            className="text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
          >
            Software shop
          </Link>
          <Link
            to="/images"
            className="text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
          >
            Images shop
          </Link>
          {!isBuyerOnly ? (
            <Link
              to="/dashboard?tab=templates&mode=selling"
              className="text-xs font-semibold px-3 py-2 rounded-lg bg-violet-700 text-white"
            >
              Templates
            </Link>
          ) : (
            <Link
              to="/business/templates"
              className="text-xs font-semibold px-3 py-2 rounded-lg bg-violet-700 text-white"
            >
              Browse templates
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpiCards.map(([label, value, Icon, color]) => {
          const isShopLink = isBuyerOnly && (label === 'Browse software' || label === 'Browse images');
          const to = label === 'Browse software' ? '/software' : label === 'Browse images' ? '/images' : null;
          const card = (
            <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3 h-full">
              <div className={`p-2.5 rounded-full ${color} text-white`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-xl font-bold text-gray-900">{value}</p>
              </div>
            </div>
          );
          return isShopLink && to ? (
            <Link key={label} to={to} className="hover:opacity-90 transition-opacity">
              {card}
            </Link>
          ) : (
            <div key={label}>{card}</div>
          );
        })}
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {!isBuyerOnly && (
        <div className="flex gap-2 border-b border-gray-200">
          {[
            { id: 'purchases', label: 'My purchases' },
            { id: 'sales', label: 'My sales' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSubTab(t.id)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px ${
                subTab === t.id
                  ? 'border-blue-700 text-blue-800'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {(isBuyerOnly || subTab === 'purchases') && (
        <div className="space-y-6">
          <section className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <FaFileAlt className="text-violet-600" />
              <h3 className="text-sm font-bold text-gray-900">Templates purchased</h3>
            </div>
            {templatePurchases.length === 0 ? (
              <p className="p-6 text-sm text-gray-500 text-center">
                No template purchases yet.{' '}
                <Link to="/business/templates" className="text-blue-700 font-semibold hover:underline">
                  Browse templates
                </Link>
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {templatePurchases.map((p) => (
                  <li key={p.id} className="px-4 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{p.title}</p>
                      <p className="text-xs text-gray-500">
                        ${Number(p.price_paid || 0).toFixed(2)}
                        {p.created_at
                          ? ` · ${new Date(p.created_at).toLocaleDateString()}`
                          : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => downloadTemplate(p)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline"
                    >
                      <FaDownload /> Download
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <FaCode className="text-blue-600" />
              <h3 className="text-sm font-bold text-gray-900">Software purchased</h3>
            </div>
            {softwarePurchases.length === 0 ? (
              <p className="p-6 text-sm text-gray-500 text-center">
                No software purchases in this browser yet.{' '}
                <Link to="/software" className="text-blue-700 font-semibold hover:underline">
                  Browse software
                </Link>
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {softwarePurchases.map((p) => (
                  <li key={p.id} className="px-4 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{p.title}</p>
                      <p className="text-xs text-gray-500">
                        ${Number(p.amount || 0).toFixed(2)}
                        {p.paidAt ? ` · ${new Date(p.paidAt).toLocaleDateString()}` : ''}
                      </p>
                    </div>
                    {p.product?.downloadUrl && (
                      <button
                        type="button"
                        onClick={() => triggerSoftwareFileDownload(p.product)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline"
                      >
                        <FaDownload /> Download
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {!isBuyerOnly && subTab === 'sales' && (
        <div className="space-y-6">
          <section className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <FaStore className="text-emerald-600" />
              <h3 className="text-sm font-bold text-gray-900">Template orders (buyers)</h3>
            </div>
            {templateSales.length === 0 ? (
              <p className="p-6 text-sm text-gray-500 text-center">
                No sales yet. List templates from the Templates tab to start selling.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {templateSales.map((s) => (
                  <li key={s.id} className="px-4 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {s.title || s.template?.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        You earned ${Number(s.seller_amount || 0).toFixed(2)}
                        {s.created_at
                          ? ` · ${new Date(s.created_at).toLocaleDateString()}`
                          : ''}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700">Paid</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <FaImage className="text-amber-600" />
              <h3 className="text-sm font-bold text-gray-900">Your image listings</h3>
            </div>
            {myImages.length === 0 ? (
              <p className="p-6 text-sm text-gray-500 text-center">
                No image listings yet.{' '}
                <Link to="/images" className="text-blue-700 font-semibold hover:underline">
                  Post on Images &amp; Media
                </Link>
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {myImages.map((img) => (
                  <li
                    key={img.id || img.images_advert_id || img.slug}
                    className="px-4 py-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {img.title || img.name || 'Image'}
                      </p>
                      <p className="text-xs text-gray-500">
                        ${Number(img.standard_price || img.price || 0).toFixed(2)} ·{' '}
                        {Number(img.downloads_count || 0)} downloads
                      </p>
                    </div>
                    <Link
                      to={img.slug ? `/images/${img.slug}` : '/images'}
                      className="text-xs font-bold text-blue-700 hover:underline"
                    >
                      View
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <FaFileAlt className="text-violet-600" />
              <h3 className="text-sm font-bold text-gray-900">Your template listings</h3>
            </div>
            {myTemplates.length === 0 ? (
              <p className="p-6 text-sm text-gray-500 text-center">No templates listed for sale.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {myTemplates.map((t) => (
                  <li key={t.id} className="px-4 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{t.title}</p>
                      <p className="text-xs text-gray-500">
                        ${Number(t.price || 0).toFixed(2)} · {Number(t.sales_count || 0)} sales
                        {t.sales_revenue != null
                          ? ` · $${Number(t.sales_revenue).toFixed(2)} earned`
                          : ''}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-gray-600">{t.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default DigitalCommerceManagement;
