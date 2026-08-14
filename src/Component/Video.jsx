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

const POSTER =
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=70";

/**
 * Full-bleed hero video — poster first, then load video after idle so homepage paints fast.
 */
function Video({ children, variant = "hero" }) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [canPlayVideo, setCanPlayVideo] = useState(false);
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

  useEffect(() => {
    if (reduceMotion) return undefined;
    let cancelled = false;
    const enable = () => {
      if (!cancelled) setCanPlayVideo(true);
    };
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(enable, { timeout: 2500 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback?.(id);
      };
    }
    const t = setTimeout(enable, 1200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [reduceMotion]);

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
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${POSTER})` }}
          aria-hidden
        />
        {!reduceMotion && canPlayVideo ? (
          <video
            ref={videoRef}
            key={videoUrls[currentVideoIndex]}
            src={videoUrls[currentVideoIndex]}
            onEnded={handleVideoEnd}
            muted
            autoPlay
            playsInline
            preload="none"
            poster={POSTER}
            className="absolute inset-0 h-full w-full object-cover scale-[1.02] transition-opacity duration-500"
          />
        ) : null}

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(15,23,42,0.55) 0%, rgba(15,23,42,0.35) 45%, rgba(15,23,42,0.72) 100%)",
          }}
        />

        {!reduceMotion && canPlayVideo ? (
          <div className="absolute bottom-3 right-3 z-10 flex gap-1.5">
            <button
              type="button"
              onClick={goPrevious}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm hover:bg-black/50"
              aria-label="Previous video"
            >
              <MdOutlineNavigateBefore className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm hover:bg-black/50"
              aria-label="Next video"
            >
              <MdOutlineNavigateNext className="h-5 w-5" />
            </button>
          </div>
        ) : null}

        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 text-center">
          {children}
        </div>
      </section>
    );
  }

  return null;
}

export default Video;
