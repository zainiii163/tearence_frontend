import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  FaArrowLeft,
  FaBriefcase,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
} from 'react-icons/fa';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import RelatedListingsSection from '../Component/shared/RelatedListingsSection';
import sponsoredAdvertsAPI from '../api/sponsoredAdvertsAPI';
import { resolveStorageUrl } from '../utils/dashboardEditMappers';
import ChatButton from '../Component/Chat/ChatButton';
import {
  buildListingChatContext,
  resolveSellerId,
  resolveSellerName,
} from '../utils/chatHelpers';
import ReportAdvertButton from '../Component/Reporting/ReportAdvertButton';

const formatPrice = (price, currency = 'GBP') => {
  if (price == null || price === '') return 'POA';
  const n = Number(String(price).replace(/,/g, ''));
  if (Number.isNaN(n)) return `${currency} ${price}`;
  return `${currency} ${n.toLocaleString()}`;
};

const SponsoredAdvertDetailPage = () => {
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
        const res = await sponsoredAdvertsAPI.getSponsoredAdvert(slug);
        const data = res?.data || res;
        if (!cancelled) {
          if (data?.title || data?.sponsored_advert_id || data?.id) {
            setAdvert(data);
            const id = data.sponsored_advert_id || data.id;
            if (id) {
              sponsoredAdvertsAPI.trackView?.(id).catch(() => {});
            }
          } else {
            setError('Listing not found');
          }
        }
      } catch (e) {
        if (!cancelled) setError(e?.response?.data?.message || 'Failed to load listing');
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
    return resolveStorageUrl(advert.main_image || advert.image) || advert.main_image || advert.image || null;
  }, [advert]);

  const backHref =
    advert?.advert_type === 'business' ? '/businesses-for-sale' : '/sponsored-adverts';
  const backLabel =
    advert?.advert_type === 'business' ? 'Back to Businesses for Sale' : 'Back to Sponsored Adverts';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton backHref="/businesses-for-sale" />
        <div className="flex items-center justify-center py-24">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-600 border-r-transparent" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !advert) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton backHref="/businesses-for-sale" />
        <div className="page-container py-16 text-center">
          <p className="text-lg text-red-600 mb-4">{error || 'Listing not found'}</p>
          <button
            type="button"
            onClick={() => navigate('/businesses-for-sale')}
            className="px-5 py-2.5 rounded-lg bg-orange-600 text-white font-semibold hover:bg-orange-700"
          >
            Back to Businesses for Sale
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar showBackButton backHref={backHref} />

      <div className="page-container py-6 sm:py-8">
        <button
          type="button"
          onClick={() => navigate(backHref)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-900 mb-6"
        >
          <FaArrowLeft />
          {backLabel}
        </button>

        <article className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative min-h-[240px] bg-gradient-to-br from-slate-800 to-orange-700">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={advert.title}
                  className="w-full h-full min-h-[240px] max-h-[420px] object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full min-h-[240px]">
                  <FaBriefcase className="h-16 w-16 text-white/50" />
                </div>
              )}
              <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-black/70 text-white rounded">
                {advert.advert_type === 'business' ? 'For sale' : 'Sponsored'}
              </span>
            </div>

            <div className="p-6 sm:p-8 flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-700 mb-2">
                {advert.tagline || advert.business_name || 'Listing'}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {advert.title}
              </h1>
              <p className="mt-3 text-2xl font-bold text-gray-900">
                {formatPrice(advert.price, advert.currency || 'GBP')}
              </p>
              {(advert.city || advert.country) && (
                <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <FaMapMarkerAlt className="text-orange-600 shrink-0" />
                  {[advert.city, advert.country].filter(Boolean).join(', ')}
                </p>
              )}
              {advert.description && (
                <p className="mt-4 text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {advert.description}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8 border-t border-gray-100">
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaEnvelope className="text-orange-600" />
                Contact seller
              </h2>
              <div className="space-y-3">
                {resolveSellerId(advert) && (
                  <ChatButton
                    sellerId={resolveSellerId(advert)}
                    sellerName={resolveSellerName(advert, advert.seller_name || 'Seller')}
                    listing={buildListingChatContext(advert, 'Sponsored')}
                    label="Live Chat with Seller"
                    className="w-full h-11 px-4 text-sm font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-xl"
                    variant="custom"
                  />
                )}
                <ReportAdvertButton
                  advertId={advert.id || id}
                  advertSlug={advert.slug}
                  advertType="sponsored"
                />
                {advert.seller_name && (
                  <div className="flex gap-3 p-3 rounded-xl bg-gray-50">
                    <FaUser className="text-orange-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Seller</p>
                      <p className="font-semibold text-gray-900">{advert.seller_name}</p>
                    </div>
                  </div>
                )}
                {advert.business_name && (
                  <div className="flex gap-3 p-3 rounded-xl bg-gray-50">
                    <FaBriefcase className="text-orange-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Business</p>
                      <p className="font-semibold text-gray-900">{advert.business_name}</p>
                    </div>
                  </div>
                )}
                {advert.phone && (
                  <a
                    href={`tel:${advert.phone}`}
                    className="flex gap-3 p-3 rounded-xl bg-gray-50 hover:bg-orange-50"
                  >
                    <FaPhone className="text-orange-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-semibold text-gray-900">{advert.phone}</p>
                    </div>
                  </a>
                )}
                {advert.email && (
                  <a
                    href={`mailto:${advert.email}?subject=${encodeURIComponent('Enquiry: ' + advert.title)}`}
                    className="flex gap-3 p-3 rounded-xl bg-gray-50 hover:bg-orange-50"
                  >
                    <FaEnvelope className="text-orange-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-semibold text-gray-900">{advert.email}</p>
                    </div>
                  </a>
                )}
                {advert.website && (
                  <a
                    href={advert.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-3 p-3 rounded-xl bg-gray-50 hover:bg-orange-50"
                  >
                    <FaGlobe className="text-orange-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Website</p>
                      <p className="font-semibold text-orange-700">{advert.website}</p>
                    </div>
                  </a>
                )}
              </div>
            </section>

            <section className="flex flex-col justify-between gap-4">
              <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-4">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {advert.advert_type === 'business' ? 'Interested in buying?' : 'Interested in this listing?'}
                </p>
                <p className="text-sm text-gray-600">
                  {advert.advert_type === 'business'
                    ? 'Enquire with the seller for accounts, NDA, viewing, or an offer. This is not an instant checkout — sales are arranged directly.'
                    : 'Contact the seller by phone or email to request accounts, ask questions, or arrange a viewing.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {advert.email && (
                  <a
                    href={`mailto:${advert.email}?subject=${encodeURIComponent(
                      (advert.advert_type === 'business' ? 'Business enquiry: ' : 'Enquiry: ') + advert.title
                    )}`}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-orange-600 text-white text-sm font-bold hover:bg-orange-700"
                  >
                    {advert.advert_type === 'business' ? 'Enquire by email' : 'Email seller'}
                  </a>
                )}
                {advert.phone && (
                  <a
                    href={`tel:${advert.phone}`}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-800 hover:bg-gray-50"
                  >
                    {advert.advert_type === 'business' ? 'Call to enquire' : 'Call seller'}
                  </a>
                )}
                <Link
                  to={backHref}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:text-gray-900"
                >
                  Browse more
                </Link>
              </div>
            </section>
          </div>
        </article>

        <RelatedListingsSection
          source="sponsored"
          currentId={advert?.id || slug}
          categoryKey={advert?.category_slug || advert?.category || ''}
          categoryName={advert?.category_name || advert?.category || ''}
          title="Suggested sponsored ads"
          subtitle="Related listings"
        />
      </div>

      <Footer />
    </div>
  );
};

export default SponsoredAdvertDetailPage;
