import React from "react";
import StoreDetail from "../Component/StoreDetail";
import UnifiedNavbar from "../Component/UnifiedNavbar";
import Footer from "../Component/Footer";
import RelatedListingsSection from "../Component/shared/RelatedListingsSection";
import { useParams } from "react-router-dom";

const StoreDetailPage = () => {
  const { id } = useParams();
  return (
    <div>
      <UnifiedNavbar />
      <StoreDetail />
      <div className="page-container pb-10">
        <RelatedListingsSection
          source="stores"
          currentId={id}
          title="Suggested stores"
          subtitle="Related shops"
        />
      </div>
      <Footer />
    </div>
  );
};

export default StoreDetailPage;