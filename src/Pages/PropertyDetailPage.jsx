import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiMapPin,
  FiHome,
  FiShare2,
  FiPhone,
  FiMail,
  FiGlobe,
  FiCheckCircle,
} from 'react-icons/fi';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import propertyApi from '../services/propertyApi';
import {
  collectPropertyImageUrls,
  getPropertyFallbackImage,
} from '../utils/propertyImage';
import '../styles/property.css';

const stripHtml = (html) => {
  if (!html) return '';
  return String(html).replace(/<[^>]*>/g, '').trim();
};

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [broken, setBroken] = useState({});

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      setBroken({});
      setActiveImage(0);
      try {
        const res = await propertyApi.getProperty(id);
        const data = res?.data?.data || res?.data || res;
        if (!data?.id && !data?.title) {
          throw new Error('Property not found');
        }
        if (!cancelled) setProperty(data);
      } catch (err) {
        console.error('Error loading property:', err);
        if (!cancelled) {
          setError('Property not found');
          setProperty(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (id) load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const images = (() => {
    if (!property) return [];
    const list = collectPropertyImageUrls(property).filter((url) => !broken[url]);
    if (!list.length) return [getPropertyFallbackImage(property)];
    return list;
  })();

  const markBroken = (url) => {
    setBroken((prev) => ({ ...prev, [url]: true }));
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: property?.title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      /* ignore */
    }
  };

  if (loading) {
    return (
      <div className="property-marketplace min-h-screen">
        <UnifiedNavbar showBackButton backHref="/property" />
        <div className="flex justify-center py-24">
          <div className="h-10 w-10 border-2 border-[var(--prop-copper)] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="property-marketplace min-h-screen">
        <UnifiedNavbar showBackButton backHref="/property" />
        <div className="page-container py-20 text-center">
          <FiHome className="mx-auto h-10 w-10 text-[var(--prop-copper)] mb-4" />
          <h1 className="prop-display text-3xl text-[var(--prop-ink)] mb-2">Property not found</h1>
          <p className="text-sm text-[var(--prop-ink)]/60 mb-6">
            This listing may have been removed or the link is incorrect.
          </p>
          <Link
            to="/property"
            className="inline-flex px-5 py-2.5 text-sm font-semibold bg-[var(--prop-ink)] text-white hover:bg-[var(--prop-ink-soft)]"
          >
            Back to Property
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const price =
    property.formatted_price ||
    (property.price != null
      ? `$${Number(property.price).toLocaleString()}`
      : null);
  const location =
    property.full_address ||
    [property.city, property.country].filter(Boolean).join(', ');
  const description = stripHtml(property.description || property.overview || '');

  return (
    <div className="property-marketplace min-h-screen">
      <UnifiedNavbar showBackButton backHref="/property" />

      <div className="page-container py-6 sm:py-8">
        <nav className="mb-5 text-xs text-[var(--prop-ink)]/50">
          <Link to="/property" className="hover:text-[var(--prop-copper-deep)]">
            Property
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--prop-ink)]">{property.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-8">
          <div>
            <div className="relative aspect-[16/10] bg-[var(--prop-ink)] overflow-hidden border border-[var(--prop-ink)]/10">
              {images[activeImage] ? (
                <img
                  src={images[activeImage]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  onError={() => {
                    markBroken(images[activeImage]);
                    setActiveImage(0);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiHome className="h-14 w-14 text-white/30" />
                </div>
              )}
              {(property.is_featured || property.is_promoted || property.is_sponsored) && (
                <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[var(--prop-ink)] text-[var(--prop-copper)]">
                  {property.is_featured
                    ? 'Featured'
                    : property.is_sponsored
                      ? 'Sponsored'
                      : 'Promoted'}
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {images.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`shrink-0 w-16 h-16 overflow-hidden border-2 ${
                      i === activeImage
                        ? 'border-[var(--prop-copper)]'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={() => markBroken(src)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="prop-label text-[var(--prop-copper)] mb-2">
              {property.property_type_label || property.property_type || property.category || 'Property'}
            </p>
            <h1 className="prop-display text-3xl sm:text-4xl text-[var(--prop-ink)] leading-tight">
              {property.title}
            </h1>
            {property.tagline && (
              <p className="mt-2 text-sm text-[var(--prop-ink)]/60">{property.tagline}</p>
            )}

            {price && (
              <p className="mt-4 text-2xl font-semibold text-[var(--prop-ink)] tracking-tight">
                {price}
                {property.negotiable ? (
                  <span className="ml-2 text-xs font-medium text-[var(--prop-ink)]/45">Negotiable</span>
                ) : null}
              </p>
            )}

            {location && (
              <p className="mt-3 flex items-start gap-1.5 text-sm text-[var(--prop-ink)]/65">
                <FiMapPin className="h-4 w-4 mt-0.5 shrink-0 text-[var(--prop-copper)]" />
                {location}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--prop-ink)]/55">
              {property.bedrooms != null && <span>{property.bedrooms} bed</span>}
              {property.bathrooms != null && <span>{property.bathrooms} bath</span>}
              {property.formatted_size && <span>{property.formatted_size}</span>}
              {property.parking_spaces != null && <span>{property.parking_spaces} parking</span>}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border border-[var(--prop-ink)]/20 text-[var(--prop-ink)] hover:border-[var(--prop-copper)]"
              >
                <FiShare2 className="h-4 w-4" />
                Share
              </button>
              <button
                type="button"
                onClick={() => navigate('/property')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold bg-[var(--prop-ink)] text-white hover:bg-[var(--prop-ink-soft)]"
              >
                Browse more
              </button>
            </div>

            {(property.seller_name || property.seller_email || property.seller_phone) && (
              <div className="mt-8 border border-[var(--prop-ink)]/10 bg-white/70 p-4">
                <p className="prop-label text-[var(--prop-copper)] mb-2">Listed by</p>
                <div className="flex items-center gap-3">
                  {property.seller_logo ? (
                    <img
                      src={property.seller_logo}
                      alt=""
                      className="h-12 w-12 object-cover border border-[var(--prop-ink)]/10"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="h-12 w-12 bg-[var(--prop-stone-deep)] flex items-center justify-center">
                      <FiHome className="h-5 w-5 text-[var(--prop-ink)]/40" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-[var(--prop-ink)]">
                      {property.seller_name || 'Property seller'}
                      {property.verified_agent && (
                        <FiCheckCircle className="inline ml-1.5 h-3.5 w-3.5 text-[var(--prop-copper)]" />
                      )}
                    </p>
                    {property.seller_company && (
                      <p className="text-xs text-[var(--prop-ink)]/50">{property.seller_company}</p>
                    )}
                  </div>
                </div>
                <div className="mt-3 space-y-1.5 text-sm text-[var(--prop-ink)]/70">
                  {property.seller_phone && (
                    <a href={`tel:${property.seller_phone}`} className="flex items-center gap-2 hover:text-[var(--prop-copper-deep)]">
                      <FiPhone className="h-3.5 w-3.5" />
                      {property.seller_phone}
                    </a>
                  )}
                  {property.seller_email && (
                    <a href={`mailto:${property.seller_email}`} className="flex items-center gap-2 hover:text-[var(--prop-copper-deep)]">
                      <FiMail className="h-3.5 w-3.5" />
                      {property.seller_email}
                    </a>
                  )}
                  {property.seller_website && (
                    <a
                      href={property.seller_website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 hover:text-[var(--prop-copper-deep)]"
                    >
                      <FiGlobe className="h-3.5 w-3.5" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {description && (
          <section className="mt-10 border-t border-[var(--prop-ink)]/10 pt-8">
            <p className="prop-label text-[var(--prop-copper)] mb-2">About this property</p>
            <h2 className="prop-display text-2xl text-[var(--prop-ink)] mb-3">Description</h2>
            <p className="text-sm sm:text-base text-[var(--prop-ink)]/75 leading-relaxed whitespace-pre-line max-w-3xl">
              {description}
            </p>
          </section>
        )}

        {Array.isArray(property.amenities) && property.amenities.length > 0 && (
          <section className="mt-8">
            <h2 className="prop-display text-xl text-[var(--prop-ink)] mb-3">Amenities</h2>
            <ul className="flex flex-wrap gap-2">
              {property.amenities.map((item) => (
                <li
                  key={item}
                  className="px-3 py-1.5 text-xs font-medium border border-[var(--prop-ink)]/12 bg-white/70 text-[var(--prop-ink)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PropertyDetailPage;
