import React from 'react';
import CreateCommunityForm from './CreateCommunityForm';
import CreateEventForm from './CreateEventForm';
import CreateDiscussionModal from './CreateDiscussionModal';
import CreatePollModal from './CreatePollModal';

const CreationModal = ({ isOpen, onClose, type, onSuccess, data = null }) => {
  if (!isOpen) return null;

  const handleSuccess = (result) => {
    onSuccess?.(result);
    onClose();
  };

  const initialCommunityId =
    data?.community_id ||
    data?.communityId ||
    data?.id ||
    '';

  if (type === 'discussion') {
    return (
      <CreateDiscussionModal
        onClose={onClose}
        onDiscussionCreated={handleSuccess}
        initialCommunityId={initialCommunityId}
      />
    );
  }

  if (type === 'poll') {
    return (
      <CreatePollModal
        onClose={onClose}
        onPollCreated={handleSuccess}
        initialCommunityId={initialCommunityId}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {type === 'community' ? 'Create Community' : 'Create Event'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

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
