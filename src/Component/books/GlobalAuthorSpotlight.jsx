import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Star, MapPin, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getBookCoverUrl } from '../../utils/bookFormHelpers';

const COUNTRY_FLAGS = {
  US: '🇺🇸', GB: '🇬🇧', UK: '🇬🇧', FR: '🇫🇷', DE: '🇩🇪', NG: '🇳🇬',
  IN: '🇮🇳', CN: '🇨🇳', MX: '🇲🇽', CA: '🇨🇦', AU: '🇦🇺', JP: '🇯🇵',
  BR: '🇧🇷', ZA: '🇿🇦', ES: '🇪🇸', IT: '🇮🇹',
};

const GlobalAuthorSpotlight = ({ books = [] }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const authors = useMemo(() => {
    if (books.length > 0) {
      return books.map((book) => ({
        id: book.id,
        name: book.author_name,
        country: book.country,
        flag: COUNTRY_FLAGS[book.country?.toUpperCase()] || '🌍',
        photo: null,
        bio: book.short_description || book.description?.slice(0, 180) || 'Author on Worldwide Adverts Books.',
        bookCover: getBookCoverUrl(book),
        bookTitle: book.title,
        genre: book.genre,
        rating: book.rating || 4.5,
        booksCount: 1,
        slug: book.slug,
        verified: book.verified_author,
      }));
    }
    return [];
  }, [books]);

  useEffect(() => {
    if (!isPaused && authors.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % authors.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused, authors.length]);

  if (authors.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + authors.length) % authors.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % authors.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const currentAuthor = authors[currentIndex];

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="page-container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Global Author Spotlight
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet talented authors from around the world sharing their stories with global readers
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative page-container"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Author Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Author Info */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  {currentAuthor.photo ? (
                    <img
                      src={currentAuthor.photo}
                      alt={currentAuthor.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-amber-400"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center border-4 border-amber-300 text-white text-3xl font-bold">
                      {currentAuthor.name?.charAt(0) || 'A'}
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{currentAuthor.name}</h3>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="text-2xl">{currentAuthor.flag}</span>
                      <span>{currentAuthor.country}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">{currentAuthor.bio}</p>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold text-gray-900">{currentAuthor.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Book className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{currentAuthor.booksCount} books</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {currentAuthor.verified && (
                    <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-full">
                      Verified Author
                    </span>
                  )}
                </div>
              </div>

              {/* Book Preview */}
              <div className="space-y-6">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Featured Book</h4>
                  <div className="relative inline-block group">
                    <img
                      src={currentAuthor.bookCover}
                      alt={currentAuthor.bookTitle}
                      className="w-32 h-48 object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                      {currentAuthor.genre}
                    </div>
                  </div>
                  <h5 className="mt-4 text-xl font-bold text-gray-900">{currentAuthor.bookTitle}</h5>
                  <div className="flex items-center justify-center space-x-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(currentAuthor.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">({currentAuthor.rating})</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => currentAuthor.slug && navigate(`/books/${currentAuthor.slug}`)}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-amber-500 hover:to-amber-700 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>View Book</span>
                  <MapPin className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-300 z-10"
            aria-label="Previous author"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-300 z-10"
            aria-label="Next author"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Slide Indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {authors.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-yellow-500 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to author ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* View All Authors */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center space-x-2 text-yellow-600 font-semibold hover:text-yellow-700 transition-colors">
            <span>View All Authors</span>
            <MapPin className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalAuthorSpotlight;
