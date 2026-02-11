# Book Marketplace Page Documentation

## Overview

The BookMarketplacePage is a comprehensive e-commerce interface for browsing, searching, purchasing, and downloading books. The page features category-based navigation, advanced filtering, and support for multiple book formats including PDFs, audiobooks, and external links.

## Features

### 1. Category Navigation (Subsections)

**Location**: Top section after header

The page includes a dedicated category navigation section that allows users to browse books by genre:

```jsx
{/* Book Categories Navigation */}
<div className="mb-8">
  <div className="bg-white rounded-lg border p-4">
    <h2 className="text-lg font-semibold mb-4 text-gray-800">Browse by Category</h2>
    <div className="flex flex-wrap gap-2">
      {genres.map(genre => (
        <button
          key={genre.value}
          onClick={() => handleFilterChange('genre', genre.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filters.genre === genre.value
              ? 'bg-primary text-primary-foreground'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {genre.label}
        </button>
      ))}
    </div>
  </div>
</div>
```

**Available Categories**:
- All Genres
- Action
- Education
- Drama
- Thriller
- Fiction
- Non-Fiction
- Textbook
- Romance
- Mystery
- Sci-Fi
- Fantasy
- Biography
- Self-Help
- Business
- Children

**Features**:
- **Interactive Buttons**: Click to filter books by category
- **Visual Feedback**: Active category highlighted in primary color
- **Responsive Design**: Categories wrap on smaller screens
- **Smooth Transitions**: Hover effects for better UX

### 2. Search and Filter Section

**Location**: Below category navigation

Comprehensive filtering options including:

- **Search Bar**: Search by book title and author
- **Genre Filter**: Dropdown for genre selection
- **Book Type Filter**: Filter by format (PDF, Audiobook, External)
- **Sort Options**: Sort by newest, oldest, price, title, author
- **Price Range**: Min/max price inputs

### 3. Book Display Grid

**Layout**: Responsive grid (1-4 columns based on screen size)

Each book card displays:
- Cover image with fallback to NoImage.png
- Format badge (PDF, Audiobook, External)
- Premium badge if applicable
- Genre tag
- Rating (if available)
- Title and author
- Description preview
- Price
- View Details button
- Purchase/Download buttons based on book type and purchase status

### 4. Book Types and Actions

#### PDF Books
- **Purchased**: Download button (green)
- **Not Purchased**: Purchase button (primary)

#### Audiobooks
- **Purchased**: Download Audio button (green)
- **Not Purchased**: Purchase button (primary)

#### External Links
- **Action**: Visit Website button (blue) - opens in new tab

#### Physical Books
- **Action**: Purchase button (primary)

### 5. Book Details Modal

**Trigger**: Click "View Details" button

**Displays**:
- Large cover image
- Full title and author
- Format badge and price
- Rating (if available)
- Full description
- ISBN, publisher, pages, language (if available)
- Purchase/download actions

### 6. Pagination

**Features**:
- Previous/Next navigation
- Page number display
- Items count display
- Disabled state for boundary pages

## State Management

### Redux State
```javascript
{
  books: [],           // Array of book objects
  loading: false,      // Loading state
  purchasing: false,   // Purchase processing state
  downloading: false,  // Download processing state
  pagination: {        // Pagination data
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 20,
    totalItems: 0
  },
  filters: {           // Current filters
    search: '',
    genre: 'all',
    book_type: 'all',
    sort: 'newest',
    min_price: '',
    max_price: ''
  }
}
```

### Local State
```javascript
const [showBookModal, setShowBookModal] = useState(false);
const [selectedBook, setSelectedBook] = useState(null);
```

## API Integration

### Actions
- `fetchMarketplaceBooks`: Retrieve books with filters and pagination
- `purchaseBook`: Process book purchase
- `downloadBookPDF`: Download PDF file

### Filter Parameters
```javascript
{
  page: pagination.currentPage,
  per_page: pagination.itemsPerPage,
  search: filters.search,
  genre: filters.genre,
  book_type: filters.book_type,
  sort: filters.sort,
  min_price: filters.min_price,
  max_price: filters.max_price
}
```

## Styling and Design

### CSS Classes
- **Container**: `min-h-screen bg-background`
- **Main Content**: `container mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-24 pb-12`
- **Cards**: `group rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-1`
- **Buttons**: Consistent styling with hover states and disabled styling
- **Responsive**: Grid layouts adapt to screen size (1-4 columns)

### Color Scheme
- **Primary**: Brand primary color
- **Success**: Green for downloads
- **Info**: Blue for external links
- **Gray**: Neutral backgrounds and text

## User Experience Features

### Loading States
- Spinner animation during data fetching
- Disabled buttons during purchase/download operations

### Error Handling
- Toast notifications for purchase/download errors
- Graceful image fallback for missing covers

### Accessibility
- Semantic HTML structure
- Proper button labels and ARIA support
- Keyboard navigation support

### Responsive Design
- Mobile-first approach
- Adaptive grid layouts
- Touch-friendly button sizes

## File Structure

```
src/Component/BookMarketplace/
├── BookMarketplacePage.jsx     # Main page component
├── BookUploadForm.jsx          # Book upload functionality
├── AudiobookSection.jsx        # Audiobook-specific features
├── BookPurchaseFlow.jsx        # Purchase flow logic
└── PaymentIntegration.jsx      # Payment processing
```

## Dependencies

### React Libraries
- `react-redux`: State management
- `react-hot-toast`: Notifications
- `react-icons/fa`: Icon components

### Redux Slice
- `BookMarketplaceSlice`: Actions and reducers for book marketplace

## Usage Example

```jsx
import BookMarketplacePage from './Component/BookMarketplace/BookMarketplacePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/marketplace/books" element={<BookMarketplacePage />} />
      </Routes>
    </Router>
  );
}
```

## Future Enhancements

### Potential Features
- Advanced search with filters combination
- Book recommendations based on user history
- Wishlist functionality
- Book preview/reader integration
- User reviews and ratings
- Advanced sorting options
- Bulk purchase options
- Gift functionality

### Performance Optimizations
- Virtual scrolling for large book lists
- Image lazy loading
- Caching strategies
- Optimized API calls

## Troubleshooting

### Common Issues
1. **Books not loading**: Check API connection and filter parameters
2. **Images not displaying**: Verify image URLs and fallback paths
3. **Purchase failures**: Check payment integration and user authentication
4. **Download issues**: Verify file permissions and API endpoints

### Debug Tips
- Check Redux DevTools for state changes
- Monitor Network tab for API calls
- Verify filter parameters in console
- Check toast notifications for error messages

---

**Last Updated**: January 27, 2026
**Version**: 1.0.0
**Maintainer**: WWA Development Team
