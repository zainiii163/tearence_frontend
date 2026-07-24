import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import UnifiedNavbar from '../UnifiedNavbar';
import Footer from '../Footer';
import BooksGrid from './BooksGrid';
import BooksPostForm from './BooksPostForm';
import BooksSectionHero from './BooksSectionHero';
import BrowseBottomPostCta from '../shared/BrowseBottomPostCta';
import BrowseCategoryTemplates from '../shared/BrowseCategoryTemplates';
import StandardListingFilters from '../shared/StandardListingFilters';
import { BrowseFilterLayout } from '../shared/BrowseFilterLayout';
import useAuthRedirect from '../../hooks/useAuthRedirect';

const GENRES = [
  { id: 'fiction', name: 'Fiction' },
  { id: 'non-fiction', name: 'Non-Fiction' },
  { id: 'romance', name: 'Romance' },
  { id: 'thriller', name: 'Thriller' },
  { id: 'mystery', name: 'Mystery' },
  { id: 'fantasy', name: 'Fantasy' },
  { id: 'sci-fi', name: 'Sci-Fi' },
  { id: 'self-help', name: 'Self-Help' },
  { id: 'business', name: 'Business' },
  { id: 'biography', name: 'Biography' },
  { id: 'children', name: "Children's" },
  { id: 'poetry', name: 'Poetry' },
];

const BooksBrowsePage = ({ initialGenreId = null }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [filters, setFilters] = useState({});
  const [pendingFilters, setPendingFilters] = useState({});
  const [showPostForm, setShowPostForm] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [topSearch, setTopSearch] = useState('');

  const selectedGenreId = initialGenreId;
  const isCategoryView = Boolean(selectedGenreId);
  const genreMeta = GENRES.find((g) => g.id === selectedGenreId);
  const categoryLabel = genreMeta?.name || (selectedGenreId ? selectedGenreId.replace(/-/g, ' ') : null);

  const activeFilters = useMemo(() => {
    const merged = { ...filters };
    if (selectedGenreId) merged.genre = genreMeta?.name || selectedGenreId;
    return merged;
  }, [filters, selectedGenreId, genreMeta]);

  useEffect(() => {
    if (searchParams.get('postForm') === 'true' && isAuthenticated) setShowPostForm(true);
  }, [searchParams, isAuthenticated]);

  const handleFilterChange = (key, value) => {
    setPendingFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (typeof value === 'boolean' && !value) delete next[key];
      if ((typeof value === 'string' || typeof value === 'number') && value === '') delete next[key];
      return next;
    });
  };

  const applyFilters = () => setFilters({ ...pendingFilters });

  const clearFilters = () => {
    if (isCategoryView) {
      navigate('/books');
      return;
    }
    setFilters({});
    setPendingFilters({});
    setTopSearch('');
  };

  const clearExtraFilters = () => {
    setFilters({});
    setPendingFilters({});
    setTopSearch('');
  };

  const applyTopSearch = () => {
    const next = { ...pendingFilters, search: topSearch };
    if (!topSearch.trim()) delete next.search;
    setPendingFilters(next);
    setFilters(next);
  };

  const handleGenreSelect = (genreId) => navigate(`/books/category/${genreId}`);

  const handlePostBook = () => {
    const path = selectedGenreId
      ? `/books/category/${selectedGenreId}?postForm=true`
      : '/books?postForm=true';
    if (requireAuth(path, 'You must be logged in to post a book.')) {
      setShowPostForm(true);
      setSearchParams({ postForm: 'true' });
    }
  };

  const handleViewBook = (book) => navigate(`/books/${book.slug}`);

  const filterFields = (
    <StandardListingFilters
      filters={pendingFilters}
      onFilterChange={handleFilterChange}
      onApply={applyFilters}
      onClear={isCategoryView ? clearExtraFilters : clearFilters}
      theme="amber"
      searchPlaceholder="Search books…"
      asPanel={false}
      showActions={false}
      showTitle={false}
    />
  );

  const activeFilterCount = Object.entries(filters).filter(([, v]) => {
    if (typeof v === 'boolean') return v;
    return v !== '' && v != null;
  }).length;

  if (showPostForm) {
    return (
      <BooksPostForm
        onClose={() => {
          setShowPostForm(false);
          setSearchParams({});
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <UnifiedNavbar showBackButton backHref={isCategoryView ? '/books' : '/'} />
      <BooksSectionHero
        categoryLabel={categoryLabel}
        searchValue={topSearch}
        onSearchChange={(e) => setTopSearch(e.target.value)}
        onSearchSubmit={applyTopSearch}
        templatesHref={
          selectedGenreId
            ? `/books/templates?category=${selectedGenreId}&name=${encodeURIComponent(categoryLabel || '')}`
            : '/books/templates'
        }
        calculatorsHref="/books/calculators"
      />

      <div className="page-container py-4 sm:py-6">
        <BrowseFilterLayout
          open={showFilters}
          onOpenChange={setShowFilters}
          onApply={applyFilters}
          onClear={isCategoryView ? clearExtraFilters : clearFilters}
          theme="amber"
          homeHref="/books"
          filterFields={filterFields}
          activeCount={activeFilterCount}
          toolbarLeft={
            <p className="text-sm text-gray-600">{isCategoryView ? categoryLabel : 'All books'}</p>
          }
          toolbarRight={
            <button
              type="button"
              onClick={handlePostBook}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg"
            >
              <FiPlus className="h-3.5 w-3.5" />
              Post book
            </button>
          }
        >
          {!isCategoryView && (
            <div className="mb-6 flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => handleGenreSelect(g.id)}
                  className="px-3 py-1.5 text-xs font-medium rounded-full border border-amber-200 bg-white text-gray-700 hover:border-amber-500 hover:text-amber-800"
                >
                  {g.name}
                </button>
              ))}
            </div>
          )}

          <BooksGrid filters={activeFilters} onViewBook={handleViewBook} showFilters={false} />

          <BrowseCategoryTemplates
            vertical="books"
            categoryKey={selectedGenreId || ''}
            categoryName={categoryLabel || ''}
            theme="amber"
            onBrowseClick={() =>
              navigate(
                selectedGenreId
                  ? `/books/templates?category=${selectedGenreId}&name=${encodeURIComponent(categoryLabel || '')}`
                  : '/books/templates'
              )
            }
            browseLabel="Browse templates"
            sellLabel="Sell a template"
          />

          <BrowseBottomPostCta
            title="Promote your book"
            description="Log in and post — Free, Paid, Featured or Sponsored for top search placement."
            buttonLabel="Post a book"
            onPostClick={handlePostBook}
            theme="amber"
          />
        </BrowseFilterLayout>
      </div>

      <Footer />
    </div>
  );
};

export default BooksBrowsePage;
