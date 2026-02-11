import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import data from "../data/bottom-ads.json"

const BottomAds = () => {
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <>
      <Slider {...settings}>
        {data.map((item, i) => {
          // Check if link is external (starts with http:// or https://)
          const isExternal = item.link?.startsWith('http://') || item.link?.startsWith('https://');
          // Convert internal links to relative paths
          const linkPath = isExternal 
            ? item.link 
            : item.link?.replace(/^https?:\/\/[^/]+/, '') || item.link;
          
          if (isExternal) {
            return (
              <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="mb-[-6px]">
                <img src={item.image} alt={item.link} style={{ width: "100%" }} />
              </a>
            );
          }
          return (
            <Link key={i} to={linkPath} target="_blank" className="mb-[-6px]">
              <img src={item.image} alt={item.link} style={{ width: "100%" }} />
            </Link>
          );
        })}
      </Slider>
    </>
  );
};
export default BottomAds;
