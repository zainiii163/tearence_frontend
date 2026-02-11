import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaDollarSign,
  FaStar,
  FaHeart,
  FaEye,
  FaTags,
  FaCrown,
  FaMedal,
  FaTrophy,
  FaFire,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import LazyImage from "../LazyLoading/LazyImage";

const CategoryItem = memo(({ item, viewMode = "grid", onUpsellClick }) => {
  const [showUpsellModal, setShowUpsellModal] = useState(false);

  const formatLocation = (location) => {
    if (!location) return "";
    if (typeof location === "string") return location;
    if (typeof location === "object") {
      const parts = [];
      if (location.city) parts.push(location.city);
      if (location.zone_name) parts.push(location.zone_name);
      if (location.country_name) parts.push(location.country_name);
      return parts.length > 0 ? parts.join(", ") : location.city || location.zone_name || location.country_name || "";
    }
    return "";
  };

  const formatPrice = (price, currency) => {
    if (!price) return "Price not specified";
    const symbol = currency?.symbol || currency || "$";
    return `${symbol}${price.toLocaleString()}`;
  };

  const getImage = () => {
    if (item?.images?.[0]?.image_path) {
      return item.images[0].image_path;
    }
    if (item?.image_path) {
      return item.image_path;
    }
    return "/img/no-image.png";
  };

  const getCategoryName = () => {
    if (item?.category?.name) return item.category.name;
    if (item?.category_name) return item.category_name;
    return "Category";
  };

  const getUpsellBadges = () => {
    if (!item?.upsells || !Array.isArray(item.upsells)) return null;
    
    return item.upsells.map((upsell, index) => {
      const badgeConfig = getBadgeConfig(upsell.upsell_type);
      if (!badgeConfig) return null;
      
      return (
        <span
          key={index}
          className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${badgeConfig.className}`}
        >
          <badgeConfig.icon className="mr-1 h-3 w-3" />
          {badgeConfig.label}
        </span>
      );
    });
  };

  const getBadgeConfig = (upsellType) => {
    const configs = {
      premium: {
        icon: FaCrown,
        label: "Premium",
        className: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border border-yellow-500",
      },
      sponsored: {
        icon: FaMedal,
        label: "Sponsored",
        className: "bg-gradient-to-r from-blue-400 to-blue-600 text-white border border-blue-500",
      },
      featured: {
        icon: FaTrophy,
        label: "Featured",
        className: "bg-gradient-to-r from-purple-400 to-purple-600 text-white border border-purple-500",
      },
      priority: {
        icon: FaFire,
        label: "Priority",
        className: "bg-gradient-to-r from-red-400 to-red-600 text-white border border-red-500",
      },
    };
    
    return configs[upsellType];
  };

  const detailUrl = item?.slug ? `/ads-detail/${item.slug}` : `#`;

  if (viewMode === "list") {
    return (
      <div className="group rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
        <div className="flex flex-col md:flex-row gap-4 p-6">
          {/* Image */}
          <Link to={detailUrl} className="w-full md:w-48 flex-shrink-0">
            <div className="aspect-video md:aspect-square overflow-hidden rounded-lg bg-muted">
              <LazyImage
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                src={getImage()}
                alt={item.title}
                placeholder="/img/no-image.png"
              />
            </div>
          </Link>

          {/* Content */}
          <div className="flex-1 space-y-3">
            {/* Upsell Badges */}
            {getUpsellBadges() && (
              <div className="flex flex-wrap gap-1 mb-2">
                {getUpsellBadges()}
              </div>
            )}

            {/* Category Badge */}
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-primary/10 text-primary">
              <FaTags className="mr-1 h-3 w-3" />
              {getCategoryName()}
            </div>

            {/* Title */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                <Link
                  to={detailUrl}
                  className="hover:text-primary transition-colors"
                >
                  {item.title}
                </Link>
              </h3>
              {item.head && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.head}
                </p>
              )}
            </div>

            {/* Location */}
            {item.location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MdLocationOn className="h-4 w-4" />
                <span>{formatLocation(item.location)}</span>
              </div>
            )}

            {/* Price and Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1 text-lg font-semibold text-primary">
                <FaDollarSign className="h-4 w-4" />
                <span>
                  {formatPrice(item.price, item.currency)}
                </span>
              </div>

              <div className="flex gap-2">
                {onUpsellClick && (
                  <button
                    onClick={() => setShowUpsellModal(true)}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                  >
                    <FaCrown className="mr-1 h-3 w-3" />
                    Promote
                  </button>
                )}
                <Link to={detailUrl}>
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                    <FaEye className="h-3 w-3" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Upsell Modal */}
        {showUpsellModal && onUpsellClick && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Promote Your Listing</h3>
              <p className="text-gray-600 mb-4">Choose how you want to promote your listing:</p>
              {onUpsellClick(item, () => setShowUpsellModal(false))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Grid view
  return (
    <div className="group rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
      <Link to={detailUrl}>
        <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
          <LazyImage
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            src={getImage()}
            alt={item.title}
            placeholder="/img/no-image.png"
          />
        </div>
      </Link>

      <div className="p-4 space-y-3">
        {/* Upsell Badges */}
        {getUpsellBadges() && (
          <div className="flex flex-wrap gap-1">
            {getUpsellBadges()}
          </div>
        )}

        {/* Category Badge */}
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-primary/10 text-primary">
          <FaTags className="mr-1 h-3 w-3" />
          {getCategoryName()}
        </div>

        {/* Title and Description */}
        <div>
          <h3 className="font-semibold leading-tight text-foreground line-clamp-2 mb-1">
            <Link
              to={detailUrl}
              className="hover:text-primary transition-colors"
            >
              {item.title}
            </Link>
          </h3>
          {item.head && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.head}
            </p>
          )}
        </div>

        {/* Location */}
        {item.location && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MdLocationOn className="h-4 w-4" />
            <span className="line-clamp-1">{formatLocation(item.location)}</span>
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1 text-lg font-semibold text-primary">
            <FaDollarSign className="h-4 w-4" />
            <span>{formatPrice(item.price, item.currency)}</span>
          </div>

          <div className="flex gap-2">
            {onUpsellClick && (
              <button
                onClick={() => setShowUpsellModal(true)}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
              >
                <FaCrown className="mr-1 h-3 w-3" />
                Promote
              </button>
            )}
            <Link to={detailUrl}>
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                <FaEye className="h-3 w-3" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Upsell Modal */}
      {showUpsellModal && onUpsellClick && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Promote Your Listing</h3>
            <p className="text-gray-600 mb-4">Choose how you want to promote your listing:</p>
            {onUpsellClick(item, () => setShowUpsellModal(false))}
          </div>
        </div>
      )}
    </div>
  );
});

CategoryItem.displayName = "CategoryItem";

export default CategoryItem;

