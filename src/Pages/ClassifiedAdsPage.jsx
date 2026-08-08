import React from "react";
import { useNavigate } from "react-router-dom";
import ModernCategoryPage from "../Component/CategoryPage/ModernCategoryPage";
import CategoryItem from "../Component/CategoryPage/CategoryItem";
import BrowseMarketplaceHero from "../Component/shared/BrowseMarketplaceHero";
import CategoryPageShell from "../Component/shared/CategoryPageShell";
import useAuthRedirect from "../hooks/useAuthRedirect";
import { getCategoryTheme } from "../constants/categoryThemes";
import { getClassifiedAdsModern } from "../slice/ListSlice";

const HERO_BG =
  "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1920&q=80";

const ClassifiedAdsPage = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuthRedirect();
  const theme = getCategoryTheme("classifieds");

  const handlePostClassified = () => {
    if (requireAuth("/postclassified", "You must be logged in to post a classified advert.")) {
      navigate("/postclassified");
    }
  };

  return (
    <CategoryPageShell
      categoryId="classifieds"
      backHref="/"
      hero={
        <BrowseMarketplaceHero
          title={theme.name}
          eyebrow="Marketplace"
          subtitle={theme.description}
          imageUrl={HERO_BG}
          theme={theme.heroTheme}
        />
      }
      bottomCta={{
        buttonLabel: "Post an advert",
        onPostClick: handlePostClassified,
      }}
    >
      <ModernCategoryPage
        embedded
        categoryType="classified-ads"
        getDataAction={getClassifiedAdsModern}
        dataSelector={(store) => store.ads.catAdsList || { items: [], total: 0 }}
        itemComponent={CategoryItem}
        filters={[
          { key: "priceRange", label: "Price Range", type: "select" },
          { key: "location", label: "Location", type: "text" },
          { key: "category", label: "Category", type: "select" },
        ]}
        sortOptions={[
          { value: "newest", label: "Newest First" },
          { value: "oldest", label: "Oldest First" },
          { value: "price_low", label: "Price: Low to High" },
          { value: "price_high", label: "Price: High to Low" },
          { value: "relevance", label: "Most Relevant" },
        ]}
      />
    </CategoryPageShell>
  );
};

export default ClassifiedAdsPage;
