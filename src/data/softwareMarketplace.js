/**
 * Software & Code marketplace catalogue.
 * Downloads are gated by purchase (see SoftwarePurchaseModal).
 */

export const SOFTWARE_CATEGORIES = [
  { id: 'php-scripts', name: 'PHP Scripts', slug: 'php-scripts' },
  { id: 'wordpress', name: 'WordPress', slug: 'wordpress' },
  { id: 'plugins', name: 'Plugins & Extensions', slug: 'plugins' },
  { id: 'html-templates', name: 'HTML Templates', slug: 'html-templates' },
  { id: 'mobile-apps', name: 'Mobile Apps', slug: 'mobile-apps' },
  { id: 'javascript', name: 'JavaScript', slug: 'javascript' },
  { id: 'python', name: 'Python', slug: 'python' },
  { id: 'ui-kits', name: 'UI Kits & Themes', slug: 'ui-kits' },
  { id: 'saas', name: 'SaaS / Web Apps', slug: 'saas' },
  { id: 'graphics', name: 'Graphics & Assets', slug: 'graphics' },
  { id: 'tools', name: 'Business Tools', slug: 'tools' },
  { id: 'analytics', name: 'Analytics & SEO', slug: 'analytics' },
];

export const SOFTWARE_FRAMEWORKS = [
  'PHP',
  'WordPress',
  'Laravel',
  'React',
  'Vue',
  'Django',
  'Node.js',
  'HTML/CSS',
  'React Native',
  'Vanilla JS',
];

export const SOFTWARE_LANGUAGES = [
  'PHP',
  'JavaScript',
  'TypeScript',
  'Python',
  'HTML',
  'CSS',
  'SQL',
  'Dart',
];

/** @typedef {{ id: string, title: string, category: string, price: number, sales: number, rating: number, author: string, tag?: string|null, isLive?: boolean, downloadUrl?: string, previewUrl?: string, framework?: string, language?: string, image: string, description: string }} SoftwareItem */

/** Live products — realistic samples under /downloads/software/ */
export const LIVE_SOFTWARE_PRODUCTS = [
  {
    id: 'live-invoice-studio',
    title: 'WWA Invoice Studio',
    category: 'tools',
    price: 25,
    sales: 186,
    rating: 5.0,
    author: 'Worldwide Adverts',
    tag: 'Live',
    isLive: true,
    framework: 'HTML/CSS',
    language: 'JavaScript',
    downloadUrl: '/downloads/software/wwa-invoice-studio.html',
    previewUrl: '/downloads/software/wwa-invoice-studio.html',
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    description:
      'Standalone invoice generator — line items, tax, discounts, balance due, print/PDF. Works offline in any browser.',
  },
  {
    id: 'live-ad-budget-calc',
    title: 'Ad Campaign Budget Calculator',
    category: 'tools',
    price: 12,
    sales: 142,
    rating: 5.0,
    author: 'Worldwide Adverts',
    tag: 'Live',
    isLive: true,
    framework: 'HTML/CSS',
    language: 'JavaScript',
    downloadUrl: '/downloads/software/wwa-ad-budget-calculator.html',
    previewUrl: '/downloads/software/wwa-ad-budget-calculator.html',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    description:
      'Plan CPC, impressions, CTR and monthly ad spend. Save scenarios locally — ideal for advertisers and agencies.',
  },
  {
    id: 'live-listing-checklist',
    title: 'Marketplace Listing Checklist Pro',
    category: 'tools',
    price: 15,
    sales: 98,
    rating: 4.9,
    author: 'Worldwide Adverts',
    tag: 'Live',
    isLive: true,
    framework: 'HTML/CSS',
    language: 'JavaScript',
    downloadUrl: '/downloads/software/wwa-listing-checklist.html',
    previewUrl: '/downloads/software/wwa-listing-checklist.html',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    description:
      'Interactive checklist for buy/sell, property and service listings — progress tracking and print-ready reports.',
  },
  {
    id: 'live-php-contact-form',
    title: 'Secure PHP Contact Form Kit',
    category: 'php-scripts',
    price: 18,
    sales: 420,
    rating: 4.8,
    author: 'Worldwide Adverts',
    tag: 'Live',
    isLive: true,
    framework: 'PHP',
    language: 'PHP',
    downloadUrl: '/downloads/software/wwa-php-contact-form.php',
    previewUrl: '/downloads/software/previews/php-contact-form.html',
    image:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
    description:
      'Production-ready PHP mailer with CSRF token, honeypot spam trap, and HTML email template.',
  },
  {
    id: 'live-wp-notice-plugin',
    title: 'WordPress Site Notice Plugin',
    category: 'wordpress',
    price: 22,
    sales: 310,
    rating: 4.7,
    author: 'Worldwide Adverts',
    tag: 'Live',
    isLive: true,
    framework: 'WordPress',
    language: 'PHP',
    downloadUrl: '/downloads/software/wwa-wp-site-notice.php',
    previewUrl: '/downloads/software/previews/wp-site-notice.html',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    description:
      'Drop-in WP plugin stub: dismissible admin/front banner, settings page, and shortcode.',
  },
  {
    id: 'live-saas-landing',
    title: 'SaaS Landing Page HTML Pack',
    category: 'html-templates',
    price: 24,
    sales: 560,
    rating: 4.6,
    author: 'Worldwide Adverts',
    tag: 'Live',
    isLive: true,
    framework: 'HTML/CSS',
    language: 'HTML',
    downloadUrl: '/downloads/software/wwa-saas-landing.html',
    previewUrl: '/downloads/software/wwa-saas-landing.html',
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    description:
      'Responsive single-file SaaS landing: hero, features, pricing, FAQ, and CTA — no build step.',
  },
  {
    id: 'live-js-dashboard-charts',
    title: 'Chart & Dashboard JS Pack',
    category: 'javascript',
    price: 28,
    sales: 275,
    rating: 4.7,
    author: 'Worldwide Adverts',
    tag: 'Live',
    isLive: true,
    framework: 'Vanilla JS',
    language: 'JavaScript',
    downloadUrl: '/downloads/software/wwa-dashboard-charts.html',
    previewUrl: '/downloads/software/wwa-dashboard-charts.html',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    description:
      'Lightweight canvas charts (bar, line, doughnut) with sample KPI cards — zero dependencies.',
  },
  {
    id: 'live-python-csv-cleaner',
    title: 'Python CSV Cleaner CLI',
    category: 'python',
    price: 16,
    sales: 190,
    rating: 4.5,
    author: 'Worldwide Adverts',
    tag: 'Live',
    isLive: true,
    framework: 'Django',
    language: 'Python',
    downloadUrl: '/downloads/software/wwa-csv-cleaner.py',
    previewUrl: '/downloads/software/previews/python-csv-cleaner.html',
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    description:
      'Python 3 script to trim, dedupe, and normalize CSV columns — ready for marketplace data imports.',
  },
  {
    id: 'live-seo-meta-auditor',
    title: 'SEO Meta Auditor (JS)',
    category: 'analytics',
    price: 21,
    sales: 155,
    rating: 4.6,
    author: 'Worldwide Adverts',
    tag: 'Live',
    isLive: true,
    framework: 'Vanilla JS',
    language: 'JavaScript',
    downloadUrl: '/downloads/software/wwa-seo-meta-auditor.html',
    previewUrl: '/downloads/software/wwa-seo-meta-auditor.html',
    image:
      'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80',
    description:
      'Paste HTML or a URL snippet to score title, meta description, H1s, and Open Graph tags.',
  },
  {
    id: 'live-paid-password-gen',
    title: 'Secure Password Generator',
    category: 'tools',
    price: 12,
    sales: 2100,
    rating: 4.9,
    author: 'Worldwide Adverts',
    tag: 'Paid',
    isLive: true,
    framework: 'Vanilla JS',
    language: 'JavaScript',
    downloadUrl: '/downloads/software/wwa-password-generator.html',
    image:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80',
    description:
      'Offline password generator — length, symbols, pronounceable mode. Licensed download.',
  },
  {
    id: 'live-paid-qr-maker',
    title: 'QR Code Maker',
    category: 'tools',
    price: 12,
    sales: 1850,
    rating: 4.8,
    author: 'Worldwide Adverts',
    tag: 'Paid',
    isLive: true,
    framework: 'Vanilla JS',
    language: 'JavaScript',
    downloadUrl: '/downloads/software/wwa-qr-maker.html',
    image:
      'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=800&q=80',
    description:
      'QR generator for URLs, Wi‑Fi and plain text. Print-ready PNG export — licensed download.',
  },
  {
    id: 'live-commission-calc',
    title: 'Sales Commission Calculator Pro',
    category: 'tools',
    price: 14,
    sales: 420,
    rating: 4.8,
    author: 'Worldwide Adverts',
    tag: 'Live',
    isLive: true,
    framework: 'HTML/CSS',
    language: 'JavaScript',
    downloadUrl: '/downloads/software/wwa-commission-calculator.html',
    image:
      'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80',
    description:
      'Tiered commission, bonuses and team splits — save scenarios for sales managers and affiliates.',
  },
  {
    id: 'live-color-palette',
    title: 'Brand Color Palette Studio',
    category: 'graphics',
    price: 11,
    sales: 680,
    rating: 4.7,
    author: 'Worldwide Adverts',
    tag: 'Live',
    isLive: true,
    framework: 'Vanilla JS',
    language: 'JavaScript',
    downloadUrl: '/downloads/software/wwa-color-palette.html',
    image:
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
    description:
      'Generate accessible brand palettes, contrast checks and CSS/JSON export for designers.',
  },
  {
    id: 'live-utm-builder',
    title: 'UTM Campaign Link Builder',
    category: 'analytics',
    price: 9,
    sales: 910,
    rating: 4.8,
    author: 'Worldwide Adverts',
    tag: 'Live',
    isLive: true,
    framework: 'Vanilla JS',
    language: 'JavaScript',
    downloadUrl: '/downloads/software/wwa-utm-builder.html',
    image:
      'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80',
    description:
      'Build tracked campaign URLs with presets for Google Ads, Meta and email — copy or CSV export.',
  },
  {
    id: 'live-json-formatter',
    title: 'JSON Formatter & Validator',
    category: 'javascript',
    price: 12,
    sales: 3200,
    rating: 4.9,
    author: 'Worldwide Adverts',
    tag: 'Paid',
    isLive: true,
    framework: 'Vanilla JS',
    language: 'JavaScript',
    downloadUrl: '/downloads/software/wwa-json-formatter.html',
    image:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
    description:
      'Offline JSON pretty-print, minify and validate tool for API debugging — licensed download.',
  },
];

/** Catalogue examples (also purchasable when downloadUrl present). */
export const DEMO_SOFTWARE_ITEMS = [
  {
    id: 'demo-laravel-kit',
    title: 'Marketplace Starter Kit — Laravel',
    category: 'php-scripts',
    price: 59,
    sales: 1240,
    rating: 4.8,
    author: 'DevForge Studio',
    tag: 'Best seller',
    isLive: true,
    framework: 'Laravel',
    language: 'PHP',
    downloadUrl: '/downloads/software/samples/laravel-marketplace-readme.txt',
    previewUrl: '/downloads/software/previews/laravel-marketplace.html',
    image:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
    description: 'Full classifieds + payments scaffold outline for multi-vendor marketplaces.',
  },
  {
    id: 'demo-wp-agency',
    title: 'Agency Portfolio WordPress Theme',
    category: 'wordpress',
    price: 39,
    sales: 890,
    rating: 4.7,
    author: 'PixelNorth',
    tag: 'Featured',
    isLive: true,
    framework: 'WordPress',
    language: 'PHP',
    downloadUrl: '/downloads/software/wwa-wp-site-notice.php',
    previewUrl: '/downloads/software/previews/wp-site-notice.html',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    description: 'Modern Gutenberg-ready theme starter notes for agencies and freelancers.',
  },
  {
    id: 'demo-stripe-woo',
    title: 'Stripe Checkout WooCommerce Plugin',
    category: 'plugins',
    price: 29,
    sales: 2103,
    rating: 4.9,
    author: 'PayStack Labs',
    tag: 'Hot',
    isLive: true,
    framework: 'WordPress',
    language: 'PHP',
    downloadUrl: '/downloads/software/samples/woocommerce-stripe-notes.txt',
    previewUrl: '/downloads/software/previews/woo-stripe.html',
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    description: 'One-click Stripe Express Checkout integration guide for WooCommerce stores.',
  },
  {
    id: 'demo-rn-food',
    title: 'React Native Food Delivery App',
    category: 'mobile-apps',
    price: 79,
    sales: 640,
    rating: 4.5,
    author: 'AppCraft',
    tag: 'New',
    isLive: true,
    framework: 'React Native',
    language: 'TypeScript',
    downloadUrl: '/downloads/software/samples/react-native-food-app.txt',
    previewUrl: '/downloads/software/previews/rn-food-app.html',
    image:
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80',
    description: 'iOS & Android starter outline with maps, carts, and order tracking screens.',
  },
  {
    id: 'demo-fintech-ui',
    title: 'Fintech UI Kit — Figma + React',
    category: 'ui-kits',
    price: 49,
    sales: 720,
    rating: 4.8,
    author: 'Studio Ledger',
    tag: 'Featured',
    isLive: true,
    framework: 'React',
    language: 'TypeScript',
    downloadUrl: '/downloads/software/samples/fintech-ui-kit.txt',
    previewUrl: '/downloads/software/previews/fintech-ui.html',
    image:
      'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80',
    description: '120+ fintech screen specs with React component inventory and design tokens.',
  },
  {
    id: 'demo-saas-boilerplate',
    title: 'Multi-Tenant SaaS Boilerplate',
    category: 'saas',
    price: 99,
    sales: 305,
    rating: 4.9,
    author: 'CloudForge',
    tag: 'Best seller',
    isLive: true,
    framework: 'Node.js',
    language: 'TypeScript',
    downloadUrl: '/downloads/software/samples/saas-boilerplate.txt',
    previewUrl: '/downloads/software/previews/saas-boilerplate.html',
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    description: 'Auth, billing, teams, and admin architecture pack for B2B SaaS products.',
  },
  {
    id: 'demo-icon-pack',
    title: 'Icon Pack — Marketplace 800+',
    category: 'graphics',
    price: 19,
    sales: 3400,
    rating: 4.6,
    author: 'GlyphWorks',
    tag: null,
    isLive: true,
    framework: 'HTML/CSS',
    language: 'HTML',
    downloadUrl: '/downloads/software/samples/marketplace-icons.svg',
    previewUrl: '/downloads/software/samples/marketplace-icons.svg',
    image:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
    description: 'Starter SVG icon set for e-commerce, ads, and software dashboards.',
  },
];

export const ALL_SOFTWARE_ITEMS = [...LIVE_SOFTWARE_PRODUCTS, ...DEMO_SOFTWARE_ITEMS];

const PURCHASE_KEY = 'wwa_software_purchases_v1';

export const getSoftwarePurchases = () => {
  try {
    const raw = localStorage.getItem(PURCHASE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const hasPurchasedSoftware = (productId) => {
  const map = getSoftwarePurchases();
  return Boolean(map[productId]?.paidAt);
};

export const markSoftwarePurchased = (productId, meta = {}) => {
  const map = getSoftwarePurchases();
  map[productId] = {
    paidAt: new Date().toISOString(),
    ...meta,
  };
  localStorage.setItem(PURCHASE_KEY, JSON.stringify(map));
  return map[productId];
};

export const triggerSoftwareFileDownload = (item) => {
  if (!item?.downloadUrl) return;
  const a = document.createElement('a');
  a.href = item.downloadUrl;
  a.download = item.downloadUrl.split('/').pop() || 'download';
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
};
