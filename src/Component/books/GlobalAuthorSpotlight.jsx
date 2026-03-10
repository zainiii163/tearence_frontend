import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, MapPin, ExternalLink, Book } from 'lucide-react';

const GlobalAuthorSpotlight = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const authors = [
    {
      id: 1,
      name: 'Sarah Mitchell',
      country: 'United Kingdom',
      flag: '🇬🇧',
      photo: 'https://picsum.photos/seed/author1/200/200.jpg',
      bio: 'Award-winning fiction author specializing in contemporary romance and women\'s fiction. Her novels have been translated into 15 languages.',
      bookCover: 'https://picsum.photos/seed/book1/150/225.jpg',
      bookTitle: 'Hearts in London',
      genre: 'Romance',
      rating: 4.8,
      booksCount: 12,
      website: 'https://sarahmitchell.com',
      socialLinks: {
        twitter: '#',
        instagram: '#',
        goodreads: '#'
      }
    },
    {
      id: 2,
      name: 'Chen Wei',
      country: 'China',
      flag: '🇨🇳',
      photo: 'https://picsum.photos/seed/author2/200/200.jpg',
      bio: 'Master of science fiction and fantasy, weaving Eastern philosophy with futuristic narratives. Best known for the "Quantum Dragon" series.',
      bookCover: 'https://picsum.photos/seed/book2/150/225.jpg',
      bookTitle: 'Quantum Dragon Rising',
      genre: 'Sci-Fi',
      rating: 4.9,
      booksCount: 8,
      website: 'https://chenwei.com',
      socialLinks: {
        twitter: '#',
        instagram: '#',
        goodreads: '#'
      }
    },
    {
      id: 3,
      name: 'Amara Okonkwo',
      country: 'Nigeria',
      flag: '🇳🇬',
      photo: 'https://picsum.photos/seed/author3/200/200.jpg',
      bio: 'Powerful voice in contemporary African literature. Her work explores themes of identity, culture, and social change in modern Africa.',
      bookCover: 'https://picsum.photos/seed/book3/150/225.jpg',
      bookTitle: 'Daughters of the Sun',
      genre: 'Fiction',
      rating: 4.7,
      booksCount: 6,
      website: 'https://amaraokonkwo.com',
      socialLinks: {
        twitter: '#',
        instagram: '#',
        goodreads: '#'
      }
    },
    {
      id: 4,
      name: 'Carlos Rodriguez',
      country: 'Mexico',
      flag: '🇲🇽',
      photo: 'https://picsum.photos/seed/author4/200/200.jpg',
      bio: 'Thriller and mystery writer with a unique Latin American perspective. His novels blend suspense with rich cultural storytelling.',
      bookCover: 'https://picsum.photos/seed/book4/150/225.jpg',
      bookTitle: 'Shadows of Mexico City',
      genre: 'Thriller',
      rating: 4.6,
      booksCount: 10,
      website: 'https://carlosrodriguez.com',
      socialLinks: {
        twitter: '#',
        instagram: '#',
        goodreads: '#'
      }
    },
    {
      id: 5,
      name: 'Priya Sharma',
      country: 'India',
      flag: '🇮🇳',
      photo: 'https://picsum.photos/seed/author5/200/200.jpg',
      bio: 'Self-help and spirituality author combining ancient wisdom with modern practical advice. International bestselling author.',
      bookCover: 'https://picsum.photos/seed/book5/150/225.jpg',
      bookTitle: 'Mindful Living',
      genre: 'Self-Help',
      rating: 4.9,
      booksCount: 15,
      website: 'https://priyasharma.com',
      socialLinks: {
        twitter: '#',
        instagram: '#',
        goodreads: '#'
      }
    },
    {
      id: 6,
      name: 'Jean-Luc Dubois',
      country: 'France',
      flag: '🇫🇷',
      photo: 'https://picsum.photos/seed/author6/200/200.jpg',
      bio: 'Literary fiction author and poet exploring the human condition through elegant prose and profound storytelling.',
      bookCover: 'https://picsum.photos/seed/book6/150/225.jpg',
      bookTitle: 'Parisian Echoes',
      genre: 'Literary Fiction',
      rating: 4.8,
      booksCount: 9,
      website: 'https://jeanlucdubois.com',
      socialLinks: {
        twitter: '#',
        instagram: '#',
        goodreads: '#'
      }
    }
  ];

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % authors.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isPaused, authors.length]);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Author Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Author Info */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={currentAuthor.photo}
                    alt={currentAuthor.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400"
                  />
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
                  <a
                    href={currentAuthor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Website</span>
                  </a>
                  {Object.entries(currentAuthor.socialLinks).map(([platform, link]) => (
                    <a
                      key={platform}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-yellow-600 capitalize"
                    >
                      {platform}
                    </a>
                  ))}
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

                <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 flex items-center justify-center space-x-2">
                  <span>View Author Profile</span>
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
