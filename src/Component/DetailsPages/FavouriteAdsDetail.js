import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useDispatch, useSelector } from "react-redux";
import { getFavouriteAdsDetail, creatFavouriteAds, getFavouriteAds } from "../../slice/ListSlice";
import RelatedSlider from "./RelatedAds";
import TopAffiliateOnAdsDetail from "../TopAffiliateOnAdsDetail_OLD_DEPRECATED";
import EbayAds from "../EbayAds";
import BottomAds from "../BottomAds";
import Env from "../../useEnv";

// Icons
import {
  FaStore,
  FaTelegram,
  FaWhatsapp,
  FaFacebookF,
  FaLinkedinIn,
  FaEnvelope,
  FaMapMarkerAlt,
  FaEye,
  FaTags,
  FaUser,
  FaHeart,
  FaFlag,
} from "react-icons/fa";
import { BsTwitter } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import { BiTime } from "react-icons/bi";
import ChatButton from "../Chat/ChatButton";

function FavouriteAdsDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const featureAdsDetails = useSelector((store) => store.ads.favouriteAdsDetail);
  const adsDetailData = featureAdsDetails?.data?.listing || {};

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(true); // Already favorited since it's in favorites

  useEffect(() => {
    if (id) {
      dispatch(getFavouriteAdsDetail({ id }));
    }
  }, [id, dispatch]);

  const addToFavourite = () => {
    if (adsDetailData.customer_id && adsDetailData.listing_id) {
      dispatch(
        creatFavouriteAds({
          data: {
            customer_id: adsDetailData.customer_id,
            listing_id: adsDetailData.listing_id,
            is_favorite: true
          },
        })
      ).then(() => {
        const currentCustomerId = localStorage.getItem('customer_id');
        if (currentCustomerId) dispatch(getFavouriteAds({ skip: 0, limit: 50, id: currentCustomerId }));
      });
      setIsFavorited(true);
    }
  };

  const buildURL = (slug) => {
    return Env.baseUrl + "favourite-ads/" + id;
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

      <div className="w-full flex justify-center pt-24 sm:pt-24">
        <div className="container px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images */}
            <div className="lg:col-span-2">
              {/* Main Image Gallery */}
              <div className="rounded-lg border bg-card shadow-sm overflow-hidden mb-6">
                <div className="aspect-video">
                  {hasImages ? (
                    <img
                      src={images[selectedImageIndex]?.image_path}
                      className="w-full h-full object-cover"
                      alt={`${adsDetailData?.title} - Preview ${selectedImageIndex + 1}`}
                      onError={(e) => {
                        e.target.src = "/img/no-image.png";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <div className="text-center">
                        <FaEye className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No images available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Image Thumbnails */}
                {hasImages && images.length > 1 && (
                  <div className="p-4 border-t bg-muted/30">
                    <div className="flex gap-2 overflow-x-auto">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${selectedImageIndex === index
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

              {/* Ad Description */}
              <div className="rounded-lg border bg-card shadow-sm mb-6">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaTags className="h-5 w-5 text-primary" />
                    Description
                  </h2>
                  <div
                    className="prose prose-sm max-w-none text-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html:
                        adsDetailData?.description?.replace(/\\n/g, "<br>") ||
                        "<p class='text-muted-foreground italic'>No description provided for this listing.</p>",
                    }}
                  />
                </div>
              </div>

              {/* Location Map */}
              {adsDetailData.location && (
                <div className="rounded-lg border bg-card shadow-sm">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <FaMapMarkerAlt className="h-5 w-5 text-primary" />
                      Location
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                        <FaMapMarkerAlt className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">
                            {adsDetailData.location.city}
                          </p>
                          {adsDetailData.location.country_name && (
                            <p className="text-sm text-muted-foreground">
                              {adsDetailData.location.country_name}
                            </p>
                          )}
                          {adsDetailData.location.address && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {adsDetailData.location.address}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Google Maps Integration */}
                      {Env.GoogleApiKey ? (
                        <>
                          {adsDetailData.location?.latitude && adsDetailData.location?.longitude ? (
                            <div className="aspect-video rounded-lg overflow-hidden border shadow-sm">
                              <iframe
                                title="Location Map"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                src={`https://www.google.com/maps/embed/v1/place?key=${Env.GoogleApiKey}&q=${adsDetailData.location.latitude},${adsDetailData.location.longitude}&zoom=15&maptype=roadmap&loading=async`}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                              />
                            </div>
                          ) : adsDetailData.location?.city ? (
                            <div className="aspect-video rounded-lg overflow-hidden border shadow-sm">
                              <iframe
                                title="Location Map"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                src={`https://www.google.com/maps/embed/v1/place?key=${Env.GoogleApiKey}&q=${encodeURIComponent(adsDetailData.location.city + ', ' + (adsDetailData.location.country_name || ''))}&zoom=12&maptype=roadmap&loading=async`}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                              />
                            </div>
                          ) : (
                            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border">
                              <div className="text-center">
                                <FaMapMarkerAlt className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                <p className="text-muted-foreground font-medium">Map View</p>
                                <p className="text-sm text-muted-foreground">
                                  Location coordinates not available
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Map Actions */}
                          <div className="flex flex-wrap gap-2 mt-4">
                            {adsDetailData.location?.latitude && adsDetailData.location?.longitude && (
                              <>
                                <a
                                  href={`https://www.google.com/maps/dir/?api=1&destination=${adsDetailData.location.latitude},${adsDetailData.location.longitude}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2"
                                >
                                  <FaMapMarkerAlt className="h-3 w-3" />
                                  Get Directions
                                </a>
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${adsDetailData.location.latitude},${adsDetailData.location.longitude}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2"
                                >
                                  <FaEye className="h-3 w-3" />
                                  View in Maps
                                </a>
                              </>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border">
                          <div className="text-center">
                            <FaMapMarkerAlt className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground font-medium">Map View</p>
                            <p className="text-sm text-muted-foreground">
                              Google Maps API not configured
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - Ad Details & Actions */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Ad Title & Basic Info */}
                <div className="rounded-lg border bg-card shadow-sm">
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-foreground mb-4 leading-tight">
                      {adsDetailData?.title || 'Ad Title Not Available'}
                    </h1>

                    {/* Price */}
                    {(adsDetailData?.price !== null && adsDetailData?.price !== undefined) && (
                      <div className="mb-4 p-3 bg-primary/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FaTags className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-muted-foreground">Price</span>
                        </div>
                        <div className="text-2xl font-bold text-primary mt-1">
                          {adsDetailData.currency?.symbol || '$'} {adsDetailData.price}
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    {adsDetailData.location && (
                      <div className="flex items-start gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
                        <FaMapMarkerAlt className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {adsDetailData.location?.city}
                          </p>
                          {adsDetailData.location?.country_name && (
                            <p className="text-xs text-muted-foreground">
                              {adsDetailData.location.country_name}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Posted Date */}
                    {adsDetailData.created_at && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <BiTime className="h-4 w-4" />
                        <span>Posted on {formatDate(adsDetailData.created_at)}</span>
                      </div>
                    )}

                    {/* Category */}
                    {adsDetailData.category && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
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
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FaUser className="h-4 w-4 text-primary" />
                      Contact Seller
                    </h3>

                    {/* Seller Info */}
                    {adsDetailData.customer && (
                      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
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

                        <button className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-sm font-medium transition-colors">
                          <FaFlag className="h-3 w-3" />
                          <span className="hidden sm:inline">Report</span>
                        </button>
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

                {/* Share Section */}
                <div className="rounded-lg border bg-card shadow-sm">
                  <div className="p-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-muted-foreground">Share this ad</h3>
                      <div className="flex flex-wrap gap-3">
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${buildURL()}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Share on Facebook"
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9 bg-blue-600 text-white hover:bg-blue-700"
                        >
                          <FaFacebookF className="h-4 w-4" />
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?url=${buildURL()}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9 bg-sky-500 text-white hover:bg-sky-600"
                        >
                          <BsTwitter className="h-4 w-4" />
                        </a>
                        <a
                          href={`https://www.linkedin.com/shareArticle?url=${buildURL()}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9 bg-blue-700 text-white hover:bg-blue-800"
                        >
                          <FaLinkedinIn className="h-4 w-4" />
                        </a>
                        <a
                          href={`https://t.me/share/url?url=${buildURL()}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9 bg-blue-500 text-white hover:bg-blue-600"
                        >
                          <FaTelegram className="h-4 w-4" />
                        </a>
                        <a
                          href={`whatsapp://send?text=${encodeURIComponent(buildURL())}`}
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
        </div>
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
    </div>
  );
}

export default FavouriteAdsDetail;
