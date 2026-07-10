import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./slice/AuthSlice";
import ListSlice from "./slice/ListSlice";
import CategorySlice from "./slice/CategorySlice";
import PackageSlice from "./slice/PackageSlice";
import FundingSlice from "./slice/FundingSlice";
import AffiliateSLice from "./slice/AffiliateSLice";
import LanguageSlice from "./slice/LanguageSlice";
import StoreSlice from "./slice/StoreSlice";
import GeoLocSlice from "./slice/GeoLocationSlice";
import BannerSlice from "./slice/BannerSlice";
import JobSlice from "./slice/JobSlice";
import CandidateSlice from "./slice/CandidateSlice";
import ServicesSolutionsSlice from "./slice/ServicesSolutionsSlice";
import JobAlertSlice from "./slice/JobAlertSlice";
import UpsellSlice from "./slice/UpsellSlice";
import DashboardSlice from "./slice/DashboardSlice";
import AnalyticsSlice from "./slice/AnalyticsSlice";
import UserSlice from "./slice/UserSlice";
import StaffSlice from "./slice/StaffSlice";
import AdModerationSlice from "./slice/AdModerationSlice";
import ClassifiedSlice from "./slice/ClassifiedSlice";
import KycSlice from "./slice/KycSlice";
import BooksSlice from "./slice/BooksSlice";
import AffiliateSLice_OLD_DEPRECATED from "./slice/AffiliateSLice_OLD_DEPRECATED";

// Persist configuration for auth slice only
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['userDetail', 'customerId', 'token'], // Remove 'logIn' - it should always start as false
  blacklist: ['loading', 'authError', 'authMessage', 'logIn'] // Don't persist logIn state or temporary states
};

const reducer = {
  auth: persistReducer(authPersistConfig, authSlice), // Apply persist reducer to auth slice only
  ads: ListSlice,
  categories: CategorySlice,
  package: PackageSlice,
  fund: FundingSlice,
  aff: AffiliateSLice,
  lang: LanguageSlice,
  store: StoreSlice,
  location: GeoLocSlice,
  banner: BannerSlice,
  jobs: JobSlice,
  candidates: CandidateSlice,
  servicesSolutions: ServicesSolutionsSlice,
  jobAlerts: JobAlertSlice,
  upsells: UpsellSlice,
  dashboard: DashboardSlice,
  analytics: AnalyticsSlice,
  users: UserSlice,
  staff: StaffSlice,
  adModeration: AdModerationSlice,
  classified: ClassifiedSlice,
  kyc: KycSlice,
  books: BooksSlice,
};

const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: {
        // Large app state can exceed the default 32ms dev threshold
        warnAfter: process.env.NODE_ENV === 'production' ? 32 : 256,
      },
      serializableCheck: {
        // Disable serializable check in development to avoid performance warnings
        // It's already disabled in production by default
        warnAfter: process.env.NODE_ENV === 'production' ? 32 : 256,
        // Ignore redux-persist actions for serializable check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

export default store;
