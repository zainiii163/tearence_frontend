import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import StoreList from "../Component/StoreList";
import BrowseMarketplaceHero from "../Component/shared/BrowseMarketplaceHero";
import CategoryPageShell from "../Component/shared/CategoryPageShell";
import MarketplaceCategoryCards from "../Component/shared/MarketplaceCategoryCards";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import { getCategoryTheme } from "../constants/categoryThemes";
import StoreServices from "../services/StoreServices";
import { isBusinessAccount } from "../utils/accountType";
import { DEMO_STORES } from "../data/storesDemo";

const HERO_BG =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80";

export const STORE_PLATFORM_FEE_PERCENT = Number(
  process.env.REACT_APP_PLATFORM_FEE_PERCENT || 15
);

const FALLBACK_CATEGORIES = [
  { id: "fashion", name: "Fashion", slug: "fashion", count: DEMO_STORES.filter((s) => s.category === "fashion").length },
  { id: "electronics", name: "Electronics", slug: "electronics", count: DEMO_STORES.filter((s) => s.category === "electronics").length },
  { id: "home", name: "Home & Living", slug: "home", count: DEMO_STORES.filter((s) => s.category === "home").length },
  { id: "food", name: "Food & Grocery", slug: "food", count: DEMO_STORES.filter((s) => s.category === "food").length },
  { id: "beauty", name: "Beauty", slug: "beauty", count: DEMO_STORES.filter((s) => s.category === "beauty").length },
  { id: "sports", name: "Sports", slug: "sports", count: DEMO_STORES.filter((s) => s.category === "sports").length },
  { id: "services", name: "Services", slug: "services", count: 0 },
  { id: "other", name: "Other", slug: "other", count: 0 },
];

/**
 * Online Stores hub — category chips + store list (Etsy-style browse).
 * Store detail (banner, about, featured products, buy) lives on /store/:slug.
 */
const StoresPage = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuthRedirect();
  const { userDetail } = useSelector((store) => store.auth);
  const theme = getCategoryTheme("stores");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [categories, setCategories] = React.useState(FALLBACK_CATEGORIES);
  const [topSearch, setTopSearch] = React.useState("");

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
        toast.error("Store management requires a Business account.");
        navigate("/dashboard?mode=buying");
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
          eyebrow=""
          imageUrl={HERO_BG}
          theme={theme.heroTheme}
          searchValue={topSearch}
          onSearchChange={(e) => setTopSearch(e.target.value)}
          searchPlaceholder="Search stores…"
        />
      }
      categoryGrid={
        <MarketplaceCategoryCards
          categories={categories}
          selectedId={selectedCategory === "all" ? null : selectedCategory}
          title="Categories"
          subtitle="Open a category, then visit a store for products and checkout."
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
