import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  FaArrowLeft,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaPhone,
  FaStar,
} from 'react-icons/fa';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import RelatedListingsSection from '../Component/shared/RelatedListingsSection';
import { featuredAdvertsAPI } from '../api/featuredAdverts';
import { resolveStorageUrl } from '../utils/dashboardEditMappers';
import ChatButton from '../Component/Chat/ChatButton';
import {
  buildListingChatContext,
  resolveSellerId,
  resolveSellerName,
} from '../utils/chatHelpers';

const FeaturedAdvertDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [advert, setAdvert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError('');

      // Cross-feed composite ids (e.g. services-12) → real hub detail
      const composite = String(id).match(/^services[_-](.+)$/i);
      if (composite) {
        navigate(`/services/${composite[1]}`, { replace: true });
        return;
      }

      try {
        const res = await featuredAdvertsAPI.getFeaturedAdvert(id);
        const data = res?.data || res;
        if (!cancelled) {
          if (data?.title || data?.id) {
            setAdvert(data);
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
  }, [id, navigate]);

  const imageUrl = useMemo(() => {
    if (!advert) return null;
    return (
      resolveStorageUrl(
        advert.main_image || advert.image || advert.thumbnail || advert.banner_image
      ) ||
      advert.main_image ||
      advert.image ||
      null
    );
  }, [advert]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton backHref="/featured-adverts" />
        <div className="flex items-center justify-center py-24">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-r-transparent" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !advert) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton backHref="/featured-adverts" />
        <div className="page-container py-16 text-center">
          <p className="text-lg text-red-600 mb-4">{error || 'Listing not found'}</p>
          <button
            type="button"
            onClick={() => navigate('/featured-adverts')}
            className="px-5 py-2.5 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600"
          >
            Back to Featured Ads
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const sellerId = resolveSellerId(advert);
  const sellerName = resolveSellerName(advert) || advert.business_name || 'Seller';

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar showBackButton backHref="/featured-adverts" />
      <div className="page-container py-6 sm:py-10">
        <Link
          to="/featured-adverts"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-6"
        >
          <FaArrowLeft className="h-3.5 w-3.5" />
          Featured Ads
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-slate-100 min-h-[240px] lg:min-h-[420px]">
            {imageUrl ? (
              <img src={imageUrl} alt={advert.title} className="w-full h-full object-cover" />
            ) : (
              <div className="flex h-full min-h-[240px] items-center justify-center text-gray-400">
                <FaStar className="h-12 w-12" />
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
              {advert.category_name || advert.source_label || 'Featured'}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{advert.title}</h1>
            <p className="text-gray-600 leading-relaxed">
              {advert.description || advert.short_description || 'No description provided.'}
            </p>

            {(advert.city || advert.country) && (
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <FaMapMarkerAlt className="text-amber-500" />
                {[advert.city, advert.country].filter(Boolean).join(', ')}
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              {sellerId && (
                <ChatButton
                  sellerId={sellerId}
                  sellerName={sellerName}
                  context={buildListingChatContext(advert, 'featured')}
                />
              )}
              {advert.phone && (
                <a
                  href={`tel:${advert.phone}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-800 text-sm font-semibold"
                >
                  <FaPhone /> Call
                </a>
              )}
              {advert.email && (
                <a
                  href={`mailto:${advert.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-800 text-sm font-semibold"
                >
                  <FaEnvelope /> Email
                </a>
              )}
              {advert.website_url && (
                <a
                  href={advert.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-semibold"
                >
                  <FaGlobe /> Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="page-container pb-10">
        <RelatedListingsSection
          source="featured"
          currentId={advert?.id || id}
          categoryKey={advert?.category_slug || advert?.category || ''}
          categoryName={advert?.category_name || advert?.category || ''}
          title="Suggested featured ads"
          subtitle="Related listings"
        />
      </div>
      <Footer />
    </div>
  );
};

export default FeaturedAdvertDetailPage;
