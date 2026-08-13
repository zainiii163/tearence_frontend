import React, { useMemo } from 'react';
import ListingPendingPayAction from './ListingPendingPayAction';
import {
  getListingLifecycleStatus,
  getListingLifecycleClasses,
  formatListingLifecycleLabel,
  isListingAwaitingPayment,
} from '../../utils/dashboardStatsHelpers';

/** Status filter dropdown + pending count chip for any listings table */
export function ListingStatusFilterBar({
  value = 'all',
  onChange,
  items = [],
  id = 'listing-status-filter',
  options = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'expired', label: 'Expired' },
    { value: 'inactive', label: 'Inactive' },
  ],
}) {
  const pendingCount = useMemo(
    () => (Array.isArray(items) ? items.filter((i) => isListingAwaitingPayment(i)).length : 0),
    [items]
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="text-sm text-gray-600" htmlFor={id}>
        Status
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {pendingCount > 0 ? (
        <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
          {pendingCount} awaiting payment
        </span>
      ) : null}
    </div>
  );
}

/** Badge + optional Pay & go live for one row */
export function ListingStatusCell({ item, upsellType, onPaid, amount }) {
  const lifecycle = getListingLifecycleStatus(item);
  const awaiting = isListingAwaitingPayment(item);

  return (
    <div className="flex flex-col gap-2">
      <span
        className={`inline-flex w-fit px-2 text-xs font-semibold rounded-full ${getListingLifecycleClasses(lifecycle)}`}
      >
        {formatListingLifecycleLabel(lifecycle)}
      </span>
      {awaiting ? (
        <ListingPendingPayAction
          item={item}
          upsellType={upsellType}
          amount={amount}
          onPaid={onPaid}
        />
      ) : null}
    </div>
  );
}

export function filterListingsByLifecycle(items, filterStatus) {
  if (!Array.isArray(items)) return [];
  if (!filterStatus || filterStatus === 'all') return items;
  return items.filter((item) => getListingLifecycleStatus(item) === filterStatus);
}

export default ListingStatusCell;
