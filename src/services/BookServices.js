import Api from "../api";

const bookService = {
  /**
   * Get all books
   * @param {Object} [params] - Query parameters
   * @param {number} [params.page] - Page number
   * @param {number} [params.per_page] - Items per page
   * @param {number} [params.skip] - Skip records (legacy)
   * @param {number} [params.limit] - Limit records (legacy)
   * @param {string} [params.search] - Search term
   * @returns {Promise} List of books
   */
  getBooks: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page);
    if (params?.per_page) queryParams.append("per_page", params.per_page);
    if (params?.skip) queryParams.append("skip", params.skip);
    if (params?.limit) queryParams.append("limit", params.limit);
    if (params?.search) queryParams.append("search", params.search);

    const url = queryParams.toString()
      ? `/v1/book?${queryParams.toString()}`
      : `/v1/book`;
    
    return await Api.get(url);
  },

  /**
   * Get marketplace books with advanced filtering
   * @param {Object} [params] - Query parameters
   * @param {number} [params.page] - Page number
   * @param {number} [params.per_page] - Items per page
   * @param {string} [params.search] - Search term
   * @param {string} [params.genre] - Genre filter
   * @param {string} [params.book_type] - Book type filter (pdf, audiobook, external)
   * @param {string} [params.author] - Author filter
   * @param {number} [params.min_price] - Minimum price
   * @param {number} [params.max_price] - Maximum price
   * @param {string} [params.sort] - Sort option (newest, oldest, price_low, price_high, title)
   * @returns {Promise} List of marketplace books
   */
  getMarketplaceBooks: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page);
    if (params?.per_page) queryParams.append("per_page", params.per_page);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.genre) queryParams.append("genre", params.genre);
    if (params?.book_type) queryParams.append("book_type", params.book_type);
    if (params?.author) queryParams.append("author", params.author);
    if (params?.min_price) queryParams.append("min_price", params.min_price);
    if (params?.max_price) queryParams.append("max_price", params.max_price);
    if (params?.sort) queryParams.append("sort", params.sort);

    const url = queryParams.toString()
      ? `/v1/books?${queryParams.toString()}`
      : `/v1/books`;
    
    return await Api.get(url);
  },

  /**
   * Get book statistics for marketplace
   * @returns {Promise} Book statistics
   */
  getBookStatistics: async () => {
    return await Api.get('/v1/books/statistics');
  },

  /**
   * Upload PDF book
   * @param {FormData} formData - Form data with PDF file and book info
   * @returns {Promise} Upload response
   */
  uploadBookPDF: async (formData) => {
    return await Api.post('/v1/books/upload-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Create external book link
   * @param {Object} data - Book data with external URL
   * @returns {Promise} Created book
   */
  createExternalBook: async (data) => {
    return await Api.post('/v1/books/external', data);
  },

  /**
   * Upload audiobook
   * @param {FormData} formData - Form data with audio file and book info
   * @returns {Promise} Upload response
   */
  uploadAudiobook: async (formData) => {
    return await Api.post('/v1/books/upload-audiobook', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Purchase book
   * @param {number} bookId - Book ID
   * @param {Object} [paymentData] - Payment information (optional)
   * @returns {Promise} Purchase response
   */
  purchaseBook: async (bookId, paymentData = {}) => {
    // Default payment data if not provided
    const defaultPaymentData = {
      payment_method: 'credit_card',
      payment_token: 'default_token', // Backend requires this field
      amount: 0.00 // Backend will calculate actual amount
    };
    
    const finalPaymentData = { ...defaultPaymentData, ...paymentData };
    return await Api.post(`/v1/books/${bookId}/purchase`, finalPaymentData);
  },

  /**
   * Download purchased book
   * @param {string} downloadToken - Download token
   * @returns {Promise} Download response
   */
  downloadBook: async (downloadToken) => {
    return await Api.get(`/v1/books/download/${downloadToken}`, {
      responseType: 'blob',
    });
  },

  /**
   * Get user's purchased books
   * @param {Object} [params] - Query parameters
   * @returns {Promise} User's purchased books
   */
  getUserPurchases: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page);
    if (params?.per_page) queryParams.append("per_page", params.per_page);

    const url = queryParams.toString()
      ? `/v1/books/my-purchases?${queryParams.toString()}`
      : `/v1/books/my-purchases`;
    
    return await Api.get(url);
  },

  /**
   * Get user's book listings
   * @param {Object} [params] - Query parameters
   * @returns {Promise} User's book listings
   */
  getUserListings: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page);
    if (params?.per_page) queryParams.append("per_page", params.per_page);

    const url = queryParams.toString()
      ? `/v1/books/my-listings?${queryParams.toString()}`
      : `/v1/books/my-listings`;
    
    return await Api.get(url);
  },

  /**
   * Update book listing
   * @param {number} bookId - Book ID
   * @param {Object} data - Updated book data
   * @returns {Promise} Updated book
   */
  updateBookListing: async (bookId, data) => {
    return await Api.put(`/v1/books/${bookId}`, data);
  },

  /**
   * Delete book listing
   * @param {number} bookId - Book ID
   * @returns {Promise} Delete confirmation
   */
  deleteBookListing: async (bookId) => {
    return await Api.delete(`/v1/books/${bookId}`);
  },

  /**
   * Get book by ID
   * @param {number} id - Book ID
   * @returns {Promise} Book data
   */
  getBookById: async (id) => {
    return await Api.get(`/v1/book/${id}`);
  },

  /**
   * Create new book
   * @param {Object} data - Book data
   * @returns {Promise} Created book
   */
  createBook: async (data) => {
    return await Api.post("/v1/book", data);
  },

  /**
   * Update book
   * @param {number} id - Book ID
   * @param {Object} data - Updated book data
   * @returns {Promise} Updated book
   */
  updateBook: async (id, data) => {
    return await Api.put(`/v1/book/${id}`, data);
  },

  /**
   * Delete book
   * @param {number} id - Book ID
   * @returns {Promise} Delete confirmation
   */
  deleteBook: async (id) => {
    return await Api.delete(`/v1/book/${id}`);
  },

  /**
   * Scrape books
   * @param {Object} data - Scrape parameters
   * @returns {Promise} Scraped books
   */
  scrapeBooks: async (data) => {
    return await Api.post("/v1/book/scrape", data);
  },
};

export default bookService;