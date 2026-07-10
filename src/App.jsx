import {
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import CookieConsent from "react-cookie-consent";
import "flag-icons/css/flag-icons.min.css";
import ErrorBoundary from "./Component/LazyLoading/ErrorBoundary";
import ApiErrorBoundary from "./Component/ErrorBoundary/ApiErrorBoundary";
import Loading from "./Component/Loading";
import { getUserDetails } from "./slice/AuthSlice";
import useApiStatus from "./hooks/useApiStatus";

// Core components - loaded immediately
import UserForm from "./Component/UserForm";
import AccountPage from "./Pages/AccountPage";
import UserDashboard from "./Pages/UserDashboard";
import AffiliateDashboard from "./Pages/AffiliateDashboard";
import VehiclesPage from "./Pages/vehicles";
import PostVehiclesPage from "./Pages/post-vehicles";
import VehicleDetailPage from "./Pages/vehicle-detail";
import PostBannerPage from "./Pages/postbanner";
import PostServicePage from "./Pages/post-service";
import PageNotFound from "./Pages/PageNotFound";
import BuySellPage from "./Pages/buy-sell";
import BuySellItemDetail from "./Pages/buy-sell-item";
import BannerAdvertsPage from "./Pages/banner-adverts";
import BooksDashboard from "./Pages/BooksDashboard";
import ServicesPage from "./Pages/ServicesPage";
import ServiceDetailPage from "./Pages/ServiceDetailPage";

// Lazy load less frequently used components
const Homepage = lazy(() => import("./Pages/Homepage"));
const SponsoredPage = lazy(() => import("./Pages/sponsored"));
const SponsoredAdvertsPage = lazy(() => import("./Pages/sponsored-adverts"));
const PromotedAdvertsPage = lazy(() => import("./Pages/promoted-adverts"));
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
const PostAffiliate = lazy(() => import("./Component/affiliates/forms/PromoterAffiliateForm"));
const PostClassified = lazy(() => import("./Component/PostAds/PostClassified"));
const PostItems = lazy(() => import("./Component/PostAds/PostItems"));
const FeaturedAdvertPostingForm = lazy(() => import("./Component/featured/FeaturedPostForm"));
const InvestingPage = lazy(() => import("./Pages/InvestingPage"));
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
const CategoryMenyPage = lazy(() => import("./Pages/AllCategoryPage"));
const CategoryPage = lazy(() => import("./Pages/CategoryPage"));
const BusinessStore = lazy(() => import("./Pages/BusinessStore"));
const PostNewAds = lazy(() => import("./Component/PostNewAds"));
const BusinessCategoryPage = lazy(() => import("./Pages/BusinessCategoryPage"));
const BusinessAdsPage = lazy(() => import("./Pages/BusinessAdsPage"));
const StoresPage = lazy(() => import("./Pages/StoresPage"));
const StoreDetailPage = lazy(() => import("./Pages/StoreDetailPage"));
const MyFeatureAdsPage = lazy(() => import("./Pages/MyFeatureAdsPage"));
const MyPromotedAdsPage = lazy(() => import("./Pages/MySponsoredAdsPage"));
const MyClassifiedAdsPage = lazy(() => import("./Pages/MyClassifiedAdsPage"));
const MyNewAdsPage = lazy(() => import("./Pages/MyNewAdsPage"));
const ChatPage = lazy(() => import("./Component/Chat/ChatPage"));
const JobsPage = lazy(() => import("./Pages/jobs"));
const JobsPostPage = lazy(() => import("./Pages/JobsPostPage"));
const JobDetailPage = lazy(() => import("./Pages/JobDetailPage"));
const SuperAdminDashboard = lazy(() => import("./Pages/SuperAdminDashboard"));
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
const BookDetailsPage = lazy(() => import("./Pages/books-new"));
const BookPostForm = lazy(() => import("./Component/books/BookPostForm"));

// Job Seekers Marketplace - NEW IMPLEMENTATION
const JobSeekersPage = lazy(() => import("./Pages/JobSeekersPage"));

// Donations Page - NEW IMPLEMENTATION
const DonationsPage = lazy(() => import("./Pages/DonationsPage"));

// Communities Page - NEW IMPLEMENTATION
const CommunitiesPage = lazy(() => import("./Pages/communities"));

// Travel component - NEW IMPLEMENTATION
const ResortsTravelPage = lazy(() => import("./Pages/resorts-travel"));

// Stock Images & Media component - NEW IMPLEMENTATION
const ImagesPage = lazy(() => import("./Pages/images"));
const PostImagesPage = lazy(() => import("./Pages/postimages"));
const ImageDetailPage = lazy(() => import("./Pages/image-detail"));

// Events & Venues component - NEW IMPLEMENTATION
const EventsVenuesPage = lazy(() => import("./Pages/events-venues"));
const EventsVenuesPostForm = lazy(() => import("./Component/events-venues/EventsVenuesPostForm"));

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
  const { logIn, token } = useSelector((store) => store.auth);
  
  // More flexible authentication check - accept either logIn state OR token presence
  const isAuthenticated = logIn === true || token;
  
  if (!isAuthenticated) {
    return <Navigate to="/Login" />;
  }

  // Check if user has verified email (simplified - in production this would check backend)
  // For now, just check if user is logged in (email verification can be added later)
  return children;
};

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { logIn, userDetail } = useSelector((store) => store.auth);
  
  // API Status Monitoring
  const { 
    isDegraded,
    isOffline,
    queueStatus,
    reconnect 
  } = useApiStatus();

  // Check authentication status on app load - highly resilient to API failures
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Only check if we have a token in localStorage but no user details in Redux
        const hasToken = localStorage.getItem('token');
        const hasUserDetails = userDetail?.data;
        const hasUserDetailInStorage = localStorage.getItem('user');
        
        if (hasToken && !hasUserDetails && hasUserDetailInStorage) {
          console.log('Token found and user details in storage but not Redux - rehydrating...');
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
          console.log('Token found but no user details - fetching user profile...');
          // Skip web-check and go directly to user profile for JWT-based auth
          try {
            await dispatch(getUserDetails()).unwrap();
            console.log('User details fetched successfully');
          } catch (userDetailsError) {
            console.warn('Failed to fetch user details on app load:', userDetailsError);
            // Don't clear auth state on app load error - let user continue with existing token
            // The error will be handled when they actually try to access protected features
          }
        } else if (hasToken && hasUserDetails) {
          console.log('User already authenticated - skipping check');
        } else {
          console.log('No token found - user not logged in');
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
          console.warn('Definite authentication failure - clearing auth state');
          localStorage.removeItem('token');
          localStorage.removeItem("customer_id");
          localStorage.removeItem("user");
        } else if (isServerError || isNetworkError) {
          console.warn('Server/Network error - preserving auth state for stability');
          // Don't clear auth state - user might still be valid
        } else {
          console.warn('Unknown error - preserving auth state as precaution');
          // When in doubt, preserve auth state to avoid unnecessary logouts
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
        {/* API Status Indicator - Disabled in development */}
        {false && (isOffline || isDegraded) && (
          <div className={`fixed top-0 left-0 right-0 z-50 text-center p-2 text-sm ${
            isOffline 
              ? 'bg-red-500 text-white' 
              : 'bg-yellow-500 text-black'
          }`}>
            <div className="flex items-center justify-center gap-2">
              <span>
                {isOffline ? '🔴 API Offline' : '🟡 API Degraded'}
              </span>
              {queueStatus?.size > 0 && (
                <span className="text-xs">
                  ({queueStatus.size} requests queued)
                </span>
              )}
              {!isOffline && (
                <button 
                  onClick={reconnect}
                  className="ml-2 px-2 py-1 text-xs bg-white/20 rounded hover:bg-white/30"
                >
                  Reconnect
                </button>
              )}
            </div>
          </div>
        )}
        
        
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

        <Suspense fallback={<Loading />}>
          <Routes>
          <>
            <Route path="/" Component={Homepage} />
            <Route path="/jobs" Component={JobsPage} />
            <Route path="/jobs/:id" Component={JobDetailPage} />
            <Route path="/jobs-marketplace" Component={JobsPage} />
            <Route path="/job-seekers" Component={JobSeekersPage} />
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
                  <SuperAdminDashboard />
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
          <Route path="/sponsored" Component={SponsoredPage} />
          <Route path="/sponsored-adverts" Component={SponsoredAdvertsPage} />
          <Route path="/banner-adverts" Component={BannerAdvertsPage} />
          <Route path="/promoted-adverts" Component={PromotedAdvertsPage} />
          <Route path="/featured-ads" Component={PromotedAdvertsPage} />
          <Route path="/classifieds-ads" Component={ClassifiedAdsPage} />
          <Route path="/new-ads" Component={NewAdsPage} />
          <Route path="/ebay-ads" component={EbayAds} />
          <Route path="/investment-category" Component={InvestingPage} />
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
          <Route path="/classified" Component={ClasifiedsPage} />
          <Route path="/affiliate" Component={AffiliatesPage} />
          <Route path="/affiliates" Component={AffiliatesPage} />
          <Route path="/affiliates-hub" Component={AffiliatesPage} />
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
          <Route path="/vehicle/:id" Component={VehicleDetailPage} />
                    
          <Route path="/buy-sell" Component={BuySellPage} />
          <Route path="/item/:id" Component={BuySellItemDetail} />
          {/* Services & Solutions Routes */}
          <Route path="/services" Component={ServicesPage} />
          <Route path="/services-marketplace" Component={ServicesPage} />
          <Route path="/services/:id" Component={ServiceDetailPage} />

          {/* NEW Books & Literature Routes */}
          <Route path="/books" Component={BooksPage} />
          <Route path="/books/:slug" Component={BooksPage} />
          <Route path="/books/create" Component={BooksPage} />
          <Route path="/books-marketplace" Component={BooksPage} />
          <Route path="/book-marketplace" Component={BooksPage} />
          {logIn ? (
            <Route
              path="/books/dashboard"
              element={
                <EmailVerifiedRoute>
                  <BooksDashboard />
                </EmailVerifiedRoute>
              }
            />
          ) : (
            <Route path="/books/dashboard" element={<Navigate to="/Login" />} />
          )}
          {logIn ? (
            <Route
              path="/post-book"
              element={
                <EmailVerifiedRoute>
                  <BookPostForm />
                </EmailVerifiedRoute>
              }
            />
          ) : (
            <Route path="/post-book" element={<Navigate to="/Login" />} />
          )}
          <Route path="/property" Component={PropertyMarketplacePage} />
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
          {logIn ? (
            <Route
              path="/events-venues/post"
              element={
                <EmailVerifiedRoute>
                  <Suspense fallback={<Loading />}>
                    <EventsVenuesPostForm />
                  </Suspense>
                </EmailVerifiedRoute>
              }
            />
          ) : (
            <Route path="/events-venues/post" element={<Navigate to="/Login" />} />
          )}

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
          <Route
            path="/postclassified"
            element={
              <EmailVerifiedRoute>
                <PostClassified />
              </EmailVerifiedRoute>
            }
          />
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
          <Route path="/business/create" Component={BusinessForm} />
          <Route path="/business/:id" Component={BusinessDetailPage} />
          <Route path="/business/:id/edit" Component={BusinessForm} />
          <Route path="/stores" Component={StoresPage} />
          <Route path="/online-stores" Component={StoresPage} />
          <Route path="/ecommerce" Component={StoresPage} />
          <Route path="/business/category/:categoryName" Component={BusinessCategoryPage} />
          <Route path="/business/category/:categoryName/:subcategoryName" Component={BusinessCategoryPage} />
          <Route path="/business-store" Component={BusinessStore} />
          <Route path="/business/:slug" Component={BusinessAdsPage} />
          <Route path="/" Component={Homepage} />
          <Route path="/Login" Component={UserForm} />
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
          <Route path="/affiliate-hub" Component={AffiliatesPage} />
          
          <Route path="/payment" Component={PaymentPage} />
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
          <Route path="/store/:slug" Component={StoreDetailPage} />
          <Route path="/business-store" Component={BusinessStore} />
          <Route path="/business/:slug" Component={BusinessAdsPage} />
          <Route path="/business/category/:id" Component={BusinessCategoryPage} />
          {logIn ? (
            <Route
              path="/my-business"
              element={
                <ProtectedRoute>
                  <BusinessStore />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/my-business" element={<Navigate to="/Login" />} />
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
