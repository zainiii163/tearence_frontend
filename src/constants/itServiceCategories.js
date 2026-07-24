/**
 * IT & tech service categories — Fiverr-style grid (Clive: category format like Buy & Sell / Business).
 */
export const IT_SERVICE_CATEGORY_DEFS = [
  {
    slug: 'web-development',
    name: 'Web Development',
    emoji: '🌐',
    keywords: ['web', 'website', 'wordpress', 'frontend', 'backend', 'html', 'css', 'developer'],
  },
  {
    slug: 'app-software',
    name: 'App & Software',
    emoji: '📱',
    keywords: ['app', 'mobile', 'ios', 'android', 'software', 'saas'],
  },
  {
    slug: 'graphic-design',
    name: 'Graphic Design',
    emoji: '🎨',
    keywords: ['graphic', 'design', 'branding', 'ui', 'ux', 'illustration'],
  },
  {
    slug: 'logo-design',
    name: 'Logo Design',
    emoji: '✨',
    keywords: ['logo', 'brand mark', 'identity', 'icon'],
  },
  {
    slug: 'ai-services',
    name: 'AI Services',
    emoji: '🤖',
    keywords: ['ai', 'artificial intelligence', 'machine learning', 'chatbot', 'automation'],
  },
  {
    slug: 'seo',
    name: 'SEO',
    emoji: '🔍',
    keywords: ['seo', 'search engine', 'google ranking', 'keywords', 'backlinks'],
  },
  {
    slug: 'digital-marketing',
    name: 'Digital Marketing',
    emoji: '📈',
    keywords: ['marketing', 'digital marketing', 'online marketing', 'growth', 'leads'],
  },
  {
    slug: 'social-media-marketing',
    name: 'Social Media Marketing',
    emoji: '📱',
    keywords: ['social media', 'instagram', 'facebook', 'tiktok', 'linkedin'],
  },
  {
    slug: 'advertising',
    name: 'Digital Advertising',
    emoji: '📣',
    keywords: ['advertising', 'ads', 'ppc', 'google ads', 'facebook ads', 'online advertising'],
  },
  {
    slug: 'writing-content',
    name: 'Writing & Content',
    emoji: '✍️',
    keywords: ['writing', 'copy', 'content', 'blog', 'translation'],
  },
  {
    slug: 'video-animation',
    name: 'Video & Animation',
    emoji: '🎬',
    keywords: ['video', 'animation', 'motion graphics', 'editing', 'youtube'],
  },
  {
    slug: 'business-support',
    name: 'Business Support',
    emoji: '💼',
    keywords: ['business', 'b2b', 'admin', 'virtual assistant', 'operations'],
  },
  {
    slug: 'it-consultancy',
    name: 'IT Consultancy',
    emoji: '🧭',
    keywords: ['consult', 'consultancy', 'advisor', 'strategy', 'it support'],
  },
];

export const IT_SERVICE_CATEGORY_FALLBACK = IT_SERVICE_CATEGORY_DEFS.map((c, index) => ({
  id: index + 1,
  name: c.name,
  slug: c.slug,
  label: c.name,
  icon: c.emoji,
  sort_order: index + 1,
  is_active: true,
}));

export default IT_SERVICE_CATEGORY_DEFS;
