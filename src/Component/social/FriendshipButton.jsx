import React, { useEffect, useState, useCallback } from 'react';
import { friendshipsAPI } from '../../api/friendships';

/**
 * Reusable "Add Friend" button that manages the full request lifecycle:
 *   none -> send -> pending (cancel) -> accepted (friends) -> remove
 * For incoming requests (isIncoming) shows Accept / Decline.
 */
const FriendshipButton = ({
  userId,
  friendshipId,
  initialStatus = 'none',
  isIncoming = false,
  onChanged,
  size = 'md',
  className = '',
}) => {
  const [status, setStatus] = useState(initialStatus);
  const [currentFriendshipId, setCurrentFriendshipId] = useState(friendshipId || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sizes = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-sm px-4 py-2',
  };

  const notify = useCallback(
    (nextStatus, id) => {
      setStatus(nextStatus);
      if (id) setCurrentFriendshipId(id);
      onChanged?.({ status: nextStatus, friendshipId: id });
    },
    [onChanged]
  );

  const handleSend = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await friendshipsAPI.sendRequest(userId);
      notify('pending', res?.data?.id);
    } catch (e) {
      setError(e?.response?.data?.message || 'Could not send request.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!currentFriendshipId) return;
    setLoading(true);
    setError('');
    try {
      const res = await friendshipsAPI.acceptRequest(currentFriendshipId);
      notify('accepted', res?.data?.id);
    } catch (e) {
      setError(e?.response?.data?.message || 'Could not accept request.');
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!currentFriendshipId) return;
    setLoading(true);
    setError('');
    try {
      const res = await friendshipsAPI.declineRequest(currentFriendshipId);
      notify('none', res?.data?.id);
    } catch (e) {
      setError(e?.response?.data?.message || 'Could not decline request.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!currentFriendshipId) return;
    setLoading(true);
    setError('');
    try {
      await friendshipsAPI.cancelRequest(currentFriendshipId);
      notify('none', null);
    } catch (e) {
      setError(e?.response?.data?.message || 'Could not cancel request.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!currentFriendshipId) return;
    setLoading(true);
    setError('');
    try {
      await friendshipsAPI.removeFriend(currentFriendshipId);
      notify('none', null);
    } catch (e) {
      setError(e?.response?.data?.message || 'Could not remove friend.');
    } finally {
      setLoading(false);
    }
  };

  const base =
    'rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-1.5 ' +
    (sizes[size] || sizes.md) +
    ' ' +
    className;

  // Incoming request: show Accept / Decline
  if (isIncoming && status === 'pending') {
    return (
      <div className="flex items-center gap-1.5">
        <button onClick={handleAccept} disabled={loading} className={base + ' bg-green-600 hover:bg-green-700 text-white'}>
          Accept
        </button>
        <button onClick={handleDecline} disabled={loading} className={base + ' bg-gray-200 hover:bg-gray-300 text-gray-700'}>
          Decline
        </button>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    );
  }

  let button = null;
  if (status === 'none' || status === 'declined' || status === 'cancelled') {
    button = (
      <button onClick={handleSend} disabled={loading} className={base + ' bg-orange-500 hover:bg-orange-600 text-white'}>
        <span aria-hidden>＋</span> Add Friend
      </button>
    );
  } else if (status === 'pending') {
    button = (
      <button onClick={handleCancel} disabled={loading} className={base + ' bg-gray-200 hover:bg-gray-300 text-gray-700'}>
        Request Sent
      </button>
    );
  } else if (status === 'accepted') {
    button = (
      <button onClick={handleRemove} disabled={loading} className={base + ' bg-emerald-100 hover:bg-red-100 text-emerald-700 hover:text-red-600'}>
        ✓ Friends
      </button>
    );
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      {button}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
};

export default FriendshipButton;
