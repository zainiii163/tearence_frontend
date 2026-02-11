import React from 'react';

const SkeletonList = ({ itemCount = 5 }) => {
  return (
    <div className="divide-y divide-border">
      {[...Array(itemCount)].map((_, index) => (
        <div key={index} className="p-4 animate-pulse">
          <div className="flex items-start space-x-3">
            {/* Avatar Skeleton */}
            <div className="w-10 h-10 bg-muted rounded-full flex-shrink-0"></div>
            
            {/* Content Skeleton */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-muted rounded w-32"></div>
                <div className="h-4 bg-muted rounded w-8"></div>
              </div>
              
              <div className="h-3 bg-muted rounded w-24"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
              
              <div className="flex items-center space-x-1">
                <div className="h-3 w-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonList;
