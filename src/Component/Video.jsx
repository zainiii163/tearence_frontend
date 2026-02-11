import React, { useState, useRef } from "react";
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

function Video() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);

  const [currentVideo2Index, setCurrentVideo2Index] = useState(0);
  const videoRef2 = useRef(null);

  const handleVideoEnd = () => {
    if (currentVideoIndex < videoUrls.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else {
      // Loop back to the first video when the last one ends
      setCurrentVideoIndex(0);
    }
  };

  const handleVideo2End = () => {
    if (currentVideo2Index < videoUrls2.length - 1) {
      setCurrentVideo2Index(currentVideo2Index + 1);
    } else {
      // Loop back to the first video when the last one ends
      setCurrentVideo2Index(0);
    }
  };

  return (
    <div className="mb-[280px] md:mb-[340px] lg:mb-0">
      <div className="pt-20 md:pt-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 w-full h-[440px] flex flex-col lg:flex-row items-center lg:gap-3">
        <div className="w-full h-full flex justify-center">
          <video
            ref={videoRef}
            src={videoUrls[currentVideoIndex]}
            onEnded={handleVideoEnd}
            // controls
            muted
            autoPlay
            className="w-full"
          ></video>
        </div>

        <div className="w-full h-full flex justify-center">
          <video
            ref={videoRef2}
            src={videoUrls2[currentVideo2Index + 1]}
            onEnded={handleVideo2End}
            // controls
            muted
            autoPlay
            className="w-full"
          ></video>
        </div>

        {/* Add navigation buttons */}
        <div className="w-full flex justify-between absolute z-10 top-96 lg:top-64">
          <button
            className="bg-gray-300 rounded-md px-2 py-2 font-semibold text-black "
            onClick={() => {
              setCurrentVideoIndex(
                currentVideoIndex > 0
                  ? currentVideoIndex - 1
                  : videoUrls.length - 1
              );

              setCurrentVideo2Index(
                currentVideo2Index > 0
                  ? currentVideo2Index - 1
                  : videoUrls2.length - 1
              );
            }}
          >
            <MdOutlineNavigateBefore className="bg-white rounded-full" />
          </button>
          <button
            className="bg-gray-300 rounded-md px-2 py-2 font-semibold text-black "
            onClick={() => {
              setCurrentVideoIndex(
                currentVideoIndex < videoUrls.length - 1
                  ? currentVideoIndex + 1
                  : 0
              );
              setCurrentVideo2Index(
                currentVideo2Index < videoUrls2.length - 1
                  ? currentVideo2Index + 1
                  : 0
              );
            }}
          >
            <MdOutlineNavigateNext className="bg-white rounded-full" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Video;
