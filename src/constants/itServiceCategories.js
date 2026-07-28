/**
 * Services & Solutions categories (Clive):
 * Main tiles like Buy & Sell — Logo Design, WordPress, Book Writing, Graphic Design, etc.
 * Book Writing holds editing / proofreading / related book services.
 */

export const SERVICE_MAIN_CATEGORIES = [
  {
    slug: 'logo-design',
    name: 'Logo Design',
    emoji: '✨',
    keywords: ['logo', 'brand mark', 'identity', 'icon'],
    children: [
      { slug: 'logo-brand-identity', name: 'Brand Identity', emoji: '🏷️', keywords: ['brand identity', 'logo pack'] },
      { slug: 'logo-icon-design', name: 'Icon Design', emoji: '◆', keywords: ['icon', 'app icon'] },
      { slug: 'logo-redesign', name: 'Logo Redesign', emoji: '♻️', keywords: ['redesign', 'rebrand logo'] },
    ],
  },
  {
    slug: 'wordpress',
    name: 'WordPress',
    emoji: '🔌',
    keywords: ['wordpress', 'wp', 'woocommerce'],
    children: [
      { slug: 'wordpress-themes', name: 'Themes', emoji: '🧩', keywords: ['wordpress theme', 'theme'] },
      { slug: 'wordpress-plugins', name: 'Plugins', emoji: '🔌', keywords: ['plugin', 'wordpress plugin'] },
      { slug: 'wordpress-customization', name: 'Customization', emoji: '⚙️', keywords: ['wordpress custom', 'customize'] },
    ],
  },
  {
    slug: 'book-writing',
    name: 'Book Writing',
    emoji: '📚',
    keywords: ['book', 'author', 'manuscript', 'publishing'],
    children: [
      { slug: 'book-editing', name: 'Editing', emoji: '📝', keywords: ['editing', 'editor', 'book edit'] },
      { slug: 'proofreading', name: 'Proofreading', emoji: '✅', keywords: ['proofreading', 'proofread'] },
      { slug: 'ghostwriting', name: 'Ghostwriting', emoji: '👻', keywords: ['ghostwriting', 'ghostwriter'] },
      { slug: 'book-formatting', name: 'Formatting', emoji: '📖', keywords: ['formatting', 'typesetting', 'layout'] },
      { slug: 'book-cover-design', name: 'Book Cover Design', emoji: '🎨', keywords: ['book cover', 'cover design'] },
    ],
  },
  {
    slug: 'graphic-design',
    name: 'Graphic Design',
    emoji: '🎨',
    keywords: ['graphic', 'design', 'branding', 'illustration'],
    children: [
      { slug: 'branding', name: 'Branding', emoji: '🏷️', keywords: ['branding', 'brand identity'] },
      { slug: 'illustration', name: 'Illustration', emoji: '🖌️', keywords: ['illustration', 'illustrator'] },
      { slug: 'ui-ux-design', name: 'UI/UX Design', emoji: '📐', keywords: ['ui', 'ux', 'interface'] },
      { slug: 'print-design', name: 'Print Design', emoji: '🖨️', keywords: ['print', 'flyer', 'brochure'] },
    ],
  },
  {
    slug: 'digital-marketing',
    name: 'Digital Marketing',
    emoji: '📈',
    keywords: ['marketing', 'digital marketing', 'growth', 'leads'],
    children: [
      { slug: 'seo', name: 'SEO', emoji: '🔍', keywords: ['seo', 'search engine', 'ranking'] },
      {
        slug: 'social-media-marketing',
        name: 'Social Media Marketing',
        emoji: '📱',
        keywords: ['social media', 'instagram', 'facebook', 'tiktok'],
      },
      { slug: 'email-marketing', name: 'Email Marketing', emoji: '✉️', keywords: ['email marketing', 'newsletter'] },
      { slug: 'content-marketing', name: 'Content Marketing', emoji: '📰', keywords: ['content marketing', 'blog'] },
    ],
  },
  {
    slug: 'advertising',
    name: 'Advertising',
    emoji: '📣',
    keywords: ['advertising', 'ads', 'ppc', 'google ads', 'facebook ads'],
    children: [
      { slug: 'google-ads', name: 'Google Ads', emoji: '🔎', keywords: ['google ads', 'adwords'] },
      { slug: 'social-ads', name: 'Social Ads', emoji: '📣', keywords: ['facebook ads', 'instagram ads', 'social ads'] },
      { slug: 'ppc', name: 'PPC Campaigns', emoji: '💰', keywords: ['ppc', 'paid search', 'cpc'] },
    ],
  },
  {
    slug: 'web-development',
    name: 'Web Development',
    emoji: '🌐',
    keywords: ['web', 'website', 'frontend', 'backend', 'html', 'css', 'developer'],
    children: [],
  },
  {
    slug: 'app-software',
    name: 'App & Software',
    emoji: '📱',
    keywords: ['app', 'mobile', 'ios', 'android', 'software', 'saas'],
    children: [],
  },
  {
    slug: 'video-animation',
    name: 'Video & Animation',
    emoji: '🎬',
    keywords: ['video', 'animation', 'motion graphics', 'editing', 'youtube'],
    children: [],
  },
  {
    slug: 'ai-services',
    name: 'AI Services',
    emoji: '🤖',
    keywords: ['ai', 'artificial intelligence', 'machine learning', 'chatbot', 'automation'],
    children: [],
  },
  {
    slug: 'business-support',
    name: 'Business Support',
    emoji: '💼',
    keywords: ['business', 'b2b', 'admin', 'virtual assistant', 'operations'],
    children: [],
  },
  {
    slug: 'it-consultancy',
    name: 'IT Consultancy',
    emoji: '🧭',
    keywords: ['consult', 'consultancy', 'advisor', 'strategy', 'it support'],
    children: [],
  },
];

/** Flat defs for forms / API fallback (parents + children). */
export const IT_SERVICE_CATEGORY_DEFS = SERVICE_MAIN_CATEGORIES.flatMap((main) => {
  const parent = {
    slug: main.slug,
    name: main.name,
    emoji: main.emoji,
    keywords: main.keywords || [],
    parentSlug: null,
  };
  const kids = (main.children || []).map((c) => ({
    slug: c.slug,
    name: c.name,
    emoji: c.emoji || main.emoji,
    keywords: c.keywords || [],
    parentSlug: main.slug,
  }));
  return [parent, ...kids];
});

export const IT_SERVICE_CATEGORY_FALLBACK = IT_SERVICE_CATEGORY_DEFS.map((c, index) => ({
  id: index + 1,
  name: c.name,
  slug: c.slug,
  label: c.name,
  icon: c.emoji,
  sort_order: index + 1,
  is_active: true,
  parent_slug: c.parentSlug || null,
}));

export const findMainCategory = (slug) =>
  SERVICE_MAIN_CATEGORIES.find((c) => c.slug === slug) || null;

export const findCategoryDef = (slug) =>
  IT_SERVICE_CATEGORY_DEFS.find((c) => c.slug === slug) || null;

export const getChildSlugs = (mainSlug) => {
  const main = findMainCategory(mainSlug);
  if (!main) return [];
  return (main.children || []).map((c) => c.slug);
};

export default IT_SERVICE_CATEGORY_DEFS;
