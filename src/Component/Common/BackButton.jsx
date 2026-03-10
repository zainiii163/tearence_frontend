import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const BackButton = ({ 
  className = '', 
  onClick, 
  children = 'Back',
  showIcon = true,
  variant = 'default' // 'default', 'ghost', 'outline'
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const baseClasses = 'inline-flex items-center px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm';
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button
      onClick={handleClick}
      className={combinedClasses}
    >
      {showIcon && <FiArrowLeft className="h-4 w-4 mr-2" />}
      {children}
    </button>
  );
};

export default BackButton;
