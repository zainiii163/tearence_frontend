import React from 'react';

const SkeletonCard = ({ showImage = true, showCategory = true, showActions = true }) => {
  return (
    <div className="rounded-lg border bg-card shadow-sm animate-pulse">
      {/* Image Skeleton */}
      {showImage && (
        <div className="aspect-video overflow-hidden rounded-t-lg bg-muted"></div>
      )}
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Category Badge Skeleton */}
        {showCategory && (
          <div className="h-6 bg-muted rounded-full w-16"></div>
        )}
        
        {/* Title and Description Skeleton */}
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        
        {/* Location/Meta Skeleton */}
        <div className="h-4 bg-muted rounded w-24"></div>
        
        {/* Price and Actions Skeleton */}
        {showActions && (
          <div className="flex items-center justify-between pt-2">
            <div className="h-6 bg-muted rounded w-20"></div>
            <div className="flex space-x-2">
              <div className="h-8 w-8 bg-muted rounded"></div>
              <div className="h-8 w-8 bg-muted rounded"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkeletonCard;
