import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Globe, 
  TrendingUp,
  Users,
  Eye,
  Building,
  Filter
} from 'lucide-react';

const JobsHero = ({ searchQuery, setSearchQuery, filters, setFilters }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [localFilters, setLocalFilters] = useState({
    location: '',
    remote: false,
    category: '',
    salaryRange: ''
  });

  // Handle scroll for sticky search bar
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync with parent state
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setLocalFilters({
      location: filters.location || '',
      remote: filters.remote || false,
      category: filters.category || '',
      salaryRange: filters.salaryRange || ''
    });
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(localSearchQuery);
    setFilters({
      ...filters,
      ...localFilters
    });
  };

  const stats = [
    { icon: Briefcase, label: 'Active Jobs', value: '45,234', change: '+12%' },
    { icon: Building, label: 'Companies', value: '8,456', change: '+8%' },
    { icon: Users, label: 'Job Seekers', value: '125,890', change: '+15%' },
    { icon: Globe, label: 'Countries', value: '142', change: '+3%' },
    { icon: Eye, label: 'Daily Views', value: '2.5M', change: '+18%' },
    { icon: TrendingUp, label: 'Success Rate', value: '98%', change: '+2%' }
  ];

  const categories = [
    { name: 'Technology & IT', icon: '💻', count: 12450 },
    { name: 'Healthcare & Medical', icon: '🏥', count: 8932 },
    { name: 'Sales & Marketing', icon: '📈', count: 6784 },
    { name: 'Finance & Accounting', icon: '💰', count: 4567 },
    { name: 'Engineering & Construction', icon: '🏗️', count: 3456 },
    { name: 'Hospitality & Tourism', icon: '🏨', count: 2890 },
    { name: 'Retail & Customer Service', icon: '🛍️', count: 2345 },
    { name: 'Logistics & Transport', icon: '🚚', count: 1987 },
    { name: 'Education & Training', icon: '🎓', count: 1654 },
    { name: 'Creative & Media', icon: '🎨', count: 1432 },
    { name: 'Remote Jobs', icon: '🏠', count: 8765 },
    { name: 'Part-Time & Freelance', icon: '⏰', count: 5432 }
  ];

  return (
    <>
      {/* Main Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Floating Animation Elements */}
        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-20 h-20 bg-white opacity-5 rounded-full"
        />
        <motion.div
          animate={{ y: [20, -20, 20] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-20 w-32 h-32 bg-white opacity-5 rounded-full"
        />
        <motion.div
          animate={{ x: [-20, 20, -20] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-1/4 w-16 h-16 bg-white opacity-5 rounded-full"
        />

        <div className="page-container py-8 sm:py-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 leading-tight">
              Find Your Next Opportunity
              <br />
              <span className="text-blue-200">— Anywhere in the World</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed">
              Search global jobs, post vacancies, and connect with talent worldwide.
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Job Title/Keyword */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title / Keyword
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={localSearchQuery}
                      onChange={(e) => setLocalSearchQuery(e.target.value)}
                      placeholder="e.g. Frontend Developer"
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={localFilters.location}
                      onChange={(e) => setLocalFilters({...localFilters, location: e.target.value})}
                      placeholder="City or Country"
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={localFilters.category}
                      onChange={(e) => setLocalFilters({...localFilters, category: e.target.value})}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 appearance-none"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category.name} value={category.name}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <Filter className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Salary Range */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Range
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={localFilters.salaryRange}
                      onChange={(e) => setLocalFilters({...localFilters, salaryRange: e.target.value})}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 appearance-none"
                    >
                      <option value="">Any Salary</option>
                      <option value="0-30000">$0 - $30,000</option>
                      <option value="30000-50000">$30,000 - $50,000</option>
                      <option value="50000-75000">$50,000 - $75,000</option>
                      <option value="75000-100000">$75,000 - $100,000</option>
                      <option value="100000+">$100,000+</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <Filter className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Remote Toggle and Search Button */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.remote}
                    onChange={(e) => setLocalFilters({...localFilters, remote: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Remote only</span>
                </label>

                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Search Jobs
                </button>
              </div>
            </form>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-blue-200" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                  <div className="text-xs text-green-300 mt-1">{stat.change}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Sticky Search Bar */}
      <AnimatePresence>
        {isSticky && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-16 left-0 right-0 bg-white shadow-lg z-30 border-b border-gray-200"
          >
            <div className="page-container py-4">
              <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={localSearchQuery}
                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                    placeholder="Quick search jobs..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={localFilters.location}
                    onChange={(e) => setLocalFilters({...localFilters, location: e.target.value})}
                    placeholder="Location"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                  
                  <label className="flex items-center space-x-2 px-3 py-2">
                    <input
                      type="checkbox"
                      checked={localFilters.remote}
                      onChange={(e) => setLocalFilters({...localFilters, remote: e.target.checked})}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Remote</span>
                  </label>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default JobsHero;
