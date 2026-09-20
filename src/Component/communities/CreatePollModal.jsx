import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaTimes, FaPlus, FaTrash, FaPoll, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { communitiesAPI } from '../../api/communities';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';
import { getUserDetails } from '../../slice/AuthSlice';
import AuthService from '../../services/AuthService';

const CreatePollModal = ({ onClose, onPollCreated, initialCommunityId = '' }) => {
  const { requireAuthModal, isAuthenticated } = useAuthRedirect();
  const dispatch = useDispatch();
  const { userDetail } = useSelector((store) => store.auth || {});
  const user = userDetail?.data || userDetail || {};

  const isEmailVerified = Boolean(
    user.email_verified_at ||
    user.email_verified ||
    user.customer?.email_verified_at ||
    user.customer?.email_verified ||
    // Fallback: check localStorage cached user data
    (() => {
      try {
        const cached = JSON.parse(localStorage.getItem('user') || '{}');
        return cached.email_verified_at || cached.email_verified ||
               cached.data?.email_verified_at || cached.data?.email_verified ||
               cached.customer?.email_verified_at || cached.customer?.email_verified;
      } catch { return false; }
    })()
  );
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    community_id: initialCommunityId || '',
    options: ['', ''],
    ends_in_days: '3',
  });
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);

  const handleResendVerification = async () => {
    setResending(true);
    try {
      await AuthService.resendVerificationEmail();
      toast.success('Verification email sent! Check your inbox.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send verification email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuthModal('/communities', 'You must be logged in to create a poll.');
      onClose?.();
      return;
    }
    // Refresh user details on modal open to get latest email_verified status
    dispatch(getUserDetails()).catch(() => {});
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

  const updateOption = (index, value) => {
    setFormData((prev) => {
      const options = [...prev.options];
      options[index] = value;
      return { ...prev, options };
    });
  };

  const addOption = () => {
    setFormData((prev) =>
      prev.options.length >= 6
        ? prev
        : { ...prev, options: [...prev.options, ''] }
    );
  };

  const removeOption = (index) => {
    setFormData((prev) => {
      if (prev.options.length <= 2) return prev;
      return {
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requireAuthModal('/communities', 'You must be logged in to create a poll.')) {
      return;
    }
    const options = formData.options.map((o) => o.trim()).filter(Boolean);
    if (!formData.community_id) {
      setError('Please select a community');
      return;
    }
    if (options.length < 2) {
      setError('Add at least two poll options');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const endsAt = new Date();
      endsAt.setDate(endsAt.getDate() + Number(formData.ends_in_days || 3));

      const payload = {
        post_type: 'discussion_thread',
        discussion_type: 'poll',
        is_poll: true,
        title: formData.title.trim(),
        content: formData.content.trim() || null,
        poll_options: options,
        poll_ends_at: endsAt.toISOString(),
        community_ids: [formData.community_id],
        tags: ['poll'],
      };
      const response = await communitiesAPI.createPost(payload);
      onPollCreated?.(response?.data || response);
      onClose?.();
    } catch (err) {
      console.error('Error creating poll:', err);
      const apiCode = err?.response?.data?.code || '';
      const apiErrors = err?.response?.data?.errors;
      const firstError =
        apiErrors &&
        Object.values(apiErrors)
          .flat()
          .filter(Boolean)[0];
      const apiMessage = firstError || err?.response?.data?.message || err?.message || '';
      if (apiCode === 'EMAIL_NOT_VERIFIED' || apiMessage.toLowerCase().includes('verify')) {
        setError('Your email needs to be verified before you can post. Please verify your email first, then try again.');
      } else {
        setError(apiMessage || 'Could not create poll. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <FaPoll className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Create poll</h2>
              <p className="text-sm text-slate-500">Ask the community to vote</p>
            </div>
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
          {!isEmailVerified && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              <div className="flex items-start gap-3">
                <FaEnvelope className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800">Please verify your email before posting.</p>
                  <p className="text-xs text-amber-600 mt-1">You can still browse and complete your profile.</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={resending}
                      className="text-xs font-semibold text-amber-700 underline hover:text-amber-900 disabled:opacity-50"
                    >
                      {resending ? 'Sending...' : 'Resend verification email'}
                    </button>
                    <Link
                      to="/verify-email"
                      onClick={onClose}
                      className="text-xs font-semibold text-amber-700 underline hover:text-amber-900"
                    >
                      Enter code manually
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
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
            <label className="text-sm font-medium text-slate-700">Question *</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What should we vote on?"
              className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Details <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Add context for voters…"
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Options *</label>
              <button
                type="button"
                onClick={addOption}
                disabled={formData.options.length >= 6}
                className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 disabled:opacity-40"
              >
                <FaPlus className="h-3 w-3" /> Add option
              </button>
            </div>
            <div className="space-y-2">
              {formData.options.map((opt, index) => (
                <div key={`opt-${index}`} className="flex gap-2">
                  <input
                    required
                    type="text"
                    value={opt}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    maxLength={120}
                    className="flex-1 h-10 rounded-lg border border-slate-200 px-3 text-sm"
                  />
                  {formData.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-red-500"
                      aria-label="Remove option"
                    >
                      <FaTrash className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Ends in</label>
            <select
              value={formData.ends_in_days}
              onChange={(e) =>
                setFormData({ ...formData, ends_in_days: e.target.value })
              }
              className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm"
            >
              <option value="1">1 day</option>
              <option value="3">3 days</option>
              <option value="7">7 days</option>
              <option value="14">14 days</option>
            </select>
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
              disabled={submitting || !isEmailVerified}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Posting…' : 'Post poll'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePollModal;
