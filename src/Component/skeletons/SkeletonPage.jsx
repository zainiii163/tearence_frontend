import React from 'react';

const SkeletonPage = ({ showHeader = true, showCategories = true }) => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 animate-pulse">
      {/* Header Skeleton */}
      {showHeader && (
        <div className="w-full bg-white shadow-sm">
          <div className="page-container py-4">
            <div className="flex items-center justify-between">
              <div className="h-8 bg-muted rounded w-32"></div>
              <div className="flex space-x-4">
                <div className="h-8 bg-muted rounded w-20"></div>
                <div className="h-8 bg-muted rounded w-20"></div>
                <div className="h-8 bg-muted rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section Skeleton */}
      <div className="w-full py-16 sm:py-20 lg:py-24">
        <div className="page-container text-center">
          <div className="h-12 bg-muted rounded w-96 mx-auto mb-6"></div>
          <div className="h-6 bg-muted rounded w-128 mx-auto mb-8"></div>
          <div className="h-12 bg-muted rounded w-40 mx-auto"></div>
        </div>
      </div>
      
      {/* Categories Grid Skeleton */}
      {showCategories && (
        <div className="w-full py-16 sm:py-20 lg:py-24 bg-background">
          <div className="page-container">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="rounded-2xl bg-muted border-2 border-muted p-6 sm:p-8">
                  <div className="w-16 h-16 bg-gray-300 rounded-xl mb-6"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3 mb-6"></div>
                  <div className="flex items-center">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                    <div className="h-4 w-4 bg-gray-300 rounded ml-2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Content Section Skeleton */}
      <div className="w-full py-16 bg-white">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="rounded-lg bg-muted p-6">
                <div className="aspect-video bg-gray-300 rounded mb-4"></div>
                <div className="h-5 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-300 rounded w-16"></div>
                  <div className="h-8 bg-gray-300 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonPage;
