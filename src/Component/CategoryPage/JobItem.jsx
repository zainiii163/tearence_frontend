import React, { memo } from "react";
import { Link } from "react-router-dom";
import {
  FaDollarSign,
  FaBriefcase,
  FaClock,
  FaStar,
  FaHeart,
  FaRocket,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import LazyImage from "../LazyLoading/LazyImage";

const JobItem = memo(({ item, viewMode = "grid" }) => {
  const formatSalary = (min, max, currency = "$") => {
    if (min && max) {
      return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}`;
    }
    if (min) {
      return `${currency}${min.toLocaleString()}+`;
    }
    return "Salary not specified";
  };

  const formatDate = (dateString) => {
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
          {/* Company Logo/Image */}
          <div className="w-full md:w-32 flex-shrink-0">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted flex items-center justify-center">
              {item.company_logo ? (
                <LazyImage
                  className="h-full w-full object-cover"
                  src={item.company_logo}
                  alt={item.company_name || "Company"}
                  placeholder="/img/no-image.png"
                />
              ) : (
                <FaBriefcase className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Job Details */}
          <div className="flex-1 space-y-3">
            {/* Featured Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              {item.is_featured && (
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-yellow-100 text-yellow-800">
                  <FaStar className="mr-1 h-3 w-3" />
                  Featured
                </div>
              )}
              {item.is_suggested && (
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-purple-100 text-purple-800">
                  <FaRocket className="mr-1 h-3 w-3" />
                  Suggested
                </div>
              )}
              {item.upsells?.featured && (
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-yellow-100 text-yellow-800">
                  <FaStar className="mr-1 h-3 w-3" />
                  Featured
                </div>
              )}
              {item.upsells?.suggested && (
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-purple-100 text-purple-800">
                  <FaRocket className="mr-1 h-3 w-3" />
                  Suggested
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                <Link
                  to={`/jobs/${item.id}`}
                  className="hover:text-primary transition-colors"
                >
                  {item.title}
                </Link>
              </h3>
              <p className="text-sm text-muted-foreground">
                {item.company_name} • {item.job_type}
              </p>
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            )}

            {/* Location and Salary */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {item.location && (
                <div className="flex items-center gap-1">
                  <MdLocationOn className="h-4 w-4" />
                  <span>{formatLocation(item.location)}</span>
                </div>
              )}
              {item.salary_min && (
                <div className="flex items-center gap-1">
                  <FaDollarSign className="h-4 w-4" />
                  <span>{formatSalary(item.salary_min, item.salary_max, item.currency_symbol)}</span>
                </div>
              )}
              {item.posted_date && (
                <div className="flex items-center gap-1">
                  <FaClock className="h-4 w-4" />
                  <span>{formatDate(item.posted_date)}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <Link
                to={`/jobs/${item.id}`}
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
      <Link to={`/jobs/${item.id}`}>
        {/* Company Logo/Image */}
        <div className="aspect-video overflow-hidden rounded-t-lg bg-muted flex items-center justify-center">
          {item.company_logo ? (
            <LazyImage
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              src={item.company_logo}
              alt={item.company_name || "Company"}
              placeholder="/img/no-image.png"
            />
          ) : (
            <FaBriefcase className="h-16 w-16 text-muted-foreground" />
          )}
        </div>
      </Link>

      <div className="p-4 space-y-3">
        {/* Featured Badge */}
        <div className="flex items-center gap-2 flex-wrap">
          {item.is_featured && (
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-yellow-100 text-yellow-800">
              <FaStar className="mr-1 h-3 w-3" />
              Featured
            </div>
          )}
          {item.is_suggested && (
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-purple-100 text-purple-800">
              <FaRocket className="mr-1 h-3 w-3" />
              Suggested
            </div>
          )}
          {item.upsells?.featured && (
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-yellow-100 text-yellow-800">
              <FaStar className="mr-1 h-3 w-3" />
              Featured
            </div>
          )}
          {item.upsells?.suggested && (
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-purple-100 text-purple-800">
              <FaRocket className="mr-1 h-3 w-3" />
              Suggested
            </div>
          )}
        </div>

        {/* Job Title */}
        <div>
          <h3 className="font-semibold leading-tight text-foreground line-clamp-2 mb-1">
            <Link
              to={`/jobs/${item.id}`}
              className="hover:text-primary transition-colors"
            >
              {item.title}
            </Link>
          </h3>
          <p className="text-sm text-muted-foreground">{item.company_name}</p>
        </div>

        {/* Job Type */}
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-primary/10 text-primary">
          <FaBriefcase className="mr-1 h-3 w-3" />
          {item.job_type}
        </div>

        {/* Location and Salary */}
        <div className="space-y-2">
          {item.location && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MdLocationOn className="h-4 w-4" />
              <span className="line-clamp-1">{formatLocation(item.location)}</span>
            </div>
          )}
          {item.salary_min && (
            <div className="flex items-center gap-1 text-sm font-semibold text-primary">
              <FaDollarSign className="h-4 w-4" />
              <span>{formatSalary(item.salary_min, item.salary_max, item.currency_symbol)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <Link
            to={`/jobs/${item.id}`}
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
});

JobItem.displayName = "JobItem";

export default JobItem;

