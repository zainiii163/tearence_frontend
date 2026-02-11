/**
 * Affiliate Link Tracking System
 * Handles tracking clicks, conversions, and affiliate analytics
 */

class AffiliateTracker {
  constructor() {
    this.apiEndpoint = '/api/v1/affiliate';
    this.cookieName = 'wwa_affiliate_ref';
    this.cookieDuration = 30; // days
    this.sessionId = this.generateSessionId();
    this.fingerprint = this.generateFingerprint();
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Generate browser fingerprint for fraud detection
   */
  generateFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser fingerprint', 2, 2);
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');
    
    return btoa(fingerprint).substring(0, 32);
  }

  /**
   * Set affiliate referral cookie
   */
  setReferralCookie(referralCode, programId) {
    const cookieData = {
      referralCode,
      programId,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      fingerprint: this.fingerprint
    };
    
    document.cookie = `${this.cookieName}=${btoa(JSON.stringify(cookieData))}; max-age=${this.cookieDuration * 24 * 60 * 60}; path=/; sameSite=lax`;
  }

  /**
   * Get affiliate referral from cookie
   */
  getReferralFromCookie() {
    const name = this.cookieName + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        try {
          return JSON.parse(atob(c.substring(name.length)));
        } catch (e) {
          console.error('Error parsing affiliate cookie:', e);
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Clear affiliate cookie
   */
  clearReferralCookie() {
    document.cookie = `${this.cookieName}=; max-age=0; path=/;`;
  }

  /**
   * Extract referral code from URL
   */
  extractReferralFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('ref') || urlParams.get('affiliate') || urlParams.get('promo');
  }

  /**
   * Initialize affiliate tracking
   */
  initialize() {
    // Check for referral in URL first
    const urlReferral = this.extractReferralFromUrl();
    
    if (urlReferral) {
      // New referral from URL
      this.setReferralCookie(urlReferral);
      this.trackClick(urlReferral, window.location.href);
    } else {
      // Check for existing referral in cookie
      const cookieReferral = this.getReferralFromCookie();
      if (cookieReferral) {
        // Validate cookie age
        const cookieAge = Date.now() - cookieReferral.timestamp;
        const maxAge = this.cookieDuration * 24 * 60 * 60 * 1000;
        
        if (cookieAge > maxAge) {
          this.clearReferralCookie();
        }
      }
    }
  }

  /**
   * Track affiliate link click
   */
  async trackClick(referralCode, targetUrl = null) {
    try {
      const clickData = {
        referralCode,
        targetUrl: targetUrl || window.location.href,
        landingUrl: window.location.href,
        ipAddress: await this.getClientIP(),
        userAgent: navigator.userAgent,
        country: await this.getCountry(),
        city: await this.getCity(),
        deviceType: this.getDeviceType(),
        browser: this.getBrowser(),
        sessionId: this.sessionId,
        fingerprint: this.fingerprint,
        referrer: document.referrer,
        utmSource: new URLSearchParams(window.location.search).get('utm_source'),
        utmMedium: new URLSearchParams(window.location.search).get('utm_medium'),
        utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign'),
        timestamp: new Date().toISOString()
      };

      const response = await fetch(`${this.apiEndpoint}/track-click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clickData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Click tracked successfully:', result);
      
      // Store click ID for potential conversion tracking
      if (result.clickId) {
        sessionStorage.setItem('lastAffiliateClick', result.clickId);
      }

      return result;
    } catch (error) {
      console.error('Error tracking affiliate click:', error);
      // Don't throw error to avoid breaking user experience
      return null;
    }
  }

  /**
   * Track conversion/sale
   */
  async trackConversion(orderId, amount, currency = 'USD', additionalData = {}) {
    try {
      const referralData = this.getReferralFromCookie();
      const clickId = sessionStorage.getItem('lastAffiliateClick');

      if (!referralData && !clickId) {
        console.warn('No referral data found for conversion tracking');
        return null;
      }

      const conversionData = {
        orderId,
        amount: parseFloat(amount),
        currency,
        referralCode: referralData?.referralCode,
        clickId,
        sessionId: this.sessionId,
        fingerprint: this.fingerprint,
        customerEmail: additionalData.customerEmail,
        customerName: additionalData.customerName,
        productId: additionalData.productId,
        productName: additionalData.productName,
        productCategory: additionalData.productCategory,
        timestamp: new Date().toISOString(),
        ...additionalData
      };

      const response = await fetch(`${this.apiEndpoint}/track-conversion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(conversionData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Conversion tracked successfully:', result);

      // Clear click ID after successful conversion
      sessionStorage.removeItem('lastAffiliateClick');

      return result;
    } catch (error) {
      console.error('Error tracking conversion:', error);
      return null;
    }
  }

  /**
   * Get client IP address
   */
  async getClientIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error getting IP address:', error);
      return null;
    }
  }

  /**
   * Get user country
   */
  async getCountry() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return data.country_code;
    } catch (error) {
      console.error('Error getting country:', error);
      return null;
    }
  }

  /**
   * Get user city
   */
  async getCity() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return data.city;
    } catch (error) {
      console.error('Error getting city:', error);
      return null;
    }
  }

  /**
   * Detect device type
   */
  getDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      return 'mobile';
    } else if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    }
    return 'desktop';
  }

  /**
   * Detect browser
   */
  getBrowser() {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf('Chrome') > -1) return 'Chrome';
    if (userAgent.indexOf('Safari') > -1) return 'Safari';
    if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
    if (userAgent.indexOf('Edge') > -1) return 'Edge';
    if (userAgent.indexOf('Opera') > -1) return 'Opera';
    return 'Other';
  }

  /**
   * Generate affiliate link
   */
  generateAffiliateLink(baseUrl, referralCode) {
    const url = new URL(baseUrl);
    url.searchParams.set('ref', referralCode);
    return url.toString();
  }

  /**
   * Validate referral code format
   */
  validateReferralCode(code) {
    // Basic validation: 6-20 characters, alphanumeric and some special chars
    const regex = /^[A-Z0-9]{6,20}$/;
    return regex.test(code);
  }

  /**
   * Get current referral info
   */
  getCurrentReferral() {
    return this.getReferralFromCookie();
  }

  /**
   * Check if user is referred
   */
  isReferred() {
    return !!this.getReferralFromCookie();
  }

  /**
   * Get referral attribution data
   */
  getAttributionData() {
    const referral = this.getReferralFromCookie();
    if (!referral) return null;

    return {
      referralCode: referral.referralCode,
      programId: referral.programId,
      referralDate: new Date(referral.timestamp).toISOString(),
      sessionId: referral.sessionId,
      daysSinceReferral: Math.floor((Date.now() - referral.timestamp) / (1000 * 60 * 60 * 24))
    };
  }

  /**
   * Setup automatic conversion tracking for e-commerce
   */
  setupEcommerceTracking() {
    // Track page views for potential conversions
    if (typeof gtag !== 'undefined') {
      // Integration with Google Analytics
      gtag('event', 'page_view', {
        custom_parameter: this.getCurrentReferral()?.referralCode
      });
    }

    // Listen for purchase events (common in e-commerce)
    window.addEventListener('purchase', (event) => {
      const { orderId, amount, currency, customer } = event.detail;
      this.trackConversion(orderId, amount, currency, customer);
    });
  }

  /**
   * Create tracking pixel for conversion tracking
   */
  createTrackingPixel(conversionData) {
    const pixel = document.createElement('img');
    pixel.style.display = 'none';
    pixel.src = `${this.apiEndpoint}/conversion-pixel?${new URLSearchParams(conversionData)}`;
    document.body.appendChild(pixel);
    
    // Remove pixel after loading
    pixel.onload = () => pixel.remove();
    pixel.onerror = () => pixel.remove();
  }

  /**
   * Export tracking data for analytics
   */
  exportTrackingData() {
    const referral = this.getReferralFromCookie();
    const attribution = this.getAttributionData();
    
    return {
      referral,
      attribution,
      sessionId: this.sessionId,
      fingerprint: this.fingerprint,
      deviceType: this.getDeviceType(),
      browser: this.getBrowser(),
      isReferred: this.isReferred(),
      timestamp: new Date().toISOString()
    };
  }
}

// Create singleton instance
const affiliateTracker = new AffiliateTracker();

// Initialize tracking when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => affiliateTracker.initialize());
} else {
  affiliateTracker.initialize();
}

// Export for use in other modules
export default affiliateTracker;

// Also provide global access for legacy code
if (typeof window !== 'undefined') {
  window.AffiliateTracker = affiliateTracker;
}
