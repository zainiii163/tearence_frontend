import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import booksAPI from '../services/booksAPI';

// Async thunks for books API operations
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await booksAPI.getBooks(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBookBySlug = createAsyncThunk(
  'books/fetchBookBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await booksAPI.getBookBySlug(slug);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createBook = createAsyncThunk(
  'books/createBook',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await booksAPI.createBook(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBook = createAsyncThunk(
  'books/updateBook',
  async ({ bookId, formData }, { rejectWithValue }) => {
    try {
      const response = await booksAPI.updateBook(bookId, formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBook = createAsyncThunk(
  'books/deleteBook',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await booksAPI.deleteBook(bookId);
      return { bookId, message: response.message };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveBook = createAsyncThunk(
  'books/saveBook',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await booksAPI.saveBook(bookId);
      return { bookId, ...response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMyBooks = createAsyncThunk(
  'books/fetchMyBooks',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await booksAPI.getMyBooks(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFeaturedBooks = createAsyncThunk(
  'books/fetchFeaturedBooks',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await booksAPI.getFeaturedBooks(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBooksByGenre = createAsyncThunk(
  'books/fetchBooksByGenre',
  async ({ genre, params = {} }, { rejectWithValue }) => {
    try {
      const response = await booksAPI.getBooksByGenre(genre, params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPricingPlans = createAsyncThunk(
  'books/fetchPricingPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await booksAPI.getPricingPlans();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const processPayment = createAsyncThunk(
  'books/processPayment',
  async ({ bookId, paymentData }, { rejectWithValue }) => {
    try {
      const response = await booksAPI.processPayment(bookId, paymentData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStatistics = createAsyncThunk(
  'books/fetchStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await booksAPI.getStatistics();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  // Books list
  books: [],
  featuredBooks: [],
  myBooks: [],
  currentBook: null,
  
  // Pagination
  currentPage: 1,
  lastPage: 1,
  perPage: 12,
  total: 0,
  
  // Filters
  filters: {
    search: '',
    genre: '',
    country: '',
    format: '',
    book_type: '',
    language: '',
    min_price: '',
    max_price: '',
    verified_only: false,
    promoted_only: false,
    sort_by: 'created_at',
    sort_order: 'desc',
  },
  
  // Pricing plans
  pricingPlans: [],
  
  // Statistics
  statistics: null,
  
  // Loading states
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  saving: false,
  
  // Error states
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
  saveError: null,
  
  // Success messages
  successMessage: null,
  
  // Saved books tracking
  savedBooks: [],
};

// Books slice
const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    // Update filters
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Clear filters
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    // Clear current book
    clearCurrentBook: (state) => {
      state.currentBook = null;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
      state.saveError = null;
    },
    
    // Clear success message
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    
    // Update saved books
    updateSavedBooks: (state, action) => {
      state.savedBooks = action.payload;
    },
    
    // Toggle book saved status
    toggleBookSaved: (state, action) => {
      const bookId = action.payload;
      const index = state.savedBooks.indexOf(bookId);
      
      if (index > -1) {
        state.savedBooks.splice(index, 1);
      } else {
        state.savedBooks.push(bookId);
      }
      
      // Update book in list if it exists
      const bookIndex = state.books.findIndex(book => book.id === bookId);
      if (bookIndex > -1) {
        state.books[bookIndex].saved = !state.books[bookIndex].saved;
        state.books[bookIndex].saves_count = state.books[bookIndex].saved 
          ? state.books[bookIndex].saves_count + 1 
          : state.books[bookIndex].saves_count - 1;
      }
      
      // Update current book if it's the same
      if (state.currentBook && state.currentBook.id === bookId) {
        state.currentBook.saved = !state.currentBook.saved;
        state.currentBook.saves_count = state.currentBook.saved 
          ? state.currentBook.saves_count + 1 
          : state.currentBook.saves_count - 1;
      }
    },
    
    // Increment book views
    incrementBookViews: (state, action) => {
      const bookId = action.payload;
      const bookIndex = state.books.findIndex(book => book.id === bookId);
      if (bookIndex > -1) {
        state.books[bookIndex].views_count += 1;
      }
      
      if (state.currentBook && state.currentBook.id === bookId) {
        state.currentBook.views_count += 1;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch books
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        const { data, current_page, last_page, per_page, total } = action.payload.data;
        state.books = data;
        state.currentPage = current_page;
        state.lastPage = last_page;
        state.perPage = per_page;
        state.total = total;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // Fetch book by slug
    builder
      .addCase(fetchBookBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBook = action.payload.data;
      })
      .addCase(fetchBookBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // Create book
    builder
      .addCase(createBook.pending, (state) => {
        state.creating = true;
        state.createError = null;
        state.successMessage = null;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.creating = false;
        state.successMessage = action.payload.message;
        // Add new book to the beginning of the list
        if (action.payload.data) {
          state.books.unshift(action.payload.data);
          state.total += 1;
        }
      })
      .addCase(createBook.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload;
      });
    
    // Update book
    builder
      .addCase(updateBook.pending, (state) => {
        state.updating = true;
        state.updateError = null;
        state.successMessage = null;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.updating = false;
        state.successMessage = action.payload.message;
        
        // Update book in list
        if (action.payload.data) {
          const index = state.books.findIndex(book => book.id === action.payload.data.id);
          if (index > -1) {
            state.books[index] = action.payload.data;
          }
          
          // Update current book if it's the same
          if (state.currentBook && state.currentBook.id === action.payload.data.id) {
            state.currentBook = action.payload.data;
          }
        }
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload;
      });
    
    // Delete book
    builder
      .addCase(deleteBook.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
        state.successMessage = null;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.deleting = false;
        state.successMessage = action.payload.message;
        
        // Remove book from list
        const index = state.books.findIndex(book => book.id === action.payload.bookId);
        if (index > -1) {
          state.books.splice(index, 1);
          state.total -= 1;
        }
        
        // Remove from my books
        const myBookIndex = state.myBooks.findIndex(book => book.id === action.payload.bookId);
        if (myBookIndex > -1) {
          state.myBooks.splice(myBookIndex, 1);
        }
        
        // Clear current book if it's the same
        if (state.currentBook && state.currentBook.id === action.payload.bookId) {
          state.currentBook = null;
        }
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.deleting = false;
        state.deleteError = action.payload;
      });
    
    // Save book
    builder
      .addCase(saveBook.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(saveBook.fulfilled, (state, action) => {
        state.saving = false;
        const { bookId, saved, saves_count } = action.payload;
        
        // Update saved books list
        if (saved && !state.savedBooks.includes(bookId)) {
          state.savedBooks.push(bookId);
        } else if (!saved && state.savedBooks.includes(bookId)) {
          const index = state.savedBooks.indexOf(bookId);
          state.savedBooks.splice(index, 1);
        }
        
        // Update book in list
        const bookIndex = state.books.findIndex(book => book.id === bookId);
        if (bookIndex > -1) {
          state.books[bookIndex].saved = saved;
          state.books[bookIndex].saves_count = saves_count;
        }
        
        // Update current book if it's the same
        if (state.currentBook && state.currentBook.id === bookId) {
          state.currentBook.saved = saved;
          state.currentBook.saves_count = saves_count;
        }
      })
      .addCase(saveBook.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload;
      });
    
    // Fetch my books
    builder
      .addCase(fetchMyBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.myBooks = action.payload.data.data;
      })
      .addCase(fetchMyBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // Fetch featured books
    builder
      .addCase(fetchFeaturedBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredBooks = action.payload.data.data;
      })
      .addCase(fetchFeaturedBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // Fetch books by genre
    builder
      .addCase(fetchBooksByGenre.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooksByGenre.fulfilled, (state, action) => {
        state.loading = false;
        const { data, current_page, last_page, per_page, total } = action.payload.data;
        state.books = data;
        state.currentPage = current_page;
        state.lastPage = last_page;
        state.perPage = per_page;
        state.total = total;
      })
      .addCase(fetchBooksByGenre.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // Fetch pricing plans
    builder
      .addCase(fetchPricingPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPricingPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.pricingPlans = action.payload.data;
      })
      .addCase(fetchPricingPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // Process payment
    builder
      .addCase(processPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        
        // Update book payment status
        if (action.payload.data) {
          const bookId = action.payload.data.id;
          const bookIndex = state.books.findIndex(book => book.id === bookId);
          if (bookIndex > -1) {
            state.books[bookIndex] = { ...state.books[bookIndex], ...action.payload.data };
          }
          
          if (state.currentBook && state.currentBook.id === bookId) {
            state.currentBook = { ...state.currentBook, ...action.payload.data };
          }
        }
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // Fetch statistics
    builder
      .addCase(fetchStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload.data;
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  updateFilters,
  clearFilters,
  clearCurrentBook,
  clearError,
  clearSuccessMessage,
  updateSavedBooks,
  toggleBookSaved,
  incrementBookViews,
} = booksSlice.actions;

// Selectors
export const selectBooks = (state) => state.books.books;
export const selectCurrentBook = (state) => state.books.currentBook;
export const selectFeaturedBooks = (state) => state.books.featuredBooks;
export const selectMyBooks = (state) => state.books.myBooks;
export const selectBooksLoading = (state) => state.books.loading;
export const selectBooksError = (state) => state.books.error;
export const selectBooksFilters = (state) => state.books.filters;
export const selectBooksPagination = (state) => ({
  currentPage: state.books.currentPage,
  lastPage: state.books.lastPage,
  perPage: state.books.perPage,
  total: state.books.total,
});
export const selectPricingPlans = (state) => state.books.pricingPlans;
export const selectStatistics = (state) => state.books.statistics;
export const selectSavedBooks = (state) => state.books.savedBooks;
export const selectBookCreating = (state) => state.books.creating;
export const selectBookUpdating = (state) => state.books.updating;
export const selectBookDeleting = (state) => state.books.deleting;
export const selectBookSaving = (state) => state.books.saving;
export const selectSuccessMessage = (state) => state.books.successMessage;

// Export reducer
export default booksSlice.reducer;
