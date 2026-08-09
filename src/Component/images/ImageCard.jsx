import React from 'react';
import { Eye, Download, Heart, Star, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStorageAssetUrl } from '../../utils/jobsHelpers';

const ImageCard = ({ image }) => {
  const navigate = useNavigate();

  const raw =
    image.thumbnail_url ||
    image.main_image_url ||
    image.thumbnail ||
    image.main_image ||
    null;

  const imageUrl =
    (raw && (String(raw).startsWith('blob:') || String(raw).startsWith('/images/') || String(raw).startsWith('/static/')
      ? raw
      : getStorageAssetUrl(raw) || raw)) ||
    '/placeholder.png';

  const thumbnailUrl = imageUrl;

  const handleClick = () => {
    navigate(`/images/${image.slug}`);
  };

  return (
    <article
      className="group w-full min-w-0 border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={thumbnailUrl}
          alt={image.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {image.verification_status === 'verified' && (
          <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3" />
            <span>Verified</span>
          </div>
        )}

        {image.promotion_tier && image.promotion_tier !== 'standard' && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
            {image.promotion_badge || image.promotion_tier}
          </div>
        )}

        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white text-sm font-medium">Quick View</span>
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-900 truncate mb-1">{image.title}</h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-2">
          {image.short_description || image.description?.substring(0, 100)}
          …
        </p>

        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-gray-900">
            {image.display_price?.formatted ||
              `${image.currency === 'GBP' ? '£' : image.currency === 'USD' ? '$' : ''}${image.display_price?.amount ?? image.standard_price ?? 0}`}
          </span>
          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {image.license_label || image.license_type}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          {(image.views_count != null || image.views != null) && (
            <span className="inline-flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {image.views_count ?? image.views}
            </span>
          )}
          {(image.downloads_count != null || image.downloads != null) && (
            <span className="inline-flex items-center gap-1">
              <Download className="w-3 h-3" />
              {image.downloads_count ?? image.downloads}
            </span>
          )}
          {(image.likes_count != null || image.likes != null) && (
            <span className="inline-flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {image.likes_count ?? image.likes}
            </span>
          )}
          {image.rating != null && (
            <span className="inline-flex items-center gap-1">
              <Star className="w-3 h-3" />
              {image.rating}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ImageCard;
