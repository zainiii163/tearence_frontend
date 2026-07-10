import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ChevronRight } from 'lucide-react';
import BooksPostForm from '../Component/books/BooksPostForm';
import BooksFilters from '../Component/books/BooksFilters';
import BooksGrid from '../Component/books/BooksGrid';
import BooksActivityFeed from '../Component/books/BooksActivityFeed';
import BooksHero from '../Component/books/BooksHero';
import GenreExplorerGrid from '../Component/books/GenreExplorerGrid';
import GlobalAuthorSpotlight from '../Component/books/GlobalAuthorSpotlight';
import BooksUpsellSection from '../Component/books/BooksUpsellSection';
import BooksCard from '../Component/books/BooksCard';
import BooksAPI from '../services/booksAPI';
import useAuthRedirect from '../hooks/useAuthRedirect';
import BookDetails from '../Component/books/BookDetails';
import CreateBookForm from '../Component/books/CreateBookForm';
import UnifiedNavbar from '../Component/UnifiedNavbar';

const BooksMarketplace = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [showPostForm, setShowPostForm] = useState(false);
  const [filters, setFilters] = useState({});
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeBooks: 0,
    totalAuthors: 0,
    totalViews: 0,
    totalSaves: 0,
    activeCountries: 0,
  });
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [trendingGenres, setTrendingGenres] = useState([]);
  const [allBooksForSpotlight, setAllBooksForSpotlight] = useState([]);

  useEffect(() => {
    if (searchParams.get('postForm') === 'true') {
      if (isAuthenticated) {
        setShowPostForm(true);
      } else {
        setSearchParams({});
        requireAuth('/books?postForm=true', 'You must be logged in to post a book.');
      }
    }

    const genreParam = searchParams.get('genre');
    if (genreParam) {
      setFilters((prev) => ({ ...prev, genre: genreParam }));
    }

    loadStats();
    loadFeaturedBooks();
    loadTrendingGenres();
    loadSpotlightBooks();
  }, [searchParams]);

  const loadStats = async () => {
    try {
      const response = await BooksAPI.getStatistics();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadFeaturedBooks = async () => {
    try {
      const response = await BooksAPI.getFeaturedBooks({ per_page: 8 });
      if (response.success) {
        setFeaturedBooks(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Failed to load featured books:', error);
    }
  };

  const loadTrendingGenres = async () => {
    try {
      const response = await BooksAPI.getTrendingGenres();
      if (response?.success || response?.data) {
        setTrendingGenres(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Failed to load trending genres:', error);
    }
  };

  const loadSpotlightBooks = async () => {
    try {
      const response = await BooksAPI.getBooks({ per_page: 12 });
      if (response.success) {
        setAllBooksForSpotlight(response.data.items || []);
      }
    } catch (error) {
      console.error('Failed to load spotlight books:', error);
    }
  };

  const genreCounts = useMemo(() => {
    const counts = {};
    trendingGenres.forEach((g) => {
      const name = g.genre || g.name;
      if (name) counts[name] = g.count || 0;
    });
    return counts;
  }, [trendingGenres]);

  const spotlightBooks = useMemo(() => {
    if (featuredBooks.length > 0) return featuredBooks;
    return allBooksForSpotlight;
  }, [featuredBooks, allBooksForSpotlight]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleHeroSearch = (searchData) => {
    const searchParts = [searchData.bookTitle, searchData.authorName].filter(Boolean);
    setFilters({
      search: searchParts.join(' ') || undefined,
      genre: searchData.genre || undefined,
      country: searchData.country || undefined,
    });
    document.getElementById('books-marketplace-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGenreSelect = (genre) => {
    setFilters((prev) => ({ ...prev, genre }));
    document.getElementById('books-marketplace-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewBook = (book) => {
    navigate(`/books/${book.slug}`);
  };

  const handleSaveBook = async (bookId, isSaved) => {
    try {
      await BooksAPI.saveBook(bookId, !isSaved);
    } catch (error) {
      console.error('Failed to save book:', error);
    }
  };

  const handlePostBook = () => {
    if (requireAuth('/books?postForm=true', 'You must be logged in to post a book.')) {
      setShowPostForm(true);
      setSearchParams({ postForm: 'true' });
    }
  };

  const handleClosePostForm = () => {
    setShowPostForm(false);
    setSearchParams({});
    loadStats();
    loadFeaturedBooks();
    loadSpotlightBooks();
  };

  if (showPostForm) {
    return <BooksPostForm onClose={handleClosePostForm} />;
  }

  const isDetailPage = window.location.pathname.includes('/books/')
    && !window.location.pathname.includes('/books/create')
    && !window.location.pathname.includes('/books/dashboard');

  const isCreatePage = window.location.pathname.includes('/books/create')
    || searchParams.get('postForm') === 'true';

  if (isDetailPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton />
        <div className="pt-16">
          <BookDetails />
        </div>
      </div>
    );
  }

  if (isCreatePage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton />
        <div className="pt-16">
          <CreateBookForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <UnifiedNavbar />

      <div className="pt-16">
        {/* 1. Hero — global literary marketplace */}
        <BooksHero onSearch={handleHeroSearch} stats={stats} />

        {/* 2. Genre explorer grid */}
        <GenreExplorerGrid onGenreSelect={handleGenreSelect} genreCounts={genreCounts} />

        {/* 3. Global author spotlight — real books from API */}
        <GlobalAuthorSpotlight books={spotlightBooks.slice(0, 8)} />

        {/* 4. Featured / promoted books carousel */}
        {featuredBooks.length > 0 && (
          <section className="py-12 bg-white border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
                  <Star className="w-7 h-7 text-amber-500 fill-amber-500" />
                  Featured & Promoted Books
                </h2>
                <button
                  type="button"
                  onClick={() => handleFiltersChange({ ...filters, promoted_only: true })}
                  className="text-amber-600 font-semibold flex items-center gap-1 hover:text-amber-700"
                >
                  View all
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredBooks.slice(0, 4).map((book) => (
                  <BooksCard
                    key={book.id}
                    book={book}
                    onView={() => handleViewBook(book)}
                    onSave={handleSaveBook}
                    compact
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. Main browse: filters + activity + book grid */}
        <div id="books-marketplace-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Browse All Books</h2>
            <p className="text-slate-600">
              Filter by genre, country, format, and more — discover your next read from authors worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1 space-y-6">
              <BooksFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onSearch={(term) => handleFiltersChange({ ...filters, search: term })}
                totalCount={stats.activeBooks}
              />
              <BooksActivityFeed compact />
            </aside>

            <div className="lg:col-span-3">
              <BooksGrid
                filters={filters}
                onViewBook={handleViewBook}
                onSaveBook={handleSaveBook}
                showFilters={false}
              />
            </div>
          </div>
        </div>

        {/* 6. Upsell section for authors */}
        <BooksUpsellSection onPostBook={handlePostBook} />
      </div>
    </div>
  );
};

export default BooksMarketplace;
