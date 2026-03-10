import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiHeart, FiShare2, FiEye, FiClock, FiTrendingUp, FiDollarSign } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

// AI-powered advert recommendation engine
class AdvertRecommendationEngine {
  constructor() {
    this.weights = {
      categoryMatch: 0.4,
      priceSimilarity: 0.2,
      locationProximity: 0.15,
      userBehavior: 0.15,
      qualityScore: 0.1
    };
  }

  // Calculate similarity between two adverts
  calculateSimilarity(mainAdvert, candidateAdvert) {
    if (mainAdvert.id === candidateAdvert.id) return 0;

    let score = 0;

    // Category matching (highest weight)
    if (mainAdvert.category === candidateAdvert.category) {
      score += this.weights.categoryMatch;
    } else if (this.areRelatedCategories(mainAdvert.category, candidateAdvert.category)) {
      score += this.weights.categoryMatch * 0.7;
    }

    // Price similarity
    const priceDiff = Math.abs(mainAdvert.price - candidateAdvert.price);
    const priceSimilarity = Math.max(0, 1 - priceDiff / Math.max(mainAdvert.price, candidateAdvert.price));
    score += priceSimilarity * this.weights.priceSimilarity;

    // Location proximity (if location data available)
    if (mainAdvert.location && candidateAdvert.location) {
      const locationSimilarity = this.calculateLocationSimilarity(mainAdvert.location, candidateAdvert.location);
      score += locationSimilarity * this.weights.locationProximity;
    }

    // Quality score based on views, clicks, and rating
    const qualityScore = this.calculateQualityScore(candidateAdvert);
    score += qualityScore * this.weights.qualityScore;

    return score;
  }

  // Check if categories are related
  areRelatedCategories(cat1, cat2) {
    const categoryRelations = {
      'vehicles': ['cars', 'bikes', 'automotive'],
      'electronics': ['computers', 'phones', 'gadgets'],
      'property': ['real-estate', 'rentals', 'housing'],
      'clothing': ['fashion', 'apparel', 'shoes'],
      'furniture': ['home', 'decor', 'office'],
      'books': ['education', 'literature', 'media'],
      'sports': ['fitness', 'outdoor', 'recreation'],
      'music': ['entertainment', 'instruments', 'audio'],
      'art': ['creative', 'decor', 'collectibles']
    };

    for (const [main, related] of Object.entries(categoryRelations)) {
      if ((cat1 === main && related.includes(cat2)) || 
          (cat2 === main && related.includes(cat1))) {
        return true;
      }
    }
    return false;
  }

  // Calculate location similarity
  calculateLocationSimilarity(loc1, loc2) {
    if (loc1.city === loc2.city) return 1;
    if (loc1.country === loc2.country) return 0.7;
    return 0.3;
  }

  // Calculate quality score
  calculateQualityScore(advert) {
    const views = advert.views || 0;
    const clicks = advert.clicks || 0;
    const rating = advert.rating || 0;
    const reviews = advert.reviews || 0;

    // Normalize scores
    const viewScore = Math.min(views / 10000, 1); // Cap at 10,000 views
    const clickScore = Math.min(clicks / 1000, 1); // Cap at 1,000 clicks
    const ratingScore = rating / 5; // Normalize to 0-1
    const reviewScore = Math.min(reviews / 100, 1); // Cap at 100 reviews

    return (viewScore * 0.3 + clickScore * 0.3 + ratingScore * 0.2 + reviewScore * 0.2);
  }

  // Get recommendations for a main advert
  getRecommendations(mainAdvert, allAdverts, count = 6) {
    const recommendations = allAdverts
      .map(advert => ({
        advert,
        score: this.calculateSimilarity(mainAdvert, advert)
      }))
      .filter(item => item.score > 0.1) // Filter out low scores
      .sort((a, b) => b.score - a.score)
      .slice(0, count);

    return recommendations.map(item => item.advert);
  }

  // Get sponsored/priority adverts for category
  getSponsoredAdverts(category, allAdverts, count = 4) {
    return allAdverts
      .filter(advert => 
        (advert.sponsored || advert.featured || advert.promoted) &&
        (advert.category === category || this.areRelatedCategories(category, advert.category))
      )
      .sort((a, b) => {
        // Priority: featured > sponsored > promoted
        const priority = { featured: 3, sponsored: 2, promoted: 1 };
        const aPriority = priority[a.featured ? 'featured' : a.sponsored ? 'sponsored' : a.promoted ? 'promoted' : 'none'] || 0;
        const bPriority = priority[b.featured ? 'featured' : b.sponsored ? 'sponsored' : b.promoted ? 'promoted' : 'none'] || 0;
        
        if (aPriority !== bPriority) return bPriority - aPriority;
        
        // If same priority, sort by quality score
        return this.calculateQualityScore(b) - this.calculateQualityScore(a);
      })
      .slice(0, count);
  }
}

const RecommendationSidebar = ({ mainAdvert, allAdverts }) => {
  const [recommendations, setRecommendations] = useState({
    sponsored: [],
    related: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const engine = new AdvertRecommendationEngine();
    
    // Get sponsored adverts
    const sponsored = engine.getSponsoredAdverts(mainAdvert.category, allAdverts, 4);
    
    // Get related adverts
    const related = engine.getRecommendations(mainAdvert, allAdverts, 6);
    
    setRecommendations({ sponsored, related });
    setLoading(false);
  }, [mainAdvert, allAdverts]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sponsored Adverts */}
      {recommendations.sponsored.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sponsored & Featured</h3>
          <div className="space-y-4">
            {recommendations.sponsored.map((advert) => (
              <AdvertCard key={advert.id} advert={advert} compact={true} />
            ))}
          </div>
        </div>
      )}

      {/* Related Adverts */}
      {recommendations.related.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Adverts</h3>
          <div className="space-y-4">
            {recommendations.related.map((advert) => (
              <AdvertCard key={advert.id} advert={advert} compact={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AdvertCard = ({ advert, compact = false }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: advert.title,
          text: advert.description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getTypeBadge = () => {
    if (advert.featured) {
      return <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">Featured</span>;
    }
    if (advert.sponsored) {
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Sponsored</span>;
    }
    if (advert.promoted) {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Promoted</span>;
    }
    return null;
  };

  if (compact) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
        <Link to={`/ads-detail/${advert.slug || advert.id}`}>
          <div className="flex space-x-3">
            <img
              src={advert.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100'}
              alt={advert.title}
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h4 className="text-sm font-medium text-gray-900 truncate">{advert.title}</h4>
                {getTypeBadge()}
              </div>
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">{advert.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-blue-600">
                  ${advert.price?.toLocaleString() || '0'}
                </span>
                <div className="flex items-center text-xs text-gray-500">
                  <FiEye className="h-3 w-3 mr-1" />
                  {advert.views || 0}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={advert.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'}
          alt={advert.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          {getTypeBadge()}
        </div>
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-700">
          {advert.condition || 'Good'}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{advert.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{advert.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-blue-600">
            ${advert.price?.toLocaleString() || '0'}
          </span>
          <div className="flex items-center text-xs text-gray-500">
            <FiEye className="h-3 w-3 mr-1" />
            {advert.views || 0}
            <span className="mx-1">•</span>
            <FiClock className="h-3 w-3 mr-1" />
            {new Date(advert.created_at).toLocaleDateString()}
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <FiMapPin className="h-4 w-4 mr-1" />
            {advert.location?.city || 'Location not specified'}
          </div>
          {advert.rating && (
            <div className="flex items-center text-sm text-gray-600">
              <FaStar className="h-4 w-4 text-yellow-400 mr-1" />
              {advert.rating} ({advert.reviews || 0})
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to={`/ads-detail/${advert.slug || advert.id}`}
            className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            View Details
          </Link>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiHeart className={`h-4 w-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiShare2 className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

const RelatedAdvertsSection = ({ mainAdvert, allAdverts }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const engine = new AdvertRecommendationEngine();
    const related = engine.getRecommendations(mainAdvert, allAdverts, 8);
    setRecommendations(related);
    setLoading(false);
  }, [mainAdvert, allAdverts]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Related Adverts</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((advert) => (
          <AdvertCard key={advert.id} advert={advert} />
        ))}
      </div>
    </div>
  );
};

export { RecommendationSidebar, RelatedAdvertsSection, AdvertRecommendationEngine, AdvertCard };
