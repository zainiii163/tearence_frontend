/**
 * Request Queue Service
 * Handles failed API requests by queuing them for retry when connection is restored
 */

class RequestQueue {
  constructor() {
    this.queue = [];
    this.maxRetries = 3;
    this.baseDelay = 1000; // 1 second base delay
    this.isOnline = navigator.onLine;
    this.retryTimer = null;
    this.listeners = [];
    
    // Monitor online/offline status
    this.setupConnectionMonitoring();
    
    // Load persisted queue from localStorage
    this.loadPersistedQueue();
  }

  setupConnectionMonitoring() {
    window.addEventListener('online', () => {
      console.log('🌐 Connection restored');
      this.isOnline = true;
      this.notifyListeners('online');
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      console.log('📡 Connection lost');
      this.isOnline = false;
      this.notifyListeners('offline');
    });
  }

  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  notifyListeners(event, data = {}) {
    this.listeners.forEach(callback => callback(event, data));
  }

  // Add failed request to queue
  enqueue(request) {
    const queuedRequest = {
      id: this.generateId(),
      method: request.method?.toLowerCase(),
      url: request.url,
      data: request.data,
      headers: request.headers,
      retryCount: 0,
      timestamp: Date.now(),
      lastRetry: null,
      ...request
    };

    this.queue.push(queuedRequest);
    this.persistQueue();
    
    console.log(`📦 Request queued: ${queuedRequest.method.toUpperCase()} ${queuedRequest.url}`);
    this.notifyListeners('queued', { request: queuedRequest, queueSize: this.queue.length });
    
    return queuedRequest.id;
  }

  // Remove request from queue
  dequeue(requestId) {
    const index = this.queue.findIndex(req => req.id === requestId);
    if (index !== -1) {
      const removed = this.queue.splice(index, 1)[0];
      this.persistQueue();
      this.notifyListeners('dequeued', { request: removed, queueSize: this.queue.length });
      return removed;
    }
    return null;
  }

  // Clear all requests
  clearQueue() {
    const cleared = [...this.queue];
    this.queue = [];
    this.persistQueue();
    this.notifyListeners('cleared', { cleared, queueSize: 0 });
    console.log(`🗑️ Queue cleared: ${cleared.length} requests removed`);
  }

  // Process queue when connection is restored
  async processQueue() {
    if (!this.isOnline || this.queue.length === 0) {
      return;
    }

    console.log(`🔄 Processing queue: ${this.queue.length} requests`);
    this.notifyListeners('processing', { queueSize: this.queue.length });

    // Process requests one by one to avoid overwhelming the server
    const requests = [...this.queue];
    for (const request of requests) {
      if (!this.isOnline) {
        console.log('⏸️ Connection lost during queue processing');
        break;
      }

      try {
        await this.retryRequest(request);
        this.dequeue(request.id);
        console.log(`✅ Request succeeded: ${request.method.toUpperCase()} ${request.url}`);
      } catch (error) {
        console.error(`❌ Request failed: ${request.method.toUpperCase()} ${request.url}`, error);
        
        if (request.retryCount >= this.maxRetries) {
          console.log(`🚫 Max retries reached for: ${request.method.toUpperCase()} ${request.url}`);
          this.dequeue(request.id);
          this.notifyListeners('failed', { request, error });
        } else {
          // Update retry count and schedule next retry
          request.retryCount++;
          request.lastRetry = Date.now();
          
          const delay = this.calculateBackoffDelay(request.retryCount);
          console.log(`⏰ Scheduling retry ${request.retryCount}/${this.maxRetries} in ${delay}ms`);
          
          setTimeout(() => {
            this.processQueue();
          }, delay);
          
          break; // Process one request at a time with delays
        }
      }
    }

    if (this.queue.length === 0) {
      console.log('🎉 Queue empty - all requests processed');
      this.notifyListeners('completed', { queueSize: 0 });
    }
  }

  // Retry a single request
  async retryRequest(request) {
    const axios = require('./api').default;
    
    const config = {
      method: request.method,
      url: request.url,
      data: request.data,
      headers: request.headers,
      // Add retry flag to prevent infinite loops
      _isRetry: true
    };

    let response;
    switch (request.method) {
      case 'get':
        response = await axios.get(request.url, config);
        break;
      case 'post':
        response = await axios.post(request.url, request.data, config);
        break;
      case 'put':
        response = await axios.put(request.url, request.data, config);
        break;
      case 'delete':
        response = await axios.delete(request.url, config);
        break;
      default:
        throw new Error(`Unsupported method: ${request.method}`);
    }

    return response;
  }

  // Calculate exponential backoff delay
  calculateBackoffDelay(retryCount) {
    return this.baseDelay * Math.pow(2, retryCount - 1) + Math.random() * 1000;
  }

  // Get queue status
  getStatus() {
    return {
      size: this.queue.length,
      isOnline: this.isOnline,
      pendingRequests: this.queue.map(req => ({
        id: req.id,
        method: req.method,
        url: req.url,
        retryCount: req.retryCount,
        timestamp: req.timestamp
      }))
    };
  }

  // Generate unique ID for requests
  generateId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Persist queue to localStorage
  persistQueue() {
    try {
      const queueData = {
        queue: this.queue,
        timestamp: Date.now()
      };
      localStorage.setItem('requestQueue', JSON.stringify(queueData));
    } catch (error) {
      console.warn('Failed to persist request queue:', error);
    }
  }

  // Load queue from localStorage
  loadPersistedQueue() {
    try {
      const stored = localStorage.getItem('requestQueue');
      if (stored) {
        const queueData = JSON.parse(stored);
        
        // Only load queue if it's less than 1 hour old
        const age = Date.now() - queueData.timestamp;
        if (age < 60 * 60 * 1000) { // 1 hour
          this.queue = queueData.queue || [];
          console.log(`📦 Loaded ${this.queue.length} requests from storage`);
        } else {
          console.log('📦 Expired queue data found, clearing');
          localStorage.removeItem('requestQueue');
        }
      }
    } catch (error) {
      console.warn('Failed to load persisted request queue:', error);
    }
  }

  // Cleanup old requests (older than 1 hour)
  cleanup() {
    const oneHour = 60 * 60 * 1000;
    const now = Date.now();
    
    this.queue = this.queue.filter(request => {
      return (now - request.timestamp) < oneHour;
    });

    if (this.queue.length > 0) {
      this.persistQueue();
    }
  }
}

// Create singleton instance
const requestQueue = new RequestQueue();

// Auto-cleanup every 30 minutes
setInterval(() => {
  requestQueue.cleanup();
}, 30 * 60 * 1000);

export default requestQueue;
