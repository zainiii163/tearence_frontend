import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaLocationArrow, FaGlobe, FaCity, FaFlag } from 'react-icons/fa';

const LocationFilter = ({ onLocationChange, onNearMeToggle }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [isNearMe, setIsNearMe] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({ type: 'all', value: '' });
  const [loading, setLoading] = useState(false);

  const locationOptions = [
    { type: 'all', label: 'All Locations', icon: FaGlobe, color: 'blue' },
    { type: 'near_me', label: 'Near Me', icon: FaLocationArrow, color: 'green' },
    { type: 'london', label: 'London', icon: FaCity, color: 'purple' },
    { type: 'manchester', label: 'Manchester', icon: FaCity, color: 'orange' },
    { type: 'birmingham', label: 'Birmingham', icon: FaCity, color: 'red' },
    { type: 'glasgow', label: 'Glasgow', icon: FaCity, color: 'blue' },
    { type: 'uk', label: 'UK Wide', icon: FaFlag, color: 'indigo' },
  ];

  const popularCities = [
    { name: 'London', lat: 51.5074, lng: -0.1278 },
    { name: 'Manchester', lat: 53.4808, lng: -2.2426 },
    { name: 'Birmingham', lat: 52.4862, lng: -1.8904 },
    { name: 'Glasgow', lat: 55.8642, lng: -4.2518 },
    { name: 'Liverpool', lat: 53.4084, lng: -2.9916 },
    { name: 'Leeds', lat: 53.8008, lng: -1.5491 },
  ];

  useEffect(() => {
    // Check if geolocation is available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocation not available:', error);
        }
      );
    }
  }, []);

  const handleNearMeToggle = () => {
    if (!userLocation && !isNearMe) {
      // Request location access
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setIsNearMe(true);
          setSelectedLocation({ type: 'near_me', value: location });
          onLocationChange(location);
          onNearMeToggle(true);
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to access your location. Please enable location services.');
          setLoading(false);
        }
      );
    } else {
      const newNearMeState = !isNearMe;
      setIsNearMe(newNearMeState);
      
      if (newNearMeState && userLocation) {
        setSelectedLocation({ type: 'near_me', value: userLocation });
        onLocationChange(userLocation);
      } else {
        setSelectedLocation({ type: 'all', value: '' });
        onLocationChange(null);
      }
      
      onNearMeToggle(newNearMeState);
    }
  };

  const handleLocationSelect = (location) => {
    if (location.type === 'near_me') {
      handleNearMeToggle();
    } else {
      setIsNearMe(false);
      setSelectedLocation(location);
      const cityData = popularCities.find(city => city.name.toLowerCase() === location.type);
      onLocationChange(cityData || location);
      onNearMeToggle(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959; // Radius of Earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <FaMapMarkerAlt className="h-4 w-4 text-primary" />
        <h3 className="font-semibold">Location Filter</h3>
      </div>

      {/* Location Options */}
      <div className="space-y-2 mb-4">
        {locationOptions.map((location) => {
          const LocationIcon = location.icon;
          const isSelected = selectedLocation.type === location.type;
          
          return (
            <button
              key={location.type}
              onClick={() => handleLocationSelect(location)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isSelected
                  ? `bg-${location.color}-100 text-${location.color}-700 border border-${location.color}-200`
                  : 'hover:bg-accent text-muted-foreground hover:text-foreground'
              }`}
              disabled={loading}
            >
              <LocationIcon className="h-4 w-4" />
              <span className="text-sm font-medium">{location.label}</span>
              {location.type === 'near_me' && loading && (
                <div className="ml-auto">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                </div>
              )}
              {location.type === 'near_me' && isSelected && userLocation && (
                <span className="ml-auto text-xs text-muted-foreground">
                  Active
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Distance Range */}
      {isNearMe && userLocation && (
        <div className="border-t pt-3">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Search Radius: <span className="text-primary">25 miles</span>
          </label>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            defaultValue="25"
            className="w-full"
            onChange={(e) => {
              // Update search radius
              console.log('Search radius:', e.target.value, 'miles');
            }}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>5 mi</span>
            <span>100 mi</span>
          </div>
        </div>
      )}

      {/* Popular Cities */}
      {!isNearMe && (
        <div className="border-t pt-3">
          <p className="text-sm font-medium text-muted-foreground mb-2">Popular Cities:</p>
          <div className="flex flex-wrap gap-1">
            {popularCities.map((city) => (
              <button
                key={city.name}
                onClick={() => handleLocationSelect({ type: city.name.toLowerCase(), value: city })}
                className="px-2 py-1 text-xs rounded-full bg-muted/50 hover:bg-muted transition-colors"
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Location Status */}
      {selectedLocation.type !== 'all' && (
        <div className="border-t pt-3 mt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {selectedLocation.type === 'near_me' 
                ? 'Showing results near your location'
                : `Showing results in ${selectedLocation.label}`
              }
            </span>
            <button
              onClick={() => handleLocationSelect({ type: 'all', value: '' })}
              className="text-primary hover:underline"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationFilter;
