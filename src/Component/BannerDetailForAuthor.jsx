import React from 'react';
import { useParams } from 'react-router-dom';

const BannerDetailForAuthor = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Banner Detail for Author</h1>
        <p className="text-gray-600">Banner ID: {id}</p>
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <p>Banner detail component for author - to be implemented</p>
        </div>
      </div>
    </div>
  );
};

export default BannerDetailForAuthor;
