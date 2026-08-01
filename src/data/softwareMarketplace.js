/** Software & Code marketplace — live products + demo catalogue. */

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
];

/** Live downloadable products (real HTML apps under /downloads/software/). */
export const LIVE_SOFTWARE_PRODUCTS = [
  {
    id: 'live-invoice-studio',
    title: 'WWA Invoice Studio',
    category: 'tools',
    price: 29,
    sales: 0,
    rating: 5.0,
    author: 'Worldwide Adverts',
    tag: 'Live · Download',
    isLive: true,
    downloadUrl: '/downloads/software/wwa-invoice-studio.html',
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    description:
      'Standalone invoice generator — line items, tax, discounts, balance due, print/PDF. Works offline in any browser.',
  },
  {
    id: 'live-ad-budget-calc',
    title: 'Ad Campaign Budget Calculator',
    category: 'tools',
    price: 19,
    sales: 0,
    rating: 5.0,
    author: 'Worldwide Adverts',
    tag: 'Live · Download',
    isLive: true,
    downloadUrl: '/downloads/software/wwa-ad-budget-calculator.html',
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
    sales: 0,
    rating: 4.9,
    author: 'Worldwide Adverts',
    tag: 'Live · Download',
    isLive: true,
    downloadUrl: '/downloads/software/wwa-listing-checklist.html',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    description:
      'Interactive checklist for buy/sell, property and service listings — progress tracking and print-ready reports.',
  },
];

/** Demo catalogue (Clive: keep examples for now). */
export const DEMO_SOFTWARE_ITEMS = [
  {
    id: 1,
    title: 'Marketplace Starter Kit — Laravel',
    category: 'php-scripts',
    price: 59,
    sales: 1240,
    rating: 4.8,
    author: 'DevForge Studio',
    tag: 'Best seller',
    image:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
    description: 'Full classifieds + payments scaffold for multi-vendor marketplaces.',
  },
  {
    id: 2,
    title: 'Agency Portfolio WordPress Theme',
    category: 'wordpress',
    price: 39,
    sales: 890,
    rating: 4.7,
    author: 'PixelNorth',
    tag: 'Featured',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    description: 'Modern Gutenberg-ready theme for agencies and freelancers.',
  },
  {
    id: 3,
    title: 'Stripe Checkout WooCommerce Plugin',
    category: 'plugins',
    price: 29,
    sales: 2103,
    rating: 4.9,
    author: 'PayStack Labs',
    tag: 'Hot',
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    description: 'One-click Stripe Express Checkout for WooCommerce stores.',
  },
  {
    id: 4,
    title: 'SaaS Landing Page HTML Pack',
    category: 'html-templates',
    price: 24,
    sales: 1560,
    rating: 4.6,
    author: 'LaunchFrame',
    tag: null,
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    description: 'Responsive HTML5 landing pages with Tailwind-ready sections.',
  },
  {
    id: 5,
    title: 'React Native Food Delivery App',
    category: 'mobile-apps',
    price: 79,
    sales: 640,
    rating: 4.5,
    author: 'AppCraft',
    tag: 'New',
    image:
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80',
    description: 'iOS & Android starter with maps, carts, and order tracking.',
  },
  {
    id: 6,
    title: 'Chart & Dashboard JS Components',
    category: 'javascript',
    price: 34,
    sales: 980,
    rating: 4.7,
    author: 'DataViz Co',
    tag: null,
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    description: 'Reusable chart widgets for admin dashboards and analytics.',
  },
  {
    id: 7,
    title: 'AI Content Generator — Django',
    category: 'python',
    price: 69,
    sales: 410,
    rating: 4.4,
    author: 'NeuralNest',
    tag: 'Promoted',
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    description: 'Django + OpenAI pipeline for blogs, ads, and product copy.',
  },
  {
    id: 8,
    title: 'Fintech UI Kit — Figma + React',
    category: 'ui-kits',
    price: 49,
    sales: 720,
    rating: 4.8,
    author: 'Studio Ledger',
    tag: 'Featured',
    image:
      'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80',
    description: '120+ fintech screens with React components and tokens.',
  },
  {
    id: 9,
    title: 'Multi-Tenant SaaS Boilerplate',
    category: 'saas',
    price: 99,
    sales: 305,
    rating: 4.9,
    author: 'CloudForge',
    tag: 'Best seller',
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    description: 'Auth, billing, teams, and admin for B2B SaaS products.',
  },
  {
    id: 10,
    title: 'Icon Pack — Marketplace 800+',
    category: 'graphics',
    price: 19,
    sales: 3400,
    rating: 4.6,
    author: 'GlyphWorks',
    tag: null,
    image:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
    description: 'SVG icons for e-commerce, ads, and software dashboards.',
  },
];

export const ALL_SOFTWARE_ITEMS = [...LIVE_SOFTWARE_PRODUCTS, ...DEMO_SOFTWARE_ITEMS];
