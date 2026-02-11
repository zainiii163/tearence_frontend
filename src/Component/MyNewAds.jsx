import React, { useEffect, useState } from "react";
import { FaTags, FaEye, FaEdit, FaChevronLeft, FaChevronRight, FaSearch, FaAd } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";
import { getNewAds } from "../slice/ListSlice";
import { useDispatch, useSelector } from "react-redux";
import NewAdsSlide from "../Component/NewAdsSlide";
import utils from "../helper/utils";
import ListingFormPopup from "./ListingFormPopup";
import ModalCategoryPostAd from "./ModalCategoryPostAd";

const RenderImage = ({ url, items }) => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const checkImage = async () => {
      const valid = await utils.isValidImageURL(url);
      setIsValid(valid);
    };

    checkImage();
  }, [url]);
  if (!url) {
    return (
      <Link to={`/ads-detail/${items.slug}`}>
        <div className="h-48">
          <img
            src="/img/no-image.png"
            alt={items.title}
            className="transform duration-500 hover:scale-105 h-full w-full object-cover"
          />
        </div>
      </Link>
    );
  }
  return (
    <>
      {isValid && (
        <Link to={`/ads-detail/${items.slug}`}>
          <div className="h-48">
            <img
              src={items.images[0]?.image_path}
              alt={items.title}
              onError={(e) => {
                e.target.src = "/img/no-image-classified.jpg";
              }}
              className="transform duration-500 hover:scale-105 h-full w-full object-cover"
            />
          </div>
        </Link>
      )}
    </>
  );
};

const MyNewAds = () => {
  const dispatch = useDispatch();
  const newAdsData = useSelector((store) => store.ads.newAds);
  const newAdsList = newAdsData?.data || [];
  const customerId = useSelector((store) => store.auth.customerId);
  const itemsPerPage = 20;
  const totalDataCount = newAdsList?.total || 0;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const maxLength = 100;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(totalDataCount / itemsPerPage)) {
      setCurrentPage(page);
    }
  };

  const init = () => {
    dispatch(
      getNewAds({
        skip: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
      })
    );
  };
  useEffect(() => {
    init();
  }, [currentPage]);

  const onRefresh = () => {
    setCurrentPage(1);
    init();
  };

  // AdCard Component
  const AdCard = ({ item, isOwned, setSelectedData, setIsOpen }) => (
    <div className="group rounded-lg border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <RenderImage url={item.images[0]?.image_path} items={item} />
      <div className="p-4">
        {/* Ownership Badge */}
        {isOwned && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium z-10">
            Your Ad
          </div>
        )}
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <FaTags className="h-3 w-3" />
          <span>{item.category?.name || 'Uncategorized'}</span>
        </div>
        
        <h3 className="font-medium text-foreground mb-2 line-clamp-2">
          <Link
            to={`/ads-detail/${item.slug}`}
            className="hover:text-primary transition-colors"
          >
            {item.title}
          </Link>
        </h3>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <MdLocationOn className="h-3 w-3" />
          <span>{item.location?.city || 'No location'}</span>
        </div>

        {(item.price !== null && item.price !== undefined) && (
          <div className="text-sm font-bold text-primary mb-3">
            {item.currency?.symbol}{item.price}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Link to={`/ads-detail/${item.slug}`}>
              <button className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8 transition-colors">
                <FaEye className="h-3 w-3" />
              </button>
            </Link>
            {isOwned && (
              <button
                onClick={() => {
                  setSelectedData(item);
                  setIsOpen(true);
                }}
                className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 transition-colors"
              >
                <FaEdit className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  My New Adverts
                </h1>
                <p className="text-blue-100 text-lg mb-6">
                  Fresh ads and recently posted advertisements, designed to
                  introduce the latest products, services, or offers, ensuring
                  up-to-date promotions reach audiences at the right time.
                </p>
                <ModalCategoryPostAd />
              </div>
              <div className="hidden lg:flex justify-end">
                <img
                  className="w-80 h-80 object-contain"
                  src="/img/my-ads.png"
                  alt="My New Ads"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Search and Stats */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">New Ads</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {totalDataCount} new ads
              </p>
            </div>
            
            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search new ads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>
      
      {/* Ads Grid */}
      {newAdsList.items?.length > 0 ? (
        <>
          {/* My Ads Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4 border-b pb-2">
              My New Ads
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {newAdsList.items?.filter(item => item.customer_id === customerId).map((item, index) => (
                <AdCard 
                  key={index} 
                  item={item} 
                  isOwned={true}
                  setSelectedData={setSelectedData}
                  setIsOpen={setIsOpen}
                />
              ))}
            </div>
            
            {newAdsList.items?.filter(item => item.customer_id === customerId).length === 0 && (
              <div className="rounded-lg border bg-card p-8 text-center">
                <FaAd className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">You don't have any new ads yet</p>
              </div>
            )}
          </div>

          {/* Other Ads Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4 border-b pb-2">
              Other New Ads
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {newAdsList.items?.filter(item => item.customer_id !== customerId).map((item, index) => (
                <AdCard 
                  key={index} 
                  item={item} 
                  isOwned={false}
                  setSelectedData={setSelectedData}
                  setIsOpen={setIsOpen}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-lg border bg-card p-12 text-center mb-8">
          <FaAd className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No new ads found</h3>
          <p className="text-sm text-muted-foreground mb-6">
            No new ads available at the moment.
          </p>
        </div>
      )}

      {/* Pagination */}
      {newAdsList.items && newAdsList.items.length > 0 && (
        <div className="flex items-center justify-between mb-8">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {startIndex + 1}-{Math.min(endIndex, totalDataCount)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">{totalDataCount}</span>{" "}
            results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              <FaChevronLeft className="h-3 w-3" />
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage * itemsPerPage >= totalDataCount}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              Next
              <FaChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Additional Content */}
      <NewAdsSlide />
      
      {/* Edit Modal */}
      <ListingFormPopup
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        data={selectedData}
        onRefresh={() => {
          onRefresh();
        }}
      />
        </div>
      </div>
    </div>
  );
};

export default MyNewAds;