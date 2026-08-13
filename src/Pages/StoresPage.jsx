import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaStore, FaPercentage, FaShieldAlt, FaTruck, FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import StoreList from "../Component/StoreList";
import BrowseMarketplaceHero from "../Component/shared/BrowseMarketplaceHero";
import CategoryPageShell from "../Component/shared/CategoryPageShell";
import MarketplaceCategoryCards from "../Component/shared/MarketplaceCategoryCards";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import { getCategoryTheme } from "../constants/categoryThemes";
import StoreServices from "../services/StoreServices";
import { isBusinessAccount } from "../utils/accountType";

const HERO_BG =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80";

/** Platform take-rate on completed store sales (sellers keep the rest). Matches backend commerce.platform_fee_percent. */
export const STORE_PLATFORM_FEE_PERCENT = Number(
  process.env.REACT_APP_PLATFORM_FEE_PERCENT || 15
);

const FALLBACK_CATEGORIES = [
  { id: "fashion", name: "Fashion", slug: "fashion", count: 0 },
  { id: "electronics", name: "Electronics", slug: "electronics", count: 0 },
  { id: "home", name: "Home & Living", slug: "home", count: 0 },
  { id: "food", name: "Food & Grocery", slug: "food", count: 0 },
  { id: "beauty", name: "Beauty", slug: "beauty", count: 0 },
  { id: "sports", name: "Sports", slug: "sports", count: 0 },
  { id: "services", name: "Services", slug: "services", count: 0 },
  { id: "other", name: "Other", slug: "other", count: 0 },
];

const EXAMPLE_PRODUCTS = [
  {
    title: "Hand-loom throw",
    price: "$48",
    img: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Ceramic pour-over set",
    price: "$36",
    img: "https://images.unsplash.com/photo-1493106641515-6ad53afa4dc6?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Walnut desk tray",
    price: "$62",
    img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Linen apron",
    price: "$29",
    img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
  },
];

/**
 * Online Stores hub — marketplace-style storefronts with platform sales fee.
 * Inspired by curated multi-vendor markets (not a clone of Etsy/Amazon).
 */
const StoresPage = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuthRedirect();
  const { userDetail, logIn } = useSelector((store) => store.auth);
  const canManageStore = !logIn || isBusinessAccount(userDetail);
  const theme = getCategoryTheme("stores");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [categories, setCategories] = React.useState(FALLBACK_CATEGORIES);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await StoreServices.getStoreCategories();
        const rows = res?.data?.data || res?.data || [];
        if (!cancelled && Array.isArray(rows) && rows.length) {
          setCategories(rows);
        }
      } catch {
        if (!cancelled) setCategories(FALLBACK_CATEGORIES);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleListStore = () => {
    if (
      requireAuth("/dashboard?tab=store&mode=selling", "You must be logged in to list a store.")
    ) {
      if (!isBusinessAccount(userDetail)) {
        toast.error('Store management requires a Business account.');
        navigate('/dashboard?mode=buying');
        return;
      }
      navigate("/dashboard?tab=store&mode=selling");
    }
  };

  return (
    <CategoryPageShell
      categoryId="stores"
      backHref="/"
      showBackBar
      backBarTo="/"
      backBarLabel="Back Home"
      hero={
        <BrowseMarketplaceHero
          title="Online Stores"
          eyebrow="Sell worldwide"
          subtitle={`Open a storefront, sell to buyers on Worldwide Adverts, and keep ${
            100 - STORE_PLATFORM_FEE_PERCENT
          }% — we take a ${STORE_PLATFORM_FEE_PERCENT}% platform fee on completed sales.`}
          imageUrl={HERO_BG}
          theme={theme.heroTheme}
        />
      }
      categoryGrid={
        <MarketplaceCategoryCards
          categories={categories}
          selectedId={selectedCategory === "all" ? null : selectedCategory}
          title="Store types"
          subtitle="Browse live online stores by market."
          countLabel="stores"
          getId={(c) => c.slug || c.id}
          getLabel={(c) => c.name}
          getSlug={(c) => c.slug || c.id}
          getCount={(c) => c.count}
          onSelect={(cat, id) => {
            const next = String(id || cat.slug);
            setSelectedCategory(next === String(selectedCategory) ? "all" : next);
          }}
          accentRing="ring-teal-500"
          accentBorder="border-teal-300"
          hoverBorder="hover:border-teal-200"
          hoverTitle="group-hover:text-teal-800"
          hoverArrow="group-hover:bg-teal-100 group-hover:text-teal-800"
        />
      }
      beforeFilters={
        <div className="mb-6 space-y-5">
          <section className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-5 sm:p-6">
            <div className="flex flex-wrap items-start gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-white shadow">
                <FaPercentage className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-slate-900">How selling works</h2>
                <p className="mt-1 text-sm text-slate-600 max-w-3xl">
                  Worldwide Adverts Online Store is a multi-vendor marketplace. You list products in
                  your store; buyers pay securely; we deduct a transparent{" "}
                  <strong>{STORE_PLATFORM_FEE_PERCENT}% platform fee</strong> from each completed
                  order and pay out the remainder to you.
                </p>
                <ul className="mt-3 grid sm:grid-cols-3 gap-3 text-xs text-slate-700">
                  <li className="flex gap-2 rounded-lg bg-white/80 border border-teal-100 p-3">
                    <FaStore className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
                    Create a branded storefront from your business dashboard
                  </li>
                  <li className="flex gap-2 rounded-lg bg-white/80 border border-teal-100 p-3">
                    <FaShieldAlt className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
                    Checkout via PayPal with order confirmation
                  </li>
                  <li className="flex gap-2 rounded-lg bg-white/80 border border-teal-100 p-3">
                    <FaTruck className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
                    You fulfil orders; platform fee only on paid sales
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="grid lg:grid-cols-[1.1fr_1fr]">
              <div
                className="relative min-h-[200px] bg-cover bg-center"
                style={{
                  backgroundImage:
                    "linear-gradient(120deg, rgba(15,23,42,0.72), rgba(15,118,110,0.45)), url('https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80')",
                }}
              >
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-teal-100/90 font-semibold">
                    Example storefront
                  </p>
                  <h3 className="text-2xl font-bold mt-1">WWA Atelier</h3>
                  <p className="text-sm text-white/85 mt-1 max-w-md">
                    Example Worldwide Adverts Market storefront — curated goods, PayPal checkout,
                    and a {STORE_PLATFORM_FEE_PERCENT}% platform fee on sales.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-amber-200">
                    <FaStar className="h-3.5 w-3.5" />
                    4.9 · 128 sales · Ships worldwide
                  </div>
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">
                  Featured products
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {EXAMPLE_PRODUCTS.map((p) => (
                    <div
                      key={p.title}
                      className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50"
                    >
                      <img
                        src={p.img}
                        alt=""
                        className="h-24 w-full object-cover"
                        loading="lazy"
                      />
                      <div className="p-2.5">
                        <p className="text-xs font-semibold text-slate-900 line-clamp-1">{p.title}</p>
                        <p className="text-sm font-bold text-teal-800 mt-0.5">{p.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[11px] text-slate-500">
                  Fee example: a $50 sale → ${((50 * STORE_PLATFORM_FEE_PERCENT) / 100).toFixed(2)}{" "}
                  platform fee · ${(50 * (1 - STORE_PLATFORM_FEE_PERCENT / 100)).toFixed(2)} to
                  seller.
                </p>
                <Link
                  to="/store/wwa-atelier"
                  className="mt-3 inline-flex items-center justify-center w-full sm:w-auto px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800"
                >
                  Visit example store
                </Link>
                <button
                  type="button"
                  onClick={handleListStore}
                  className="mt-2 sm:mt-3 sm:ml-2 inline-flex items-center justify-center w-full sm:w-auto px-4 py-2.5 rounded-lg text-sm font-semibold text-teal-900 bg-white border border-teal-300 hover:bg-teal-50"
                >
                  Open your store
                </button>
                {canManageStore ? (
                  <Link
                    to="/dashboard?tab=store&mode=selling"
                    className="mt-2 block text-center sm:text-left text-xs font-medium text-teal-800 hover:underline"
                  >
                    Manage store & products in dashboard
                  </Link>
                ) : (
                  <Link
                    to="/dashboard?mode=buying"
                    className="mt-2 block text-center sm:text-left text-xs font-medium text-teal-800 hover:underline"
                  >
                    Browse & purchase in your dashboard
                  </Link>
                )}
              </div>
            </div>
          </section>
        </div>
      }
      bottomCta={{
        buttonLabel: "Create your store",
        onPostClick: handleListStore,
      }}
    >
      <StoreList embedded category={selectedCategory === "all" ? "" : selectedCategory} />
    </CategoryPageShell>
  );
};

export default StoresPage;
