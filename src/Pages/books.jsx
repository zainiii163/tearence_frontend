import React from 'react';
import { useParams } from 'react-router-dom';
import BooksBrowsePage from '../Component/books/BooksBrowsePage';
import BookDetails from '../Component/books/BookDetails';
import CreateBookForm from '../Component/books/CreateBookForm';
import UnifiedNavbar from '../Component/UnifiedNavbar';

const BooksPage = () => {
  const { slug } = useParams();
  const path = window.location.pathname;

  if (path.includes('/books/create')) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton />
        <div className="pt-16">
          <CreateBookForm />
        </div>
      </div>
    );
  }

  if (slug && slug !== 'create' && slug !== 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton />
        <div className="pt-16">
          <BookDetails />
        </div>
      </div>
    );
  }

  return <BooksBrowsePage />;
};

export default BooksPage;
