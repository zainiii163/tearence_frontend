import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FiMapPin,
  FiHome,
  FiShare2,
  FiPhone,
  FiMail,
  FiGlobe,
  FiCheckCircle,
  FiHeart,
  FiMessageSquare,
  FiX,
  FiEye,
  FiDollarSign,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import propertyApi from '../services/propertyApi';
import {
  collectPropertyImageUrls,
  getPropertyFallbackImage,
} from '../utils/propertyImage';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import ChatButton from '../Component/Chat/ChatButton';
import RelatedListingsSection from '../Component/shared/RelatedListingsSection';
import ReviewsPanel from '../Component/shared/ReviewsPanel';
import ReportAdvertButton from '../Component/Reporting/ReportAdvertButton';
import {
  buildListingChatContext,
  resolveSellerId,
  resolveSellerName,
} from '../utils/chatHelpers';
import '../styles/property.css';

const stripHtml = (html) => {
  if (!html) return '';
  return String(html).replace(/<[^>]*>/g, '').trim();
};

const emptyContactForm = () => ({
  mode: 'enquiry', // enquiry | offer
  buyer_name: '',
  buyer_email: '',
  buyer_phone: '',
  contact_method: 'email',
  offer_amount: '',
  message: '',
});

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requireAuth } = useAuthRedirect();
  const { userDetail, logIn } = useSelector((store) => store.auth || {});
  const user = userDetail?.data || userDetail || {};

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [broken, setBroken] = useState({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [contactForm, setContactForm] = useState(emptyContactForm);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [revealedContact, setRevealedContact] = useState(null);
  const [revealing, setRevealing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      setBroken({});
      setActiveImage(0);
      setRevealedContact(null);
      try {
        const res = await propertyApi.getProperty(id);
        const data = res?.data?.data || res?.data || res;
        if (!data?.id && !data?.title) {
          throw new Error('Property not found');
        }
        if (!cancelled) {
          setProperty(data);
          setSaved(Boolean(data.is_saved || data.saved));
        }
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
        toast.success('Link copied');
      }
      propertyApi.trackPropertyEvent(id, 'share').catch(() => {});
    } catch {
      /* ignore */
    }
  };

  const handleSave = async () => {
    if (!requireAuth(undefined, 'Sign in to save this property.')) return;
    setSaving(true);
    try {
      const res = await propertyApi.toggleSaveProperty(id);
      const next =
        res?.data?.saved ??
        res?.saved ??
        res?.data?.is_saved ??
        !saved;
      setSaved(Boolean(next));
      toast.success(next ? 'Property saved' : 'Removed from saved');
    } catch (err) {
      toast.error(err?.message || 'Could not update saved status');
    } finally {
      setSaving(false);
    }
  };

  const handleRevealContact = async () => {
    setRevealing(true);
    try {
      const res = await propertyApi.contactAgent(id);
      const info = res?.data?.contact_info || res?.contact_info || res?.data || {};
      setRevealedContact(info);
      propertyApi.trackPropertyEvent(id, 'phone_click').catch(() => {});
      toast.success('Contact details revealed');
    } catch (err) {
      toast.error(err?.message || 'Could not load contact details');
    } finally {
      setRevealing(false);
    }
  };

  const handleOpenEnquiry = () => {
    setContactForm({
      ...emptyContactForm(),
      mode: 'enquiry',
      buyer_name: user?.name || user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
      buyer_email: user?.email || '',
      buyer_phone: user?.phone || user?.phone_number || '',
      contact_method: 'email',
      message: '',
    });
    setShowContact(true);
  };

  const handleOpenOffer = () => {
    setContactForm({
      ...emptyContactForm(),
      mode: 'offer',
      buyer_name: user?.name || user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
      buyer_email: user?.email || '',
      buyer_phone: user?.phone || user?.phone_number || '',
      contact_method: 'email',
      offer_amount: property?.price != null ? String(property.price) : '',
      message: 'I would like to make an offer on this property. Please let me know if this works for you.',
    });
    setShowContact(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const isOffer = contactForm.mode === 'offer';
    const offerAmount = Number(contactForm.offer_amount);
    const payload = {
      buyer_name: (contactForm.buyer_name || '').trim(),
      buyer_email: (contactForm.buyer_email || '').trim(),
      buyer_phone: (contactForm.buyer_phone || '').trim() || null,
      contact_method: contactForm.contact_method || 'email',
      message: (contactForm.message || '').trim(),
      type: isOffer ? 'offer' : 'general',
    };

    if (!payload.buyer_name) {
      toast.error('Please enter your name');
      return;
    }
    if (!payload.buyer_email) {
      toast.error('Please enter your email');
      return;
    }
    if (isOffer) {
      if (!Number.isFinite(offerAmount) || offerAmount <= 0) {
        toast.error('Please enter a valid offer amount');
        return;
      }
      payload.offer_amount = offerAmount;
    }
    if (payload.message.length < 10) {
      toast.error('Message must be at least 10 characters');
      return;
    }

    setSendingMessage(true);
    try {
      await propertyApi.contactSeller(id, payload);
      toast.success(isOffer ? 'Offer sent to seller' : 'Message sent to seller');
      setShowContact(false);
      setContactForm(emptyContactForm());
    } catch (err) {
      const errors = err?.errors || err?.response?.data?.errors;
      if (errors && typeof errors === 'object') {
        Object.values(errors).flat().forEach((msg) => toast.error(String(msg)));
      } else {
        toast.error(err?.message || 'Failed to send message');
      }
    } finally {
      setSendingMessage(false);
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

  const displayPhone =
    revealedContact?.seller_phone ||
    revealedContact?.agent_phone ||
    property.seller_phone;
  const displayEmail =
    revealedContact?.seller_email ||
    revealedContact?.agent_email ||
    property.seller_email;

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
              <ChatButton
                sellerId={resolveSellerId(property)}
                sellerName={resolveSellerName(
                  property,
                  revealedContact?.agent_name || property.seller_name || 'Agent'
                )}
                listing={buildListingChatContext(property, 'Property')}
                label="Live Chat"
                className="inline-flex h-auto px-4 py-2.5 text-sm font-semibold bg-[var(--prop-copper)] hover:bg-[var(--prop-copper-deep)] text-white"
                variant="custom"
              />
              <button
                type="button"
                onClick={handleOpenEnquiry}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border border-[var(--prop-ink)]/20 text-[var(--prop-ink)] hover:border-[var(--prop-copper)]"
              >
                <FiMessageSquare className="h-4 w-4" />
                Enquiry form
              </button>
              <button
                type="button"
                onClick={handleOpenOffer}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border border-[var(--prop-copper)] text-[var(--prop-copper-deep)] hover:bg-[var(--prop-copper)]/10"
              >
                <FiDollarSign className="h-4 w-4" />
                Make an offer
              </button>
              <button
                type="button"
                onClick={handleRevealContact}
                disabled={revealing}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border border-[var(--prop-ink)]/20 text-[var(--prop-ink)] hover:border-[var(--prop-copper)]"
              >
                <FiEye className="h-4 w-4" />
                {revealing ? 'Loading…' : 'Reveal contact'}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border ${
                  saved
                    ? 'border-[var(--prop-copper)] text-[var(--prop-copper-deep)] bg-[var(--prop-copper)]/10'
                    : 'border-[var(--prop-ink)]/20 text-[var(--prop-ink)] hover:border-[var(--prop-copper)]'
                }`}
              >
                <FiHeart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
                {saved ? 'Saved' : 'Save'}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border border-[var(--prop-ink)]/20 text-[var(--prop-ink)] hover:border-[var(--prop-copper)]"
              >
                <FiShare2 className="h-4 w-4" />
                Share
              </button>
              <ReportAdvertButton
                advertId={property?.id || id}
                advertSlug={property?.slug}
                advertType="property"
              />
              <button
                type="button"
                onClick={() => navigate('/property')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold bg-[var(--prop-ink)] text-white hover:bg-[var(--prop-ink-soft)]"
              >
                Browse more
              </button>
            </div>

            {(revealedContact || property.seller_name || displayPhone || displayEmail) && (
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
                      {revealedContact?.agent_name || property.seller_name || 'Property seller'}
                      {property.verified_agent && (
                        <FiCheckCircle className="inline ml-1.5 h-3.5 w-3.5 text-[var(--prop-copper)]" />
                      )}
                    </p>
                    {(revealedContact?.agency_name || property.seller_company) && (
                      <p className="text-xs text-[var(--prop-ink)]/50">
                        {revealedContact?.agency_name || property.seller_company}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-3 space-y-1.5 text-sm text-[var(--prop-ink)]/70">
                  {displayPhone && (
                    <a href={`tel:${displayPhone}`} className="flex items-center gap-2 hover:text-[var(--prop-copper-deep)]">
                      <FiPhone className="h-3.5 w-3.5" />
                      {displayPhone}
                    </a>
                  )}
                  {displayEmail && (
                    <a href={`mailto:${displayEmail}`} className="flex items-center gap-2 hover:text-[var(--prop-copper-deep)]">
                      <FiMail className="h-3.5 w-3.5" />
                      {displayEmail}
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
                  {!revealedContact && !displayPhone && !displayEmail && (
                    <p className="text-xs text-[var(--prop-ink)]/50">
                      Use Reveal contact or send an enquiry to reach the seller.
                    </p>
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

        <section className="mt-10 border-t border-[var(--prop-ink)]/10 pt-8 space-y-8">
          <ReviewsPanel
            type="property"
            targetId={property?.id || id}
            title="Property ratings & reviews"
            initialAverage={Number(property?.rating) || 0}
            initialCount={Number(property?.reviews_count || property?.review_count) || 0}
          />
          <RelatedListingsSection
            source="property"
            currentId={property?.id || id}
            categoryKey={property?.category_slug || property?.property_type || property?.category || ''}
            categoryName={property?.category_name || property?.property_type || property?.category || ''}
            title="Suggested properties"
            subtitle="Related listings"
            className="mt-0"
          />
        </section>
      </div>

      {showContact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => !sendingMessage && setShowContact(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                {contactForm.mode === 'offer' ? 'Make an offer' : 'Contact seller'}
              </h3>
              <button
                type="button"
                onClick={() => setShowContact(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSendMessage} className="p-4 space-y-3 overflow-y-auto">
              {contactForm.mode === 'offer' && (
                <p className="text-xs text-gray-500">
                  This sends your offer to the seller. No payment is taken on the platform.
                </p>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
                <input
                  type="text"
                  required
                  value={contactForm.buyer_name}
                  onChange={(e) => setContactForm((p) => ({ ...p, buyer_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={contactForm.buyer_email}
                  onChange={(e) => setContactForm((p) => ({ ...p, buyer_email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                <input
                  type="tel"
                  value={contactForm.buyer_phone}
                  onChange={(e) => setContactForm((p) => ({ ...p, buyer_phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              {contactForm.mode === 'offer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your offer ({property?.currency || 'USD'})
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={contactForm.offer_amount}
                    onChange={(e) => setContactForm((p) => ({ ...p, offer_amount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder={property?.price != null ? String(property.price) : 'Amount'}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred contact</label>
                <select
                  value={contactForm.contact_method}
                  onChange={(e) => setContactForm((p) => ({ ...p, contact_method: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  minLength={10}
                  value={contactForm.message}
                  onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
                  placeholder={
                    contactForm.mode === 'offer'
                      ? 'Add any conditions, viewing request, or notes…'
                      : 'Ask about viewing times, price, or details…'
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              {!logIn && (
                <p className="text-xs text-gray-500">
                  You can send without an account. Sign in to save properties and use live chat.
                </p>
              )}
              <button
                type="submit"
                disabled={sendingMessage}
                className="w-full py-2.5 rounded-lg font-semibold text-white bg-[var(--prop-ink)] hover:bg-[var(--prop-ink-soft)] disabled:opacity-60"
              >
                {sendingMessage
                  ? 'Sending…'
                  : contactForm.mode === 'offer'
                    ? 'Send offer'
                    : 'Send enquiry'}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PropertyDetailPage;
