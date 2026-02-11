import React from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaDollarSign,
  FaStar,
  FaHeart,
  FaClock,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

const ServiceItem = ({ item, viewMode = "grid" }) => {
  const formatPrice = (price, currency = "$") => {
    if (!price) return "Price on request";
    return `${currency}${price.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatLocation = (location) => {
    if (!location) return "";
    // If location is a string, return it directly
    if (typeof location === "string") return location;
    // If location is an object, format it
    if (typeof location === "object") {
      const parts = [];
      if (location.city) parts.push(location.city);
      if (location.zone_name) parts.push(location.zone_name);
      if (location.country_name) parts.push(location.country_name);
      return parts.length > 0 ? parts.join(", ") : location.city || location.zone_name || location.country_name || "";
    }
    return "";
  };

  if (viewMode === "list") {
    return (
      <div className="group rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
        <div className="flex flex-col md:flex-row gap-4 p-6">
          {/* Service Image */}
          <div className="w-full md:w-32 flex-shrink-0">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted flex items-center justify-center">
              {item.image ? (
                <img
                  className="h-full w-full object-cover"
                  src={item.image}
                  alt={item.title || "Service"}
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
              )}
            </div>
          </div>

          {/* Service Details */}
          <div className="flex-1 space-y-3">
            {/* Featured Badge */}
            {item.is_featured && (
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-yellow-100 text-yellow-800">
                <FaStar className="mr-1 h-3 w-3" />
                Featured
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                <Link
                  to={`/services/${item.id}`}
                  className="hover:text-primary transition-colors"
                >
                  {item.title}
                </Link>
              </h3>
              <p className="text-sm text-muted-foreground">
                {item.provider_name || item.user_name}
              </p>
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            )}

            {/* Location and Price */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {item.location && (
                <div className="flex items-center gap-1">
                  <MdLocationOn className="h-4 w-4" />
                  <span>{formatLocation(item.location)}</span>
                </div>
              )}
              {item.price && (
                <div className="flex items-center gap-1">
                  <FaDollarSign className="h-4 w-4" />
                  <span className="font-semibold text-primary">
                    {formatPrice(item.price, item.currency_symbol)}
                  </span>
                </div>
              )}
              {item.created_at && (
                <div className="flex items-center gap-1">
                  <FaClock className="h-4 w-4" />
                  <span>{formatDate(item.created_at)}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <Link
                to={`/services/${item.id}`}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4"
              >
                View Details
              </Link>
              <div className="flex gap-2">
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                  <FaHeart className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="group rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
      <Link to={`/services/${item.id}`}>
        {/* Service Image */}
        <div className="aspect-video overflow-hidden rounded-t-lg bg-muted flex items-center justify-center">
          {item.image ? (
            <img
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              src={item.image}
              alt={item.title || "Service"}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <span className="text-4xl">📦</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 space-y-3">
        {/* Featured Badge */}
        {item.is_featured && (
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-yellow-100 text-yellow-800">
            <FaStar className="mr-1 h-3 w-3" />
            Featured
          </div>
        )}

        {/* Service Title */}
        <div>
          <h3 className="font-semibold leading-tight text-foreground line-clamp-2 mb-1">
            <Link
              to={`/services/${item.id}`}
              className="hover:text-primary transition-colors"
            >
              {item.title}
            </Link>
          </h3>
          <p className="text-sm text-muted-foreground">{item.provider_name || item.user_name}</p>
        </div>

        {/* Location and Price */}
        <div className="space-y-2">
          {item.location && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MdLocationOn className="h-4 w-4" />
              <span className="line-clamp-1">{formatLocation(item.location)}</span>
            </div>
          )}
          {item.price && (
            <div className="flex items-center gap-1 text-sm font-semibold text-primary">
              <FaDollarSign className="h-4 w-4" />
              <span>{formatPrice(item.price, item.currency_symbol)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <Link
            to={`/services/${item.id}`}
            className="text-sm text-primary hover:underline"
          >
            View Details
          </Link>
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
            <FaHeart className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceItem;

