import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Heart, 
  MapPin, 
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Filter,
  Search,
  MoreVertical,
  Home,
  Building,
  Factory,
  Trees,
  Star,
  Camera
} from 'lucide-react';
import propertyApi from '../../services/propertyApi';

const PropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    search: '',
    property_type: '',
    category: '',
    status: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    perPage: 12
  });

  // Load user's properties
  const loadProperties = async (page = 1, newFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page,
        per_page: pagination.perPage,
        ...newFilters
      };
      
      const response = await propertyApi.getMyProperties(params);
      setProperties(response.data || []);
      setPagination(prev => ({
        ...prev,
        currentPage: response.meta?.current_page || 1,
        totalPages: response.meta?.last_page || 1,
        total: response.meta?.total || 0
      }));
    } catch (err) {
      setError(err.message);
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadProperties();
  }, []);

  // Handle property actions
  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      await propertyApi.deleteProperty(propertyId);
      setProperties(prev => prev.filter(p => p.id !== propertyId));
      alert('Property deleted successfully');
    } catch (err) {
      setError(err.message);
      console.error('Error deleting property:', err);
    }
  };

  const handleTogglePropertyStatus = async (propertyId, currentStatus) => {
    try {
      const updatedProperty = await propertyApi.updateProperty(propertyId, {
        active: !currentStatus
      });
      
      setProperties(prev => prev.map(p => 
        p.id === propertyId ? { ...p, ...updatedProperty } : p
      ));
    } catch (err) {
      setError(err.message);
      console.error('Error updating property:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    loadProperties(1, newFilters);
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    handleFilterChange('search', searchValue);
  };

  const getPropertyTypeIcon = (type) => {
    const icons = {
      residential: Home,
      commercial: Building,
      industrial: Factory,
      land: Trees,
      agricultural: Trees,
      luxury: Star,
      short_term_rental: Calendar,
      investment: TrendingUp,
      new_development: Building
    };
    return icons[type] || Building;
  };

  const getPropertyTypeColor = (type) => {
    const colors = {
      residential: 'blue',
      commercial: 'green',
      industrial: 'orange',
      land: 'yellow',
      agricultural: 'green',
      luxury: 'purple',
      short_term_rental: 'pink',
      investment: 'indigo',
      new_development: 'cyan'
    };
    return colors[type] || 'gray';
  };

  const getStatusColor = (property) => {
    if (!property.active) return 'bg-gray-100 text-gray-800';
    if (!property.approved) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (property) => {
    if (!property.active) return 'Inactive';
    if (!property.approved) return 'Pending Approval';
    return 'Active';
  };

  if (loading && properties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading your properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-red-50 p-6 rounded-lg">
          <p className="text-red-600 font-medium">Error loading properties</p>
          <p className="text-red-500 text-sm mt-2">{error}</p>
          <button 
            onClick={() => loadProperties()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="page-container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                {pagination.total} properties
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={filters.search}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              
              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
              </button>
              
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <div className="w-4 h-4 space-y-1">
                    <div className="bg-current h-0.5 rounded-sm"></div>
                    <div className="bg-current h-0.5 rounded-sm"></div>
                    <div className="bg-current h-0.5 rounded-sm"></div>
                  </div>
                </button>
              </div>
              
              {/* Add Property Button */}
              <a
                href="/property?postForm=true"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Property
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-b shadow-sm overflow-hidden"
          >
            <div className="page-container py-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select
                    value={filters.property_type}
                    onChange={(e) => handleFilterChange('property_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                    <option value="land">Land</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    <option value="buy">Buy</option>
                    <option value="rent">Rent</option>
                    <option value="lease">Lease</option>
                    <option value="auction">Auction</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilters({ search: '', property_type: '', category: '', status: 'all' });
                      loadProperties(1, {});
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Properties Grid/List */}
      <div className="page-container py-8">
        {properties.length === 0 && !loading ? (
          <div className="text-center py-12">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first property listing</p>
            <a
              href="/property?postForm=true"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Your First Property
            </a>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((property) => {
                  const Icon = getPropertyTypeIcon(property.property_type);
                  const color = getPropertyTypeColor(property.property_type);
                  
                  return (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
                    >
                      {/* Property Image */}
                      <div className="relative h-48 bg-gray-200">
                        {property.cover_image ? (
                          <img 
                            src={property.cover_image} 
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <Camera className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        
                        {/* Status Badge */}
                        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property)}`}>
                          {getStatusText(property)}
                        </div>
                        
                        {/* Property Type Badge */}
                        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}>
                          {property.property_type}
                        </div>
                      </div>
                      
                      {/* Property Details */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 flex-1">
                            {property.title}
                          </h3>
                          <div className="relative">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {property.description}
                        </p>
                        
                        <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{property.city}, {property.country}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold text-green-600">
                            ${property.price?.toLocaleString()}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => window.location.href = `/property/${property.id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="View Property"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => window.location.href = `/property/${property.id}/edit`}
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                              title="Edit Property"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProperty(property.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete Property"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Stats */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-gray-500">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {property.views || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {property.saves || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {property.enquiries || 0}
                            </span>
                          </div>
                          <span className="text-gray-400">
                            {new Date(property.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {properties.map((property) => {
                  const Icon = getPropertyTypeIcon(property.property_type);
                  const color = getPropertyTypeColor(property.property_type);
                  
                  return (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
                    >
                      <div className="flex items-start gap-4">
                        {/* Property Image */}
                        <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0">
                          {property.cover_image ? (
                            <img 
                              src={property.cover_image} 
                              alt={property.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                              <Camera className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        {/* Property Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {property.title}
                              </h3>
                              <div className="flex items-center gap-2 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}>
                                  {property.property_type}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property)}`}>
                                  {getStatusText(property)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => window.location.href = `/property/${property.id}`}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => window.location.href = `/property/${property.id}/edit`}
                                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProperty(property.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {property.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {property.city}, {property.country}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              {property.price?.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {property.views || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center mt-8 space-x-2">
            <button
              onClick={() => loadProperties(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => loadProperties(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyManagement;
