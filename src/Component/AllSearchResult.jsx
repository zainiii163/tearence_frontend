import React, { useState, useEffect, useMemo } from "react";
import { BiPhone } from "react-icons/bi";
import {
  FaBuilding,
  FaGlobe,
  FaList,
  FaStore,
  FaSearch,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getGlobalSearch } from "../slice/ListSlice";
import SkeletonCard from "../Component/skeletons/SkeletonCard";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { IoIosPin, IoMdBusiness } from "react-icons/io";
import { PiFlagBanner } from "react-icons/pi";
import BannerDetail from "./BannerDetail";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import CategoryItem from "./CategoryPage/CategoryItem";
import UpsellModal from "./UpsellModal";
const StoreCard = ({ store }) => {
  return (
    <Link to={`/store/${store.customer_id}`} className="flex w-full group">
      <div className="flex flex-col w-full max-w-sm rounded-lg overflow-hidden shadow-lg bg-white p-4">
        <div className="flex justify-center items-center">
          <img
            src={store?.store_logo ? store?.store_logo : "/img/no-image.png"}
            // src="/img/noImage.png"
            className={`${
              store?.store_logo
                ? "object-contain w-full h-48"
                : "object-cover w-1/2"
            }`}
            alt="Company Logo"
          />
        </div>
        <div className="px-6 py-4 flex flex-col justify-center">
          <div className="font-bold text-xl mb-2 group-hover:text-yellow-500">
            {store.store_name}
          </div>
          <p className="text-gray-700 text-base">{store.store_address}</p>
        </div>
        {/* <div className="px-6 pt-4 pb-2">
        {store.tags?.map((tag, index) => (
          <span
            key={index}
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          >
            #{tag}
          </span>
        ))}
      </div> */}
      </div>
    </Link>
  );
};
const BusinessCard = ({ business }) => {
  return (
    <Link
      to={`/business/${business.slug}`}
      className="flex group hover:scale-105 transition-transform"
    >
      {/* <div className="flex flex-1 flex-col max-w-sm rounded-lg overflow-hidden shadow-lg bg-white p-4">
        <img
          height="120"
          width="120"
          src={
            business?.business_logo
              ? business?.business_logo
              : "/img/no-image.png"
          }
          className={`w-full h-48 ${
            business?.business_logo ? "object-contain" : "object-cover"
          }`}
          alt="Company Logo"
        />
        <div className="px-6 py-4 flex flex-col justify-center">
          <div className="font-bold text-xl mb-2 group-hover:text-yellow-500">
            {business.business_name}
          </div>
          <p className="text-gray-700 text-base">{business.business_address}</p>
        </div>
      </div> */}
      <div className="w-full bg-gradient-to-r from-blue-700 to-cyan-300 rounded-3xl  shadow-lg">
        {/* business header */}
        <div className="p-5 flex items-center gap-5">
          <div className="text-lg font-semibold">
            <div className="rounded-full mbs-[-30px] mli-[-5px] border-[5px] border-be-0 h-[120px] w-[120px]">
              <img
                height="120"
                width="120"
                src={
                  business?.business_logo
                    ? business?.business_logo
                    : "/img/no-image-available.jpg"
                }
                // src="/img/noImage.png"
                className="rounded-full object-cover bg-white"
                alt="Company Logo"
              />
            </div>
          </div>
          <div className="flex flex-col mb-4 text-white">
            <label className="flex text-2xl mb-2" htmlFor="">
              {business?.business_name}
            </label>
            <span className="flex items-center gap-2 text-gray-100">
              <IoIosPin /> {business?.business_address ?? ""}
            </span>
          </div>
        </div>
        {/* business info */}
        <div className="p-5 bg-white rounded-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 text-black">
            <div className="flex items-center gap-5">
              <div className="bg-gray-100 p-3 rounded-full">
                <FaBuilding className="h-4 w-4 text-black" />
              </div>
              <div>
                <div className="text-sm">Company No.</div>
                <div className="text-smfont-semibold">
                  {business?.business_company_no ?? ""}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="bg-gray-100 p-3 rounded-full">
                <FaGlobe className="h-4 w-4 text-black" />
              </div>
              <div>
                <div className="text-sm">Website</div>
                <Link
                  to="wwww.samplebusiness.com"
                  target="_blank"
                  className="text-sm font-semibold"
                >
                  {business?.business_website ?? ""}
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="bg-gray-100 p-3 rounded-full">
                <MdEmail className="h-4 w-4 text-black" />
              </div>
              <div>
                <div className="text-sm">Business email</div>
                <div className="text-smfont-semibold">
                  {business?.business_email ?? ""}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="bg-gray-100 p-3 rounded-full">
                <BiPhone className="h-4 w-4 text-black" />
              </div>
              <div>
                <div className="text-sm">Business phone no.</div>
                <div className="text-sm font-semibold">
                  {business?.business_owner}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const AllSearchResult = () => {
  const dispatch = useDispatch();
  const { searchValue, category } = useParams();
  const [searchParams] = useSearchParams();
  const categoryParam = category || searchParams.get('category') || 'all';
  const loading = useSelector((store) => store.ads.loading);
  const searchData = useSelector((store) => store.ads.globalSearch);
  const searchDataList = useMemo(() => searchData?.data || [], [searchData?.data]);

  // const itemsPerPage = 10; // Commented out as unused
  // const totalDataCount = searchData?.total || 0; // Commented out as unused
  // const [currentPage] = useState(1); // Commented out as unused
  // const startIndex = (currentPage - 1) * itemsPerPage; // Commented out as unused
  // const [liked] = useState(Array(searchData.length).fill(false)); // Commented out as unused
  const [dataBanner, setDataBanner] = useState([]);
  const [selectedData, setSelectedData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [sortBy, setSortBy] = useState('priority'); // Default to priority sorting

  useEffect(() => {
    if (!searchValue) return;
    
    const searchData = { keyword: searchValue };
    if (categoryParam && categoryParam !== 'all') {
      searchData.category = categoryParam;
    }
    
    dispatch(getGlobalSearch({ searchData }));
  }, [searchValue, categoryParam, dispatch]);

  const sortListings = (listings) => {
    if (!Array.isArray(listings)) return [];
    
    const sorted = [...listings];
    
    switch (sortBy) {
      case 'priority':
        return sorted.sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0));
      case 'price_low':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price_high':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'newest':
        return sorted.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
      default:
        return sorted;
    }
  };

  // Enhanced listings with upsell data and sorting
  const enhancedListings = sortListings(
    searchDataList?.listing?.items?.map(item => ({
      ...item,
      upsells: item.upsells || [],
      priority_score: item.priority_score || 0
    })) || []
  );

  const handleUpsellClick = (listing, closeModal) => {
    return (
      <UpsellModal
        isOpen={true}
        listing={listing}
        onClose={() => {
          closeModal();
        }}
        onSuccess={(response) => {
          console.log('Upsell purchased successfully:', response);
          // Refresh search results to show updated badges
          dispatch(getGlobalSearch({ searchData: { keyword: searchValue } }));
        }}
      />
    );
  };

  // const addToFavourite = (customer_id, listing_id, index) => { // Commented out as unused
//   const currentCustomerId = localStorage.getItem('customer_id') || customer_id;
//   if (liked[index]) {
//     dispatch(
//       creatFavouriteAds({
//         data: { customer_id: currentCustomerId, listing_id, is_favorite: false },
//       })
//     );
//   } else {
//     dispatch(
//       creatFavouriteAds({
//         data: { customer_id: currentCustomerId, listing_id, is_favorite: true },
//       })
//     );
//   }

//   setLiked((prevLiked) => ({
//     ...prevLiked,
//     [index]: !prevLiked[index],
//   }));
// };
  useEffect(() => {
    if (searchDataList?.banner?.items?.length) {
      const dataMap = searchDataList?.banner?.items.map((item) => {
        return {
          ...item,
          src: item.img,
        };
      });
      setDataBanner([...dataMap]);
    } else {
      setDataBanner([]);
    }
  }, [searchValue, dispatch, searchDataList]);
  return (
    <div className="min-h-screen bg-background">
      <div className="page-container pt-32 sm:pt-24 pb-12">
        {/* Header Section */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FaSearch className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Search Results
              </h1>
              <p className="text-muted-foreground">
                {categoryParam && categoryParam !== 'all' 
                  ? `Results for "${searchValue}" in ${categoryParam.replace('-', ' ')}`
                  : `Results for "${searchValue}"`
                }
              </p>
            </div>
          </div>
          
          {/* Sort Controls */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm bg-white"
            >
              <option value="priority">Priority</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
            <span className="text-xs text-muted-foreground">
              {enhancedListings.length} results found
            </span>
          </div>
          
          <div className="h-px bg-border" />
        </div>

        {loading ? (
          <div className="py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        ) : (
          <Tabs className="w-full">
            <TabList className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 rounded-lg bg-muted p-1 mb-6">
              <Tab className="w-full rounded-md py-2.5 px-3 text-xs sm:text-sm font-medium leading-5 text-foreground ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 data-[selected=true]:bg-background data-[selected=true]:shadow-sm data-[hover]:bg-white/[0.12] data-[selected=false]:text-muted-foreground data-[selected=false]:hover:bg-white/[0.12] data-[selected=false]:hover:text-foreground">
                <div className="flex gap-1 sm:gap-2 items-center justify-center">
                  <FaList className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline sm:inline">Ads</span>
                </div>
              </Tab>
              <Tab className="w-full rounded-md py-2.5 px-3 text-xs sm:text-sm font-medium leading-5 text-foreground ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 data-[selected=true]:bg-background data-[selected=true]:shadow-sm data-[hover]:bg-white/[0.12] data-[selected=false]:text-muted-foreground data-[selected=false]:hover:bg-white/[0.12] data-[selected=false]:hover:text-foreground">
                <div className="flex gap-1 sm:gap-2 items-center justify-center">
                  <PiFlagBanner className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline sm:inline">Banners</span>
                </div>
              </Tab>
              <Tab className="w-full rounded-md py-2.5 px-3 text-xs sm:text-sm font-medium leading-5 text-foreground ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 data-[selected=true]:bg-background data-[selected=true]:shadow-sm data-[hover]:bg-white/[0.12] data-[selected=false]:text-muted-foreground data-[selected=false]:hover:bg-white/[0.12] data-[selected=false]:hover:text-foreground">
                <div className="flex gap-1 sm:gap-2 items-center justify-center">
                  <FaStore className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline sm:inline">Stores</span>
                </div>
              </Tab>
              <Tab className="w-full rounded-md py-2.5 px-3 text-xs sm:text-sm font-medium leading-5 text-foreground ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 data-[selected=true]:bg-background data-[selected=true]:shadow-sm data-[hover]:bg-white/[0.12] data-[selected=false]:text-muted-foreground data-[selected=false]:hover:bg-white/[0.12] data-[selected=false]:hover:text-foreground">
                <div className="flex gap-1 sm:gap-2 items-center justify-center">
                  <IoMdBusiness className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline sm:inline">Business</span>
                </div>
              </Tab>
            </TabList>
            {/* ads */}
            <TabPanel className="rounded-xl bg-background p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
              {enhancedListings.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-5">
                  {enhancedListings.map((item, index) => (
                    <CategoryItem
                      key={item.listing_id || index}
                      item={item}
                      viewMode="grid"
                      onUpsellClick={handleUpsellClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <FaSearch className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">No ads found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We couldn't find any ads matching your search.
                  </p>
                </div>
              )}
            </TabPanel>
            {/* banner */}
            <TabPanel className="rounded-xl bg-background p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
            {dataBanner?.length > 0 ? (
              <div>
                <div className="min-h-screen flex flex-col">
                  <div className="flex-grow flex flex-col justify-between">
                    <InfiniteScroll
                      dataLength={dataBanner.length}
                      hasMore={false}
                      loader={
                        <div style={{ height: "200px" }}>
                          {loading && (
                            <div className="flex gap-5">
                              <div className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center">
                                <div className="flex items-center justify-center w-full h-48 bg-gray-100 rounded sm:w-96">
                                  <svg
                                    className="w-10 h-10 text-gray-200"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 18"
                                  >
                                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                  </svg>
                                </div>
                              </div>
                              <div className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center">
                                <div className="flex items-center justify-center w-full h-48 bg-gray-100 rounded sm:w-96">
                                  <svg
                                    className="w-10 h-10 text-gray-200"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 18"
                                  >
                                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                  </svg>
                                </div>
                              </div>
                              <div className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center">
                                <div className="flex items-center justify-center w-full h-48 bg-gray-100 rounded sm:w-96">
                                  <svg
                                    className="w-10 h-10 text-gray-200"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 18"
                                  >
                                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      }
                    >
                      <ResponsiveMasonry
                        columnsCountBreakPoints={{ 300: 2, 500: 3, 700: 4 }}
                      >
                        <Masonry gutter="20px">
                          {dataBanner.map((item, i) => (
                            <button
                              onClick={() => {
                                setSelectedData(item);
                                setIsOpen(true);
                              }}
                              key={i}
                              className="w-full block overflow-hidden"
                            >
                              <img
                                className="w-full rounded-md h-auto max-h-[500px] object-cover"
                                src={item.img}
                                alt={item.title}
                              />
                            </button>
                          ))}
                        </Masonry>
                      </ResponsiveMasonry>
                    </InfiniteScroll>
                  </div>
                </div>
                <BannerDetail
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  data={selectedData}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <PiFlagBanner className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">No banner ads found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We couldn't find any banner ads matching your search.
                </p>
              </div>
            )}
            </TabPanel>
            {/* store */}
            <TabPanel className="rounded-xl bg-background p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
            {searchDataList?.store?.items?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-5">
                {searchDataList?.store.items.map((store, index) => (
                  <StoreCard key={index} store={store} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <FaStore className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">No stores found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We couldn't find any stores matching your search.
                </p>
              </div>
            )}
            </TabPanel>
            {/* business */}
            <TabPanel className="rounded-xl bg-background p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
            {searchDataList?.business?.items?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
                {searchDataList?.business.items.map((store, index) => (
                  <BusinessCard key={index} business={store} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <IoMdBusiness className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">No businesses found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We couldn't find any businesses matching your search.
                </p>
              </div>
            )}
            </TabPanel>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default AllSearchResult;
