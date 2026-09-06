import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  MapPin,
  Calendar,
  Fuel,
  Settings,
  Users,
  X,
  Share2,
  Phone,
  Mail,
  Gauge,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import {
  getVehicle,
  contactSeller,
  saveVehicle,
  trackViews,
} from '../services/vehiclesAPI';
import ChatButton from '../Component/Chat/ChatButton';
import RelatedListingsSection from '../Component/shared/RelatedListingsSection';
import ReportAdvertButton from '../Component/Reporting/ReportAdvertButton';
import ReviewsPanel from '../Component/shared/ReviewsPanel';
import {
  buildListingChatContext,
  resolveSellerId,
  resolveSellerName,
} from '../utils/chatHelpers';
import { resolveStorageUrl } from '../utils/dashboardEditMappers';
import { BrowseListingCard, BrowseListingGrid } from '../Component/shared/BrowseListingCard';

const money = (n) => {
  const val = Number(n);
  if (!Number.isFinite(val)) return '—';
  return `$${val.toLocaleString()}`;
};

const priceLabel = (vehicle) => {
  if (vehicle?.display_price) return vehicle.display_price;
  const base = money(vehicle?.price);
  const type = (vehicle?.price_type || '').toLowerCase();
  if (type === 'per_day') return `${base}/day`;
  if (type === 'per_week') return `${base}/week`;
  if (type === 'per_month') return `${base}/month`;
  if (type === 'per_hour') return `${base}/hour`;
  return base;
};

const imageUrl = (path) => {
  if (!path || path === 'null') return '/img/NoImage.png';
  if (typeof path === 'string' && path.startsWith('http')) return path;
  return resolveStorageUrl(path) || path || '/img/NoImage.png';
};

const VehicleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [contactError, setContactError] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadVehicle = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getVehicle(id);
        const vehicleData = response?.data?.data || response?.data || response;
        const relatedData = response?.related || response?.data?.related || [];
        if (!cancelled) {
          setVehicle(vehicleData);
          setRelated(Array.isArray(relatedData) ? relatedData : relatedData?.data || []);
          setActiveImage(0);
          // Non-blocking analytics
          if (vehicleData?.id) {
            trackViews(vehicleData.id).catch(() => {});
          }
        }
      } catch (err) {
        if (cancelled) return;
        const status = err?.response?.status || err?.status;
        // Old sample listing was removed — send users to a live vehicle
        if (status === 404 && String(id) === '2') {
          navigate('/vehicles/9', { replace: true });
          return;
        }
        if (status === 404) {
          setError('This vehicle is no longer available.');
        } else {
          setError(err?.message || 'Failed to load vehicle details');
        }
        setVehicle(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadVehicle();
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  const gallery = useMemo(() => {
    if (!vehicle) return [];
    const extras = Array.isArray(vehicle.additional_images)
      ? vehicle.additional_images
      : [];
    const urls = [vehicle.main_image, ...extras]
      .map((u) => imageUrl(u))
      .filter((u, i, arr) => u && arr.indexOf(u) === i);
    return urls.length ? urls : ['/img/NoImage.png'];
  }, [vehicle]);

  const location = useMemo(() => {
    if (!vehicle) return '';
    if (vehicle.location) return vehicle.location;
    return [vehicle.city, vehicle.country].filter(Boolean).join(', ');
  }, [vehicle]);

  const badges = vehicle?.upgrade_badges?.length
    ? vehicle.upgrade_badges
    : [
        vehicle?.is_featured && { text: 'Featured', color: 'blue' },
        vehicle?.is_sponsored && { text: 'Sponsored', color: 'red' },
        vehicle?.is_promoted && { text: 'Promoted', color: 'green' },
        vehicle?.is_top_of_category && { text: 'Top of Category', color: 'purple' },
      ].filter(Boolean);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactError('');
    setContactSuccess(false);

    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactError('Please fill in all required fields');
      return;
    }

    setContactSubmitting(true);
    try {
      await contactSeller(id, contactForm);
      setContactSuccess(true);
      toast.success('Message sent to seller');
      setTimeout(() => {
        setShowContactModal(false);
        setContactSuccess(false);
        setContactForm({ name: '', email: '', phone: '', message: '' });
      }, 1500);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to send message. Please try again.';
      setContactError(msg);
      toast.error(msg);
    } finally {
      setContactSubmitting(false);
    }
  };

  const handleSave = async () => {
    try {
      await saveVehicle(id);
      setSaved(true);
      toast.success('Saved to your list');
    } catch (err) {
      toast.error(err?.message || 'Could not save vehicle');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: vehicle?.title,
          text: vehicle?.tagline || vehicle?.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied');
      }
    } catch {
      /* cancelled */
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <UnifiedNavbar />
        <div className="flex flex-1 items-center justify-center py-32">
          <div className="h-10 w-10 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <UnifiedNavbar />
        <div className="page-container py-20 text-center flex-1">
          <p className="text-red-600 mb-4">{error || 'Vehicle not found'}</p>
          <Link to="/vehicles" className="text-red-700 font-semibold hover:underline">
            Back to Vehicles
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const makeName = vehicle.make?.name;
  const modelName = vehicle.vehicle_model?.name || vehicle.custom_model;
  const category = vehicle.category;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <UnifiedNavbar />
      <div className="page-container py-6 md:py-8 flex-1">
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate('/vehicles')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Vehicles
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <ReportAdvertButton
              advertId={vehicle?.id || id}
              advertSlug={vehicle?.slug}
              advertType="vehicle"
            />
            <button
              type="button"
              onClick={handleSave}
              className={`p-2 rounded-lg border ${
                saved ? 'border-red-200 bg-red-50 text-red-600' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
              aria-label="Save"
            >
              <Heart className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Gallery */}
          <div className="lg:col-span-3 space-y-3">
            <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 aspect-[16/10]">
              <img
                src={gallery[activeImage]}
                alt={vehicle.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  if (!e.target.src.includes('NoImage.png')) e.target.src = '/img/NoImage.png';
                }}
              />
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
                    onClick={() =>
                      setActiveImage((i) => (i - 1 + gallery.length) % gallery.length)
                    }
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
                    onClick={() => setActiveImage((i) => (i + 1) % gallery.length)}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {gallery.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                      i === activeImage ? 'border-red-500' : 'border-transparent'
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24 space-y-5">
              <div className="flex flex-wrap gap-2">
                {badges.map((b) => (
                  <span
                    key={b.text}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700"
                  >
                    {b.text}
                  </span>
                ))}
                {vehicle.advert_type && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 capitalize">
                    {String(vehicle.advert_type).replace(/_/g, ' ')}
                  </span>
                )}
                {vehicle.condition && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 capitalize">
                    {vehicle.condition}
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{vehicle.title}</h1>
                {vehicle.tagline && (
                  <p className="text-gray-600 mt-1">{vehicle.tagline}</p>
                )}
              </div>

              <div className="text-3xl font-bold text-red-600">
                {priceLabel(vehicle)}
                {vehicle.negotiable ? (
                  <span className="ml-2 text-sm font-medium text-gray-500">Negotiable</span>
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                {vehicle.year && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {vehicle.year}
                  </div>
                )}
                {vehicle.mileage != null && (
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-gray-400" />
                    {Number(vehicle.mileage).toLocaleString()} km
                  </div>
                )}
                {vehicle.fuel_type && (
                  <div className="flex items-center gap-2 capitalize">
                    <Fuel className="w-4 h-4 text-gray-400" />
                    {vehicle.fuel_type}
                  </div>
                )}
                {vehicle.transmission && (
                  <div className="flex items-center gap-2 capitalize">
                    <Settings className="w-4 h-4 text-gray-400" />
                    {vehicle.transmission}
                  </div>
                )}
                {vehicle.doors != null && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    {vehicle.doors} doors
                  </div>
                )}
                {vehicle.seats != null && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    {vehicle.seats} seats
                  </div>
                )}
              </div>

              {location && (
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 mr-2 shrink-0" />
                  {location}
                </div>
              )}

              <div className="flex flex-wrap gap-2 text-sm">
                {category?.slug && (
                  <Link
                    to={`/vehicles/category/${category.slug}`}
                    className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
                  >
                    {category.name}
                  </Link>
                )}
                {makeName && (
                  <span className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 border border-gray-200">
                    {makeName}
                    {modelName ? ` · ${modelName}` : ''}
                  </span>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-xs text-gray-500 leading-relaxed">
                  To buy this vehicle, enquire with the seller. Payment and handover are arranged
                  directly — there is no in-app checkout for vehicles.
                </p>

                <button
                  type="button"
                  onClick={() => setShowContactModal(true)}
                  className="w-full bg-red-600 text-white py-3.5 px-6 rounded-lg hover:bg-red-700 font-semibold"
                >
                  Enquire to buy
                </button>

                <ChatButton
                  sellerId={resolveSellerId(vehicle)}
                  sellerName={resolveSellerName(
                    vehicle,
                    vehicle.contact_name || vehicle.seller_name || 'Seller'
                  )}
                  listing={buildListingChatContext(vehicle, 'Vehicles')}
                  label="Live Chat with Seller"
                  className="w-full h-12 px-6 text-sm font-medium border border-gray-300 text-gray-800 bg-white hover:bg-gray-50 rounded-lg"
                  variant="custom"
                />

                {!resolveSellerId(vehicle) &&
                  !vehicle.contact_phone &&
                  !vehicle.contact_email && (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-3">
                      This listing has no seller account linked yet (demo/sample data). Use
                      <strong> Enquire to buy</strong> — your message is still stored for the
                      listing owner once assigned.
                    </p>
                  )}

                {(vehicle.contact_phone || vehicle.contact_email) && (
                  <div className="text-sm text-gray-600 space-y-1.5 pt-1">
                    {vehicle.contact_phone && (
                      <a
                        href={`tel:${vehicle.contact_phone}`}
                        className="flex items-center gap-2 hover:text-red-700"
                      >
                        <Phone className="w-4 h-4" />
                        {vehicle.contact_phone}
                      </a>
                    )}
                    {vehicle.contact_email && (
                      <a
                        href={`mailto:${vehicle.contact_email}`}
                        className="flex items-center gap-2 hover:text-red-700"
                      >
                        <Mail className="w-4 h-4" />
                        {vehicle.contact_email}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description + features */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {vehicle.description && (
              <section className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {vehicle.description}
                </p>
              </section>
            )}

            {Array.isArray(vehicle.features) && vehicle.features.length > 0 && (
              <section className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Features</h2>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {vehicle.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 text-sm text-gray-600 space-y-2">
              <h3 className="font-semibold text-gray-900">Listing info</h3>
              {vehicle.views != null && <p>Views: {vehicle.views}</p>}
              {vehicle.body_type && <p className="capitalize">Body: {vehicle.body_type}</p>}
              {vehicle.color && <p className="capitalize">Colour: {vehicle.color}</p>}
              {vehicle.engine_size && <p>Engine: {vehicle.engine_size}</p>}
              {vehicle.previous_owners != null && (
                <p>Previous owners: {vehicle.previous_owners}</p>
              )}
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Related vehicles</h2>
            <BrowseListingGrid>
              {related.map((item) => (
                <BrowseListingCard
                  key={item.id}
                  href={`/vehicles/${item.id}`}
                  title={item.title}
                  imageUrl={imageUrl(item.main_image)}
                  priceLabel={priceLabel(item)}
                  location={[item.city, item.country].filter(Boolean).join(', ')}
                  badge={
                    item.is_featured
                      ? 'Featured'
                      : item.is_sponsored
                        ? 'Sponsored'
                        : item.is_promoted
                          ? 'Promoted'
                          : null
                  }
                />
              ))}
            </BrowseListingGrid>
          </section>
        )}

        <div className="space-y-8 mt-8">
          <ReviewsPanel
            type="vehicle"
            targetId={vehicle?.id || id}
            title="Vehicle ratings & reviews"
            initialAverage={Number(vehicle?.rating) || 0}
            initialCount={Number(vehicle?.reviews_count || vehicle?.review_count) || 0}
          />
          <RelatedListingsSection
            source="vehicles"
            currentId={vehicle?.id || id}
            items={[]}
            title="Related vehicles"
            subtitle="You may also like"
            showRelatedAdverts
          />
        </div>
      </div>

      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold text-gray-900">Enquire to buy</h2>
              <button
                type="button"
                onClick={() => {
                  setShowContactModal(false);
                  setContactError('');
                  setContactSuccess(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleContactSubmit} className="p-5 space-y-4">
              <p className="text-xs text-gray-500 -mt-1">
                Tell the seller you’re interested. They’ll reply to arrange viewing and payment.
              </p>
              {contactError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                  {contactError}
                </div>
              )}
              {contactSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm">
                  Message sent successfully!
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={contactSubmitting}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {contactSubmitting ? 'Sending…' : 'Send message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default VehicleDetailPage;
