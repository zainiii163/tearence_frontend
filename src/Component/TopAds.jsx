import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import data from "../data/top-ads.json";

const BottomAds = () => {
  var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    initialSlide: 0,
    rtl: true,
  };
  var settings2 = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    initialSlide: 0,
  };
  const shuffleArray = (array) => {
    // Create a copy of the array to avoid modifying the original array
    let shuffledArray = array.slice();
    
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      // Generate a random index from 0 to i
      const j = Math.floor(Math.random() * (i + 1));
      
      // Swap elements at indices i and j
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    
    return shuffledArray;
  }
  
  return (
    <div className="pt-32 lg:pt-20 bg-slate-500 mb-[-5rem]">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <Slider {...settings}>
          {shuffleArray(data).map((item, i) => {
            // Check if link is external (starts with http:// or https://)
            const isExternal = item.link?.startsWith('http://') || item.link?.startsWith('https://');
            // Convert internal links to relative paths
            const linkPath = isExternal 
              ? item.link 
              : item.link?.replace(/^https?:\/\/[^/]+/, '') || item.link;
            
            if (isExternal) {
              return (
                <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="mb-[-6px]">
                  <img
                    src={item.image}
                    alt={item.link}
                    style={{ width: "100%" }}
                    className="h-[250px] md:h-[350px] object-cover"
                  />
                </a>
              );
            }
            return (
              <Link key={i} to={linkPath} target="_blank" className="mb-[-6px]">
                <img
                  src={item.image}
                  alt={item.link}
                  style={{ width: "100%" }}
                  className="h-[250px] md:h-[350px] object-cover"
                />
              </Link>
            );
          })}
        </Slider>
        <div className="hidden md:block">
          <Slider {...settings2}>
            {shuffleArray(data).map((item, i) => {
              // Check if link is external (starts with http:// or https://)
              const isExternal = item.link?.startsWith('http://') || item.link?.startsWith('https://');
              // Convert internal links to relative paths
              const linkPath = isExternal 
                ? item.link 
                : item.link?.replace(/^https?:\/\/[^/]+/, '') || item.link;
              
              if (isExternal) {
                return (
                  <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="mb-[-6px]">
                    <img
                      src={item.image}
                      alt={item.link}
                      style={{ width: "100%" }}
                      className="h-[250px] md:h-[350px] object-cover"
                    />
                  </a>
                );
              }
              return (
                <Link key={i} to={linkPath} target="_blank" className="mb-[-6px]">
                  <img
                    src={item.image}
                    alt={item.link}
                    style={{ width: "100%" }}
                    className="h-[250px] md:h-[350px] object-cover"
                  />
                </Link>
              );
            })}
          </Slider>
        </div>
      </div>
    </div>
  );
};
export default BottomAds;
