import React from "react";

const UserInvitationModal = ({ 
  isOpen, 
  onClose, 
  email, 
  businessName = null, 
  storeName = null 
}) => {
  if (!isOpen) return null;

  const baseUrl = window.location.origin;
  const signupUrl = `${baseUrl}/register?email=${encodeURIComponent(email)}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(signupUrl);
    // You could add a toast notification here
    alert("Signup link copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            User Not Registered
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-700 mb-3">
            The user <strong>{email}</strong> is not registered on WWA yet.
          </p>
          
          <p className="text-gray-700 mb-4">
            Please ask them to sign up first before you can add them to your team.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <p className="text-sm text-blue-800 font-medium mb-2">
              Signup Link:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={signupUrl}
                readOnly
                className="flex-1 text-sm bg-white border border-blue-300 rounded px-2 py-1"
              />
              <button
                onClick={copyToClipboard}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            {businessName && (
              <p>After registration, you can add them to your business "<strong>{businessName}</strong>".</p>
            )}
            {storeName && (
              <p>After registration, you can add them to your store "<strong>{storeName}</strong>".</p>
            )}
            {!businessName && !storeName && (
              <p>After registration, you can add them to your team.</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInvitationModal;
