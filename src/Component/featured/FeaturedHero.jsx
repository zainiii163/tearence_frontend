import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Globe, 
  Star, 
  Eye, 
  Crown, 
  Filter,
  MapPin,
  TrendingUp,
  Users,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const FeaturedHero = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  selectedCountry, 
  setSelectedCountry, 
  priceRange, 
  setPriceRange, 
  onSearch, 
  onPostAdvert 
}) => {
  const [isSticky, setIsSticky] = useState(false);
  const [showStickySearch, setShowStickySearch] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'property', label: 'Property' },
    { value: 'vehicles', label: 'Cars & Vehicles' },
    { value: 'jobs', label: 'Jobs & Services' },
    { value: 'business', label: 'Business Opportunities' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion & Beauty' },
    { value: 'travel', label: 'Travel & Experiences' },
    { value: 'events', label: 'Events & Tickets' },
    { value: 'pets', label: 'Pets & Animals' },
    { value: 'home-garden', label: 'Home & Garden' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'education', label: 'Education & Courses' }
  ];

  const countries = [
    { value: 'all', label: 'All Countries', flag: '🌍' },
    { value: 'us', label: 'United States', flag: '🇺🇸' },
    { value: 'uk', label: 'United Kingdom', flag: '🇬🇧' },
    { value: 'france', label: 'France', flag: '🇫🇷' },
    { value: 'germany', label: 'Germany', flag: '🇩🇪' },
    { value: 'italy', label: 'Italy', flag: '🇮🇹' },
    { value: 'spain', label: 'Spain', flag: '🇪🇸' },
    { value: 'japan', label: 'Japan', flag: '🇯🇵' },
    { value: 'china', label: 'China', flag: '🇨🇳' },
    { value: 'singapore', label: 'Singapore', flag: '🇸🇬' },
    { value: 'australia', label: 'Australia', flag: '🇦🇺' },
    { value: 'canada', label: 'Canada', flag: '🇨🇦' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 300;
      setIsSticky(scrolled);
      setShowStickySearch(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(e);
  };

  return (
    <>
      {/* Main Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-black/20" />
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} 
          />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-pulse" />
          <div className="absolute top-40 right-20 w-32 h-32 bg-blue-400/20 rounded-full animate-pulse delay-75" />
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-purple-400/20 rounded-full animate-pulse delay-150" />
          <div className="absolute bottom-40 right-1/4 w-16 h-16 bg-pink-400/20 rounded-full animate-pulse delay-300" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center space-y-8">
            {/* Premium Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
              <Crown className="h-5 w-5 text-yellow-400" />
              <span className="text-sm font-semibold">The World's Most Featured Adverts</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Discover Featured Adverts
                <br />
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  From Around the World
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
                Premium listings across all categories — hand‑picked, high‑visibility, and globally showcased.
              </p>
            </div>

            {/* Universal Search Bar */}
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search Input */}
                  <div className="lg:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-200" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search featured adverts..."
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Category Select */}
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value} className="bg-gray-900">
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-200 pointer-events-none" />
                  </div>

                  {/* Country Select */}
                  <div className="relative">
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                      {countries.map(country => (
                        <option key={country.value} value={country.value} className="bg-gray-900">
                          {country.flag} {country.label}
                        </option>
                      ))}
                    </select>
                    <Globe className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-200 pointer-events-none" />
                  </div>
                </div>

                {/* Price Range */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      placeholder="Min Price"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      placeholder="Max Price"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                  >
                    <Search className="h-4 w-4" />
                    <span>Search Featured</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>15,234 Featured Ads</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-blue-400" />
                <span>142 Countries</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-green-400" />
                <span>2.3M Daily Views</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-purple-400" />
                <span>45.2K Active Users</span>
              </div>
            </div>

            {/* Call to Action */}
            <div className="pt-8">
              <button
                onClick={onPostAdvert}
                className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <Sparkles className="h-5 w-5" />
                <span>Post Your Featured Advert</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      {/* Sticky Search Bar */}
      {showStickySearch && (
        <div className="sticky top-16 z-30 bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search featured adverts..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                {countries.map(country => (
                  <option key={country.value} value={country.value}>
                    {country.flag} {country.label}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all flex items-center justify-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FeaturedHero;
