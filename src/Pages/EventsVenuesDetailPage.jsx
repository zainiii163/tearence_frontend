import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Building2,
  Send,
} from 'lucide-react';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import eventsVenuesAPI from '../services/eventsVenuesAPI';
import { getEventsVenuesImageUrl } from '../utils/eventsVenuesImages';
import ChatButton from '../Component/Chat/ChatButton';
import {
  buildListingChatContext,
  resolveSellerId,
  resolveSellerName,
} from '../utils/chatHelpers';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import toast from 'react-hot-toast';

const EventsVenuesDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [advert, setAdvert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [enquiry, setEnquiry] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!slug) return;
      setLoading(true);
      setError('');
      try {
        const res = await eventsVenuesAPI.getAdvertBySlug(slug);
        const data = res?.data || res;
        if (!cancelled) {
          if (data?.title || data?.id) {
            setAdvert(data);
          } else {
            setError('Listing not found');
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.response?.data?.message || e?.message || 'Failed to load listing');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const imageUrl = useMemo(
    () => (advert ? getEventsVenuesImageUrl(advert) : null),
    [advert]
  );

  const isVenue = advert?.advert_type === 'venue';
  const backHref = isVenue ? '/events-venues/venues' : '/events-venues/events';
  const backLabel = isVenue ? 'Back to Venues' : 'Back to Events';

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      requireAuth(`/events-venues/${slug}`, 'Log in to contact the organiser.');
      return;
    }
    if (!enquiry.name.trim() || !enquiry.email.trim() || !enquiry.message.trim()) {
      toast.error('Name, email and message are required');
      return;
    }
    setSubmitting(true);
    try {
      const contactFn = eventsVenuesAPI.contactAdvert || eventsVenuesAPI.enquire;
      if (typeof contactFn === 'function') {
        await contactFn.call(eventsVenuesAPI, advert.id || slug, {
          name: enquiry.name.trim(),
          email: enquiry.email.trim(),
          phone: enquiry.phone.trim() || undefined,
          message: enquiry.message.trim(),
        });
      } else {
        const to = advert.contact_email || advert.email;
        if (to) {
          window.location.href = `mailto:${to}?subject=${encodeURIComponent(
            `Enquiry: ${advert.title}`
          )}&body=${encodeURIComponent(enquiry.message)}`;
        } else {
          toast.success('Enquiry noted — the organiser will follow up via chat when available.');
        }
      }
      toast.success('Enquiry sent');
      setShowEnquiry(false);
      setEnquiry({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to send enquiry');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton backHref="/events-venues" />
        <div className="flex items-center justify-center py-24">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-r-transparent" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !advert) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton backHref="/events-venues" />
        <div className="page-container py-16 text-center">
          <p className="text-lg text-red-600 mb-4">{error || 'Listing not found'}</p>
          <button
            type="button"
            onClick={() => navigate('/events-venues')}
            className="px-5 py-2.5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700"
          >
            Back to Entertainment
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar showBackButton backHref={backHref} />

      <div className="page-container py-6 sm:py-8 max-w-5xl">
        <button
          type="button"
          onClick={() => navigate(backHref)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-purple-700 hover:text-purple-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </button>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative min-h-[240px] bg-gradient-to-br from-purple-900 to-indigo-700">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={advert.title}
                  className="w-full h-full min-h-[240px] max-h-[420px] object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full min-h-[240px]">
                  <Building2 className="h-16 w-16 text-white/50" />
                </div>
              )}
              <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-black/70 text-white rounded">
                {isVenue ? 'Venue' : 'Event'}
              </span>
            </div>

            <div className="p-6 sm:p-8 flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-purple-700 mb-2">
                {advert.tagline || advert.venue_name || (isVenue ? 'Venue listing' : 'Event listing')}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {advert.title}
              </h1>

              {(advert.city || advert.country || advert.address) && (
                <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
                  {[advert.address, advert.city, advert.country].filter(Boolean).join(', ')}
                </p>
              )}

              {!isVenue && (advert.event_date || advert.event_time) && (
                <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-purple-600 shrink-0" />
                  {[advert.event_date, advert.event_time].filter(Boolean).join(' · ')}
                </p>
              )}

              {advert.capacity != null && (
                <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-purple-600 shrink-0" />
                  Capacity: {advert.capacity}
                </p>
              )}

              {(advert.ticket_price != null || advert.price_range || advert.free_event) && (
                <p className="mt-4 text-xl font-bold text-gray-900">
                  {advert.free_event
                    ? 'Free'
                    : advert.ticket_price != null
                      ? `${advert.ticket_currency || 'USD'} ${advert.ticket_price}`
                      : advert.price_range
                        ? `From ${advert.price_range}`
                        : null}
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
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Contact organiser</h2>
              {resolveSellerId(advert) && (
                <ChatButton
                  sellerId={resolveSellerId(advert)}
                  sellerName={resolveSellerName(
                    advert,
                    advert.contact_name || advert.seller_name || 'Organiser'
                  )}
                  listing={buildListingChatContext(advert, 'EventsVenues')}
                  label="Live Chat"
                  className="w-full h-11 px-4 text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
                  variant="custom"
                />
              )}
              {(advert.contact_email || advert.email) && (
                <a
                  href={`mailto:${advert.contact_email || advert.email}`}
                  className="flex gap-3 p-3 rounded-xl bg-gray-50 hover:bg-purple-50"
                >
                  <Mail className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span className="font-medium text-gray-900">
                    {advert.contact_email || advert.email}
                  </span>
                </a>
              )}
              {(advert.contact_phone || advert.phone) && (
                <a
                  href={`tel:${advert.contact_phone || advert.phone}`}
                  className="flex gap-3 p-3 rounded-xl bg-gray-50 hover:bg-purple-50"
                >
                  <Phone className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span className="font-medium text-gray-900">
                    {advert.contact_phone || advert.phone}
                  </span>
                </a>
              )}
              {advert.website && (
                <a
                  href={advert.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 p-3 rounded-xl bg-gray-50 hover:bg-purple-50"
                >
                  <Globe className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span className="font-medium text-purple-700">{advert.website}</span>
                </a>
              )}
            </section>

            <section className="flex flex-col gap-4">
              <div className="rounded-xl border border-purple-100 bg-purple-50/60 p-4">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {isVenue ? 'Book this venue' : 'Enquire about this event'}
                </p>
                <p className="text-sm text-gray-600">
                  Send a message to the organiser, or use live chat for quick questions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEnquiry(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-purple-600 text-white text-sm font-bold hover:bg-purple-700"
              >
                <Send className="w-4 h-4" />
                {isVenue ? 'Request booking' : 'Send enquiry'}
              </button>
              <Link
                to={backHref}
                className="text-center text-sm font-semibold text-gray-600 hover:text-gray-900"
              >
                Browse more
              </Link>
            </section>
          </div>
        </article>
      </div>

      {showEnquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => !submitting && setShowEnquiry(false)}
        >
          <form
            onSubmit={handleEnquirySubmit}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-5 space-y-3"
          >
            <h3 className="text-lg font-bold text-gray-900">
              {isVenue ? 'Booking request' : 'Event enquiry'}
            </h3>
            <input
              required
              placeholder="Your name"
              value={enquiry.name}
              onChange={(e) => setEnquiry((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={enquiry.email}
              onChange={(e) => setEnquiry((p) => ({ ...p, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="tel"
              placeholder="Phone (optional)"
              value={enquiry.phone}
              onChange={(e) => setEnquiry((p) => ({ ...p, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <textarea
              required
              rows={4}
              placeholder="Your message"
              value={enquiry.message}
              onChange={(e) => setEnquiry((p) => ({ ...p, message: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setShowEnquiry(false)}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 rounded-lg bg-purple-600 text-white text-sm font-bold disabled:opacity-60"
              >
                {submitting ? 'Sending…' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EventsVenuesDetailPage;
