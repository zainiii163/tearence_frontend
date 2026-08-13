import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Heart, Star, Check, Share2, ShoppingCart, Shield, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import imagesApi from '../services/imagesAPI';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import AuthenticCheckoutModal from '../Component/Payment/AuthenticCheckoutModal';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

const resolveMediaUrl = (path) => {
  if (!path) return '/placeholder.png';
  if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('/images/')) {
    return path;
  }
  if (path.startsWith('/storage/')) {
    return `${process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'https://api.worldwideadverts.info'}${path}`;
  }
  return `${process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'https://api.worldwideadverts.info'}/storage/${path}`;
};

const ImageDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { requireAuth } = useAuthRedirect();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [buying, setBuying] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [purchaseId, setPurchaseId] = useState(null);
  const [checkoutAmount, setCheckoutAmount] = useState(0);
  const [downloadToken, setDownloadToken] = useState(null);

  useEffect(() => {
    loadImage();
  }, [slug]);

  const loadImage = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await imagesApi.getImageBySlug(slug);
      setImage(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const startFileDownload = (url, filename) => {
    const a = document.createElement('a');
    a.href = url.startsWith('http') || url.startsWith('/') ? url : resolveMediaUrl(url);
    a.download = filename || `${image?.slug || image?.id || 'image'}.jpg`;
    a.target = '_blank';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleSave = async () => {
    try {
      if (isSaved) {
        await imagesApi.unsaveImage(image.id);
      } else {
        await imagesApi.saveImage(image.id);
      }
      setIsSaved(!isSaved);
    } catch (err) {
      console.error('Error saving image:', err);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await imagesApi.downloadImage(image.id || image.slug, downloadToken);
      const url = res?.data?.download_url || resolveMediaUrl(image.main_image_url || image.main_image);
      startFileDownload(url, res?.data?.filename);
    } catch (err) {
      if (err?.status === 402 || String(err?.message || '').toLowerCase().includes('purchase')) {
        toast.error('Buy a license first to download this image');
        handlePurchase();
        return;
      }
      toast.error(err?.message || 'Download failed');
    }
  };

  const handlePurchase = async () => {
    if (!image) return;
    if (!requireAuth(`/images/${slug}`, 'Log in to buy this image license.')) return;

    setBuying(true);
    try {
      const res = await imagesApi.purchaseImage(image.id, {
        license_type: image.license_type || 'royalty_free',
      });
      const data = res?.data || res;

      if (data?.payment_status === 'completed') {
        setDownloadToken(data.download_token);
        if (data.download_url) {
          const dl = await imagesApi.downloadImage(image.id, data.download_token);
          startFileDownload(dl?.data?.download_url || data.download_url, dl?.data?.filename);
        }
        toast.success('License unlocked — download started');
        loadImage();
        return;
      }

      if (!data?.purchase_id) throw new Error(res?.message || 'Could not start checkout');
      setPurchaseId(data.purchase_id);
      setCheckoutAmount(Number(data.amount ?? image?.standard_price ?? image?.royalty_free_price ?? 0) || 0);
      setCheckoutOpen(true);
      toast.success('Complete PayPal to unlock download');
    } catch (err) {
      toast.error(err?.message || 'Purchase failed');
    } finally {
      setBuying(false);
    }
  };

  const handlePaymentSuccess = async (details) => {
    if (!purchaseId) return;
    try {
      const res = await imagesApi.confirmImagePurchase(purchaseId, {
        payment_id: details.paymentId || details.id,
        payment_method: details?.paymentMethod || details?.payment_method || 'paypal',
      });
      const data = res?.data || res;
      setDownloadToken(data.download_token);
      setCheckoutOpen(false);
      setPurchaseId(null);
      if (data.download_url) {
        const dl = await imagesApi.downloadImage(image.id, data.download_token);
        startFileDownload(dl?.data?.download_url || data.download_url, dl?.data?.filename);
      }
      toast.success('Payment complete — download unlocked');
      loadImage();
    } catch (err) {
      toast.error(err?.message || 'Payment confirmation failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton backHref="/images" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading image...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton backHref="/images" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Image not found'}</p>
            <button
              onClick={() => navigate('/images')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Images
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const imageUrl = resolveMediaUrl(image.main_image_url || image.main_image);
  const price = Number(
    image.standard_price ?? image.royalty_free_price ?? image.price ?? 0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar showBackButton backHref="/images" />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="page-container py-4">
          <button
            onClick={() => navigate('/images')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Images</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-container py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative aspect-[4/3] bg-gray-100">
              <img
                src={imageUrl}
                alt={image.title}
                className="w-full h-full object-contain"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {image.verification_status === 'verified' && (
                  <div className="bg-green-600 text-white text-sm px-3 py-1 rounded-full flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Verified</span>
                  </div>
                )}
                {image.promotion_tier && image.promotion_tier !== 'standard' && (
                  <div className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full font-medium">
                    {image.promotion_badge || image.promotion_tier}
                  </div>
                )}
              </div>
            </div>

            {/* Image Info */}
            <div className="p-4 border-t">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{image.resolution_width || image.width} × {image.resolution_height || image.height} px</span>
                <span className="capitalize">{image.orientation}</span>
                <span className="capitalize">{image.color_type?.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{image.title}</h1>
              <p className="text-gray-600 mb-4">{image.description}</p>
              
              {/* Price */}
              <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {image.currency || '£'}{image.display_price?.amount || image.standard_price}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">License</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">
                    {image.license_label || image.license_type?.replace('_', ' ')}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Eye className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <p className="text-lg font-semibold text-gray-900">{image.views_count || 0}</p>
                  <p className="text-xs text-gray-600">Views</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Download className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <p className="text-lg font-semibold text-gray-900">{image.downloads_count || 0}</p>
                  <p className="text-xs text-gray-600">Downloads</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Heart className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <p className="text-lg font-semibold text-gray-900">{image.saves_count || 0}</p>
                  <p className="text-xs text-gray-600">Saves</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Star className="w-5 h-5 mx-auto mb-1 text-yellow-400 fill-yellow-400" />
                  <p className="text-lg font-semibold text-gray-900">{typeof image.rating === 'number' ? image.rating.toFixed(1) : '0.0'}</p>
                  <p className="text-xs text-gray-600">Rating</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handlePurchase}
                  disabled={buying}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium disabled:opacity-60"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {buying
                    ? 'Starting…'
                    : price > 0
                      ? `Buy license · $${Number(price).toFixed(2)}`
                      : 'Get free license'}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSave}
                  className={`px-6 py-3 rounded-lg transition flex items-center gap-2 ${isSaved ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Seller Info */}
            {image.user && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-medium text-gray-600">
                    {image.user.first_name?.[0] || image.contact_name?.[0] || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">
                        {image.user.first_name || image.contact_name || 'Unknown'}
                      </p>
                      {image.is_verified_creator && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{image.contact_email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* License Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                License Details
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>License Type:</span>
                  <span className="font-medium text-gray-900 capitalize">{image.license_label || image.license_type?.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Commercial Use:</span>
                  <span className="font-medium text-green-600">Yes</span>
                </div>
                <div className="flex justify-between">
                  <span>Modification:</span>
                  <span className="font-medium text-green-600">Allowed</span>
                </div>
                <div className="flex justify-between">
                  <span>Resale:</span>
                  <span className="font-medium text-green-600">Allowed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthenticCheckoutModal
        open={checkoutOpen}
        onClose={() => {
          setCheckoutOpen(false);
          setPurchaseId(null);
        }}
        title="Buy image license"
        description={`Unlock “${image.title}” for commercial use. Download starts after PayPal confirms.`}
        amount={checkoutAmount}
        upsellType="image_purchase"
        upsellId={purchaseId}
        onSuccess={handlePaymentSuccess}
        onError={() => toast.error('PayPal payment failed')}
        footerNote="Download is unlocked only after successful payment."
      />
      <Footer />
    </div>
  );
};

export default ImageDetailPage;
