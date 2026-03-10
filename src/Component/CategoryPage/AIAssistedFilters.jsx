import React, { useState, useEffect } from 'react';
import { FaBrain, FaFilter, FaTimes, FaCheck, FaLightbulb } from 'react-icons/fa';

const AIAssistedFilters = ({ category, onFiltersChange, currentFilters }) => {
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // AI-powered filter suggestions based on category
  const categoryFilterMappings = {
    'vehicles': [
      { name: 'Vehicle Type', options: ['Car', 'Motorcycle', 'Truck', 'SUV', 'Van', 'Boat'], type: 'checkbox' },
      { name: 'Year Range', options: ['2020-2024', '2015-2019', '2010-2014', '2000-2009', 'Before 2000'], type: 'radio' },
      { name: 'Mileage', options: ['Under 10k', '10k-50k', '50k-100k', '100k-150k', 'Over 150k'], type: 'radio' },
      { name: 'Fuel Type', options: ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Other'], type: 'checkbox' },
      { name: 'Transmission', options: ['Automatic', 'Manual', 'CVT'], type: 'radio' },
      { name: 'Condition', options: ['New', 'Like New', 'Excellent', 'Good', 'Fair'], type: 'radio' }
    ],
    'property': [
      { name: 'Property Type', options: ['House', 'Apartment', 'Condo', 'Townhouse', 'Land', 'Commercial'], type: 'radio' },
      { name: 'Bedrooms', options: ['Studio', '1 Bed', '2 Beds', '3 Beds', '4+ Beds'], type: 'radio' },
      { name: 'Bathrooms', options: ['1 Bath', '2 Baths', '3 Baths', '4+ Baths'], type: 'radio' },
      { name: 'Price Range', options: ['Under $100k', '$100k-$250k', '$250k-$500k', '$500k-$1M', 'Over $1M'], type: 'radio' },
      { name: 'Square Feet', options: ['Under 500', '500-1000', '1000-1500', '1500-2500', 'Over 2500'], type: 'radio' },
      { name: 'Features', options: ['Parking', 'Pool', 'Garden', 'Garage', 'Pet Friendly'], type: 'checkbox' }
    ],
    'electronics': [
      { name: 'Category', options: ['Smartphones', 'Laptops', 'Tablets', 'Gaming', 'Audio', 'Cameras'], type: 'radio' },
      { name: 'Brand', options: ['Apple', 'Samsung', 'Sony', 'LG', 'Microsoft', 'Dell', 'HP'], type: 'checkbox' },
      { name: 'Condition', options: ['Brand New', 'Like New', 'Excellent', 'Good', 'For Parts'], type: 'radio' },
      { name: 'Price Range', options: ['Under $50', '$50-$200', '$200-$500', '$500-$1000', 'Over $1000'], type: 'radio' },
      { name: 'Features', options: ['Wireless', 'Waterproof', '4K/HD', 'Bluetooth', 'Touch Screen'], type: 'checkbox' }
    ],
    'fashion': [
      { name: 'Category', options: ["Men's", "Women's", 'Kids', 'Unisex', 'Accessories'], type: 'radio' },
      { name: 'Size', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Plus Size'], type: 'checkbox' },
      { name: 'Brand', options: ['Nike', 'Adidas', 'Zara', 'H&M', 'Gucci', 'Louis Vuitton'], type: 'checkbox' },
      { name: 'Condition', options: ['New with Tags', 'Like New', 'Excellent', 'Good', 'Fair'], type: 'radio' },
      { name: 'Color', options: ['Black', 'White', 'Blue', 'Red', 'Green', 'Other'], type: 'checkbox' },
      { name: 'Material', options: ['Cotton', 'Polyester', 'Wool', 'Silk', 'Leather', 'Denim'], type: 'checkbox' }
    ],
    'jobs': [
      { name: 'Job Type', options: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'], type: 'radio' },
      { name: 'Experience Level', options: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'], type: 'radio' },
      { name: 'Industry', options: ['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing'], type: 'checkbox' },
      { name: 'Salary Range', options: ['Under $30k', '$30k-$50k', '$50k-$75k', '$75k-$100k', 'Over $100k'], type: 'radio' },
      { name: 'Remote Work', options: ['Remote', 'Hybrid', 'On-site'], type: 'radio' },
      { name: 'Benefits', options: ['Health Insurance', '401k', 'Paid Time Off', 'Flexible Hours'], type: 'checkbox' }
    ],
    'services': [
      { name: 'Service Type', options: ['Consulting', 'Repair', 'Design', 'Writing', 'Marketing', 'Legal'], type: 'radio' },
      { name: 'Experience Level', options: ['Beginner', 'Intermediate', 'Expert', 'Professional'], type: 'radio' },
      { name: 'Availability', options: ['Immediate', 'Within 1 week', 'Within 1 month', 'Flexible'], type: 'radio' },
      { name: 'Service Mode', options: ['Online', 'In-person', 'Hybrid'], type: 'radio' },
      { name: 'Languages', options: ['English', 'Spanish', 'French', 'German', 'Mandarin'], type: 'checkbox' }
    ]
  };

  // Generic filters for categories without specific mappings
  const genericFilters = [
    { name: 'Price Range', options: ['Under $25', '$25-$50', '$50-$100', '$100-$250', 'Over $250'], type: 'radio' },
    { name: 'Condition', options: ['Brand New', 'Like New', 'Excellent', 'Good', 'Fair'], type: 'radio' },
    { name: 'Location', options: ['Near Me', 'Same City', 'Same State', 'Nationwide'], type: 'radio' },
    { name: 'Seller Type', options: ['Individual', 'Business', 'Dealer'], type: 'radio' }
  ];

  useEffect(() => {
    if (category && expanded) {
      generateAISuggestions();
    }
  }, [category, expanded]);

  const generateAISuggestions = async () => {
    setLoading(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get relevant filters for this category
    const relevantFilters = categoryFilterMappings[category?.toLowerCase()] || genericFilters;
    
    // AI "smart" suggestions based on category
    const suggestions = relevantFilters.map(filter => ({
      ...filter,
      aiRecommended: true,
      reasoning: getFilterReasoning(filter.name, category),
      priority: getFilterPriority(filter.name, category)
    })).sort((a, b) => b.priority - a.priority);

    setAiSuggestions(suggestions);
    setLoading(false);
  };

  const getFilterReasoning = (filterName, category) => {
    const reasoningMap = {
      'Vehicle Type': `Most users searching for ${category} filter by vehicle type first`,
      'Price Range': 'Price is the most important factor for most buyers',
      'Condition': 'Condition significantly affects value and satisfaction',
      'Brand': 'Brand preference is common in this category',
      'Size': 'Size/fit is crucial for satisfaction',
      'Location': 'Local availability matters for this item type',
      'Job Type': 'Employment type is a primary consideration',
      'Experience Level': 'Experience requirements determine fit'
    };
    
    return reasoningMap[filterName] || `This filter is commonly used for ${category} searches`;
  };

  const getFilterPriority = (filterName, category) => {
    const highPriorityFilters = ['Price Range', 'Condition', 'Category', 'Vehicle Type', 'Job Type'];
    const mediumPriorityFilters = ['Brand', 'Size', 'Location', 'Year Range'];
    
    if (highPriorityFilters.includes(filterName)) return 3;
    if (mediumPriorityFilters.includes(filterName)) return 2;
    return 1;
  };

  const handleFilterSelect = (filterName, option) => {
    const newFilters = { ...currentFilters };
    
    if (!newFilters[filterName]) {
      newFilters[filterName] = [];
    }
    
    if (Array.isArray(newFilters[filterName])) {
      // Checkbox behavior - toggle selection
      if (newFilters[filterName].includes(option)) {
        newFilters[filterName] = newFilters[filterName].filter(item => item !== option);
      } else {
        newFilters[filterName] = [...newFilters[filterName], option];
      }
    } else {
      // Radio behavior - single selection
      newFilters[filterName] = option;
    }
    
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(currentFilters).length > 0 && 
    Object.values(currentFilters).some(value => 
      Array.isArray(value) ? value.length > 0 : value !== ''
    );

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaBrain className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">AI Smart Filters</h3>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            {expanded ? 'Hide' : 'Show'}
          </button>
        </div>
        {expanded && (
          <p className="text-xs text-gray-600 mt-2">
            AI-powered filters tailored for this category
          </p>
        )}
      </div>

      {expanded && (
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent"></div>
              <span className="ml-2 text-gray-600">AI is analyzing...</span>
            </div>
          ) : (
            <>
              {aiSuggestions.length > 0 ? (
                <div className="space-y-4">
                  {aiSuggestions.map((filter, filterIndex) => (
                    <div key={filter.name} className="border border-gray-100 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            {filter.name}
                            {filter.aiRecommended && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800">
                                <FaLightbulb className="h-3 w-3 mr-1" />
                                AI Recommended
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">{filter.reasoning}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {filter.options.map((option) => {
                          const isSelected = Array.isArray(currentFilters[filter.name])
                            ? currentFilters[filter.name]?.includes(option)
                            : currentFilters[filter.name] === option;
                          
                          return (
                            <label
                              key={option}
                              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                            >
                              <input
                                type={filter.type === 'checkbox' ? 'checkbox' : 'radio'}
                                name={filter.name}
                                value={option}
                                checked={isSelected}
                                onChange={() => handleFilterSelect(filter.name, option)}
                                className="text-purple-600 border-purple-300 focus:ring-purple-500"
                              />
                              <span className={`text-sm ${isSelected ? 'font-medium text-purple-700' : 'text-gray-700'}`}>
                                {option}
                              </span>
                              {isSelected && <FaCheck className="h-3 w-3 text-purple-600" />}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaBrain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No AI suggestions available for this category</p>
                </div>
              )}

              {hasActiveFilters && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {Object.keys(currentFilters).length} filter(s) applied
                    </span>
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AIAssistedFilters;
