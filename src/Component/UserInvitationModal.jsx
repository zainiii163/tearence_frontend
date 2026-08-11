import React from "react";
import toast from "react-hot-toast";

const UserInvitationModal = ({
  isOpen,
  onClose,
  email,
  businessName = null,
  storeName = null,
}) => {
  if (!isOpen) return null;

  const baseUrl = window.location.origin;
  const signupUrl = `${baseUrl}/register?email=${encodeURIComponent(email)}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(signupUrl);
      toast.success("Signup link copied");
    } catch {
      toast.error("Could not copy — select the link manually");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Team invite sent</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-700 mb-3">
            <strong>{email}</strong> is not registered yet. We created a pending invite
            {businessName ? (
              <>
                {" "}
                for <strong>{businessName}</strong>
              </>
            ) : null}
            {storeName ? (
              <>
                {" "}
                for store <strong>{storeName}</strong>
              </>
            ) : null}
            .
          </p>

          <p className="text-gray-700 mb-4 text-sm">
            An email was sent with signup + accept links. You can also share this signup link:
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <p className="text-sm text-blue-800 font-medium mb-2">Signup link</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={signupUrl}
                readOnly
                className="flex-1 text-sm bg-white border border-blue-300 rounded px-2 py-1"
              />
              <button
                type="button"
                onClick={copyToClipboard}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            After they register with this email, they open the accept link from the email (or{" "}
            <code className="text-xs">/my-business?invite=…</code>) to join with their role.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={copyToClipboard}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Copy link
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInvitationModal;
