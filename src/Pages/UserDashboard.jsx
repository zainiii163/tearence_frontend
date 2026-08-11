import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getUserDashboard } from "../slice/DashboardSlice";
import { getCategoriesList } from "../slice/CategorySlice";
import { getStore, getBusinessStore } from "../slice/StoreSlice";
import { logOut } from "../slice/AuthSlice";
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
  FaShieldAlt,
} from "react-icons/fa";
import { HiOutlineOfficeBuilding, HiOutlineShoppingBag } from "react-icons/hi";
import { PiFlagBanner } from "react-icons/pi";
import UserForm from "../Component/UserForm";
import DashboardTabPanel from "../Component/dashboard/DashboardTabPanel";
import DashboardInsightsOverview from "../Component/dashboard/DashboardInsightsOverview";
import DashboardSecurityPanel from "../Component/dashboard/DashboardSecurityPanel";
import DashboardNotificationsPanel from "../Component/dashboard/DashboardNotificationsPanel";
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
} from "../utils/dashboardStatsHelpers";
import { getAuthToken } from "../utils/auth";

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.worldwideadverts.info/api/v1';

const DASHBOARD_TAB_IDS = [
  'overview', 'purchases', 'category-dash', 'jobs', 'jobseeker', 'books', 'services', 'events-venues',
  'resorts-travel', 'sponsored', 'featured', 'vehicles', 'banners',
  'funding', 'ads', 'buy-sell', 'store', 'business', 'affiliates', 'properties', 'donations',
  'templates', 'commerce', 'notifications', 'security',
];

const BUYING_TAB_IDS = new Set([
  'overview',
  'purchases',
  'commerce',
  'jobseeker',
  'notifications',
  'security',
]);

const SELLING_TAB_IDS = new Set([
  'overview',
  'category-dash',
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
    if (logIn && activeTab === 'overview') {
      loadOverviewStats().catch(() => {});
    }
  }, [logIn, activeTab]);

  const loadTabData = async (tab) => {
    if (!logIn) return;

    switch (tab) {
      case 'overview':
        await loadOverviewStats();
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
    { label: "Post New Ad", icon: FaPlus, route: "/dashboard?tab=buy-sell&create=true", color: "bg-blue-500" },
    { label: "Post Job", icon: FaBriefcase, route: "/dashboard?tab=jobs&postForm=true", color: "bg-green-500" },
    { label: "Create Job Seeker Profile", icon: FaUser, route: "/dashboard?tab=jobseeker", color: "bg-purple-500" },
    { label: "Post Book", icon: FaBook, route: "/dashboard?tab=books", color: "bg-indigo-500" },
    { label: "Post Service", icon: FaBriefcase, route: "/dashboard?tab=services", color: "bg-purple-500" },
    { label: "Post Event/Venue", icon: FaCalendar, route: "/dashboard?tab=events-venues", color: "bg-pink-500" },
    { label: "Post Sponsored Advert", icon: FaCrown, route: "/dashboard?tab=sponsored", color: "bg-yellow-500" },
    { label: "List Business for Sale", icon: HiOutlineOfficeBuilding, route: "/dashboard?tab=sponsored&create=true&advert_type=business", color: "bg-orange-500" },
    { label: "Post Vehicle", icon: FaCar, route: "/dashboard?tab=vehicles", color: "bg-blue-600" },
    { label: "Post Featured Advert", icon: FaCrown, route: "/dashboard?tab=featured", color: "bg-purple-600" },
    { label: "Post Resort/Travel", icon: FaPlane, route: "/dashboard?tab=resorts-travel", color: "bg-teal-500" },
    { label: "Post Banner", icon: PiFlagBanner, route: "/dashboard?tab=banners&create=true", color: "bg-indigo-500" },
    { label: "Post Property", icon: FaHome, route: "/dashboard?tab=properties&create=true", color: "bg-teal-600" },
    { label: "Create Donation", icon: FaHandHoldingHeart, route: "/dashboard?tab=donations&create=true", color: "bg-pink-500" },
    { label: "Post Business Listing", icon: HiOutlineOfficeBuilding, route: "/dashboard?tab=business&create=true", color: "bg-purple-500" },
    { label: "Sell a Template", icon: FaFileAlt, route: "/dashboard?tab=templates&create=true", color: "bg-violet-600" },
    { label: "My Store", icon: HiOutlineShoppingBag, route: "/dashboard?tab=store", color: "bg-green-500" },
    { label: "Account Settings", icon: FaCog, route: "/account", color: "bg-gray-500" },
  ];

  const recentPosts = Array.isArray(userDashboard?.my_listings)
    ? userDashboard.my_listings
    : Array.isArray(userDashboard?.advert_posts?.posted_ads)
      ? userDashboard.advert_posts.posted_ads
      : [];
  const recentBooks = Array.isArray(booksData?.recentBooks) ? booksData.recentBooks : [];
  const recentAds = userBuySellAds.length > 0
    ? userBuySellAds
    : recentPosts.filter(post => post.type === 'ad');

  const dashboardTabs = [
    { id: "overview", label: "Dashboard", icon: FaHome },
    { id: "category-dash", label: "My category", icon: FaBuilding },
    { id: "purchases", label: "My Purchases", icon: FaShoppingBag },
    { id: "notifications", label: "Notifications", icon: FaBell },
    { id: "security", label: "Security / 2FA", icon: FaShieldAlt },
    { id: "jobs", label: "Jobs", icon: FaBriefcase },
    { id: "jobseeker", label: "Job Seeker", icon: FaUsers },
    { id: "books", label: "Books", icon: FaBook },
    { id: "templates", label: "Templates", icon: FaFileAlt },
    { id: "commerce", label: "Sales & Purchases", icon: FaShoppingBag },
    { id: "services", label: "Services", icon: FaBriefcase },
    { id: "buy-sell", label: "Buy & Sell", icon: FaTags },
    { id: "business", label: "Business", icon: FaBuilding },
    { id: "events-venues", label: "Events & Venues", icon: FaCalendar },
    { id: "resorts-travel", label: "Resorts & Travel", icon: FaPlane },
    { id: "properties", label: "Properties", icon: FaHome },
    { id: "sponsored", label: "Sponsored", icon: FaCrown },
    { id: "featured", label: "Featured Adverts", icon: FaCrown },
    { id: "vehicles", label: "Vehicles", icon: FaCar },
    { id: "banners", label: "Banner Ads", icon: PiFlagBanner },
    { id: "funding", label: "Funding", icon: FaDollarSign },
    { id: "donations", label: "Donations", icon: FaHandHoldingHeart },
    { id: "store", label: "Store", icon: FaStore },
    { id: "affiliates", label: "Affiliates", icon: FaDollarSign },
  ];

  const accountType = resolveAccountType(userDetail);
  const isBusinessUser = accountType === ACCOUNT_TYPE_BUSINESS;
  const lockedMode = isBusinessUser ? 'selling' : 'buying';

  // Keep URL mode aligned with account type (basic buys, business posts)
  useEffect(() => {
    persistAccountType(accountType);
    const nextParams = new URLSearchParams(window.location.search);
    if (nextParams.get('mode') !== lockedMode) {
      nextParams.set('mode', lockedMode);
      setSearchParams(nextParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-sync when account type / locked mode changes
  }, [accountType, lockedMode]);

  useEffect(() => {
    const allowed = lockedMode === 'buying' ? BUYING_TAB_IDS : SELLING_TAB_IDS;
    if (!allowed.has(activeTab)) {
      setActiveTab('overview');
    }
  }, [lockedMode, activeTab]);

  const visibleTabs = dashboardTabs.filter((tab) => {
    const allow = lockedMode === 'buying' ? BUYING_TAB_IDS : SELLING_TAB_IDS;
    return allow.has(tab.id);
  });

  const handleDashboardModeChange = () => {};

  const openDashboardTab = (tab, { create = false } = {}) => {
    setActiveTab(tab);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', tab);
    nextParams.set('mode', lockedMode);
    nextParams.delete('postForm');
    if (create) nextParams.set('create', 'true');
    else nextParams.delete('create');
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
    affiliates: affiliateStats,
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-gray-900 text-white flex-shrink-0 transition-all duration-300 fixed h-full z-30 lg:relative`}>
        {/* Logo/Brand */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <FaBriefcase className="text-white text-sm" />
              </div>
              <span className="font-bold text-lg">WWA</span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            {sidebarCollapsed ? <FaChevronRight className="w-4 h-4" /> : <FaChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <FaUser className="text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{userDetail?.name || "User"}</p>
                <p className="text-xs text-gray-400 truncate">{userDetail?.email || ""}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {!sidebarCollapsed && (
            <div className="mb-3 rounded-lg bg-gray-800 px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                {isBusinessUser ? 'Business account' : 'Basic account'}
              </p>
              <p className="text-xs text-gray-300 mt-0.5">
                {isBusinessUser ? 'Post & manage listings' : 'Browse & purchase'}
              </p>
            </div>
          )}
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileMenuOpen(false);
                const nextParams = new URLSearchParams(searchParams);
                nextParams.set('tab', tab.id);
                nextParams.set('mode', lockedMode);
                nextParams.delete('postForm');
                nextParams.delete('create');
                if (tab.id !== 'category-dash') {
                  nextParams.delete('category');
                } else if (!nextParams.get('category')) {
                  try {
                    const draft = JSON.parse(localStorage.getItem('wwa_business_profile_draft') || 'null');
                    const slug = draft?.dashboard_category || draft?.business_category_slug;
                    if (slug) nextParams.set('category', slug);
                  } catch {
                    /* ignore */
                  }
                }
                setSearchParams(nextParams);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <tab.icon className={`w-5 h-5 flex-shrink-0 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
              {!sidebarCollapsed && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>

        {/* Back to Website & Logout */}
        <div className="p-4 border-t border-gray-700 space-y-1">
          <Link
            to="/"
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            title="Back to Website"
          >
            <FaExternalLinkAlt className={`w-5 h-5 flex-shrink-0 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
            {!sidebarCollapsed && <span>Back to Website</span>}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
          >
            <FaSignOutAlt className={`w-5 h-5 flex-shrink-0 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
                >
                  <FaBars className="h-6 w-6" />
                </button>
                <h1 className="text-xl font-semibold text-gray-900">
                  {visibleTabs.find(t => t.id === activeTab)?.label
                    || dashboardTabs.find(t => t.id === activeTab)?.label
                    || 'Dashboard'}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                  title="Back to Website"
                >
                  <FaExternalLinkAlt className="h-4 w-4" />
                  <span className="hidden sm:inline">Back to Website</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('notifications');
                    const nextParams = new URLSearchParams(searchParams);
                    nextParams.set('tab', 'notifications');
                    setSearchParams(nextParams);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 relative"
                  aria-label="Notifications"
                >
                  <FaBell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 min-w-[0.5rem] h-2 w-2 bg-red-500 rounded-full" />
                  )}
                </button>
                <Link to="/account" className="p-2 text-gray-400 hover:text-gray-600">
                  <FaCog className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === 'overview' ? (
              <div className="space-y-8">
                <NormalUserModeHome
                  mode={lockedMode}
                  accountType={accountType}
                  onModeChange={handleDashboardModeChange}
                  onOpenTab={openDashboardTab}
                />
                {lockedMode === 'buying' ? (
                  <BuyerPurchasesHub />
                ) : (
                  <>
                    <DashboardInsightsOverview
                      accountHint={isBusinessUser ? 'business' : 'personal'}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {currentStats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-lg shadow p-6">
                          <div className="flex items-center">
                            <div className={`p-3 rounded-full ${stat.color} text-white mr-4`}>
                              <stat.icon className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {lockedMode === 'selling' && (
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {quickActions.map((action, index) => (
                        <Link
                          key={index}
                          to={action.route}
                          className={`flex items-center p-4 rounded-lg ${action.color} text-white hover:opacity-90 transition-opacity`}
                        >
                          <action.icon className="h-5 w-5 mr-3" />
                          <span className="font-medium">{action.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                )}
              </div>
            ) : activeTab === 'purchases' ? (
              <BuyerPurchasesHub />
            ) : activeTab === 'security' ? (
              <DashboardSecurityPanel />
            ) : activeTab === 'notifications' ? (
              <DashboardNotificationsPanel />
            ) : (
              <DashboardTabPanel
                activeTab={activeTab}
                stats={currentStats}
                searchParams={searchParams}
                clearCreateParam={clearCreateParam}
                onJobsChange={loadPostedJobs}
                onPropertiesChange={loadPropertiesData}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
