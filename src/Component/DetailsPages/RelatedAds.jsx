import React, { useEffect, useRef } from "react";
import Slider from "react-slick";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAdsList } from "../../slice/ListSlice";
import { FaTags, FaMapMarkerAlt } from "react-icons/fa";
import { BiTime } from "react-icons/bi";

const PromotedAndNewAdsSlide = (props) => {
  const { category } = props;
  const dispatch = useDispatch();
  const catAdsList = useSelector((store) => store.ads.catAdsList);
  const catAds = catAdsList?.data || [];

  const slideRef = useRef(null);
  const settings = {
    dots: false,
    infinite: catAds.items?.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
    initialSlide: 0,
    swipeToSlide: true,
    touchThreshold: 10,
    swipe: true,
    touchMove: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: catAds.items?.length > 3,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: catAds.items?.length > 2,
          swipeToSlide: true,
          centerPadding: '20px',
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
          infinite: catAds.items?.length > 1,
          swipeToSlide: true,
          centerMode: true,
          centerPadding: '40px',
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.1,
          slidesToScroll: 1,
          infinite: catAds.items?.length > 1,
          swipeToSlide: true,
          centerMode: true,
          centerPadding: '20px',
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
    if (category) {
      dispatch(
        getAdsList({
          skip: 0,
          limit: 10,
          category: category,
        })
      );
    }
  }, [category]);

  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    }
    return str;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Don't render if no ads available
  if (!catAds.items || catAds.items.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-background">
      <div className="container px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">Related Ads</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Discover similar listings you might be interested in</p>
            </div>
            <div className="flex gap-2 justify-center sm:justify-end">
              <button
                onClick={prevSlide}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 sm:h-9 sm:w-9 touch-manipulation"
                aria-label="Previous ads"
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextSlide}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 sm:h-9 sm:w-9 touch-manipulation"
                aria-label="Next ads"
              >
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative -mx-2 sm:mx-0">
          <Slider ref={slideRef} {...settings}>
            {catAds.items?.map((item, index) => (
              <div key={index} className="px-2 sm:px-3">
                <Link to={`/ads-detail/${item.slug}`} className="block group touch-manipulation">
                  <div className="rounded-lg border bg-card shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20 active:scale-[0.98] sm:active:scale-100">
                    {/* Image */}
                    <div className="aspect-[4/3] overflow-hidden">
                      {item.images && item.images.length > 0 ? (
                        <img
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          src={item.images[0]?.image_path}
                          alt={item.title}
                          onError={(e) => {
                            e.target.src = "/img/no-image.png";
                          }}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <FaTags className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-4">
                      {/* Category */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
                          <FaTags className="h-2.5 w-2.5 mr-1" />
                          <span className="truncate max-w-[100px] sm:max-w-none">{item.category?.name}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-sm sm:text-base text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                        <span className="sm:hidden">{truncateString(item.title, 35)}</span>
                        <span className="hidden sm:inline">{truncateString(item.title, 50)}</span>
                      </h3>

                      {/* Location */}
                      {item.location?.city && (
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                          <FaMapMarkerAlt className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{item.location.city}</span>
                        </div>
                      )}

                      {/* Price and Date */}
                      <div className="flex items-center justify-between gap-2">
                        {item.price && (
                          <div className="text-base sm:text-lg font-bold text-primary truncate">
                            {item.currency?.symbol || '$'}{item.price}
                          </div>
                        )}
                        {item.created_at && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                            <BiTime className="h-3 w-3" />
                            <span className="hidden sm:inline">{formatDate(item.created_at)}</span>
                            <span className="sm:hidden">{formatDate(item.created_at).split(' ')[0]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>

        {/* Mobile-friendly dots indicator */}
        <div className="flex justify-center mt-4 sm:hidden">
          <div className="flex gap-1">
            {catAds.items?.slice(0, Math.min(5, catAds.items?.length || 0)).map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-muted-foreground/30"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotedAndNewAdsSlide;
