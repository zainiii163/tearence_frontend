import React, { useState } from 'react';
import { FaImage } from 'react-icons/fa';
import { getListingImageUrl } from '../../utils/dashboardImageHelpers';

const DashboardListThumbnail = ({
  item,
  fallback: Fallback = FaImage,
  className = 'h-12 w-12',
  rounded = 'rounded',
}) => {
  const [broken, setBroken] = useState(false);
  const url = getListingImageUrl(item);

  if (!url || broken) {
    return (
      <div className={`${className} bg-gray-100 ${rounded} flex items-center justify-center flex-shrink-0`}>
        <Fallback className="text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt=""
      className={`${className} ${rounded} object-cover flex-shrink-0 bg-gray-100`}
      onError={() => setBroken(true)}
    />
  );
};

export default DashboardListThumbnail;
