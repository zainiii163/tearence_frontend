import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import ListServices from "../services/ListServices";
import CategoryItem from "./CategoryPage/CategoryItem";
import UpsellModal from "./UpsellModal";

const CategorySection = ({ categorySlug, categoryName, categoryIcon, enableUpsells = false }) => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [upsellModal, setUpsellModal] = useState({ isOpen: false, listing: null });

    useEffect(() => {
        const fetchCategoryAds = async () => {
            if (categorySlug) {
                setLoading(true);
                try {
                    let response;
                    let adsData;
                    
                    if (categorySlug === 'book') {
                        // Use book-specific endpoint
                        response = await ListServices.getBooksList(0, 8);
                        console.log('Book API Full Response:', response);
                        console.log('Book API Response Data:', response.data);
                        
                        // Try different possible data structures
                        let bookData = response.data?.items || response.data?.data?.items || response.data || [];
                        console.log('Book Data Array:', bookData);
                        
                        // If bookData is not an array, try to extract it
                        if (!Array.isArray(bookData) && bookData.items) {
                            bookData = bookData.items;
                        }
                        
                        // Transform book data to match ad structure
                        adsData = Array.isArray(bookData) ? bookData.map(book => ({
                            listing_id: book.id || book.book_id,
                            title: book.title,
                            description: book.short_description || book.description,
                            price: book.price,
                            currency: { symbol: '$' }, // Books seem to use dollar pricing
                            images: book.image_url ? [{ image_path: book.image_url }] : [],
                            slug: book.id || book.book_id, // Use ID as slug for books
                            link_url: book.link_url, // Keep original link for books
                            upsells: book.upsells || [] // Add upsells data if available
                        })) : [];
                        
                        console.log('Transformed Book Ads Data:', adsData);
                    } else {
                        // Use regular listing endpoint with priority sorting
                        response = await ListServices.getAdsList(categorySlug, 0, 8);
                        adsData = response.data?.data?.items || [];
                        
                        // Enhance ads with upsell data if available
                        adsData = adsData.map(ad => ({
                            ...ad,
                            upsells: ad.upsells || [],
                            priority_score: ad.priority_score || 0
                        }));
                    }
                    
                    // Sort by priority score (highest first) if upsells are enabled
                    if (enableUpsells) {
                        adsData.sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0));
                    }
                    
                    setAds(adsData);
                } catch (error) {
                    console.error(`Error fetching ads for ${categorySlug}:`, error);
                    setAds([]);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchCategoryAds();
    }, [categorySlug, enableUpsells]);

    const handleUpsellClick = (listing, closeModal) => {
        setUpsellModal({ isOpen: true, listing });
        
        // Return the upsell modal content
        return (
            <UpsellModal
                isOpen={true}
                listing={listing}
                onClose={() => {
                    closeModal();
                    setUpsellModal({ isOpen: false, listing: null });
                }}
                onSuccess={(response) => {
                    console.log('Upsell purchased successfully:', response);
                    // Refresh the ads to show updated upsell badges
                    window.location.reload();
                }}
            />
        );
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-muted animate-pulse rounded-full"></div>
                        <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
                    </div>
                    <div className="h-6 w-20 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-lg border bg-card animate-pulse">
                            <div className="aspect-video bg-muted"></div>
                            <div className="p-4 space-y-2">
                                <div className="h-4 bg-muted rounded w-3/4"></div>
                                <div className="h-3 bg-muted rounded w-1/2"></div>
                                <div className="h-3 bg-muted rounded w-2/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!ads.length) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                            {categoryIcon}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{categoryName}</h2>
                    </div>
                    <Link to={categorySlug === 'book' ? '/book/' : `/category/${categorySlug}`}>
                        <button className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors self-start sm:self-auto">
                            View All <FaChevronRight className="ml-1 h-4 w-4" />
                        </button>
                    </Link>
                </div>
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No ads available in this category yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {categoryIcon}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{categoryName}</h2>
                </div>
                <Link to={categorySlug === 'book' ? '/book/' : `/category/${categorySlug}`}>
                    <button className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors self-start sm:self-auto">
                        View All <FaChevronRight className="ml-1 h-4 w-4" />
                    </button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {ads.map((ad, index) => {
                    const isBook = categorySlug === 'book';
                    const linkProps = isBook && ad.link_url 
                        ? { href: ad.link_url, target: "_blank", rel: "noopener noreferrer" }
                        : { to: `/ads-detail/${ad.slug}` };
                    
                    const LinkComponent = isBook && ad.link_url ? 'a' : Link;
                    
                    return (
                        <div key={ad.listing_id || index}>
                            {isBook && ad.link_url ? (
                                <LinkComponent {...linkProps}>
                                    <CategoryItem 
                                        item={ad} 
                                        viewMode="grid"
                                        onUpsellClick={enableUpsells ? handleUpsellClick : null}
                                    />
                                </LinkComponent>
                            ) : (
                                <CategoryItem 
                                    item={ad} 
                                    viewMode="grid"
                                    onUpsellClick={enableUpsells ? handleUpsellClick : null}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategorySection;