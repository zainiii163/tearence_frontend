import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Hash, 
  Star,
  Eye,
  Calendar,
  ExternalLink,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Heart,
  MessageSquare,
  DollarSign,
  Building,
  Car,
  Briefcase,
  Home,
  Hotel
} from 'lucide-react';
import { Link } from 'react-router-dom';

const RightRail = () => {
  const [expandedSection, setExpandedSection] = useState('trending');

  // Mock data for demonstration
  const trendingCommunities = [
    {
      id: 1,
      name: 'Property & Real Estate - UK',
      category: 'property',
      categoryLabel: 'Property & Real Estate',
      scope: 'Regional',
      stats: {
        members: '42k',
        postsToday: 312,
        activeNow: 89
      },
      description: 'Everything property-related in the United Kingdom',
      trending: true,
      memberCount: 42000
    },
    {
      id: 2,
      name: 'Funding & Investment - Startups',
      category: 'funding',
      categoryLabel: 'Funding & Investment',
      scope: 'Global',
      stats: {
        members: '28k',
        postsToday: 156,
        activeNow: 45
      },
      description: 'Startup funding and investment opportunities worldwide',
      trending: true,
      memberCount: 28000
    },
    {
      id: 3,
      name: 'Jobs & Vacancies - Tech',
      category: 'jobs',
      categoryLabel: 'Jobs & Vacancies',
      scope: 'Industry',
      stats: {
        members: '35k',
        postsToday: 89,
        activeNow: 67
      },
      description: 'Technology job opportunities and career discussions',
      trending: false,
      memberCount: 35000
    },
    {
      id: 4,
      name: 'Vehicles & Transport - EU',
      category: 'vehicles',
      categoryLabel: 'Vehicles & Transport',
      scope: 'Regional',
      stats: {
        members: '18k',
        postsToday: 67,
        activeNow: 34
      },
      description: 'Vehicle sales and transport discussions across Europe',
      trending: false,
      memberCount: 18000
    }
  ];

  const hotTopics = [
    { name: '#StartupFunding', count: 1234, trend: 'up' },
    { name: '#StudentHousing', count: 892, trend: 'up' },
    { name: '#UsedCarsUK', count: 756, trend: 'stable' },
    { name: '#CharityDrives', count: 623, trend: 'down' },
    { name: '#RemoteJobs', count: 589, trend: 'up' },
    { name: '#PropertyInvestment', count: 445, trend: 'up' },
    { name: '#TechCareers', count: 387, trend: 'stable' },
    { name: '#EVCharging', count: 298, trend: 'up' },
    { name: '#FreelanceTips', count: 267, trend: 'down' }
  ];

  const featuredCampaigns = [
    {
      id: 1,
      title: 'Summer Property Sale Festival',
      description: 'Exclusive deals on residential and commercial properties',
      type: 'sponsored',
      category: 'property',
      image: '/images/campaign-property.jpg',
      link: '/campaigns/summer-property',
      cta: 'View Deals',
      endDate: '2024-08-31'
    },
    {
      id: 2,
      title: 'Startup Funding Week 2024',
      description: 'Connect with investors and showcase your startup',
      type: 'featured',
      category: 'funding',
      image: '/images/campaign-funding.jpg',
      link: '/campaigns/startup-funding',
      cta: 'Participate',
      endDate: '2024-07-15'
    },
    {
      id: 3,
      title: 'Tech Job Fair - London',
      description: 'Meet top tech companies and find your dream job',
      type: 'sponsored',
      category: 'jobs',
      image: '/images/campaign-jobs.jpg',
      link: '/campaigns/tech-jobs',
      cta: 'Register Now',
      endDate: '2024-06-30'
    }
  ];

  const getCategoryIcon = (category) => {
    const iconMap = {
      'property': Home,
      'funding': DollarSign,
      'jobs': Briefcase,
      'vehicles': Car,
      'services': Building,
      'business': Building,
      'charities': Heart,
      'events': Calendar,
      'travel': Hotel
    };
    return iconMap[category] || Users;
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="w-80 space-y-6">
      {/* Trending Communities */}
      <div className="bg-white rounded-lg border border-gray-200">
        <button
          onClick={() => toggleSection('trending')}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-t-lg"
        >
          <h3 className="font-semibold text-gray-900 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-orange-500" />
            Trending Communities
          </h3>
          <ChevronDown 
            className={`w-4 h-4 text-gray-600 transition-transform ${
              expandedSection === 'trending' ? 'rotate-180' : ''
            }`}
          />
        </button>
        
        {expandedSection === 'trending' && (
          <div className="px-4 pb-4 space-y-3">
            {trendingCommunities.map((community) => (
              <div key={community.id} className="border border-gray-100 rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      {getCategoryIcon(community.category?.slug || community.category)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{community.name}</h4>
                      <p className="text-xs text-gray-500">{community.categoryLabel} • {community.scope}</p>
                    </div>
                  </div>
                  
                  <button
                    className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:bg-primary/90 transition-colors"
                  >
                    Join
                  </button>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{community.stats.members}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{community.stats.postsToday} today</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{community.stats.activeNow} active</span>
                    </div>
                  </div>
                  
                  {community.trending && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span>Trending</span>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-gray-600 mt-2">{community.description}</p>
              </div>
            ))}
            
            <Link
              to="/communities/discover"
              className="w-full mt-3 text-center text-sm text-primary hover:text-primary/80 font-medium"
            >
              Discover More Communities
            </Link>
          </div>
        )}
      </div>

      {/* Hot Topics */}
      <div className="bg-white rounded-lg border border-gray-200">
        <button
          onClick={() => toggleSection('topics')}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-t-lg"
        >
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Hash className="w-4 h-4 mr-2 text-blue-500" />
            Hot Topics
          </h3>
          <ChevronDown 
            className={`w-4 h-4 text-gray-600 transition-transform ${
              expandedSection === 'topics' ? 'rotate-180' : ''
            }`}
          />
        </button>
        
        {expandedSection === 'topics' && (
          <div className="px-4 pb-4 space-y-2">
            {hotTopics.map((topic, index) => (
              <button
                key={topic.name}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                  <span className="text-sm font-medium text-gray-900 group-hover:text-primary">{topic.name}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-600">{topic.count}</span>
                  {topic.trend === 'up' && (
                    <ArrowUp className="w-3 h-3 text-green-500" />
                  )}
                  {topic.trend === 'down' && (
                    <ArrowDown className="w-3 h-3 text-red-500" />
                  )}
                  {topic.trend === 'stable' && (
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Featured Campaigns */}
      <div className="bg-white rounded-lg border border-gray-200">
        <button
          onClick={() => toggleSection('campaigns')}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-t-lg"
        >
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            Featured Campaigns
          </h3>
          <ChevronDown 
            className={`w-4 h-4 text-gray-600 transition-transform ${
              expandedSection === 'campaigns' ? 'rotate-180' : ''
            }`}
          />
        </button>
        
        {expandedSection === 'campaigns' && (
          <div className="px-4 pb-4 space-y-4">
            {featuredCampaigns.map((campaign) => (
              <div key={campaign.id} className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <Link to={campaign.link} className="block">
                  <div className="relative">
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="w-full h-32 object-cover"
                    />
                    
                    {/* Campaign Type Badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.type === 'sponsored' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {campaign.type === 'sponsored' ? 'Sponsored' : 'Featured'}
                      </span>
                    </div>
                    
                    {/* Campaign Content */}
                    <div className="p-3">
                      <h4 className="font-medium text-gray-900 text-sm mb-1">{campaign.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{campaign.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Ends: {campaign.endDate}
                        </div>
                        
                        <div className="flex items-center space-x-1 text-primary">
                          <span className="text-xs font-medium">{campaign.cta}</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
            
            <Link
              to="/campaigns"
              className="w-full mt-3 text-center text-sm text-primary hover:text-primary/80 font-medium"
            >
              View All Campaigns
            </Link>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Platform Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Active Users</span>
            <span className="text-sm font-medium text-gray-900">1.2M</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Communities</span>
            <span className="text-sm font-medium text-gray-900">8,456</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Posts Today</span>
            <span className="text-sm font-medium text-gray-900">23,891</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Active Now</span>
            <span className="text-sm font-medium text-green-600">892</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightRail;
