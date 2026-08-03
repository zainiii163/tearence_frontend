import React from 'react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';

const HERO_BG =
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5040?auto=format&fit=crop&w=1920&q=80';

const BooksSectionHero = (props) => (
  <BrowseMarketplaceHero
    title="Books"
    titlePrefix="Books"
    eyebrow="Books"
    subtitle="Discover books and authors worldwide"
    imageUrl={HERO_BG}
    theme="amber"
    searchPlaceholder="Search by book title or author…"
    templatesHref="/books/templates"
    calculatorsHref="/books/calculators"
    templatesLabel="Templates"
    {...props}
  />
);

export default BooksSectionHero;
