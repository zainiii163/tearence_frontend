import {
  FaShoppingBag,
  FaBriefcase,
  FaHandsHelping,
  FaHome,
  FaBriefcase as FaJobs,
  FaCode,
  FaCalendarAlt,
  FaBullhorn,
  FaHandHoldingUsd,
  FaStore,
  FaBook,
  FaCar,
  FaHeart,
  FaImage,
  FaNewspaper,
  FaUsers,
  FaPlane,
  FaChartLine,
} from 'react-icons/fa';
import { CATEGORY_THEMES, getCategoryTheme } from '../../constants/categoryThemes';

/**
 * Clive: unique business dashboards for each homepage category.
 * Stats + post paths are category-specific (vehicles ≠ property ≠ jobs…).
 */

const HOMEPAGE_ORDER = [
  'buy-sell',
  'business',
  'services',
  'property',
  'jobs',
  'software',
  'events',
  'adverts',
  'funding',
  'stores',
  'books',
  'vehicles',
  'donations',
  'images',
  'classifieds',
  'affiliate',
  'resorts',
  'investment',
];

const ICONS = {
  'buy-sell': FaShoppingBag,
  business: FaBriefcase,
  services: FaHandsHelping,
  property: FaHome,
  jobs: FaJobs,
  software: FaCode,
  events: FaCalendarAlt,
  adverts: FaBullhorn,
  funding: FaHandHoldingUsd,
  stores: FaStore,
  books: FaBook,
  vehicles: FaCar,
  donations: FaHeart,
  images: FaImage,
  classifieds: FaNewspaper,
  affiliate: FaUsers,
  resorts: FaPlane,
  investment: FaChartLine,
};

const CATEGORY_DASHBOARD_META = {
  'buy-sell': {
    emoji: '🛒',
    stats: [
      { key: 'listings', label: 'Active listings', hint: 'Items for sale' },
      { key: 'orders', label: 'Orders / enquiries', hint: 'Buyer interest' },
      { key: 'views', label: 'Listing views', hint: 'Last 30 days' },
    ],
    postPath: '/buy-sell?postForm=true',
    browsePath: '/buy-sell',
    tools: ['Listing boost', 'Invoice pack', 'Sale agreement'],
    highlights: ['Sell products in Buy & Sell', 'Boost listings with ad tools', 'Approve affiliates to promote stock'],
  },
  business: {
    emoji: '🏢',
    stats: [
      { key: 'listings', label: 'Company listings', hint: 'Directory presence' },
      { key: 'leads', label: 'Business leads', hint: 'Contact requests' },
      { key: 'affiliates', label: 'Affiliate offers', hint: 'Products to promote' },
    ],
    postPath: '/business?postForm=true',
    browsePath: '/business',
    tools: ['Pitch deck', 'Commercial agreement', 'SEO toolkit'],
    highlights: ['Directory profile & messaging', 'Pitch decks and commercial packs', 'Staff roles for your page'],
  },
  services: {
    emoji: '🛠️',
    stats: [
      { key: 'listings', label: 'Active services', hint: 'Gig / service posts' },
      { key: 'orders', label: 'Service orders', hint: 'Bookings & buys' },
      { key: 'rating', label: 'Avg rating', hint: 'Client feedback' },
    ],
    postPath: '/services?postForm=true',
    browsePath: '/services',
    tools: ['Service proposal', 'Booking calendar', 'Portfolio pack'],
    highlights: ['Post gigs and service packages', 'Booking and proposal tools', 'Promote services via affiliates'],
  },
  property: {
    emoji: '🏠',
    stats: [
      { key: 'listings', label: 'Properties listed', hint: 'Sale & rent' },
      { key: 'enquiries', label: 'Viewing requests', hint: 'Buyer / tenant leads' },
      { key: 'views', label: 'Property views', hint: 'Last 30 days' },
    ],
    postPath: '/property?postForm=true',
    browsePath: '/property',
    tools: ['Rental listing pack', 'Lease proposal', 'Mortgage calculator'],
    highlights: ['Sale & rental listings', 'Viewing enquiry tracking', 'Lease and mortgage tools'],
  },
  jobs: {
    emoji: '💼',
    stats: [
      { key: 'listings', label: 'Open roles', hint: 'Active vacancies' },
      { key: 'applications', label: 'Applications', hint: 'Candidates' },
      { key: 'views', label: 'Job views', hint: 'Last 30 days' },
    ],
    postPath: '/jobs?postForm=true',
    browsePath: '/jobs',
    tools: ['Job description pack', 'Offer letter', 'Interview scorecard'],
    highlights: ['Post vacancies', 'Review applications', 'Offer letter templates'],
  },
  software: {
    emoji: '💻',
    stats: [
      { key: 'listings', label: 'Products listed', hint: 'Scripts / apps' },
      { key: 'sales', label: 'Downloads / sales', hint: 'Paid products' },
      { key: 'affiliates', label: 'Affiliate offers', hint: 'Promote your software' },
    ],
    postPath: '/software?post=1',
    browsePath: '/software',
    tools: ['License invoice', 'Changelog template', 'Affiliate hop'],
    highlights: [
      'Track downloads and paid software sales',
      'Post affiliate offers for your scripts and apps',
      'Issue licence invoices from tools',
    ],
  },
  events: {
    emoji: '🎟️',
    stats: [
      { key: 'listings', label: 'Events / venues', hint: 'Live posts' },
      { key: 'tickets', label: 'Ticket interest', hint: 'RSVPs / enquiries' },
      { key: 'views', label: 'Page views', hint: 'Last 30 days' },
    ],
    postPath: '/events-venues/post',
    browsePath: '/events-venues',
    tools: ['Event planner', 'Venue proposal', 'Sponsor pack'],
    highlights: ['Events and venue listings', 'RSVP / ticket interest', 'Sponsor packs'],
  },
  adverts: {
    emoji: '📢',
    stats: [
      { key: 'campaigns', label: 'Active campaigns', hint: 'Sponsored / featured / promoted' },
      { key: 'impressions', label: 'Impressions', hint: 'Paid reach' },
      { key: 'clicks', label: 'Clicks', hint: 'CTR tracking' },
    ],
    postPath: '/sponsored-adverts?postForm=true',
    browsePath: '/adverts',
    tools: ['Banner pack', 'Campaign brief', 'Ad calendar'],
    highlights: ['Sponsored / featured / promoted ads', 'Campaign KPI tracking', 'Ad creative tools'],
  },
  funding: {
    emoji: '💰',
    stats: [
      { key: 'campaigns', label: 'Funding campaigns', hint: 'Loan / equity' },
      { key: 'pledges', label: 'Pledges / interest', hint: 'Investor signals' },
      { key: 'goal', label: 'Goal progress', hint: '% of target' },
    ],
    postPath: '/funding?postForm=true',
    browsePath: '/funding',
    tools: ['Investor pitch', 'Grant pack', 'Financial summary'],
    highlights: ['Loan and equity campaigns', 'Investor interest signals', 'Pitch and grant packs'],
  },
  stores: {
    emoji: '🏬',
    stats: [
      { key: 'products', label: 'Store products', hint: 'Catalogue size' },
      { key: 'orders', label: 'Store orders', hint: 'Checkout volume' },
      { key: 'visits', label: 'Store visits', hint: 'Last 30 days' },
    ],
    postPath: '/my-store',
    browsePath: '/stores',
    tools: ['Store invoice', 'Product sheet', 'Promo flyer'],
    highlights: ['Manage catalogue in My Store', 'Orders and visits', 'Promo flyers'],
  },
  books: {
    emoji: '📚',
    stats: [
      { key: 'listings', label: 'Books listed', hint: 'Titles live' },
      { key: 'sales', label: 'Purchases', hint: 'Digital / physical' },
      { key: 'affiliates', label: 'Affiliate offers', hint: 'Promote titles' },
    ],
    postPath: '/books?postForm=true',
    browsePath: '/books',
    tools: ['Author bio pack', 'Book launch plan', 'Affiliate hop'],
    highlights: ['List titles', 'Digital and physical sales', 'Affiliate book hops'],
  },
  vehicles: {
    emoji: '🚗',
    stats: [
      { key: 'listings', label: 'Vehicles listed', hint: 'Fleet / stock' },
      { key: 'enquiries', label: 'Test-drive enquiries', hint: 'Buyer interest' },
      { key: 'views', label: 'Vehicle views', hint: 'Last 30 days' },
    ],
    postPath: '/vehicles?postForm=true',
    browsePath: '/vehicles',
    tools: ['Vehicle listing pack', 'Bill of sale', 'Finance calculator'],
    highlights: ['Fleet / stock listings', 'Test-drive enquiry tracking', 'Bill of sale and finance tools', 'Fleet availability board in dashboard'],
  },
  donations: {
    emoji: '❤️',
    stats: [
      { key: 'campaigns', label: 'Active causes', hint: 'Donation pages' },
      { key: 'donors', label: 'Donors', hint: 'Supporters' },
      { key: 'raised', label: 'Amount raised', hint: 'Campaign total' },
    ],
    postPath: '/donations?postForm=true',
    browsePath: '/donations',
    tools: ['Cause story pack', 'Impact report', 'Donor thank-you'],
    highlights: ['Cause pages', 'Donor tracking', 'Impact reporting tools'],
  },
  images: {
    emoji: '🖼️',
    stats: [
      { key: 'listings', label: 'Media assets', hint: 'Images live' },
      { key: 'sales', label: 'Licences sold', hint: 'Paid downloads' },
      { key: 'views', label: 'Asset views', hint: 'Last 30 days' },
    ],
    postPath: '/images?post=1',
    browsePath: '/images',
    tools: ['License invoice', 'Portfolio sheet', 'Watermark guide'],
    highlights: ['Stock and media assets', 'Licence sales', 'Portfolio tools'],
  },
  classifieds: {
    emoji: '📰',
    stats: [
      { key: 'listings', label: 'Classifieds live', hint: 'Active ads' },
      { key: 'replies', label: 'Replies', hint: 'Buyer messages' },
      { key: 'views', label: 'Ad views', hint: 'Last 30 days' },
    ],
    postPath: '/classifieds-ads?postForm=true',
    browsePath: '/classifieds-ads',
    tools: ['Classified booster', 'Local flyer', 'Sale checklist'],
    highlights: ['Local classified ads', 'Buyer reply tracking', 'Boost and flyer tools'],
  },
  affiliate: {
    emoji: '🤝',
    stats: [
      { key: 'offers', label: 'Your offers', hint: 'Products to promote' },
      { key: 'applicants', label: 'Pending influencers', hint: 'Awaiting approval' },
      { key: 'hops', label: 'Hop clicks', hint: 'Tracked traffic' },
    ],
    postPath: '/affiliates/marketplace?postForm=true&mode=business',
    browsePath: '/affiliates/marketplace',
    tools: ['Affiliate brief', 'Creative pack', 'Commission sheet'],
    highlights: ['Post offers for influencers', 'Approve socials / blogs / websites', 'Mint hop links'],
  },
  resorts: {
    emoji: '✈️',
    stats: [
      { key: 'listings', label: 'Travel listings', hint: 'Resorts / packages' },
      { key: 'bookings', label: 'Booking enquiries', hint: 'Guest interest' },
      { key: 'views', label: 'Package views', hint: 'Last 30 days' },
    ],
    postPath: '/resorts-travel?postForm=true',
    browsePath: '/resorts-travel',
    tools: ['Travel itinerary', 'Resort pitch', 'Guest welcome pack'],
    highlights: ['Resort and travel packages', 'Booking enquiries', 'Guest welcome tools'],
  },
  investment: {
    emoji: '📈',
    stats: [
      { key: 'listings', label: 'Investment posts', hint: 'Opportunities live' },
      { key: 'interest', label: 'Investor interest', hint: 'Enquiries' },
      { key: 'views', label: 'Deck views', hint: 'Last 30 days' },
    ],
    postPath: '/businesses-for-sale?postForm=true',
    browsePath: '/investing',
    tools: ['Investor pitch', 'Term sheet outline', 'Financial model'],
    highlights: ['Investment opportunities', 'Investor interest', 'Pitch and term sheet tools'],
  },
};

export const BUSINESS_DASHBOARD_CATEGORIES = HOMEPAGE_ORDER.map((id) => {
  const theme = getCategoryTheme(id) || CATEGORY_THEMES[id] || {};
  const meta = CATEGORY_DASHBOARD_META[id] || {
    emoji: '📁',
    stats: [
      { key: 'listings', label: 'Listings', hint: 'Active posts' },
      { key: 'leads', label: 'Leads', hint: 'Enquiries' },
      { key: 'views', label: 'Views', hint: 'Last 30 days' },
    ],
    postPath: theme.route || '/',
    browsePath: theme.route || '/',
    tools: ['Business templates', 'Marketing tools'],
  };

  return {
    id,
    name: theme.name || id,
    description: theme.description || `Manage your ${theme.name || id} business on Worldwide Adverts.`,
    emoji: meta.emoji,
    icon: ICONS[id] || FaBriefcase,
    color: theme.color || 'from-slate-600 to-slate-800',
    accentButton: theme.accentButton || 'bg-slate-800 hover:bg-slate-900',
    accentText: theme.accentText || 'text-slate-800',
    borderColor: theme.borderColor || 'border-slate-200',
    bgColor: theme.bgColor || 'bg-slate-50',
    browsePath: meta.browsePath,
    postPath: meta.postPath,
    stats: meta.stats,
    tools: meta.tools,
    highlights: meta.highlights || [],
    affiliatePostPath: '/affiliates/marketplace?postForm=true&mode=business',
    directoryCategory: id,
  };
});

export const getDashboardCategory = (id) =>
  BUSINESS_DASHBOARD_CATEGORIES.find((c) => c.id === String(id || '').toLowerCase()) || null;

/** Tabs every business account always sees */
export const BUSINESS_SHARED_SIDEBAR_TABS = [
  'overview',
  'team',
  'notifications',
  'security',
  'templates',
  'commerce',
  'affiliates',
];

/**
 * Extra sidebar tabs for each signup category.
 * Businesses should NOT see every marketplace — only their related ones.
 */
export const CATEGORY_SIDEBAR_TABS = {
  'buy-sell': ['buy-sell'],
  business: ['business'],
  services: ['services'],
  property: ['properties'],
  jobs: ['jobs'],
  software: [],
  events: ['events-venues'],
  adverts: ['sponsored', 'featured', 'banners'],
  funding: ['funding'],
  stores: ['store'],
  books: ['books'],
  vehicles: ['vehicles', 'fleet'],
  donations: ['donations'],
  images: [],
  classifieds: ['buy-sell'],
  affiliate: [],
  resorts: ['resorts-travel'],
  investment: ['sponsored', 'business'],
};

/** Quick-action routes allowed per category (plus shared) */
export const CATEGORY_QUICK_ACTION_TABS = {
  'buy-sell': ['buy-sell'],
  business: ['business'],
  services: ['services'],
  property: ['properties'],
  jobs: ['jobs'],
  software: ['templates'],
  events: ['events-venues'],
  adverts: ['sponsored', 'featured', 'banners'],
  funding: ['funding'],
  stores: ['store'],
  books: ['books'],
  vehicles: ['vehicles', 'fleet'],
  donations: ['donations'],
  images: ['templates'],
  classifieds: ['buy-sell'],
  affiliate: ['affiliates'],
  resorts: ['resorts-travel'],
  investment: ['sponsored', 'business'],
};

/** Allowed sidebar tab ids for a locked business category */
export function getBusinessSidebarTabIds(categoryId) {
  const cat = String(categoryId || '').toLowerCase();
  const extra = CATEGORY_SIDEBAR_TABS[cat] || [];
  return new Set([...BUSINESS_SHARED_SIDEBAR_TABS, ...extra]);
}

/** Resolve category from demo email: buy-sell-demo@… → buy-sell */
export function categoryFromDemoEmail(email) {
  const match = String(email || '')
    .toLowerCase()
    .match(/^([a-z0-9-]+)-demo@worldwideadverts\.info$/);
  if (!match?.[1]) return null;
  return getDashboardCategory(match[1]) ? match[1] : resolveBusinessDashboardCategory({ business_category_slug: match[1] });
}

/** Map free-text / slug from signup profile → dashboard category id */
export function resolveBusinessDashboardCategory(profile = {}) {
  // Prefer explicit slugs over free-text names (avoids wrong alias matches)
  const slugCandidates = [
    profile.dashboard_category,
    profile.business_category_slug,
    profile.category_slug,
    profile.primary_category,
  ];
  for (const candidate of slugCandidates) {
    const slug = String(candidate || '').toLowerCase().trim();
    if (slug && getDashboardCategory(slug)) return slug;
  }

  const raw = String(profile.business_category || profile.category || '')
    .toLowerCase()
    .trim();

  if (!raw) return null;
  if (getDashboardCategory(raw)) return raw;

  // Prefer longer / more specific aliases first
  const aliases = [
    ['buy-sell', 'buy-sell'],
    ['buy & sell', 'buy-sell'],
    ['real-estate', 'property'],
    ['realestate', 'property'],
    ['events-venues', 'events'],
    ['crowdfunding', 'funding'],
    ['classifieds', 'classifieds'],
    ['investment', 'investment'],
    ['affiliate', 'affiliate'],
    ['affiliates', 'affiliate'],
    ['vehicles', 'vehicles'],
    ['vehicle', 'vehicles'],
    ['automotive', 'vehicles'],
    ['property', 'property'],
    ['funding', 'funding'],
    ['services', 'services'],
    ['service', 'services'],
    ['software', 'software'],
    ['business', 'business'],
    ['donations', 'donations'],
    ['donation', 'donations'],
    ['charity', 'donations'],
    ['resorts', 'resorts'],
    ['travel', 'resorts'],
    ['resort', 'resorts'],
    ['tourism', 'resorts'],
    ['stores', 'stores'],
    ['store', 'stores'],
    ['books', 'books'],
    ['book', 'books'],
    ['images', 'images'],
    ['events', 'events'],
    ['event', 'events'],
    ['venue', 'events'],
    ['adverts', 'adverts'],
    ['advert', 'adverts'],
    ['jobs', 'jobs'],
    ['job', 'jobs'],
    ['cars', 'vehicles'],
    ['estate', 'property'],
    ['shop', 'stores'],
    ['buy', 'buy-sell'],
    ['sell', 'buy-sell'],
    ['invest', 'investment'],
    ['fund', 'funding'],
  ];

  for (const [key, id] of aliases) {
    if (raw.includes(key)) return id;
  }

  return null;
}
