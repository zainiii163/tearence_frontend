import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, Search, Eye, EyeOff, Crosshair, Map, Lock } from 'lucide-react';

const SponsoredLocationMap = ({ location, setLocation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // Default to NYC
  const [marker, setMarker] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);
  const mapRef = useRef(null);

  // Sample locations for demonstration
  const sampleLocations = [
    { name: 'Times Square, New York', lat: 40.7580, lng: -73.9855 },
    { name: 'Central Park, New York', lat: 40.7829, lng: -73.9654 },
    { name: 'Brooklyn Bridge, New York', lat: 40.7061, lng: -73.9969 },
    { name: 'Statue of Liberty, New York', lat: 40.6892, lng: -74.0445 },
    { name: 'Empire State Building, New York', lat: 40.7484, lng: -73.9857 }
  ];

  useEffect(() => {
    // Initialize map with existing location if available
    if (location?.coordinates) {
      setMapCenter(location.coordinates);
      setMarker(location.coordinates);
    }
  }, [location]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search API call
    setTimeout(() => {
      const results = sampleLocations.filter(loc => 
        loc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const selectLocation = (selectedLocation) => {
    setMapCenter({ lat: selectedLocation.lat, lng: selectedLocation.lng });
    setMarker({ lat: selectedLocation.lat, lng: selectedLocation.lng });
    setLocation({
      ...location,
      address: selectedLocation.name,
      coordinates: { lat: selectedLocation.lat, lng: selectedLocation.lng },
      privacyMode
    });
    setSearchResults([]);
    setSearchQuery(selectedLocation.name);
  };

  const handleMapClick = (lat, lng) => {
    setMarker({ lat, lng });
    setLocation({
      ...location,
      coordinates: { lat, lng },
      privacyMode
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter({ lat: latitude, lng: longitude });
          setMarker({ lat: latitude, lng: longitude });
          setLocation({
            ...location,
            coordinates: { lat: latitude, lng: longitude },
            address: 'Current Location',
            privacyMode
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please search manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const togglePrivacyMode = () => {
    const newPrivacyMode = !privacyMode;
    setPrivacyMode(newPrivacyMode);
    setLocation({
      ...location,
      privacyMode: newPrivacyMode
    });
  };

  const removeMarker = () => {
    setMarker(null);
    setLocation({
      ...location,
      coordinates: null,
      address: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Location Settings</h2>
        <p className="text-gray-600">Pinpoint your location for better visibility and local discovery</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Search & Controls */}
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Search className="w-5 h-5 mr-2 text-blue-500" />
              Search Location
            </h3>
            
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter address, city, or landmark..."
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={getCurrentLocation}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Crosshair className="w-4 h-4" />
                <span>Use Current Location</span>
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">Search Results:</p>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => selectLocation(result)}
                      className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{result.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-purple-500" />
              Privacy Settings
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Location Privacy</p>
                  <p className="text-sm text-gray-600">
                    {privacyMode ? 'Approximate location shown' : 'Exact location shown'}
                  </p>
                </div>
                <button
                  onClick={togglePrivacyMode}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${privacyMode 
                      ? 'bg-purple-100 text-purple-600' 
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}
                >
                  {privacyMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="text-sm text-gray-600 space-y-2">
                <p>• <strong>Exact Location:</strong> Shows precise pin location</p>
                <p>• <strong>Approximate Location:</strong> Shows general area only</p>
                <p>• Privacy mode helps protect your exact address while still allowing local discovery</p>
              </div>
            </div>
          </div>

          {/* Selected Location Info */}
          {location?.address && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Selected Location</h3>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{location.address}</p>
                    {location.coordinates && (
                      <p className="text-xs text-gray-500">
                        {location.coordinates.lat.toFixed(6)}, {location.coordinates.lng.toFixed(6)}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  {privacyMode && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      Privacy Mode Active
                    </span>
                  )}
                  <button
                    onClick={removeMarker}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove Location
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Map */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Map className="w-5 h-5 mr-2 text-green-500" />
                  Interactive Map
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Navigation className="w-4 h-4" />
                  <span>Click to place pin</span>
                </div>
              </div>
            </div>
            
            <div 
              ref={mapRef}
              className="relative h-96 bg-gray-100 cursor-crosshair"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Convert pixel coordinates to lat/lng (simplified for demo)
                const lat = mapCenter.lat + (y - 192) * -0.001;
                const lng = mapCenter.lng + (x - 384) * 0.001;
                
                handleMapClick(lat, lng);
              }}
            >
              {/* Simple Map Visualization */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                <div className="absolute inset-0 opacity-30">
                  {/* Grid lines */}
                  <div className="h-full w-full grid grid-cols-8 grid-rows-6">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="border border-gray-300" />
                    ))}
                  </div>
                </div>
                
                {/* Center indicator */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full opacity-50" />
                </div>
                
                {/* Marker */}
                {marker && (
                  <div
                    className="absolute transform -translate-x-1/2 -translate-y-full"
                    style={{
                      left: `${((marker.lng - mapCenter.lng) * 1000 + 384) / 7.68}%`,
                      top: `${((mapCenter.lat - marker.lat) * 1000 + 192) / 3.84}%`
                    }}
                  >
                    <div className="relative">
                      <MapPin className="w-8 h-8 text-red-500 drop-shadow-lg" />
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45" />
                    </div>
                  </div>
                )}
                
                {/* Privacy Mode Overlay */}
                {privacyMode && marker && (
                  <div
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{
                      left: `${((marker.lng - mapCenter.lng) * 1000 + 384) / 7.68}%`,
                      top: `${((mapCenter.lat - marker.lat) * 1000 + 192) / 3.84}%`
                    }}
                  >
                    <div className="w-32 h-32 bg-purple-500 rounded-full opacity-20 animate-pulse" />
                  </div>
                )}
              </div>
              
              {/* Map Controls */}
              <div className="absolute top-4 right-4 space-y-2">
                <button
                  onClick={() => {
                    setMapCenter({ lat: mapCenter.lat + 0.01, lng: mapCenter.lng });
                  }}
                  className="w-10 h-10 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
                >
                  <Navigation className="w-4 h-4 rotate-0" />
                </button>
                <button
                  onClick={() => {
                    setMapCenter({ lat: mapCenter.lat - 0.01, lng: mapCenter.lng });
                  }}
                  className="w-10 h-10 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
                >
                  <Navigation className="w-4 h-4 rotate-180" />
                </button>
                <button
                  onClick={() => {
                    setMapCenter({ lat: mapCenter.lat, lng: mapCenter.lng - 0.01 });
                  }}
                  className="w-10 h-10 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
                >
                  <Navigation className="w-4 h-4 rotate-90" />
                </button>
                <button
                  onClick={() => {
                    setMapCenter({ lat: mapCenter.lat, lng: mapCenter.lng + 0.01 });
                  }}
                  className="w-10 h-10 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
                >
                  <Navigation className="w-4 h-4 -rotate-90" />
                </button>
              </div>
              
              {/* Instructions */}
              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 max-w-xs">
                <p className="text-xs text-gray-600">
                  <strong>Instructions:</strong> Click anywhere on the map to place your location pin. Use the arrow buttons to navigate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsoredLocationMap;
