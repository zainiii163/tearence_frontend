import React from 'react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';

const HERO_BG =
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1920&q=80';

const BooksSectionHero = (props) => (
  <BrowseMarketplaceHero
    title="Books"
    titlePrefix="Books"
    eyebrow="Books"
    subtitle="Discover books and authors worldwide"
    imageUrl={HERO_BG}
    theme={getCategoryTheme('books').heroTheme}
    searchPlaceholder="Search by book title or author…"
    templatesHref="/books/templates"
    calculatorsHref="/books/calculators"
    templatesLabel="Templates"
    {...props}
  />
);

export default BooksSectionHero;
