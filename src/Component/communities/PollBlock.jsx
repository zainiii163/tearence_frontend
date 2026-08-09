import React, { useMemo, useState } from 'react';
import { FaCheckCircle, FaPoll } from 'react-icons/fa';
import { communitiesAPI } from '../../api/communities';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';

const PollBlock = ({ post, onUpdated }) => {
  const { requireAuth } = useAuthRedirect();
  const postId = post?.post_id || post?.id;
  const [options, setOptions] = useState(
    Array.isArray(post?.poll_options) ? post.poll_options : []
  );
  const [votedId, setVotedId] = useState(post?.user_voted_option_id || null);
  const [total, setTotal] = useState(Number(post?.poll_votes_count) || 0);
  const [open, setOpen] = useState(
    post?.poll_is_open !== false &&
      (!post?.poll_ends_at || new Date(post.poll_ends_at) > new Date())
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const showResults = Boolean(votedId) || !open;

  const percents = useMemo(() => {
    const sum = total || options.reduce((n, o) => n + (Number(o.votes) || 0), 0) || 0;
    return options.map((o) => {
      const votes = Number(o.votes) || 0;
      return sum > 0 ? Math.round((votes / sum) * 100) : 0;
    });
  }, [options, total]);

  const handleVote = async (optionId) => {
    if (!requireAuth('/communities', 'Log in to vote on polls.')) return;
    if (!open || busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await communitiesAPI.voteOnPoll(postId, optionId);
      const data = res?.data || res;
      if (Array.isArray(data?.poll_options)) setOptions(data.poll_options);
      setVotedId(data?.user_voted_option_id || optionId);
      setTotal(Number(data?.poll_votes_count) || 0);
      if (typeof data?.poll_is_open === 'boolean') setOpen(data.poll_is_open);
      onUpdated?.(data);
    } catch (e) {
      setError(
        e?.response?.data?.message || e?.message || 'Could not record vote'
      );
    } finally {
      setBusy(false);
    }
  };

  if (!options.length) return null;

  return (
    <div className="social-poll mt-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-teal-700">
          <FaPoll className="h-3 w-3" /> Poll
        </span>
        <span className="text-[11px] text-slate-500">
          {total} vote{total === 1 ? '' : 's'}
          {!open ? ' · Ended' : ''}
        </span>
      </div>

      <div className="space-y-2">
        {options.map((opt, i) => {
          const id = opt.id || `opt_${i + 1}`;
          const selected = votedId === id;
          const pct = percents[i] || 0;

          if (showResults) {
            return (
              <button
                key={id}
                type="button"
                disabled={!open || busy}
                onClick={() => handleVote(id)}
                className={`social-poll-option is-result${
                  selected ? ' is-selected' : ''
                }`}
              >
                <span
                  className="social-poll-fill"
                  style={{ width: `${pct}%` }}
                  aria-hidden="true"
                />
                <span className="relative z-[1] flex w-full items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
                    {selected && <FaCheckCircle className="h-3 w-3 text-teal-600" />}
                    {opt.text}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">{pct}%</span>
                </span>
              </button>
            );
          }

          return (
            <button
              key={id}
              type="button"
              disabled={busy}
              onClick={() => handleVote(id)}
              className="social-poll-option"
            >
              {opt.text}
            </button>
          );
        })}
      </div>

      {error && <p className="mt-2 text-[11px] text-red-600">{error}</p>}
    </div>
  );
};

export default PollBlock;
