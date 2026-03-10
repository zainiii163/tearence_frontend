import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaBolt, FaGem, FaEye, FaHeart, FaTags, FaMapMarkerAlt } from 'react-icons/fa';
import api from '../../api';
import { MdLocationOn } from 'react-icons/md';

const SponsoredPostsSidebar = ({ currentAdCategory, currentAdId, currentLocation }) => {
  const [sponsoredPosts, setSponsoredPosts] = useState([]);
  const [promotedPosts, setPromotedPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsoredContent = async () => {
      try {
        setLoading(true);
        
        // Fetch sponsored posts for the same category
        const sponsoredResponse = await api.get(`/ads/sponsored`, {
          params: {
            category: currentAdCategory,
            limit: 4,
            exclude_id: currentAdId
          }
        });

        // Fetch promoted posts for the same category
        const promotedResponse = await api.get(`/ads/promoted`, {
          params: {
            category: currentAdCategory,
            limit: 4,
            exclude_id: currentAdId
          }
        });

        // Fetch featured posts for the same category
        const featuredResponse = await api.get(`/ads/featured`, {
          params: {
            category: currentAdCategory,
            limit: 4,
            exclude_id: currentAdId
          }
        });

        setSponsoredPosts(sponsoredResponse.data?.data?.items || []);
        setPromotedPosts(promotedResponse.data?.data?.items || []);
        setFeaturedPosts(featuredResponse.data?.data?.items || []);
      } catch (error) {
        console.error('Error fetching sponsored content:', error);
        // Use sample data as fallback
        setSponsoredPosts(getSampleSponsoredPosts());
        setPromotedPosts(getSamplePromotedPosts());
        setFeaturedPosts(getSampleFeaturedPosts());
      } finally {
        setLoading(false);
      }
    };

    if (currentAdCategory) {
      fetchSponsoredContent();
    }
  }, [currentAdCategory, currentAdId]);

  const getSampleSponsoredPosts = () => [
    {
      listing_id: 's1',
      title: 'Premium Running Shoes - 50% Off',
      slug: 'premium-running-shoes',
      price: 89.99,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/no-image.png' }],
      category: { name: 'Sports' },
      location: { city: 'New York' },
      customer: { name: 'Sports Store' }
    },
    {
      listing_id: 's2',
      title: 'Professional Camera Equipment',
      slug: 'professional-camera',
      price: 1299.99,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/no-image.png' }],
      category: { name: 'Electronics' },
      location: { city: 'Los Angeles' },
      customer: { name: 'Camera Pro' }
    }
  ];

  const getSamplePromotedPosts = () => [
    {
      listing_id: 'p1',
      title: 'Luxury Apartment Downtown',
      slug: 'luxury-apartment',
      price: 2500,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/no-image.png' }],
      category: { name: 'Property' },
      location: { city: 'Chicago' },
      customer: { name: 'Real Estate Co' }
    },
    {
      listing_id: 'p2',
      title: 'Vintage Car Collection',
      slug: 'vintage-cars',
      price: 45000,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/no-image.png' }],
      category: { name: 'Vehicles' },
      location: { city: 'Miami' },
      customer: { name: 'Car Dealer' }
    }
  ];

  const getSampleFeaturedPosts = () => [
    {
      listing_id: 'f1',
      title: 'Handmade Jewelry Collection',
      slug: 'handmade-jewelry',
      price: 199.99,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/no-image.png' }],
      category: { name: 'Fashion' },
      location: { city: 'San Francisco' },
      customer: { name: 'Jelry Art' }
    },
    {
      listing_id: 'f2',
      title: 'Organic Food Delivery Service',
      slug: 'organic-food',
      price: 49.99,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/no-image.png' }],
      category: { name: 'Services' },
      location: { city: 'Seattle' },
      customer: { name: 'Food Co' }
    }
  ];

  const renderPostCard = (post, type) => {
    const getBadgeColor = (postType) => {
      switch(postType) {
        case 'sponsored': return 'bg-red-100 text-red-800 border-red-200';
        case 'promoted': return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'featured': return 'bg-amber-100 text-amber-800 border-amber-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    const getBadgeIcon = (postType) => {
      switch(postType) {
        case 'sponsored': return <FaBolt className="h-3 w-3" />;
        case 'promoted': return <FaStar className="h-3 w-3" />;
        case 'featured': return <FaGem className="h-3 w-3" />;
        default: return <FaTags className="h-3 w-3" />;
      }
    };

    return (
      <div key={post.listing_id} className="group rounded-lg border bg-card shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
        <div className="relative">
          <Link to={`/ads-detail/${post.slug}`}>
            <div className="aspect-video bg-muted">
              {post.images && post.images.length > 0 ? (
                <img
                  src={post.images[0]?.image_path}
                  alt={post.title}
                  onError={(e) => {
                    e.target.src = "/img/no-image.png";
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src="/img/no-image.png"
                    alt="No preview available"
                    className="w-12 h-12 opacity-50"
                  />
                </div>
              )}
            </div>
          </Link>
          
          {/* Badge */}
          <div className={`absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getBadgeColor(type)}`}>
            {getBadgeIcon(type)}
            <span className="capitalize">{type}</span>
          </div>
        </div>

        <div className="p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <FaTags className="h-3 w-3" />
            <span>{post.category?.name || 'General'}</span>
          </div>
          
          <h4 className="font-medium text-sm text-foreground mb-2 line-clamp-2">
            <Link
              to={`/ads-detail/${post.slug}`}
              className="hover:text-primary transition-colors"
            >
              {post.title}
            </Link>
          </h4>
          
          <div className="flex items-center justify-between mb-2">
            <div className="text-lg font-bold text-primary">
              {post.currency?.symbol || '$'}{post.price}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <MdLocationOn className="h-3 w-3" />
            <span>{post.location?.city || 'Location not specified'}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/ads-detail/${post.slug}`}>
              <button className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-7 w-7 transition-colors">
                <FaEye className="h-3 w-3" />
              </button>
            </Link>
            <button className="inline-flex items-center justify-center rounded-md border border-input hover:bg-accent hover:text-accent-foreground h-7 w-7 transition-colors">
              <FaHeart className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {['Sponsored', 'Promoted', 'Featured'].map((type) => (
          <div key={type} className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
            </div>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sponsored Posts */}
      {sponsoredPosts.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-4 border-b bg-gradient-to-r from-red-50 to-pink-50">
            <div className="flex items-center gap-2">
              <FaBolt className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-red-900">Sponsored Posts</h3>
            </div>
            <p className="text-xs text-red-700 mt-1">Promoted by businesses</p>
          </div>
          <div className="p-4 space-y-3">
            {sponsoredPosts.slice(0, 2).map(post => renderPostCard(post, 'sponsored'))}
          </div>
        </div>
      )}

      {/* Promoted Posts */}
      {promotedPosts.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-indigo-50">
            <div className="flex items-center gap-2">
              <FaStar className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Promoted Posts</h3>
            </div>
            <p className="text-xs text-purple-700 mt-1">Trending in your area</p>
          </div>
          <div className="p-4 space-y-3">
            {promotedPosts.slice(0, 2).map(post => renderPostCard(post, 'promoted'))}
          </div>
        </div>
      )}

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-4 border-b bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="flex items-center gap-2">
              <FaGem className="h-5 w-5 text-amber-600" />
              <h3 className="font-semibold text-amber-900">Featured Posts</h3>
            </div>
            <p className="text-xs text-amber-700 mt-1">Handpicked selections</p>
          </div>
          <div className="p-4 space-y-3">
            {featuredPosts.slice(0, 2).map(post => renderPostCard(post, 'featured'))}
          </div>
        </div>
      )}

      {/* No sponsored content available */}
      {sponsoredPosts.length === 0 && promotedPosts.length === 0 && featuredPosts.length === 0 && (
        <div className="bg-gray-50 rounded-lg border p-6 text-center">
          <FaTags className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">No sponsored content available</p>
          <p className="text-xs text-gray-500 mt-1">Check back later for recommendations</p>
        </div>
      )}
    </div>
  );
};

export default SponsoredPostsSidebar;
