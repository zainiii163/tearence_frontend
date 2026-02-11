import api from '../api';

class BooksAPI {
  constructor() {
    this.baseURL = '/v1/books';
  }

  // Get all books with filtering and pagination
  async getBooks(params = {}) {
    try {
      const response = await api.get(`${this.baseURL}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch books');
    }
  }

  // Get book statistics (admin only)
  async getBookStatistics() {
    try {
      const response = await api.get(`${this.baseURL}/statistics`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch book statistics');
    }
  }

  // Get single book by ID
  async getBook(id) {
    try {
      const response = await api.get(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch book');
    }
  }

  // Create new book listing
  async createBook(formData) {
    try {
      const response = await api.post(`${this.baseURL}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to create book listing');
    }
  }

  // Update book listing
  async updateBook(id, formData) {
    try {
      const response = await api.put(`${this.baseURL}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to update book listing');
    }
  }

  // Delete book listing
  async deleteBook(id) {
    try {
      const response = await api.delete(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete book listing');
    }
  }

  // Purchase book
  async purchaseBook(id, paymentMethod = 'credit_card') {
    try {
      const response = await api.post(`${this.baseURL}/${id}/purchase`, {
        payment_method: paymentMethod,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to purchase book');
    }
  }

  // Download book file
  async downloadBook(token) {
    try {
      const response = await api.get(`${this.baseURL}/download/${token}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to download book');
    }
  }

  // Get user's book purchases
  async getMyPurchases(params = {}) {
    try {
      const response = await api.get(`${this.baseURL}/my-purchases`, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch purchases');
    }
  }

  // Get user's book listings
  async getMyListings(params = {}) {
    try {
      const response = await api.get(`${this.baseURL}/my-listings`, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch your listings');
    }
  }

  // Get books by genre
  async getBooksByGenre(genre, params = {}) {
    try {
      const response = await api.get(`${this.baseURL}`, { 
        params: { ...params, genre } 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch books by genre');
    }
  }

  // Get books by type
  async getBooksByType(bookType, params = {}) {
    try {
      const response = await api.get(`${this.baseURL}`, { 
        params: { ...params, book_type: bookType } 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch books by type');
    }
  }

  // Search books
  async searchBooks(query, params = {}) {
    try {
      const response = await api.get(`${this.baseURL}`, {
        params: { search: query, ...params },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to search books');
    }
  }

  // Get featured books
  async getFeaturedBooks(params = {}) {
    try {
      const response = await api.get(`${this.baseURL}`, {
        params: { ...params, featured: true },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch featured books');
    }
  }

  // Rate and review book
  async rateBook(id, rating, review) {
    try {
      const response = await api.post(`${this.baseURL}/${id}/review`, {
        rating,
        review,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to submit review');
    }
  }

  // Get book reviews
  async getBookReviews(id, params = {}) {
    try {
      const response = await api.get(`${this.baseURL}/${id}/reviews`, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch reviews');
    }
  }

  // Add book to favorites
  async addToFavorites(id) {
    try {
      const response = await api.post(`${this.baseURL}/${id}/favorite`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to add to favorites');
    }
  }

  // Remove book from favorites
  async removeFromFavorites(id) {
    try {
      const response = await api.delete(`${this.baseURL}/${id}/favorite`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to remove from favorites');
    }
  }

  // Get favorite books
  async getFavoriteBooks(params = {}) {
    try {
      const response = await api.get(`${this.baseURL}/favorites`, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch favorite books');
    }
  }

  // Report book
  async reportBook(id, reason, description) {
    try {
      const response = await api.post(`${this.baseURL}/${id}/report`, {
        reason,
        description,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to report book');
    }
  }

  // Get book formats
  async getFormats() {
    const formats = {
      physical: 'Physical Book',
      e_book: 'E-book',
      audiobook: 'Audiobook'
    };
    return { data: formats };
  }

  // Get book conditions
  async getConditions() {
    const conditions = {
      new: 'New',
      like_new: 'Like New',
      good: 'Good',
      fair: 'Fair'
    };
    return { data: conditions };
  }

  // Get book types
  async getBookTypes() {
    const bookTypes = {
      physical: 'Physical Books',
      pdf: 'PDF Downloads',
      audiobook: 'Audiobooks'
    };
    return { data: bookTypes };
  }

  // Get available genres
  async getGenres() {
    const genres = {
      action: 'Action',
      education: 'Education',
      drama: 'Drama',
      thriller: 'Thriller',
      fiction: 'Fiction',
      non_fiction: 'Non-Fiction',
      textbook: 'Textbook',
      romance: 'Romance',
      mystery: 'Mystery',
      scifi: 'Sci-Fi',
      fantasy: 'Fantasy',
      biography: 'Biography',
      self_help: 'Self-Help',
      business: 'Business',
      children: 'Children'
    };
    return { data: genres };
  }

  // Bulk operations
  async bulkUpdateBooks(updates) {
    try {
      const response = await api.post(`${this.baseURL}/bulk-update`, { updates });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to bulk update books');
    }
  }

  async bulkDeleteBooks(ids) {
    try {
      const response = await api.post(`${this.baseURL}/bulk-delete`, { ids });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to bulk delete books');
    }
  }

  // Analytics and insights
  async getBookAnalytics(id) {
    try {
      const response = await api.get(`${this.baseURL}/${id}/analytics`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch book analytics');
    }
  }

  async getUserBookStats() {
    try {
      const response = await api.get(`${this.baseURL}/user-stats`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch user book statistics');
    }
  }

  // File operations
  async uploadBookCover(id, file) {
    try {
      const formData = new FormData();
      formData.append('cover', file);
      
      const response = await api.post(`${this.baseURL}/${id}/cover`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to upload cover');
    }
  }

  async uploadBookFile(id, file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post(`${this.baseURL}/${id}/file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to upload book file');
    }
  }

  // Advanced search
  async advancedSearch(filters) {
    try {
      const response = await api.post(`${this.baseURL}/advanced-search`, filters);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to perform advanced search');
    }
  }

  // Recommendations
  async getRecommendations(params = {}) {
    try {
      const response = await api.get(`${this.baseURL}/recommendations`, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch recommendations');
    }
  }

  // Similar books
  async getSimilarBooks(id, params = {}) {
    try {
      const response = await api.get(`${this.baseURL}/${id}/similar`, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch similar books');
    }
  }
}

const booksAPI = new BooksAPI();
export default booksAPI;
