/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import Slider from "react-slick";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from "react-redux";
import { getAffiliateListTop } from "../slice/AffiliateSLice_OLD_DEPRECATED";
import { Link } from "react-router-dom";

const TopAffiliate = () => {
  const dispatch = useDispatch();
  const affiliateData = useSelector((store) => {
    return store.aff.affiliateListTop;
  });
  const affiliates = affiliateData?.data || [];

  const slideRef = useRef(null);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 1500,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const nextSlide = () => {
    slideRef.current.slickNext();
  };
  const prevSlide = () => {
    slideRef.current.slickPrev();
  };
  useEffect(() => {
    dispatch(getAffiliateListTop());
  }, []);
  // const truncateString = (str, maxLength) => {
  //   if (str.length > maxLength) {
  //     return str.substring(0, maxLength) + "...";
  //   }
  //   return str;
  // };
  return (
    <div className="w-full py-8 sm:py-12 lg:py-16 md:mt-5 sm:mt-8 overflow-hidden">
      <div className="page-container relative">
        <div className="space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              <span className="text-primary">Top</span>
              <span className="text-cyan-500"> Affiliates</span>
            </h2>
            <Link to="/affiliate-ads">
              <button className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors self-start sm:self-auto">
                See All <FiChevronRight className="ml-1 h-4 w-4" />
              </button>
            </Link>
          </div>
          <div className="relative">
            <Slider ref={slideRef} {...settings}>
              {affiliates?.items?.map((items, index) => (
                <div key={index} className="px-2">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`/affiliate?url=${items.link}`}
                    className="block"
                  >
                    {items.image_url ? (
                      <div className="group rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-video overflow-hidden">
                          <img
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            src={items.image_url}
                            alt={items.title}
                            onError={(e) => {
                              e.target.src = "/img/no-image.png";
                            }}
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-sm font-medium leading-none line-clamp-2 group-hover:text-primary transition-colors">
                            {items.title}
                          </h3>
                        </div>
                      </div>
                    ) : (
                      <div className="group rounded-lg border bg-gradient-to-r from-primary to-cyan-600 text-primary-foreground shadow-sm hover:shadow-md transition-shadow">
                        <div className="aspect-video p-6 flex items-center justify-center">
                          <h3 className="text-sm font-medium text-center line-clamp-4 group-hover:text-yellow-300 transition-colors">
                            {items.title}
                          </h3>
                        </div>
                      </div>
                    )}
                  </a>
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <button
          className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 sm:-translate-x-12 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background/90 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground h-8 w-8 sm:h-10 sm:w-10 z-20 shadow-md"
          onClick={prevSlide}
        >
          <FiChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
        <button
          className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 sm:translate-x-12 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background/90 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground h-8 w-8 sm:h-10 sm:w-10 z-20 shadow-md"
          onClick={nextSlide}
        >
          <FiChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      </div>
    </div>
  );
};

export default TopAffiliate;
