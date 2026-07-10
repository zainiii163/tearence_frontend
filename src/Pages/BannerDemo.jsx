import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Plus, 
  BarChart3, 
  Settings, 
  Code,
  Database,
  Globe,
  CheckCircle,
  ArrowRight,
  Play,
  Pause
} from 'lucide-react';
import BannerDisplay from '../Component/Banner/BannerDisplay';
import BannerManagement from './BannerManagement';

const BannerDemo = () => {
  const [activeDemo, setActiveDemo] = useState('display');
  const [showCode, setShowCode] = useState(false);

  const demos = [
    {
      id: 'display',
      title: 'Banner Display Component',
      description: 'Interactive banner gallery with real data',
      icon: Eye,
      component: BannerDisplay,
      code: `import BannerDisplay from '../Component/Banner/BannerDisplay';

function MyPage() {
  return (
    <BannerDisplay 
      showCreateButton={true}
      maxHeight="auto"
    />
  );
}`
    },
    {
      id: 'management',
      title: 'Banner Management Dashboard',
      description: 'Complete admin dashboard for banner management',
      icon: Settings,
      component: BannerManagement,
      code: `import BannerManagement from '../Pages/BannerManagement';

function AdminPage() {
  return <BannerManagement />;
}`
    },
    {
      id: 'analytics',
      title: 'Analytics & Statistics',
      description: 'Real-time analytics and performance tracking',
      icon: BarChart3,
      component: null,
      code: `import { getBannerStats, getMyBannerAds } from '../api/banner';

const stats = await getBannerStats();
const myBanners = await getMyBannerAds();`
    }
  ];

  const features = [
    {
      title: 'Real API Integration',
      description: 'Connects to Laravel backend with live data',
      icon: Database,
      implemented: true
    },
    {
      title: 'File Upload System',
      description: 'Support for images, logos, and animated banners',
      icon: Globe,
      implemented: true
    },
    {
      title: 'Multi-Step Forms',
      description: 'Progressive banner creation with validation',
      icon: Plus,
      implemented: true
    },
    {
      title: 'Click Tracking',
      description: 'Real-time analytics and performance metrics',
      icon: BarChart3,
      implemented: true
    },
    {
      title: 'Responsive Design',
      description: 'Mobile-first design with smooth animations',
      icon: Eye,
      implemented: true
    },
    {
      title: 'Error Handling',
      description: 'Comprehensive error states and recovery',
      icon: Settings,
      implemented: true
    }
  ];

  const apiEndpoints = [
    { method: 'GET', endpoint: '/api/banner-ads', description: 'Get all banners' },
    { method: 'GET', endpoint: '/api/banner-ads/featured', description: 'Get featured banners' },
    { method: 'POST', endpoint: '/api/banner-ads', description: 'Create new banner' },
    { method: 'PUT', endpoint: '/api/banner-ads/{id}', description: 'Update banner' },
    { method: 'DELETE', endpoint: '/api/banner-ads/{id}', description: 'Delete banner' },
    { method: 'GET', endpoint: '/api/banner-categories', description: 'Get categories' },
    { method: 'POST', endpoint: '/api/banner-upload/banner-image', description: 'Upload image' }
  ];

  const currentDemo = demos.find(d => d.id === activeDemo);
  const CurrentComponent = currentDemo?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Banner System Integration</h1>
            <p className="text-xl mb-8 text-blue-100">
              Complete frontend-backend integration with real data and API connectivity
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Backend API Connected</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Real Data Flow</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Production Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Navigation */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Interactive Demos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {demos.map(demo => {
              const Icon = demo.icon;
              return (
                <button
                  key={demo.id}
                  onClick={() => setActiveDemo(demo.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    activeDemo === demo.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-2 ${
                    activeDemo === demo.id ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                  <h3 className="font-medium text-gray-900">{demo.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{demo.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Demo */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{currentDemo?.title}</h2>
              <p className="text-gray-600">{currentDemo?.description}</p>
            </div>
            <button
              onClick={() => setShowCode(!showCode)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Code className="w-4 h-4" />
              {showCode ? 'Hide Code' : 'Show Code'}
            </button>
          </div>

          {/* Code Display */}
          {showCode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
                  <code>{currentDemo?.code}</code>
                </pre>
              </div>
            </motion.div>
          )}

          {/* Component Display */}
          {CurrentComponent ? (
            <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
              <CurrentComponent />
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Demo</h3>
              <p className="text-gray-600 mb-4">
                Analytics features are integrated into the Banner Management dashboard
              </p>
              <button
                onClick={() => setActiveDemo('management')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Management Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Implemented Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${
                      feature.implemented ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        feature.implemented ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                      {feature.implemented && (
                        <div className="flex items-center gap-1 mt-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-600">Implemented</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* API Endpoints */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Available API Endpoints</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {apiEndpoints.map((endpoint, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  endpoint.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                  endpoint.method === 'POST' ? 'bg-green-100 text-green-700' :
                  endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {endpoint.method}
                </span>
                <code className="text-sm text-gray-700">{endpoint.endpoint}</code>
                <span className="text-sm text-gray-600">{endpoint.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Quick Integration</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-medium text-blue-900">Import Components</h3>
                <p className="text-blue-700 text-sm">
                  Import BannerDisplay and BannerSubmissionForm into your React components
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                <span className="text-blue-600 font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-medium text-blue-900">Configure API</h3>
                <p className="text-blue-700 text-sm">
                  Set up API base URL and authentication in your environment
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                <span className="text-blue-600 font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-medium text-blue-900">Add to Routes</h3>
                <p className="text-blue-700 text-sm">
                  Include banner management routes in your React Router configuration
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerDemo;
