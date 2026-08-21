import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Star, MapPin, Clock, Eye, Heart, MessageCircle, User, Briefcase, Check, Award, Share2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import PaymentProcessor from '../Component/Payment/PaymentProcessor';
import ChatButton from '../Component/Chat/ChatButton';
import { servicesApi } from '../services/servicesSolutionsApi';
import { formatCountry } from '../utils/apiResponseHelpers';
import { getStorageAssetUrl } from '../utils/jobsHelpers';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { isPayPalSandboxDemo } from '../utils/paypalConfig';
import {
  buildListingChatContext,
  resolveSellerId,
  resolveSellerName,
} from '../utils/chatHelpers';
import { sanitizeHtml } from '../utils/sanitizeHtml';
import RelatedListingsSection from '../Component/shared/RelatedListingsSection';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const customerId = useSelector((store) => {
    const detail = store.auth?.userDetail;
    return (
      store.auth?.customerId ||
      detail?.customer_id ||
      detail?.data?.customer_id ||
      detail?.id ||
      localStorage.getItem('customer_id')
    );
  });
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [requirements, setRequirements] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [order, setOrder] = useState(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  const packages = useMemo(() => {
    if (!service?.packages) return [];
    return Array.isArray(service.packages) ? service.packages : Object.values(service.packages);
  }, [service]);

  const orderAmount = useMemo(() => {
    if (selectedPackageId) {
      const pkg = packages.find((p) => String(p.id) === String(selectedPackageId));
      if (pkg?.price != null) return Number(pkg.price);
    }
    return Number(service?.starting_price || 0);
  }, [selectedPackageId, packages, service]);

  const isOwnService = useMemo(() => {
    if (!service || customerId == null || customerId === '') return false;
    const ownerId = service.user_id ?? service.user?.customer_id ?? service.user?.id;
    return ownerId != null && String(ownerId) === String(customerId);
  }, [service, customerId]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await servicesApi.getService(id);
        const data = response?.data || response;
        setService(data);
      } catch (err) {
        console.error('Error fetching service:', err);
        setError('Failed to load service');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const openBuyModal = () => {
    if (!isAuthenticated) {
      requireAuth(`/services/${id}`, 'Log in to buy this service.');
      return;
    }
    if (isOwnService) {
      toast.error('This is your listing — switch account to buy as a customer.');
      return;
    }
    setOrder(null);
    setRequirements('');
    setSelectedPackageId(packages[0]?.id || null);
    setShowBuyModal(true);
  };

  const handleCreateOrder = async () => {
    const brief = requirements.trim();
    if (brief.length < 10) {
      toast.error('Please describe what you need (at least 10 characters).');
      return;
    }

    try {
      setCreatingOrder(true);
      const payload = {
        service_id: service.id,
        requirements: brief,
      };
      if (selectedPackageId) {
        payload.package_id = selectedPackageId;
      }
      const response = await servicesApi.createOrder(payload);
      const created = response?.data || response;
      setOrder(created);
      toast.success('Order created — complete payment to confirm.');
    } catch (err) {
      const msg = err?.message || err?.data?.message || 'Could not create order';
      toast.error(msg);
    } finally {
      setCreatingOrder(false);
    }
  };

  const finalizePayment = async ({ paymentId, paymentMethod }) => {
    if (!order?.id) return;
    try {
      setConfirmingPayment(true);
      await servicesApi.confirmOrderPayment(order.id, {
        payment_id: paymentId,
        payment_method: paymentMethod,
      });
      toast.success('Payment confirmed. The seller can start your order.');
      setShowBuyModal(false);
      setOrder(null);
      navigate('/dashboard?tab=services');
    } catch (err) {
      toast.error(err?.message || 'Payment confirmation failed');
    } finally {
      setConfirmingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <UnifiedNavbar showBackButton={true} backHref="/services" />
        <div className="flex flex-1 items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <UnifiedNavbar showBackButton={true} backHref="/services" />
        <div className="flex flex-1 items-center justify-center py-20">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2>
            <p className="text-gray-600 mb-4">The service you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/services')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Services
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const providerName =
    service.service_provider?.business_name ||
    service.serviceProvider?.business_name ||
    service.user?.name ||
    'Provider';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <UnifiedNavbar showBackButton={true} backHref="/services" />

      <div className="page-container py-8 flex-1">
        <nav className="mb-6 text-sm text-gray-600">
          <button onClick={() => navigate('/services')} className="hover:text-blue-600">
            Services
          </button>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{service.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h1>
                  {service.tagline && (
                    <p className="text-lg text-gray-600">{service.tagline}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(service.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-bold text-gray-900">
                    {typeof service.rating === 'number'
                      ? service.rating.toFixed(1)
                      : parseFloat(service.rating || 0).toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-500 ml-2">
                  ({service.review_count || 0} reviews)
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-500 space-x-6">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>{service.views || 0} views</span>
                </div>
                {service.enquiries ? (
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <span>{service.enquiries} enquiries</span>
                  </div>
                ) : null}
              </div>
            </div>

            {service.media && service.media.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Service Gallery</h2>
                <div className="grid grid-cols-2 gap-4">
                  {service.media.map((media, index) => (
                    <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      {getStorageAssetUrl(media.full_url || media.file_path || media.url || media.path) ? (
                        <img
                          src={getStorageAssetUrl(media.full_url || media.file_path || media.url || media.path)}
                          alt={`Service image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Briefcase className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About This Service</h2>
              <div
                className="prose prose-blue max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(service.description) }}
              />
            </div>

            {service.whats_included && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">What's Included</h2>
                <ul className="space-y-3">
                  {(Array.isArray(service.whats_included)
                    ? service.whats_included
                    : [service.whats_included]
                  ).map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1e3a5f] to-teal-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{providerName}</h3>
                  {service.is_verified && (
                    <div className="flex items-center text-green-600 text-sm">
                      <Award className="w-4 h-4 mr-1" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{formatCountry(service.country)}</span>
                {service.city && <span>, {service.city}</span>}
              </div>

              {isOwnService ? (
                <>
                  <button
                    type="button"
                    disabled
                    className="w-full px-4 py-3 bg-gray-300 text-gray-600 font-semibold rounded-lg cursor-not-allowed mb-3"
                  >
                    This is your listing
                  </button>
                  <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg p-2 text-center">
                    Log out and sign in as another buyer (e.g. the other test account) to purchase and pay.
                  </p>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={openBuyModal}
                    className="w-full px-4 py-3 bg-[#1e3a5f] text-white font-semibold rounded-lg hover:bg-[#16304f] transition-colors mb-3"
                  >
                    Buy now — ${Number(service.starting_price || 0).toLocaleString()}
                  </button>
                  <ChatButton
                    sellerId={resolveSellerId(service)}
                    sellerName={resolveSellerName(service, providerName)}
                    listing={buildListingChatContext(service, 'Services')}
                    label="Live Chat with Provider"
                    className="w-full h-11 px-4 mb-3 text-sm font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    variant="custom"
                  />
                  <p className="text-xs text-gray-500 text-center">
                    Secure checkout. Message the provider anytime in live chat.
                  </p>
                </>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Pricing</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${service.starting_price}
                </span>
                <span className="text-gray-500"> / starting from</span>
              </div>

              {service.delivery_time && (
                <div className="flex items-center text-gray-600 mb-4">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{service.delivery_time} days delivery</span>
                </div>
              )}
            </div>

            {packages.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Packages</h3>
                <div className="space-y-4">
                  {packages.map((pkg) => (
                    <div key={pkg.id || pkg.name} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 capitalize">{pkg.name}</h4>
                        <span className="font-bold text-gray-900">${pkg.price}</span>
                      </div>
                      {pkg.description && (
                        <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
                      )}
                      {pkg.delivery_time && (
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{pkg.delivery_time} days</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <RelatedListingsSection
          source="services"
          currentId={service?.id || id}
          categoryKey={service?.category_slug || service?.category?.slug || ''}
          categoryName={
            typeof service?.category === 'string'
              ? service.category
              : service?.category_name || service?.category?.name || ''
          }
          title="Related services"
          subtitle="You may also like"
        />
      </div>

      {showBuyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Buy: {service.title}</h3>
              <button
                type="button"
                onClick={() => setShowBuyModal(false)}
                className="p-2 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {!order ? (
                <>
                  {packages.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Package</label>
                      <select
                        value={selectedPackageId || ''}
                        onChange={(e) => setSelectedPackageId(e.target.value || null)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="">Starting price (${service.starting_price})</option>
                        {packages.map((pkg) => (
                          <option key={pkg.id} value={pkg.id}>
                            {pkg.name} — ${pkg.price}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What do you need?
                    </label>
                    <textarea
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      rows={4}
                      placeholder="Share goals, brand notes, deadlines, and any assets you'll provide…"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-gray-600">Total due</span>
                    <span className="font-bold text-gray-900">${orderAmount.toFixed(2)}</span>
                  </div>

                  <button
                    type="button"
                    disabled={creatingOrder}
                    onClick={handleCreateOrder}
                    className="w-full px-4 py-3 bg-[#1e3a5f] text-white font-semibold rounded-lg hover:bg-[#16304f] disabled:opacity-60"
                  >
                    {creatingOrder ? 'Creating order…' : 'Continue to payment'}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600">
                    Order #{order.id} ready. Pay ${Number(order.total_price || orderAmount).toFixed(2)} to
                    confirm with {providerName}.
                  </p>

                  {isPayPalSandboxDemo() && (
                    <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg p-3">
                      PayPal sandbox demo mode — set{' '}
                      <code className="font-mono">REACT_APP_PAYPAL_CLIENT_ID</code> for live charges.
                    </p>
                  )}

                  <PaymentProcessor
                    amount={Number(order.total_price || orderAmount)}
                    description={`Service order #${order.id}: ${service.title}`}
                    upsellType="service"
                    upsellId={order.id}
                    onSuccess={(details) =>
                      finalizePayment({
                        paymentId: details.paymentId || details.id,
                        paymentMethod: details?.paymentMethod || 'paypal',
                      })
                    }
                    onError={() => toast.error('PayPal payment failed')}
                  />
                  {confirmingPayment && (
                    <p className="text-sm text-center text-gray-500">Confirming payment with the server…</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ServiceDetailPage;
