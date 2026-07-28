import React, { useState, useRef, useEffect, memo } from 'react';
import {
  getResponsiveImageProps,
  getLazySrc,
  FALLBACK_IMG,
} from '../../utils/responsiveImage';
import './LazyImage.css';

/**
 * Bandwidth-aware lazy image: IntersectionObserver + srcset + optional LQIP.
 */
const LazyImage = ({
  src,
  alt,
  className = '',
  placeholder = FALLBACK_IMG,
  onError,
  variant = 'card',
  aspectRatio,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [srcSet, setSrcSet] = useState(undefined);
  const [sizes, setSizes] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [failed, setFailed] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px', threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || !src) return undefined;

    setFailed(false);
    setIsLoaded(false);
    const responsive = getResponsiveImageProps(src, { variant });
    const img = new Image();
    if (responsive.srcSet) img.srcset = responsive.srcSet;
    img.src = responsive.src;

    img.onload = () => {
      setImageSrc(responsive.src);
      setSrcSet(responsive.srcSet);
      setSizes(responsive.sizes);
      setIsLoaded(true);
    };

    img.onerror = () => {
      setImageSrc(placeholder || FALLBACK_IMG);
      setSrcSet(undefined);
      setSizes(undefined);
      setFailed(true);
      setIsLoaded(true);
      onError?.();
    };

    return undefined;
  }, [isInView, src, placeholder, onError, variant]);

  const lqip = src ? getLazySrc(src, 32) : null;
  const style = aspectRatio ? { aspectRatio } : undefined;

  return (
    <div
      ref={wrapRef}
      className={`lazy-image-wrapper ${className}`}
      style={style}
    >
      {!isInView && <div className="lazy-image-skeleton" aria-hidden="true" />}

      {isInView && !isLoaded && !failed && lqip && lqip !== FALLBACK_IMG && (
        <img src={lqip} alt="" className="lazy-image-placeholder" aria-hidden="true" />
      )}

      {isInView && (
        <img
          src={imageSrc || placeholder}
          srcSet={failed ? undefined : srcSet}
          sizes={failed ? undefined : sizes}
          alt={alt}
          className={`lazy-image ${isLoaded ? 'lazy-image--loaded' : ''}`}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          {...props}
        />
      )}
    </div>
  );
};

export default memo(LazyImage);
