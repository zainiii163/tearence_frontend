import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  getPendingAds, 
  detectHarmfulAds, 
  deleteOldAds, 
  approveAd, 
  rejectAd, 
  deleteHarmfulAds, 
  updateAdPosterRole,
  getModerationStats,
  clearError
} from "../slice/AdModerationSlice";
import { toast } from "react-hot-toast";
import { FaTrash, FaCheck, FaTimes, FaEye, FaClock, FaShieldAlt, FaExclamationTriangle } from "react-icons/fa";
import AdminPostCreator from "./AdminPostCreator";

function AdminModerationDashboard() {
  const dispatch = useDispatch();
  const { 
    pendingAds, 
    harmfulAds, 
    stats, 
    loading, 
    error 
  } = useSelector((state) => state.adModeration);
  
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedAd, setSelectedAd] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    dispatch(getPendingAds());
    dispatch(getModerationStats());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleApproveAd = async (adId) => {
    try {
      await dispatch(approveAd(adId)).unwrap();
      toast.success("Ad approved successfully");
      dispatch(getModerationStats());
    } catch (error) {
      toast.error("Failed to approve ad");
    }
  };

  const handleRejectAd = async (adId) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    
    try {
      await dispatch(rejectAd({ adId, reason: rejectionReason })).unwrap();
      toast.success("Ad rejected successfully");
      setRejectionReason('');
      setSelectedAd(null);
      dispatch(getModerationStats());
    } catch (error) {
      toast.error("Failed to reject ad");
    }
  };

  const handleDeleteHarmfulAds = async () => {
    const harmfulAdIds = harmfulAds.map(ad => ad.id);
    if (harmfulAdIds.length === 0) {
      toast.info("No harmful ads to delete");
      return;
    }

    try {
      await dispatch(deleteHarmfulAds(harmfulAdIds)).unwrap();
      toast.success(`Deleted ${harmfulAdIds.length} harmful ads`);
      dispatch(getModerationStats());
    } catch (error) {
      toast.error("Failed to delete harmful ads");
    }
  };

  const handleDeleteOldAds = async () => {
    try {
      const response = await dispatch(deleteOldAds()).unwrap();
      const deletedCount = response.deleted_count || 0;
      toast.success(`Deleted ${deletedCount} ads older than 3 weeks`);
      dispatch(getModerationStats());
    } catch (error) {
      toast.error("Failed to delete old ads");
    }
  };

  const handleUpdatePosterRole = async (adId, role) => {
    try {
      await dispatch(updateAdPosterRole({ adId, posterRole: role })).unwrap();
      toast.success(`Ad marked as ${role}`);
    } catch (error) {
      toast.error("Failed to update poster role");
    }
  };

  const handleDetectHarmfulAds = async () => {
    try {
      await dispatch(detectHarmfulAds()).unwrap();
      toast.success("Harmful ads detection completed");
    } catch (error) {
      toast.error("Failed to detect harmful ads");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Ad Moderation Dashboard</h1>
          <p className="text-muted-foreground">Manage ad approvals, harmful content, and system cleanup</p>
        </div>

        {/* Admin Post Creator */}
        <AdminPostCreator />

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Pending Approval</p>
                <p className="text-2xl font-bold text-foreground">{stats.pending_ads || 0}</p>
              </div>
              <FaClock className="text-yellow-500 text-2xl" />
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Harmful Ads Detected</p>
                <p className="text-2xl font-bold text-foreground">{stats.harmful_ads || 0}</p>
              </div>
              <FaExclamationTriangle className="text-red-500 text-2xl" />
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Old Ads (&gt;3 weeks)</p>
                <p className="text-2xl font-bold text-foreground">{stats.old_ads || 0}</p>
              </div>
              <FaTrash className="text-orange-500 text-2xl" />
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Active Ads</p>
                <p className="text-2xl font-bold text-foreground">{stats.total_ads || 0}</p>
              </div>
              <FaShieldAlt className="text-green-500 text-2xl" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={handleDeleteOldAds}
            className="bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-md flex items-center gap-2"
          >
            <FaTrash />
            Delete Old Ads (&gt;3 weeks)
          </button>
          
          <button
            onClick={handleDetectHarmfulAds}
            className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md flex items-center gap-2"
          >
            <FaExclamationTriangle />
            Detect Harmful Ads
          </button>
          
          {harmfulAds.length > 0 && (
            <button
              onClick={handleDeleteHarmfulAds}
              className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md flex items-center gap-2"
            >
              <FaTrash />
              Delete {harmfulAds.length} Harmful Ads
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-lg shadow">
          <div className="border-b">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Pending Approval ({pendingAds.length})
              </button>
              
              <button
                onClick={() => setActiveTab('harmful')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'harmful'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Harmful Ads ({harmfulAds.length})
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'pending' && (
              <div>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : pendingAds.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No ads pending approval
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingAds.map((ad) => (
                      <div key={ad.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-foreground">{ad.title}</h3>
                            <p className="text-muted-foreground text-sm">{ad.description}</p>
                            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                              <span>Posted: {formatDate(ad.created_at)}</span>
                              <span>Category: {ad.category?.name || ad.category}</span>
                              <span>Price: ${ad.price}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveAd(ad.id)}
                              className="bg-green-500 text-white hover:bg-green-600 px-3 py-1 rounded flex items-center gap-1"
                            >
                              <FaCheck />
                              Approve
                            </button>
                            
                            <button
                              onClick={() => setSelectedAd(ad)}
                              className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded flex items-center gap-1"
                            >
                              <FaTimes />
                              Reject
                            </button>
                            
                            <button
                              onClick={() => window.open(`/ads-detail/${ad.slug}`, '_blank')}
                              className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-1 rounded flex items-center gap-1"
                            >
                              <FaEye />
                              View
                            </button>
                          </div>
                        </div>
                        
                        {/* Admin Poster Role Options */}
                        <div className="flex gap-2 mt-4">
                          <span className="text-sm text-muted-foreground">Mark as:</span>
                          <button
                            onClick={() => handleUpdatePosterRole(ad.id, 'sponsored')}
                            className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 px-2 py-1 rounded"
                          >
                            Sponsored
                          </button>
                          <button
                            onClick={() => handleUpdatePosterRole(ad.id, 'promoted')}
                            className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded"
                          >
                            Promoted
                          </button>
                          <button
                            onClick={() => handleUpdatePosterRole(ad.id, 'admin')}
                            className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-2 py-1 rounded"
                          >
                            Admin Post
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'harmful' && (
              <div>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : harmfulAds.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No harmful ads detected. Click "Detect Harmful Ads" to scan.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {harmfulAds.map((ad) => (
                      <div key={ad.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-red-800">{ad.title}</h3>
                            <p className="text-red-600 text-sm">{ad.description}</p>
                            <div className="mt-2">
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                Reason: {ad.harmful_reason}
                              </span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => window.open(`/ads-detail/${ad.slug}`, '_blank')}
                            className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded flex items-center gap-1"
                          >
                            <FaEye />
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Rejection Modal */}
        {selectedAd && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Reject Ad: {selectedAd.title}</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rejection Reason *</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                  placeholder="Enter reason for rejection..."
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setSelectedAd(null);
                    setRejectionReason('');
                  }}
                  className="px-4 py-2 border border-input rounded-md hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRejectAd(selectedAd.id)}
                  className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md"
                >
                  Reject Ad
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminModerationDashboard;
