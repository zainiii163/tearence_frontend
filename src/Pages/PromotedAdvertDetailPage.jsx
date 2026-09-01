import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  FaArrowLeft,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaPhone,
  FaBullhorn,
  FaUser,
} from 'react-icons/fa';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import RelatedListingsSection from '../Component/shared/RelatedListingsSection';
import { promotedAdvertsAPI } from '../services/promotedAdvertsAPI';
import { resolveStorageUrl } from '../utils/dashboardEditMappers';
import { sanitizeHtml } from '../utils/sanitizeHtml';
import ChatButton from '../Component/Chat/ChatButton';
import {
  buildListingChatContext,
  resolveSellerId,
  resolveSellerName,
} from '../utils/chatHelpers';

const formatPrice = (price, currency = 'GBP') => {
  if (price == null || price === '') return 'POA';
  const n = Number(String(price).replace(/,/g, ''));
  if (Number.isNaN(n)) return `${currency} ${price}`;
  return `${currency} ${n.toLocaleString()}`;
};

const PromotedAdvertDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [advert, setAdvert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!slug) return;
      setLoading(true);
      setError('');
      try {
        const res = await promotedAdvertsAPI.getAdvert(slug);
        const data = res?.data || res;
        if (!cancelled) {
          if (data?.title || data?.id || data?.promoted_advert_id) {
            setAdvert(data);
            const id = data.promoted_advert_id || data.id;
            if (id && promotedAdvertsAPI.trackView) {
              promotedAdvertsAPI.trackView(id).catch(() => {});
            }
          } else {
            setError('Listing not found');
          }
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load listing');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const imageUrl = useMemo(() => {
    if (!advert) return null;
    return (
      resolveStorageUrl(advert.main_image || advert.image || advert.thumbnail) ||
      advert.main_image ||
      advert.image ||
      null
    );
  }, [advert]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton backHref="/promoted-adverts" />
        <div className="flex items-center justify-center py-24">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-r-transparent" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !advert) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton backHref="/promoted-adverts" />
        <div className="page-container py-16 text-center">
          <p className="text-lg text-red-600 mb-4">{error || 'Listing not found'}</p>
          <button
            type="button"
            onClick={() => navigate('/promoted-adverts')}
            className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
          >
            Back to Promoted Ads
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar showBackButton backHref="/promoted-adverts" />

      <div className="page-container py-6 sm:py-8">
        <button
          type="button"
          onClick={() => navigate('/promoted-adverts')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:text-red-900 mb-6"
        >
          <FaArrowLeft />
          Back to Promoted Ads
        </button>

        <article className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative min-h-[240px] bg-gradient-to-br from-slate-800 to-red-700">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={advert.title}
                  className="w-full h-full min-h-[240px] max-h-[420px] object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full min-h-[240px]">
                  <FaBullhorn className="h-16 w-16 text-white/50" />
                </div>
              )}
              <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-black/70 text-white rounded">
                Promoted
              </span>
            </div>

            <div className="p-6 sm:p-8 flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-700 mb-2">
                {advert.category_name || advert.tagline || advert.business_name || 'Promoted listing'}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {advert.title}
              </h1>
              <p className="mt-3 text-2xl font-bold text-gray-900">
                {formatPrice(advert.price, advert.currency || 'GBP')}
              </p>
              {(advert.city || advert.country) && (
                <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <FaMapMarkerAlt className="text-red-600 shrink-0" />
                  {[advert.city, advert.country].filter(Boolean).join(', ')}
                </p>
              )}
              {advert.description && (
                <div
                  className="mt-4 text-sm sm:text-base text-gray-700 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(advert.description) }}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8 border-t border-gray-100">
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaEnvelope className="text-red-600" />
                Contact advertiser
              </h2>
              <div className="space-y-3">
                {resolveSellerId(advert) && (
                  <ChatButton
                    sellerId={resolveSellerId(advert)}
                    sellerName={resolveSellerName(advert, advert.seller_name || 'Advertiser')}
                    listing={buildListingChatContext(advert, 'Promoted')}
                    label="Live Chat with Advertiser"
                    className="w-full h-11 px-4 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl"
                    variant="custom"
                  />
                )}
                {advert.seller_name && (
                  <div className="flex gap-3 p-3 rounded-xl bg-gray-50">
                    <FaUser className="text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Advertiser</p>
                      <p className="font-semibold text-gray-900">{advert.seller_name}</p>
                    </div>
                  </div>
                )}
                {(advert.phone || advert.contact_phone) && (
                  <a
                    href={`tel:${advert.phone || advert.contact_phone}`}
                    className="flex gap-3 p-3 rounded-xl bg-gray-50 hover:bg-red-50"
                  >
                    <FaPhone className="text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-semibold text-gray-900">
                        {advert.phone || advert.contact_phone}
                      </p>
                    </div>
                  </a>
                )}
                {(advert.email || advert.contact_email) && (
                  <a
                    href={`mailto:${advert.email || advert.contact_email}?subject=${encodeURIComponent(
                      'Enquiry: ' + advert.title
                    )}`}
                    className="flex gap-3 p-3 rounded-xl bg-gray-50 hover:bg-red-50"
                  >
                    <FaEnvelope className="text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-semibold text-gray-900">
                        {advert.email || advert.contact_email}
                      </p>
                    </div>
                  </a>
                )}
                {(advert.website || advert.destination_url) && (
                  <a
                    href={advert.website || advert.destination_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-3 p-3 rounded-xl bg-gray-50 hover:bg-red-50"
                  >
                    <FaGlobe className="text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Website</p>
                      <p className="font-semibold text-red-700">
                        {advert.website || advert.destination_url}
                      </p>
                    </div>
                  </a>
                )}
              </div>
            </section>

            <section className="flex flex-col justify-between gap-4">
              <div className="rounded-xl border border-red-100 bg-red-50/60 p-4">
                <p className="text-sm font-semibold text-gray-900 mb-1">Interested?</p>
                <p className="text-sm text-gray-600">
                  Contact the advertiser by phone, email, or live chat to learn more.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {(advert.email || advert.contact_email) && (
                  <a
                    href={`mailto:${advert.email || advert.contact_email}?subject=${encodeURIComponent(
                      'Enquiry: ' + advert.title
                    )}`}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700"
                  >
                    Email advertiser
                  </a>
                )}
                <Link
                  to="/promoted-adverts"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:text-gray-900"
                >
                  Browse more
                </Link>
              </div>
            </section>
          </div>
        </article>

        <RelatedListingsSection
          source="promoted"
          currentId={advert?.id || slug}
          categoryKey={advert?.category_slug || advert?.category || ''}
          categoryName={advert?.category_name || advert?.category || ''}
          title="Suggested promoted ads"
          subtitle="Related listings"
        />
      </div>

      <Footer />
    </div>
  );
};

export default PromotedAdvertDetailPage;
