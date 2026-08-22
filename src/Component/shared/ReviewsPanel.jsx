import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import siteReviewsAPI from '../../services/siteReviewsAPI';
import { reviewsAPI } from '../../services/servicesAPI';

const StarRow = ({ value = 0, size = 'md', onSelect = null }) => {
  const sizeClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5';
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= Math.round(Number(value) || 0);
        if (onSelect) {
          return (
            <button
              key={n}
              type="button"
              onClick={() => onSelect(n)}
              className="p-0.5"
              aria-label={`Rate ${n} stars`}
            >
              <FaStar
                className={`${sizeClass} ${
                  active ? 'text-amber-400' : 'text-slate-300'
                } hover:text-amber-400`}
              />
            </button>
          );
        }
        return (
          <FaStar
            key={n}
            className={`${sizeClass} ${active ? 'text-amber-400' : 'text-slate-300'}`}
          />
        );
      })}
    </div>
  );
};

const normalizePayload = (payload) => {
  const root = payload?.data ?? payload ?? {};
  let list =
    root.items ||
    root.data?.data ||
    (Array.isArray(root.data) ? root.data : null) ||
    (Array.isArray(root) ? root : []);
  if (!Array.isArray(list)) list = [];
  return {
    items: list,
    average: Number(root.average_rating ?? root.rating ?? 0) || 0,
    count: Number(root.reviews_count ?? root.total ?? list.length) || 0,
  };
};

/**
 * Shared ratings & reviews panel used across marketplace detail pages.
 */
const ReviewsPanel = ({
  type,
  targetId,
  title = 'Ratings & reviews',
  className = '',
  initialReviews = null,
  initialAverage = 0,
  initialCount = 0,
  compact = false,
}) => {
  const navigate = useNavigate();
  const { logIn, userDetail } = useSelector((s) => s.auth || {});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState(Array.isArray(initialReviews) ? initialReviews : []);
  const [average, setAverage] = useState(Number(initialAverage) || 0);
  const [count, setCount] = useState(Number(initialCount) || 0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const authorName = useMemo(() => {
    const d = userDetail?.data || userDetail || {};
    return (
      [d.first_name, d.last_name].filter(Boolean).join(' ') ||
      d.name ||
      d.email ||
      'Customer'
    );
  }, [userDetail]);

  const load = useCallback(async () => {
    if (!type || targetId == null || targetId === '') {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      if (type === 'service') {
        const payload = await reviewsAPI.getServiceReviews(targetId, { limit: 50 });
        const page = payload?.data ?? payload;
        const list = page?.data || page?.items || (Array.isArray(page) ? page : []);
        const items = Array.isArray(list) ? list : [];
        setReviews(
          items.map((r) => ({
            id: r.id,
            rating: Number(r.rating) || 0,
            comment: r.comment || r.review || '',
            author_name: r.buyer?.name || r.author_name || r.user_name || 'Customer',
            created_at: r.created_at,
          }))
        );
        const avg =
          items.length > 0
            ? items.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / items.length
            : 0;
        setAverage(Math.round(avg * 10) / 10);
        setCount(page?.total ?? items.length);
      } else {
        const payload =
          type === 'business'
            ? await siteReviewsAPI.listBusiness(targetId)
            : await siteReviewsAPI.list(type, targetId);
        const norm = normalizePayload(payload);
        setReviews(norm.items);
        setAverage(norm.average);
        setCount(norm.count);
      }
    } catch {
      if (Array.isArray(initialReviews) && initialReviews.length) {
        setReviews(initialReviews);
        setAverage(Number(initialAverage) || 0);
        setCount(Number(initialCount) || initialReviews.length);
      }
    } finally {
      setLoading(false);
    }
  }, [type, targetId, initialReviews, initialAverage, initialCount]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!logIn) {
      toast.error('Sign in to leave a review');
      navigate('/login');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write a short review');
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        rating: Number(rating),
        comment: comment.trim(),
        author_name: authorName,
      };
      if (type === 'service') {
        await reviewsAPI.createReview(targetId, body);
      } else if (type === 'business') {
        await siteReviewsAPI.createBusiness(targetId, body);
      } else {
        await siteReviewsAPI.create(type, targetId, body);
      }
      toast.success('Thanks — your review was submitted');
      setComment('');
      setRating(5);
      await load();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Could not submit review. Please try again.';
      toast.error(typeof msg === 'string' ? msg : 'Could not submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white ${
        compact ? 'p-4' : 'p-4 sm:p-5'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 text-left">{title}</h3>
          <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
            <StarRow value={average} size="sm" />
            <span className="font-semibold text-slate-800">
              {average > 0 ? average.toFixed(1) : '—'}
            </span>
            <span className="text-slate-400">·</span>
            <span>
              {count} review{count === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-5 rounded-lg border border-slate-100 bg-slate-50/80 p-3 sm:p-4"
      >
        <p className="text-sm font-semibold text-slate-800 mb-2 text-left">Write a review</p>
        <div className="mb-3">
          <StarRow value={rating} onSelect={setRating} />
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={2000}
          placeholder={logIn ? 'Share your experience…' : 'Sign in to leave a review'}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
        />
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : logIn ? 'Submit review' : 'Sign in to review'}
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-slate-500">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-slate-500">No reviews yet. Be the first to leave one.</p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((r, i) => (
            <li
              key={r.id || `${r.author_name}-${i}`}
              className="border-b border-slate-100 pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">
                  {r.author_name || r.user_name || r.buyer?.name || 'Customer'}
                </p>
                <StarRow value={r.rating} size="sm" />
              </div>
              {(r.comment || r.body || r.review) && (
                <p className="text-sm text-slate-600 mt-1 whitespace-pre-line">
                  {r.comment || r.body || r.review}
                </p>
              )}
              {r.created_at && (
                <p className="text-[11px] text-slate-400 mt-1">
                  {new Date(r.created_at).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewsPanel;
