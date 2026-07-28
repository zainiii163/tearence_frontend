import React, { useState, useEffect, memo } from 'react';
import { FiHome } from 'react-icons/fi';
import {
  collectPropertyImageUrls,
  getPropertyFallbackImage,
} from '../../utils/propertyImage';
import { getResponsiveImageProps } from '../../utils/responsiveImage';

/**
 * Property photo with storage-404 fallback + responsive sizing for mobile.
 * Keeps existing `property` prop API used across browse/detail pages.
 */
const PropertyImage = ({
  property,
  alt = 'Property',
  className = 'w-full h-full object-cover',
  fallbackIconClassName = 'h-10 w-10 text-white/40',
  variant = 'card',
  showCount = false,
}) => {
  const candidates = collectPropertyImageUrls(property);
  const fallback = getPropertyFallbackImage(property);
  const initial = getResponsiveImageProps(candidates[0] || fallback, { variant });
  const [src, setSrc] = useState(initial.src);
  const [srcSet, setSrcSet] = useState(initial.srcSet);
  const [sizes, setSizes] = useState(initial.sizes);
  const [attempt, setAttempt] = useState(0);
  const [failedAll, setFailedAll] = useState(false);

  useEffect(() => {
    const next = collectPropertyImageUrls(property);
    const raw = next[0] || getPropertyFallbackImage(property);
    const responsive = getResponsiveImageProps(raw, { variant });
    setAttempt(0);
    setFailedAll(false);
    setSrc(responsive.src);
    setSrcSet(responsive.srcSet);
    setSizes(responsive.sizes);
  }, [property, variant]);

  const handleError = () => {
    const list = collectPropertyImageUrls(property);
    const nextIndex = attempt + 1;
    if (nextIndex < list.length) {
      setAttempt(nextIndex);
      const responsive = getResponsiveImageProps(list[nextIndex], { variant });
      setSrc(responsive.src);
      setSrcSet(responsive.srcSet);
      setSizes(responsive.sizes);
      return;
    }
    const fb = getResponsiveImageProps(fallback, { variant });
    if (src !== fb.src) {
      setSrc(fb.src);
      setSrcSet(fb.srcSet);
      setSizes(fb.sizes);
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
    <div className="relative w-full h-full">
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        className={className}
        loading="lazy"
        decoding="async"
        onError={handleError}
      />
      {showCount && candidates.length > 1 && (
        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white">
          +{candidates.length - 1}
        </span>
      )}
    </div>
  );
};

export default memo(PropertyImage);
