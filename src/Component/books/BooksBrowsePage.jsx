import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BooksGrid from './BooksGrid';
import BooksPostForm from './BooksPostForm';
import BooksSectionHero from './BooksSectionHero';
import CompactCategoryChips from '../shared/CompactCategoryChips';
import StandardListingFilters from '../shared/StandardListingFilters';
import CategoryPageShell from '../shared/CategoryPageShell';
import { getCategoryTheme } from '../../constants/categoryThemes';
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
  const theme = getCategoryTheme('books');

  const filterFields = (
    <StandardListingFilters
      filters={pendingFilters}
      onFilterChange={handleFilterChange}
      onApply={applyFilters}
      onClear={isCategoryView ? clearExtraFilters : clearFilters}
      theme={theme.filterTheme}
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

  return (
    <CategoryPageShell
      categoryId="books"
      backHref={isCategoryView ? '/books' : '/'}
      className="bg-slate-50"
      hero={
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
      }
      categoryGrid={
        !isCategoryView ? (
          <CompactCategoryChips
            items={GENRES}
            selectedId={selectedGenreId}
            title="Genres"
            theme={theme.filterTheme}
            initialVisible={16}
            onSelect={(item) => handleGenreSelect(item.id)}
          />
        ) : null
      }
      filterLayoutProps={{
        open: showFilters,
        onOpenChange: setShowFilters,
        onApply: applyFilters,
        onClear: isCategoryView ? clearExtraFilters : clearFilters,
        theme: theme.filterTheme,
        homeHref: '/books',
        filterFields,
        activeCount: activeFilterCount,
        toolbarLeft: (
          <p className="text-sm text-gray-600">{isCategoryView ? categoryLabel : 'All books'}</p>
        ),
      }}
      bottomCta={{
        buttonLabel: 'List your books',
        onPostClick: handlePostBook,
        theme: theme.ctaTheme,
      }}
      afterContent={
        showPostForm ? (
          <BooksPostForm
            onClose={() => {
              setShowPostForm(false);
              setSearchParams({});
            }}
          />
        ) : null
      }
    >
      <BooksGrid filters={activeFilters} onViewBook={handleViewBook} showFilters={false} />
    </CategoryPageShell>
  );
};

export default BooksBrowsePage;
