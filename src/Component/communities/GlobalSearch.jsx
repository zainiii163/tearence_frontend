import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes, FaFilter, FaUsers, FaTag, FaUser, FaBuilding } from 'react-icons/fa';

const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  const tabs = [
    { id: 'all', label: 'All', icon: FaSearch },
    { id: 'ads', label: 'Ads', icon: FaTag },
    { id: 'communities', label: 'Communities', icon: FaUsers },
    { id: 'people', label: 'People', icon: FaUser },
    { id: 'categories', label: 'Categories', icon: FaBuilding },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      // Mock search results - in real implementation, this would call the API
      const mockResults = {
        ads: [
          { id: 1, title: '3-Bed Apartment in City Centre', type: 'Property', price: '£1,200/month', location: 'London' },
          { id: 2, title: 'Senior Developer Position', type: 'Job', salary: '£80,000/year', location: 'Remote' },
          { id: 3, title: '2021 BMW X5', type: 'Vehicle', price: '£35,000', location: 'Manchester' },
        ],
        communities: [
          { id: 1, name: 'Property & Real Estate - UK', members: '12.5k', category: 'Property' },
          { id: 2, name: 'Tech Startups - London', members: '8.3k', category: 'Business' },
          { id: 3, name: 'Remote Workers Global', members: '25.1k', category: 'Jobs' },
        ],
        people: [
          { id: 1, name: 'John Smith', role: 'Real Estate Agent', location: 'London', verified: true },
          { id: 2, name: 'Sarah Johnson', role: 'Tech Entrepreneur', location: 'Manchester', verified: true },
          { id: 3, name: 'Mike Chen', role: 'Car Dealer', location: 'Birmingham', verified: false },
        ],
        categories: [
          { id: 1, name: 'Property & Real Estate', icon: '🏠', count: '2,341 listings' },
          { id: 2, name: 'Jobs & Vacancies', icon: '💼', count: '1,892 listings' },
          { id: 3, name: 'Vehicles & Transport', icon: '🚗', count: '987 listings' },
        ],
      };

      const filteredResults = activeTab === 'all' 
        ? Object.values(mockResults).flat()
        : mockResults[activeTab] || [];

      setResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderResultItem = (item, type) => {
    switch (type) {
      case 'ads':
        return (
          <div className="flex items-start gap-3 p-3 hover:bg-accent rounded-lg cursor-pointer">
            <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
              <FaTag className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{item.title}</h4>
              <p className="text-xs text-muted-foreground">{item.type} • {item.location}</p>
              <p className="text-sm font-semibold text-primary">{item.price || item.salary}</p>
            </div>
          </div>
        );
      case 'communities':
        return (
          <div className="flex items-start gap-3 p-3 hover:bg-accent rounded-lg cursor-pointer">
            <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center">
              <FaUsers className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{item.name}</h4>
              <p className="text-xs text-muted-foreground">{item.category?.name || item.category}</p>
              <p className="text-xs text-primary">{item.members} members</p>
            </div>
          </div>
        );
      case 'people':
        return (
          <div className="flex items-start gap-3 p-3 hover:bg-accent rounded-lg cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <FaUser className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm">{item.name}</h4>
                {item.verified && <span className="text-xs text-blue-500">✓ Verified</span>}
              </div>
              <p className="text-xs text-muted-foreground">{item.role} • {item.location}</p>
            </div>
          </div>
        );
      case 'categories':
        return (
          <div className="flex items-start gap-3 p-3 hover:bg-accent rounded-lg cursor-pointer">
            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-lg">
              {item.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{item.name}</h4>
              <p className="text-xs text-muted-foreground">{item.count}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
      >
        <FaSearch className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Search communities, ads, people...</span>
        <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs bg-background border rounded">
          ⌘K
        </kbd>
      </button>

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-w-2xl">
          <div className="p-4">
            {/* Search Input */}
            <div className="flex items-center gap-2 mb-4">
              <FaSearch className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search communities, ads, people..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-1 px-3 py-2 bg-muted/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                <FaTimes className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Search Tabs */}
            <div className="flex gap-1 mb-4 border-b">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((item, index) => (
                    <div key={index}>
                      {renderResultItem(item, activeTab === 'all' ? 
                        (item.title ? 'ads' : item.name ? 'people' : 'categories') : 
                        activeTab)}
                    </div>
                  ))}
                </div>
              ) : searchQuery.length >= 2 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FaSearch className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No results found for "{searchQuery}"</p>
                  <p className="text-sm mt-2">Try different keywords or browse categories</p>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FaSearch className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Type to search communities, ads, and people</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
