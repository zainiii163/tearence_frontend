import React, { useState } from 'react';
import { Heart, Eye, Star, ExternalLink, ShoppingCart, BookOpen, Flag } from 'lucide-react';

const BookCard = ({ book, onView, onSave, onQuickView }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    if (onSave) onSave(book.id);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    if (onQuickView) onQuickView(book);
  };

  const handleCardClick = () => {
    if (onView) onView(book.id);
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Promoted':
        return 'bg-blue-500 text-white';
      case 'Featured':
        return 'bg-purple-500 text-white';
      case 'Sponsored':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getCountryFlag = (country) => {
    const flags = {
      'usa': '🇺🇸',
      'uk': '🇬🇧',
      'canada': '🇨🇦',
      'australia': '🇦🇺',
      'india': '🇮🇳',
      'nigeria': '🇳🇬',
      'germany': '🇩🇪',
      'france': '🇫🇷',
      'japan': '🇯🇵',
      'brazil': '🇧🇷',
      'mexico': '🇲🇽',
      'south-africa': '🇿🇦'
    };
    return flags[country] || '🌍';
  };

  return (
    <div
      className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
        {/* Book Cover Container */}
        <div className="relative overflow-hidden">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Overlay Actions */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <button
                onClick={handleQuickView}
                className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-white transition-colors flex items-center space-x-1"
              >
                <Eye className="w-4 h-4" />
                <span>Quick View</span>
              </button>
              
              <button
                onClick={handleSave}
                className={`p-2 rounded-lg transition-colors ${
                  isSaved
                    ? 'bg-red-500 text-white'
                    : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Badge */}
          {book.badge && (
            <div className={`absolute top-3 left-3 ${getBadgeColor(book.badge)} px-2 py-1 rounded-full text-xs font-bold`}>
              {book.badge}
            </div>
          )}

          {/* Price Badge */}
          <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
            ${book.price}
          </div>
        </div>

        {/* Book Details */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
            {book.title}
          </h3>

          {/* Author and Country */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 font-medium">{book.author}</span>
              <span className="text-lg">{getCountryFlag(book.country)}</span>
            </div>
          </div>

          {/* Genre */}
          <div className="mb-3">
            <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
              {book.genre}
            </span>
          </div>

          {/* Rating */}
          {book.rating && (
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(book.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({book.rating})</span>
            </div>
          )}

          {/* Format */}
          <div className="flex items-center space-x-2 mb-4">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{book.format}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Handle purchase
              }}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Buy Now</span>
            </button>
            
            {book.externalLink && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(book.externalLink, '_blank');
                }}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{book.views?.toLocaleString() || '0'} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{book.saves?.toLocaleString() || '0'} saves</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
