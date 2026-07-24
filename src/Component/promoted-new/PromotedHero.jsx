import React from 'react';
import { TrendingUp, Eye, Heart, Globe } from 'lucide-react';

const PromotedHero = ({ statistics }) => {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
      <div className="page-container py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Promoted Adverts</h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Boost your visibility and reach more customers with premium promoted listings
          </p>
        </div>

        {statistics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold">{statistics.total_adverts || 0}</div>
              <div className="text-sm text-orange-100">Active Adverts</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Eye className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold">{statistics.total_views || 0}</div>
              <div className="text-sm text-orange-100">Total Views</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Heart className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold">{statistics.total_saves || 0}</div>
              <div className="text-sm text-orange-100">Total Saves</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Globe className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold">{statistics.total_countries || 0}</div>
              <div className="text-sm text-orange-100">Countries</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotedHero;
  