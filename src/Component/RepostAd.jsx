import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { repostAd } from "../slice/AdModerationSlice";
import { toast } from "react-hot-toast";
import { FaRedo, FaCalendarAlt } from "react-icons/fa";

function RepostAd({ adId, onRepostSuccess }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRepost = async () => {
    setLoading(true);
    try {
      await dispatch(repostAd(adId)).unwrap();
      toast.success("Ad reposted successfully! Date updated to current date.");
      setShowConfirm(false);
      if (onRepostSuccess) {
        onRepostSuccess();
      }
    } catch (error) {
      toast.error("Failed to repost ad. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowConfirm(true)}
        className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-1 rounded flex items-center gap-2 text-sm"
        disabled={loading}
      >
        <FaRedo className={loading ? "animate-spin" : ""} />
        {loading ? "Reposting..." : "Repost"}
      </button>

      {showConfirm && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-card border rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FaCalendarAlt className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Repost Ad</h4>
                <p className="text-sm text-muted-foreground">
                  This will update your ad's posting date to today
                </p>
              </div>
            </div>

            <div className="bg-muted/50 rounded p-3 mb-4">
              <h5 className="font-medium text-foreground mb-2">What happens when you repost:</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ad posting date updates to current date</li>
                <li>• Ad appears as newly posted</li>
                <li>• Ad gets renewed visibility</li>
                <li>• Original ad content is preserved</li>
              </ul>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 text-sm border border-input rounded hover:bg-muted"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleRepost}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Reposting..." : "Confirm Repost"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RepostAd;
