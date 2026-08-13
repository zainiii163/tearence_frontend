import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Heart,
  Share2,
  ExternalLink,
  Star,
  Eye,
  BookOpen,
  User,
  FileText,
  Download,
  Loader2,
  X,
  Mail,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Headphones,
} from 'lucide-react';
import toast from 'react-hot-toast';
import BooksAPI from '../../services/booksAPI';
import { getBookCoverUrl, getBookMediaUrl } from '../../utils/bookFormHelpers';
import AuthenticCheckoutModal from '../Payment/AuthenticCheckoutModal';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';
import { isPayPalSandboxDemo } from '../../utils/paypalConfig';

const PROMOTION_LABELS = {
  standard: null,
  basic: null,
  promoted: 'Promoted',
  featured: 'Featured',
  sponsored: 'Sponsored',
  top_category: 'Top of Category',
};

const FORMAT_META = {
  paperback: { label: 'Paperback', hint: 'Ships from the seller after payment' },
  hardcover: { label: 'Hardcover', hint: 'Ships from the seller after payment' },
  ebook: { label: 'eBook', hint: 'Digital access after PayPal confirms' },
  audiobook: { label: 'Audiobook', hint: 'Digital access after PayPal confirms' },
};

const money = (amount, currency = 'USD') => {
  const n = Number(amount);
  if (Number.isNaN(n)) return '—';
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency || 'USD',
    }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
};

const BookDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [buying, setBuying] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [selectedFormat, setSelectedFormat] = useState('');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutPurchaseId, setCheckoutPurchaseId] = useState(null);
  const [checkoutAmount, setCheckoutAmount] = useState(0);
  const [owned, setOwned] = useState(false);
  const [purchaseInfo, setPurchaseInfo] = useState(null);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await BooksAPI.getBookBySlug(slug);

      if (response.success) {
        const data = response.data;
        setBook(data);
        setIsSaved(!!data.is_saved);
        setCoverError(false);
        setCurrentImageIndex(0);
        setSelectedFormat(data.format || 'paperback');
        setOwned(!!data.is_purchased);
        setPurchaseInfo(data.purchase || null);
        if (data?.id) {
          BooksAPI.incrementViews(data.id).catch(() => {});
        }
      } else {
        setError(response.message || 'Book not found');
        setBook(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to load book details');
      setBook(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchBookDetails();
  }, [slug]);

  const priceLabel = useMemo(() => {
    if (!book) return '';
    const p = Number(book.price);
    if (!p || p <= 0) return 'Free';
    return money(p, book.currency);
  }, [book]);

  const formatMeta = FORMAT_META[selectedFormat] || FORMAT_META.paperback;
  const isDigital = selectedFormat === 'ebook' || selectedFormat === 'audiobook';
  const promotionLabel = book ? PROMOTION_LABELS[book.advert_type] : null;

  const handleSaveBook = async () => {
    if (!book || saving) return;
    if (!requireAuth(`/books/${slug}`, 'Log in to save books.')) return;

    setSaving(true);
    try {
      const response = await BooksAPI.saveBook(book.id, !isSaved);
      if (response.success) {
        setIsSaved(!isSaved);
        toast.success(isSaved ? 'Removed from saved' : 'Book saved');
      }
    } catch (err) {
      toast.error(err.message || 'Could not save book');
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: book.title,
          text: book.short_description || book.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    } catch {
      /* cancelled */
    }
  };

  const applyOwnedState = (data) => {
    setOwned(true);
    setPurchaseInfo({
      purchase_id: data.purchase_id,
      format: data.format,
      download_token: data.download_token,
      download_url: data.download_url,
      seller_email: data.seller_email,
      fulfillment: data.fulfillment,
    });
  };

  const startDownload = (url) => {
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleBuy = async () => {
    if (!book) return;
    if (!requireAuth(`/books/${slug}`, 'Log in to buy this book.')) return;

    setBuying(true);
    try {
      const response = await BooksAPI.purchaseBook(book.id, {
        format: selectedFormat || book.format,
      });
      const data = response?.data || response;

      if (data?.payment_status === 'completed') {
        applyOwnedState(data);
        if (data.download_url && (data.fulfillment === 'digital' || isDigital)) {
          startDownload(data.download_url);
          toast.success('Purchase complete — download started.');
        } else {
          toast.success('Order confirmed. The seller will fulfill your copy.');
        }
        return;
      }

      if (!data?.purchase_id) {
        throw new Error(response?.message || 'Could not start checkout');
      }

      setCheckoutPurchaseId(data.purchase_id);
      setCheckoutAmount(Number(data.amount ?? book.price) || 0);
      setCheckoutOpen(true);
      toast.success('Order ready — pay with PayPal to finish.');
    } catch (err) {
      toast.error(err.message || 'Purchase failed. Try again.');
    } finally {
      setBuying(false);
    }
  };

  const handlePaymentSuccess = async (details) => {
    if (!checkoutPurchaseId) return;
    try {
      const response = await BooksAPI.confirmBookPurchase(checkoutPurchaseId, {
        payment_id: details.paymentId || details.id,
        payment_method: details?.paymentMethod || details?.payment_method || 'paypal',
      });
      const data = response?.data || response;
      applyOwnedState(data);
      setCheckoutOpen(false);
      setCheckoutPurchaseId(null);

      if (data.download_url && data.fulfillment === 'digital') {
        startDownload(data.download_url);
        toast.success('Payment complete — your download is starting.');
      } else {
        toast.success('Payment complete — your order is confirmed.');
      }
    } catch (err) {
      toast.error(err.message || 'Payment confirmation failed');
    }
  };

  const handleOwnedAction = () => {
    if (purchaseInfo?.download_url) {
      startDownload(purchaseInfo.download_url);
      toast.success('Download started');
      return;
    }
    setShowContactModal(true);
  };

  const resolveSampleUrl = (sample) => {
    if (!sample) return null;
    if (typeof sample === 'string') return getBookMediaUrl(sample);
    return getBookMediaUrl(sample.path || sample.url);
  };

  const handleSampleDownload = (sample) => {
    const url = resolveSampleUrl(sample);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const sellerEmail = book?.user?.email || purchaseInfo?.seller_email;
    if (!sellerEmail) {
      toast.error('Author contact email is not available');
      return;
    }
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      toast.error('Please fill in all contact fields');
      return;
    }
    const orderNote = purchaseInfo?.purchase_id
      ? `\n\nOrder ID: ${purchaseInfo.purchase_id}`
      : '';
    const subject = encodeURIComponent(`Book enquiry: "${book.title}"`);
    const body = encodeURIComponent(
      `From: ${contactForm.name} <${contactForm.email}>\n\n${contactForm.message}${orderNote}`
    );
    window.location.href = `mailto:${sellerEmail}?subject=${subject}&body=${body}`;
    setShowContactModal(false);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
        {hasHalfStar && <Star className="w-4 h-4 fill-amber-200 text-amber-400" />}
        <span className="ml-2 text-sm font-medium text-gray-700">{rating}</span>
      </div>
    );
  };

  useEffect(() => {
    setCoverError(false);
  }, [currentImageIndex]);

  const coverUrl = book ? getBookCoverUrl(book) : null;
  const getCurrentImage = () => {
    if (!book) return null;
    if (currentImageIndex === 0) return coverUrl;
    const extra = book.additional_images?.[currentImageIndex - 1];
    return getBookMediaUrl(extra) || coverUrl;
  };
  const currentImageUrl = getCurrentImage();
  const purchaseLinks = Array.isArray(book?.purchase_links) ? book.purchase_links : [];
  const sampleFiles = Array.isArray(book?.sample_files) ? book.sample_files : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading book…</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center px-4">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-medium text-gray-900 mb-1">{error || 'Book not found'}</p>
          <button
            type="button"
            onClick={() => navigate('/books')}
            className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f3ee]">
      <div className="bg-white border-b border-amber-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate('/books')}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Books & Literature
          </button>
          {book.genre && (
            <Link
              to={`/books/category/${String(book.genre).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="text-sm text-amber-800 hover:underline"
            >
              {book.genre}
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_300px] gap-8 items-start">
          {/* Cover */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm">
              {!coverError && currentImageUrl ? (
                <img
                  src={currentImageUrl}
                  alt={book.title}
                  className="w-full aspect-[2/3] object-cover rounded-xl shadow-md"
                  onError={() => setCoverError(true)}
                />
              ) : (
                <div className="w-full aspect-[2/3] rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-amber-700" />
                </div>
              )}
              {Array.isArray(book.additional_images) && book.additional_images.length > 0 && (
                <div className="flex gap-2 mt-3 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setCurrentImageIndex(0)}
                    className={`w-14 h-20 rounded-lg overflow-hidden border-2 shrink-0 ${
                      currentImageIndex === 0 ? 'border-amber-600' : 'border-transparent'
                    }`}
                  >
                    <img src={coverUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                  {book.additional_images.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentImageIndex(index + 1)}
                      className={`w-14 h-20 rounded-lg overflow-hidden border-2 shrink-0 ${
                        currentImageIndex === index + 1 ? 'border-amber-600' : 'border-transparent'
                      }`}
                    >
                      <img src={getBookMediaUrl(img)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product info */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {book.verified_author && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800">
                  Verified author
                </span>
              )}
              {promotionLabel && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900">
                  {promotionLabel}
                </span>
              )}
              {owned && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800">
                  Purchased
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">
              {book.title}
            </h1>
            <p className="text-lg text-gray-700 mb-4">
              by <span className="font-semibold text-amber-900">{book.author_name}</span>
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-5 text-sm text-gray-600">
              {book.rating ? renderStars(Number(book.rating)) : null}
              <span className="inline-flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {(book.views_count || 0).toLocaleString()} views
              </span>
              {book.format && (
                <span className="capitalize rounded-md bg-white border border-amber-100 px-2 py-0.5">
                  {book.format}
                </span>
              )}
            </div>

            {book.short_description && (
              <p className="text-gray-700 mb-4 text-base leading-relaxed">{book.short_description}</p>
            )}

            <section className="bg-white rounded-2xl border border-amber-100 p-5 mb-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About this book</h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{book.description}</p>
            </section>

            <section className="bg-white rounded-2xl border border-amber-100 p-5 mb-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Details</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {[
                  ['Genre', book.genre],
                  ['Language', book.language],
                  ['Publisher', book.publisher],
                  ['ISBN', book.isbn],
                  ['Pages', book.pages],
                  ['Edition', book.edition],
                  ['Country', book.country],
                  [
                    'Published',
                    book.publication_date
                      ? new Date(book.publication_date).toLocaleDateString()
                      : null,
                  ],
                ]
                  .filter(([, v]) => v != null && v !== '')
                  .map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-3 border-b border-gray-50 pb-2">
                      <dt className="text-gray-500">{label}</dt>
                      <dd className="font-medium text-gray-900 text-right">{value}</dd>
                    </div>
                  ))}
              </dl>
            </section>

            {sampleFiles.length > 0 && (
              <section className="bg-white rounded-2xl border border-amber-100 p-5 mb-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Free sample</h2>
                <div className="space-y-2">
                  {sampleFiles.map((sample, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSampleDownload(sample)}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50/50"
                    >
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-900">
                        <FileText className="w-4 h-4 text-amber-700" />
                        {sample.name || sample.title || `Sample ${index + 1}`}
                      </span>
                      <Download className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              </section>
            )}

            {purchaseLinks.length > 0 && (
              <section className="bg-white rounded-2xl border border-amber-100 p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Also available at</h2>
                <p className="text-sm text-gray-500 mb-3">
                  External stores listed by the seller (optional).
                </p>
                <div className="space-y-2">
                  {purchaseLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-amber-300"
                    >
                      <span className="font-medium text-gray-900">{link.platform || 'Store'}</span>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Buy box */}
          <aside className="lg:sticky lg:top-24 space-y-4">
            <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5">
              <div className="mb-1 text-sm text-gray-500">Price</div>
              <div className="text-3xl font-bold text-gray-900 mb-4">{priceLabel}</div>

              <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                disabled={owned}
                className="w-full mb-2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500"
              >
                {Object.entries(FORMAT_META).map(([value, meta]) => (
                  <option key={value} value={value}>
                    {meta.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mb-4 flex items-start gap-1.5">
                {isDigital ? (
                  <Headphones className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                ) : (
                  <Truck className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                )}
                {formatMeta.hint}
              </p>

              {owned ? (
                <button
                  type="button"
                  onClick={handleOwnedAction}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white font-semibold py-3 hover:bg-emerald-700"
                >
                  <Download className="w-4 h-4" />
                  {isDigital || purchaseInfo?.download_url ? 'Download / receipt' : 'Contact seller'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleBuy}
                  disabled={buying}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 text-white font-semibold py-3 hover:bg-amber-700 disabled:opacity-60"
                >
                  {buying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShoppingCart className="w-4 h-4" />
                  )}
                  {Number(book.price) > 0 ? `Buy now · ${priceLabel}` : 'Get free copy'}
                </button>
              )}

              {Number(book.price) > 0 && !owned && (
                <p className="mt-2 text-[11px] text-gray-500 leading-relaxed">
                  Payment goes to Worldwide Adverts. About 85% is credited to the seller; 15% is the platform
                  fee. (Posting/promoting an ad is a separate fee that stays with WWA.)
                </p>
              )}

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveBook}
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2 text-sm hover:bg-gray-50"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                  {isSaved ? 'Saved' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2 text-sm hover:bg-gray-50"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowContactModal(true)}
                className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-amber-200 text-amber-900 py-2 text-sm hover:bg-amber-50"
              >
                <User className="w-4 h-4" />
                Contact author
              </button>

              <ul className="mt-4 space-y-2 text-xs text-gray-600">
                <li className="flex gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  Secure PayPal checkout on World Wide Adverts
                </li>
                <li className="flex gap-2">
                  <ShoppingCart className="w-4 h-4 text-amber-700 shrink-0" />
                  {isDigital
                    ? 'Digital delivery unlocks after payment confirms'
                    : 'Physical copies are fulfilled by the seller'}
                </li>
              </ul>

              {isPayPalSandboxDemo() && !owned && (
                <p className="mt-3 text-[11px] text-amber-800 bg-amber-50 border border-amber-100 rounded-lg p-2">
                  PayPal sandbox mode is active for local testing.
                </p>
              )}

              {!isAuthenticated && (
                <p className="mt-3 text-xs text-gray-500">Sign in required to complete a purchase.</p>
              )}
            </div>
          </aside>
        </div>
      </div>

      <AuthenticCheckoutModal
        open={checkoutOpen}
        onClose={() => {
          setCheckoutOpen(false);
          setCheckoutPurchaseId(null);
        }}
        title="Buy this book"
        description={`Pay for “${book.title}” (${formatMeta.label}). ${
          isDigital
            ? 'Download unlocks after payment confirms.'
            : 'The seller will arrange delivery after payment.'
        } You pay Worldwide Adverts; ~85% is credited to the seller and 15% is the platform fee.`}
        amount={checkoutAmount}
        upsellType="book_purchase"
        upsellId={checkoutPurchaseId}
        onSuccess={handlePaymentSuccess}
        onError={() => toast.error('Payment failed')}
        footerNote="Checkout is to Worldwide Adverts (PayPal or crypto). The seller receives their share of the sale; listing/ad fees stay with WWA."
      />

      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Contact author</h3>
                <button type="button" onClick={() => setShowContactModal(false)} className="p-1">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <form className="space-y-4" onSubmit={handleContactSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg inline-flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Send
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowContactModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookDetails;
