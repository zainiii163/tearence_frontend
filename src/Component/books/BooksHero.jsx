import React, { useState, useEffect } from 'react';
import { Search, Globe, BookOpen, Star } from 'lucide-react';

const BooksHero = ({ onSearch, stats = {} }) => {
  const [searchData, setSearchData] = useState({
    bookTitle: '',
    authorName: '',
    genre: '',
    country: ''
  });

  const [showStickySearch, setShowStickySearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickySearch(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchData);
  };

  const HeroContent = () => (
    <div className="text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
        Explore Books, Authors & Stories
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
          From Every Corner of the World
        </span>
      </h1>
      
      <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
        Find your next read or promote your book to a global audience.
      </p>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Book Title */}
            <div className="relative">
              <BookOpen className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Book Title"
                value={searchData.bookTitle}
                onChange={(e) => handleInputChange('bookTitle', e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Author Name */}
            <div className="relative">
              <Star className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Author Name"
                value={searchData.authorName}
                onChange={(e) => handleInputChange('authorName', e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Genre */}
            <div className="relative">
              <BookOpen className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={searchData.genre}
                onChange={(e) => handleInputChange('genre', e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all appearance-none"
              >
                <option value="">All Genres</option>
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-Fiction</option>
                <option value="romance">Romance</option>
                <option value="thriller">Thriller</option>
                <option value="mystery">Mystery</option>
                <option value="fantasy">Fantasy</option>
                <option value="sci-fi">Sci-Fi</option>
                <option value="self-help">Self-Help</option>
                <option value="business">Business</option>
                <option value="children">Children's Books</option>
                <option value="poetry">Poetry</option>
                <option value="biographies">Biographies</option>
                <option value="spirituality">Spirituality</option>
                <option value="academic">Academic</option>
              </select>
            </div>

            {/* Country */}
            <div className="relative">
              <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={searchData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all appearance-none"
              >
                <option value="">All Countries</option>
                <option value="usa">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="canada">Canada</option>
                <option value="australia">Australia</option>
                <option value="india">India</option>
                <option value="nigeria">Nigeria</option>
                <option value="germany">Germany</option>
                <option value="france">France</option>
                <option value="japan">Japan</option>
                <option value="brazil">Brazil</option>
                <option value="mexico">Mexico</option>
                <option value="south-africa">South Africa</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto"
          >
            <Search className="w-5 h-5" />
            <span>Search Books</span>
          </button>
        </div>
      </form>

      {/* Quick Stats — active when published, otherwise total listed */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-900">
            {(stats.activeBooks > 0 ? stats.activeBooks : (stats.totalBooks ?? 0)).toLocaleString()}
          </div>
          <div className="text-gray-600">
            {stats.activeBooks > 0 ? 'Active Books' : 'Books Listed'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-900">
            {(stats.totalAuthors ?? 0).toLocaleString()}
          </div>
          <div className="text-gray-600">Authors</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-900">
            {(stats.activeCountries ?? stats.totalCountries ?? 0).toLocaleString()}
          </div>
          <div className="text-gray-600">Countries</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-900">
            {stats.totalViews >= 1000000
              ? `${(stats.totalViews / 1000000).toFixed(1)}M`
              : (stats.totalViews ?? 0).toLocaleString()}
          </div>
          <div className="text-gray-600">Total Views</div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Main Hero Section */}
      <div className="relative bg-gradient-to-br from-amber-50 via-white to-slate-100 py-8 sm:py-10 lg:py-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative page-container">
          <HeroContent />
        </div>
      </div>

      {/* Sticky Search Bar */}
      {showStickySearch && (
        <div className="fixed top-16 left-0 right-0 bg-white shadow-lg z-40 border-b">
          <div className="page-container py-4">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Book Title"
                value={searchData.bookTitle}
                onChange={(e) => handleInputChange('bookTitle', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Author Name"
                value={searchData.authorName}
                onChange={(e) => handleInputChange('authorName', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <select
                value={searchData.genre}
                onChange={(e) => handleInputChange('genre', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">All Genres</option>
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-Fiction</option>
                <option value="romance">Romance</option>
                <option value="thriller">Thriller</option>
                <option value="mystery">Mystery</option>
                <option value="fantasy">Fantasy</option>
                <option value="sci-fi">Sci-Fi</option>
                <option value="self-help">Self-Help</option>
                <option value="business">Business</option>
                <option value="children">Children's Books</option>
                <option value="poetry">Poetry</option>
                <option value="biographies">Biographies</option>
                <option value="spirituality">Spirituality</option>
                <option value="academic">Academic</option>
              </select>
              <select
                value={searchData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">All Countries</option>
                <option value="usa">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="canada">Canada</option>
                <option value="australia">Australia</option>
                <option value="india">India</option>
                <option value="nigeria">Nigeria</option>
                <option value="germany">Germany</option>
                <option value="france">France</option>
                <option value="japan">Japan</option>
                <option value="brazil">Brazil</option>
                <option value="mexico">Mexico</option>
                <option value="south-africa">South Africa</option>
              </select>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all flex items-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BooksHero;
