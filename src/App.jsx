import {
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import CookieConsent from "react-cookie-consent";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import ErrorBoundary from "./Component/LazyLoading/ErrorBoundary";
import Loading from "./Component/Loading";
import { getUserDetails } from "./slice/AuthSlice";

// Core components - loaded immediately
import UserForm from "./Component/UserForm";
import AccountPage from "./Pages/AccountPage";
import UserDashboard from "./Pages/UserDashboard";
import BookMarketplacePage from "./Component/BookMarketplace/BookMarketplacePage";
import MyPurchases from "./Component/Books/MyPurchases";
import PageNotFound from "./Pages/PageNotFound";

// Lazy load less frequently used components
const Homepage = lazy(() => import("./Pages/Homepage"));
const SponsoredAdsPage = lazy(() => import("./Pages/SponsoredAdsPage"));
const PromotedAdsPage = lazy(() => import("./Pages/PromotedAdsPage"));
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
const PromotedAds = lazy(() => import("./Component/PromotedAds"));
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
const PostBanner = lazy(() => import("./Component/PostAds/PostBanner"));
const PostAffiliate = lazy(() => import("./Component/PostAds/PostAffiliate"));
const PostClassified = lazy(() => import("./Component/PostAds/PostClassified"));
const PostVehicles = lazy(() => import("./Component/PostAds/PostVehicles"));
const PostItems = lazy(() => import("./Component/PostAds/PostItems"));
const PostProperty = lazy(() => import("./Component/PostAds/PostProperty"));
const PostBooks = lazy(() => import("./Component/PostAds/PostBooks"));
const InvestingPage = lazy(() => import("./Pages/InvestingPage"));
const FeatureAdsPage = lazy(() => import("./Pages/FeatureAdsPage"));
const FavoriteAdsPage = lazy(() => import("./Pages/FavoriteAdsPage"));
const AdsDetail = lazy(() => import("./Component/DetailsPages/AdsDetail"));
const ClasifiedsPage = lazy(() => import("./Pages/ClasifiedsPage"));
const FundingAdsPage = lazy(() => import("./Pages/FundingAdsPage"));
const DonationsPage = lazy(() => import("./Pages/DonationsPage"));
const AffiliateAdsPage = lazy(() => import("./Pages/AffiliateAdsPage"));
const CreateFunding = lazy(() => import("./Component/CreateFunding"));
const PostCharities = lazy(() => import("./Component/PostAds/PostCharities"));
const EbayAds = lazy(() => import("./Component/EbayAds"));
const FavouriteAdsDetail = lazy(() => import("./Component/DetailsPages/FavouriteAdsDetail"));
const BusinessPage = lazy(() => import("./Pages/BusinessPage"));
const AllSearchResultPage = lazy(() => import("./Pages/AllSearchResultPage"));
const BlogDetail = lazy(() => import("./Component/DetailsPages/BlogDetail"));
const MyStore = lazy(() => import("./Pages/MyStore"));
const AffiliatePage = lazy(() => import("./Pages/AffiliatePage"));
const BookPage = lazy(() => import("./Pages/BookPage"));
const PropertyPage = lazy(() => import("./Pages/PropertyPage"));
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
const MyAffiliateAdsPage = lazy(() => import("./Pages/MyAffiliateAdsPage"));
const MyClassifiedAdsPage = lazy(() => import("./Pages/MyClassifiedAdsPage"));
const MyNewAdsPage = lazy(() => import("./Pages/MyNewAdsPage"));
const MyBannerPage = lazy(() => import("./Pages/MyBannerPage"));
const ChatPage = lazy(() => import("./Component/Chat/ChatPage"));
const JobsSectionPage = lazy(() => import("./Pages/JobsSectionPage"));
const JobsPage = lazy(() => import("./Pages/JobsPage"));
const ServicesPage = lazy(() => import("./Pages/ServicesPage"));
const VacanciesPage = lazy(() => import("./Pages/VacanciesPage"));
const JobPostingForm = lazy(() => import("./Component/JobPosting/JobPostingForm"));
const VacancyPostingForm = lazy(() => import("./Component/JobPosting/VacancyPostingForm"));
const CandidateProfileForm = lazy(() => import("./Component/Candidate/CandidateProfileForm"));
const SuperAdminDashboard = lazy(() => import("./Pages/SuperAdminDashboard"));
const KYCVerification = lazy(() => import("./Component/KYCVerification"));
const AdminModerationDashboard = lazy(() => import("./Component/AdminModerationDashboard"));
const BookUploadForm = lazy(() => import("./Component/BookMarketplace/BookUploadForm"));
const MyBookListings = lazy(() => import("./Component/BookMarketplace/MyBookListings"));
const PropertyCategoryPage = lazy(() => import("./Component/CategoryPage/PropertyCategoryPage"));
const BuySellPage = lazy(() => import("./Pages/BuySellPage"));
const FundingPage = lazy(() => import("./Component/FundingPage"));

// Books API components
const BooksList = lazy(() => import("./Component/Books/BooksList"));
const BookDetail = lazy(() => import("./Component/Books/BookDetail"));
const CreateBookForm = lazy(() => import("./Component/Books/CreateBookForm"));

// Venue components
const VenuesPage = lazy(() => import("./Pages/VenuesPage"));
const VenueDetailPage = lazy(() => import("./Pages/VenueDetailPage"));
const PostVenue = lazy(() => import("./Component/PostAds/PostVenue"));

// Events components
const EventsPage = lazy(() => import("./Pages/EventsPage"));

// Referral System components
const ReferralInvitation = lazy(() => import("./Component/Referral/ReferralInvitation"));
const ReferralDashboard = lazy(() => import("./Component/Referral/ReferralDashboard"));
const PostAffiliateProgramPage = lazy(() => import("./Pages/PostAffiliateProgramPage"));
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

  // Check authentication status on app load - highly resilient to API failures
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Only check if we have a token in localStorage but no user details in Redux
        const hasToken = localStorage.getItem('jwt_token');
        const hasUserDetails = userDetail;
        
        if (hasToken && !hasUserDetails) {
          console.log('Token found but no user details - fetching user profile...');
          // Skip web-check and go directly to user profile for JWT-based auth
          await dispatch(getUserDetails()).unwrap();
          console.log('User details fetched successfully');
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
          localStorage.removeItem('jwt_token');
          localStorage.removeItem("customer_id");
          localStorage.removeItem("userDetail");
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

      <Suspense fallback={<Loading />}>
        <Routes>
        <>
          <Route path="/" Component={Homepage} />
          <Route path="/jobs-section" Component={JobsSectionPage} />
          <Route path="/jobs" Component={JobsPage} />
          <Route path="/vacancies" Component={VacanciesPage} />
          <Route path="/services" Component={ServicesPage} />
          {logIn ? (
            <Route
              path="/jobs/post"
              element={
                <ProtectedRoute>
                  <JobPostingForm />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/jobs/post" element={<Navigate to="/Login" />} />
          )}
          {logIn ? (
            <Route
              path="/vacancies/post"
              element={
                <ProtectedRoute>
                  <VacancyPostingForm />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/vacancies/post" element={<Navigate to="/Login" />} />
          )}
          {logIn ? (
            <Route
              path="/candidates/profile"
              element={
                <ProtectedRoute>
                  <CandidateProfileForm />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/candidates/profile" element={<Navigate to="/Login" />} />
          )}
          {logIn ? (
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/dashboard" element={<Navigate to="/Login" />} />
          )}
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
          <Route path="/sponsored-ads" Component={SponsoredAdsPage} />
          <Route path="/promoted-ads" Component={PromotedAdsPage} />
          <Route path="/classifieds-ads" Component={ClassifiedAdsPage} />
          <Route path="/new-ads" Component={NewAdsPage} />
          <Route path="/ebay-ads" component={EbayAds} />
          <Route path="/investment-category" Component={InvestingPage} />
          <Route path="/featured-ads" Component={FeatureAdsPage} />
          <Route path="/ads-detail/:slug" Component={AdsDetail} />
          <Route path="/favourite-ads/:id" Component={FavouriteAdsDetail} />
          <Route path="/affiliate-ads" Component={AffiliateAdsPage} />
          <Route path="/favorite-ads" Component={FavoriteAdsPage} />
          <Route
            path="/search-results/:searchValue"
            Component={AllSearchResultPage}
          />
          <Route path="/classified" Component={ClasifiedsPage} />
          <Route path="/affiliate" Component={AffiliatePage} />
          <Route path="/book" Component={BookPage} />
          <Route path="/book-marketplace" Component={BookMarketplacePage} />
          <Route path="/buy-sell" Component={BuySellPage} />
          
          {/* New Books API Routes */}
          <Route path="/books" Component={BooksList} />
          <Route path="/books/:id" Component={BookDetail} />
          {logIn ? (
            <Route
              path="/books/create"
              element={
                <ProtectedRoute>
                  <CreateBookForm />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/books/create" element={<UserForm />} />
          )}
          {logIn ? (
            <Route
              path="/books/my-purchases"
              element={
                <ProtectedRoute>
                  <MyPurchases />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/books/my-purchases" element={<UserForm />} />
          )}
          
          {logIn ? (
            <Route
              path="/book-marketplace/upload"
              element={
                <ProtectedRoute>
                  <BookUploadForm />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/book-marketplace/upload" element={<UserForm />} />
          )}
          {logIn ? (
            <Route
              path="/book-marketplace/my-listings"
              element={
                <ProtectedRoute>
                  <MyBookListings />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/book-marketplace/my-listings" element={<UserForm />} />
          )}
          <Route path="/property" Component={PropertyPage} />
          <Route path="/real-estate" Component={PropertyPage} />
          {/* Property Subcategories */}
          <Route path="/category/property/:subcategory" Component={PropertyCategoryPage} />
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
                <PostBanner />
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
                <PostVehicles />
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
            path="/postproperty"
            element={
              <EmailVerifiedRoute>
                <PostProperty />
              </EmailVerifiedRoute>
            }
          />
          <Route path="/postbooks"
            element={
              <EmailVerifiedRoute>
                <PostBooks />
              </EmailVerifiedRoute>
            }
          />
          <Route
            path="/venues"
            Component={VenuesPage}
          />
          <Route
            path="/venues/:id"
            Component={VenueDetailPage}
          />
          <Route
            path="/events"
            Component={EventsPage}
          />
          {logIn ? (
            <Route
              path="/venues/post"
              element={
                <EmailVerifiedRoute>
                  <PostVenue />
                </EmailVerifiedRoute>
              }
            />
          ) : (
            <Route path="/venues/post" element={<Navigate to="/Login" />} />
          )}
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
            <Route path="/my-sponsored-ads" element={<UserForm />} />
          )}
          {logIn ? (
            <Route
              path="/my-affiliate-ads"
              element={
                <ProtectedRoute>
                  <MyAffiliateAdsPage />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/my-affiliate-ads" element={<UserForm />} />
          )}
          {logIn ? (
            <Route
              path="/my-classifieds-ads"
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
          {logIn ? (
            <Route
              path="/my-banner-ads"
              element={
                <ProtectedRoute>
                  <MyBannerPage />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route path="/my-banner-ads" element={<UserForm />} />
          )}

          <Route path="/business" Component={BusinessPage} />
          <Route path="/business/category/:categoryName" Component={BusinessCategoryPage} />
          <Route path="/business/category/:categoryName/:subcategoryName" Component={BusinessCategoryPage} />
          <Route path="/business-page" Component={BusinessPage} />
          <Route path="/stores" Component={StoresPage} />
          <Route path="/" Component={Homepage} />
          <Route path="/Login" Component={UserForm} />
          <Route path="/PromotedAds" Component={PromotedAds} />
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

          {/* funding Page  */}
          <Route path="/quick-funding" Component={FundingAdsPage} />
          <Route path="/funding" Component={FundingAdsPage} />
          <Route path="/funding-category" Component={FundingPage} />
          <Route path="/donations-category" Component={DonationsPage} />
          <Route path="/donations" Component={DonationsPage} />
          <Route path="/charities" Component={DonationsPage} />
          <Route path="/create-funding" Component={CreateFunding} />
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
        </>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
