import React from "react";
import { useNavigate } from "react-router-dom";
import StoreList from "../Component/StoreList";
import BrowseMarketplaceHero from "../Component/shared/BrowseMarketplaceHero";
import CategoryPageShell from "../Component/shared/CategoryPageShell";
import useAuthRedirect from "../hooks/useAuthRedirect";
import { getCategoryTheme } from "../constants/categoryThemes";

const HERO_BG =
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1920&q=80";

const StoresPage = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuthRedirect();
  const theme = getCategoryTheme("stores");

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
          eyebrow="Stores"
          subtitle={theme.description}
          imageUrl={HERO_BG}
          theme={theme.heroTheme}
        />
      }
      bottomCta={{
        buttonLabel: "Create your store",
        onPostClick: handleListStore,
      }}
    >
      <StoreList embedded />
    </CategoryPageShell>
  );
};

export default StoresPage;