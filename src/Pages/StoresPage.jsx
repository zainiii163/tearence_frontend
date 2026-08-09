import React from "react";
import { useNavigate } from "react-router-dom";
import StoreList from "../Component/StoreList";
import BrowseMarketplaceHero from "../Component/shared/BrowseMarketplaceHero";
import CategoryPageShell from "../Component/shared/CategoryPageShell";
import MarketplaceCategoryCards from "../Component/shared/MarketplaceCategoryCards";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import { getCategoryTheme } from "../constants/categoryThemes";
import StoreServices from "../services/StoreServices";

const HERO_BG =
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1920&q=80";

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

const StoresPage = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuthRedirect();
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
    if (requireAuth("/dashboard?tab=store", "You must be logged in to list a store.")) {
      navigate("/dashboard?tab=store");
    }
  };

  return (
    <CategoryPageShell
      categoryId="stores"
      backHref="/"
      hero={
        <BrowseMarketplaceHero
          title={theme.name}
          eyebrow=""
          subtitle={theme.description}
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
