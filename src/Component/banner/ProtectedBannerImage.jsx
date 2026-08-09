import React from 'react';

/**
 * Preview-only banner image — blocks right-click / drag open so visitors
 * cannot casually save the creative. Clean file only via paid download token.
 */
const ProtectedBannerImage = ({
  src,
  alt = '',
  className = '',
  onLoad,
  onError,
}) => {
  if (!src) {
    return <div className={`bg-slate-200 ${className}`} />;
  }

  return (
    <div className={`relative overflow-hidden select-none ${className}`}>
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="w-full h-full object-cover pointer-events-none"
        onContextMenu={(e) => e.preventDefault()}
        onLoad={onLoad}
        onError={onError}
      />
      <div
        className="absolute inset-0 z-[1]"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-white/90 text-center">
          Preview · Buy to download
        </p>
      </div>
    </div>
  );
};

export default ProtectedBannerImage;
