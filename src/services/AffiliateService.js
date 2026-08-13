import api from "../api";
import axios from "axios";
import { extractListItems } from "../utils/apiResponseHelpers";
import {
  cacheBusinessOffers,
  getCachedBusinessOffer,
  unwrapBusinessOffersResponse,
} from "../utils/affiliateOfferCache";

// Add cache-busting timestamp
const cacheBuster = () => `?_t=${Date.now()}`;

// Get API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.worldwideadverts.info/api/v1';

const errStatus = (error) =>
  error?.status || error?.response?.status || error?.response?.data?.status;

const affiliateService = {
  // 🏷️ Categories
  getCategories: async () => {
    try {
      const response = await api.get('/affiliates/categories' + cacheBuster());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 💼 Business Offers
  getBusinessOffers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      // Add cache buster
      params.append('_t', Date.now());
      
      const response = await api.get(`/affiliates/business-offers?${params}`);
      const body = response.data;
      unwrapBusinessOffersResponse(body);
      return body;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Load one business offer from the live show endpoint.
   * Falls back to marketplace index if show is temporarily unavailable.
   */
  getBusinessOffer: async (id) => {
    const offerId = String(id || '').replace(/^business-/, '');
    if (!offerId) {
      throw { message: 'Invalid offer id', status: 400 };
    }

    const cached = getCachedBusinessOffer(offerId);
    if (cached) {
      // Soft hydrate from cache, then refresh from API below
    }

    try {
      const response = await api.get(`/affiliates/business-offers/${offerId}`);
      const body = response.data;
      const data = body?.data || body;
      if (data?.id) cacheBusinessOffers([data]);
      return body;
    } catch (error) {
      const status = errStatus(error);
      if (cached && (status === 500 || status === 502 || status === 503)) {
        return { success: true, data: cached, _source: 'cache' };
      }

      // Index fallback while show is recovering
      if (status === 500 || status === 404 || status === 502) {
        let page = 1;
        let lastPage = 1;
        do {
          const body = await affiliateService.getBusinessOffers({
            per_page: 100,
            page,
          });
          const payload = body?.data || body;
          const rows = extractListItems(body);
          const match = rows.find((o) => String(o.id) === offerId);
          if (match) {
            cacheBusinessOffers([match]);
            return { success: true, data: match, _source: 'index' };
          }
          lastPage = Number(payload?.last_page || payload?.meta?.last_page || 1);
          page += 1;
        } while (page <= lastPage && page <= 20);
      }

      throw {
        message: error?.message || 'Offer not found',
        status: status || 404,
      };
    }
  },

  createBusinessOffer: async (formData) => {
    try {
      const payload = {
        ...formData,
        status: formData.status || 'approved',
        is_active: formData.is_active !== undefined ? formData.is_active : true,
      };
      const response = await api.post('/affiliates/business-offers', payload);
      const created = response.data?.data || response.data;
      if (created?.id) cacheBusinessOffers([created]);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateBusinessOffer: async (id, formData) => {
    try {
      const response = await api.put(`/affiliates/business-offers/${id}`, formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteBusinessOffer: async (id) => {
    try {
      const response = await api.delete(`/affiliates/business-offers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 👤 User Affiliate Posts
  getUserPosts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      params.append('_t', Date.now());
      const response = await api.get(`/affiliates/user-posts?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Paid / Filament affiliate link ads (affiliate_links)
  getAffiliateLinks: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      params.append('_t', Date.now());
      const response = await api.get(`/affiliates/links?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getUserPost: async (id) => {
    try {
      const response = await api.get(`/affiliates/user-posts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createUserPost: async (formData) => {
    try {
      // Auto-approve for now so affiliate links show publicly without moderation delay
      const payload = {
        ...formData,
        status: 'approved',
        is_active: true,
        payment_status: formData.payment_status || 'paid',
      };
      const response = await api.post('/affiliates/user-posts', payload);
      const created = response.data?.data || response.data;

      // If backend still returns pending, force-approve via update
      if (created?.id && created.status !== 'approved') {
        try {
          await api.put(`/affiliates/user-posts/${created.id}`, {
            ...payload,
            status: 'approved',
            is_active: true,
          });
        } catch (approveErr) {
          console.warn('Could not auto-approve user post:', approveErr);
        }
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateUserPost: async (id, formData) => {
    try {
      const response = await api.put(`/affiliates/user-posts/${id}`, formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteUserPost: async (id) => {
    try {
      const response = await api.delete(`/affiliates/user-posts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📝 Applications
  applyToPromote: async (offerId, formData = {}) => {
    try {
      const payload =
        formData && typeof formData === 'object' && !(formData instanceof FormData)
          ? formData
          : {};
      const response = await api.post(
        `/affiliates/business-offers/${offerId}/apply`,
        payload
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getMyApplications: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/affiliates/my-applications?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 👤 User Dashboard
  getMyBusinessOffers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/affiliates/my-business-offers?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getMyUserPosts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/affiliates/my-user-posts?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📊 Tracking & Analytics
  trackClick: async (type, id) => {
    try {
      const response = await api.post('/affiliates/track-click', { type, id });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAnalytics: async (type, id) => {
    try {
      const response = await api.get(`/affiliates/analytics/${type}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🔍 Search
  search: async (query, type = 'all') => {
    try {
      const response = await api.get(`/affiliates/search?q=${encodeURIComponent(query)}&type=${type}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /** Alias used by affiliates hub */
  searchAffiliateContent: async (query, type = 'all') => {
    return affiliateService.search(query, type);
  },

  getOfferApplications: async (offerId, filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/affiliates/business-offers/${offerId}/applications?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  approveApplication: async (applicationId, notes = '') => {
    try {
      const response = await api.post(`/affiliates/applications/${applicationId}/approve`, { notes });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  rejectApplication: async (applicationId, reason = '') => {
    try {
      const response = await api.post(`/affiliates/applications/${applicationId}/reject`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  recordConversion: async (payload) => {
    try {
      const response = await api.post('/affiliates/conversions', {
        tracking_code: payload.tracking_code || payload.trackingCode,
        amount: payload.amount,
        order_id: payload.order_id || payload.orderId || undefined,
        offer_id: payload.offer_id || payload.offerId || undefined,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  rotateOfferPostbackToken: async (offerId) => {
    try {
      const response = await api.post(
        `/affiliates/business-offers/${offerId}/rotate-postback-token`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Affiliate earnings from live APIs.
   * Prefer /my-earnings when present; otherwise aggregate /my-applications
   * (the supported authenticated promoter ledger on production).
   */
  getMyEarnings: async () => {
    try {
      const response = await api.get('/affiliates/my-earnings');
      if (response?.data) return response.data;
    } catch (error) {
      const status = errStatus(error);
      if (status && status !== 404) {
        // Auth errors should surface; only soft-miss on missing route
        if (status === 401 || status === 403) {
          throw error.response?.data || error;
        }
      }
    }

    const appsRes = await affiliateService.getMyApplications({ per_page: 100 });
    const applications = extractListItems(appsRes);
    const recent_conversions = applications.flatMap((a) => {
      const rows = a.recent_conversions || a.conversions || [];
      if (!Array.isArray(rows) || !rows.length) return [];
      return rows.map((row) => ({
        ...row,
        offer_title:
          row.offer_title ||
          a.business_affiliate_offer?.product_service_title ||
          a.businessAffiliateOffer?.product_service_title,
        tracking_code: row.tracking_code || a.tracking_code,
      }));
    });

    const clicks = applications.reduce(
      (s, a) => s + Number(a.clicks_count ?? a.clicks ?? 0),
      0
    );
    const conversions = applications.reduce(
      (s, a) => s + Number(a.conversions_count ?? a.conversions ?? 0),
      0
    );
    const earnings = applications.reduce(
      (s, a) =>
        s + Number(a.earnings_total ?? a.commission_earned ?? a.earnings ?? 0),
      0
    );
    const pending = applications.reduce(
      (s, a) => s + Number(a.pending_earnings ?? a.earnings_pending ?? 0),
      0
    );
    const paid = applications.reduce(
      (s, a) => s + Number(a.paid_earnings ?? a.earnings_paid ?? 0),
      0
    );

    return {
      success: true,
      data: {
        totals: {
          programs: applications.filter((a) =>
            ['approved', 'active'].includes(String(a.status || '').toLowerCase())
          ).length,
          clicks,
          conversions,
          earnings,
          pending,
          paid: paid || Math.max(0, earnings - pending),
          available: Math.max(0, earnings - pending - paid),
        },
        applications,
        recent_conversions,
        payouts: [],
        _source: 'my-applications',
      },
    };
  },

  /** Business: sales via promoter links + commissions you owe */
  getBusinessMoney: async () => {
    try {
      const response = await api.get('/affiliates/business-money');
      if (response?.data) return response.data;
    } catch (error) {
      const status = errStatus(error);
      if (status === 401 || status === 403) {
        throw error.response?.data || error;
      }
    }

    // Soft fallback from merchant offers when summary route is unavailable
    const offersRes = await affiliateService.getMyBusinessOffers({ per_page: 50 });
    const offers = extractListItems(offersRes);
    const byOffer = [];
    let salesCount = 0;
    let salesVolume = 0;
    let commissionsOwed = 0;
    const recent = [];

    for (const offer of offers) {
      let rows = [];
      try {
        const convRes = await affiliateService.getOfferConversions(offer.id, { per_page: 40 });
        rows = extractListItems(convRes);
      } catch {
        rows = [];
      }
      const volume = rows.reduce((s, r) => s + Number(r.sale_amount || r.amount || 0), 0);
      const owed = rows.reduce(
        (s, r) => s + Number(r.commission_amount || r.commission || 0),
        0
      );
      salesCount += rows.length;
      salesVolume += volume;
      commissionsOwed += owed;
      byOffer.push({
        offer_id: offer.id,
        title: offer.product_service_title || offer.business_name || 'Offer',
        commission_type: offer.commission_type || 'percentage',
        commission_rate: Number(offer.commission_rate || 0),
        status: offer.status,
        expires_at: offer.expires_at,
        sales_count: rows.length || Number(offer.conversions_count || offer.conversions || 0),
        sales_volume: volume,
        commissions_owed: owed,
        clicks: Number(offer.clicks || offer.clicks_count || 0),
        views: Number(offer.views || 0),
      });
      rows.forEach((r) =>
        recent.push({
          ...r,
          offer: { product_service_title: offer.product_service_title },
        })
      );
    }

    return {
      success: true,
      data: {
        role: 'business',
        who_pays: 'business',
        who_is_paid: 'promoter',
        explanation:
          'When a sale is attributed to a promoter hop link, you pay the commission % you set on that offer.',
        totals: {
          offers: offers.length,
          sales_count: salesCount,
          sales_volume: Math.round(salesVolume * 100) / 100,
          commissions_owed_to_promoters: Math.round(commissionsOwed * 100) / 100,
          your_net_after_commissions: Math.round(Math.max(0, salesVolume - commissionsOwed) * 100) / 100,
        },
        by_offer: byOffer,
        recent_sales: recent.slice(0, 40),
        _source: 'offers-fallback',
      },
    };
  },

  /** All advert formats + expiry for business/user dashboard */
  getMyAdvertsInventory: async () => {
    try {
      const response = await api.get('/affiliates/my-adverts-inventory');
      if (response?.data) return response.data;
    } catch (error) {
      const status = errStatus(error);
      if (status === 401 || status === 403) {
        throw error.response?.data || error;
      }
    }

    // Soft fallback: affiliate offers + link ads only (other formats need their tabs)
    const [offersRes, postsRes] = await Promise.all([
      affiliateService.getMyBusinessOffers({ per_page: 50 }).catch(() => ({ data: [] })),
      affiliateService.getMyUserPosts({ per_page: 50 }).catch(() => ({ data: [] })),
    ]);
    const offers = extractListItems(offersRes);
    const posts = extractListItems(postsRes);
    const now = Date.now();
    const dayMs = 86400000;

    const mapRow = (format, row, title) => {
      const expires = row.expires_at || row.promotion_end || null;
      const expMs = expires ? new Date(expires).getTime() : null;
      const days =
        expMs == null || Number.isNaN(expMs)
          ? null
          : Math.ceil((expMs - now) / dayMs);
      return {
        source_key: `${format}-${row.id}`,
        format,
        id: row.id,
        title: title || 'Advert',
        description: row.description || row.tagline || '',
        status_label: String(row.status || 'active').toLowerCase(),
        expires_at: expires,
        days_remaining: days,
        edit_path:
          format === 'affiliate'
            ? '/dashboard?tab=affiliates&mode=selling'
            : '/dashboard?tab=affiliates&mode=selling&sub=links',
      };
    };

    const items = [
      ...offers.map((o) =>
        mapRow('affiliate', o, o.product_service_title || o.business_name)
      ),
      ...posts.map((p) => mapRow('affiliate_post', p, p.title)),
    ];

    return {
      success: true,
      data: {
        summary: {
          total: items.length,
          active: items.filter((i) => i.status_label === 'active' || i.status_label === 'approved')
            .length,
          expiring_soon: items.filter(
            (i) => i.days_remaining != null && i.days_remaining >= 0 && i.days_remaining <= 7
          ).length,
          expired: items.filter((i) => i.days_remaining != null && i.days_remaining < 0).length,
        },
        items,
        formats: ['free', 'paid', 'sponsored', 'featured', 'promoted', 'banner', 'affiliate'],
        _source: 'affiliate-fallback',
      },
    };
  },

  getMyPayouts: async () => {
    try {
      const response = await api.get('/affiliates/payouts');
      return response.data;
    } catch (error) {
      const status = errStatus(error);
      if (status === 404 || status === 405) {
        return { success: true, data: [], _source: 'unavailable' };
      }
      throw error.response?.data || error;
    }
  },

  requestPayout: async (payload = {}) => {
    const body = {
      amount: payload.amount,
      method: payload.method || payload.payout_method || 'paypal',
      notes: payload.notes || '',
      payout_details: payload.payout_details || payload.details || undefined,
    };
    try {
      const response = await api.post('/affiliates/payout-requests', body);
      return response.data;
    } catch (error) {
      const status = errStatus(error);
      if (status === 404 || status === 405) {
        throw {
          code: 'PAYOUT_ENDPOINT_MISSING',
          message:
            'Could not reach payout endpoint. Check you are logged in, then try again.',
          status,
        };
      }
      throw error.response?.data || error;
    }
  },

  getOfferConversions: async (offerId, filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(
        `/affiliates/business-offers/${offerId}/conversions?${params}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📁 File Upload
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Get auth token
      const token = localStorage.getItem('token');
      
      console.log('📤 Uploading file:', file.name, 'Type:', file.type, 'Size:', file.size);
      
      // Create completely fresh axios instance with NO default headers
      const uploadApi = axios.create({
        baseURL: API_BASE_URL,
        timeout: 120000,
      });
      
      // Use direct axios call with minimal headers
      const response = await uploadApi.post('/affiliates/upload-image', formData, {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
        // NO Content-Type header - let browser set it automatically with boundary
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ Upload error details:', error);
      throw error.response?.data || error;
    }
  },

  // 📈 Upsell Plans
  getUpsellPlans: async () => {
    try {
      const response = await api.get('/affiliates/upsell-plans');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🔔 Notifications (placeholder - implement if needed)
  getNotifications: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      // This endpoint might not exist yet - return empty data for now
      return {
        success: true,
        data: {
          data: [],
          total: 0
        }
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📊 Analytics Summary (placeholder - implement if needed)
  getAnalyticsSummary: async (type, period) => {
    return {
      success: true,
      data: {
        totalRevenue: 0,
        totalClicks: 0,
        totalConversions: 0,
      },
    };
  },

  // 📈 Platform Stats (placeholder - implement if needed)
  getPlatformStats: async () => {
    return {
      success: true,
      data: {
        totalOffers: 0,
        totalPosts: 0,
        totalUsers: 0,
      },
    };
  },
};

export default affiliateService;
