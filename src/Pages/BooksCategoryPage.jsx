import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaBook, FaArrowLeft } from 'react-icons/fa';
import BooksBrowsePage from '../Component/books/BooksBrowsePage';

const BooksCategoryPage = () => {
  const { genreId } = useParams();
  const normalized = genreId?.toLowerCase()?.trim();

  if (!normalized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <FaBook className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-4">Genre Not Found</h1>
          <Link to="/books" className="inline-flex items-center text-amber-600 font-semibold">
            <FaArrowLeft className="mr-2" /> Back to Books
          </Link>
        </div>
      </div>
    );
  }

  return <BooksBrowsePage initialGenreId={normalized} key={normalized} />;
};

export default BooksCategoryPage;
