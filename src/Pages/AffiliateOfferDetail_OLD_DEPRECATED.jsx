import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaArrowLeft,
  FaUserCheck,
  FaStar,
  FaShare,
  FaBookmark,
  FaEnvelope,
  FaPhone,
  FaGlobeAmericas,
  FaChartLine,
  FaTags,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMedal,
  FaShieldAlt,
  FaClock,
  FaDollarSign,
  FaDownload,
  FaCopy,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaPlay,
  FaImage,
  FaFileAlt,
  FaLink,
  FaUsers,
  FaShoppingCart,
  FaEye,
  FaRocket
} from "react-icons/fa";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import toast from "react-hot-toast";

const AffiliateOfferDetail = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  // Sample offer data - in real app, this would come from API
  const sampleOffer = {
    id: offerId,
    companyName: "TechGadgets Pro",
    companyLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=face",
    title: "Premium Electronics & Gadgets Affiliate Program",
    description: "Join our premium affiliate program and earn competitive commissions promoting high-quality electronics and gadgets. We offer a wide range of products including smartphones, laptops, smart home devices, and accessories with global shipping and excellent customer support.",
    category: "Technology & Gadgets",
    commissionStructure: {
      type: "percentage",
      rate: "25%",
      recurring: false,
      tiers: [
        { sales: "0-50", commission: "20%" },
        { sales: "51-200", commission: "25%" },
        { sales: "201+", commission: "30%" }
      ]
    },
    cookieDuration: 30,
    allowedTraffic: ["All Sources", "Social Media", "Blog/Content", "Email Marketing", "PPC"],
    restrictions: ["No trademark bidding", "No incentive traffic", "No adult content"],
    minPayout: 50,
    payoutFrequency: "Monthly",
    paymentMethods: ["PayPal", "Bank Transfer", "Stripe"],
    trackingLink: "https://techgadgets.pro/affiliate/unique-id",
    promotionalAssets: [
      {
        type: "banner",
        name: "Homepage Banner 728x90",
        url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=728&h=90&fit=crop",
        downloadUrl: "#"
      },
      {
        type: "banner",
        name: "Sidebar Banner 300x250",
        url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=250&fit=crop",
        downloadUrl: "#"
      },
      {
        type: "video",
        name: "Product Demo Video",
        url: "https://example.com/video.mp4",
        thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=225&fit=crop"
      }
    ],
    contactInfo: {
      email: "affiliate@techgadgets.pro",
      phone: "+1-555-0123",
      website: "https://techgadgets.pro",
      address: "San Francisco, CA"
    },
    stats: {
      totalAffiliates: 2847,
      avgCommission: "$125/month",
      conversionRate: "3.2%",
      rating: 4.8,
      totalReviews: 156
    },
    verified: true,
    featured: true,
    createdAt: "2024-01-15",
    lastUpdated: "2024-02-10"
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOffer(sampleOffer);
      setLoading(false);
    }, 1000);
  }, [offerId, sampleOffer]);

  const handleApplyToPromote = () => {
    setShowApplicationModal(true);
  };

  const handleCopyTrackingLink = () => {
    navigator.clipboard.writeText(offer.trackingLink);
    toast.success("Tracking link copied to clipboard!");
  };

  const handleShareOffer = () => {
    if (navigator.share) {
      navigator.share({
        title: offer.title,
        text: offer.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Offer link copied to clipboard!");
    }
  };

  const handleBookmarkOffer = () => {
    toast.success("Offer bookmarked!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading offer details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Offer Not Found</h2>
            <p className="text-gray-600 mb-6">The affiliate offer you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate("/affiliates-hub")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Back to Affiliate Hub
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate("/affiliates-hub")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <FaArrowLeft />
            Back to Affiliate Hub
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <img 
                src={offer.companyLogo} 
                alt={offer.companyName}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{offer.companyName}</h1>
                  {offer.verified && (
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <FaUserCheck />
                      Verified Business
                    </div>
                  )}
                  {offer.featured && (
                    <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <FaMedal />
                      Featured
                    </div>
                  )}
                </div>
                <p className="text-lg text-gray-600">{offer.title}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleShareOffer}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Share offer"
              >
                <FaShare className="text-gray-600" />
              </button>
              <button
                onClick={handleBookmarkOffer}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Bookmark offer"
              >
                <FaBookmark className="text-gray-600" />
              </button>
              <button
                onClick={handleApplyToPromote}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FaRocket />
                Apply to Promote
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-blue-600 text-white py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold">{offer.stats.totalAffiliates.toLocaleString()}</div>
              <div className="text-blue-100 text-sm">Active Affiliates</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{offer.stats.avgCommission}</div>
              <div className="text-blue-100 text-sm">Avg Commission</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{offer.stats.conversionRate}</div>
              <div className="text-blue-100 text-sm">Conversion Rate</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1">
                <FaStar className="fill-current" />
                <span className="text-2xl font-bold">{offer.stats.rating}</span>
              </div>
              <div className="text-blue-100 text-sm">{offer.stats.totalReviews} Reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: "overview", label: "Overview", icon: <FaInfoCircle /> },
                    { id: "commission", label: "Commission", icon: <FaDollarSign /> },
                    { id: "assets", label: "Promotional Assets", icon: <FaImage /> },
                    { id: "contact", label: "Contact", icon: <FaEnvelope /> }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Program</h3>
                      <p className="text-gray-600 leading-relaxed">{offer.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Program Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <FaTags className="text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500">Category</div>
                            <div className="font-medium">{offer.category}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaClock className="text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500">Cookie Duration</div>
                            <div className="font-medium">{offer.cookieDuration} days</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaDollarSign className="text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500">Min Payout</div>
                            <div className="font-medium">${offer.minPayout}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaCalendarAlt className="text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500">Payout Frequency</div>
                            <div className="font-medium">{offer.payoutFrequency}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Allowed Traffic Sources</h3>
                      <div className="flex flex-wrap gap-2">
                        {offer.allowedTraffic.map((source, index) => (
                          <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            <FaCheckCircle className="inline mr-1" />
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Restrictions</h3>
                      <div className="space-y-2">
                        {offer.restrictions.map((restriction, index) => (
                          <div key={index} className="flex items-center gap-2 text-red-600">
                            <FaTimesCircle />
                            <span>{restriction}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Commission Tab */}
                {activeTab === "commission" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Commission Structure</h3>
                      <div className="bg-blue-50 rounded-lg p-6 mb-4">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {offer.commissionStructure.rate} Commission
                        </div>
                        <div className="text-blue-700">
                          {offer.commissionStructure.recurring ? "Recurring" : "One-time"} commission on all sales
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance Tiers</h3>
                      <div className="space-y-3">
                        {offer.commissionStructure.tiers.map((tier, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900">{tier.sales} sales/month</div>
                                <div className="text-sm text-gray-500">Monthly sales range</div>
                              </div>
                              <div className="text-xl font-bold text-green-600">{tier.commission}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Methods</h3>
                      <div className="flex flex-wrap gap-2">
                        {offer.paymentMethods.map((method, index) => (
                          <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Promotional Assets Tab */}
                {activeTab === "assets" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Tracking Link</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={offer.trackingLink}
                            readOnly
                            className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2"
                          />
                          <button
                            onClick={handleCopyTrackingLink}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                          >
                            <FaCopy />
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Banners & Creative</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {offer.promotionalAssets.map((asset, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                            {asset.type === "banner" ? (
                              <img 
                                src={asset.url} 
                                alt={asset.name}
                                className="w-full h-32 object-cover"
                              />
                            ) : (
                              <div className="relative">
                                <img 
                                  src={asset.thumbnail} 
                                  alt={asset.name}
                                  className="w-full h-32 object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                  <FaPlay className="text-white text-2xl" />
                                </div>
                              </div>
                            )}
                            <div className="p-3">
                              <div className="font-medium text-gray-900 mb-2">{asset.name}</div>
                              <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                                <FaDownload />
                                Download
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Tab */}
                {activeTab === "contact" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <FaEnvelope className="text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500">Email</div>
                            <a href={`mailto:${offer.contactInfo.email}`} className="text-blue-600 hover:underline">
                              {offer.contactInfo.email}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaPhone className="text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500">Phone</div>
                            <a href={`tel:${offer.contactInfo.phone}`} className="text-blue-600 hover:underline">
                              {offer.contactInfo.phone}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaGlobeAmericas className="text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500">Website</div>
                            <a href={offer.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {offer.contactInfo.website}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <FaMapMarkerAlt className="text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500">Address</div>
                            <div className="text-gray-900">{offer.contactInfo.address}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleApplyToPromote}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FaRocket />
                  Apply to Promote
                </button>
                <button
                  onClick={handleCopyTrackingLink}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <FaCopy />
                  Copy Tracking Link
                </button>
                <button
                  onClick={handleShareOffer}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <FaShare />
                  Share Offer
                </button>
              </div>
            </div>

            {/* Program Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Commission</span>
                  <span className="font-medium">{offer.commissionStructure.rate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cookie Duration</span>
                  <span className="font-medium">{offer.cookieDuration} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Min Payout</span>
                  <span className="font-medium">${offer.minPayout}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Methods</span>
                  <span className="font-medium">{offer.paymentMethods.length} options</span>
                </div>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trust & Safety</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-green-500" />
                  <span className="text-gray-700">Verified Business</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  <span className="text-gray-700">Secure Payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaChartLine className="text-green-500" />
                  <span className="text-gray-700">Real-Time Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUsers className="text-green-500" />
                  <span className="text-gray-700">{offer.stats.totalAffiliates.toLocaleString()} Active Affiliates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Apply to Promote</h3>
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website/Portfolio
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://yourwebsite.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promotion Methods *
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="How do you plan to promote this offer?"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Traffic (Optional)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 10,000 visitors/month"
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplicationModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AffiliateOfferDetail;
