import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BooksGrid from './BooksGrid';
import BooksPostForm from './BooksPostForm';
import BooksSectionHero from './BooksSectionHero';
import MarketplaceCategoryCards from '../shared/MarketplaceCategoryCards';
import CompactPremiumReel from '../shared/CompactPremiumReel';
import BrowsePromotionLanes from '../shared/BrowsePromotionLanes';
import StandardListingFilters from '../shared/StandardListingFilters';
import CategoryPageShell from '../shared/CategoryPageShell';
import { getCategoryTheme } from '../../constants/categoryThemes';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import BooksAPI from '../../services/booksAPI';
import { BOOK_GENRES } from '../../utils/bookFormHelpers';
import { pickPremiumForReel, splitListingsByPromotion } from '../../utils/listingPromotionSort';

const slugifyGenre = (name) =>
  String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const fallbackGenres = BOOK_GENRES.map((name) => ({
  id: slugifyGenre(name),
  name,
  count: 0,
}));

const BooksBrowsePage = ({ initialGenreId = null }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [filters, setFilters] = useState({});
  const [pendingFilters, setPendingFilters] = useState({});
  const [showPostForm, setShowPostForm] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [topSearch, setTopSearch] = useState('');
  const [genres, setGenres] = useState([]);
  const [listingBooks, setListingBooks] = useState([]);

  const selectedGenreId = initialGenreId;
  const isCategoryView = Boolean(selectedGenreId);
  const genreMeta =
    genres.find((g) => g.id === selectedGenreId) ||
    fallbackGenres.find((g) => g.id === selectedGenreId) ||
    (selectedGenreId
      ? { id: selectedGenreId, name: selectedGenreId.replace(/-/g, ' ') }
      : null);
  const categoryLabel = genreMeta?.name || null;

  const activeFilters = useMemo(() => {
    const merged = { ...filters };
    if (selectedGenreId) merged.genre = genreMeta?.name || selectedGenreId;
    return merged;
  }, [filters, selectedGenreId, genreMeta?.name]);

  useEffect(() => {
    if (searchParams.get('postForm') === 'true' && isAuthenticated) setShowPostForm(true);
  }, [searchParams, isAuthenticated]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await BooksAPI.getGenres();
        if (cancelled) return;
        const rows = Array.isArray(res?.data) ? res.data : [];
        setGenres(rows.length ? rows : fallbackGenres);
      } catch {
        if (!cancelled) setGenres(fallbackGenres);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Featured reel from the same listing set BooksGrid loads — avoid a second featured API when empty
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await BooksAPI.getBooks({
          per_page: 24,
          page: 1,
          genre: genreMeta?.name || undefined,
        });
        const rows = res?.data?.items || [];
        if (!cancelled) setListingBooks(rows);
      } catch {
        if (!cancelled) setListingBooks([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [genreMeta?.name]);

  const reelItems = useMemo(
    () =>
      pickPremiumForReel(listingBooks, {
        limit: 12,
        allowFallback: false,
      }),
    [listingBooks]
  );

  const { promoted } = useMemo(
    () => splitListingsByPromotion(listingBooks),
    [listingBooks]
  );

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
  const categoryCards = genres.length ? genres : fallbackGenres;

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
      showBackBar
      backBarTo={isCategoryView ? '/books' : '/'}
      backBarLabel={isCategoryView ? 'Back to Books' : 'Back Home'}
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
          <MarketplaceCategoryCards
            categories={categoryCards}
            selectedId={selectedGenreId}
            title="Categories"
            subtitle="Browse books by genre from live listings."
            countLabel="books"
            getId={(c) => c.id}
            getLabel={(c) => c.name}
            getSlug={(c) => c.id}
            getCount={(c) => c.count}
            onSelect={(category, id) => handleGenreSelect(id ?? category.id)}
            accentRing="ring-amber-500"
            accentBorder="border-amber-300"
            hoverBorder="hover:border-amber-200"
            hoverTitle="group-hover:text-amber-800"
            hoverArrow="group-hover:bg-amber-100 group-hover:text-amber-800"
          />
        ) : null
      }
      premiumReel={
        reelItems.length > 0 ? (
          <CompactPremiumReel
            items={reelItems}
            title="Featured"
            variant="books"
            getHref={(item) => `/books/${item.slug || item.id}`}
            accentClass={theme.accentText || 'text-amber-700'}
            borderAccent="hover:border-amber-300"
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
            initialContentKind={searchParams.get('kind') || 'book'}
            onClose={() => {
              setShowPostForm(false);
              setSearchParams({});
            }}
          />
        ) : null
      }
    >
      <BrowsePromotionLanes
        promoted={promoted}
        maxPromoted={9}
        className="mb-4"
        renderGrid={(items) => (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((book) => (
              <button
                key={book.id || book.slug}
                type="button"
                onClick={() => handleViewBook(book)}
                className="text-left rounded-xl border border-gray-200 bg-white p-2 hover:border-amber-300 hover:shadow-sm"
              >
                <p className="text-xs font-bold text-gray-900 line-clamp-2">{book.title}</p>
                <p className="text-[11px] text-amber-700 mt-1">Promoted</p>
              </button>
            ))}
          </div>
        )}
      />
      <BooksGrid filters={activeFilters} onViewBook={handleViewBook} showFilters={false} />
    </CategoryPageShell>
  );
};

export default BooksBrowsePage;
