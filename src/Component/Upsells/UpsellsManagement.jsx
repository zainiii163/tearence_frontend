import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getUserJobUpsells,
  getUserCandidateUpsells,
} from "../../slice/UpsellSlice";
import {
  FaStar,
  FaRocket,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaBriefcase,
  FaUser,
  FaDollarSign,
  FaEye,
} from "react-icons/fa";
import toast from "react-hot-toast";

const UpsellsManagement = () => {
  const dispatch = useDispatch();
  const { userJobUpsells, userCandidateUpsells, loading } = useSelector(
    (store) => store.upsells
  );

  const [activeTab, setActiveTab] = useState("job-upsells");

  useEffect(() => {
    dispatch(getUserJobUpsells()).catch((error) => {
      if (process.env.NODE_ENV === "development") {
        console.debug("Error fetching job upsells:", error);
      }
    });
    dispatch(getUserCandidateUpsells()).catch((error) => {
      if (process.env.NODE_ENV === "development") {
        console.debug("Error fetching candidate upsells:", error);
      }
    });
  }, [dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysRemaining = (endDate) => {
    if (!endDate) return null;
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (upsell) => {
    const isActive = upsell.status === "active" || upsell.is_active;
    const endDate = upsell.end_date || upsell.expires_at;
    const daysRemaining = endDate ? getDaysRemaining(endDate) : null;

    if (!isActive || (daysRemaining !== null && daysRemaining <= 0)) {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
          <FaTimesCircle className="mr-1 h-3 w-3" />
          Expired
        </span>
      );
    }

    if (daysRemaining !== null && daysRemaining <= 7) {
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
          <FaClock className="mr-1 h-3 w-3" />
          {daysRemaining} days left
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
        <FaCheckCircle className="mr-1 h-3 w-3" />
        Active
      </span>
    );
  };

  const jobUpsells = Array.isArray(userJobUpsells) ? userJobUpsells : [];
  const candidateUpsells = Array.isArray(userCandidateUpsells)
    ? userCandidateUpsells
    : [];

  const getUpsellTypeIcon = (type) => {
    switch (type) {
      case "featured":
      case "featured_job":
        return <FaStar className="h-5 w-5 text-yellow-500" />;
      case "suggested":
      case "suggested_job":
        return <FaRocket className="h-5 w-5 text-purple-500" />;
      default:
        return <FaStar className="h-5 w-5 text-gray-500" />;
    }
  };

  const getUpsellTypeName = (type) => {
    switch (type) {
      case "featured":
      case "featured_job":
        return "Featured Job";
      case "suggested":
      case "suggested_job":
        return "Suggested Job";
      case "featured_profile":
        return "Featured Profile";
      case "job_alerts_boost":
        return "Job Alerts Boost";
      default:
        return type || "Upsell";
    }
  };

  const getUpsellTypeColor = (type) => {
    switch (type) {
      case "featured":
      case "featured_job":
      case "featured_profile":
        return "bg-yellow-50 border-yellow-200";
      case "suggested":
      case "suggested_job":
        return "bg-purple-50 border-purple-200";
      case "job_alerts_boost":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            {
              id: "job-upsells",
              label: "Job Upsells",
              count: jobUpsells.length,
              icon: <FaBriefcase className="h-4 w-4" />,
            },
            {
              id: "candidate-upsells",
              label: "Candidate Upsells",
              count: candidateUpsells.length,
              icon: <FaUser className="h-4 w-4" />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Job Upsells Tab */}
      {activeTab === "job-upsells" && (
        <div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : jobUpsells.length > 0 ? (
            <div className="space-y-4">
              {jobUpsells.map((upsell) => {
                const upsellType = upsell.upsell_type || upsell.type;
                const daysRemaining = getDaysRemaining(
                  upsell.end_date || upsell.expires_at
                );
                return (
                  <div
                    key={upsell.id || upsell.job_upsell_id}
                    className={`rounded-lg border p-6 ${getUpsellTypeColor(
                      upsellType
                    )}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 rounded-lg bg-white">
                          {getUpsellTypeIcon(upsellType)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">
                              {getUpsellTypeName(upsellType)}
                            </h3>
                            {getStatusBadge(upsell)}
                          </div>
                          {upsell.listing && (
                            <p className="text-sm text-muted-foreground mb-1">
                              <Link
                                to={`/jobs/${upsell.listing_id || upsell.listing?.id}`}
                                className="text-primary hover:underline"
                              >
                                {upsell.listing.title || upsell.job_title || "Job Listing"}
                              </Link>
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                            {upsell.created_at && (
                              <div className="flex items-center gap-1">
                                <FaClock className="h-3 w-3" />
                                <span>
                                  Started: {formatDate(upsell.created_at)}
                                </span>
                              </div>
                            )}
                            {upsell.end_date && (
                              <div className="flex items-center gap-1">
                                <FaClock className="h-3 w-3" />
                                <span>
                                  Expires: {formatDate(upsell.end_date)}
                                  {daysRemaining !== null && daysRemaining > 0 && (
                                    <span className="ml-1 text-primary">
                                      ({daysRemaining} days left)
                                    </span>
                                  )}
                                </span>
                              </div>
                            )}
                            {upsell.duration_days && (
                              <div className="flex items-center gap-1">
                                <FaClock className="h-3 w-3" />
                                <span>{upsell.duration_days} days</span>
                              </div>
                            )}
                            {upsell.price !== null && upsell.price !== undefined && !isNaN(Number(upsell.price)) && (
                              <div className="flex items-center gap-1">
                                <FaDollarSign className="h-3 w-3" />
                                <span>${Number(upsell.price).toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {upsell.listing_id && (
                        <Link
                          to={`/jobs/${upsell.listing_id}`}
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4"
                        >
                          <FaEye className="h-4 w-4 mr-2" />
                          View Job
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 rounded-lg border bg-card">
              <FaBriefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">
                No job upsells yet. Upgrade your job postings to get more visibility!
              </p>
              <Link
                to="/jobs/post"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4"
              >
                Post a Job
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Candidate Upsells Tab */}
      {activeTab === "candidate-upsells" && (
        <div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : candidateUpsells.length > 0 ? (
            <div className="space-y-4">
              {candidateUpsells.map((upsell) => {
                const upsellType = upsell.upsell_type || upsell.type;
                const daysRemaining = getDaysRemaining(
                  upsell.end_date || upsell.expires_at
                );
                return (
                  <div
                    key={upsell.id || upsell.candidate_upsell_id}
                    className={`rounded-lg border p-6 ${getUpsellTypeColor(
                      upsellType
                    )}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 rounded-lg bg-white">
                          {getUpsellTypeIcon(upsellType)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">
                              {getUpsellTypeName(upsellType)}
                            </h3>
                            {getStatusBadge(upsell)}
                          </div>
                          {upsell.candidate_profile && (
                            <p className="text-sm text-muted-foreground mb-1">
                              Profile: {upsell.candidate_profile.headline || "Candidate Profile"}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                            {upsell.created_at && (
                              <div className="flex items-center gap-1">
                                <FaClock className="h-3 w-3" />
                                <span>
                                  Started: {formatDate(upsell.created_at)}
                                </span>
                              </div>
                            )}
                            {upsell.end_date && (
                              <div className="flex items-center gap-1">
                                <FaClock className="h-3 w-3" />
                                <span>
                                  Expires: {formatDate(upsell.end_date)}
                                  {daysRemaining !== null && daysRemaining > 0 && (
                                    <span className="ml-1 text-primary">
                                      ({daysRemaining} days left)
                                    </span>
                                  )}
                                </span>
                              </div>
                            )}
                            {upsell.duration_days && (
                              <div className="flex items-center gap-1">
                                <FaClock className="h-3 w-3" />
                                <span>{upsell.duration_days} days</span>
                              </div>
                            )}
                            {upsell.price !== null && upsell.price !== undefined && !isNaN(Number(upsell.price)) && (
                              <div className="flex items-center gap-1">
                                <FaDollarSign className="h-3 w-3" />
                                <span>${Number(upsell.price).toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {upsell.candidate_profile_id && (
                        <Link
                          to="/candidates/profile"
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4"
                        >
                          <FaEye className="h-4 w-4 mr-2" />
                          View Profile
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 rounded-lg border bg-card">
              <FaUser className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">
                No candidate upsells yet. Upgrade your profile to get more visibility!
              </p>
              <Link
                to="/candidates/profile"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4"
              >
                Create Profile
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UpsellsManagement;
