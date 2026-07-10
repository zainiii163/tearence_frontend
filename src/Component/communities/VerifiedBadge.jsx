import React from 'react';
import { FaCheckCircle, FaShieldAlt, FaAward, FaCertificate } from 'react-icons/fa';

const VerifiedBadge = ({ type = 'user', size = 'sm', showLabel = false }) => {
  const getBadgeConfig = (badgeType) => {
    const configs = {
      user: {
        icon: FaCheckCircle,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        label: 'Verified User'
      },
      business: {
        icon: FaShieldAlt,
        color: 'text-green-500',
        bgColor: 'bg-green-50',
        label: 'Verified Business'
      },
      community: {
        icon: FaAward,
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
        label: 'Community Verified'
      },
      expert: {
        icon: FaCertificate,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-50',
        label: 'Expert'
      }
    };
    return configs[badgeType] || configs.user;
  };

  const getSizeClasses = (badgeSize) => {
    const sizes = {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };
    return sizes[badgeSize] || sizes.sm;
  };

  const config = getBadgeConfig(type);
  const Icon = config.icon;
  const sizeClass = getSizeClasses(size);

  if (showLabel) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${config.bgColor} ${config.color}`}>
        <Icon className={sizeClass} />
        <span className="text-xs font-medium">{config.label}</span>
      </div>
    );
  }

  return (
    <Icon className={`${sizeClass} ${config.color}`} title={config.label} />
  );
};

export default VerifiedBadge;
