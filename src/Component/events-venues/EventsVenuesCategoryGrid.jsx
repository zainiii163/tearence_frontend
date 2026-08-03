import React from 'react';
import { CalendarDays, Building2, Music, GraduationCap, PartyPopper, Trophy, UtensilsCrossed, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EventsVenuesCategoryGrid = ({ categories, viewType }) => {
  const navigate = useNavigate();

  const getCategoryIcon = (categoryName) => {
    const name = categoryName?.toLowerCase() || '';
    if (name.includes('concert') || name.includes('music')) return Music;
    if (name.includes('conference') || name.includes('workshop')) return GraduationCap;
    if (name.includes('party') || name.includes('nightlife')) return PartyPopper;
    if (name.includes('sport')) return Trophy;
    if (name.includes('food') || name.includes('drink')) return UtensilsCrossed;
    if (name.includes('wedding') || name.includes('charity')) return Heart;
    return viewType === 'event' ? CalendarDays : Building2;
  };

  const handleCategoryClick = (categoryId) => {
    const base = viewType === 'venue' ? '/events-venues/venues' : '/events-venues/events';
    navigate(`${base}?category_id=${categoryId}`);
  };

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="py-12 px-4">
      <div className="page-container">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          {viewType === 'event' ? 'Explore Event Categories' : 'Explore Venue Categories'}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories
            .filter(cat => cat.type === viewType || cat.type === 'both')
            .map((category) => {
              const Icon = getCategoryIcon(category.name);
              return (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                >
                  {category.image && (
                    <div className="h-32 overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-center mb-2">
                      <Icon className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-center mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 text-center">
                      {category.adverts_count || 0} listings
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default EventsVenuesCategoryGrid;
