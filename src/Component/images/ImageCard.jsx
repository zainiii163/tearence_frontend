import React from 'react';
import { Eye, Download, Heart, Star, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ImageCard = ({ image }) => {
  const navigate = useNavigate();
  
  let imageUrl;
  if (image.main_image_url) {
    imageUrl = image.main_image_url;
  } else if (image.main_image) {
    if (image.main_image.startsWith('http')) {
      imageUrl = image.main_image;
    } else if (image.main_image.startsWith('/storage/')) {
      imageUrl = `${process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'https://api.worldwideadverts.info'}${image.main_image}`;
    } else {
      imageUrl = `${process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'https://api.worldwideadverts.info'}/storage/${image.main_image}`;
    }
  } else {
    imageUrl = '/placeholder.png';
  }
  
  const thumbnailUrl = image.thumbnail_url || imageUrl;
  
  const handleClick = () => {
    navigate(`/images/${image.slug}`);
  };

  return (
    <article 
      className="group border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={thumbnailUrl}
          alt={image.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Verification Badge */}
        {image.verification_status === 'verified' && (
          <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3" />
            <span>Verified</span>
          </div>
        )}
        
        {/* Promotion Badge */}
        {image.promotion_tier && image.promotion_tier !== 'standard' && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
            {image.promotion_badge || image.promotion_tier}
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white text-sm font-medium">Quick View</span>
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-900 truncate mb-1">{image.title}</h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-2">{image.short_description || image.description?.substring(0, 100)}...</p>
        
        {/* Price & License */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-gray-900">
            {image.currency || '£'}{image.display_price?.amount || image.standard_price}
          </span>
          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {image.license_label || image.license_type}
          </span>
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {image.views_count || 0}
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {image.downloads_count || 0}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {image.saves_count || 0}
            </span>
          </div>
          {image.rating > 0 && (
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {image.rating?.toFixed(1)}
            </span>
          )}
        </div>
        
        {/* Seller Info */}
        {image.user && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
              {image.user.first_name?.[0] || image.contact_name?.[0] || 'U'}
            </div>
            <span className="text-xs text-gray-600 truncate">
              {image.user.first_name || image.contact_name || 'Unknown'}
            </span>
            {image.is_verified_creator && (
              <Check className="w-3 h-3 text-blue-600" />
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default ImageCard;
