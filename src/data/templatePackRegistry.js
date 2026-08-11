/**
 * Template packs — multi-page structure for Clive’s workflow.
 *
 * Vikas / Shihab create one HTML page per section title.
 * Zain drops files into public/templates/packs/{packSlug}/pages/
 * and sets ready: true in this registry (or in the pack’s manifest.json).
 *
 * Preview shows page titles + a tiny teaser of the selected page.
 * Purchase still downloads the full combined template (fullFile).
 */

import {
  getTemplatePageTitles,
  resolveTemplateFile,
} from '../constants/categoryTemplates';

const page = (title, file = null, ready = false) => ({
  title,
  file,
  ready: Boolean(ready && file),
});

/**
 * Pack definitions keyed by full download path (/templates/foo.html).
 * When a pack has pages[].file ready, Preview can show a teaser iframe.
 */
export const TEMPLATE_PACKS = {
  '/templates/website-project-proposal.html': {
    slug: 'website-project-proposal',
    title: 'Website project proposal',
    fullFile: '/templates/website-project-proposal.html',
    pages: [
      page('Project summary', 'pages/01-project-summary.html', true),
      page('Discovery', 'pages/02-discovery.html', true),
      page('Deliverables', 'pages/03-deliverables.html', false),
      page('Tech stack', 'pages/04-tech-stack.html', false),
      page('Timeline', 'pages/05-timeline.html', false),
      page('Investment', 'pages/06-investment.html', false),
      page('Maintenance (optional)', 'pages/07-maintenance.html', false),
    ],
  },
  '/templates/private-sale-agreement.html': {
    slug: 'private-sale-agreement',
    title: 'Private sale agreement',
    fullFile: '/templates/private-sale-agreement.html',
    pages: [
      page('Parties'),
      page('Item description'),
      page('Purchase price & payment'),
      page('Inspection & acceptance'),
      page('Transfer of ownership'),
      page('Warranties & disclaimers'),
      page('Handover'),
      page('Signatures'),
    ],
  },
  '/templates/commercial-agreement.html': {
    slug: 'commercial-agreement',
    title: 'Commercial agreement (dispute-ready)',
    fullFile: '/templates/commercial-agreement.html',
    pages: [
      page('Parties & date'),
      page('Purpose & scope'),
      page('Term & termination'),
      page('Fees & payment'),
      page('Cooperation obligations'),
      page('Dispute protection'),
      page('Liability & insurance'),
      page('Confidentiality & IP'),
      page('Data & compliance'),
      page('General & schedules'),
      page('Signatures'),
    ],
  },
  '/templates/investor-pitch-deck.html': {
    slug: 'investor-pitch-deck',
    title: 'Investor pitch deck',
    fullFile: '/templates/investor-pitch-deck.html',
    pages: [
      page('Title & Vision'),
      page('Problem'),
      page('Solution'),
      page('Market Opportunity'),
      page('Product'),
      page('Business Model'),
      page('Traction'),
      page('Go-to-Market'),
      page('Competition'),
      page('Team'),
      page('Financials'),
      page('The Ask'),
    ],
  },
  '/templates/startup-business-plan.html': {
    slug: 'startup-business-plan',
    title: 'Startup business plan',
    fullFile: '/templates/startup-business-plan.html',
    pages: [
      page('Cover & business details', 'pages/01-cover-and-business-details.html', true),
      page('Executive summary', 'pages/02-executive-summary.html', true),
      page('Company description', 'pages/03-company-description.html', true),
      page('Market analysis', 'pages/04-market-analysis.html', true),
      page('Products & services', 'pages/05-products-and-services.html', true),
      page('Marketing & sales strategy', 'pages/06-marketing-and-sales.html', true),
      page('Operations & team', 'pages/07-operations-and-team.html', true),
      page('Financial plan', 'pages/08-financial-plan.html', true),
      page('Funding request', 'pages/09-funding-request.html', true),
      page('Appendix & checklist', 'pages/10-appendix-checklist.html', true),
    ],
  },
  '/templates/business-plan-executive-summary.html': {
    slug: 'business-plan-executive-summary',
    title: 'Business Plan — Executive Summary',
    fullFile: '/templates/business-plan-executive-summary.html',
    pages: [
      page('Executive Summary (fillable)', 'index.html', true),
    ],
  },
  '/templates/professional-invoice.html': {
    slug: 'professional-invoice',
    title: 'Professional invoice',
    fullFile: '/templates/packs/professional-invoice/index.html',
    pages: [
      page('Fillable invoice (Clive v1.0)', 'index.html', true),
    ],
  },
  '/templates/monthly-calendar-planner.html': {
    slug: 'monthly-calendar-planner',
    title: 'Monthly calendar & planner',
    fullFile: '/templates/monthly-calendar-planner.html',
    pages: [
      page('Month setup & goals', 'index.html', true),
      page('Weekly grid', 'index.html', true),
      page('Habits & review', 'index.html', true),
    ],
  },
  '/templates/weekly-planner.html': {
    slug: 'weekly-planner',
    title: 'Weekly planner',
    fullFile: '/templates/weekly-planner.html',
    pages: [
      page('Week setup & Big 3', 'index.html', true),
      page('Daily schedule', 'index.html', true),
      page('Habits & notes', 'index.html', true),
    ],
  },
  '/templates/meal-planner.html': {
    slug: 'meal-planner',
    title: 'Meal planner',
    fullFile: '/templates/meal-planner.html',
    pages: [
      page('Week setup', 'index.html', true),
      page('Daily meals', 'index.html', true),
      page('Shopping & prep', 'index.html', true),
    ],
  },
  '/templates/fitness-planner.html': {
    slug: 'fitness-planner',
    title: 'Fitness planner',
    fullFile: '/templates/fitness-planner.html',
    pages: [
      page('Goals', 'index.html', true),
      page('Weekly schedule', 'index.html', true),
      page('Recovery', 'index.html', true),
    ],
  },
  '/templates/diet-planner.html': {
    slug: 'diet-planner',
    title: 'Diet planner',
    fullFile: '/templates/diet-planner.html',
    pages: [
      page('Targets', 'index.html', true),
      page('Daily structure', 'index.html', true),
      page('Grocery list', 'index.html', true),
    ],
  },
  '/templates/event-planner.html': {
    slug: 'event-planner',
    title: 'Event planner',
    fullFile: '/templates/event-planner.html',
    pages: [
      page('Event brief', 'index.html', true),
      page('Run of show', 'index.html', true),
      page('Budget & vendors', 'index.html', true),
    ],
  },
  '/templates/party-planner.html': {
    slug: 'party-planner',
    title: 'Party planner',
    fullFile: '/templates/party-planner.html',
    pages: [
      page('Party details', 'index.html', true),
      page('Food & vibe', 'index.html', true),
      page('Day-of checklist', 'index.html', true),
    ],
  },
  '/templates/wedding-planner.html': {
    slug: 'wedding-planner',
    title: 'Wedding planner',
    fullFile: '/templates/wedding-planner.html',
    pages: [
      page('Couple & date', 'index.html', true),
      page('Vendors', 'index.html', true),
      page('Budget & day-of', 'index.html', true),
    ],
  },
  '/templates/travel-planner.html': {
    slug: 'travel-planner',
    title: 'Travel planner',
    fullFile: '/templates/travel-planner.html',
    pages: [
      page('Trip overview', 'index.html', true),
      page('Bookings', 'index.html', true),
      page('Itinerary & packing', 'index.html', true),
    ],
  },
  '/templates/budget-tracker-weekly.html': {
    slug: 'budget-tracker-weekly',
    title: 'Weekly budget tracker',
    fullFile: '/templates/budget-tracker-weekly.html',
    pages: [
      page('Week setup', 'index.html', true),
      page('Income', 'index.html', true),
      page('Expenses', 'index.html', true),
    ],
  },
  '/templates/budget-tracker-monthly.html': {
    slug: 'budget-tracker-monthly',
    title: 'Monthly budget tracker',
    fullFile: '/templates/budget-tracker-monthly.html',
    pages: [
      page('Month setup', 'index.html', true),
      page('Income', 'index.html', true),
      page('Expenses', 'index.html', true),
    ],
  },
  '/templates/budget-tracker-yearly.html': {
    slug: 'budget-tracker-yearly',
    title: 'Yearly budget tracker',
    fullFile: '/templates/budget-tracker-yearly.html',
    pages: [
      page('Year setup', 'index.html', true),
      page('Income', 'index.html', true),
      page('Expenses', 'index.html', true),
    ],
  },
  '/templates/social-media-captions.html': {
    slug: 'social-media-captions',
    title: 'Social media captions pack',
    fullFile: '/templates/social-media-captions.html',
    pages: [
      page('Brand voice', 'index.html', true),
      page('Niche caption sets', 'index.html', true),
    ],
  },
  '/templates/marketing-flyer.html': {
    slug: 'marketing-flyer',
    title: 'Marketing flyer',
    fullFile: '/templates/marketing-flyer.html',
    pages: [
      page('Headline & offer'),
      page('Event details'),
      page('Contact & print size'),
    ],
  },
  '/templates/banner-ads.html': {
    slug: 'banner-ads',
    title: 'Editable banner ads pack',
    fullFile: '/templates/banner-ads.html',
    pages: [
      page('Multi-size editable canvas', 'index.html', true),
    ],
  },
  '/templates/event-banner.html': {
    slug: 'event-banner',
    title: 'Event / promo banner',
    fullFile: '/templates/banner-ads.html',
    pages: [
      page('Multi-size editable canvas', 'index.html', true),
    ],
  },
  '/templates/agency-business-plan.html': {
    slug: 'agency-business-plan',
    title: 'Estate agency business plan',
    fullFile: '/templates/agency-business-plan.html',
    pages: [
      page('Agency identity & fees', null, false),
      page('Market & pipeline', null, false),
      page('Team & financials', null, false),
    ],
  },
  '/templates/rental-listing-pack.html': {
    slug: 'rental-listing-pack',
    title: 'Rental listing pack',
    fullFile: '/templates/rental-listing-pack.html',
    pages: [
      page('Property & lease', null, false),
      page('Amenities & inventory', null, false),
      page('Tenant checklist', null, false),
    ],
  },
  '/templates/landlord-proposal.html': {
    slug: 'landlord-proposal',
    title: 'Landlord / PM proposal',
    fullFile: '/templates/landlord-proposal.html',
    pages: [
      page('Services & fees', null, false),
      page('SLA & term', null, false),
    ],
  },
  '/templates/wedding-invitation.html': {
    slug: 'wedding-invitation',
    title: 'Wedding invitation',
    fullFile: '/templates/wedding-invitation.html',
    pages: [
      page('Couple & hosts'),
      page('Ceremony'),
      page('Reception & RSVP'),
    ],
  },
  '/templates/birthday-invitation.html': {
    slug: 'birthday-invitation',
    title: 'Birthday invitation',
    fullFile: '/templates/birthday-invitation.html',
    pages: [
      page('Guest of honour'),
      page('Party details'),
      page('RSVP & notes'),
    ],
  },
  '/templates/grant-application-pack.html': {
    slug: 'grant-application-pack',
    title: 'Grant application pack',
    fullFile: '/templates/grant-application-pack.html',
    pages: [
      page('Organisation summary'),
      page('Need / problem statement'),
      page('Project goals & objectives'),
      page('Activities & methods'),
      page('Beneficiaries & impact'),
      page('Evaluation plan'),
      page('Budget summary'),
      page('Match funding / sustainability'),
      page('Risks & mitigation'),
    ],
  },
};

function normalizeTemplatePath(titleOrFile = '') {
  const raw = String(titleOrFile || '');
  let file = raw.includes('/templates/')
    ? raw.slice(raw.indexOf('/templates/')).split('?')[0]
    : resolveTemplateFile(raw);
  if (file.includes('/templates/')) {
    file = file.slice(file.indexOf('/templates/')).split('?')[0];
  }
  return file;
}

/** Resolve pack for a shop item (by file path or title). */
export function getTemplatePack(titleOrFile = '') {
  const file = normalizeTemplatePath(titleOrFile);
  const pack = TEMPLATE_PACKS[file];
  if (pack) {
    return {
      ...pack,
      pages: pack.pages.map((p) => ({
        ...p,
        previewUrl: p.ready && p.file
          ? `/templates/packs/${pack.slug}/${p.file}`
          : null,
      })),
    };
  }

  // Fallback: titles only from categoryTemplates map
  const titles = getTemplatePageTitles(file);
  const slug = file
    .replace(/^\/templates\//, '')
    .replace(/\.html$/i, '')
    .replace(/[^a-z0-9-]+/gi, '-')
    .toLowerCase();

  return {
    slug,
    title: slug.replace(/-/g, ' '),
    fullFile: file,
    pages: titles.map((title) => ({
      title,
      file: null,
      ready: false,
      previewUrl: null,
    })),
  };
}

/** Mark a page ready after dropping the HTML file (helper for future tooling). */
export function packPageDropPath(packSlug, pageFileName) {
  return `/templates/packs/${packSlug}/pages/${pageFileName}`;
}

export default TEMPLATE_PACKS;
