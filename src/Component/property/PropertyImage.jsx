import React, { useState, useEffect } from 'react';
import { FiHome } from 'react-icons/fi';
import {
  collectPropertyImageUrls,
  getPropertyFallbackImage,
} from '../../utils/propertyImage';

/**
 * Property photo with storage-404 fallback (API often returns URLs for missing files).
 */
const PropertyImage = ({
  property,
  alt = 'Property',
  className = 'w-full h-full object-cover',
  fallbackIconClassName = 'h-10 w-10 text-white/40',
}) => {
  const candidates = collectPropertyImageUrls(property);
  const fallback = getPropertyFallbackImage(property);
  const [src, setSrc] = useState(candidates[0] || fallback);
  const [attempt, setAttempt] = useState(0);
  const [failedAll, setFailedAll] = useState(false);

  useEffect(() => {
    const next = collectPropertyImageUrls(property);
    setAttempt(0);
    setFailedAll(false);
    setSrc(next[0] || getPropertyFallbackImage(property));
  }, [property]);

  const handleError = () => {
    const list = collectPropertyImageUrls(property);
    const nextIndex = attempt + 1;
    if (nextIndex < list.length) {
      setAttempt(nextIndex);
      setSrc(list[nextIndex]);
      return;
    }
    // Tried all API URLs — use curated fallback once
    if (src !== fallback) {
      setSrc(fallback);
      return;
    }
    setFailedAll(true);
  };

  if (failedAll || !src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0c1520] to-[#2a3f55]">
        <FiHome className={fallbackIconClassName} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={handleError}
    />
  );
};

export default PropertyImage;
