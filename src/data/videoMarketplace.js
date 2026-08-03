/**
 * Short video adverts + purchasable template videos (Clive).
 * Preview is free; download/use requires purchase (local demo checkout).
 */

export const VIDEO_TEMPLATE_CATEGORIES = [
  { id: 'adverts', name: 'Short Video Adverts' },
  { id: 'promo', name: 'Promo & Marketing' },
  { id: 'product', name: 'Product Showcase' },
  { id: 'social', name: 'Social Media Reels' },
  { id: 'templates', name: 'Editable Templates' },
];

/** @typedef {{ id: string, title: string, category: string, price: number, rating: number, author: string, tag?: string, videoUrl: string, poster: string, description: string, duration?: string }} VideoTemplateItem */

export const VIDEO_TEMPLATE_PRODUCTS = [
  {
    id: 'vt-promo-01',
    title: 'Marketplace Promo Reel',
    category: 'promo',
    price: 19,
    rating: 4.9,
    author: 'Worldwide Adverts',
    tag: 'Template',
    duration: '0:15',
    videoUrl: '/video/Video-Ads-1.mp4',
    poster: 'https://images.unsplash.com/photo-1611162616471-46b023ce0f1d?auto=format&fit=crop&w=800&q=80',
    description: 'Short vertical-style promo clip for marketplace launches. Preview free; purchase to download.',
  },
  {
    id: 'vt-product-02',
    title: 'Product Spotlight Clip',
    category: 'product',
    price: 15,
    rating: 4.8,
    author: 'Worldwide Adverts',
    tag: 'Template',
    duration: '0:12',
    videoUrl: '/video/Video-Ads-2.mp4',
    poster: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    description: 'Clean product showcase suitable for Buy & Sell and online stores.',
  },
  {
    id: 'vt-social-03',
    title: 'Social Media Hook Reel',
    category: 'social',
    price: 12,
    rating: 4.7,
    author: 'Worldwide Adverts',
    tag: 'Template',
    duration: '0:10',
    videoUrl: '/video/Video-Ads-3.mp4',
    poster: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fef0?auto=format&fit=crop&w=800&q=80',
    description: 'Attention-grabbing opener for Instagram / TikTok-style posts.',
  },
  {
    id: 'vt-advert-04',
    title: 'Sponsored Listing Teaser',
    category: 'adverts',
    price: 25,
    rating: 5.0,
    author: 'Worldwide Adverts',
    tag: 'Advert',
    duration: '0:20',
    videoUrl: '/video/Video-Ads-4.mp4',
    poster: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    description: 'Short advert-style video ready to attach to featured or sponsored listings.',
  },
  {
    id: 'vt-promo-05',
    title: 'Business Pitch Teaser',
    category: 'promo',
    price: 29,
    rating: 4.9,
    author: 'Worldwide Adverts',
    tag: 'Template',
    duration: '0:18',
    videoUrl: '/video/Video-Ads-5.mp4',
    poster: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80',
    description: 'Pitch-style teaser for funding campaigns and business listings.',
  },
  {
    id: 'vt-template-06',
    title: 'Events Promo Loop',
    category: 'templates',
    price: 18,
    rating: 4.6,
    author: 'Worldwide Adverts',
    tag: 'Template',
    duration: '0:14',
    videoUrl: '/video/Video-Ads-6.mp4',
    poster: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    description: 'Loopable events promo for venues, festivals, and ticketed ads.',
  },
  {
    id: 'vt-social-07',
    title: 'Jobs Hiring Reel',
    category: 'social',
    price: 14,
    rating: 4.5,
    author: 'Worldwide Adverts',
    tag: 'Template',
    duration: '0:11',
    videoUrl: '/video/Video-Ads-7.mp4',
    poster: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80',
    description: 'Hiring announcement reel for job vacancies and employer branding.',
  },
  {
    id: 'vt-advert-08',
    title: 'Property Walkthrough Teaser',
    category: 'adverts',
    price: 35,
    rating: 4.8,
    author: 'Worldwide Adverts',
    tag: 'Advert',
    duration: '0:22',
    videoUrl: '/video/Video-Ads-8.mp4',
    poster: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    description: 'Short property teaser style for listings and agent promotions.',
  },
];

const PURCHASE_KEY = 'wwa_video_template_purchases_v1';

export function getPurchasedVideoIds() {
  try {
    const raw = localStorage.getItem(PURCHASE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function markVideoPurchased(id) {
  const ids = new Set(getPurchasedVideoIds());
  ids.add(id);
  localStorage.setItem(PURCHASE_KEY, JSON.stringify([...ids]));
}

export function isVideoPurchased(id) {
  return getPurchasedVideoIds().includes(id);
}

export default VIDEO_TEMPLATE_PRODUCTS;
