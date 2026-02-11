import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import BookServices from '../services/BookServices';

// Async thunks for book marketplace operations
export const fetchMarketplaceBooks = createAsyncThunk(
  'bookMarketplace/fetchBooks',
  async (params = {}) => {
    const response = await BookServices.getMarketplaceBooks(params);
    return response.data;
  }
);

export const fetchBookStatistics = createAsyncThunk(
  'bookMarketplace/fetchStatistics',
  async () => {
    const response = await BookServices.getBookStatistics();
    return response.data;
  }
);

export const uploadBookPDF = createAsyncThunk(
  'bookMarketplace/uploadPDF',
  async (formData) => {
    const response = await BookServices.uploadBookPDF(formData);
    return response.data;
  }
);

export const createExternalBook = createAsyncThunk(
  'bookMarketplace/createExternalBook',
  async (bookData) => {
    const response = await BookServices.createExternalBook(bookData);
    return response.data;
  }
);

export const uploadAudiobook = createAsyncThunk(
  'bookMarketplace/uploadAudiobook',
  async (formData) => {
    const response = await BookServices.uploadAudiobook(formData);
    return response.data;
  }
);

export const purchaseBook = createAsyncThunk(
  'bookMarketplace/purchaseBook',
  async (bookId) => {
    const response = await BookServices.purchaseBook(bookId);
    return response.data;
  }
);

export const downloadBookPDF = createAsyncThunk(
  'bookMarketplace/downloadPDF',
  async (downloadToken, { rejectWithValue }) => {
    try {
      const response = await BookServices.downloadBook(downloadToken);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = `book-${downloadToken}.pdf`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true, filename };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Download failed');
    }
  }
);

export const getUserPurchasedBooks = createAsyncThunk(
  'bookMarketplace/getPurchasedBooks',
  async (params = {}) => {
    const response = await BookServices.getUserPurchases(params);
    return response.data;
  }
);

export const getUserBookListings = createAsyncThunk(
  'bookMarketplace/getUserListings',
  async (params = {}) => {
    const response = await BookServices.getUserListings(params);
    return response.data;
  }
);

export const createBookListing = createAsyncThunk(
  'bookMarketplace/createListing',
  async (bookData) => {
    const response = await BookServices.createBook(bookData);
    return response.data;
  }
);

export const updateBookListing = createAsyncThunk(
  'bookMarketplace/updateListing',
  async ({ bookId, bookData }) => {
    const response = await BookServices.updateBookListing(bookId, bookData);
    return response.data;
  }
);

export const deleteBookListing = createAsyncThunk(
  'bookMarketplace/deleteListing',
  async (bookId) => {
    await BookServices.deleteBookListing(bookId);
    return bookId;
  }
);

export const rateBook = createAsyncThunk(
  'bookMarketplace/rateBook',
  async ({ bookId, rating, review }) => {
    const response = await BookServices.rateBook(bookId, { rating, review });
    return response.data;
  }
);

export const getBookReviews = createAsyncThunk(
  'bookMarketplace/getBookReviews',
  async (bookId, params = {}) => {
    const response = await BookServices.getBookReviews(bookId, params);
    return response.data;
  }
);

const initialState = {
  books: [],
  userBooks: [],
  purchasedBooks: [],
  currentBook: null,
  loading: false,
  uploading: false,
  downloading: false,
  purchasing: false,
  error: null,
  uploadProgress: 0,
  downloadProgress: 0,
  statistics: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  },
  filters: {
    search: '',
    genre: 'all',
    book_type: 'all',
    author: '',
    min_price: '',
    max_price: '',
    sort: 'newest',
  },
};

const bookMarketplaceSlice = createSlice({
  name: 'bookMarketplace',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentBook: (state, action) => {
      state.currentBook = action.payload;
    },
    resetUploadProgress: (state) => {
      state.uploadProgress = 0;
    },
    resetDownloadProgress: (state) => {
      state.downloadProgress = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch marketplace books
      .addCase(fetchMarketplaceBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketplaceBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.data?.items || [];
        state.pagination = {
          ...state.pagination,
          ...action.payload.data?.pagination,
        };
      })
      .addCase(fetchMarketplaceBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch books';
      })

      // Fetch statistics
      .addCase(fetchBookStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload.data;
      })

      // Upload PDF
      .addCase(uploadBookPDF.pending, (state) => {
        state.uploading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadBookPDF.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadProgress = 100;
      })
      .addCase(uploadBookPDF.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload?.message || 'Upload failed';
      })

      // Create external book
      .addCase(createExternalBook.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(createExternalBook.fulfilled, (state, action) => {
        state.uploading = false;
        state.books.unshift(action.payload.data);
      })
      .addCase(createExternalBook.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload?.message || 'Failed to create external book';
      })

      // Upload audiobook
      .addCase(uploadAudiobook.pending, (state) => {
        state.uploading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadAudiobook.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadProgress = 100;
      })
      .addCase(uploadAudiobook.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload?.message || 'Audiobook upload failed';
      })

      // Purchase book
      .addCase(purchaseBook.pending, (state) => {
        state.purchasing = true;
        state.error = null;
      })
      .addCase(purchaseBook.fulfilled, (state, action) => {
        state.purchasing = false;
        // Move book from available to purchased if it exists
        const bookIndex = state.books.findIndex(book => book.book_id === action.payload.data?.book_id);
        if (bookIndex !== -1) {
          const purchasedBook = state.books.splice(bookIndex, 1)[0];
          state.purchasedBooks.unshift({ ...purchasedBook, ...action.payload.data });
        }
      })
      .addCase(purchaseBook.rejected, (state, action) => {
        state.purchasing = false;
        state.error = action.payload?.message || 'Purchase failed';
      })

      // Download PDF
      .addCase(downloadBookPDF.pending, (state) => {
        state.downloading = true;
        state.error = null;
        state.downloadProgress = 0;
      })
      .addCase(downloadBookPDF.fulfilled, (state, action) => {
        state.downloading = false;
        state.downloadProgress = 100;
      })
      .addCase(downloadBookPDF.rejected, (state, action) => {
        state.downloading = false;
        state.error = action.payload || 'Download failed';
      })

      // Get purchased books
      .addCase(getUserPurchasedBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPurchasedBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.purchasedBooks = action.payload.data || [];
      })
      .addCase(getUserPurchasedBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch purchased books';
      })

      // Get user listings
      .addCase(getUserBookListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserBookListings.fulfilled, (state, action) => {
        state.loading = false;
        state.userBooks = action.payload.data || [];
      })
      .addCase(getUserBookListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch user listings';
      })

      // Create book listing
      .addCase(createBookListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookListing.fulfilled, (state, action) => {
        state.loading = false;
        state.books.unshift(action.payload.data);
      })
      .addCase(createBookListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create listing';
      })

      // Update book listing
      .addCase(updateBookListing.fulfilled, (state, action) => {
        const index = state.books.findIndex(book => book.book_id === action.payload.data?.book_id);
        if (index !== -1) {
          state.books[index] = action.payload.data;
        }
      })

      // Delete book listing
      .addCase(deleteBookListing.fulfilled, (state, action) => {
        state.books = state.books.filter(book => book.book_id !== action.payload);
        state.userBooks = state.userBooks.filter(book => book.book_id !== action.payload);
      });
  },
});

export const {
  setFilters,
  setCurrentPage,
  clearError,
  setCurrentBook,
  resetUploadProgress,
  resetDownloadProgress,
} = bookMarketplaceSlice.actions;

export default bookMarketplaceSlice.reducer;
