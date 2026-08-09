import React from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import BooksBrowsePage from '../Component/books/BooksBrowsePage';
import BookDetails from '../Component/books/BookDetails';
import UnifiedNavbar from '../Component/UnifiedNavbar';

const BooksPage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const path = window.location.pathname;

  // Broken CreateBookForm removed — use the real BooksPostForm modal
  if (path.includes('/books/create')) {
    return <Navigate to="/books?postForm=true" replace />;
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

  return <BooksBrowsePage key={searchParams.get('postForm') || 'browse'} />;
};

export default BooksPage;
