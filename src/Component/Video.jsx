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
const videoUrls2 = [
  "./video/Video-Ads-26.mp4",
  "./video/Video-Ads-7.mp4",
  "./video/Video-Ads-8.mp4",
  "./video/Video-Ads-9.mp4",
  "./video/Video-Ads-10.mp4",
  "./video/Video-Ads-11.mp4",
  "./video/Video-Ads-12.mp4",
  "./video/Video-Ads-13.mp4",
  "./video/Video-Ads-15.mp4",
  "./video/Video-Ads-17.mp4",
  "./video/Video-Ads-19.mp4",
  "./video/Video-Ads-21.mp4",
  "./video/Video-Ads-23.mp4",
];
const videoUrls3 = [
  "./video/Video-Ads-3.mp4",
  "./video/Video-Ads-5.mp4",
  "./video/Video-Ads-8.mp4",
  "./video/Video-Ads-11.mp4",
  "./video/Video-Ads-15.mp4",
  "./video/Video-Ads-18.mp4",
  "./video/Video-Ads-21.mp4",
  "./video/Video-Ads-24.mp4",
  "./video/Video-Ads-1.mp4",
  "./video/Video-Ads-6.mp4",
  "./video/Video-Ads-10.mp4",
  "./video/Video-Ads-14.mp4",
];

function useMinWidth(minWidth) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, [minWidth]);
  return matches;
}

function Video() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);
  const [currentVideo2Index, setCurrentVideo2Index] = useState(0);
  const videoRef2 = useRef(null);
  const [currentVideo3Index, setCurrentVideo3Index] = useState(0);
  const videoRef3 = useRef(null);

  // Only mount extra players at breakpoints — hidden <video src> still downloads
  const showSecond = useMinWidth(768);
  const showThird = useMinWidth(1024);

  const handleVideoEnd = () => {
    setCurrentVideoIndex((i) => (i < videoUrls.length - 1 ? i + 1 : 0));
  };

  const handleVideo2End = () => {
    setCurrentVideo2Index((i) => (i < videoUrls2.length - 1 ? i + 1 : 0));
  };

  const handleVideo3End = () => {
    setCurrentVideo3Index((i) => (i < videoUrls3.length - 1 ? i + 1 : 0));
  };

  const goPrevious = () => {
    setCurrentVideoIndex((i) => (i > 0 ? i - 1 : videoUrls.length - 1));
    setCurrentVideo2Index((i) => (i > 0 ? i - 1 : videoUrls2.length - 1));
    setCurrentVideo3Index((i) => (i > 0 ? i - 1 : videoUrls3.length - 1));
  };

  const goNext = () => {
    setCurrentVideoIndex((i) => (i < videoUrls.length - 1 ? i + 1 : 0));
    setCurrentVideo2Index((i) => (i < videoUrls2.length - 1 ? i + 1 : 0));
    setCurrentVideo3Index((i) => (i < videoUrls3.length - 1 ? i + 1 : 0));
  };

  const navButtonClass =
    "shrink-0 bg-white hover:bg-gray-50 text-gray-700 rounded-full p-1.5 sm:p-2 shadow-sm hover:shadow border border-gray-200/90 transition-all duration-200";

  const videoFrameClass =
    "w-full aspect-[16/9] max-h-[160px] sm:max-h-[200px] md:max-h-[230px] lg:max-h-[260px] xl:max-h-[290px] rounded-lg overflow-hidden shadow-md bg-gray-100 flex-1 min-w-0";

  return (
    <div className="w-full mb-4 sm:mb-5 lg:mb-6">
      <div className="page-container pt-4 sm:pt-5 lg:pt-6">
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
          <button
            type="button"
            className={navButtonClass}
            onClick={goPrevious}
            aria-label="Previous video"
          >
            <MdOutlineNavigateBefore className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <div className="flex flex-1 min-w-0 flex-col md:flex-row items-stretch gap-2 sm:gap-3">
            <div className={videoFrameClass}>
              <video
                ref={videoRef}
                src={videoUrls[currentVideoIndex]}
                onEnded={handleVideoEnd}
                muted
                autoPlay
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              />
            </div>

            {showSecond && (
              <div className={videoFrameClass}>
                <video
                  ref={videoRef2}
                  src={videoUrls2[currentVideo2Index]}
                  onEnded={handleVideo2End}
                  muted
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {showThird && (
              <div className={videoFrameClass}>
                <video
                  ref={videoRef3}
                  src={videoUrls3[currentVideo3Index]}
                  onEnded={handleVideo3End}
                  muted
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <button
            type="button"
            className={navButtonClass}
            onClick={goNext}
            aria-label="Next video"
          >
            <MdOutlineNavigateNext className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Video;
