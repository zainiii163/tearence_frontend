import React, { useEffect, useRef } from "react";
import Slider from "react-slick";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPromotedAdsSlide } from "../slice/ListSlice";

const PromotedAndNewAdsSlide = () => {
  const dispatch = useDispatch();
  const promotedAdsData = useSelector((store) => store.ads.promotedAdsSlide);
  const promotedAds = promotedAdsData?.data || [];

  const slideRef = useRef(null);
  const settings = {
    dots: false,
    infinite: true,
    arrows: false,
    speed: 2000,
    slidesToShow: promotedAds.total < 5 ? 3 : 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    initialSlide: 0,
    cssEase: "linear",
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
    dispatch(
      getPromotedAdsSlide({
        skip: 0,
        limit: 10,
      })
    );
  }, [dispatch]);

  return (
    <div className="w-full flex justify-center py-8">
      <div className="slider container mx-auto w-12/12 relative  ">
        <div className="">
          <div className="flex justify-between">
            {/* <h1 className="text-blue-500 font-bold text-2xl">
              <span className="text-[#234777]">Promoted</span>
              <span className="text-[#01C6DA]"> Ads</span>
            </h1> */}
            {/* <Link to="/featured-ads">
              <button className="flex text-lg font-semibold text-[#234777] hover:text-[#01C6DA]">
                See All <FiChevronRight className="relative top-1.5 text-lg" />
              </button>
            </Link> */}
          </div>
          <div className="py-8">
            <Slider className="" ref={slideRef} {...settings}>
              {promotedAds.items?.map((item, index) => (
                <Link to={`/ads-detail/${item.slug}`} key={index}>
                  <div key={index} className="px-2 slide object-cover max-h-20">
                    <img
                      src={item.images[0]?.image_path}
                      alt={item.title}
                      className="h-20"
                    />
                  </div>
                </Link>
              ))}
            </Slider>
          </div>
        </div>
        {/* <button
          className="prev-button absolute top-1/2  text-3xl bg-transparent  transform -translate-y-1/2 -translate-x-3 border border-slate-200 rounded-2xl"
          onClick={prevSlide}
        >
          <FiChevronLeft />
        </button>
        <button
          className="next-button absolute  right-0  top-1/2  text-3xl transform -translate-y-1/2 translate-x-3  bg-transparent border border-slate-200 rounded-2xl"
          onClick={nextSlide}
        >
          <FiChevronRight />
        </button> */}
      </div>
    </div>
  );
};

export default PromotedAndNewAdsSlide;
