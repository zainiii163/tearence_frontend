import React, { useState, useRef, useEffect } from "react";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";

const videoUrls = [
  "./video/Video-Ads-25.mp4",
  "./video/Video-Ads-27.mp4",
  "./video/Video-Ads-1.mp4",
  "./video/Video-Ads-2.mp4",
  "./video/Video-Ads-3.mp4",
  "./video/Video-Ads-4.mp4",
  "./video/Video-Ads-5.mp4",
  "./video/Video-Ads-6.mp4",
  "./video/Video-Ads-14.mp4",
  "./video/Video-Ads-16.mp4",
  "./video/Video-Ads-18.mp4",
  "./video/Video-Ads-20.mp4",
  "./video/Video-Ads-22.mp4",
  "./video/Video-Ads-24.mp4",
];

/**
 * Full-bleed hero video for homepage — one cinematic plane behind brand copy.
 * Pass children for overlay content (brand, headline, CTAs).
 */
function Video({ children, variant = "hero" }) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const handleVideoEnd = () => {
    setCurrentVideoIndex((i) => (i < videoUrls.length - 1 ? i + 1 : 0));
  };

  const goPrevious = () => {
    setCurrentVideoIndex((i) => (i > 0 ? i - 1 : videoUrls.length - 1));
  };

  const goNext = () => {
    setCurrentVideoIndex((i) => (i < videoUrls.length - 1 ? i + 1 : 0));
  };

  if (variant === "hero") {
    return (
      <section className="relative w-full h-[210px] sm:h-[240px] md:h-[280px] overflow-hidden bg-slate-900">
        {!reduceMotion ? (
          <video
            ref={videoRef}
            key={videoUrls[currentVideoIndex]}
            src={videoUrls[currentVideoIndex]}
            onEnded={handleVideoEnd}
            muted
            autoPlay
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover scale-[1.02]"
          />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1920&q=80)",
            }}
          />
        )}

        {/* Atmospheric brand wash — calm, secure teal (readable over video) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(2, 28, 48, 0.88) 0%, rgba(3, 90, 140, 0.62) 42%, rgba(8, 35, 55, 0.86) 100%), linear-gradient(to top, rgba(2, 20, 36, 0.92) 0%, rgba(2, 20, 36, 0.4) 50%, transparent 75%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[radial-gradient(ellipse_at_25%_15%,rgba(255,255,255,0.4),transparent_55%)]" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center pb-4 pt-4 sm:pb-5 sm:pt-5">
          <div className="page-container w-full animate-slide-up text-center">
            {children}
          </div>
        </div>

        <div className="absolute bottom-3 right-3 z-20 flex gap-1.5 sm:bottom-4 sm:right-4">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/25 bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/40"
            onClick={goPrevious}
            aria-label="Previous video"
          >
            <MdOutlineNavigateBefore className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/25 bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/40"
            onClick={goNext}
            aria-label="Next video"
          >
            <MdOutlineNavigateNext className="h-4 w-4" />
          </button>
        </div>
      </section>
    );
  }

  return null;
}

export default Video;
