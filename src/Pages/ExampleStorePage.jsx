import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaStore, FaPercentage, FaStar, FaShieldAlt } from 'react-icons/fa';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import BrowsePageBackBar from '../Component/shared/BrowsePageBackBar';
import AuthenticCheckoutModal from '../Component/Payment/AuthenticCheckoutModal';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import Api from '../api';

export const STORE_PLATFORM_FEE_PERCENT = Number(
  process.env.REACT_APP_PLATFORM_FEE_PERCENT || 15
);

const FALLBACK_PRODUCTS = [
  {
    id: 'demo-1',
    slug: 'hand-loom-throw',
    title: 'Hand-loom throw',
    description: 'Soft woven throw in ocean teal — ships worldwide.',
    price: 48,
    image_url:
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'demo-2',
    slug: 'ceramic-pour-over',
    title: 'Ceramic pour-over set',
    description: 'Stoneware dripper and cup for daily ritual coffee.',
    price: 36,
    image_url:
      'https://images.unsplash.com/photo-1493106641515-6ad53afa4dc6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'demo-3',
    slug: 'walnut-desk-tray',
    title: 'Walnut desk tray',
    description: 'Solid walnut organiser for keys, cards and pens.',
    price: 62,
    image_url:
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'demo-4',
    slug: 'linen-apron',
    title: 'Linen apron',
    description: 'Washed linen apron with deep pockets for makers.',
    price: 29,
    image_url:
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'demo-5',
    slug: 'brass-candle-set',
    title: 'Brass candle set',
    description: 'Pair of brushed brass holders with beeswax tapers.',
    price: 54,
    image_url:
      'https://images.unsplash.com/photo-1602874801006-e26c4c6b0c0a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'demo-6',
    slug: 'travel-journal',
    title: 'Travel journal',
    description: 'Cloth-bound notebook with map endpapers.',
    price: 22,
    image_url:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  },
];

/**
 * Unique Worldwide Adverts example market storefront (not an Etsy/Amazon clone).
 * Buyers checkout via PayPal; platform fee is recorded on the order.
 */
const ExampleStorePage = () => {
  const { requireAuth } = useAuthRedirect();
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [feePercent, setFeePercent] = useState(STORE_PLATFORM_FEE_PERCENT);
  const [checkout, setCheckout] = useState(null);
  const [buyingId, setBuyingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await Api.get('store/example/catalogue');
        const data = res?.data?.data || res?.data || {};
        const list = data.products || [];
        if (!cancelled && Array.isArray(list) && list.length) {
          setProducts(list);
        }
        if (!cancelled && data.fee_percent != null) {
          setFeePercent(Number(data.fee_percent) || STORE_PLATFORM_FEE_PERCENT);
        }
      } catch {
        /* keep fallback catalogue */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const feeNote = useMemo(() => {
    const sample = 50;
    const fee = (sample * feePercent) / 100;
    return `On a $${sample} sale, Worldwide Adverts keeps $${fee.toFixed(2)} (${feePercent}%) and the seller receives $${(sample - fee).toFixed(2)}.`;
  }, [feePercent]);

  const startBuy = async (product) => {
    if (
      !requireAuth(
        '/store/wwa-atelier',
        'You must be logged in to buy from Online Stores.'
      )
    ) {
      return;
    }

    setBuyingId(product.id || product.slug);
    try {
      const res = await Api.post('store/orders', {
        product_id: product.id,
        product_slug: product.slug,
        title: product.title,
        amount: product.price,
      });
      const data = res?.data?.data || res?.data || {};
      const amount = Number(data.amount ?? product.price) || 0;
      setCheckout({
        orderId: data.order_id || data.purchase_id,
        title: data.title || product.title,
        amount,
        feePercent: Number(data.fee_percent ?? feePercent),
        platformFee: Number(data.platform_fee ?? (amount * feePercent) / 100),
        sellerAmount: Number(
          data.seller_amount ?? amount * (1 - feePercent / 100)
        ),
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not start checkout');
    } finally {
      setBuyingId(null);
    }
  };

  const confirmPaid = async (payment) => {
    if (!checkout?.orderId) {
      toast.success('Payment received');
      setCheckout(null);
      return;
    }
    try {
      await Api.post(`store/orders/${checkout.orderId}/confirm`, {
        payment_id: payment?.id || payment?.paymentID || payment?.orderID || 'paypal',
        payment_method: payment?.paymentMethod || payment?.payment_method || 'paypal',
      });
      toast.success('Order paid — seller payout minus platform fee is recorded');
      setCheckout(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Payment confirm failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1f24]">
      <UnifiedNavbar showBackButton backHref="/stores" />

      <section className="relative overflow-hidden border-b border-teal-900/40">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1f24] via-[#0b1f24]/85 to-teal-900/50" />
        <div className="relative page-container py-12 sm:py-16">
          <p className="text-[11px] uppercase tracking-[0.22em] text-teal-200/90 font-semibold">
            Worldwide Adverts Market
          </p>
          <h1 className="mt-2 text-3xl sm:text-5xl font-bold text-white tracking-tight">
            WWA Atelier
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-teal-50/85">
            A curated multi-vendor example storefront. Makers sell worldwide; we take a transparent{' '}
            {feePercent}% platform fee on completed sales.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs text-teal-100">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/40 bg-teal-950/40 px-3 py-1.5">
              <FaStar className="h-3 w-3 text-amber-300" /> 4.9 example rating
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/40 bg-teal-950/40 px-3 py-1.5">
              <FaPercentage className="h-3 w-3" /> {feePercent}% platform fee
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/40 bg-teal-950/40 px-3 py-1.5">
              <FaShieldAlt className="h-3 w-3" /> PayPal checkout
            </span>
          </div>
        </div>
      </section>

      <div className="bg-[#f3f7f6] min-h-[50vh]">
        <div className="page-container py-5 sm:py-8">
          <BrowsePageBackBar to="/stores" label="Back to Online Stores" />

          <div className="mb-6 rounded-2xl border border-teal-200 bg-white p-4 sm:p-5 flex flex-wrap gap-4 items-start">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-teal-700 text-white">
              <FaStore className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-slate-900">How selling works here</h2>
              <p className="mt-1 text-sm text-slate-600">{feeNote}</p>
              <Link
                to="/dashboard?tab=store"
                className="mt-2 inline-block text-sm font-semibold text-teal-800 hover:underline"
              >
                Open your own store in the dashboard →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => {
              const price = Number(p.price) || 0;
              const fee = (price * feePercent) / 100;
              const seller = price - fee;
              return (
                <article
                  key={p.id || p.slug}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={p.image_url || p.img}
                    alt=""
                    className="h-44 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900">{p.title}</h3>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{p.description}</p>
                    <p className="mt-3 text-lg font-bold text-teal-900">${price.toFixed(2)}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Fee ${fee.toFixed(2)} · Seller ${seller.toFixed(2)}
                    </p>
                    <button
                      type="button"
                      disabled={buyingId === (p.id || p.slug)}
                      onClick={() => startBuy(p)}
                      className="mt-3 w-full rounded-lg bg-teal-800 hover:bg-teal-900 text-white text-sm font-semibold py-2.5 disabled:opacity-60"
                    >
                      {buyingId === (p.id || p.slug) ? 'Starting…' : 'Buy with PayPal'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <AuthenticCheckoutModal
        open={Boolean(checkout)}
        onClose={() => setCheckout(null)}
        title={checkout?.title || 'Checkout'}
        description={
          checkout
            ? `Total $${checkout.amount.toFixed(2)}. Platform fee ${checkout.feePercent}% ($${checkout.platformFee.toFixed(2)}); seller receives $${checkout.sellerAmount.toFixed(2)}.`
            : ''
        }
        amount={checkout?.amount || 0}
        upsellType="store_order"
        upsellId={checkout?.orderId}
        onSuccess={confirmPaid}
        onError={() => toast.error('Payment failed')}
        footerNote="Worldwide Adverts Market — transparent seller fees on every completed order."
      />

      <Footer />
    </div>
  );
};

export default ExampleStorePage;
