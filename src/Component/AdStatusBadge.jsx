import React from 'react';
import { FaCheckCircle, FaClock, FaTimesCircle, FaPauseCircle } from 'react-icons/fa';

const AdStatusBadge = ({ 
  status, 
  size = 'sm',
  showText = true,
  className = '' 
}) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'active':
        return {
          className: `inline-flex items-center gap-1 rounded-full font-medium ${
            size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
          } bg-green-100 text-green-800 border border-green-200 ${className}`,
          icon: <FaCheckCircle className={`size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />,
          text: 'Approved'
        };
      case 'pending':
        return {
          className: `inline-flex items-center gap-1 rounded-full font-medium ${
            size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
          } bg-yellow-100 text-yellow-800 border border-yellow-200 ${className}`,
          icon: <FaClock className={`size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />,
          text: 'Pending'
        };
      case 'rejected':
        return {
          className: `inline-flex items-center gap-1 rounded-full font-medium ${
            size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
          } bg-red-100 text-red-800 border border-red-200 ${className}`,
          icon: <FaTimesCircle className={`size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />,
          text: 'Rejected'
        };
      case 'expired':
        return {
          className: `inline-flex items-center gap-1 rounded-full font-medium ${
            size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
          } bg-gray-100 text-gray-800 border border-gray-200 ${className}`,
          icon: <FaPauseCircle className={`size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />,
          text: 'Expired'
        };
      default:
        return {
          className: `inline-flex items-center gap-1 rounded-full font-medium ${
            size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
          } bg-gray-100 text-gray-800 border border-gray-200 ${className}`,
          icon: <FaClock className={`size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />,
          text: 'Unknown'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={config.className}>
      {config.icon}
      {showText && config.text}
    </div>
  );
};

export default AdStatusBadge;
