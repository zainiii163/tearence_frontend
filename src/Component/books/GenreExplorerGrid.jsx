import React from 'react';
import { 
  BookOpen, 
  Heart, 
  Search, 
  Puzzle, 
  Sparkles, 
  Rocket, 
  Brain, 
  TrendingUp, 
  Briefcase, 
  Baby, 
  Feather, 
  User, 
  Cloud, 
  GraduationCap 
} from 'lucide-react';

const GenreExplorerGrid = ({ onGenreSelect }) => {
  const genres = [
    {
      id: 'fiction',
      name: 'Fiction',
      icon: BookOpen,
      count: 8456,
      color: 'from-blue-400 to-blue-600',
      description: 'Immersive stories and narratives'
    },
    {
      id: 'non-fiction',
      name: 'Non-Fiction',
      icon: Brain,
      count: 6234,
      color: 'from-green-400 to-green-600',
      description: 'Real stories and factual content'
    },
    {
      id: 'romance',
      name: 'Romance',
      icon: Heart,
      count: 3456,
      color: 'from-pink-400 to-pink-600',
      description: 'Love stories and relationships'
    },
    {
      id: 'thriller',
      name: 'Thriller',
      icon: Search,
      count: 2890,
      color: 'from-red-400 to-red-600',
      description: 'Suspense and mystery tales'
    },
    {
      id: 'mystery',
      name: 'Mystery',
      icon: Puzzle,
      count: 2156,
      color: 'from-purple-400 to-purple-600',
      description: 'Puzzling and intriguing stories'
    },
    {
      id: 'fantasy',
      name: 'Fantasy',
      icon: Sparkles,
      count: 3678,
      color: 'from-indigo-400 to-indigo-600',
      description: 'Magical and mystical worlds'
    },
    {
      id: 'sci-fi',
      name: 'Sci-Fi',
      icon: Rocket,
      count: 2345,
      color: 'from-cyan-400 to-cyan-600',
      description: 'Science and future fiction'
    },
    {
      id: 'self-help',
      name: 'Self-Help',
      icon: TrendingUp,
      count: 1567,
      color: 'from-yellow-400 to-yellow-600',
      description: 'Personal growth and development'
    },
    {
      id: 'business',
      name: 'Business',
      icon: Briefcase,
      count: 1234,
      color: 'from-gray-600 to-gray-800',
      description: 'Business and entrepreneurship'
    },
    {
      id: 'children',
      name: "Children's Books",
      icon: Baby,
      count: 4567,
      color: 'from-orange-400 to-orange-600',
      description: 'Stories for young readers'
    },
    {
      id: 'poetry',
      name: 'Poetry',
      icon: Feather,
      count: 890,
      color: 'from-teal-400 to-teal-600',
      description: 'Poetic expressions and verses'
    },
    {
      id: 'biographies',
      name: 'Biographies',
      icon: User,
      count: 1678,
      color: 'from-amber-400 to-amber-600',
      description: 'Life stories and memoirs'
    },
    {
      id: 'spirituality',
      name: 'Spirituality',
      icon: Cloud,
      count: 1234,
      color: 'from-violet-400 to-violet-600',
      description: 'Spiritual and religious content'
    },
    {
      id: 'academic',
      name: 'Academic',
      icon: GraduationCap,
      count: 945,
      color: 'from-emerald-400 to-emerald-600',
      description: 'Educational and scholarly works'
    }
  ];

  const handleGenreClick = (genre) => {
    if (onGenreSelect) {
      onGenreSelect(genre.id);
    }
  };

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Book Genres
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover your next favorite book from our diverse collection of genres
          </p>
        </div>

        {/* Genre Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {genres.map((genre) => {
            const IconComponent = genre.icon;
            return (
              <div
                key={genre.id}
                onClick={() => handleGenreClick(genre)}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                  {/* Gradient Header */}
                  <div className={`h-24 bg-gradient-to-br ${genre.color} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <IconComponent className="w-12 h-12 text-white relative z-10" />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                      {genre.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {genre.description}
                    </p>
                    
                    {/* Book Count */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-700">
                          {genre.count.toLocaleString()} books
                        </span>
                      </div>
                    </div>
                    
                    {/* Explore Button */}
                    <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg">
                      <span>Explore Books</span>
                      <BookOpen className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Genres Link */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center space-x-2 text-yellow-600 font-semibold hover:text-yellow-700 transition-colors">
            <span>View All Genres</span>
            <BookOpen className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenreExplorerGrid;
