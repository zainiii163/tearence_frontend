import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Share2,
  Hotel,
  Car,
  Compass,
  CheckCircle,
  Loader2,
  Calendar,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';
import resortsTravelApi from '../../services/resortsTravelAPI';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';
import {
  enrichTravelAdvert,
  getTravelImageUrl,
  getTravelLogoUrl,
  getTravelMediaUrl,
  formatOperatingHoursForInput,
} from '../../utils/travelFormHelpers';

const TYPE_ICONS = {
  accommodation: Hotel,
  transport: Car,
  experience: Compass,
};

const emptyBooking = {
  start_date: '',
  end_date: '',
  guests: 1,
  guest_name: '',
  guest_email: '',
  guest_phone: '',
  special_requests: '',
};

const TravelDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [advert, setAdvert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const [booking, setBooking] = useState(emptyBooking);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (slug) fetchAdvert();
  }, [slug]);

  const fetchAdvert = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await resortsTravelApi.getTravelAdvertBySlug(slug);
      if (response?.success && response.data) {
        const enriched = enrichTravelAdvert(response.data);
        setAdvert(enriched);
        setImageError(false);
        resortsTravelApi.incrementViews(enriched.id).catch(() => {});
      } else {
        setError('Listing not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to load travel listing');
    } finally {
      setLoading(false);
    }
  };

  const getDisplayPrice = (item) => {
    if (!item) return null;
    if (item.price_per_night) return { amount: item.price_per_night, label: '/night' };
    if (item.price_per_trip) return { amount: item.price_per_trip, label: '/trip' };
    if (item.price_per_service) return { amount: item.price_per_service, label: '/service' };
    return null;
  };

  const handleShare = () => {
    if (navigator.share && advert) {
      navigator.share({
        title: advert.title,
        text: advert.tagline || advert.description,
        url: window.location.href,
      });
    }
  };

  const openBookForm = () => {
    if (!requireAuth(`/resorts-travel/${slug}`, 'Log in to request a booking.')) return;
    setShowBook(true);
  };

  const handleBookingChange = (field, value) => {
    setBooking((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!advert?.id) return;
    if (!requireAuth(`/resorts-travel/${slug}`, 'Log in to request a booking.')) return;

    setSubmitting(true);
    try {
      await resortsTravelApi.createBooking(advert.id, {
        ...booking,
        guests: Number(booking.guests) || 1,
      });
      toast.success('Booking request sent — the provider will contact you.');
      setShowBook(false);
      setBooking(emptyBooking);
    } catch (err) {
      toast.error(err?.message || err?.error || 'Could not submit booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
  }

  if (error || !advert) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600 mb-4">{error || 'Listing not found'}</p>
        <button
          type="button"
          onClick={() => navigate('/resorts-travel')}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          Back to Travel Listings
        </button>
      </div>
    );
  }

  const TypeIcon = TYPE_ICONS[advert.advert_type] || Hotel;
  const displayPrice = getDisplayPrice(advert);
  const heroImage = advert.display_image_url || getTravelImageUrl(advert);
  const gallery = [
    heroImage,
    ...(advert.image_urls || []).map((img) => getTravelMediaUrl(img)),
  ].filter(Boolean);
  const uniqueGallery = [...new Set(gallery)];

  return (
    <div className="page-container py-8">
      <button
        type="button"
        onClick={() => navigate('/resorts-travel')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {!imageError && uniqueGallery[0] ? (
              <img
                src={uniqueGallery[0]}
                alt={advert.title}
                className="w-full h-72 md:h-96 object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-72 md:h-96 bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center">
                <TypeIcon className="w-16 h-16 text-teal-600" />
              </div>
            )}

            {uniqueGallery.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {uniqueGallery.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`${advert.title} ${idx + 1}`}
                    className="h-20 w-28 object-cover rounded-lg flex-shrink-0"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-3">
              <TypeIcon className="w-5 h-5 text-teal-600" />
              <span className="text-sm capitalize text-gray-500">{advert.advert_type}</span>
              {advert.category?.name && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-500">{advert.category.name}</span>
                </>
              )}
              {advert.verified_business && (
                <span className="ml-auto flex items-center gap-1 text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Verified
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">{advert.title}</h1>
            {advert.tagline && (
              <p className="text-lg text-teal-700 italic mb-4">{advert.tagline}</p>
            )}

            <div className="flex items-center gap-2 text-gray-600 mb-6">
              <MapPin className="w-4 h-4" />
              <span>{[advert.city, advert.country].filter(Boolean).join(', ')}</span>
            </div>

            {displayPrice && (
              <div className="text-3xl font-bold text-teal-700 mb-6">
                {advert.currency} {Number(displayPrice.amount).toFixed(2)}
                <span className="text-base font-normal text-gray-500">{displayPrice.label}</span>
              </div>
            )}

            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{advert.description}</p>
            </div>

            {advert.overview && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Overview</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{advert.overview}</p>
              </div>
            )}

            {advert.key_features && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Key Features</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{advert.key_features}</p>
              </div>
            )}

            {Array.isArray(advert.amenities) && advert.amenities.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {advert.amenities.map((amenity) => (
                    <span key={amenity} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {amenity.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Book / Contact</h3>

            {advert.business_name && (
              <div className="flex items-center gap-3 mb-4">
                {getTravelLogoUrl(advert) && (
                  <img
                    src={getTravelLogoUrl(advert)}
                    alt={advert.business_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900">{advert.business_name}</p>
                  <p className="text-sm text-gray-500">{advert.contact_name}</p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={openBookForm}
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 font-semibold text-white hover:bg-teal-700"
            >
              <Calendar className="w-4 h-4" />
              Request booking
            </button>
            {!isAuthenticated && (
              <p className="mb-4 text-xs text-gray-500">Sign in required to book.</p>
            )}

            <div className="space-y-3 text-sm">
              {advert.phone_number && (
                <a href={`tel:${advert.phone_number}`} className="flex items-center gap-2 text-gray-700 hover:text-teal-600">
                  <Phone className="w-4 h-4" />
                  {advert.phone_number}
                </a>
              )}
              {advert.email && (
                <a href={`mailto:${advert.email}`} className="flex items-center gap-2 text-gray-700 hover:text-teal-600">
                  <Mail className="w-4 h-4" />
                  {advert.email}
                </a>
              )}
              {advert.website && (
                <a href={advert.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-teal-600">
                  <Globe className="w-4 h-4" />
                  Visit website
                </a>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6 text-sm space-y-3">
            <h3 className="font-semibold text-gray-900">Details</h3>
            {advert.guest_capacity && (
              <p className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                Guest capacity: {advert.guest_capacity}
              </p>
            )}
            {advert.availability_start && (
              <p className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                Available from {new Date(advert.availability_start).toLocaleDateString()}
              </p>
            )}
            {advert.operating_hours?.length > 0 && (
              <p className="text-gray-600">
                Hours: {formatOperatingHoursForInput(advert.operating_hours)}
              </p>
            )}
            {advert.service_area && (
              <p className="text-gray-600">Service area: {advert.service_area}</p>
            )}
          </div>
        </div>
      </div>

      {showBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleSubmitBooking}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <h3 className="mb-1 text-lg font-semibold text-gray-900">Request booking</h3>
            <p className="mb-4 text-sm text-gray-500">{advert.title}</p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block font-medium text-gray-700">Check-in</span>
                <input
                  type="date"
                  required
                  value={booking.start_date}
                  onChange={(e) => handleBookingChange('start_date', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block font-medium text-gray-700">Check-out</span>
                <input
                  type="date"
                  required
                  value={booking.end_date}
                  onChange={(e) => handleBookingChange('end_date', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block font-medium text-gray-700">Guests</span>
                <input
                  type="number"
                  min={1}
                  required
                  value={booking.guests}
                  onChange={(e) => handleBookingChange('guests', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </label>
              <label className="text-sm sm:col-span-2">
                <span className="mb-1 block font-medium text-gray-700">Full name</span>
                <input
                  type="text"
                  required
                  value={booking.guest_name}
                  onChange={(e) => handleBookingChange('guest_name', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block font-medium text-gray-700">Email</span>
                <input
                  type="email"
                  required
                  value={booking.guest_email}
                  onChange={(e) => handleBookingChange('guest_email', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block font-medium text-gray-700">Phone</span>
                <input
                  type="tel"
                  required
                  value={booking.guest_phone}
                  onChange={(e) => handleBookingChange('guest_phone', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </label>
              <label className="text-sm sm:col-span-2">
                <span className="mb-1 block font-medium text-gray-700">Special requests</span>
                <textarea
                  rows={3}
                  value={booking.special_requests}
                  onChange={(e) => handleBookingChange('special_requests', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Optional notes for the provider"
                />
              </label>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-lg bg-teal-600 py-2.5 font-semibold text-white disabled:opacity-60"
              >
                {submitting ? 'Sending…' : 'Submit request'}
              </button>
              <button
                type="button"
                onClick={() => setShowBook(false)}
                className="flex-1 rounded-lg border py-2.5"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TravelDetails;
