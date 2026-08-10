import {
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import CookieConsent from "react-cookie-consent";
import ErrorBoundary from "./Component/LazyLoading/ErrorBoundary";
import ApiErrorBoundary from "./Component/ErrorBoundary/ApiErrorBoundary";
import RouteFallback from "./Component/LazyLoading/RouteFallback";
import { getUserDetails } from "./slice/AuthSlice";

// Keep App.jsx shell tiny — every route below is code-split
const UserForm = lazy(() => import("./Component/UserForm"));
const AccountPage = lazy(() => import("./Pages/AccountPage"));
const UserDashboard = lazy(() => import("./Pages/UserDashboard"));
const AffiliateDashboard = lazy(() => import("./Pages/AffiliateDashboard"));
const PageNotFound = lazy(() => import("./Pages/PageNotFound"));
const VerifyEmailPage = lazy(() => import("./Pages/VerifyEmailPage"));
const ResetPasswordPage = lazy(() => import("./Pages/ResetPasswordPage"));

// Lazy load marketplace hubs for faster initial paint
const VehiclesPage = lazy(() => import("./Pages/vehicles"));
const VehiclesCategoryPage = lazy(() => import("./Pages/VehiclesCategoryPage"));
const PostVehiclesPage = lazy(() => import("./Pages/post-vehicles"));
const VehicleDetailPage = lazy(() => import("./Pages/vehicle-detail"));
const PostBannerPage = lazy(() => import("./Pages/postbanner"));
const PostServicePage = lazy(() => import("./Pages/post-service"));
const BuySellPage = lazy(() => import("./Pages/buy-sell"));
const BuySellCategoryPage = lazy(() => import("./Pages/BuySellCategoryPage"));
const BuySellItemDetail = lazy(() => import("./Pages/buy-sell-item"));
const PropertyCategoryPage = lazy(() => import("./Pages/PropertyCategoryPage"));
const PropertyRegionPage = lazy(() => import("./Pages/PropertyRegionPage"));
const PropertyCountryPage = lazy(() => import("./Pages/PropertyCountryPage"));
const PropertyDetailPage = lazy(() => import("./Pages/PropertyDetailPage"));
const BusinessRegionPage = lazy(() => import("./Pages/BusinessRegionPage"));
const BusinessCountryPage = lazy(() => import("./Pages/BusinessCountryPage"));
const JobsRegionPage = lazy(() => import("./Pages/JobsRegionPage"));
const JobsCountryPage = lazy(() => import("./Pages/JobsCountryPage"));
const BannerAdvertsPage = lazy(() => import("./Pages/banner-adverts"));
const ServicesPage = lazy(() => import("./Pages/ServicesPage"));
const ServicesCategoryPage = lazy(() => import("./Pages/ServicesCategoryPage"));
const ServiceDetailPage = lazy(() => import("./Pages/ServiceDetailPage"));
const CalculatorsPage = lazy(() => import("./Pages/CalculatorsPage"));
const VerticalTemplatesPage = lazy(() => import("./Pages/VerticalTemplatesPage"));
const VerticalCalculatorsPage = lazy(() => import("./Pages/VerticalCalculatorsPage"));

// Lazy load less frequently used components
const ClassifiedsCategoryPage = lazy(() => import("./Pages/ClassifiedsCategoryPage"));
const Homepage = lazy(() => import("./Pages/Homepage"));
const SponsoredPage = lazy(() => import("./Pages/sponsored"));
const SponsoredAdvertsPage = lazy(() => import("./Pages/sponsored-adverts"));
const SponsoredCategoryPage = lazy(() => import("./Pages/SponsoredCategoryPage"));
const SponsoredAdvertDetailPage = lazy(() => import("./Pages/SponsoredAdvertDetailPage"));
const PromotedAdvertsPage = lazy(() => import("./Pages/promoted-adverts"));
const PromotedCategoryPage = lazy(() => import("./Pages/PromotedCategoryPage"));
const BannerCategoryPage = lazy(() => import("./Pages/BannerCategoryPage"));
const FeaturedCategoryPage = lazy(() => import("./Pages/FeaturedCategoryPage"));
const AdsPolicies = lazy(() => import("./Component/FooterPages/AdsPolicies"));
const TermsOfUse = lazy(() => import("./Component/FooterPages/TermsOfUse"));
const TermAndCondition = lazy(() => import("./Component/FooterPages/TermAndCondition"));
const PrivacyPolicy = lazy(() => import("./Component/FooterPages/PrivacyPolicy"));
const Disclaimer = lazy(() => import("./Component/FooterPages/Disclaimer"));
const CookiePolicy = lazy(() => import("./Component/FooterPages/CookiePolicy"));
const UserAgreement = lazy(() => import("./Component/FooterPages/UserAgreement"));
const DataProtection = lazy(() => import("./Component/FooterPages/DataProtection"));
const LawsRegulation = lazy(() => import("./Component/FooterPages/LawsRegulation"));
const Help = lazy(() => import("./Component/FooterPages/Help"));
const Company = lazy(() => import("./Component/FooterPages/Company"));
const InternProgram = lazy(() => import("./Component/FooterPages/InternProgram"));
const Contact = lazy(() => import("./Component/FooterPages/Contact"));
const AboutUs = lazy(() => import("./Component/FooterPages/AboutUs"));
const CareerWithUs = lazy(() => import("./Component/FooterPages/CareerWithUs"));
const Blog = lazy(() => import("./Component/FooterPages/Blog"));
const AboutBusiness = lazy(() => import("./Component/FooterPages/AboutBusiness"));
const Developer = lazy(() => import("./Component/FooterPages/Developer"));
const NewAdsPage = lazy(() => import("./Pages/NewAdsPage"));
const ClassifiedAdsPage = lazy(() => import("./Pages/ClassifiedAdsPage"));
const PostRouter = lazy(() => import("./Component/PostAds/PostRouter"));
const PostBanner = lazy(() => import("./Component/AdManagement/BannerAdPostForm"));
const PostAffiliate = lazy(() => import("./Pages/PostAffiliateProgramPage"));
const PostClassified = lazy(() => import("./Component/PostAds/PostClassified"));
const PostItems = lazy(() => import("./Component/PostAds/PostItems"));
const FeaturedAdvertPostingForm = lazy(() => import("./Component/featured/FeaturedPostForm"));
const InvestingPage = lazy(() => import("./Pages/InvestingPage"));
const BusinessesForSaleCategoryPage = lazy(() => import("./Pages/BusinessesForSaleCategoryPage"));
const BusinessCategoryDashboardHub = lazy(() => import("./Component/Business/BusinessCategoryDashboardHub"));
const BusinessCategoryDashboard = lazy(() => import("./Component/Business/BusinessCategoryDashboard"));
const FavoriteAdsPage = lazy(() => import("./Pages/FavoriteAdsPage"));
const AdsDetail = lazy(() => import("./Component/DetailsPages/AdsDetail"));
const BusinessPage = lazy(() => import("./Pages/BusinessPage"));
const BusinessForm = lazy(() => import("./Component/Business/BusinessForm"));
const BusinessDetailPage = lazy(() => import("./Pages/BusinessDetailPage"));
const ClasifiedsPage = lazy(() => import("./Pages/ClasifiedsPage"));
const PaymentPage = lazy(() => import("./Component/PaymentPage"));
const PostCharities = lazy(() => import("./Component/PostAds/PostCharities"));
const EbayAds = lazy(() => import("./Component/EbayAds"));
const FavouriteAdsDetail = lazy(() => import("./Component/DetailsPages/FavouriteAdsDetail"));
const AllSearchResultPage = lazy(() => import("./Pages/AllSearchResultPage"));
const BlogDetail = lazy(() => import("./Component/DetailsPages/BlogDetail"));
const MyStore = lazy(() => import("./Pages/MyStore"));
const AffiliatesPage = lazy(() => import("./Pages/affiliates"));
const AffiliateOfferDetailPage = lazy(() => import("./Pages/AffiliateOfferDetailPage"));
const AffiliatesLinksPage = lazy(() => import("./Pages/AffiliatesLinksPage"));
const CategoryMenyPage = lazy(() => import("./Pages/AllCategoryPage"));
const CategoryPage = lazy(() => import("./Pages/CategoryPage"));
const BusinessStore = lazy(() => import("./Pages/BusinessStore"));
const PostNewAds = lazy(() => import("./Component/PostNewAds"));
const BusinessCategoryPage = lazy(() => import("./Pages/BusinessCategoryPage"));
const BusinessAdsPage = lazy(() => import("./Pages/BusinessAdsPage"));
const StoresPage = lazy(() => import("./Pages/StoresPage"));
const AdvertsHubPage = lazy(() => import("./Pages/AdvertsHubPage"));
const StoreDetailPage = lazy(() => import("./Pages/StoreDetailPage"));
const ExampleStorePage = lazy(() => import("./Pages/ExampleStorePage"));
const MyFeatureAdsPage = lazy(() => import("./Pages/MyFeatureAdsPage"));
const MyPromotedAdsPage = lazy(() => import("./Pages/MySponsoredAdsPage"));
const MyClassifiedAdsPage = lazy(() => import("./Pages/MyClassifiedAdsPage"));
const MyNewAdsPage = lazy(() => import("./Pages/MyNewAdsPage"));
const ChatPage = lazy(() => import("./Component/Chat/ChatPage"));
const JobsPage = lazy(() => import("./Pages/jobs"));
const JobsVacanciesPage = lazy(() => import("./Pages/JobsVacanciesPage"));
const JobsSeekersBrowsePage = lazy(() => import("./Pages/JobsSeekersBrowsePage"));
const JobsPostPage = lazy(() => import("./Pages/JobsPostPage"));
const JobDetailPage = lazy(() => import("./Pages/JobDetailPage"));
const JobSeekerDetailPage = lazy(() => import("./Pages/JobSeekerDetailPage"));
const SuperAdminDashboard = lazy(() => import("./Pages/SuperAdminDashboard"));
const AdminTeamsRolesCta = lazy(() => import("./Pages/AdminTeamsRolesCta"));
const KYCVerification = lazy(() => import("./Component/KYCVerification"));
const AdminModerationDashboard = lazy(() => import("./Component/AdminModerationDashboard"));
// Funding Hub - NEW IMPLEMENTATION
const FundingHub = lazy(() => import("./Pages/funding"));
const FundingDashboard = lazy(() => import("./Pages/funding-dashboard"));
const FundingProjects = lazy(() => import("./Pages/funding-projects"));

// Missing components
const PropertyMarketplacePage = lazy(() => import("./Pages/property/index"));

// Books API components - NEW IMPLEMENTATION
const BooksPage = lazy(() => import("./Pages/books"));
const BooksCategoryPage = lazy(() => import("./Pages/BooksCategoryPage"));

// Donations Page - NEW IMPLEMENTATION
const DonationsPage = lazy(() => import("./Pages/DonationsPage"));

// Communities Page - NEW IMPLEMENTATION
const CommunitiesPage = lazy(() => import("./Pages/communities"));

// Travel component - NEW IMPLEMENTATION
const ResortsTravelPage = lazy(() => import("./Pages/resorts-travel"));

// Stock Images & Media component - NEW IMPLEMENTATION
const ImagesPage = lazy(() => import("./Pages/images"));
const SoftwarePage = lazy(() => import("./Pages/software"));
const SoftwareDetailPage = lazy(() => import("./Pages/SoftwareDetailPage"));
const VideoTemplatesBrowsePage = lazy(() => import("./Component/images/VideoTemplatesBrowsePage"));
const PostImagesPage = lazy(() => import("./Pages/postimages"));
const ImageDetailPage = lazy(() => import("./Pages/image-detail"));

// Events & Venues component - NEW IMPLEMENTATION
const EventsVenuesPage = lazy(() => import("./Pages/events-venues"));
const EventsBrowsePage = lazy(() => import("./Pages/EventsBrowsePage"));
const VenuesBrowsePage = lazy(() => import("./Pages/VenuesBrowsePage"));
const EventsCategoryPage = lazy(() => import("./Pages/EventsCategoryPage"));
const VenuesCategoryPage = lazy(() => import("./Pages/VenuesCategoryPage"));
const EventsVenuesPostForm = lazy(() => import("./Component/events-venues/EventsVenuesPostForm"));
const EventsVenuesDetailPage = lazy(() => import("./Pages/EventsVenuesDetailPage"));
const PromotedAdvertDetailPage = lazy(() => import("./Pages/PromotedAdvertDetailPage"));

// Affiliate Dashboard component - NEW IMPLEMENTATION
// Already imported above

// Featured Adverts component - NEW IMPLEMENTATION
const FeaturedPage = lazy(() => import("./Pages/featured"));

// Posting forms
const SubcategoryPostingForm = lazy(() => import("./Component/PostAds/SubcategoryPostingForm"));
const DynamicCategoryPostingForm = lazy(() => import("./Component/PostAds/DynamicCategoryPostingForm"));
const BusinessStorePage = lazy(() => import("./Pages/BusinessStorePage"));

// Referral System components
const ReferralInvitation = lazy(() => import("./Component/Referral/ReferralInvitation"));
const ReferralDashboard = lazy(() => import("./Component/Referral/ReferralDashboard"));
const PostAffiliateProgramPage = lazy(() => import("./Pages/PostAffiliateProgramPage"));
const PostPromotedAdPage = lazy(() => import("./Pages/PostPromotedAdPage"));
const ProtectedRoute = ({ children }) => {
  const { logIn, token } = useSelector((store) => store.auth);
  
  // More flexible authentication check - accept either logIn state OR token presence
  const isAuthenticated = logIn === true || token;
  
  if (!isAuthenticated) {
    return <Navigate to="/Login" />;
  }

  return children;
};

const EmailVerifiedRoute = ({ children }) => {
  const { logIn, token, userDetail } = useSelector((store) => store.auth);
  
  const isAuthenticated = logIn === true || token;
  
  if (!isAuthenticated) {
    return <Navigate to="/Login" />;
  }

  // Clive: posting routes require email verification (signup itself stays open).
  const emailVerified = Boolean(
    userDetail?.email_verified_at ||
      userDetail?.email_verified ||
      userDetail?.customer?.email_verified_at
  );

  if (!emailVerified) {
    return <Navigate to="/verify-email" replace state={{ from: 'post' }} />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { logIn, userDetail } = useSelector((store) => store.auth);

  // Check authentication status on app load - highly resilient to API failures
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Only check if we have a token in localStorage but no user details in Redux
        const hasToken = localStorage.getItem('token');
        const hasUserDetails = userDetail?.data;
        const hasUserDetailInStorage = localStorage.getItem('user');
        
        if (hasToken && !hasUserDetails && hasUserDetailInStorage) {
          // Rehydrate Redux state from localStorage
          try {
            const parsedUserDetail = JSON.parse(hasUserDetailInStorage);
            dispatch({
              type: 'auth/setRehydrated',
              payload: {
                logIn: true,
                userDetail: parsedUserDetail,
                customerId: parsedUserDetail?.customer_id || localStorage.getItem('customer_id'),
                token: hasToken
              }
            });
          } catch (error) {
            console.warn('Failed to rehydrate user details:', error);
          }
        } else if (hasToken && !hasUserDetails) {
          try {
            await dispatch(getUserDetails()).unwrap();
          } catch (userDetailsError) {
            console.warn('Failed to fetch user details on app load:', userDetailsError);
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error.message);
        
        // Enhanced error handling - preserve auth state for most errors
        const errorMessage = error.message || '';
        const isServerError = error.isServerError || error.preserveAuth;
        const isNetworkError = error.status === 0 || errorMessage.includes('Network');
        
        // Only clear on definite auth failures, preserve for everything else
        if (errorMessage.includes('Unauthenticated') || 
            errorMessage.includes('Invalid token') ||
            errorMessage.includes('Token expired') ||
            errorMessage.includes('Authentication failed')) {
          localStorage.removeItem('token');
          localStorage.removeItem("customer_id");
          localStorage.removeItem("user");
        } else if (isServerError || isNetworkError) {
          // Don't clear auth state - user might still be valid
        }
      }
    };
    
    // Run once on app load, but prevent re-runs when userDetail changes
    if (!userDetail) {
      checkAuthentication();
    }
  }, [dispatch, userDetail]); // eslint-disable-line react-hooks/exhaustive-deps

  // Removed redundant useEffect - JWT auth doesn't need session checks

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change
  
  return (
    <ApiErrorBoundary>
      <ErrorBoundary>
        <CookieConsent
          location="bottom"
          buttonText="I Accept"
          declineButtonText="Decline"
          cookieName="cookieConcent"
          style={{ background: "hsl(var(--card))", color: "hsl(var(--card-foreground))", borderTop: "1px solid hsl(var(--border))" }}
          containerClasses="p-4 flex items-center justify-between"
          buttonClasses="ml-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4"
        >
          <div>
            <h1>Cookies used on the website!</h1>
            <span>
              This website uses cookies to ensure you get the best experience on
              our website.{" "}
              <a href="/help/ads-policies" className="text-primary hover:text-primary/80 underline">
                Find out more
              </a>
            </span>
          </div>
        </CookieConsent>

        <Suspense fallback={<RouteFallback />}>
          <Routes>
          <>
            <Route path="/" Component={Homepage} />
            <Route path="/jobs" Component={JobsPage} />
            <Route path="/jobs-section" Component={JobsPage} />
            <Route path="/jobs/vacancies" Component={JobsVacanciesPage} />
            <Route
              path="/jobs/vacancies/region/:continentId"
              element={<JobsRegionPage mode="vacancies" />}
            />
            <Route
              path="/jobs/vacancies/country/:countrySlug"
              element={<JobsCountryPage mode="vacancies" />}
            />
            <Route path="/jobs/seekers" Component={JobsSeekersBrowsePage} />
            <Route
              path="/jobs/seekers/region/:continentId"
              element={<JobsRegionPage mode="seekers" />}
            />
            <Route
              path="/jobs/seekers/country/:countrySlug"
              element={<JobsCountryPage mode="seekers" />}
            />
            <Route path="/jobs/seekers/:id" Component={JobSeekerDetailPage} />
            <Route path="/jobs/region/:continentId" element={<JobsRegionPage mode="home" />} />
            <Route path="/jobs/country/:countrySlug" element={<JobsCountryPage mode="home" />} />
            <Route path="/jobs/templates" element={<VerticalTemplatesPage vertical="jobs" />} />
            <Route path="/jobs/calculators" element={<VerticalCalculatorsPage vertical="jobs" />} />
            {logIn ? (
              <Route
                path="/jobs/post"
                element={
                  <EmailVerifiedRoute>
                    <JobsPostPage />
                  </EmailVerifiedRoute>
                }
              />
            ) : (
              <Route path="/jobs/post" element={<Navigate to="/Login" />} />
            )}
            <Route path="/jobs/:id" Component={JobDetailPage} />
            <Route path="/jobs-marketplace" Component={JobsPage} />
            <Route path="/job-seekers" element={<Navigate to="/jobs/seekers" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
          />
          <Route
            path="/affiliate-dashboard"
            element={
              <ProtectedRoute>
                <AffiliateDashboard />
              </ProtectedRoute>
            }
          />
          {logIn ? (
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/admin/dashboard" element={<Navigate to="/Login" />} />
          )}
          {logIn ? (
            <Route
              path="/admin/moderation"
              element={
                <ProtectedRoute>
                  <AdminModerationDashboard />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/admin/moderation" element={<Navigate to="/Login" />} />
          )}
          {/* Admin Routes - Content Management */}
          {logIn ? (
            <Route
              path="/admin/jobs"
              element={
                <ProtectedRoute>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/admin/jobs" element={<Navigate to="/Login" />} />
          )}
          {logIn ? (
            <Route
              path="/admin/candidates"
              element={
                <ProtectedRoute>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/admin/candidates" element={<Navigate to="/Login" />} />
          )}
          {logIn ? (
            <Route
              path="/admin/events"
              element={
                <ProtectedRoute>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/admin/events" element={<Navigate to="/Login" />} />
          )}
          {logIn ? (
            <Route
              path="/admin/venues"
              element={
                <ProtectedRoute>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/admin/venues" element={<Navigate to="/Login" />} />
          )}
          {logIn ? (
            <Route
              path="/admin/properties"
              element={
                <ProtectedRoute>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/admin/properties" element={<Navigate to="/Login" />} />
          )}
          {logIn ? (
            <Route
              path="/admin/templates"
              element={
                <ProtectedRoute>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/admin/templates" element={<Navigate to="/Login" />} />
          )}
          {logIn ? (
            <Route
              path="/admin/images"
              element={
                <ProtectedRoute>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/admin/images" element={<Navigate to="/Login" />} />
          )}
          {logIn ? (
            <Route
              path="/admin/services"
              element={
                <ProtectedRoute>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/admin/services" element={<Navigate to="/Login" />} />
          )}
          {logIn ? (
            <Route
              path="/admin/funding"
              element={
                <ProtectedRoute>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/admin/funding" element={<Navigate to="/Login" />} />
          )}
          {/* Admin Routes - User Management */}
          {logIn ? (
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/admin/users" element={<Navigate to="/Login" />} />
          )}
          {logIn ? (
            <Route
              path="/admin/roles"
              element={
                <ProtectedRoute>
                  <AdminTeamsRolesCta />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/admin/roles" element={<Navigate to="/Login" />} />
          )}
          {logIn ? (
            <Route
              path="/admin/user-analytics"
              element={
                <ProtectedRoute>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/admin/user-analytics" element={<Navigate to="/Login" />} />
          )}
          {/* Admin Routes - Moderation */}
          {logIn ? (
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute>
                  <AdminModerationDashboard />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/admin/reports" element={<Navigate to="/Login" />} />
          )}
          {logIn ? (
            <Route
              path="/admin/category-posts"
              element={
                <ProtectedRoute>
                  <AdminModerationDashboard />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/admin/category-posts" element={<Navigate to="/Login" />} />
          )}
          {/* Admin Routes - Analytics */}
          {logIn ? (
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/admin/analytics" element={<Navigate to="/Login" />} />
          )}
          {logIn ? (
            <Route
              path="/admin/revenue"
              element={
                <ProtectedRoute>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/admin/revenue" element={<Navigate to="/Login" />} />
          )}
          {logIn ? (
            <Route
              path="/admin/listing-analytics"
              element={
                <ProtectedRoute>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/admin/listing-analytics" element={<Navigate to="/Login" />} />
          )}
          {/* Admin Routes - System */}
          {logIn ? (
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/admin/settings" element={<Navigate to="/Login" />} />
          )}
          {logIn ? (
            <Route
              path="/admin/maintenance"
              element={
                <ProtectedRoute>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/admin/maintenance" element={<Navigate to="/Login" />} />
          )}
          {logIn ? (
            <Route
              path="/admin/notifications"
              element={
                <ProtectedRoute>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/admin/notifications" element={<Navigate to="/Login" />} />
          )}
          {logIn ? (
            <Route
              path="/kyc-verification"
              element={
                <ProtectedRoute>
                  <KYCVerification />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/kyc-verification" element={<Navigate to="/Login" />} />
          )}
          <Route path="/category-menu" Component={CategoryMenyPage} />
          <Route path="/adverts" Component={AdvertsHubPage} />
          <Route path="/advertising" element={<Navigate to="/adverts" replace />} />
          <Route path="/sponsored" element={<Navigate to="/sponsored-adverts" replace />} />
          <Route path="/sponsored/:slug" Component={SponsoredAdvertDetailPage} />
          <Route path="/sponsored-adverts" Component={SponsoredAdvertsPage} />
          <Route path="/sponsored-adverts/category/:categoryId" Component={SponsoredCategoryPage} />
          <Route path="/sponsored-adverts/:slug" Component={SponsoredAdvertDetailPage} />
          <Route path="/banner-adverts" Component={BannerAdvertsPage} />
          <Route path="/banner-adverts/category/:categoryId" Component={BannerCategoryPage} />
          <Route path="/banner" element={<Navigate to="/banner-adverts" replace />} />
          <Route path="/promoted" element={<Navigate to="/promoted-adverts" replace />} />
          <Route path="/promoted-adverts" Component={PromotedAdvertsPage} />
          <Route path="/promoted-adverts/category/:categoryId" Component={PromotedCategoryPage} />
          <Route path="/promoted-adverts/:slug" Component={PromotedAdvertDetailPage} />
          <Route path="/featured-ads" Component={FeaturedPage} />
          <Route path="/classifieds-ads" Component={ClassifiedAdsPage} />
          <Route path="/classifieds-ads/category/:categoryId" Component={ClassifiedsCategoryPage} />
          <Route path="/classifieds-ads/templates" element={<VerticalTemplatesPage vertical="classifieds" />} />
          <Route path="/classifieds-ads/calculators" element={<VerticalCalculatorsPage vertical="classifieds" />} />
          <Route path="/classified" element={<Navigate to="/classifieds-ads" replace />} />
          <Route path="/postclassified" element={<Navigate to="/classifieds-ads?postForm=true" replace />} />
          <Route path="/new-ads" Component={NewAdsPage} />
          <Route path="/ebay-ads" Component={EbayAds} />
          <Route path="/businesses-for-sale" Component={InvestingPage} />
          <Route path="/businesses-for-sale/category/:categoryId" Component={BusinessesForSaleCategoryPage} />
          <Route path="/businesses-for-sale/templates" element={<VerticalTemplatesPage vertical="businesses-for-sale" />} />
          <Route path="/businesses-for-sale/calculators" element={<VerticalCalculatorsPage vertical="businesses-for-sale" />} />
          <Route path="/businesses-for-sale/:slug" Component={SponsoredAdvertDetailPage} />
          <Route path="/investment-category" element={<Navigate to="/businesses-for-sale" replace />} />
          <Route path="/ads-detail/:slug" Component={AdsDetail} />
          <Route path="/favourite-ads/:id" Component={FavouriteAdsDetail} />
          <Route path="/favorite-ads" Component={FavoriteAdsPage} />
          <Route
            path="/search-results/:searchValue"
            Component={AllSearchResultPage}
          />
          <Route
            path="/search-results/:searchValue/:category"
            Component={AllSearchResultPage}
          />
          <Route path="/affiliate" Component={AffiliatesPage} />
          <Route path="/affiliates" Component={AffiliatesPage} />
          <Route path="/affiliates/links" Component={AffiliatesLinksPage} />
          <Route path="/affiliates-hub" Component={AffiliatesPage} />
          <Route path="/affiliate-hub" Component={AffiliatesPage} />
          <Route path="/affiliates/offer/:id" Component={AffiliateOfferDetailPage} />
          <Route path="/affiliate/offer/:id" Component={AffiliateOfferDetailPage} />
          {logIn ? (
            <Route
              path="/affiliate/dashboard"
              element={
                <ProtectedRoute>
                  <AffiliateDashboard />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/affiliate/dashboard" element={<Navigate to="/Login" />} />
          )}
          <Route path="/vehicles" Component={VehiclesPage} />
          <Route path="/vehicles-marketplace" Component={VehiclesPage} />
          <Route path="/vehicles/category/:categoryType" Component={VehiclesCategoryPage} />
          <Route path="/vehicles/templates" element={<VerticalTemplatesPage vertical="vehicles" />} />
          <Route path="/vehicles/calculators" element={<VerticalCalculatorsPage vertical="vehicles" />} />
          <Route path="/vehicles/:id" Component={VehicleDetailPage} />
          <Route path="/vehicle/:id" Component={VehicleDetailPage} />
                    
          <Route path="/buy-sell" Component={BuySellPage} />
          <Route path="/buy-sell/category/:categoryId" Component={BuySellCategoryPage} />
          <Route path="/buy-sell/templates" element={<VerticalTemplatesPage vertical="buy-sell" />} />
          <Route path="/buy-sell/calculators" element={<VerticalCalculatorsPage vertical="buy-sell" />} />
          <Route path="/item/:id" Component={BuySellItemDetail} />
          {/* Services & Solutions Routes */}
          <Route path="/services" Component={ServicesPage} />
          <Route path="/services-marketplace" Component={ServicesPage} />
          <Route path="/services/category/:categoryId" Component={ServicesCategoryPage} />
          <Route path="/services/category/:groupId/:subId" Component={ServicesCategoryPage} />
          <Route path="/services/calculators" element={<VerticalCalculatorsPage vertical="services" />} />
          <Route path="/services/templates" element={<VerticalTemplatesPage vertical="services" />} />
          <Route path="/services/:id" Component={ServiceDetailPage} />
          <Route path="/calculators" Component={CalculatorsPage} />
          <Route path="/calculator" element={<Navigate to="/calculators" replace />} />

          {/* NEW Books & Literature Routes */}
          <Route path="/books" Component={BooksPage} />
          <Route path="/books/category/:genreId" Component={BooksCategoryPage} />
          <Route path="/books/templates" element={<VerticalTemplatesPage vertical="books" />} />
          <Route path="/books/calculators" element={<VerticalCalculatorsPage vertical="books" />} />
          <Route path="/books/create" Component={BooksPage} />
          <Route path="/books/:slug" Component={BooksPage} />
          <Route path="/books-marketplace" Component={BooksPage} />
          <Route path="/book-marketplace" Component={BooksPage} />
          <Route path="/books/dashboard" element={<Navigate to="/dashboard" replace />} />
          <Route path="/post-book" element={<Navigate to="/books?postForm=true" replace />} />
          <Route path="/property" Component={PropertyMarketplacePage} />
          <Route path="/property/post" element={<Navigate to="/property?postForm=true" replace />} />
          <Route path="/property/category/:categoryId" Component={PropertyCategoryPage} />
          <Route path="/property/region/:continentId" Component={PropertyRegionPage} />
          <Route path="/property/country/:countrySlug" Component={PropertyCountryPage} />
          <Route path="/property/templates" element={<VerticalTemplatesPage vertical="property" />} />
          <Route path="/property/calculators" element={<VerticalCalculatorsPage vertical="property" />} />
          <Route path="/property/:id" Component={PropertyDetailPage} />
          <Route path="/real-estate" Component={PropertyMarketplacePage} />
          <Route path="/properties" Component={PropertyMarketplacePage} />
          <Route path="/property-marketplace" Component={PropertyMarketplacePage} />
          {/* <Route path="/subscription" Component={Subscription} /> */}
          <Route path="/help/ads-policies" Component={AdsPolicies} />
          <Route path="/help/terms-of-use" Component={TermsOfUse} />
          <Route
            path="/help/terms-and-condition"
            Component={TermAndCondition}
          />
          <Route path="/help/privacy-policy" Component={PrivacyPolicy} />
          <Route path="/help/disclaimer" Component={Disclaimer} />
          <Route path="/help/cookie-policy" Component={CookiePolicy} />
          <Route path="/help/user-agreement" Component={UserAgreement} />
          <Route path="/help/data-protection" Component={DataProtection} />
          <Route path="/help/laws-regulations" Component={LawsRegulation} />
          <Route path="/help/help" Component={Help} />
          {/* About us  */}
          <Route path="/about/company" Component={Company} />
          <Route path="/about/business" Component={AboutBusiness} />
          <Route path="/about/intern-program" Component={InternProgram} />
          <Route path="/about/contact" Component={Contact} />
          <Route path="/about/about-us" Component={AboutUs} />
          <Route path="/about/career-with-us" Component={CareerWithUs} />
          <Route path="/about/developer" Component={Developer} />
          <Route path="/blog" Component={Blog} />
          <Route path="/blog/:id" Component={BlogDetail} />

          {/* Events & Venues Routes - Must come before dynamic category routes */}
          <Route path="/events-venues" Component={EventsVenuesPage} />
          <Route path="/events-venues/events" Component={EventsBrowsePage} />
          <Route path="/events-venues/venues" Component={VenuesBrowsePage} />
          <Route path="/events-venues/events/category/:categoryId" Component={EventsCategoryPage} />
          <Route path="/events-venues/venues/category/:categoryId" Component={VenuesCategoryPage} />
          {logIn ? (
            <Route
              path="/events-venues/post"
              element={
                <EmailVerifiedRoute>
                  <EventsVenuesPostForm />
                </EmailVerifiedRoute>
              }
            />
          ) : (
            <Route path="/events-venues/post" element={<Navigate to="/Login" />} />
          )}
          <Route path="/events-venues/:slug" Component={EventsVenuesDetailPage} />

          <Route path="/category/events/*" Component={CategoryPage} />
          <Route path="/category/:slug" Component={CategoryPage} />

          {/* Post Ad Route */}
          <Route path="/post-ad" Component={PostNewAds} />

          {/* post new add buttons routes - using EmailVerifiedRoute instead of KYC */}
          <Route
            path="/post/:slug/:id"
            element={
              <EmailVerifiedRoute>
                <PostRouter />
              </EmailVerifiedRoute>
            }
          />
          <Route
            path="/postbanner"
            element={
              <EmailVerifiedRoute>
                <PostBannerPage />
              </EmailVerifiedRoute>
            }
          />
          <Route
            path="/postaffiliate"
            element={
              <EmailVerifiedRoute>
                <PostAffiliate />
              </EmailVerifiedRoute>
            }
          />
          <Route path="/postclassified" element={<Navigate to="/classifieds-ads?postForm=true" replace />} />
          <Route
            path="/postvehicles"
            element={
              <EmailVerifiedRoute>
                <PostVehiclesPage />
              </EmailVerifiedRoute>
            }
          />
          <Route
            path="/post-vehicles"
            element={
              <EmailVerifiedRoute>
                <PostVehiclesPage />
              </EmailVerifiedRoute>
            }
          />
          <Route
            path="/postitems"
            element={
              <EmailVerifiedRoute>
                <PostItems />
              </EmailVerifiedRoute>
            }
          />
          <Route
            path="/post-property"
            element={
              <EmailVerifiedRoute>
                <Navigate to="/property?postForm=true" replace />
              </EmailVerifiedRoute>
            }
          />
          <Route
            path="/post-service"
            element={
              <EmailVerifiedRoute>
                <PostServicePage />
              </EmailVerifiedRoute>
            }
          />
          {logIn ? (
            <Route
              path="/post-featured-advert"
              element={
                <EmailVerifiedRoute>
                  <FeaturedAdvertPostingForm />
                </EmailVerifiedRoute>
              }
            />
          ) : (
            <Route path="/post-featured-advert" element={<Navigate to="/Login" />} />
          )}
          {/* Resorts & Travel Routes */}
          <Route path="/resorts-travel" Component={ResortsTravelPage} />
          <Route path="/resorts-travel/:slug" Component={ResortsTravelPage} />
          <Route path="/resorts" Component={ResortsTravelPage} />
          <Route path="/travel" Component={ResortsTravelPage} />
          <Route path="/travel-marketplace" Component={ResortsTravelPage} />
          <Route path="/resorts-marketplace" Component={ResortsTravelPage} />
          
          {/* Stock Images & Media Routes */}
          <Route path="/images" Component={ImagesPage} />
          <Route path="/stock-images" Component={ImagesPage} />
          <Route path="/images-marketplace" Component={ImagesPage} />
          <Route path="/images/videos" Component={VideoTemplatesBrowsePage} />
          <Route path="/video-templates" Component={VideoTemplatesBrowsePage} />
          <Route path="/software" Component={SoftwarePage} />
          <Route path="/software/:id" Component={SoftwareDetailPage} />
          <Route path="/software-marketplace" Component={SoftwarePage} />
          <Route path="/code" Component={SoftwarePage} />
          <Route path="/code/:id" Component={SoftwareDetailPage} />
          <Route path="/images/:slug" Component={ImageDetailPage} />
          {logIn ? (
            <Route
              path="/post-images"
              element={
                <EmailVerifiedRoute>
                  <PostImagesPage />
                </EmailVerifiedRoute>
              }
            />
          ) : (
            <Route path="/post-images" element={<Navigate to="/Login" />} />
          )}
          
          {/* Featured Adverts Routes */}
          <Route path="/featured" Component={FeaturedPage} />
          <Route path="/featured-adverts" Component={FeaturedPage} />
          <Route path="/featured-adverts/category/:categoryId" Component={FeaturedCategoryPage} />
          <Route path="/featured-adverts/:id" Component={lazy(() => import("./Pages/FeaturedAdvertDetailPage"))} />
          <Route path="/featured-marketplace" Component={FeaturedPage} />
          {logIn ? (
            <Route
              path="/post/:category/:subcategory"
              element={
                <EmailVerifiedRoute>
                  <SubcategoryPostingForm />
                </EmailVerifiedRoute>
              }
            />
          ) : (
            <Route path="/post/:category/:subcategory" element={<Navigate to="/Login" />} />
          )}
          {logIn ? (
            <Route
              path="/post/:category"
              element={
                <EmailVerifiedRoute>
                  <DynamicCategoryPostingForm />
                </EmailVerifiedRoute>
              }
            />
          ) : (
            <Route path="/post/:category" element={<Navigate to="/Login" />} />
          )}
          <Route
            path="/business-store/:slug"
            element={<BusinessStorePage />}
          />
          {logIn ? (
            <Route
              path="/my-featured-ads"
              element={
                <ProtectedRoute>
                  <MyFeatureAdsPage />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/my-featured-ads" element={<UserForm />} />
          )}
          {logIn ? (
            <Route
              path="/my-sponsored-ads"
              element={
                <ProtectedRoute>
                  <MyPromotedAdsPage />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/my-sponsored-ads" element={<Navigate to="/Login" />} />
          )}
          {logIn ? (
            <Route
              path="/my-classified-ads"
              element={
                <ProtectedRoute>
                  <MyClassifiedAdsPage />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/my-classified-ads" element={<UserForm />} />
          )}

          {logIn ? (
            <Route
              path="/my-new-ads"
              element={
                <ProtectedRoute>
                  <MyNewAdsPage />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/my-new-ads" element={<UserForm />} />
          )}

          <Route path="/business" Component={BusinessPage} />
          <Route path="/business-page" Component={BusinessPage} />
          <Route path="/business/region/:continentId" Component={BusinessRegionPage} />
          <Route path="/business/country/:countrySlug" Component={BusinessCountryPage} />
          <Route path="/business/templates" element={<VerticalTemplatesPage vertical="business" />} />
          <Route path="/business/calculators" element={<VerticalCalculatorsPage vertical="business" />} />
          <Route path="/business/create" Component={BusinessForm} />
          <Route path="/business/category/:categoryName" Component={BusinessCategoryPage} />
          <Route path="/business/category/:categoryName/:subcategoryName" Component={BusinessCategoryPage} />
          <Route path="/business/:id/edit" Component={BusinessForm} />
          <Route path="/business/:id" Component={BusinessDetailPage} />
          <Route path="/stores" Component={StoresPage} />
          <Route path="/online-stores" Component={StoresPage} />
          <Route path="/ecommerce" Component={StoresPage} />
          <Route path="/business-store" Component={BusinessStore} />
          <Route path="/business/:slug" Component={BusinessAdsPage} />
          <Route path="/" Component={Homepage} />
          <Route path="/Login" Component={UserForm} />
          <Route path="/reset-password" Component={ResetPasswordPage} />
          <Route path="/login" element={<Navigate to="/Login" replace />} />
          <Route path="/signin" element={<Navigate to="/Login" replace />} />
          <Route path="/Signin" element={<Navigate to="/Login" replace />} />
          <Route path="/register" element={<Navigate to="/Login?tab=signup" replace />} />
          <Route path="/signup" element={<Navigate to="/Login?tab=signup" replace />} />
          <Route path="/Signup" element={<Navigate to="/Login?tab=signup" replace />} />
          <Route path="/verify-email/:token" Component={VerifyEmailPage} />
          <Route path="/verify-email" Component={VerifyEmailPage} />
          <Route path="/promoted-adverts" Component={PromotedAdvertsPage} />
          {/* <Route path="/account" Component={UserAccount} /> */}
          {logIn ? (
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/account" element={<Navigate to="/Login" />} />
          )}

          {/* Funding Hub - NEW IMPLEMENTATION */}
          <Route path="/funding" Component={FundingHub} />
          <Route path="/funding-hub" Component={FundingHub} />
          <Route path="/funding-marketplace" Component={FundingHub} />
          <Route path="/funding/dashboard" Component={FundingDashboard} />
          <Route path="/funding/projects" Component={FundingProjects} />
          <Route path="/funding/project/:id" Component={lazy(() => import("./Pages/funding-project-detail"))} />
          
          {/* Donations Page - NEW IMPLEMENTATION */}
          <Route path="/donations" Component={DonationsPage} />
          <Route path="/donations/:id" Component={lazy(() => import("./Pages/DonationDetailPage"))} />
          <Route path="/charities-donations" Component={DonationsPage} />
          <Route path="/charities" Component={DonationsPage} />
          <Route path="/charities-donations" Component={DonationsPage} />
          
          {/* Communities Page - NEW IMPLEMENTATION */}
          <Route path="/communities" Component={CommunitiesPage} />
          <Route path="/community/:id" Component={CommunitiesPage} />
          <Route path="/communities/discover" Component={CommunitiesPage} />
          <Route path="/communities/my-communities" Component={CommunitiesPage} />
          <Route path="/communities/saved" Component={CommunitiesPage} />
          <Route path="/community/:id/start-discussion" Component={CommunitiesPage} />
          <Route path="/community/:id/report" Component={CommunitiesPage} />
          
          {/* Affiliate Hub Page */}
          <Route path="/affiliate" Component={AffiliatesPage} />
          <Route path="/affiliates" Component={AffiliatesPage} />
          <Route path="/affiliates/links" Component={AffiliatesLinksPage} />
          <Route path="/affiliate-hub" Component={AffiliatesPage} />
          
          <Route path="/payment" Component={PaymentPage} />
          <Route path="/payment/sandbox" Component={PaymentPage} />
          <Route path="/payment/sponsored/:advertId" Component={lazy(() => import("./Component/SponsoredPaymentPage"))} />
          <Route path="/create-donation" Component={PostCharities} />
          <Route path="/*" Component={PageNotFound} />
          <Route path="*" element={<UserForm />} />

          {/* store page  */}
          {logIn ? (
            <Route
              path="/my-store"
              element={
                <ProtectedRoute>
                  <MyStore />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/my-store" element={<Navigate to="/Login" />} />
          )}
          <Route path="/store/wwa-atelier" Component={ExampleStorePage} />
          <Route path="/store/:slug" Component={StoreDetailPage} />
          <Route path="/business-store" Component={BusinessStore} />
          <Route path="/business/:slug" Component={BusinessAdsPage} />
          <Route path="/business/category/:id" Component={BusinessCategoryPage} />
          {logIn ? (
            <>
              <Route
                path="/my-business/dashboard"
                element={
                  <ProtectedRoute>
                    <BusinessCategoryDashboardHub />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-business/dashboard/:categoryId"
                element={
                  <ProtectedRoute>
                    <BusinessCategoryDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-business"
                element={
                  <ProtectedRoute>
                    <BusinessStore />
                  </ProtectedRoute>
                }
              />
            </>
          ) : (
            <>
              <Route path="/my-business/dashboard" element={<Navigate to="/Login?type=business" />} />
              <Route path="/my-business/dashboard/:categoryId" element={<Navigate to="/Login?type=business" />} />
              <Route path="/my-business" element={<Navigate to="/Login" />} />
            </>
          )}

          {/* Chat */}
          {logIn ? (
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/messages" element={<UserForm />} />
          )}

          {/* Referral System */}
          {logIn ? (
            <Route
              path="/referral"
              element={
                <ProtectedRoute>
                  <ReferralInvitation />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/referral" element={<UserForm />} />
          )}
          {logIn ? (
            <Route
              path="/referral/dashboard"
              element={
                <ProtectedRoute>
                  <ReferralDashboard />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/referral/dashboard" element={<UserForm />} />
          )}
          {logIn ? (
            <Route
              path="/affiliate/post-program"
              element={
                <ProtectedRoute>
                  <PostAffiliateProgramPage />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/affiliate/post-program" element={<Navigate to="/Login" />} />
          )}
          {logIn ? (
            <Route
              path="/post-promoted-ad"
              element={
                <EmailVerifiedRoute>
                  <PostPromotedAdPage />
                </EmailVerifiedRoute>
              }
            />
          ) : (
            <Route path="/post-promoted-ad" element={<Navigate to="/Login" />} />
          )}
        </>
        </Routes>
      </Suspense>
    </ErrorBoundary>
    </ApiErrorBoundary>
  );
};

export default App;
