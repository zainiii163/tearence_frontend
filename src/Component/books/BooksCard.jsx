import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Eye, 
  Star, 
  MapPin, 
  ExternalLink, 
  Share2,
  BookOpen,
  Shield,
  Crown,
  Zap,
  Rocket,
  DollarSign,
  Globe,
  User,
  Calendar,
  FileText
} from 'lucide-react';

const BooksCard = ({ 
  book, 
  onView, 
  onSave, 
  onShare, 
  onContact,
  showActions = true,
  compact = false 
}) => {
  const [isSaved, setIsSaved] = useState(book.is_saved || false);
  const [imageError, setImageError] = useState(false);

  const handleSave = async (e) => {
    e.stopPropagation();
    try {
      const newSavedState = !isSaved;
      setIsSaved(newSavedState);
      await onSave(book.id, newSavedState);
    } catch (error) {
      setIsSaved(!isSaved); // Revert on error
      console.error('Failed to save book:', error);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (onShare) {
      onShare(book);
    } else {
      // Default share behavior
      if (navigator.share) {
        navigator.share({
          title: book.title,
          text: book.short_description || book.description,
          url: window.location.origin + `/books/${book.slug}`
        });
      }
    }
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case 'promoted':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'featured':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'sponsored':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'top_category':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getBadgeIcon = (type) => {
    switch (type) {
      case 'promoted':
        return <Zap className="w-3 h-3" />;
      case 'featured':
        return <Crown className="w-3 h-3" />;
      case 'sponsored':
        return <Rocket className="w-3 h-3" />;
      case 'top_category':
        return <Star className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getFormatDisplay = (format) => {
    const formatMap = {
      'paperback': 'Paperback',
      'hardcover': 'Hardcover',
      'ebook': 'E-book',
      'audiobook': 'Audiobook',
      'pdf': 'PDF'
    };
    return formatMap[format] || format;
  };

  const getCountryFlag = (country) => {
    const flagMap = {
      'United States': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'Canada': '🇨🇦',
      'Australia': '🇦🇺',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'Netherlands': '🇳🇱',
      'Japan': '🇯🇵',
      'China': '🇨🇳',
      'India': '🇮🇳',
      'Brazil': '🇧🇷',
      'Mexico': '🇲🇽',
      'Argentina': '🇦🇷',
      'South Africa': '🇿🇦'
    };
    return flagMap[country] || '🌍';
  };

  if (compact) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer"
        onClick={() => onView(book)}
      >
        <div className="flex gap-3 p-3">
          {/* Cover Image */}
          <div className="relative w-16 h-20 flex-shrink-0">
            {!imageError && book.cover_image_url ? (
              <img
                src={book.cover_image_url}
                alt={book.title}
                className="w-full h-full object-cover rounded"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            )}
            
            {/* Premium Badge */}
            {book.advert_type && book.advert_type !== 'standard' && (
              <div className={`absolute top-1 right-1 px-1.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeColor(book.advert_type)}`}>
                {getBadgeIcon(book.advert_type)}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm truncate">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-600 truncate">
                  by {book.author_name}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <DollarSign className="w-3 h-3" />
                <span className="font-medium">{book.price}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-0.5 rounded">
                {getFormatDisplay(book.format)}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {getCountryFlag(book.country)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {book.views_count || 0}
              </span>
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex flex-col gap-1">
              <button
                onClick={handleSave}
                className={`p-1.5 rounded transition-colors ${
                  isSaved 
                    ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all cursor-pointer overflow-hidden"
      onClick={() => onView(book)}
    >
      {/* Cover Image Container */}
      <div className="relative h-64 overflow-hidden">
        {!imageError && book.cover_image_url ? (
          <img
            src={book.cover_image_url}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-100 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-blue-600" />
          </div>
        )}

        {/* Overlay with Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
          <div className="absolute top-3 right-3 flex gap-2">
            {/* Verified Badge */}
            {book.verified_author && (
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Verified
              </div>
            )}
            
            {/* Premium Badge */}
            {book.advert_type && book.advert_type !== 'standard' && (
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getBadgeColor(book.advert_type)}`}>
                {getBadgeIcon(book.advert_type)}
                {book.advert_type.charAt(0).toUpperCase() + book.advert_type.slice(1)}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {showActions && (
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button
                onClick={handleSave}
                className={`p-2 rounded-lg backdrop-blur-sm transition-colors ${
                  isSaved 
                    ? 'bg-red-500/80 text-white hover:bg-red-600/80' 
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-white/80 text-gray-700 rounded-lg backdrop-blur-sm hover:bg-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Format Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800">
          {getFormatDisplay(book.format)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Author */}
        <div className="mb-3">
          <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">
            {book.title}
          </h3>
          {book.subtitle && (
            <p className="text-sm text-gray-600 line-clamp-1 mb-1">
              {book.subtitle}
            </p>
          )}
          <p className="text-sm text-gray-700 flex items-center gap-1">
            <User className="w-4 h-4" />
            by {book.author_name}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
          {book.short_description || book.description}
        </p>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            {getCountryFlag(book.country)} {book.country}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {book.genre}
          </span>
          {book.pages && (
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {book.pages} pages
            </span>
          )}
          {book.publication_date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(book.publication_date).getFullYear()}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {(book.views_count || 0).toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {(book.saves_count || 0).toLocaleString()}
            </span>
          </div>
          
          {/* Rating */}
          {book.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="font-medium">{book.rating}</span>
              {book.reviews_count && (
                <span className="text-gray-400">({book.reviews_count})</span>
              )}
            </div>
          )}
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-lg font-bold text-gray-900">
              {book.price}
            </span>
            <span className="text-sm text-gray-600">
              {book.currency}
            </span>
          </div>

          {showActions && (
            <div className="flex gap-2">
              {book.purchase_links && book.purchase_links.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(book.purchase_links[0].url, '_blank');
                  }}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Buy Now
                </button>
              )}
              
              {onContact && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onContact(book);
                  }}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Contact
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BooksCard;
