import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus } from 'react-icons/fa';
import { communitiesAPI } from '../../api/communities';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';

const CreateDiscussionModal = ({ onClose, onDiscussionCreated, initialCommunityId = '' }) => {
  const { requireAuthModal, isAuthenticated } = useAuthRedirect();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    discussion_type: 'general',
    community_id: initialCommunityId || '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuthModal('/communities', 'You must be logged in to start a discussion.');
      onClose?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- gate once on open
  }, []);

  useEffect(() => {
    if (initialCommunityId) {
      setFormData((prev) =>
        prev.community_id ? prev : { ...prev, community_id: initialCommunityId }
      );
    }
  }, [initialCommunityId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const response = await communitiesAPI.getCommunities({ per_page: 50 });
        const list =
          response?.data?.data ||
          (Array.isArray(response?.data) ? response.data : []) ||
          [];
        if (!cancelled) {
          setCommunities(list);
          // Ensure current community is present even if not in first page
          if (initialCommunityId) {
            const exists = list.some(
              (c) => (c.community_id || c.id) === initialCommunityId
            );
            if (!exists) {
              try {
                const meta = await communitiesAPI.getCommunity(initialCommunityId);
                const community = meta?.data || meta;
                if (community?.community_id || community?.id) {
                  setCommunities((prev) => [community, ...prev]);
                }
              } catch {
                /* ignore */
              }
            }
            setFormData((prev) => ({
              ...prev,
              community_id: prev.community_id || initialCommunityId,
            }));
          }
        }
      } catch (err) {
        console.error('Error loading communities:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialCommunityId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !requireAuthModal('/communities', 'You must be logged in to start a discussion.')
    ) {
      return;
    }
    if (!formData.community_id) {
      setError('Please select a community');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        post_type: 'discussion_thread',
        title: formData.title.trim(),
        content: formData.content.trim(),
        discussion_type: formData.discussion_type || 'general',
        tags: formData.tags,
        community_ids: [formData.community_id],
      };
      const response = await communitiesAPI.createPost(payload);
      onDiscussionCreated?.(response?.data || response);
      onClose?.();
    } catch (err) {
      console.error('Error creating discussion:', err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Could not post discussion. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddTag = () => {
    const t = tagInput.trim().replace(/^#/, '');
    if (t && !formData.tags.includes(t)) {
      setFormData({ ...formData, tags: [...formData.tags, t] });
      setTagInput('');
    }
  };

  const discussionTypes = [
    { id: 'general', label: 'Discussion', icon: '💬' },
    { id: 'question', label: 'Question', icon: '❓' },
    { id: 'review', label: 'Review', icon: '⭐' },
    { id: 'advice', label: 'Advice', icon: '💡' },
  ];

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Start discussion</h2>
            <p className="text-sm text-slate-500">Post to a live community</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-5">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Community *</label>
            {loading ? (
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
            ) : (
              <select
                required
                value={formData.community_id}
                onChange={(e) =>
                  setFormData({ ...formData, community_id: e.target.value })
                }
                className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm"
              >
                <option value="">Select a community</option>
                {communities.map((community) => (
                  <option
                    key={community.community_id || community.id}
                    value={community.community_id || community.id}
                  >
                    {community.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {discussionTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, discussion_type: type.id })
                  }
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                    formData.discussion_type === type.id
                      ? 'bg-teal-600 text-white'
                      : 'border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Title *</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What's on your mind?"
              className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Content *</label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Share more details…"
              rows={5}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tags (Enter)"
                className="flex-1 h-10 rounded-lg border border-slate-200 px-3 text-sm"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="h-10 px-3 rounded-lg border border-slate-200 hover:bg-slate-50"
              >
                <FaPlus className="h-3.5 w-3.5" />
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-medium"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          tags: formData.tags.filter((t) => t !== tag),
                        })
                      }
                    >
                      <FaTimes className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-600 disabled:opacity-50"
            >
              {submitting ? 'Posting…' : 'Post discussion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDiscussionModal;
