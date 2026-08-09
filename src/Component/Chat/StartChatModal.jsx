import React, { useState } from 'react';
import { chatService } from '../../services/chatService';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';

const StartChatModal = ({ isOpen, onClose, sellerId, sellerName, listing = null }) => {
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const defaultSubject = listing
    ? `Inquiry about${listing.category ? ` [${listing.category}]` : ''}: ${listing.title}`
    : 'General Inquiry';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !sellerId) return;

    try {
      setLoading(true);
      setError(null);

      const conversationData = {
        seller_id: sellerId,
        listing_id: listing?.listing_id || null,
        listing_type: listing?.listing_type || listing?.category || null,
        listing_title: listing?.title || null,
        category: listing?.category || null,
        subject: subject.trim() || defaultSubject,
        initial_message: message.trim(),
      };

      const response = await chatService.startConversation(conversationData);

      if (response.success) {
        onClose(response.data.conversation_id);
        setMessage('');
        setSubject('');
      } else {
        setError(response.message || 'Failed to start conversation');
      }
    } catch (err) {
      const apiMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to start conversation';
      setError(apiMessage);
      console.error('Error starting conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
      <div className="bg-card rounded-lg border border-border shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Live Chat</h2>
            <button
              type="button"
              onClick={() => onClose()}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-muted rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-1">To:</p>
            <p className="font-medium text-foreground">{sellerName || 'Seller'}</p>
            {listing && (
              <div className="mt-3">
                <p className="text-sm text-muted-foreground mb-1">Regarding:</p>
                <p className="text-sm font-medium text-primary">
                  {listing.category ? `[${listing.category}] ` : ''}
                  {listing.title}
                </p>
              </div>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              Your message opens a live chat. Both of you can reply anytime from Messages.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium text-foreground">
                Subject (Optional)
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={defaultSubject}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-foreground">
                Message *
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                disabled={loading}
                required
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => onClose()}
                className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!message.trim() || loading}
                className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <FaPaperPlane className="mr-2 h-4 w-4" />
                    Start Live Chat
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StartChatModal;
