import React, { useState, useMemo } from "react";
import GeneralInformation from "./GeneralInformation";
import UpgradeToStore from "./UpgradeToStore";
import UpgradeToBusinessStore from "./UpgradeToBusinessStore";
import { MdAddBusiness, MdHome } from "react-icons/md";
import { FaListUl, FaUser, FaCamera } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import AccountSettings from "./AccountSettings";
import ChangePassword from "./ChangePassword";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, updateUserAvatar } from "../slice/AuthSlice";
import KYCStatusBadge from "./KYCStatusBadge";
import toast from "react-hot-toast";
import { isBusinessAccount, resolveAccountType } from "../utils/accountType";

/** Normalize auth user payload (API may nest under `.data`). */
function pickUserProfile(userDetail) {
  if (!userDetail || typeof userDetail !== "object") return {};
  if (userDetail.data && typeof userDetail.data === "object") {
    return { ...userDetail, ...userDetail.data };
  }
  return userDetail;
}

const AccountInfo = () => {
  const dispatch = useDispatch();

  const rawUserDetail = useSelector((store) => store.auth?.userDetail);
  const authCustomerId = useSelector((store) => store.auth?.customerId);
  const userDetails = useMemo(() => pickUserProfile(rawUserDetail), [rawUserDetail]);
  const businessUser = isBusinessAccount(rawUserDetail);
  const accountType = resolveAccountType(rawUserDetail);

  const displayName =
    [userDetails.first_name, userDetails.last_name].filter(Boolean).join(" ").trim() ||
    userDetails.business_name ||
    userDetails.business_company_name ||
    userDetails.company_name ||
    userDetails.name ||
    userDetails.email ||
    "Account";

  const placeholderImageUrl = "/img/profile.png";
  const [activeSection, setActiveSection] = useState("General Information");
  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };
  const resolvedUserId =
    userDetails?.customer_id ||
    userDetails?.id ||
    authCustomerId ||
    localStorage.getItem("customer_id");

  const updateAvatar = async (file) => {
    if (!resolvedUserId) {
      toast.error("Could not determine your account ID. Please refresh and try again.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await dispatch(
          updateUserAvatar({
            id: resolvedUserId,
            payload: {
              avatar: reader.result,
            },
          })
        ).unwrap();
        toast.success("Data has been updated");
        dispatch(getUserDetails());
      } catch (error) {
        toast.error(error?.message || error);
      }
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar - Profile & Navigation */}
      <div className="lg:col-span-1">
        <div className="sticky top-6 space-y-6">
          {/* Profile Card */}
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="p-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div
                    className="w-24 h-24 rounded-full overflow-hidden border-4 border-border cursor-pointer transition-all group-hover:border-primary"
                    onClick={handleImageClick}
                  >
                    <img
                      src={userDetails?.avatar || placeholderImageUrl}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <FaCamera className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={handleImageClick}>
                    Click to change picture
                  </p>
                </div>
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      updateAvatar(file);
                    }
                  }}
                />
              </div>

              {/* User Info */}
              <div className="text-center mt-6 space-y-3 border-t pt-6">
                <h2 className="text-lg font-semibold text-foreground">{displayName}</h2>
                <div
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    businessUser
                      ? "bg-violet-100 text-violet-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {businessUser ? "BUSINESS" : "CUSTOMER"}
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                  {userDetails?.status || "Active"}
                </div>

                {/* KYC Status Badge */}
                <KYCStatusBadge
                  kycStatus={userDetails?.kyc_status}
                  showLink={true}
                  size="sm"
                />
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="p-2">
              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveSection("General Information")}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeSection === "General Information"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <MdHome className="h-4 w-4" />
                  General Information
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection("Account Settings")}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeSection === "Account Settings"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <FaUser className="h-4 w-4" />
                  Account Settings
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection("Change Password")}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeSection === "Change Password"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <TiTick className="h-4 w-4" />
                  Reset Password
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection("Upgrade to Store")}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeSection === "Upgrade to Store"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <FaListUl className="h-4 w-4" />
                  Upgrade to Store
                </button>
                {/* Already on a business account — do not offer Upgrade to Business */}
                {!businessUser && accountType !== "business" && (
                  <button
                    type="button"
                    onClick={() => setActiveSection("Upgrade to Business Store")}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeSection === "Upgrade to Business Store"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <MdAddBusiness className="h-4 w-4" />
                    Upgrade to Business
                  </button>
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3">
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="p-6">
            {activeSection === "General Information" && <GeneralInformation />}
            {activeSection === "Account Settings" && <AccountSettings />}
            {activeSection === "Change Password" && <ChangePassword />}
            {activeSection === "Upgrade to Store" && <UpgradeToStore />}
            {activeSection === "Upgrade to Business Store" && !businessUser && (
              <UpgradeToBusinessStore />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
