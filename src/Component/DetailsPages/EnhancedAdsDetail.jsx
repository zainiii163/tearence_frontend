import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useDispatch, useSelector } from "react-redux";
import { detailsAdsList, creatFavouriteAds, getFavouriteAds } from "../../slice/ListSlice";
import RelatedSlider from "./RelatedAds";
import EbayAds from "../EbayAds";
import BottomAds from "../BottomAds";
import SponsoredPostsSidebar from "./SponsoredPostsSidebar";
import AdvertReportingSystem from "../Reporting/AdvertReportingSystem";
import BackButton from "../BackButton";
import { RecommendationSidebar, RelatedAdvertsSection } from "../Recommendations/AdvertRecommendations";
import Env from "../../useEnv";
import { trackView } from "../../utils/analyticsTracker";
import ListServices from "../../services/ListServices";
import toast from "react-hot-toast";

// Icons
import {
  FaStar,
  FaStore,
  FaTelegram,
  FaWhatsapp,
  FaFacebookF,
  FaLinkedinIn,
  FaHeart,
  FaFlag,
  FaEnvelope,
  FaMapMarkerAlt,
  FaEye,
  FaTags,
  FaUser,
  FaShare,
  FaPhone,
  FaGlobe,
} from "react-icons/fa";
import { BsTwitter } from "react-icons/bs";
import { MdVerified, MdOutlineReportProblem } from "react-icons/md";
import { BiTime } from "react-icons/bi";
import ChatButton from "../Chat/ChatButton";
import InternalMessagingSystem from "../Messaging/InternalMessagingSystem";

function FeaturedAdsDetail() {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const adsDetails = useSelector((store) => store.ads.detailsAds);
  const adsDetailData = adsDetails?.data || {};
  const favouriteAdsState = useSelector((store) => store.ads.favouriteAds);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [allAdverts, setAllAdverts] = useState([]);

  useEffect(() => {
    if (slug) {
      dispatch(detailsAdsList({ slug }));
      // Fetch real adverts for recommendations
      fetchAllAdverts();
    }
  }, [slug, dispatch]);

  const fetchAllAdverts = async () => {
    try {
      // Fetch adverts from the same category and related categories
      const category = adsDetailData.category?.slug || 'all';
      let allAdvertsData = [];
      
      if (category !== 'all') {
        // Fetch from current category
        const response = await ListServices.getAdsList(category, 0, 50);
        allAdvertsData = response.data?.data?.items || response.data?.items || [];
        
        // Also fetch from related categories
        const relatedCategories = getRelatedCategories(category);
        const relatedPromises = relatedCategories.map(cat => 
          ListServices.getAdsList(cat, 0, 20).catch(() => ({ data: { items: [] } }))
        );
        const relatedResponses = await Promise.all(relatedPromises);
        const relatedAdverts = relatedResponses.flatMap(resp => resp.data?.items || []);
        allAdvertsData = [...allAdvertsData, ...relatedAdverts];
      } else {
        // Fetch from popular categories
        const categories = ['vehicles', 'electronics', 'clothing', 'property', 'books'];
        const promises = categories.map(cat => 
          ListServices.getAdsList(cat, 0, 20).catch(() => ({ data: { items: [] } }))
        );
        const responses = await Promise.all(promises);
        allAdvertsData = responses.flatMap(resp => resp.data?.items || []);
      }
      
      setAllAdverts(allAdvertsData);
    } catch (error) {
      console.error('Error fetching all adverts:', error);
      // Fallback to mock data if API fails
      setAllAdverts(getMockAllAdverts());
    }
  };

  const getRelatedCategories = (category) => {
    const relations = {
      'vehicles': ['electronics', 'property'],
      'electronics': ['vehicles', 'books'],
      'clothing': ['electronics', 'books'],
      'property': ['vehicles', 'electronics'],
      'books': ['electronics', 'clothing'],
      'services': ['business', 'electronics']
    };
    return relations[category] || [];
  };

  // Track view when listing data is loaded
  useEffect(() => {
    if (adsDetailData?.listing_id) {
      trackView(adsDetailData.listing_id, {
        slug: slug,
        category: adsDetailData.category?.name,
        source: "detail_page",
      });
    }
  }, [adsDetailData?.listing_id, slug, adsDetailData.category?.name]);

  // Initialize favorite button state
  useEffect(() => {
    const currentCustomerId = localStorage.getItem('customer_id');
    const listingId = adsDetailData.listing_id;
    if (!currentCustomerId || !listingId) return;

    const hasFavouriteInStore = (() => {
      if (!favouriteAdsState) return false;
      const items = favouriteAdsState.items || (favouriteAdsState.data && favouriteAdsState.data.items) || (Array.isArray(favouriteAdsState) ? favouriteAdsState : []);
      return items.some((f) => {
        if (!f) return false;
        if (f.listing_id && f.listing_id === listingId) return true;
        if (f.listing && (f.listing.listing_id === listingId || f.listing.id === listingId)) return true;
        return false;
      });
    })();

    if (hasFavouriteInStore) {
      setIsFavorited(true);
      return;
    }
  }, [adsDetailData.listing_id, favouriteAdsState]);

  const handleFavoriteToggle = async () => {
    const currentCustomerId = localStorage.getItem('customer_id');
    if (!currentCustomerId) {
      toast.error('Please login to add favorites');
      return;
    }

    try {
      if (isFavorited) {
        // Remove from favorites (implementation needed)
        toast.success('Removed from favorites');
      } else {
        await dispatch(creatFavouriteAds({ listing_id: adsDetailData.listing_id }));
        toast.success('Added to favorites');
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `Check out this ${adsDetailData.category?.name || 'item'}: ${adsDetailData.title}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: adsDetailData.title,
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleContactSeller = () => {
    setShowMessageModal(true);
  };

  const generateAdvertId = () => {
    if (adsDetailData.listing_id) {
      return `ADV-${String(adsDetailData.listing_id).padStart(5, '0')}`;
    }
    return 'ADV-00000';
  };

  const getConditionBadge = (condition) => {
    const colors = {
      'New': 'bg-green-100 text-green-800',
      'Like New': 'bg-blue-100 text-blue-800',
      'Excellent': 'bg-purple-100 text-purple-800',
      'Good': 'bg-yellow-100 text-yellow-800',
      'Fair': 'bg-orange-100 text-orange-800'
    };
    return colors[condition] || 'bg-gray-100 text-gray-800';
  };

  const getTypeBadge = () => {
    if (adsDetailData.featured) {
      return <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">Featured</span>;
    }
    if (adsDetailData.sponsored) {
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Sponsored</span>;
    }
    if (adsDetailData.promoted) {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Promoted</span>;
    }
    return null;
  };

  if (!adsDetailData.listing_id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Left/Center) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Advert Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-500 font-medium">{generateAdvertId()}</span>
                    {getTypeBadge()}
                    {adsDetailData.condition && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionBadge(adsDetailData.condition)}`}>
                        {adsDetailData.condition}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{adsDetailData.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="h-4 w-4 mr-1" />
                      {adsDetailData.location?.city || 'Location not specified'}
                    </div>
                    <div className="flex items-center">
                      <BiTime className="h-4 w-4 mr-1" />
                      {new Date(adsDetailData.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <FaEye className="h-4 w-4 mr-1" />
                      {adsDetailData.views || 0} views
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    ${adsDetailData.price?.toLocaleString() || '0'}
                    {adsDetailData.currency && <span className="text-lg text-gray-600 ml-1">{adsDetailData.currency.symbol || '$'}</span>}
                  </div>
                  {adsDetailData.negotiable && (
                    <span className="text-sm text-green-600 font-medium">Negotiable</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleFavoriteToggle}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isFavorited 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FaHeart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
                  {isFavorited ? 'Favorited' : 'Add to Favorites'}
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <FaShare className="h-4 w-4 mr-2" />
                  Share
                </button>
                
                <button
                  onClick={handleContactSeller}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <FaEnvelope className="h-4 w-4 mr-2" />
                  Contact Seller
                </button>
                
                <button
                  onClick={() => setShowReportModal(true)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                >
                  <FaFlag className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 gap-4">
                {/* Main Image */}
                <div className="relative">
                  <img
                    src={adsDetailData.images?.[selectedImageIndex]?.image_path || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800'}
                    alt={adsDetailData.title}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  {adsDetailData.verified && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <MdVerified className="h-4 w-4 mr-1" />
                      Verified
                    </div>
                  )}
                </div>
                
                {/* Thumbnail Gallery */}
                {adsDetailData.images && adsDetailData.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {adsDetailData.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                          selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image.image_path}
                          alt={`${adsDetailData.title} ${index + 1}`}
                          className="w-full h-20 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{adsDetailData.description}</p>
              </div>
            </div>

            {/* Specifications */}
            {adsDetailData.specifications && Object.keys(adsDetailData.specifications).length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h2>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(adsDetailData.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="text-gray-900 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Seller Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Seller Information</h2>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <FaUser className="h-8 w-8 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {adsDetailData.user?.name || 'Anonymous Seller'}
                    </h3>
                    {adsDetailData.user?.verified && (
                      <MdVerified className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center">
                      <FaStar className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{adsDetailData.user?.rating || 'No rating'} ({adsDetailData.user?.reviews || 0} reviews)</span>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="h-4 w-4 mr-1" />
                      <span>{adsDetailData.location?.city || 'Location not specified'}</span>
                    </div>
                    <div className="flex items-center">
                      <BiTime className="h-4 w-4 mr-1" />
                      <span>Member since {new Date(adsDetailData.user?.created_at || '2023-01-01').getFullYear()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={handleContactSeller}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <FaEnvelope className="h-4 w-4 mr-2" />
                      Message
                    </button>
                    {adsDetailData.user?.phone && (
                      <a
                        href={`tel:${adsDetailData.user.phone}`}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        <FaPhone className="h-4 w-4 mr-2" />
                        Call
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Related Adverts */}
            <RelatedAdvertsSection 
              mainAdvert={adsDetailData} 
              allAdverts={allAdverts} 
            />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Recommendations Sidebar */}
            <RecommendationSidebar 
              mainAdvert={adsDetailData} 
              allAdverts={allAdverts} 
            />

            {/* Sponsored Posts Sidebar */}
            <SponsoredPostsSidebar />

            {/* Top Affiliate */}
            <TopAffiliateOnAdsDetail />

            {/* Ebay Ads */}
            <EbayAds />
          </div>
        </div>

        {/* Bottom Ads */}
        <div className="mt-8">
          <BottomAds />
        </div>
      </div>

      <Footer />

      {/* Report Modal */}
      {showReportModal && (
        <AdvertReportingSystem
          advertId={adsDetailData.listing_id}
          advertTitle={adsDetailData.title}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <InternalMessagingSystem
          recipientId={adsDetailData.user?.id}
          recipientName={adsDetailData.user?.name}
          advertId={adsDetailData.listing_id}
          advertTitle={adsDetailData.title}
          onClose={() => setShowMessageModal(false)}
        />
      )}
    </div>
  );
}

// Mock data for recommendations - in production, this would come from API
function getMockAllAdverts() {
  return [
    {
      id: 1,
      listing_id: 1001,
      title: 'iPhone 13 Pro Max',
      description: 'Excellent condition iPhone 13 Pro Max, 256GB, Pacific Blue',
      price: 899,
      currency: { symbol: '$' },
      category: 'electronics',
      condition: 'Excellent',
      location: { city: 'New York' },
      images: [{ image_path: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400' }],
      views: 245,
      clicks: 32,
      rating: 4.5,
      reviews: 12,
      featured: true,
      created_at: '2024-01-15'
    },
    {
      id: 2,
      listing_id: 1002,
      title: 'MacBook Pro 14"',
      description: 'M1 Pro MacBook Pro, 16GB RAM, 512GB SSD',
      price: 1599,
      currency: { symbol: '$' },
      category: 'electronics',
      condition: 'Like New',
      location: { city: 'Los Angeles' },
      images: [{ image_path: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' }],
      views: 189,
      clicks: 28,
      rating: 4.8,
      reviews: 8,
      sponsored: true,
      created_at: '2024-01-10'
    },
    {
      id: 3,
      listing_id: 1003,
      title: 'Samsung Galaxy S23',
      description: 'Brand new Samsung Galaxy S23, 256GB, Phantom Black',
      price: 799,
      currency: { symbol: '$' },
      category: 'electronics',
      condition: 'New',
      location: { city: 'Chicago' },
      images: [{ image_path: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e597?w=400' }],
      views: 156,
      clicks: 22,
      rating: 4.6,
      reviews: 6,
      promoted: true,
      created_at: '2024-01-05'
    },
    // Add more mock adverts as needed...
  ];
}

export default FeaturedAdsDetail;
