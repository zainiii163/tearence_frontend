import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getUserDashboard } from "../slice/DashboardSlice";
import { getCategoriesList } from "../slice/CategorySlice";
import { getStore, getBusinessStore } from "../slice/StoreSlice";
import { logOut } from "../slice/AuthSlice";
import {
  categoryFromDemoEmail,
  CATEGORY_QUICK_ACTION_TABS,
  getBusinessSidebarTabIds,
  getDashboardCategory,
  resolveBusinessDashboardCategory,
} from "../Component/Business/businessCategoryDashboardConfig";
import BusinessCategoryDashboardPanel from "../Component/Business/BusinessCategoryDashboardPanel";
import {
  FaBriefcase,
  FaBell,
  FaStar,
  FaUser,
  FaFileAlt,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaChartLine,
  FaShoppingCart,
  FaShoppingBag,
  FaDollarSign,
  FaTags,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExternalLinkAlt,
  FaHeart,
  FaCog,
  FaSignOutAlt,
  FaBook,
  FaBookOpen,
  FaBars,
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaUsers,
  FaBuilding,
  FaStore,
  FaCalendar,
  FaCar,
  FaCrown,
  FaPlane,
  FaHandHoldingHeart,
} from "react-icons/fa";
import { HiOutlineOfficeBuilding, HiOutlineShoppingBag } from "react-icons/hi";
import { PiFlagBanner } from "react-icons/pi";
import UserForm from "../Component/UserForm";
import DashboardTabPanel from "../Component/dashboard/DashboardTabPanel";
import FriendCenterPanel from "../Component/social/FriendCenterPanel";
import DashboardSidebarNav from "../Component/dashboard/DashboardSidebarNav";
import DashboardInsightsOverview from "../Component/dashboard/DashboardInsightsOverview";
import DashboardMockOverview from "../Component/dashboard/DashboardMockOverview";
import DashboardAccountSettingsPanel from "../Component/dashboard/DashboardAccountSettingsPanel";
import DashboardNotificationsPanel from "../Component/dashboard/DashboardNotificationsPanel";
import FleetManagement from "../Component/dashboard/FleetManagement";
import NormalUserModeHome from "../Component/dashboard/NormalUserModeHome";
import BuyerPurchasesHub from "../Component/dashboard/BuyerPurchasesHub";
import {
  ACCOUNT_TYPE_BUSINESS,
  persistAccountType,
  resolveAccountType,
} from "../utils/accountType";
import notificationService from "../services/NotificationService";
import donationAPI from "../api/donationAPI";
import propertyApi from "../services/propertyApi";
import fundingAPI from "../api/fundingAPI";
import axios from "axios";
import jobsAPI from "../api/jobsAPI";
import eventsVenuesAPI from "../services/eventsVenuesAPI";
import sponsoredAdvertsAPI from "../api/sponsoredAdvertsAPI";
import { getMyVehicles } from "../services/vehiclesAPI";
import resortsTravelAPI from "../services/resortsTravelAPI";
import bannerAPI from "../api/banner";
import BooksAPI from "../services/booksAPI";
import { servicesApi } from "../services/servicesSolutionsApi";
import { buysellAPI } from "../api/buysell";
import { extractListItems, formatCityCountry } from "../utils/apiResponseHelpers";
import DashboardListThumbnail from "../Component/dashboard/DashboardListThumbnail";
import { formatListingDate } from "../utils/dashboardImageHelpers";
import { extractJobsList } from "../utils/jobsHelpers";
import { logDashboardFetchError } from "../utils/apiErrorHelpers";
import {
  aggregateListStats,
  mergeOverviewStats,
  statsFromLegacyDashboard,
  getSponsoredAdvertStatus,
  isListingAwaitingPayment,
} from "../utils/dashboardStatsHelpers";
import { getAuthToken } from "../utils/auth";
import "../styles/dashboardShell.css";

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.worldwideadverts.info/api/v1';

const DASHBOARD_TAB_IDS = [
  'overview', 'purchases', 'category-dash', 'team', 'jobs', 'jobseeker', 'books', 'services', 'events-venues',
  'resorts-travel', 'sponsored', 'featured', 'vehicles', 'fleet', 'banners',
  'funding', 'ads', 'buy-sell', 'store', 'business', 'affiliates', 'properties', 'donations',
  'templates', 'commerce', 'notifications', 'security',
];

const BUYING_TAB_IDS = new Set([
  'overview',
  'purchases',
  'commerce',
  'jobseeker',
  'books', // users can submit books/courses/guides for publication
  'affiliates', // promoters earn hop commissions on a basic account too
  'notifications',
  'security',
]);

const SELLING_TAB_IDS = new Set([
  'overview',
  'team',
  'buy-sell',
  'services',
  'templates',
  'commerce',
  'jobs',
  'books',
  'business',
  'events-venues',
  'resorts-travel',
  'properties',
  'vehicles',
  'fleet',
  'sponsored',
  'featured',
  'banners',
  'funding',
  'donations',
  'store',
  'affiliates',
  'notifications',
  'security',
]);

const UserDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { logIn, userDetail } = useSelector((store) => store.auth);
  const { userDashboard, loading } = useSelector((store) => store.dashboard);
  const { categories } = useSelector((store) => store.categories);
  const { storeDetail, businessStore } = useSelector((store) => store.store);
  const storeData = storeDetail;
  const businessStoreData = businessStore;

  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = new URLSearchParams(window.location.search).get('tab');
    if (tabParam === 'buy-sell' || tabParam === 'ads') return 'buy-sell';
    return tabParam && DASHBOARD_TAB_IDS.includes(tabParam) ? tabParam : 'overview';
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [booksData, setBooksData] = useState(null);
  const [jobsData, setJobsData] = useState(null);
  const [userServices, setUserServices] = useState([]);
  const [userBuySellAds, setUserBuySellAds] = useState([]);
  const [userPromotions, setUserPromotions] = useState([]);
  const [userAnalytics, setUserAnalytics] = useState({});
  const [eventsVenuesData, setEventsVenuesData] = useState([]);
  const [sponsoredAdvertsData, setSponsoredAdvertsData] = useState([]);
  const [vehiclesData, setVehiclesData] = useState([]);
  const [featuredAdvertsData, setFeaturedAdvertsData] = useState([]);
  const [resortsTravelData, setResortsTravelData] = useState([]);
  const [bannerData, setBannerData] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingFeaturedAdverts, setLoadingFeaturedAdverts] = useState(false);
  const [loadingResortsTravel, setLoadingResortsTravel] = useState(false);
  const [loadingBanners, setLoadingBanners] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [propertiesData, setPropertiesData] = useState([]);
  const [donationsData, setDonationsData] = useState([]);
  const [fundingData, setFundingData] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loadingDonations, setLoadingDonations] = useState(false);
  const [loadingFunding, setLoadingFunding] = useState(false);
  const [overviewStats, setOverviewStats] = useState({
    totalPosts: 0,
    activePosts: 0,
    totalViews: 0,
    totalSaves: 0,
    loading: true,
  });
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Load posted jobs from API
  const loadPostedJobs = async (jobList) => {
    if (Array.isArray(jobList)) {
      setJobsData({ recentJobs: jobList });
      return;
    }

    try {
      const jobsResponse = await jobsAPI.getMyJobs();
      const recentJobs = extractJobsList(jobsResponse);
      setJobsData({ recentJobs });
    } catch (error) {
      logDashboardFetchError('Error loading posted jobs', error);
      setJobsData({ recentJobs: [] });
    }
  };

  const loadJobSeekerProfile = async () => {
    try {
      const profileResponse = await jobsAPI.getMySeekerProfile();
      const profile = profileResponse?.data?.id
        ? profileResponse.data
        : profileResponse?.data?.data ?? (profileResponse?.id ? profileResponse : null);
      if (profile && profileResponse?.success !== false) {
        setJobSeekerProfile(profile);
      } else {
        setJobSeekerProfile(null);
      }
    } catch (error) {
      logDashboardFetchError('Error loading job seeker profile', error);
      setJobSeekerProfile(null);
    }
  };
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [jobSeekerProfile, setJobSeekerProfile] = useState(null);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  // Load vehicles data from API
  const loadVehiclesData = async () => {
    try {
      setLoadingVehicles(true);
      const response = await getMyVehicles();
      if (response.success || response.data) {
        setVehiclesData(response.data || []);
      } else {
        setVehiclesData([]);
      }
    } catch (error) {
      logDashboardFetchError('Failed to load vehicles data', error);
      setVehiclesData([]);
    } finally {
      setLoadingVehicles(false);
    }
  };

  const loadOverviewStats = async () => {
    setOverviewStats((prev) => ({ ...prev, loading: true }));

    const token = getAuthToken();
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    // php artisan serve is single-threaded — blasting 10 parallel auth APIs hangs it.
    // Fetch in small batches instead.
    const fetchers = [
      () => BooksAPI.getMyBooks(),
      () => jobsAPI.getMyJobs(),
      () => servicesApi.getMyServices(),
      () => eventsVenuesAPI.getMyAdverts(),
      () => resortsTravelAPI.getMyAdverts(),
      () => sponsoredAdvertsAPI.getMyAdverts(),
      () => getMyVehicles(),
      () => bannerAPI.getMyBannerAds(),
      () => buysellAPI.getUserAdverts(),
      () => axios.get(`${API_BASE_URL}/featured-adverts/my-adverts`, { headers: authHeaders }),
    ];

    const settled = [];
    const batchSize = 3;
    for (let i = 0; i < fetchers.length; i += batchSize) {
      const batch = fetchers.slice(i, i + batchSize);
      // eslint-disable-next-line no-await-in-loop
      const batchResults = await Promise.allSettled(batch.map((fn) => fn()));
      settled.push(...batchResults);
    }

    const [
      booksRes,
      jobsRes,
      servicesRes,
      eventsRes,
      resortsRes,
      sponsoredRes,
      vehiclesRes,
      bannersRes,
      buysellRes,
      featuredRes,
    ] = settled;

    const lists = [];

    if (booksRes.status === 'fulfilled') lists.push(extractListItems(booksRes.value));
    if (jobsRes.status === 'fulfilled') lists.push(extractJobsList(jobsRes.value));
    if (servicesRes.status === 'fulfilled') lists.push(extractListItems(servicesRes.value));
    if (eventsRes.status === 'fulfilled') {
      const ev = eventsRes.value;
      lists.push(extractListItems(ev?.data ? ev : ev));
    }
    if (resortsRes.status === 'fulfilled') lists.push(extractListItems(resortsRes.value));
    if (sponsoredRes.status === 'fulfilled') lists.push(extractListItems(sponsoredRes.value));
    if (vehiclesRes.status === 'fulfilled') {
      const v = vehiclesRes.value;
      lists.push(Array.isArray(v?.data) ? v.data : extractListItems(v));
    }
    if (bannersRes.status === 'fulfilled') lists.push(extractListItems(bannersRes.value));
    if (buysellRes.status === 'fulfilled') lists.push(extractListItems(buysellRes.value));
    if (featuredRes.status === 'fulfilled') {
      const fd = featuredRes.value?.data;
      lists.push(extractListItems(fd?.data ? fd : fd));
    }

    const moduleStats = aggregateListStats(lists);
    const legacyStats = statsFromLegacyDashboard(userDashboard);
    const merged = mergeOverviewStats(moduleStats, legacyStats);

    setOverviewStats({
      ...merged,
      loading: false,
    });
  };

  useEffect(() => {
    if (logIn) {
      // Catch rejections — API client rejects plain objects, which CRA shows as [object Object]
      dispatch(getUserDashboard()).catch(() => {});
      dispatch(getCategoriesList({ is_parent: "yes" })).catch(() => {});
      dispatch(getStore()).catch(() => {});
      // Business store is optional for basic (buyer) accounts
      if (resolveAccountType(userDetail) === ACCOUNT_TYPE_BUSINESS) {
        dispatch(getBusinessStore()).catch(() => {});
      }
      // Overview stats load once below when dashboard/tab is ready — avoid double 10-API storm
      notificationService
        .getUnreadCount()
        .then((res) => setUnreadNotifications(res?.data?.unread_count ?? res?.unread_count ?? 0))
        .catch(() => setUnreadNotifications(0));
    }
  }, [dispatch, logIn, userDetail]);

  useEffect(() => {
    // Seller listing KPI storm — Business overview only
    if (logIn && activeTab === 'overview' && resolveAccountType(userDetail) === ACCOUNT_TYPE_BUSINESS) {
      loadOverviewStats().catch(() => {});
    }
  }, [logIn, activeTab, userDetail]);

  const loadTabData = async (tab) => {
    if (!logIn) return;

    switch (tab) {
      case 'overview':
        if (resolveAccountType(userDetail) === ACCOUNT_TYPE_BUSINESS) {
          await loadOverviewStats();
        }
        break;
      case 'jobs':
        // JobsManagement loads its own data and syncs stats via onJobsChange
        break;
      case 'jobseeker':
        await loadJobSeekerProfile();
        break;
      case 'books':
        await loadBooksData();
        break;
      case 'services':
        await fetchUserServices();
        break;
      case 'events-venues':
        await fetchEventsVenues();
        break;
      case 'sponsored':
        await fetchSponsoredAdverts();
        break;
      case 'vehicles':
        await loadVehiclesData();
        break;
      case 'featured':
        await loadFeaturedAdverts();
        break;
      case 'resorts-travel':
        await fetchResortsTravel();
        break;
      case 'banners':
        await fetchBanners();
        break;
      case 'ads':
      case 'buy-sell':
        await fetchUserBuySellAds();
        break;
      case 'properties':
        // PropertiesManagement loads its own data and syncs stats via onPropertiesChange
        break;
      case 'donations':
        await loadDonationsData();
        break;
      case 'funding':
        await loadFundingData();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (!logIn || !activeTab) return;
    loadTabData(activeTab);
  }, [activeTab, logIn]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (!tabParam) return;
    if (tabParam === 'buy-sell' || tabParam === 'ads') {
      setActiveTab('buy-sell');
      return;
    }
    if (DASHBOARD_TAB_IDS.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/');
  };

  const clearCreateParam = () => {
    const nextParams = new URLSearchParams(searchParams);
    let changed = false;
    if (nextParams.has('create')) {
      nextParams.delete('create');
      changed = true;
    }
    if (nextParams.has('postForm')) {
      nextParams.delete('postForm');
      changed = true;
    }
    // Keep advert_type so the Sponsored tab stays in "business for sale" mode
    if (!changed) return;
    setSearchParams(nextParams, { replace: true });
  };

  const openCreateFlow = (tab = activeTab) => {
    setActiveTab(tab);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', tab);
    nextParams.set('create', 'true');
    setSearchParams(nextParams);
  };

  const loadPropertiesData = async (propertyList) => {
    if (Array.isArray(propertyList)) {
      setPropertiesData(propertyList);
      return;
    }

    try {
      setLoadingProperties(true);
      const response = await propertyApi.getMyProperties();
      setPropertiesData(extractListItems(response));
    } catch (error) {
      logDashboardFetchError('Failed to load properties data', error);
      setPropertiesData([]);
    } finally {
      setLoadingProperties(false);
    }
  };

  const loadDonationsData = async () => {
    try {
      setLoadingDonations(true);
      const response = await donationAPI.getMyDonations();
      setDonationsData(extractListItems(response));
    } catch (error) {
      logDashboardFetchError('Failed to load donations data', error);
      setDonationsData([]);
    } finally {
      setLoadingDonations(false);
    }
  };

  const loadFundingData = async () => {
    try {
      setLoadingFunding(true);
      const response = await fundingAPI.getMyProjects();
      setFundingData(extractListItems(response));
    } catch (error) {
      logDashboardFetchError('Failed to load funding data', error);
      setFundingData([]);
    } finally {
      setLoadingFunding(false);
    }
  };

  const loadBooksData = async () => {
    const emptyBooksData = {
      totalBooks: 0,
      activeBooks: 0,
      totalBookViews: 0,
      totalBookSaves: 0,
      recentBooks: [],
    };

    try {
      setLoadingBooks(true);
      const response = await BooksAPI.getMyBooks();
      const books = extractListItems(response);
      setBooksData({
        totalBooks: books.length,
        activeBooks: books.filter((b) => b.status === 'active').length,
        totalBookViews: books.reduce((sum, b) => sum + (b.views || b.views_count || 0), 0),
        totalBookSaves: books.reduce((sum, b) => sum + (b.saves || b.saves_count || 0), 0),
        recentBooks: books,
      });
    } catch (error) {
      logDashboardFetchError('Failed to load books data', error);
      setBooksData(emptyBooksData);
    } finally {
      setLoadingBooks(false);
    }
  };

  const fetchUserServices = async () => {
    try {
      setLoadingServices(true);
      const response = await servicesApi.getMyServices();
      setUserServices(extractListItems(response));
    } catch (error) {
      logDashboardFetchError('Failed to fetch user services', error);
      setUserServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchUserBuySellAds = async () => {
    try {
      const response = await buysellAPI.getUserAdverts();
      setUserBuySellAds(extractListItems(response));
    } catch (error) {
      logDashboardFetchError('Failed to fetch user buy-sell ads', error);
      setUserBuySellAds([]);
    }
  };

  // Fetch user ads from API
  const fetchUserAds = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      const response = await axios.get(`${API_BASE_URL}/ads/my-ads`, config);
      if (response.data.success || response.data.data) {
        return response.data.data || [];
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch user ads:', error);
      return [];
    }
  };

  // Fetch user promotions from API
  const fetchUserPromotions = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.get(`${API_BASE_URL}/promotions/my-promotions`, config);
      if (response.data.success) {
        setUserPromotions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user promotions:', error);
    }
  };

  // Fetch user analytics from API
  const fetchUserAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.get(`${API_BASE_URL}/analytics/provider/${userDetail?.customer_id || userDetail?.id}`, config);
      if (response.data.success) {
        setUserAnalytics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user analytics:', error);
    }
  };

  // Fetch user featured adverts from API
  const loadFeaturedAdverts = async () => {
    try {
      setLoadingFeaturedAdverts(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      const response = await axios.get(`${API_BASE_URL}/featured-adverts/my-adverts`, config);
      if (response.data.success || response.data.data) {
        setFeaturedAdvertsData(response.data.data?.data || response.data.data || []);
      } else {
        setFeaturedAdvertsData([]);
      }
    } catch (error) {
      console.error('Error fetching featured adverts:', error);
      setFeaturedAdvertsData([]);
    } finally {
      setLoadingFeaturedAdverts(false);
    }
  };

  // Fetch user events and venues from API
  const fetchEventsVenues = async () => {
    try {
      const response = await eventsVenuesAPI.getMyAdverts();
      if (response.success || response.data) {
        const data = response.data?.data || response.data || [];
        setEventsVenuesData(Array.isArray(data) ? data : []);
      } else {
        setEventsVenuesData([]);
      }
    } catch (error) {
      console.error('Error fetching events and venues:', error);
      setEventsVenuesData([]);
    }
  };

  // Fetch user sponsored adverts from API
  const fetchSponsoredAdverts = async () => {
    try {
      const response = await sponsoredAdvertsAPI.getMyAdverts();
      if (response.success || response.data) {
        const data = response.data?.data || response.data || [];
        setSponsoredAdvertsData(Array.isArray(data) ? data : []);
      } else {
        setSponsoredAdvertsData([]);
      }
    } catch (error) {
      logDashboardFetchError('Error fetching sponsored adverts', error);
      setSponsoredAdvertsData([]);
    }
  };

  // Fetch user resorts and travel from API
  const fetchResortsTravel = async () => {
    try {
      setLoadingResortsTravel(true);
      const response = await resortsTravelAPI.getMyAdverts();
      if (response.success || response.data) {
        const data = response.data?.data || response.data || [];
        setResortsTravelData(Array.isArray(data) ? data : []);
      } else {
        setResortsTravelData([]);
      }
    } catch (error) {
      console.error('Error fetching resorts and travel:', error);
      setResortsTravelData([]);
    } finally {
      setLoadingResortsTravel(false);
    }
  };

  // Fetch user banners from API
  const fetchBanners = async () => {
    try {
      setLoadingBanners(true);
      const response = await bannerAPI.getMyBannerAds();
      if (response.success || response.data) {
        const data = response.data?.data || response.data || [];
        setBannerData(Array.isArray(data) ? data : []);
      } else {
        setBannerData([]);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      setBannerData([]);
    } finally {
      setLoadingBanners(false);
    }
  };

  const filteredCategories = categories?.filter(
    (cat) => selectedCategory === "all" || cat.categoryName === selectedCategory
  );

  const stats = [
    { label: "Total Posts", value: overviewStats.loading ? '…' : overviewStats.totalPosts, icon: FaFileAlt, color: "bg-blue-500" },
    { label: "Active Posts", value: overviewStats.loading ? '…' : overviewStats.activePosts, icon: FaCheckCircle, color: "bg-green-500" },
    { label: "Total Views", value: overviewStats.loading ? '…' : overviewStats.totalViews, icon: FaEye, color: "bg-purple-500" },
    { label: "Total Saves", value: overviewStats.loading ? '…' : overviewStats.totalSaves, icon: FaHeart, color: "bg-red-500" },
  ];

  const booksStats = [
    { label: "Total Books", value: booksData?.totalBooks || 0, icon: FaBook, color: "bg-indigo-500" },
    { label: "Active Books", value: booksData?.activeBooks || 0, icon: FaCheckCircle, color: "bg-green-500" },
    { label: "Total Views", value: booksData?.totalBookViews || 0, icon: FaEye, color: "bg-purple-500" },
    { label: "Total Saves", value: booksData?.totalBookSaves || 0, icon: FaHeart, color: "bg-red-500" },
  ];

  const jobsStats = [
    { label: "Total Jobs", value: Array.isArray(jobsData?.recentJobs) ? jobsData.recentJobs.length : 0, icon: FaBriefcase, color: "bg-green-500" },
    { label: "Active Jobs", value: Array.isArray(jobsData?.recentJobs) ? jobsData.recentJobs.filter(job => job.status === 'active').length : 0, icon: FaCheckCircle, color: "bg-blue-500" },
    { label: "Total Views", value: Array.isArray(jobsData?.recentJobs) ? jobsData.recentJobs.reduce((sum, job) => sum + (job.views || 0), 0) : 0, icon: FaEye, color: "bg-purple-500" },
    { label: "Applications", value: Array.isArray(jobsData?.recentJobs) ? jobsData.recentJobs.reduce((sum, job) => sum + (job.applications_count || 0), 0) : 0, icon: FaBriefcase, color: "bg-orange-500" },
  ];

  const servicesStats = [
    { label: "Total Services", value: Array.isArray(userServices) ? userServices.length : 0, icon: FaBriefcase, color: "bg-purple-500" },
    { label: "Active Services", value: Array.isArray(userServices) ? userServices.filter(service => service.status === 'active').length : 0, icon: FaCheckCircle, color: "bg-green-500" },
    { label: "Total Views", value: Array.isArray(userServices) ? userServices.reduce((sum, service) => sum + (service.views || 0), 0) : 0, icon: FaEye, color: "bg-blue-500" },
    { label: "Total Enquiries", value: Array.isArray(userServices) ? userServices.reduce((sum, service) => sum + (service.enquiries || 0), 0) : 0, icon: FaBriefcase, color: "bg-orange-500" },
  ];

  const jobSeekerStats = [
    { label: "Profile Status", value: jobSeekerProfile ? "Active" : "Not Created", icon: FaCheckCircle, color: jobSeekerProfile ? "bg-green-500" : "bg-gray-500" },
    { label: "Profile Views", value: jobSeekerProfile?.views_count || 0, icon: FaEye, color: "bg-blue-500" },
    { label: "Profile Contacts", value: jobSeekerProfile?.profile_contacts_count || 0, icon: FaBriefcase, color: "bg-purple-500" },
    { label: "Profile Saves", value: jobSeekerProfile?.saves_count || 0, icon: FaHeart, color: "bg-red-500" },
  ];

  const storeStats = [
    { label: "Total Products", value: storeData?.products?.length || 0, icon: FaShoppingCart, color: "bg-green-500" },
    { label: "Store Views", value: storeData?.views || 0, icon: FaEye, color: "bg-blue-500" },
    { label: "Total Orders", value: storeData?.orders || 0, icon: FaDollarSign, color: "bg-purple-500" },
    { label: "Store Rating", value: storeData?.rating || 0, icon: FaStar, color: "bg-yellow-500" },
  ];

  const businessStats = [
    { label: "Business Status", value: businessStoreData?.status || "Not Created", icon: FaBuilding, color: businessStoreData?.status === "active" ? "bg-green-500" : "bg-gray-500" },
    { label: "Profile Views", value: businessStoreData?.views || 0, icon: FaEye, color: "bg-blue-500" },
    { label: "Total Leads", value: businessStoreData?.leads || 0, icon: FaBriefcase, color: "bg-purple-500" },
    { label: "Listings", value: businessStoreData?.listings || 0, icon: FaTags, color: "bg-orange-500" },
  ];

  const eventsVenuesStats = [
    { label: "Total Events", value: Array.isArray(eventsVenuesData) ? eventsVenuesData.length : 0, icon: FaCalendar, color: "bg-pink-500" },
    { label: "Active Events", value: Array.isArray(eventsVenuesData) ? eventsVenuesData.filter(ev => ev.status === 'active').length : 0, icon: FaCheckCircle, color: "bg-green-500" },
    { label: "Total Views", value: Array.isArray(eventsVenuesData) ? eventsVenuesData.reduce((sum, ev) => sum + (ev.views || 0), 0) : 0, icon: FaEye, color: "bg-blue-500" },
    { label: "Upcoming", value: Array.isArray(eventsVenuesData) ? eventsVenuesData.filter(ev => new Date(ev.event_date) > new Date()).length : 0, icon: FaClock, color: "bg-purple-500" },
  ];

  const sponsoredStats = [
    { label: "Total Sponsored", value: Array.isArray(sponsoredAdvertsData) ? sponsoredAdvertsData.length : 0, icon: FaCrown, color: "bg-yellow-500" },
    { label: "Active", value: Array.isArray(sponsoredAdvertsData) ? sponsoredAdvertsData.filter((ad) => getSponsoredAdvertStatus(ad) === 'active').length : 0, icon: FaCheckCircle, color: "bg-green-500" },
    { label: "Total Views", value: Array.isArray(sponsoredAdvertsData) ? sponsoredAdvertsData.reduce((sum, ad) => sum + (ad.views_count || 0), 0) : 0, icon: FaEye, color: "bg-blue-500" },
    { label: "Premium", value: Array.isArray(sponsoredAdvertsData) ? sponsoredAdvertsData.filter(ad => ad.sponsorship_tier === 'premium' || ad.sponsorship_tier === 'featured').length : 0, icon: FaStar, color: "bg-purple-500" },
  ];

  const vehiclesStats = [
    { label: "Total Vehicles", value: Array.isArray(vehiclesData) ? vehiclesData.length : 0, icon: FaCar, color: "bg-blue-500" },
    { label: "Active Vehicles", value: Array.isArray(vehiclesData) ? vehiclesData.filter(v => v.status === 'active').length : 0, icon: FaCheckCircle, color: "bg-green-500" },
    { label: "Total Views", value: Array.isArray(vehiclesData) ? vehiclesData.reduce((sum, v) => sum + (v.view_count || 0), 0) : 0, icon: FaEye, color: "bg-purple-500" },
    { label: "Featured", value: Array.isArray(vehiclesData) ? vehiclesData.filter(v => v.promotion_tier === 'featured' || v.is_featured).length : 0, icon: FaStar, color: "bg-yellow-500" },
  ];

  const featuredAdvertsStats = [
    { label: "Total Featured", value: Array.isArray(featuredAdvertsData) ? featuredAdvertsData.length : 0, icon: FaCrown, color: "bg-purple-500" },
    { label: "Active", value: Array.isArray(featuredAdvertsData) ? featuredAdvertsData.filter(ad => ad.is_active && ad.payment_status === 'paid').length : 0, icon: FaCheckCircle, color: "bg-green-500" },
    { label: "Total Views", value: Array.isArray(featuredAdvertsData) ? featuredAdvertsData.reduce((sum, ad) => sum + (ad.view_count || 0), 0) : 0, icon: FaEye, color: "bg-blue-500" },
    { label: "Total Saves", value: Array.isArray(featuredAdvertsData) ? featuredAdvertsData.reduce((sum, ad) => sum + (ad.save_count || 0), 0) : 0, icon: FaHeart, color: "bg-red-500" },
  ];

  const resortsTravelStats = [
    { label: "Total Listings", value: Array.isArray(resortsTravelData) ? resortsTravelData.length : 0, icon: FaPlane, color: "bg-teal-500" },
    { label: "Active", value: Array.isArray(resortsTravelData) ? resortsTravelData.filter(rt => rt.status === 'active').length : 0, icon: FaCheckCircle, color: "bg-green-500" },
    { label: "Total Views", value: Array.isArray(resortsTravelData) ? resortsTravelData.reduce((sum, rt) => sum + (rt.views || 0), 0) : 0, icon: FaEye, color: "bg-blue-500" },
    { label: "Featured", value: Array.isArray(resortsTravelData) ? resortsTravelData.filter(rt => rt.promotion_tier === 'premium' || rt.is_featured).length : 0, icon: FaStar, color: "bg-yellow-500" },
  ];

  const bannerStats = [
    { label: "Total Banners", value: Array.isArray(bannerData) ? bannerData.length : 0, icon: PiFlagBanner, color: "bg-indigo-500" },
    { label: "Active", value: Array.isArray(bannerData) ? bannerData.filter(b => b.status === 'active').length : 0, icon: FaCheckCircle, color: "bg-green-500" },
    { label: "Total Views", value: Array.isArray(bannerData) ? bannerData.reduce((sum, b) => sum + (b.views || 0), 0) : 0, icon: FaEye, color: "bg-blue-500" },
    { label: "Total Clicks", value: Array.isArray(bannerData) ? bannerData.reduce((sum, b) => sum + (b.clicks || 0), 0) : 0, icon: FaArrowUp, color: "bg-purple-500" },
  ];

  const fundingStats = [
    { label: "Total Projects", value: Array.isArray(fundingData) ? fundingData.length : 0, icon: FaDollarSign, color: "bg-green-500" },
    { label: "Active", value: Array.isArray(fundingData) ? fundingData.filter(p => p.status === 'active' || p.status === 'live').length : 0, icon: FaCheckCircle, color: "bg-blue-500" },
    { label: "Total Raised", value: Array.isArray(fundingData) ? fundingData.reduce((sum, p) => sum + (p.raised_amount || p.amount_raised || 0), 0) : 0, icon: FaDollarSign, color: "bg-purple-500" },
    { label: "Total Backers", value: Array.isArray(fundingData) ? fundingData.reduce((sum, p) => sum + (p.backers_count || p.supporters_count || 0), 0) : 0, icon: FaUsers, color: "bg-orange-500" },
  ];

  const affiliateStats = [
    { label: "Business Offers", value: userDashboard?.affiliate_ads?.stats?.total_affiliates || 0, icon: FaBriefcase, color: "bg-purple-500" },
    { label: "Active Offers", value: userDashboard?.affiliate_ads?.stats?.active_affiliates || 0, icon: FaCheckCircle, color: "bg-green-500" },
    { label: "Banner Ads", value: userDashboard?.banner_ads?.stats?.total_banners || 0, icon: PiFlagBanner, color: "bg-indigo-500" },
    { label: "Total Spent", value: userDashboard?.affiliate_ads?.stats?.total_spent_affiliates || 0, icon: FaDollarSign, color: "bg-yellow-500" },
  ];

  const propertiesStats = [
    { label: "Total Properties", value: Array.isArray(propertiesData) ? propertiesData.length : 0, icon: FaHome, color: "bg-blue-500" },
    { label: "Active", value: Array.isArray(propertiesData) ? propertiesData.filter(p => p.status === 'active' || p.active).length : 0, icon: FaCheckCircle, color: "bg-green-500" },
    { label: "Total Views", value: Array.isArray(propertiesData) ? propertiesData.reduce((sum, p) => sum + (p.views || p.view_count || 0), 0) : 0, icon: FaEye, color: "bg-purple-500" },
    { label: "Featured", value: Array.isArray(propertiesData) ? propertiesData.filter(p => p.is_featured || p.promotion_tier === 'featured').length : 0, icon: FaStar, color: "bg-yellow-500" },
  ];

  const donationsStats = [
    { label: "Total Campaigns", value: Array.isArray(donationsData) ? donationsData.length : 0, icon: FaHandHoldingHeart, color: "bg-pink-500" },
    { label: "Active", value: Array.isArray(donationsData) ? donationsData.filter(d => d.status === 'active').length : 0, icon: FaCheckCircle, color: "bg-green-500" },
    { label: "Total Raised", value: Array.isArray(donationsData) ? donationsData.reduce((sum, d) => sum + (d.raised_amount || d.amount_raised || 0), 0) : 0, icon: FaDollarSign, color: "bg-blue-500" },
    { label: "Total Goal", value: Array.isArray(donationsData) ? donationsData.reduce((sum, d) => sum + (d.goal_amount || d.target_amount || 0), 0) : 0, icon: FaChartLine, color: "bg-purple-500" },
  ];

  const adsStats = [
    { label: "Total Ads", value: Array.isArray(userBuySellAds) ? userBuySellAds.length : 0, icon: FaTags, color: "bg-blue-500" },
    { label: "Active", value: Array.isArray(userBuySellAds) ? userBuySellAds.filter(ad => ad.status === 'active').length : 0, icon: FaCheckCircle, color: "bg-green-500" },
    { label: "Total Views", value: Array.isArray(userBuySellAds) ? userBuySellAds.reduce((sum, ad) => sum + (ad.views || 0), 0) : 0, icon: FaEye, color: "bg-purple-500" },
    { label: "Total Saves", value: Array.isArray(userBuySellAds) ? userBuySellAds.reduce((sum, ad) => sum + (ad.saves || 0), 0) : 0, icon: FaHeart, color: "bg-red-500" },
  ];

  const quickActions = [
    { label: "Post New Ad", icon: FaPlus, tab: "buy-sell", route: "/dashboard?tab=buy-sell&create=true", color: "bg-blue-500" },
    { label: "Post Job", icon: FaBriefcase, tab: "jobs", route: "/dashboard?tab=jobs&postForm=true", color: "bg-green-500" },
    { label: "Create Job Seeker Profile", icon: FaUser, tab: "jobseeker", route: "/dashboard?tab=jobseeker", color: "bg-purple-500" },
    { label: "Post Book", icon: FaBook, tab: "books", route: "/dashboard?tab=books", color: "bg-indigo-500" },
    { label: "Post Service", icon: FaBriefcase, tab: "services", route: "/dashboard?tab=services", color: "bg-purple-500" },
    { label: "Post Event/Venue", icon: FaCalendar, tab: "events-venues", route: "/dashboard?tab=events-venues", color: "bg-pink-500" },
    { label: "Post Sponsored Advert", icon: FaCrown, tab: "sponsored", route: "/dashboard?tab=sponsored", color: "bg-yellow-500" },
    { label: "List Business for Sale", icon: HiOutlineOfficeBuilding, tab: "sponsored", route: "/dashboard?tab=sponsored&create=true&advert_type=business", color: "bg-orange-500" },
    { label: "Post Vehicle", icon: FaCar, tab: "vehicles", route: "/dashboard?tab=vehicles", color: "bg-blue-600" },
    { label: "Post Featured Advert", icon: FaCrown, tab: "featured", route: "/dashboard?tab=featured", color: "bg-purple-600" },
    { label: "Post Resort/Travel", icon: FaPlane, tab: "resorts-travel", route: "/dashboard?tab=resorts-travel", color: "bg-teal-500" },
    { label: "Post Banner", icon: PiFlagBanner, tab: "banners", route: "/dashboard?tab=banners&create=true", color: "bg-indigo-500" },
    { label: "Post Property", icon: FaHome, tab: "properties", route: "/dashboard?tab=properties&create=true", color: "bg-teal-600" },
    { label: "Create Donation", icon: FaHandHoldingHeart, tab: "donations", route: "/dashboard?tab=donations&create=true", color: "bg-pink-500" },
    { label: "Post Funding", icon: FaDollarSign, tab: "funding", route: "/dashboard?tab=funding&create=true", color: "bg-emerald-600" },
    { label: "Post Business Listing", icon: HiOutlineOfficeBuilding, tab: "business", route: "/dashboard?tab=business&create=true", color: "bg-purple-500" },
    { label: "Sell a Template", icon: FaFileAlt, tab: "templates", route: "/dashboard?tab=templates&create=true", color: "bg-violet-600" },
    { label: "My Store", icon: HiOutlineShoppingBag, tab: "store", route: "/dashboard?tab=store", color: "bg-green-500" },
    { label: "Invite Team", icon: FaUsers, tab: "team", route: "/dashboard?tab=team", color: "bg-slate-700" },
    { label: "Account Settings", icon: FaCog, tab: "security", route: "/dashboard?tab=security&section=profile", color: "bg-gray-500" },
  ];

  const dashboardTabs = [
    { id: "overview", label: "Dashboard", icon: FaHome },
    { id: "team", label: "Team", icon: FaUsers },
    { id: "purchases", label: "My Purchases", icon: FaShoppingBag },
    { id: "notifications", label: "Notifications", icon: FaBell },
    { id: "security", label: "Account Settings", icon: FaCog },
    { id: "affiliates", label: "Affiliates", icon: FaDollarSign },
    { id: "commerce", label: "Sales & Purchases", icon: FaShoppingBag },
    { id: "templates", label: "Templates", icon: FaFileAlt },
    { id: "jobs", label: "Jobs", icon: FaBriefcase },
    { id: "jobseeker", label: "Job Seeker", icon: FaUsers },
    { id: "books", label: "Books", icon: FaBook },
    { id: "services", label: "Services", icon: FaBriefcase },
    { id: "buy-sell", label: "Buy & Sell", icon: FaTags },
    { id: "business", label: "Business", icon: FaBuilding },
    { id: "events-venues", label: "Entertainment", icon: FaCalendar },
    { id: "resorts-travel", label: "Resorts & Travel", icon: FaPlane },
    { id: "properties", label: "Properties", icon: FaHome },
    { id: "sponsored", label: "Sponsored", icon: FaCrown },
    { id: "featured", label: "Featured Adverts", icon: FaCrown },
    { id: "vehicles", label: "Vehicles", icon: FaCar },
    { id: "fleet", label: "Fleet", icon: FaCar },
    { id: "banners", label: "Banner Ads", icon: PiFlagBanner },
    { id: "funding", label: "Funding", icon: FaDollarSign },
    { id: "donations", label: "Donations", icon: FaHandHoldingHeart },
    { id: "store", label: "Store", icon: FaStore },
  ];

  const accountType = resolveAccountType(userDetail);
  const isBusinessUser = accountType === ACCOUNT_TYPE_BUSINESS;
  const lockedMode = isBusinessUser ? 'selling' : 'buying';

  const businessCategoryId = useMemo(() => {
    if (!isBusinessUser) return null;

    // Demo emails always win (buy-sell-demo → buy-sell) — ignore stale localStorage drafts
    const fromEmail = categoryFromDemoEmail(userDetail?.email);
    if (fromEmail) return fromEmail;

    let draft = null;
    try {
      draft = JSON.parse(localStorage.getItem('wwa_business_profile_draft') || 'null');
    } catch {
      draft = null;
    }

    return (
      resolveBusinessDashboardCategory({
        dashboard_category:
          userDetail?.dashboard_category ||
          businessStoreData?.dashboard_category ||
          businessStoreData?.business_category_slug ||
          draft?.dashboard_category ||
          draft?.business_category_slug,
        business_category_slug:
          userDetail?.business_category_slug ||
          businessStoreData?.business_category_slug ||
          draft?.business_category_slug,
        business_category:
          userDetail?.business_category ||
          businessStoreData?.business_category ||
          draft?.business_category,
      }) || null
    );
  }, [isBusinessUser, userDetail, businessStoreData]);

  const allowedTabIds = useMemo(() => {
    if (lockedMode === 'buying') return BUYING_TAB_IDS;
    if (isBusinessUser && businessCategoryId) {
      return getBusinessSidebarTabIds(businessCategoryId);
    }
    return SELLING_TAB_IDS;
  }, [lockedMode, isBusinessUser, businessCategoryId]);

  const filteredQuickActions = useMemo(() => {
    // Basic accounts never get seller quick-action tiles
    if (!isBusinessUser) return [];
    if (!businessCategoryId) return quickActions;
    const allowed = new Set([
      ...(CATEGORY_QUICK_ACTION_TABS[businessCategoryId] || []),
      'team',
      'templates',
      'security',
      'affiliates',
      'books',
    ]);
    return quickActions.filter((a) => !a.tab || allowed.has(a.tab));
  }, [isBusinessUser, businessCategoryId]);

  const pendingOverviewItems = useMemo(() => {
    const packs = [
      { items: userBuySellAds, label: 'Buy & Sell' },
      { items: featuredAdvertsData, label: 'Featured' },
      { items: sponsoredAdvertsData, label: 'Sponsored' },
      { items: bannerData, label: 'Banner' },
      { items: vehiclesData, label: 'Vehicle' },
      { items: userServices, label: 'Service' },
      { items: propertiesData, label: 'Property' },
      { items: donationsData, label: 'Donation' },
      { items: fundingData, label: 'Funding' },
      { items: eventsVenuesData, label: 'Event' },
      { items: resortsTravelData, label: 'Resort' },
      { items: jobsData?.recentJobs, label: 'Job' },
      { items: booksData?.recentBooks || booksData?.books, label: 'Book' },
    ];
    const out = [];
    packs.forEach(({ items, label }) => {
      if (!Array.isArray(items)) return;
      items.forEach((item) => {
        if (!isListingAwaitingPayment(item)) return;
        out.push({
          title: item.title || item.name || item.job_title || `${label} listing`,
          message: `${label}: awaiting payment — clear invoice to go live.`,
        });
      });
    });
    return out.slice(0, 8);
  }, [
    userBuySellAds,
    featuredAdvertsData,
    sponsoredAdvertsData,
    bannerData,
    vehiclesData,
    userServices,
    propertiesData,
    donationsData,
    fundingData,
    eventsVenuesData,
    resortsTravelData,
    jobsData,
    booksData,
  ]);

  const mockOverviewInsights = useMemo(
    () => ({
      notifications: { unread: unreadNotifications, recent: [] },
      sales: { sold_items: 0 },
    }),
    [unreadNotifications]
  );

  // Keep URL mode aligned with account type (basic buys, business posts)
  useEffect(() => {
    persistAccountType(accountType);
    const nextParams = new URLSearchParams(window.location.search);
    let changed = false;
    if (nextParams.get('mode') !== lockedMode) {
      nextParams.set('mode', lockedMode);
      changed = true;
    }
    // Redirect legacy My category tab → Dashboard
    if (nextParams.get('tab') === 'category-dash') {
      nextParams.set('tab', 'overview');
      changed = true;
      setActiveTab('overview');
    }
    if (businessCategoryId && nextParams.get('category') !== businessCategoryId) {
      nextParams.set('category', businessCategoryId);
      changed = true;
    }
    if (changed) setSearchParams(nextParams, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountType, lockedMode, businessCategoryId]);

  useEffect(() => {
    if (!allowedTabIds.has(activeTab) || activeTab === 'category-dash') {
      setActiveTab('overview');
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('tab', 'overview');
      nextParams.set('mode', lockedMode);
      if (businessCategoryId) nextParams.set('category', businessCategoryId);
      setSearchParams(nextParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowedTabIds, activeTab, lockedMode, businessCategoryId]);

  const visibleTabs = dashboardTabs.filter((tab) => allowedTabIds.has(tab.id));
  const categoryMeta = businessCategoryId ? getDashboardCategory(businessCategoryId) : null;

  const headerTabLabel = useMemo(() => {
    const tab =
      visibleTabs.find((t) => t.id === activeTab) ||
      dashboardTabs.find((t) => t.id === activeTab);
    if (!tab) return 'Dashboard';
    if (!isBusinessUser) {
      if (tab.id === 'commerce') return 'Digital purchases';
      if (tab.id === 'affiliates') return 'My promotions';
    }
    return tab.label;
  }, [visibleTabs, activeTab, isBusinessUser]);

  const handleDashboardModeChange = () => {};

  const openDashboardTab = (tab, { create = false, section = null, sub = null } = {}) => {
    setActiveTab(tab);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', tab);
    nextParams.set('mode', lockedMode);
    nextParams.delete('postForm');
    if (create) {
      nextParams.set('create', 'true');
      nextParams.set('sub', sub || 'create');
    } else if (sub) {
      nextParams.set('sub', sub);
      nextParams.delete('create');
    } else {
      nextParams.delete('create');
      nextParams.delete('sub');
    }
    if (tab === 'security') {
      nextParams.set('section', section || 'profile');
    } else {
      nextParams.delete('section');
    }
    setSearchParams(nextParams);
  };

  const tabStatsMap = {
    overview: stats,
    books: booksStats,
    jobs: jobsStats,
    services: servicesStats,
    jobseeker: jobSeekerStats,
    store: storeStats,
    business: businessStats,
    'category-dash': [],
    'events-venues': eventsVenuesStats,
    'resorts-travel': resortsTravelStats,
    banners: bannerStats,
    sponsored: sponsoredStats,
    featured: featuredAdvertsStats,
    vehicles: vehiclesStats,
    funding: fundingStats,
    // Basic/buyer: AffiliateManagement shows promoter KPIs; hide seller "Business Offers" strip
    affiliates: lockedMode === 'buying' ? [] : affiliateStats,
    properties: propertiesStats,
    donations: donationsStats,
    ads: adsStats,
    'buy-sell': adsStats,
  };
  const currentStats = tabStatsMap[activeTab] || stats;

  if (!logIn) {
    return <UserForm />;
  }

  return (
    <div className="dash-shell">
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`
          dash-sidebar
          fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw]
          transform transition-transform duration-300 ease-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0 lg:z-30 lg:max-w-none lg:inset-auto
          ${sidebarCollapsed ? 'lg:w-[4.75rem]' : 'lg:w-[17rem]'}
          lg:flex-shrink-0
        `}
      >
        <div className="dash-sidebar-brand">
          {!sidebarCollapsed && (
            <Link to="/" className="flex items-center space-x-3 min-w-0">
              <img src="/img/wwaLogoTransparantStroke.png" alt="WWA" className="h-8 w-auto" />
            </Link>
          )}
          <div className="flex items-center gap-1 ml-auto">
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:inline-flex dash-icon-btn !w-9 !h-9"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <FaChevronRight className="w-3.5 h-3.5" /> : <FaChevronLeft className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden dash-icon-btn !w-9 !h-9"
              aria-label="Close menu"
            >
              <FaTimesCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className={`dash-sidebar-profile ${sidebarCollapsed && !mobileMenuOpen ? 'lg:hidden' : ''}`}>
          {isBusinessUser ? <FaCrown className="dash-crown h-4 w-4" /> : null}
          <div className="dash-avatar">
            {(userDetail?.name || 'U').slice(0, 1).toUpperCase()}
          </div>
          <div className="mt-3 min-w-0">
            <p className="font-semibold truncate text-sm text-white">
              {userDetail?.name || 'User'}
            </p>
            <p className="text-xs text-[color:var(--dash-muted)] truncate">{userDetail?.email || ''}</p>
          </div>
        </div>

        <DashboardSidebarNav
          visibleTabs={visibleTabs}
          activeTab={activeTab}
          activeSub={searchParams.get('sub')}
          lockedMode={lockedMode}
          isBusinessUser={isBusinessUser}
          sidebarCollapsed={sidebarCollapsed}
          accountBadgeTitle={isBusinessUser ? 'Business account' : 'Basic account'}
          accountBadgeSubtitle={
            isBusinessUser
              ? categoryMeta
                ? `${categoryMeta.emoji} ${categoryMeta.name}`
                : 'Post & manage listings'
              : 'Browse & purchase'
          }
          onNavigate={(tabId, opts = {}) => {
            setActiveTab(tabId);
            setMobileMenuOpen(false);
            const nextParams = new URLSearchParams(searchParams);
            nextParams.set('tab', tabId);
            nextParams.set('mode', lockedMode);
            nextParams.delete('postForm');
            if (opts.sub) {
              nextParams.set('sub', opts.sub);
              if (opts.sub === 'create') nextParams.set('create', 'true');
              else nextParams.delete('create');
            } else {
              nextParams.delete('sub');
              nextParams.delete('create');
            }
            if (businessCategoryId) nextParams.set('category', businessCategoryId);
            else nextParams.delete('category');
            setSearchParams(nextParams);
          }}
        />

        <div className="p-3 border-t border-white/10 space-y-1 mt-auto">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="dash-nav-item"
            title="Back to Website"
          >
            <span className="dash-nav-ico">
              <FaExternalLinkAlt className="w-3.5 h-3.5" />
            </span>
            <span className={sidebarCollapsed ? 'lg:hidden' : ''}>Website</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="dash-nav-item hover:!bg-rose-500/15 hover:!text-rose-300"
          >
            <span className="dash-nav-ico !bg-rose-500/15 !text-rose-300">
              <FaSignOutAlt className="w-3.5 h-3.5" />
            </span>
            <span className={sidebarCollapsed ? 'lg:hidden' : ''}>Logout</span>
          </button>
        </div>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden dash-icon-btn"
              aria-label="Open menu"
            >
              <FaBars className="h-4 w-4" />
            </button>
            <div className="min-w-0 hidden sm:block">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--dash-muted)]">
                {isBusinessUser ? 'Business panel' : 'User panel'}
              </p>
              <h1 className="text-lg font-bold text-white tracking-tight truncate">
                Dashboard
              </h1>
            </div>
            <h1 className="text-base font-bold text-white sm:hidden truncate">
              Dashboard
            </h1>
          </div>

          <div className="dash-search hidden md:flex">
            <FaSearch className="h-3.5 w-3.5 text-[color:var(--dash-muted)] flex-shrink-0" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your dashboard…"
              aria-label="Search dashboard"
            />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to="/" className="dash-icon-btn hidden sm:inline-flex" title="Back to Website">
              <FaExternalLinkAlt className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => {
                setActiveTab('notifications');
                const nextParams = new URLSearchParams(searchParams);
                nextParams.set('tab', 'notifications');
                nextParams.set('mode', lockedMode);
                setSearchParams(nextParams);
              }}
              className="dash-icon-btn"
              aria-label="Notifications"
            >
              <FaBell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[0.5rem] h-2 w-2 bg-[color:var(--dash-accent)] rounded-full ring-2 ring-[#043447]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => openDashboardTab('security')}
              className="dash-icon-btn"
              aria-label="Account settings"
            >
              <FaCog className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => openDashboardTab('security')}
              className="hidden sm:flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-[rgba(142,240,90,0.35)] transition-colors"
            >
              <span className="dash-avatar !w-8 !h-8 !text-xs !border-2">
                {(userDetail?.name || 'U').slice(0, 1).toUpperCase()}
              </span>
              <span className="text-xs font-semibold text-white max-w-[7rem] truncate">
                {userDetail?.name || 'Account'}
              </span>
            </button>
          </div>
        </header>

        <main className="dash-content">
          <div className="dash-content-inner">
            {activeTab === 'overview' ? (
              <div className="space-y-6">
                <DashboardMockOverview
                  isBusinessUser={isBusinessUser}
                  overviewStats={overviewStats}
                  insights={mockOverviewInsights}
                  pendingItems={pendingOverviewItems}
                  onOpenTab={openDashboardTab}
                />
                <FriendCenterPanel userId={userDetail?.user_id || userDetail?.id} />
                {isBusinessUser ? (
                  <>
                    <BusinessCategoryDashboardPanel embedded />
                    {filteredQuickActions.length > 0 && (
                      <div className="dash-card overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/10">
                          <h2 className="text-lg font-bold text-white">
                            Quick actions
                            {categoryMeta ? ` · ${categoryMeta.name}` : ''}
                          </h2>
                          <p className="text-sm text-[color:var(--dash-muted)] mt-0.5">
                            Only actions for your category
                          </p>
                        </div>
                        <div className="p-5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {filteredQuickActions.map((action, index) => (
                              <Link
                                key={index}
                                to={action.route}
                                className={`flex items-center p-4 rounded-2xl ${action.color} text-white hover:opacity-95 transition-all shadow-md hover:-translate-y-0.5`}
                              >
                                <action.icon className="h-5 w-5 mr-3 shrink-0" />
                                <span className="font-semibold text-sm">{action.label}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <NormalUserModeHome
                      mode={lockedMode}
                      accountType={accountType}
                      onModeChange={handleDashboardModeChange}
                      onOpenTab={openDashboardTab}
                    />
                    <BuyerPurchasesHub />
                    <DashboardInsightsOverview accountHint="personal" />
                  </>
                )}
              </div>
            ) : activeTab === 'purchases' ? (
              <BuyerPurchasesHub />
            ) : activeTab === 'security' ? (
              <DashboardAccountSettingsPanel
                isBusinessUser={isBusinessUser}
                businessCategoryId={businessCategoryId}
              />
            ) : activeTab === 'notifications' ? (
              <DashboardNotificationsPanel />
            ) : activeTab === 'fleet' ? (
              <FleetManagement />
            ) : (
              <DashboardTabPanel
                activeTab={activeTab}
                stats={currentStats}
                searchParams={searchParams}
                clearCreateParam={clearCreateParam}
                onJobsChange={loadPostedJobs}
                onPropertiesChange={loadPropertiesData}
                isBusinessUser={isBusinessUser}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
