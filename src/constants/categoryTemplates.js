/**
 * Business document templates for sale — bottom of each category page.
 * Clive: pitch, grant application, etc. — relevant to each main category.
 * Inspired by common packs used for investor decks, grants, plans, and industry docs.
 */

import { resolveTemplateAssetUrl } from '../utils/templateUrls';

const pack = (title, blurb, price, file = null) => ({ title, blurb, price, file });

export const CATEGORY_TEMPLATES = {
  business: {
    default: {
      headline: 'Business templates for sale',
      description:
        'Pitch decks, grant applications, business plans and proposals — ready to customise for your company.',
      items: [
        pack(
          'Investor pitch deck',
          'Problem, solution, market, traction, team and funding ask (10–15 slides)',
          'From $29',
          '/templates/investor-pitch-deck.html'
        ),
        pack(
          'Grant application pack',
          'Need statement, objectives, methods, budget and impact sections',
          'From $35',
          '/templates/grant-application-pack.html'
        ),
        pack(
          'Startup business plan',
          'Fillable HubSpot/LawDepot-style plan — 10 detailed pages with fields to complete (cover, market, financials, funding)',
          'From $39',
          '/templates/startup-business-plan.html'
        ),
        pack(
          'Business Plan — Executive Summary',
          'Premium fillable exec summary — dynamic tables, autosave, validation, print/PDF (Shihab standard)',
          'From $19',
          '/templates/business-plan-executive-summary.html'
        ),
        pack(
          'Professional invoice',
          'Premium fillable invoice — ads/campaigns, tax, payment, print/PDF (Clive v1.0)',
          'From $8',
          '/templates/professional-invoice.html'
        ),
        pack(
          'Commercial agreement (dispute-ready)',
          'B2B contract with scope, payment, liability, and clear dispute / ADR / governing-law clauses',
          'From $24',
          '/templates/commercial-agreement.html'
        ),
        pack(
          'Monthly calendar & planner',
          'Fillable month goals + weekly grid + review',
          'From $12',
          '/templates/monthly-calendar-planner.html'
        ),
        pack(
          'Weekly planner',
          'Fillable week priorities, daily blocks and habits',
          'From $9',
          '/templates/weekly-planner.html'
        ),
        pack(
          'Meal planner',
          'Weekly meals, shopping list and batch prep — fillable',
          'From $9',
          '/templates/meal-planner.html'
        ),
        pack(
          'Fitness planner',
          'Goals, weekly workouts and recovery — fillable',
          'From $9',
          '/templates/fitness-planner.html'
        ),
        pack(
          'Diet planner',
          'Macros, meal templates and grocery list — fillable',
          'From $9',
          '/templates/diet-planner.html'
        ),
        pack(
          'Event planner',
          'Brief, run-of-show, budget and vendors — fillable',
          'From $12',
          '/templates/event-planner.html'
        ),
        pack(
          'Party planner',
          'Theme, guests, menu and day-of checklist — fillable',
          'From $10',
          '/templates/party-planner.html'
        ),
        pack(
          'Wedding planner',
          'Couple details, vendors, budget and timeline — fillable',
          'From $14',
          '/templates/wedding-planner.html'
        ),
        pack(
          'Travel planner',
          'Itinerary, bookings, budget and packing — fillable',
          'From $10',
          '/templates/travel-planner.html'
        ),
        pack(
          'Weekly budget tracker',
          'Income, expenses and variance — fillable',
          'From $8',
          '/templates/budget-tracker-weekly.html'
        ),
        pack(
          'Monthly budget tracker',
          'Monthly bills and category budgets — fillable',
          'From $9',
          '/templates/budget-tracker-monthly.html'
        ),
        pack(
          'Yearly budget tracker',
          'Annual goals and category plan — fillable',
          'From $10',
          '/templates/budget-tracker-yearly.html'
        ),
        pack(
          'Social media captions pack',
          'Caption sets for property, fitness, food, fashion, B2B, travel, beauty, jobs',
          'From $12',
          '/templates/social-media-captions.html'
        ),
        pack(
          'Marketing flyer',
          'Fillable flyer copy brief for print or Canva',
          'From $11',
          '/templates/marketing-flyer.html'
        ),
        pack(
          'Event / promo banner',
          'Editable multi-size banners (IAB + social) — live canvas, autosave, print/PDF',
          'From $15',
          '/templates/banner-ads.html'
        ),
        pack(
          'Editable banner ads pack',
          'Leaderboard, rectangle, skyscraper, billboard, square + social sizes',
          'From $15',
          '/templates/banner-ads.html'
        ),
        pack(
          'Wedding invitation',
          'Fillable ceremony, reception and RSVP details',
          'From $14',
          '/templates/wedding-invitation.html'
        ),
        pack(
          'Birthday invitation',
          'Fillable party invite card details',
          'From $8',
          '/templates/birthday-invitation.html'
        ),
      ],
    },
    retail: {
      headline: 'Retail business templates',
      description: 'Plans and pitch packs for shops, boutiques and multi-brand stores.',
      items: [
        pack('Retail business plan', 'Location, assortment, margins and staffing model', 'From $32'),
        pack('Franchise / expansion pitch', 'Unit economics, territory and rollout slides', 'From $28'),
        pack('Supplier proposal pack', 'Terms, MOQs and brand partnership one-pager', 'From $18'),
      ],
    },
    restaurants: {
      headline: 'Restaurant & food templates',
      description: 'Funding and ops packs for cafés, restaurants and food brands.',
      items: [
        pack('Restaurant business plan', 'Concept, covers, food cost and break-even', 'From $34', '/templates/restaurant-business-plan.html'),
        pack('Hospitality pitch deck', 'Concept, menu highlights and funding ask', 'From $27', '/templates/investor-pitch-deck.html'),
        pack('Catering grant / loan pack', 'Equipment ask, kitchen layout and cash flow', 'From $30', '/templates/grant-application-pack.html'),
      ],
    },
    services: {
      headline: 'Professional services templates',
      description: 'Client-winning decks and funding docs for agencies and practices.',
      items: [
        pack('Client pitch deck', 'Problem, approach, case studies and pricing', 'From $26'),
        pack('Retainer proposal + SOW', 'Scope, deliverables, fees and SLAs', 'From $24'),
        pack('Practice business plan', 'Services mix, pipeline and 3-year forecast', 'From $36'),
      ],
    },
    healthcare: {
      headline: 'Healthcare & wellness templates',
      description: 'Clinic plans, funding asks and grant packs for health providers.',
      items: [
        pack('Clinic business plan', 'Services, compliance, staffing and projections', 'From $38'),
        pack('Health grant proposal', 'Community need, outcomes, budget and evaluation', 'From $36'),
        pack('Investor / partner pitch', 'Model, catchment and growth roadmap', 'From $30'),
      ],
    },
    education: {
      headline: 'Education & training templates',
      description: 'Course, school and training funding packs.',
      items: [
        pack('Training programme plan', 'Curriculum, outcomes, pricing and delivery', 'From $28'),
        pack('Education grant application', 'Need, learners, methods, budget and impact', 'From $34'),
        pack('Academy pitch deck', 'Market, differentiation and enrolment forecast', 'From $26'),
      ],
    },
    automotive: {
      headline: 'Automotive business templates',
      description: 'Garage, dealer and fleet funding and pitch packs.',
      items: [
        pack('Garage business plan', 'Bays, services, utilisation and cash flow', 'From $32'),
        pack('Dealer / workshop pitch', 'Stock turns, margins and expansion ask', 'From $28'),
        pack('Equipment finance pack', 'Asset schedule, ROI and loan request', 'From $24'),
      ],
    },
    'real-estate': {
      headline: 'Real estate business templates',
      description: 'Agency and property investment pitch packs.',
      items: [
        pack('Agency business plan', 'Areas, fee model, pipeline and team', 'From $34'),
        pack('Investment pitch deck', 'Deal thesis, comps, returns and risks', 'From $32'),
        pack('Property management proposal', 'Services, fees and SLA for landlords', 'From $22'),
      ],
    },
    entertainment: {
      headline: 'Entertainment & leisure templates',
      description: 'Venue, event and production funding packs.',
      items: [
        pack('Venue business plan', 'Capacity, events mix and seasonal forecast', 'From $33'),
        pack('Event funding pitch', 'Concept, audience, budget and sponsorship ask', 'From $27'),
        pack('Sponsorship proposal pack', 'Packages, reach and activation ideas', 'From $24'),
      ],
    },
    travel: {
      headline: 'Travel & hospitality templates',
      description: 'Hotel, B&B and tour operator plans and pitches.',
      items: [
        pack('Hospitality business plan', 'Rooms/ADR, occupancy and opex model', 'From $36'),
        pack('Tour operator pitch deck', 'Routes, margins and growth plan', 'From $28'),
        pack('Tourism grant application', 'Local impact, jobs and project budget', 'From $34'),
      ],
    },
    beauty: {
      headline: 'Beauty & personal care templates',
      description: 'Salon and spa plans, pitches and franchise packs.',
      items: [
        pack('Salon business plan', 'Chairs, treatments, retail and break-even', 'From $30'),
        pack('Spa / clinic pitch deck', 'Concept, memberships and funding ask', 'From $26'),
        pack('Franchise application pack', 'Territory, fees and unit economics', 'From $28'),
      ],
    },
    pets: {
      headline: 'Pet services templates',
      description: 'Grooming, boarding and training business docs.',
      items: [
        pack('Pet business plan', 'Services mix, capacity and licensing notes', 'From $28'),
        pack('Boarding / daycare pitch', 'Facilities, occupancy and expansion ask', 'From $25'),
        pack('Small-business grant pack', 'Need, budget and community impact', 'From $30'),
      ],
    },
    'home-garden': {
      headline: 'Home & garden business templates',
      description: 'Trade, landscaping and home-services funding packs.',
      items: [
        pack('Trade business plan', 'Jobs mix, van fleet and cash flow', 'From $29'),
        pack('Landscaping pitch deck', 'Projects, margins and growth ask', 'From $24'),
        pack('Equipment grant / loan pack', 'Tool list, ROI and repayment plan', 'From $26'),
      ],
    },
    technology: {
      headline: 'Technology business templates',
      description: 'IT, electronics and tech startup funding packs.',
      items: [
        pack('Tech startup pitch deck', 'Problem, product, Moat, traction and ask', 'From $32'),
        pack('SaaS / IT business plan', 'Model, CAC/LTV, roadmap and forecast', 'From $38'),
        pack('Innovation grant proposal', 'R&D scope, milestones and budget', 'From $36'),
      ],
    },
    'sports-fitness': {
      headline: 'Sports & fitness templates',
      description: 'Gym, studio and coaching business docs.',
      items: [
        pack('Gym business plan', 'Memberships, utilisation and opex', 'From $31'),
        pack('Fitness studio pitch', 'Concept, classes and funding ask', 'From $25'),
        pack('Community sport grant pack', 'Participation goals, budget and impact', 'From $32'),
      ],
    },
    industrial: {
      headline: 'Industrial & manufacturing templates',
      description: 'Plant, warehouse and manufacturing funding packs.',
      items: [
        pack('Manufacturing business plan', 'Capacity, COGS, certifications and forecast', 'From $40'),
        pack('Capex / plant pitch deck', 'Equipment, throughput and ROI', 'From $34'),
        pack('Industrial grant application', 'Jobs, innovation and project budget', 'From $36'),
      ],
    },
    'non-profit': {
      headline: 'Non-profit & charity templates',
      description: 'Mission plans, grants and donor pitch packs.',
      items: [
        pack('Grant proposal pack', 'Need, methods, evaluation, budget and impact', 'From $35'),
        pack('Donor pitch deck', 'Mission, programmes, outcomes and ask', 'From $24'),
        pack('Charity strategic plan', 'Goals, programmes and 3-year funding map', 'From $32'),
      ],
    },
  },

  services: {
    default: {
      headline: 'IT service business templates',
      description: 'Pitch decks, proposals and grant packs for freelancers and agencies.',
      items: [
        pack('Agency pitch deck', 'Capabilities, process, case studies and pricing', 'From $26', '/templates/agency-pitch-deck.html'),
        pack('Client proposal + SOW', 'Scope, milestones, fees and acceptance criteria', 'From $22', '/templates/client-proposal-sow.html'),
        pack('Freelance business plan', 'Offer mix, pipeline and 12-month forecast', 'From $28', '/templates/startup-business-plan.html'),
        pack('Event planner', 'Brief, run-of-show, budget and vendors — fillable', 'From $12', '/templates/event-planner.html'),
        pack('Social media captions pack', 'Multi-niche caption sets with hooks and CTAs', 'From $12', '/templates/social-media-captions.html'),
        pack('Monthly budget tracker', 'Monthly bills and category budgets — fillable', 'From $9', '/templates/budget-tracker-monthly.html'),
      ],
    },
    'web-development': {
      headline: 'Web development templates',
      description: 'Project pitches and proposals for web agencies.',
      items: [
        pack('Website project proposal', 'Discovery, sitemap, build phases and quote', 'From $24', '/templates/website-project-proposal.html'),
        pack('Agency capability pitch', 'Stack, process and case-study slides', 'From $26', '/templates/agency-pitch-deck.html'),
        pack('Retainer SOW pack', 'Hours, SLAs, change control and billing', 'From $20', '/templates/client-proposal-sow.html'),
      ],
    },
    'app-software': {
      headline: 'App & software templates',
      description: 'Product and SaaS funding packs.',
      items: [
        pack('App / SaaS pitch deck', 'Problem, product, Moat, metrics and ask', 'From $32', '/templates/saas-pitch-deck.html'),
        pack('Product requirements pack', 'PRD outline, roadmap and MVP scope', 'From $28', '/templates/website-project-proposal.html'),
        pack('R&D / innovation grant', 'Technical approach, milestones and budget', 'From $36', '/templates/grant-application-pack.html'),
      ],
    },
    'graphic-design': {
      headline: 'Graphic design templates',
      description: 'Creative pitch and brand proposal packs.',
      items: [
        pack('Brand project proposal', 'Discovery, deliverables, rounds and fees', 'From $22'),
        pack('Studio pitch deck', 'Style, process and selected work slides', 'From $24'),
        pack('Creative brief template', 'Goals, audience, tone and success metrics', 'From $12'),
      ],
    },
    'digital-marketing': {
      headline: 'Digital marketing templates',
      description: 'Campaign pitches and growth plans for marketers.',
      items: [
        pack('Marketing pitch deck', 'Goals, channels, plan and projected ROI', 'From $26', '/templates/marketing-campaign-proposal.html'),
        pack('Campaign proposal pack', 'Audience, budget, creatives and KPIs', 'From $22', '/templates/marketing-campaign-proposal.html'),
        pack('Growth plan template', 'Funnel, experiments and monthly forecast', 'From $28', '/templates/startup-business-plan.html'),
      ],
    },
    advertising: {
      headline: 'Advertising templates',
      description: 'Media and creative agency pitch packs.',
      items: [
        pack('Media plan proposal', 'Channels, reach, budget and flight dates', 'From $24'),
        pack('Agency credentials pitch', 'Case studies, process and team', 'From $26'),
        pack('Campaign brief + estimate', 'Objectives, deliverables and costs', 'From $18'),
      ],
    },
    'writing-content': {
      headline: 'Writing & content templates',
      description: 'Content strategy pitches and editorial plans.',
      items: [
        pack('Content strategy proposal', 'Pillars, calendar, SEO and fees', 'From $20'),
        pack('Editorial pitch deck', 'Audience, formats and sample work', 'From $18'),
        pack('Ghostwriting SOW pack', 'Outline, drafts, revisions and rights', 'From $16'),
      ],
    },
    'business-support': {
      headline: 'Business support templates',
      description: 'VA and B2B ops packs — plans, proposals and grants.',
      items: [
        pack('VA / ops proposal pack', 'Services, hours and onboarding checklist', 'From $18'),
        pack('SMB business plan lite', 'Offer, customers, costs and cash flow', 'From $26'),
        pack('Small-business grant pack', 'Need statement, budget and outcomes', 'From $30'),
      ],
    },
    'it-consultancy': {
      headline: 'IT consultancy templates',
      description: 'Advisory pitches, audits and funding packs.',
      items: [
        pack('Consulting pitch deck', 'Problems solved, method and case studies', 'From $28', '/templates/agency-pitch-deck.html'),
        pack('IT audit + roadmap pack', 'Findings template, priorities and SOW', 'From $32', '/templates/it-audit-roadmap.html'),
        pack('Digital transformation plan', 'Current state, target and investment ask', 'From $36', '/templates/startup-business-plan.html'),
      ],
    },
  },

  property: {
    default: {
      headline: 'Property templates for sale',
      description:
        'Agency plans, investment decks and landlord packs — ready to customise for real estate.',
      items: [
        pack(
          'Agency business plan',
          'Areas, fee model, pipeline and team for estate agencies — fillable',
          'From $34',
          '/templates/agency-business-plan.html'
        ),
        pack(
          'Investment pitch deck',
          'Deal thesis, comps, returns and risks for investors',
          'From $32',
          '/templates/investor-pitch-deck.html'
        ),
        pack(
          'Sale prospectus',
          'Property highlights, specs and offer structure — fillable',
          'From $28',
          '/templates/sale-prospectus.html'
        ),
        pack(
          'Rental listing pack',
          'Lease terms, inventory and tenant checklist — fillable',
          'From $22',
          '/templates/rental-listing-pack.html'
        ),
        pack(
          'Landlord / PM proposal',
          'Services, fees and SLA for property managers — fillable',
          'From $20',
          '/templates/landlord-proposal.html'
        ),
        pack(
          'Monthly calendar & planner',
          'Fillable month goals + weekly grid + review',
          'From $12',
          '/templates/monthly-calendar-planner.html'
        ),
        pack(
          'Weekly planner',
          'Fillable week priorities, daily blocks and habits',
          'From $9',
          '/templates/weekly-planner.html'
        ),
        pack(
          'Meal planner',
          'Weekly meals, shopping list and batch prep — fillable',
          'From $9',
          '/templates/meal-planner.html'
        ),
        pack(
          'Fitness planner',
          'Goals, weekly workouts and recovery — fillable',
          'From $9',
          '/templates/fitness-planner.html'
        ),
        pack(
          'Diet planner',
          'Macros, meal templates and grocery list — fillable',
          'From $9',
          '/templates/diet-planner.html'
        ),
        pack(
          'Event planner',
          'Brief, run-of-show, budget and vendors — fillable',
          'From $12',
          '/templates/event-planner.html'
        ),
        pack(
          'Party planner',
          'Theme, guests, menu and day-of checklist — fillable',
          'From $10',
          '/templates/party-planner.html'
        ),
        pack(
          'Wedding planner',
          'Couple details, vendors, budget and timeline — fillable',
          'From $14',
          '/templates/wedding-planner.html'
        ),
        pack(
          'Travel planner',
          'Itinerary, bookings, budget and packing — fillable',
          'From $10',
          '/templates/travel-planner.html'
        ),
        pack(
          'Weekly budget tracker',
          'Income, expenses and variance — fillable',
          'From $8',
          '/templates/budget-tracker-weekly.html'
        ),
        pack(
          'Monthly budget tracker',
          'Monthly bills and category budgets — fillable',
          'From $9',
          '/templates/budget-tracker-monthly.html'
        ),
        pack(
          'Yearly budget tracker',
          'Annual goals and category plan — fillable',
          'From $10',
          '/templates/budget-tracker-yearly.html'
        ),
        pack(
          'Social media captions pack',
          'Caption sets for property, fitness, food, fashion, B2B, travel, beauty, jobs',
          'From $12',
          '/templates/social-media-captions.html'
        ),
        pack(
          'Editable banner ads pack',
          'Multi-size IAB + social banners for property promotions',
          'From $15',
          '/templates/banner-ads.html'
        ),
      ],
    },
    residential: {
      headline: 'Residential property templates',
      description: 'Home sale, rental and listing packs.',
      items: [
        pack('Home sale prospectus', 'Photos, specs, neighbourhood and asking price', 'From $26', '/templates/sale-prospectus.html'),
        pack('Rental listing pack', 'Lease terms, inventory and tenant checklist', 'From $22', '/templates/rental-listing-pack.html'),
        pack('Landlord proposal', 'Services, fees and SLA for property managers', 'From $20', '/templates/landlord-proposal.html'),
      ],
    },
    commercial: {
      headline: 'Commercial property templates',
      description: 'Office, retail and mixed-use investment packs.',
      items: [
        pack('Commercial investment deck', 'Yield, tenants and exit strategy', 'From $34', '/templates/investor-pitch-deck.html'),
        pack('Lease proposal pack', 'Terms, fit-out and service charges', 'From $28'),
        pack('Mixed-use development plan', 'Phasing, sales mix and finance ask', 'From $36', '/templates/startup-business-plan.html'),
      ],
    },
    industrial: {
      headline: 'Industrial property templates',
      description: 'Warehouse and logistics facility packs.',
      items: [
        pack('Warehouse investment deck', 'Occupancy, rents and capex', 'From $32'),
        pack('Logistics facility plan', 'Access, capacity and tenant profile', 'From $30'),
        pack('Industrial sale prospectus', 'Specs, zoning and asking structure', 'From $26', '/templates/sale-prospectus.html'),
      ],
    },
    land: {
      headline: 'Land & plots templates',
      description: 'Development and land sale packs.',
      items: [
        pack('Land development plan', 'Zoning, density and residual value', 'From $34'),
        pack('Plot sale prospectus', 'Title, access and planning status', 'From $24', '/templates/sale-prospectus.html'),
        pack('Land banking pitch', 'Hold strategy, comps and exit', 'From $28', '/templates/investor-pitch-deck.html'),
      ],
    },
    luxury: {
      headline: 'Luxury property templates',
      description: 'High-end listing and private client packs.',
      items: [
        pack('Luxury sale prospectus', 'Lifestyle, finishes and exclusivity', 'From $36', '/templates/sale-prospectus.html'),
        pack('Private client pitch', 'Portfolio, service and discretion', 'From $30'),
        pack('Villa investment deck', 'Yield, lifestyle demand and comps', 'From $32', '/templates/investor-pitch-deck.html'),
      ],
    },
    rental: {
      headline: 'Short-term rental templates',
      description: 'Holiday let and Airbnb host packs.',
      items: [
        pack('STR business plan', 'Occupancy, ADR and channel mix', 'From $28', '/templates/startup-business-plan.html'),
        pack('Host operations pack', 'Check-in, cleaning and house rules', 'From $20'),
        pack('Holiday let pitch', 'Seasonality, returns and furnishing ask', 'From $26'),
      ],
    },
    investment: {
      headline: 'Property investment templates',
      description: 'Portfolio and deal investment packs.',
      items: [
        pack('Investment pitch deck', 'Thesis, returns, risks and ask', 'From $32', '/templates/investor-pitch-deck.html'),
        pack('Portfolio business plan', 'Asset mix, leverage and cash flow', 'From $36', '/templates/startup-business-plan.html'),
        pack('Deal teaser / CIM', 'Asset summary, financials and process', 'From $34', '/templates/sale-prospectus.html'),
      ],
    },
    agricultural: {
      headline: 'Agricultural property templates',
      description: 'Farm and agri-land packs.',
      items: [
        pack('Farm business plan', 'Crops, livestock, grants and cash flow', 'From $32'),
        pack('Agri-land sale prospectus', 'Acreage, water rights and yields', 'From $26', '/templates/sale-prospectus.html'),
        pack('Rural investment deck', 'Income streams and development upside', 'From $28'),
      ],
    },
  },

  'buy-sell': {
    default: {
      headline: 'Buy & Sell templates for sale',
      description:
        'Sale agreements, bills of sale, listing packs and trader documents — buy from Worldwide Adverts and download instantly.',
      items: [
        pack(
          'Private sale agreement',
          'Buyer/seller details, item description, price, payment and handover terms',
          'From $18',
          '/templates/private-sale-agreement.html'
        ),
        pack(
          'Bill of sale',
          'Legal transfer receipt for goods — serial numbers, warranty disclaimer, signatures',
          'From $12',
          '/templates/bill-of-sale.html'
        ),
        pack(
          'Item listing description pack',
          'Title formulas, feature bullets, condition grades and SEO listing copy',
          'From $9',
          '/templates/item-listing-description.html'
        ),
        pack(
          'Purchase invoice / receipt',
          'Premium fillable invoice — ads/campaigns, tax, payment, print/PDF (Clive v1.0)',
          'From $8',
          '/templates/professional-invoice.html'
        ),
        pack(
          'Escrow & handover checklist',
          'Payment confirmation, inspection, delivery and dispute steps',
          'From $10',
          '/templates/escrow-handover-checklist.html'
        ),
        pack(
          'Startup business plan',
          'Fillable 10-page plan (LawDepot/HubSpot style) — fields for every section',
          'From $39',
          '/templates/startup-business-plan.html'
        ),
        pack(
          'Monthly calendar & planner',
          'Fillable month calendar with goals and weekly notes',
          'From $12',
          '/templates/monthly-calendar-planner.html'
        ),
        pack(
          'Weekly planner',
          'Fillable week priorities, daily blocks and habits',
          'From $9',
          '/templates/weekly-planner.html'
        ),
        pack(
          'Meal planner',
          'Weekly meals, shopping list and batch prep — fillable',
          'From $9',
          '/templates/meal-planner.html'
        ),
        pack(
          'Fitness planner',
          'Goals, weekly workouts and recovery — fillable',
          'From $9',
          '/templates/fitness-planner.html'
        ),
        pack(
          'Diet planner',
          'Macros, meal templates and grocery list — fillable',
          'From $9',
          '/templates/diet-planner.html'
        ),
        pack(
          'Event planner',
          'Brief, run-of-show, budget and vendors — fillable',
          'From $12',
          '/templates/event-planner.html'
        ),
        pack(
          'Party planner',
          'Theme, guests, menu and day-of checklist — fillable',
          'From $10',
          '/templates/party-planner.html'
        ),
        pack(
          'Wedding planner',
          'Couple details, vendors, budget and timeline — fillable',
          'From $14',
          '/templates/wedding-planner.html'
        ),
        pack(
          'Travel planner',
          'Itinerary, bookings, budget and packing — fillable',
          'From $10',
          '/templates/travel-planner.html'
        ),
        pack(
          'Weekly budget tracker',
          'Income, expenses and variance — fillable',
          'From $8',
          '/templates/budget-tracker-weekly.html'
        ),
        pack(
          'Monthly budget tracker',
          'Monthly bills and category budgets — fillable',
          'From $9',
          '/templates/budget-tracker-monthly.html'
        ),
        pack(
          'Yearly budget tracker',
          'Annual goals and category plan — fillable',
          'From $10',
          '/templates/budget-tracker-yearly.html'
        ),
        pack(
          'Social media captions pack',
          'Caption sets for property, fitness, food, fashion, B2B, travel, beauty, jobs',
          'From $12',
          '/templates/social-media-captions.html'
        ),
        pack(
          'Marketing flyer',
          'Fillable flyer / promo brief for print or design tools',
          'From $11',
          '/templates/marketing-flyer.html'
        ),
        pack(
          'Editable banner ads pack',
          'Multi-size IAB + social banners — editable canvas for buyers',
          'From $15',
          '/templates/banner-ads.html'
        ),
        pack(
          'Wedding invitation',
          'Fillable wedding invitation details',
          'From $14',
          '/templates/wedding-invitation.html'
        ),
        pack(
          'Birthday invitation',
          'Fillable birthday party invite',
          'From $8',
          '/templates/birthday-invitation.html'
        ),
        pack(
          'Reseller / trading plan',
          'Sourcing, margins, channels and cash flow for traders',
          'From $24',
          '/templates/startup-business-plan.html'
        ),
        pack(
          'Marketplace seller pitch',
          'Niche, inventory model and growth ask',
          'From $22',
          '/templates/investor-pitch-deck.html'
        ),
        pack(
          'Micro-business grant pack',
          'Need, equipment budget and impact for small sellers',
          'From $28',
          '/templates/grant-application-pack.html'
        ),
      ],
    },
    electronics: {
      headline: 'Electronics seller templates',
      description: 'Plans and pitches for gadget and device traders.',
      items: [
        pack('Electronics retail plan', 'SKU mix, warranty and turnover model', 'From $26'),
        pack('Repair shop business plan', 'Jobs mix, parts and utilisation', 'From $28'),
        pack('Equipment finance pitch', 'Bench tools ROI and loan request', 'From $22'),
      ],
    },
    vehicles: {
      headline: 'Vehicle trader templates',
      description: 'Dealer and private-trader funding packs.',
      items: [
        pack('Used-car dealer plan', 'Stock turns, finance and overheads', 'From $32'),
        pack('Dealer pitch deck', 'Sourcing, margins and expansion ask', 'From $28'),
        pack('Floorplan / stock loan pack', 'Inventory schedule and repayment', 'From $30'),
      ],
    },
    fashion: {
      headline: 'Fashion seller templates',
      description: 'Boutique and brand launch packs.',
      items: [
        pack('Fashion brand business plan', 'Collection, channels and unit economics', 'From $30'),
        pack('Boutique pitch deck', 'Positioning, margins and funding ask', 'From $26'),
        pack('Wholesale line sheet pack', 'Orders, MOQs and lookbook notes', 'From $18'),
      ],
    },
    'home-garden': {
      headline: 'Home & garden seller templates',
      description: 'Furniture and DIY trading business packs.',
      items: [
        pack('Home goods business plan', 'Categories, suppliers and margins', 'From $26'),
        pack('Furniture reseller pitch', 'Sourcing model and growth plan', 'From $22'),
        pack('Workshop grant pack', 'Tools, space and production budget', 'From $28'),
      ],
    },
    'books-media': {
      headline: 'Books & media seller templates',
      description: 'Bookstore, publisher and media trader packs.',
      items: [
        pack('Bookshop business plan', 'Range, events and footfall model', 'From $28'),
        pack('Publisher / imprint pitch', 'List, rights and distribution ask', 'From $30'),
        pack('Arts / culture grant pack', 'Programme, audience and budget', 'From $32'),
      ],
    },
    'sports-fitness': {
      headline: 'Sports & fitness seller templates',
      description: 'Gear trading and coaching business packs.',
      items: [
        pack('Sports retail plan', 'Categories, seasons and stock turns', 'From $26'),
        pack('Coaching business pitch', 'Offers, clients and revenue model', 'From $22'),
        pack('Club equipment grant pack', 'Kit list, usage and community impact', 'From $28'),
      ],
    },
    'baby-kids': {
      headline: 'Baby & kids seller templates',
      description: 'Kids retail and product business packs.',
      items: [
        pack('Kids retail business plan', 'Safety, range and parent demand', 'From $26'),
        pack('Product brand pitch deck', 'Problem, product and retail ask', 'From $28'),
        pack('Family enterprise grant pack', 'Need, budget and local impact', 'From $28'),
      ],
    },
    'pets-supplies': {
      headline: 'Pet supplies templates',
      description: 'Pet product and store funding packs.',
      items: [
        pack('Pet store business plan', 'SKU mix, suppliers and margins', 'From $26'),
        pack('Pet brand pitch deck', 'Product, channel and growth ask', 'From $24'),
        pack('Small retailer grant pack', 'Fit-out budget and outcomes', 'From $28'),
      ],
    },
    'tools-hardware': {
      headline: 'Tools & hardware templates',
      description: 'Trade supply and tool-hire business packs.',
      items: [
        pack('Hardware store plan', 'Categories, trade accounts and cash flow', 'From $28'),
        pack('Tool hire pitch deck', 'Fleet, utilisation and expansion ask', 'From $26'),
        pack('Trade equipment grant pack', 'Asset list, ROI and budget', 'From $30'),
      ],
    },
    'business-industrial': {
      headline: 'Business & industrial templates',
      description: 'B2B wholesale and equipment sale packs.',
      items: [
        pack('Wholesale business plan', 'MOQs, logistics and margin model', 'From $34'),
        pack('Industrial sales pitch', 'Capability, capacity and contracts', 'From $28'),
        pack('Capex / plant grant pack', 'Equipment, jobs and project budget', 'From $36'),
      ],
    },
    'collectibles-art': {
      headline: 'Collectibles & art templates',
      description: 'Gallery, dealer and artisan funding packs.',
      items: [
        pack('Gallery / dealer plan', 'Inventory, provenance and sales model', 'From $30'),
        pack('Artist / studio pitch', 'Practice, market and funding ask', 'From $24'),
        pack('Arts grant application', 'Project, audience, budget and impact', 'From $32'),
      ],
    },
    services: {
      headline: 'Local service business templates',
      description: 'Trade and service business funding packs.',
      items: [
        pack('Service business plan', 'Offers, pricing and utilisation', 'From $26'),
        pack('Client pitch proposal', 'Scope, timeline and fixed quote', 'From $18'),
        pack('Startup grant pack', 'Tools, van and first-year budget', 'From $28'),
      ],
    },
  },

  vehicles: {
    default: {
      headline: 'Vehicle business templates',
      description: 'Dealer, fleet and hire business plans and pitches.',
      items: [
        pack('Dealership business plan', 'Stock, finance and overhead model', 'From $34'),
        pack('Fleet / hire pitch deck', 'Utilisation, contracts and growth ask', 'From $28'),
        pack('Transport grant pack', 'Vehicle schedule, jobs and budget', 'From $30'),
      ],
    },
    car: {
      headline: 'Car dealer templates',
      description: 'Used and new-car business funding packs.',
      items: [
        pack('Car dealer business plan', 'Turns, GP and showroom costs', 'From $32'),
        pack('Stock finance pitch', 'Floorplan ask and repayment plan', 'From $28'),
        pack('Dealer expansion deck', 'Sites, team and 3-year forecast', 'From $30'),
      ],
    },
    motorbike: {
      headline: 'Motorbike business templates',
      description: 'Bike retail and workshop funding packs.',
      items: [
        pack('Bike shop business plan', 'Sales, service and accessory mix', 'From $28'),
        pack('Workshop pitch deck', 'Jobs, capacity and expansion ask', 'From $24'),
        pack('Retail fit-out grant pack', 'Display, tools and budget', 'From $26'),
      ],
    },
    van: {
      headline: 'Van & commercial templates',
      description: 'Commercial vehicle and courier business packs.',
      items: [
        pack('Courier / fleet plan', 'Routes, utilisation and opex', 'From $30'),
        pack('Van sales pitch deck', 'Stock mix and trade customers', 'From $24'),
        pack('Commercial vehicle grant', 'Fleet list, jobs and budget', 'From $28'),
      ],
    },
    truck: {
      headline: 'Truck & haulage templates',
      description: 'Haulage and heavy-vehicle funding packs.',
      items: [
        pack('Haulage business plan', 'Contracts, fuel, drivers and margins', 'From $36'),
        pack('Fleet expansion pitch', 'Trucks, routes and financing ask', 'From $32'),
        pack('Logistics grant application', 'Jobs, efficiency and project budget', 'From $34'),
      ],
    },
  },

  jobs: {
    default: {
      headline: 'Jobs, resume & CV templates',
      description:
        'Resume and CV layouts, cover letters, job descriptions and hiring packs — ready to customise.',
      items: [
        pack(
          'Professional resume template',
          'Clean modern resume — experience, skills, education and summary',
          'From $12',
          '/templates/professional-resume.html'
        ),
        pack(
          'Modern CV template',
          'UK-style CV with photo-ready header, achievements and references',
          'From $12',
          '/templates/modern-cv.html'
        ),
        pack(
          'Creative resume / CV',
          'Design-forward layout for creative and digital roles',
          'From $14',
          '/templates/creative-resume.html'
        ),
        pack(
          'Cover letter pack',
          'Three cover letter styles — cold outreach, application and referral',
          'From $9',
          '/templates/cover-letter-pack.html'
        ),
        pack(
          'Job description template',
          'Role summary, duties, requirements and benefits — hiring pack',
          'From $15',
          '/templates/job-description.html'
        ),
        pack(
          'Offer letter template',
          'Employment offer with salary, start date and conditions',
          'From $16',
          '/templates/offer-letter.html'
        ),
        pack(
          'Interview scorecard',
          'Structured interview notes and scoring grid for recruiters',
          'From $10',
          '/templates/interview-scorecard.html'
        ),
      ],
    },
  },

  books: {
    default: {
      headline: 'Author & publishing templates',
      description: 'Pitch decks, proposals and grant packs for writers and publishers.',
      items: [
        pack('Book proposal pack', 'Synopsis, market, comps and sample chapters', 'From $22', '/templates/book-proposal.html'),
        pack('Author platform pitch', 'Audience, books and partnership ask', 'From $20', '/templates/agency-pitch-deck.html'),
        pack('Publishing / arts grant', 'Project, audience reach and budget', 'From $28', '/templates/grant-application-pack.html'),
      ],
    },
    fiction: {
      headline: 'Fiction author templates',
      description: 'Novel proposals and series pitch packs.',
      items: [
        pack('Novel submission pack', 'Query, synopsis and comps list', 'From $18'),
        pack('Series pitch deck', 'World, arcs and reader market', 'From $20'),
        pack('Literary grant application', 'Project plan, timeline and budget', 'From $26'),
      ],
    },
    'non-fiction': {
      headline: 'Non-fiction author templates',
      description: 'Authority book proposals and platform pitches.',
      items: [
        pack('Non-fiction book proposal', 'Thesis, outline, audience and platform', 'From $24'),
        pack('Thought-leadership pitch', 'Talks, media and book ask', 'From $22'),
        pack('Research / writing grant', 'Scope, methods and budget', 'From $30'),
      ],
    },
    romance: {
      headline: 'Romance author templates',
      description: 'Series and imprint pitch packs for romance.',
      items: [
        pack('Romance series proposal', 'Tropes, arcs and reader comps', 'From $18'),
        pack('Author brand pitch', 'Newsletter, launches and partnerships', 'From $16'),
        pack('Creative grant pack', 'Project, audience and budget', 'From $24'),
      ],
    },
    thriller: {
      headline: 'Thriller author templates',
      description: 'High-concept pitch and grant packs.',
      items: [
        pack('Thriller proposal pack', 'Hook, stakes, comps and sample', 'From $18'),
        pack('Series bible + pitch', 'Timeline, cast and market', 'From $22'),
        pack('Writing grant application', 'Plan, deliverables and budget', 'From $24'),
      ],
    },
    mystery: {
      headline: 'Mystery author templates',
      description: 'Detective and puzzle novel pitch packs.',
      items: [
        pack('Mystery proposal pack', 'Puzzle, series and comps', 'From $18'),
        pack('Series continuity pitch', 'Cases, cast and reader path', 'From $20'),
        pack('Arts funding application', 'Project scope and budget', 'From $24'),
      ],
    },
    fantasy: {
      headline: 'Fantasy author templates',
      description: 'World-building proposals and series pitches.',
      items: [
        pack('Fantasy series proposal', 'World, magic system and comps', 'From $22'),
        pack('Epic pitch deck', 'Books, audience and rights ask', 'From $20'),
        pack('Creative project grant', 'Timeline, deliverables and budget', 'From $26'),
      ],
    },
    'sci-fi': {
      headline: 'Sci-fi author templates',
      description: 'Speculative fiction pitch and grant packs.',
      items: [
        pack('Sci-fi book proposal', 'Premise, tech and market comps', 'From $20'),
        pack('IP / rights pitch deck', 'Adaptations and partnership ask', 'From $24'),
        pack('Writing grant pack', 'Research, drafts and budget', 'From $26'),
      ],
    },
    'self-help': {
      headline: 'Self-help author templates',
      description: 'Transformation book and course pitch packs.',
      items: [
        pack('Self-help book proposal', 'Promise, outline and platform proof', 'From $24'),
        pack('Course + book pitch', 'Curriculum, pricing and funnel', 'From $26'),
        pack('Wellbeing grant application', 'Outcomes, reach and budget', 'From $28'),
      ],
    },
    business: {
      headline: 'Business author templates',
      description: 'Leadership book and speaking pitch packs.',
      items: [
        pack('Business book proposal', 'Framework, cases and executive audience', 'From $26'),
        pack('Speaking + book pitch', 'Keynotes, fees and media kit', 'From $24'),
        pack('Thought-leadership plan', 'Content calendar and revenue model', 'From $22'),
      ],
    },
    biography: {
      headline: 'Biography & memoir templates',
      description: 'Life-story proposals and funding packs.',
      items: [
        pack('Memoir / bio proposal', 'Arc, themes, access and comps', 'From $22'),
        pack('Subject rights pitch', 'Story, market and partnership ask', 'From $20'),
        pack('Heritage / arts grant', 'Research plan and budget', 'From $28'),
      ],
    },
    children: {
      headline: "Children's book templates",
      description: 'Picture-book and YA pitch packs.',
      items: [
        pack("Children's book proposal", 'Age range, theme and sample pages', 'From $18'),
        pack('School market pitch', 'Classroom fit and adoption ask', 'From $20'),
        pack('Education grant pack', 'Literacy outcomes and budget', 'From $26'),
      ],
    },
    poetry: {
      headline: 'Poetry & chapbook templates',
      description: 'Collection pitches and arts funding packs.',
      items: [
        pack('Collection proposal pack', 'Theme, sample poems and comps', 'From $14'),
        pack('Reading tour pitch', 'Venues, audience and sponsorship ask', 'From $16'),
        pack('Arts council grant pack', 'Project, reach and detailed budget', 'From $24'),
      ],
    },
  },

  'businesses-for-sale': {
    default: {
      headline: 'Business sale templates',
      description: 'Pitch decks, prospectus packs and grant/loan docs for buying or selling a business.',
      items: [
        pack('Sale prospectus pack', 'Summary, financials, assets and reason for sale', 'From $45', '/templates/sale-prospectus.html'),
        pack('Buyer / investor pitch deck', 'Opportunity, returns and handover plan', 'From $36', '/templates/investor-pitch-deck.html'),
        pack('Acquisition loan / grant pack', 'Ask, use of funds and repayment', 'From $38', '/templates/grant-application-pack.html'),
      ],
    },
    websites: {
      headline: 'Website business sale templates',
      description: 'Due-diligence and teaser packs for site exits.',
      items: [
        pack('Website teaser deck', 'Traffic, niche, monetisation and ask', 'From $32'),
        pack('Content site prospectus', 'Analytics, content assets and ops', 'From $36'),
        pack('Acquisition finance pack', 'Valuation, funds use and plan', 'From $34'),
      ],
    },
    apps: {
      headline: 'App & SaaS sale templates',
      description: 'MRR and tech exit pitch packs.',
      items: [
        pack('SaaS exit pitch deck', 'MRR, churn, stack and growth', 'From $40'),
        pack('Product prospectus pack', 'Roadmap, customers and handoff', 'From $38'),
        pack('Tech acquisition grant/loan', 'Funds use, jobs and milestones', 'From $36'),
      ],
    },
    ebooks: {
      headline: 'Digital product sale templates',
      description: 'Content and info-product exit packs.',
      items: [
        pack('Digital asset prospectus', 'Products, funnels and earnings', 'From $28'),
        pack('Audience business pitch', 'List size, engagement and ask', 'From $26'),
        pack('Buyer finance pack', 'Valuation narrative and repayment', 'From $30'),
      ],
    },
    'online-stores': {
      headline: 'Online store sale templates',
      description: 'eCommerce exit and buyer funding packs.',
      items: [
        pack('eCom teaser deck', 'AOV, SKUs, channels and margins', 'From $34'),
        pack('Store sale prospectus', 'Suppliers, ops and financials', 'From $38'),
        pack('Inventory finance pack', 'Stock value and working capital ask', 'From $32'),
      ],
    },
    shops: {
      headline: 'Retail shop sale templates',
      description: 'High-street business sale packs.',
      items: [
        pack('Shop sale prospectus', 'Lease, stock, footfall and accounts', 'From $40'),
        pack('Buyer pitch deck', 'Opportunity, margins and handover', 'From $32'),
        pack('Acquisition loan pack', 'Deposit, stock and fit-out ask', 'From $34'),
      ],
    },
    garages: {
      headline: 'Garage sale templates',
      description: 'Automotive business exit and finance packs.',
      items: [
        pack('Garage prospectus pack', 'Bays, equipment, contracts and accounts', 'From $42'),
        pack('Buyer investment pitch', 'Utilisation, margins and plan', 'From $34'),
        pack('Equipment finance pack', 'Asset schedule and ROI', 'From $30'),
      ],
    },
    restaurants: {
      headline: 'Restaurant sale templates',
      description: 'Food business sale and funding packs.',
      items: [
        pack('Restaurant prospectus', 'Covers, lease, kitchen and P&L', 'From $42'),
        pack('Hospitality pitch deck', 'Concept, margins and growth', 'From $32'),
        pack('Fit-out / acquisition loan', 'Use of funds and cash flow', 'From $34'),
      ],
    },
    hotels: {
      headline: 'Hotel & hospitality sale templates',
      description: 'Stay business prospectus and finance packs.',
      items: [
        pack('Property sale prospectus', 'Rooms, ADR, occupancy and opex', 'From $48'),
        pack('Hospitality investor pitch', 'Returns, CapEx and handover', 'From $40'),
        pack('Tourism grant / loan pack', 'Jobs, upgrades and budget', 'From $36'),
      ],
    },
    salons: {
      headline: 'Salon sale templates',
      description: 'Beauty business exit and finance packs.',
      items: [
        pack('Salon sale prospectus', 'Chairs, clients, lease and accounts', 'From $36'),
        pack('Buyer pitch deck', 'Retention, retail and growth plan', 'From $28'),
        pack('Fit-out finance pack', 'Equipment list and repayment', 'From $26'),
      ],
    },
    warehouses: {
      headline: 'Warehouse & industrial sale templates',
      description: 'Industrial facility sale and CapEx packs.',
      items: [
        pack('Facility prospectus pack', 'Sq ft, access, zoning and tenants', 'From $46'),
        pack('Industrial investor pitch', 'Yield, CapEx and ops plan', 'From $40'),
        pack('Plant CapEx grant/loan', 'Equipment, jobs and budget', 'From $38'),
      ],
    },
  },
};

/** Map loose category names/slugs from APIs onto config keys */
const BUYSELL_ALIASES = [
  { key: 'electronics', match: /electron|phone|laptop|computer|gadget|smart/i },
  { key: 'vehicles', match: /vehicle|car|auto|motor/i },
  { key: 'fashion', match: /fashion|clothing|apparel|shoe|wear/i },
  { key: 'home-garden', match: /home|garden|furniture|diy/i },
  { key: 'books-media', match: /book|media|movie|music|game/i },
  { key: 'sports-fitness', match: /sport|fitness|outdoor|bike|bicycle/i },
  { key: 'baby-kids', match: /baby|kid|child|toy|nursery/i },
  { key: 'pets-supplies', match: /pet|animal/i },
  { key: 'tools-hardware', match: /tool|hardware|workshop/i },
  { key: 'business-industrial', match: /business|industrial|wholesale|office/i },
  { key: 'collectibles-art', match: /collect|art|antique|vintage/i },
  { key: 'services', match: /service/i },
];

export function resolveCategoryTemplateKey(vertical, categoryKey = '', categoryName = '') {
  const verticalMap = CATEGORY_TEMPLATES[vertical];
  if (!verticalMap) return null;

  const raw = String(categoryKey || '').trim().toLowerCase();
  const name = String(categoryName || '').trim();

  if (raw && verticalMap[raw]) return raw;

  const slugified = raw.replace(/_/g, '-');
  if (slugified && verticalMap[slugified]) return slugified;

  if (vertical === 'buy-sell') {
    const haystack = `${raw} ${name}`.trim();
    const hit = BUYSELL_ALIASES.find((a) => a.match.test(haystack));
    if (hit && verticalMap[hit.key]) return hit.key;
  }

  if (name) {
    const nameSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    if (verticalMap[nameSlug]) return nameSlug;
    const aliasHit = BUYSELL_ALIASES.find((a) => a.match.test(name));
    if (vertical === 'buy-sell' && aliasHit && verticalMap[aliasHit.key]) return aliasHit.key;
  }

  return 'default';
}

export function getCategoryTemplates(vertical, categoryKey = '', categoryName = '') {
  const verticalMap = CATEGORY_TEMPLATES[vertical];
  if (!verticalMap) return null;

  const key = resolveCategoryTemplateKey(vertical, categoryKey, categoryName);
  const section = verticalMap[key] || verticalMap.default || null;
  if (!section?.items?.length) return section;

  return {
    ...section,
    items: section.items.map((item) => ({
      ...item,
      file: resolveTemplateAssetUrl(item.file || resolveTemplateFile(item.title)),
    })),
  };
}

/** Map pack titles to downloadable HTML templates in /public/templates */
export function resolveTemplateFile(title = '') {
  const t = String(title).toLowerCase();
  if (t.includes('commercial agreement') || t.includes('dispute-ready') || t.includes('dispute ready')) {
    return '/templates/commercial-agreement.html';
  }
  if (t.includes('bill of sale')) return '/templates/bill-of-sale.html';
  if (t.includes('private sale') || (t.includes('sale agreement') && !t.includes('commercial'))) {
    return '/templates/private-sale-agreement.html';
  }
  if (t.includes('listing description') || t.includes('item listing')) {
    return '/templates/item-listing-description.html';
  }
  if (t.includes('invoice') || t.includes('receipt')) {
    return '/templates/professional-invoice.html';
  }
  if (t.includes('calendar') || t.includes('monthly planner')) {
    return '/templates/monthly-calendar-planner.html';
  }
  if (t.includes('weekly budget')) return '/templates/budget-tracker-weekly.html';
  if (t.includes('monthly budget')) return '/templates/budget-tracker-monthly.html';
  if (t.includes('yearly budget') || t.includes('annual budget')) {
    return '/templates/budget-tracker-yearly.html';
  }
  if (t.includes('budget tracker')) return '/templates/budget-tracker-monthly.html';
  if (t.includes('meal planner')) return '/templates/meal-planner.html';
  if (t.includes('fitness planner')) return '/templates/fitness-planner.html';
  if (t.includes('diet planner')) return '/templates/diet-planner.html';
  if (t.includes('event planner')) return '/templates/event-planner.html';
  if (t.includes('party planner')) return '/templates/party-planner.html';
  if (t.includes('wedding planner')) return '/templates/wedding-planner.html';
  if (t.includes('travel planner')) return '/templates/travel-planner.html';
  if (t.includes('social media caption') || t.includes('captions pack')) {
    return '/templates/social-media-captions.html';
  }
  if (t.includes('weekly planner') || t.includes('week planner')) {
    return '/templates/weekly-planner.html';
  }
  if (t.includes('flyer') || t.includes('flier') || t.includes('flayer')) {
    return '/templates/marketing-flyer.html';
  }
  if (t.includes('banner')) {
    return '/templates/banner-ads.html';
  }
  if (t.includes('agency business') || (t.includes('agency') && t.includes('plan'))) {
    return '/templates/agency-business-plan.html';
  }
  if (t.includes('rental listing')) {
    return '/templates/rental-listing-pack.html';
  }
  if (t.includes('landlord') || t.includes('property manager') || t.includes('pm proposal')) {
    return '/templates/landlord-proposal.html';
  }
  if (t.includes('wedding')) {
    return '/templates/wedding-invitation.html';
  }
  if (t.includes('birthday')) {
    return '/templates/birthday-invitation.html';
  }
  if (t.includes('escrow') || t.includes('handover')) {
    return '/templates/escrow-handover-checklist.html';
  }
  if (t.includes('grant') || t.includes('loan pack') || t.includes('finance pack')) {
    return '/templates/grant-application-pack.html';
  }
  if (t.includes('prospectus') || t.includes('sale prospectus') || t.includes('teaser')) {
    return '/templates/sale-prospectus.html';
  }
  if (t.includes('saas') || t.includes('app /') || t.includes('app pitch')) {
    return '/templates/saas-pitch-deck.html';
  }
  if (t.includes('audit') || t.includes('roadmap')) {
    return '/templates/it-audit-roadmap.html';
  }
  if (t.includes('book proposal') || t.includes('novel') || t.includes('memoir')) {
    return '/templates/book-proposal.html';
  }
  if (t.includes('marketing') || t.includes('campaign') || t.includes('media plan')) {
    return '/templates/marketing-campaign-proposal.html';
  }
  if (t.includes('website') || t.includes('web project')) {
    return '/templates/website-project-proposal.html';
  }
  if (t.includes('restaurant') || t.includes('catering') || t.includes('hospitality business')) {
    return '/templates/restaurant-business-plan.html';
  }
  if (t.includes('agency') || t.includes('capability') || t.includes('credentials')) {
    return '/templates/agency-pitch-deck.html';
  }
  if (t.includes('proposal') || t.includes('sow') || t.includes('brief')) {
    return '/templates/client-proposal-sow.html';
  }
  if (t.includes('pitch') || t.includes('investor') || t.includes('donor')) {
    return '/templates/investor-pitch-deck.html';
  }
  if (t.includes('executive summary') || t.includes('exec summary')) {
    return '/templates/business-plan-executive-summary.html';
  }
  if (t.includes('plan') || t.includes('business')) {
    return '/templates/startup-business-plan.html';
  }
  return '/templates/startup-business-plan.html';
}

/** Section / page titles for Preview (not the full document). */
const TEMPLATE_PAGE_TITLES = {
  '/templates/private-sale-agreement.html': [
    'Parties',
    'Item description',
    'Purchase price & payment',
    'Inspection & acceptance',
    'Transfer of ownership',
    'Warranties & disclaimers',
    'Handover',
    'Signatures',
  ],
  '/templates/commercial-agreement.html': [
    'Parties & date',
    'Purpose & scope',
    'Term & termination',
    'Fees & payment',
    'Cooperation obligations',
    'Dispute protection',
    'Liability & insurance',
    'Confidentiality & IP',
    'Data & compliance',
    'General & schedules',
    'Signatures',
  ],
  '/templates/bill-of-sale.html': [
    'Seller',
    'Buyer',
    'Property sold',
    'Consideration',
    'Condition',
    'Acknowledgement',
    'Signatures',
  ],
  '/templates/item-listing-description.html': [
    'Title formula',
    'Opening hook',
    'Feature bullets',
    'Condition & history',
    'Price positioning',
    'Logistics',
    'Photo checklist',
  ],
  '/templates/purchase-invoice-receipt.html': [
    'Seller (from)',
    'Buyer (bill to)',
    'Invoice meta',
    'Line items',
    'Totals',
    'Payment',
    'Notes',
  ],
  '/templates/escrow-handover-checklist.html': [
    'Before payment',
    'Payment held',
    'Inspection',
    'Handover',
    'Release funds',
    'If dispute',
  ],
  '/templates/investor-pitch-deck.html': [
    'Title & Vision',
    'Problem',
    'Solution',
    'Market Opportunity',
    'Product',
    'Business Model',
    'Traction',
    'Go-to-Market',
    'Competition',
    'Team',
    'Financials',
    'The Ask',
  ],
  '/templates/grant-application-pack.html': [
    'Organisation summary',
    'Need / problem statement',
    'Project goals & objectives',
    'Activities & methods',
    'Beneficiaries & impact',
    'Evaluation plan',
    'Budget summary',
    'Match funding / sustainability',
    'Risks & mitigation',
  ],
  '/templates/startup-business-plan.html': [
    'Cover & business details',
    'Executive summary',
    'Company description',
    'Market analysis',
    'Products & services',
    'Marketing & sales strategy',
    'Operations & team',
    'Financial plan',
    'Funding request',
    'Appendix & checklist',
  ],
  '/templates/business-plan-executive-summary.html': [
    'Business information',
    'Description & statements',
    'Executive summary',
    'Products / services',
    'Target market',
    'Goals / milestones',
    'Funding requirement',
    'Notes & checklist',
  ],
  '/templates/professional-invoice.html': [
    'Brand header & status',
    'Company & client',
    'Invoice meta',
    'Line items (tax / discount)',
    'Totals & balance due',
    'Payment & terms',
  ],
  '/templates/monthly-calendar-planner.html': [
    'Month setup & goals',
    'Weekly grid',
    'Month review',
  ],
  '/templates/weekly-planner.html': [
    'Week priorities',
    'Daily schedule',
    'Habits & notes',
  ],
  '/templates/meal-planner.html': ['Week setup', 'Daily meals', 'Shopping & prep'],
  '/templates/fitness-planner.html': ['Goals', 'Weekly schedule', 'Recovery'],
  '/templates/diet-planner.html': ['Targets', 'Daily structure', 'Grocery list'],
  '/templates/event-planner.html': ['Event brief', 'Run of show', 'Budget & vendors'],
  '/templates/party-planner.html': ['Party details', 'Food & vibe', 'Day-of checklist'],
  '/templates/wedding-planner.html': ['Couple & date', 'Vendors', 'Budget & day-of'],
  '/templates/travel-planner.html': ['Trip overview', 'Bookings', 'Itinerary & packing'],
  '/templates/budget-tracker-weekly.html': ['Week setup', 'Income', 'Expenses'],
  '/templates/budget-tracker-monthly.html': ['Month setup', 'Income', 'Expenses'],
  '/templates/budget-tracker-yearly.html': ['Year setup', 'Income', 'Expenses'],
  '/templates/social-media-captions.html': [
    'Brand voice',
    'Property captions',
    'Fitness captions',
    'Food captions',
    'Fashion captions',
    'B2B captions',
    'Travel captions',
    'Beauty captions',
    'Jobs captions',
  ],
  '/templates/marketing-flyer.html': [
    'Headline & offer',
    'Event details',
    'Contact & print size',
  ],
  '/templates/event-banner.html': [
    'Banner copy',
    'Size & dates',
    'Legal line',
  ],
  '/templates/wedding-invitation.html': [
    'Couple & hosts',
    'Ceremony',
    'Reception & RSVP',
  ],
  '/templates/birthday-invitation.html': [
    'Guest of honour',
    'Party details',
    'RSVP & notes',
  ],
  '/templates/restaurant-business-plan.html': [
    'Concept',
    'Location & capacity',
    'Menu & food cost',
    'Operations',
    'Marketing',
    'Financials',
    'Funding ask',
  ],
  '/templates/sale-prospectus.html': [
    'Business overview',
    'Reason for sale',
    'Operations snapshot',
    'Financial highlights',
    'Assets included',
    'Asking price & terms',
    'Next steps',
  ],
  '/templates/saas-pitch-deck.html': [
    'Problem',
    'Product',
    'Market',
    'Business model',
    'Traction',
    'Go-to-market',
    'Roadmap',
    'Team & ask',
  ],
  '/templates/agency-pitch-deck.html': [
    'About us',
    'What we do',
    'How we work',
    'Case studies',
    'Team',
    'Engagement models',
    'Next steps',
  ],
  '/templates/client-proposal-sow.html': [
    'Client & project',
    'Background & objectives',
    'Scope of work',
    'Out of scope',
    'Timeline & milestones',
    'Investment',
    'Assumptions & client responsibilities',
    'Acceptance & revisions',
    'Signatures',
  ],
  '/templates/book-proposal.html': [
    'Working title & genre',
    'One-paragraph pitch',
    'Target reader',
    'Outline',
    'Author bio & platform',
    'Marketing ideas',
    'Sample',
  ],
  '/templates/marketing-campaign-proposal.html': [
    'Campaign overview',
    'Audience',
    'Strategy & channels',
    'Creative direction',
    'Budget',
    'KPIs & reporting',
    'Timeline',
  ],
  '/templates/website-project-proposal.html': [
    'Project summary',
    'Discovery',
    'Deliverables',
    'Tech stack',
    'Timeline',
    'Investment',
    'Maintenance (optional)',
  ],
  '/templates/it-audit-roadmap.html': [
    'Engagement overview',
    'Current state',
    'Findings',
    'Priority roadmap',
    'Investment estimate',
    'Next workshop',
  ],
};

/** Returns page/section titles for a template preview list. */
export function getTemplatePageTitles(titleOrFile = '') {
  const raw = String(titleOrFile || '');
  let file = raw.startsWith('/templates/')
    ? raw.split('?')[0]
    : resolveTemplateFile(raw);
  if (file.includes('/templates/')) {
    const idx = file.indexOf('/templates/');
    file = file.slice(idx).split('?')[0];
  }
  return TEMPLATE_PAGE_TITLES[file] || [
    'Cover / title page',
    'Overview',
    'Details',
    'Pricing / terms',
    'Next steps',
  ];
}

export default CATEGORY_TEMPLATES;
