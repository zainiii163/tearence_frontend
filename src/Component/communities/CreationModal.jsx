import React from 'react';
import CreateCommunityForm from './CreateCommunityForm';
import CreateEventForm from './CreateEventForm';

const CreationModal = ({ isOpen, onClose, type, onSuccess, data = null }) => {
  if (!isOpen) return null;

  const handleSuccess = (result) => {
    onSuccess?.(result);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {type === 'community' ? 'Create Community' : 'Create Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {type === 'community' ? (
            <CreateCommunityForm
              isOpen={isOpen}
              onClose={onClose}
              onSuccess={handleSuccess}
              community={data}
            />
          ) : (
            <CreateEventForm
              isOpen={isOpen}
              onClose={onClose}
              onSuccess={handleSuccess}
              event={data}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreationModal;
