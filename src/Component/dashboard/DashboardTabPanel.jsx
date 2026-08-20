import React from 'react';
import JobsManagement from './JobsManagement';
import JobSeekerManagement from './JobSeekerManagement';
import BooksManagement from './BooksManagement';
import ServicesManagement from './ServicesManagement';
import EventsVenuesManagement from './EventsVenuesManagement';
import ResortsTravelManagement from './ResortsTravelManagement';
import SponsoredManagement from './SponsoredManagement';
import FeaturedAdvertsManagement from './FeaturedAdvertsManagement';
import VehiclesManagement from './VehiclesManagement';
import FleetManagement from './FleetManagement';
import BannerManagement from './BannerManagement';
import FundingManagement from './FundingManagement';
import AdsManagement from './AdsManagement';
import StoreManagement from './StoreManagement';
import BusinessManagement from './BusinessManagement';
import AffiliateManagement from './AffiliateManagement';
import PropertiesManagement from './PropertiesManagement';
import DonationsManagement from './DonationsManagement';
import TemplatesManagement from './TemplatesManagement';
import DigitalCommerceManagement from './DigitalCommerceManagement';
import BuyerPurchasesHub from './BuyerPurchasesHub';
import BusinessCategoryDashboardPanel from '../Business/BusinessCategoryDashboardPanel';
import TeamManagementPanel from './TeamManagementPanel';
import DashboardSectionShell from './DashboardSectionShell';
import { LISTING_SECTION_TAB_IDS, sectionHasSubNav } from './dashboardSectionNav';

const TAB_TITLES = {
  'buy-sell': 'Buy & Sell',
  ads: 'Buy & Sell',
  jobs: 'Jobs',
  books: 'Books',
  services: 'Services',
  properties: 'Properties',
  vehicles: 'Vehicles',
  'events-venues': 'Entertainment',
  'resorts-travel': 'Resorts & Travel',
  funding: 'Funding',
  donations: 'Donations',
  store: 'Store',
  business: 'Business',
  sponsored: 'Sponsored',
  featured: 'Featured Adverts',
  banners: 'Banner Ads',
  templates: 'Templates',
  affiliates: 'Affiliates',
  commerce: 'Sales & Purchases',
  jobseeker: 'Job Seeker',
  purchases: 'My Purchases',
};

const DashboardTabPanel = ({
  activeTab,
  stats,
  searchParams,
  clearCreateParam,
  onJobsChange,
  onPropertiesChange,
  isBusinessUser = true,
}) => {
  const openCreateOnMount =
    searchParams.get('create') === 'true' ||
    searchParams.get('sub') === 'create' ||
    (activeTab === 'jobs' && searchParams.get('postForm') === 'true');
  const advertType = searchParams.get('advert_type') || '';
  const sub = searchParams.get('sub');

  const managementProps = {
    openCreateOnMount,
    onCreateOpened: clearCreateParam,
    sectionSub: sub,
  };

  const renderManagement = () => {
    switch (activeTab) {
      case 'category-dash':
        return <BusinessCategoryDashboardPanel embedded />;
      case 'team':
        return <TeamManagementPanel />;
      case 'jobs':
        return <JobsManagement onJobsChange={onJobsChange} {...managementProps} />;
      case 'jobseeker':
        return <JobSeekerManagement {...managementProps} />;
      case 'books':
        return <BooksManagement {...managementProps} />;
      case 'services':
        return <ServicesManagement {...managementProps} />;
      case 'events-venues':
        return <EventsVenuesManagement {...managementProps} />;
      case 'resorts-travel':
        return <ResortsTravelManagement {...managementProps} />;
      case 'sponsored':
        return (
          <SponsoredManagement
            {...managementProps}
            defaultAdvertType={advertType}
          />
        );
      case 'featured':
        return <FeaturedAdvertsManagement {...managementProps} />;
      case 'vehicles':
        return <VehiclesManagement {...managementProps} />;
      case 'fleet':
        return <FleetManagement />;
      case 'banners':
        return <BannerManagement {...managementProps} />;
      case 'funding':
        return <FundingManagement {...managementProps} />;
      case 'ads':
      case 'buy-sell':
        return <AdsManagement {...managementProps} />;
      case 'store':
        return <StoreManagement {...managementProps} />;
      case 'business':
        return <BusinessManagement {...managementProps} />;
      case 'affiliates':
        return <AffiliateManagement {...managementProps} />;
      case 'properties':
        return (
          <PropertiesManagement onPropertiesChange={onPropertiesChange} {...managementProps} />
        );
      case 'donations':
        return <DonationsManagement {...managementProps} />;
      case 'templates':
        return <TemplatesManagement {...managementProps} />;
      case 'commerce':
      case 'sales':
        return <DigitalCommerceManagement />;
      case 'purchases':
        return <BuyerPurchasesHub />;
      default:
        return null;
    }
  };

  const useListingShell = LISTING_SECTION_TAB_IDS.has(activeTab);
  // Affiliates / commerce / jobseeker keep their own inner tabs; sidebar still deep-links ?sub=
  const useAnyShell =
    sectionHasSubNav(activeTab) &&
    !['affiliates', 'commerce', 'jobseeker', 'purchases'].includes(activeTab);

  const showGenericStats =
    Array.isArray(stats) &&
    stats.length > 0 &&
    activeTab !== 'category-dash' &&
    activeTab !== 'team' &&
    activeTab !== 'fleet' &&
    !useListingShell;

  const body = renderManagement();

  return (
    <div className="space-y-8">
      {showGenericStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
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
      )}

      {useAnyShell ? (
        <DashboardSectionShell
          tabId={activeTab === 'ads' ? 'buy-sell' : activeTab}
          title={TAB_TITLES[activeTab] || TAB_TITLES['buy-sell']}
          subtitle="Use Overview, Table, or Create — same options as the sidebar."
          isBusinessUser={isBusinessUser}
          stats={stats}
          openCreateOnMount={false}
          onCreateOpened={clearCreateParam}
          renderBody={({ showTable, openCreate }) => {
            if (!showTable || !body) return null;
            if (React.isValidElement(body)) {
              return React.cloneElement(body, {
                ...managementProps,
                openCreateOnMount: openCreate,
                hideSectionTitle: true,
              });
            }
            return body;
          }}
        />
      ) : (
        body
      )}
    </div>
  );
};

export default DashboardTabPanel;
