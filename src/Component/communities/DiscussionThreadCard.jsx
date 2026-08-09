import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaComment,
  FaBookmark,
  FaShare,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaPaperPlane,
  FaHeart,
} from 'react-icons/fa';
import { communitiesAPI } from '../../api/communities';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';

const resolveAuthor = (discussion) => {
  const u = discussion.user || discussion.author || {};
  const name =
    u.name ||
    [u.first_name, u.last_name].filter(Boolean).join(' ').trim() ||
    u.username ||
    null;
  const handle =
    u.username || (u.email ? String(u.email).split('@')[0] : null) || null;
  return {
    name: name || 'Member',
    handle: handle ? `@${String(handle).replace(/^@/, '')}` : null,
    avatar: u.avatar || null,
    initial: (name || 'M').charAt(0).toUpperCase(),
  };
};

const resolveCommunity = (discussion) => {
  if (discussion.community?.name) return discussion.community;
  const primary = discussion.primary_community || discussion.primaryCommunity;
  if (Array.isArray(primary) && primary[0]) return primary[0];
  if (primary?.name) return primary;
  const list = discussion.communities;
  if (Array.isArray(list) && list[0]) return list[0];
  return null;
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  const mins = Math.floor(diff / 60000);
  if (mins > 0) return `${mins}m ago`;
  return 'Just now';
};

const extractComments = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
};

const DiscussionThreadCard = ({ discussion, onSave, onShare }) => {
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [saved, setSaved] = useState(false);
  const [showDiscuss, setShowDiscuss] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [shareBusy, setShareBusy] = useState(false);
  const [toast, setToast] = useState('');
  const [commentCount, setCommentCount] = useState(discussion.comments_count || 0);
  const [shareCount, setShareCount] = useState(discussion.shares_count || 0);
  const [reactions, setReactions] = useState(discussion.reactions_count || 0);
  const [reacted, setReacted] = useState(false);

  const author = resolveAuthor(discussion);
  const community = resolveCommunity(discussion);
  const postId = discussion.post_id || discussion.id;
  const categoryLabel =
    typeof discussion.category === 'string'
      ? discussion.category
      : discussion.category?.name || discussion.discussion_type || null;
  const tags = Array.isArray(discussion.tags) ? discussion.tags : [];
  const cover =
    discussion.cover_image_url ||
    discussion.cover_image ||
    (Array.isArray(discussion.media_urls) && discussion.media_urls[0]) ||
    null;

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  useEffect(() => {
    if (!showDiscuss) return undefined;
    let cancelled = false;
    (async () => {
      setCommentsLoading(true);
      try {
        const res = await communitiesAPI.getComments(postId, { per_page: 30 });
        if (!cancelled) setComments(extractComments(res));
      } catch (e) {
        console.error(e);
        if (!cancelled) setComments([]);
      } finally {
        if (!cancelled) setCommentsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showDiscuss, postId]);

  const handleDiscuss = () => setShowDiscuss((v) => !v);

  const handleReact = async () => {
    if (!requireAuth('/communities', 'You must be logged in to react.')) return;
    try {
      await communitiesAPI.reactToPost(postId, 'like');
      setReacted((prev) => {
        const next = !prev;
        setReactions((r) => Math.max(0, r + (next ? 1 : -1)));
        return next;
      });
    } catch (error) {
      console.error('Error reacting:', error);
      flash('Could not react');
    }
  };

  const handleSave = async () => {
    if (
      !requireAuth(
        '/communities',
        'You must be logged in to save posts.'
      )
    ) {
      return;
    }
    try {
      const res = await communitiesAPI.savePost(postId);
      const removed = String(res?.message || '').toLowerCase().includes('removed');
      setSaved(!removed);
      flash(removed ? 'Removed from saved' : 'Post saved');
      onSave?.(discussion);
    } catch (error) {
      console.error('Error saving discussion:', error);
      flash('Could not save — try again');
    }
  };

  const handleShare = async () => {
    setShareBusy(true);
    try {
      const res = await communitiesAPI.sharePost(postId);
      const url =
        res?.data?.share_url ||
        `${window.location.origin}/communities?post=${postId}`;
      if (res?.data?.shares_count != null) setShareCount(res.data.shares_count);
      else setShareCount((c) => c + 1);

      if (navigator.share) {
        await navigator.share({
          title: discussion.title,
          text: discussion.content || discussion.title,
          url,
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        flash('Link copied');
      } else {
        flash(url);
      }
      onShare?.(discussion);
    } catch (error) {
      if (error?.name === 'AbortError') return;
      console.error('Error sharing:', error);
      const fallback = `${window.location.origin}/communities?post=${postId}`;
      try {
        await navigator.clipboard?.writeText(fallback);
        flash('Link copied');
      } catch {
        flash('Could not share');
      }
    } finally {
      setShareBusy(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e?.preventDefault?.();
    if (!commentText.trim()) return;
    if (
      !requireAuth(
        '/communities',
        'You must be logged in to discuss.'
      )
    ) {
      return;
    }
    setSubmitting(true);
    try {
      const res = await communitiesAPI.createComment({
        post_id: postId,
        content: commentText.trim(),
        comment_type: 'general',
      });
      const created = res?.data || res;
      setComments((prev) => [created, ...prev]);
      setCommentText('');
      setCommentCount((c) => c + 1);
      flash('Comment posted');
    } catch (error) {
      console.error('Error posting comment:', error);
      flash(error?.message || 'Could not post comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article className="communities-post-card">
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-100 to-sky-100 overflow-hidden flex items-center justify-center text-sm font-semibold text-teal-800 shrink-0 communities-avatar-ring">
            {author.avatar ? (
              <img src={author.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              author.initial
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-sm font-semibold text-slate-900">{author.name}</span>
              {author.handle && (
                <span className="text-xs text-slate-400">{author.handle}</span>
              )}
              {discussion.is_verified && (
                <FaCheckCircle className="h-3 w-3 text-teal-500" title="Verified" />
              )}
              {discussion.is_pinned && (
                <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded-md">
                  Pinned
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-1.5 text-xs text-slate-500 mt-0.5">
              {community?.name && (
                <>
                  <Link
                    to={`/community/${community.slug || community.community_id || community.id}`}
                    className="font-medium text-teal-700 hover:text-teal-800 hover:underline"
                  >
                    {community.name}
                  </Link>
                  <span>·</span>
                </>
              )}
              {categoryLabel && (
                <>
                  <span>{categoryLabel}</span>
                  <span>·</span>
                </>
              )}
              {(discussion.location || discussion.country) && (
                <>
                  <span className="inline-flex items-center gap-0.5">
                    <FaMapMarkerAlt className="h-2.5 w-2.5" />
                    {discussion.location || discussion.country}
                  </span>
                  <span>·</span>
                </>
              )}
              <span>{formatTimestamp(discussion.created_at)}</span>
            </div>
          </div>
        </div>

        {cover && (
          <div className="mb-3 rounded-xl overflow-hidden border border-slate-100">
            <img src={cover} alt="" className="w-full h-44 sm:h-52 object-cover" />
          </div>
        )}

        <h3 className="com-display text-[1.05rem] sm:text-lg text-slate-900 leading-snug mb-1.5">
          {discussion.title}
        </h3>
        {discussion.content && (
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-4 mb-3">
            {discussion.content}
          </p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.slice(0, 6).map((tag) => (
              <span key={tag} className="communities-topic-chip">
                #{String(tag).replace(/^#/, '')}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-1 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleReact}
            className={`communities-action-btn ${reacted ? 'text-rose-600' : ''}`}
            aria-pressed={reacted}
          >
            <FaHeart className={`h-3.5 w-3.5 ${reacted ? 'fill-current' : ''}`} />
            Like
            {reactions > 0 && <span className="text-slate-400">{reactions}</span>}
          </button>
          <button
            type="button"
            onClick={handleDiscuss}
            className={`communities-action-btn ${showDiscuss ? 'text-teal-700' : ''}`}
          >
            <FaComment className="h-3.5 w-3.5" />
            Discuss
            {commentCount > 0 && <span className="text-slate-400">{commentCount}</span>}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={`communities-action-btn ${saved ? 'text-teal-700' : ''}`}
          >
            <FaBookmark className={`h-3.5 w-3.5 ${saved ? 'fill-current' : ''}`} />
            {saved ? 'Saved' : 'Save'}
          </button>
          <button
            type="button"
            onClick={handleShare}
            disabled={shareBusy}
            className="communities-action-btn"
          >
            <FaShare className="h-3.5 w-3.5" />
            {shareBusy ? 'Sharing…' : 'Share'}
          </button>

          <div className="ml-auto flex items-center gap-3 text-[11px] text-slate-400">
            {shareCount > 0 && <span>{shareCount} shares</span>}
            {(discussion.views_count || discussion.views || 0) > 0 && (
              <span>{discussion.views_count || discussion.views} views</span>
            )}
          </div>
        </div>

        {toast && <p className="mt-2 text-xs font-medium text-teal-700">{toast}</p>}

        {showDiscuss && (
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
            <form onSubmit={handleSubmitComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  isAuthenticated ? 'Add to the discussion…' : 'Log in to discuss…'
                }
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
              <button
                type="submit"
                disabled={submitting || !commentText.trim()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-600 disabled:opacity-50"
              >
                <FaPaperPlane className="h-3 w-3" />
                {submitting ? '…' : 'Post'}
              </button>
            </form>

            {commentsLoading ? (
              <p className="text-xs text-slate-400">Loading discussion…</p>
            ) : comments.length === 0 ? (
              <p className="text-xs text-slate-400">No comments yet — start the thread.</p>
            ) : (
              <ul className="space-y-2.5 max-h-64 overflow-y-auto hide-scrollbar">
                {comments.map((c) => {
                  const cu = c.user || c.author || {};
                  const cName =
                    cu.name ||
                    [cu.first_name, cu.last_name].filter(Boolean).join(' ') ||
                    'Member';
                  return (
                    <li
                      key={c.comment_id || c.id}
                      className="rounded-lg bg-slate-50/80 px-3 py-2"
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold text-slate-800">{cName}</span>
                        <span className="text-[10px] text-slate-400">
                          {formatTimestamp(c.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{c.content}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default DiscussionThreadCard;
