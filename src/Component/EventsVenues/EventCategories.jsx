import React from 'react';
import { Music, Briefcase, GraduationCap, PartyPopper, Trophy, Palette, Utensils, Heart } from 'lucide-react';

const EventCategories = () => {
  const categories = [
    {
      id: 1,
      name: "Concerts & Music",
      icon: Music,
      count: 3421,
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700"
    },
    {
      id: 2,
      name: "Business Conferences",
      icon: Briefcase,
      count: 1287,
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700"
    },
    {
      id: 3,
      name: "Workshops",
      icon: GraduationCap,
      count: 892,
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700"
    },
    {
      id: 4,
      name: "Festivals",
      icon: PartyPopper,
      count: 567,
      color: "from-pink-500 to-pink-600",
      hoverColor: "hover:from-pink-600 hover:to-pink-700"
    },
    {
      id: 5,
      name: "Parties & Nightlife",
      icon: PartyPopper,
      count: 2341,
      color: "from-indigo-500 to-indigo-600",
      hoverColor: "hover:from-indigo-600 hover:to-indigo-700"
    },
    {
      id: 6,
      name: "Sports Events",
      icon: Trophy,
      count: 1876,
      color: "from-orange-500 to-orange-600",
      hoverColor: "hover:from-orange-600 hover:to-orange-700"
    },
    {
      id: 7,
      name: "Cultural Events",
      icon: Palette,
      count: 1543,
      color: "from-teal-500 to-teal-600",
      hoverColor: "hover:from-teal-600 hover:to-teal-700"
    },
    {
      id: 8,
      name: "Food & Drink",
      icon: Utensils,
      count: 987,
      color: "from-red-500 to-red-600",
      hoverColor: "hover:from-red-600 hover:to-red-700"
    },
    {
      id: 9,
      name: "Charity Events",
      icon: Heart,
      count: 432,
      color: "from-amber-500 to-amber-600",
      hoverColor: "hover:from-amber-600 hover:to-amber-700"
    }
  ];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Event Categories</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find events that match your interests from our diverse categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                className={`group relative bg-gradient-to-br ${category.color} ${category.hoverColor} rounded-2xl p-6 text-white cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                <div className="relative z-10">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 inline-block mb-4 group-hover:bg-white/30 transition-colors">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                  <p className="text-white/80 text-sm">
                    {category.count.toLocaleString()} events
                  </p>
                </div>
                
                {/* Decorative overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-2xl transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventCategories;
