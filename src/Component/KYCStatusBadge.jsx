import React from 'react';
import { MdVerified, MdPending, MdError } from 'react-icons/md';
import { Link } from 'react-router-dom';

const KYCStatusBadge = ({ 
  kycStatus, 
  showLink = false, 
  size = 'sm',
  className = '' 
}) => {
  const getStatusConfig = () => {
    switch (kycStatus) {
      case 'approved':
        return {
          className: `inline-flex items-center gap-1 rounded-full font-medium ${
            size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
          } bg-green-100 text-green-800 border border-green-200 ${className}`,
          icon: <MdVerified className={`size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'`} />,
          text: 'KYC Verified',
          color: 'green'
        };
      case 'pending':
        return {
          className: `inline-flex items-center gap-1 rounded-full font-medium ${
            size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
          } bg-yellow-100 text-yellow-800 border border-yellow-200 ${className}`,
          icon: <MdPending className={`size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />,
          text: 'KYC Pending',
          color: 'yellow'
        };
      case 'rejected':
        return {
          className: `inline-flex items-center gap-1 rounded-full font-medium ${
            size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
          } bg-red-100 text-red-800 border border-red-200 ${className}`,
          icon: <MdError className={`size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />,
          text: 'KYC Rejected',
          color: 'red'
        };
      default:
        return {
          className: `inline-flex items-center gap-1 rounded-full font-medium ${
            size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
          } bg-gray-100 text-gray-800 border border-gray-200 ${className}`,
          icon: <MdPending className={`size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />,
          text: 'KYC Required',
          color: 'gray'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={config.className}>
        {config.icon}
        {config.text}
      </div>
      {showLink && kycStatus !== 'approved' && (
        <Link
          to="/kyc-verification"
          className={`text-${
            config.color === 'gray' ? 'primary' : config.color
          }-600 hover:text-${
            config.color === 'gray' ? 'primary' : config.color
          }-800 text-xs font-medium underline transition-colors`}
        >
          {kycStatus ? 'Update KYC' : 'Complete KYC Verification'}
        </Link>
      )}
    </div>
  );
};

export default KYCStatusBadge;
