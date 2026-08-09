import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useDispatch, useSelector } from "react-redux";
import { detailsAdsList, creatFavouriteAds, getFavouriteAds } from "../../slice/ListSlice";
import RelatedSlider from "./RelatedAds";
import TopAffiliateOnAdsDetail from "../TopAffiliateOnAdsDetail_OLD_DEPRECATED";
import EbayAds from "../EbayAds";
import BottomAds from "../BottomAds";
import SponsoredPostsSidebar from "./SponsoredPostsSidebar";
import AdvertReportingSystem from "./AdvertReportingSystem";
import Env from "../../useEnv";
import { trackView } from "../../utils/analyticsTracker";

// Icons
import {
  FaStar,
  FaStore,
  FaTelegram,
  FaWhatsapp,
  FaFacebookF,
  FaLinkedinIn,
  FaHeart,
  FaFlag,
  FaEnvelope,
  FaMapMarkerAlt,
  FaEye,
  FaTags,
  FaUser,
} from "react-icons/fa";
import { BsTwitter } from "react-icons/bs";
import { MdVerified, MdOutlineReportProblem } from "react-icons/md";
import { BiTime } from "react-icons/bi";
import ChatButton from "../Chat/ChatButton";
import InternalMessagingSystem from "../Messaging/InternalMessagingSystem";

function FeaturedAdsDetail() {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const adsDetails = useSelector((store) => store.ads.detailsAds);
  const adsDetailData = adsDetails?.data || {};
  const favouriteAdsState = useSelector((store) => store.ads.favouriteAds);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (slug) {
      dispatch(detailsAdsList({ slug }));
    }
  }, [slug, dispatch]);

  // Track view when listing data is loaded
  useEffect(() => {
    if (adsDetailData?.listing_id) {
      trackView(adsDetailData.listing_id, {
        slug: slug,
        category: adsDetailData.category?.name,
        source: "detail_page",
      });
    }
  }, [adsDetailData?.listing_id, slug, adsDetailData.category?.name]);

  // Initialize favorite button state based on existing favourites for the
  // logged-in customer. We prefer to use the already-loaded favourites in
  // redux; if none exist we fetch a small page and then check.
  useEffect(() => {
    const currentCustomerId = localStorage.getItem('customer_id');
    const listingId = adsDetailData.listing_id;
    if (!currentCustomerId || !listingId) return;

    const hasFavouriteInStore = (() => {
      if (!favouriteAdsState) return false;
      // Support different shapes: { items: [...] } or { data: { items: [...] } }
      const items = favouriteAdsState.items || (favouriteAdsState.data && favouriteAdsState.data.items) || (Array.isArray(favouriteAdsState) ? favouriteAdsState : []);
      return items.some((f) => {
        // favorite record may include listing_id or listing object
        if (!f) return false;
        if (f.listing_id && f.listing_id === listingId) return true;
        if (f.listing && (f.listing.listing_id === listingId || f.listing.id === listingId)) return true;
        return false;
      });
    })();

    if (hasFavouriteInStore) {
      setIsFavorited(true);
      return;
    }

    // If we don't have favourites in the store, fetch a small page to check
    // whether this listing is favorited by the current customer.
    const isStoreEmpty = (
      !favouriteAdsState ||
      (Array.isArray(favouriteAdsState) && favouriteAdsState.length === 0) ||
      (favouriteAdsState.items && favouriteAdsState.items.length === 0) ||
      (favouriteAdsState.data && Array.isArray(favouriteAdsState.data.items) && favouriteAdsState.data.items.length === 0)
    );

    if (isStoreEmpty && currentCustomerId) {
      // fetch first 50 favourites for the customer (lightweight)
      dispatch(getFavouriteAds({ skip: 0, limit: 50, id: currentCustomerId }));
    }
  }, [adsDetailData.listing_id, favouriteAdsState, dispatch]);

  // When favourites state updates, re-check and set the button state.
  useEffect(() => {
    const listingId = adsDetailData.listing_id;
    if (!listingId || !favouriteAdsState) return;
    const items = favouriteAdsState.items || (favouriteAdsState.data && favouriteAdsState.data.items) || (Array.isArray(favouriteAdsState) ? favouriteAdsState : []);
    const isFav = items.some((f) => {
      if (!f) return false;
      if (f.listing_id && f.listing_id === listingId) return true;
      if (f.listing && (f.listing.listing_id === listingId || f.listing.id === listingId)) return true;
      return false;
    });
    setIsFavorited(Boolean(isFav));
  }, [favouriteAdsState, adsDetailData.listing_id]);

  const addToFavourite = () => {
    const currentCustomerId = localStorage.getItem('customer_id');
    if (currentCustomerId && adsDetailData.listing_id) {
      // Create the favourite, then refresh the customer's favourites so
      // the store contains the created record. This keeps the button state
      // accurate across reloads and other pages.
      dispatch(
        creatFavouriteAds({
          data: {
            customer_id: currentCustomerId,
            listing_id: adsDetailData.listing_id,
            is_favorite: true,
          },
        })
      ).then(() => {
        // Refresh favourites (small page)
        dispatch(getFavouriteAds({ skip: 0, limit: 50, id: currentCustomerId }));
      }).catch(() => {
        // ignore errors here; UX still marks as favorited locally
      });
      setIsFavorited(true);
    }
  };

  const buildURL = (slug) => {
    return Env.baseUrl + "ads-detail/" + slug;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const images = adsDetailData.images || [];
  const hasImages = images.length > 0;
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background">
      <Navbar />



      <div className="w-full flex justify-center pt-28 sm:pt-20">
        <div className="container px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content - 3 columns */}
            <div className="lg:col-span-3 w-full">
              {/* Image and Location Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Main Image Gallery */}
                <div>
                  {hasImages ? (
                    <img
                      src={images[selectedImageIndex]?.image_path}
                      className="w-full h-48 object-cover rounded-lg"
                      alt={`${adsDetailData?.title} - Preview ${selectedImageIndex + 1}`}
                      onError={(e) => {
                        e.target.src = "/img/no-image.png";
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center rounded-lg">
                      <div className="text-center">
                        <FaEye className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No images available</p>
                      </div>
                    </div>
                  )}

                  {/* Image Thumbnails */}
                  {hasImages && images.length > 1 && (
                    <div className="mt-3">
                      <div className="flex gap-2 overflow-x-auto">
                        {images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${selectedImageIndex === index
                              ? 'border-primary ring-2 ring-primary/20'
                              : 'border-border hover:border-primary/50'
                              }`}
                          >
                            <img
                              src={image.image_path}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "/img/no-image.png";
                              }}
                              alt={`Thumbnail ${index + 1}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Location Map - Now beside the image */}
                {adsDetailData.location && (
                  <div className="rounded-lg border bg-card shadow-sm h-48 overflow-hidden">
                    <div className="p-3">
                      <h2 className="text-base font-semibold mb-2 flex items-center gap-2">
                        <FaMapMarkerAlt className="h-4 w-4 text-primary" />
                        Location
                      </h2>
                      <div className="flex items-start gap-2 p-2 bg-muted/50 rounded text-xs mb-3">
                        <FaMapMarkerAlt className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground leading-tight">
                            {adsDetailData.location.city}
                          </p>
                          {adsDetailData.location.country_name && (
                            <p className="text-xs text-muted-foreground">
                              {adsDetailData.location.country_name}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Compact Map */}
                      <div className="h-20 w-full mb-3">
                        {Env.GoogleApiKey ? (
                          <>
                            {adsDetailData.location?.latitude && adsDetailData.location?.longitude ? (
                              <div className="h-full w-full rounded-md overflow-hidden border">
                                <iframe
                                  title="Location Map"
                                  width="100%"
                                  height="100%"
                                  style={{ border: 0 }}
                                  src={`https://www.google.com/maps/embed/v1/place?key=${Env.GoogleApiKey}&q=${adsDetailData.location.latitude},${adsDetailData.location.longitude}&zoom=15&maptype=roadmap`}
                                  allowFullScreen
                                  loading="lazy"
                                  referrerPolicy="no-referrer-when-downgrade"
                                />
                              </div>
                            ) : adsDetailData.location?.city ? (
                              <div className="h-full w-full rounded-md overflow-hidden border">
                                <iframe
                                  title="Location Map"
                                  width="100%"
                                  height="100%"
                                  style={{ border: 0 }}
                                  src={`https://www.google.com/maps/embed/v1/place?key=${Env.GoogleApiKey}&q=${encodeURIComponent(adsDetailData.location.city + ', ' + (adsDetailData.location.country_name || ''))}&zoom=12&maptype=roadmap`}
                                  allowFullScreen
                                  loading="lazy"
                                  referrerPolicy="no-referrer-when-downgrade"
                                />
                              </div>
                            ) : (
                              <div className="h-full w-full bg-muted rounded-md flex items-center justify-center border">
                                <div className="text-center">
                                  <FaMapMarkerAlt className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                                  <p className="text-xs text-muted-foreground">Map View</p>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="h-full w-full bg-muted rounded-md flex items-center justify-center border">
                            <div className="text-center">
                              <FaMapMarkerAlt className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                              <p className="text-xs text-muted-foreground">Map View</p>
                              <p className="text-xs text-muted-foreground">API not configured</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Ad Description */}
              <div className="rounded-lg border bg-card shadow-sm mb-4 clear-both">
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FaTags className="h-5 w-5 text-primary" />
                    Description
                  </h2>
                  <div
                    className="prose prose-sm max-w-none text-foreground leading-normal text-sm"
                    dangerouslySetInnerHTML={{
                      __html:
                        adsDetailData?.description?.replace(/\\n/g, "<br>") ||
                        "<p class='text-muted-foreground italic'>No description provided for this listing.</p>",
                    }}
                  />
                </div>
              </div>

              {/* Actions Section - Moved from sidebar */}
              <div className="rounded-lg border bg-card shadow-sm mb-4">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FaUser className="h-5 w-5 text-primary" />
                    Actions
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {adsDetailData.is_has_store ? (
                      <Link
                        to={`/store/${adsDetailData.customer_id}`}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 gap-2"
                      >
                        <FaStore className="h-4 w-4" />
                        <span>Store</span>
                      </Link>
                    ) : (
                      <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-3 gap-2 bg-muted text-muted-foreground cursor-not-allowed">
                        <FaStore className="h-4 w-4" />
                        <span>No Store</span>
                      </div>
                    )}

                    <button
                      onClick={() =>
                        addToFavourite(
                          adsDetailData.customer_id,
                          adsDetailData.listing_id
                        )
                      }
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2"
                    >
                      <FaStar className="h-4 w-4" />
                      <span>Favorite</span>
                    </button>

                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2">
                      <MdOutlineReportProblem className="h-4 w-4" />
                      <span>Report</span>
                    </button>

                    <InternalMessagingSystem
                      currentUser={{ id: localStorage.getItem('customer_id') }}
                      recipientId={adsDetailData.customer_id}
                      recipientName={adsDetailData.customer?.name || adsDetailData.customer_name || 'Seller'}
                      onSendMessage={(messageData) => {
                        console.log('Message sent:', messageData);
                      }}
                    />
                  </div>
                </div>
              </div>


            </div>

            {/* Right Sidebar - Ad Details & Actions */}
            <div className="lg:col-span-2 w-full">
              <div className="sticky top-20 space-y-4">
                {/* Ad Title & Basic Info */}
                <div className="rounded-lg border bg-card shadow-sm">
                  <div className="p-4">
                    <h1 className="text-xl font-bold text-foreground mb-3 leading-tight">
                      {adsDetailData?.title || 'Ad Title Not Available'}
                    </h1>

                    {/* Price */}
                    {(adsDetailData?.price !== null && adsDetailData?.price !== undefined) && (
                      <div className="mb-3 p-3 bg-primary/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FaTags className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-muted-foreground">Price</span>
                        </div>
                        <div className="text-xl font-bold text-primary mt-1">
                          {adsDetailData.currency?.symbol || '$'} {adsDetailData.price}
                        </div>
                      </div>
                    )}



                    {/* Posted Date */}
                    {adsDetailData.created_at && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <BiTime className="h-4 w-4" />
                        <span>Posted on {formatDate(adsDetailData.created_at)}</span>
                      </div>
                    )}

                    {/* Category */}
                    {adsDetailData.category && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <FaTags className="h-4 w-4" />
                        <Link
                          to={`/category/${adsDetailData.category.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {adsDetailData.category.name}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact & Actions */}
                <div className="rounded-lg border bg-card shadow-sm">
                  <div className="p-4">
                    <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                      <FaUser className="h-4 w-4 text-primary" />
                      Contact Seller
                    </h3>

                    {/* Seller Info */}
                    {adsDetailData.customer && (
                      <div className="mb-3 p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <FaUser className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{adsDetailData.customer.name || 'Seller'}</span>
                          {adsDetailData.customer.is_verified && (
                            <MdVerified className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        {adsDetailData.customer.email && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FaEnvelope className="h-3 w-3" />
                            <span>{adsDetailData.customer.email}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <ChatButton
                        sellerId={adsDetailData.customer_id}
                        sellerName={adsDetailData.customer?.name || adsDetailData.customer_name || 'Seller'}
                        listing={{
                          listing_id: adsDetailData.listing_id,
                          title: adsDetailData.title,
                          image: adsDetailData.images?.[0]?.image_path,
                          category: 'Classifieds',
                          listing_type: 'classifieds',
                        }}
                        className="w-full h-10 px-4 text-sm font-medium"
                        variant="primary"
                        label="Live Chat"
                      />

                      <a
                        href={`mailto:${adsDetailData.customer?.email}?subject=Inquiry about ${adsDetailData?.title}`}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 text-sm font-medium transition-colors"
                      >
                        <FaEnvelope className="h-4 w-4" />
                        Send Email
                      </a>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={addToFavourite}
                          className={`inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-9 px-3 transition-colors ${isFavorited
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                            }`}
                        >
                          <FaHeart className={`h-3 w-3 ${isFavorited ? 'text-red-500' : ''}`} />
                          <span className="hidden sm:inline">{isFavorited ? 'Saved' : 'Save'}</span>
                        </button>

                        <AdvertReportingSystem
                          advertId={adsDetailData.listing_id}
                          advertSlug={adsDetailData.slug}
                          onReportSubmitted={(reportData) => {
                            console.log('Report submitted:', reportData);
                          }}
                        />
                      </div>

                      {adsDetailData.is_has_store && (
                        <Link
                          to={`/store/${adsDetailData.customer_id}`}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 text-sm font-medium transition-colors"
                        >
                          <FaStore className="h-4 w-4" />
                          Visit Store
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Share this ad</h3>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${buildURL(
                        adsDetailData.slug
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      title="Share on Facebook"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9 bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <FaFacebookF className="h-4 w-4" />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${buildURL(
                        adsDetailData.slug
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9 bg-sky-500 text-white hover:bg-sky-600"
                    >
                      <BsTwitter className="h-4 w-4" />
                    </a>
                    <a
                      href={`https://www.linkedin.com/shareArticle?url=${buildURL(
                        adsDetailData.slug
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9 bg-blue-700 text-white hover:bg-blue-800"
                    >
                      <FaLinkedinIn className="h-4 w-4" />
                    </a>
                    <a
                      href={`https://t.me/share/url?url=${buildURL(
                        adsDetailData.slug
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9 bg-blue-500 text-white hover:bg-blue-600"
                    >
                      <FaTelegram className="h-4 w-4" />
                    </a>
                    <a
                      href={`whatsapp://send?text=${encodeURIComponent(
                        buildURL(adsDetailData.slug)
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9 bg-green-600 text-white hover:bg-green-700"
                    >
                      <FaWhatsapp className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsored Posts Sidebar - Right Column */}
      <div className="lg:col-span-1">
        <SponsoredPostsSidebar 
          currentAdCategory={adsDetailData.category?.slug}
          currentAdId={adsDetailData.listing_id}
          currentLocation={adsDetailData.location}
        />
      </div>



      {/* Related Ads Section */}
      {adsDetailData && (
        <div className="border-t bg-muted/30">
          <RelatedSlider category={adsDetailData.category?.slug} />
        </div>
      )}

      {/* Top Affiliates Section */}
      <div className="border-t bg-background">
        <div className="container px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <TopAffiliateOnAdsDetail />
        </div>
      </div>

      {/* EbayAds Section */}
      <div className="border-t bg-muted/30">
        <div className="container px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <EbayAds />
        </div>
      </div>

      {/* Bottom Ads */}
      <div className="py-8">
        <BottomAds />
      </div>

      <Footer />
    </div >
  );
}

export default FeaturedAdsDetail;
