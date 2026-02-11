import React from 'react';

const SkeletonForm = ({ showTitle = true, fieldCount = 4 }) => {
  return (
    <div className="max-w-md mx-auto bg-card rounded-lg shadow-sm p-6 animate-pulse">
      {/* Title Skeleton */}
      {showTitle && (
        <div className="mb-6">
          <div className="h-6 bg-muted rounded w-48 mx-auto"></div>
        </div>
      )}
      
      {/* Form Fields Skeleton */}
      <div className="space-y-4">
        {[...Array(fieldCount)].map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 bg-muted rounded w-20"></div>
            <div className="h-10 bg-muted rounded w-full"></div>
          </div>
        ))}
        
        {/* Button Skeleton */}
        <div className="pt-4">
          <div className="h-10 bg-muted rounded w-full"></div>
        </div>
        
        {/* Additional Links Skeleton */}
        <div className="text-center pt-4 space-y-2">
          <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
          <div className="h-4 bg-muted rounded w-24 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonForm;
