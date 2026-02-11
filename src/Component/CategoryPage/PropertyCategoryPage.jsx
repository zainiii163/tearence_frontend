import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import FooterBanner from '../FooterBanner';
import CategorySection from '../CategorySection';
import { getAdsList } from '../../slice/ListSlice';
import { propertySubcategories, getPropertySubcategoryBySlug } from '../../data/propertySubcategories';

const PropertyCategoryPage = () => {
  const dispatch = useDispatch();
  const { subcategory } = useParams();
  const adsData = useSelector((store) => store.ads?.adsList);
  const loading = useSelector((store) => store.ads?.loading);
  
  const subcategoryInfo = getPropertySubcategoryBySlug(subcategory);

  useEffect(() => {
    if (subcategoryInfo) {
      // Fetch ads for this property subcategory
      dispatch(getAdsList({
        category: 'property',
        property_types: subcategoryInfo.property_types.join(','),
        page: 1,
        per_page: 20
      }));
    }
  }, [dispatch, subcategoryInfo]);

  if (!subcategoryInfo) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Property Subcategory Not Found</h1>
            <p className="text-muted-foreground mt-2">The requested property subcategory does not exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FooterBanner title={`${subcategoryInfo.name} Properties`} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Category Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {subcategoryInfo.name} Properties
            </h1>
            <p className="text-muted-foreground">
              {subcategoryInfo.description}
            </p>
          </div>

          {/* Property Listings */}
          <CategorySection 
            categorySlug={`property/${subcategory}`}
            categoryName={`${subcategoryInfo.name} Properties`}
            categoryIcon={subcategoryInfo.icon}
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PropertyCategoryPage;
