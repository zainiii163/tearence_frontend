import React from 'react';

const SkeletonButton = ({ 
  size = 'default', 
  variant = 'default',
  className = '',
  children,
  loading = false,
  ...props 
}) => {
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    default: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base'
  };

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
  };

  if (loading) {
    return (
      <div className={`
        inline-flex items-center justify-center rounded-md font-medium transition-colors
        disabled:pointer-events-none disabled:opacity-50
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
        animate-pulse
      `}>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-current rounded-full opacity-20"></div>
          <div className="h-4 bg-current rounded w-16 opacity-20"></div>
        </div>
      </div>
    );
  }

  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-md font-medium transition-colors
        disabled:pointer-events-none disabled:opacity-50
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default SkeletonButton;
