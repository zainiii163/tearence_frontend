import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { repostAd } from "../slice/AdModerationSlice";
import { toast } from "react-hot-toast";
import { FaRedo, FaCalendarAlt, FaLayerGroup } from "react-icons/fa";
import MultiFormatRepostWizard from "./adverts/MultiFormatRepostWizard";

/**
 * Repost: date bump (free refresh) + multi-format expand (Clive).
 */
function RepostAd({ adId, adTitle, adDescription, onRepostSuccess }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showFormats, setShowFormats] = useState(false);

  const handleRepost = async () => {
    setLoading(true);
    try {
      await dispatch(repostAd(adId)).unwrap();
      toast.success("Ad reposted — listing date refreshed.");
      setShowConfirm(false);
      if (onRepostSuccess) onRepostSuccess();
    } catch (error) {
      toast.error("Failed to repost ad. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="bg-primary text-white hover:opacity-95 px-3 py-1 rounded flex items-center gap-2 text-sm"
          disabled={loading}
        >
          <FaRedo className={loading ? "animate-spin" : ""} />
          {loading ? "Reposting..." : "Repost"}
        </button>
        <button
          type="button"
          onClick={() => setShowFormats(true)}
          className="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 px-3 py-1 rounded flex items-center gap-2 text-sm"
        >
          <FaLayerGroup />
          All formats
        </button>
      </div>

      {showConfirm && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-card border rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FaCalendarAlt className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Refresh listing</h4>
                <p className="text-sm text-muted-foreground">
                  Updates this ad&apos;s posting date to today
                </p>
              </div>
            </div>

            <div className="bg-muted/50 rounded p-3 mb-4 text-sm text-muted-foreground space-y-1">
              <p>• Appears as newly posted</p>
              <p>• Content stays the same</p>
              <p>
                Want paid / sponsored / featured / banner / affiliate too? Use{" "}
                <button
                  type="button"
                  className="text-primary font-semibold hover:underline"
                  onClick={() => {
                    setShowConfirm(false);
                    setShowFormats(true);
                  }}
                >
                  All formats
                </button>
                .
              </p>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 text-sm border border-input rounded hover:bg-muted"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRepost}
                className="px-3 py-1 text-sm bg-primary text-white rounded disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Reposting..." : "Confirm refresh"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showFormats && (
        <MultiFormatRepostWizard
          source={{
            id: adId,
            format: "free",
            title: adTitle || "",
            description: adDescription || "",
          }}
          onClose={() => setShowFormats(false)}
        />
      )}
    </div>
  );
}

export default RepostAd;
