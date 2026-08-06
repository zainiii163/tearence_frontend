import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

/**
 * Inline back control under heroes / above listings (Clive).
 * Prefer `to` for a known parent; otherwise falls back to history.
 */
const BrowsePageBackBar = ({
  to = null,
  label = 'Back',
  className = '',
}) => {
  const navigate = useNavigate();

  const content = (
    <>
      <FaArrowLeft className="h-3 w-3" />
      <span>{label}</span>
    </>
  );

  const base =
    `inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 ` +
    `bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm hover:bg-slate-50 transition-colors`;

  return (
    <div className={`flex justify-start mb-3 sm:mb-4 ${className}`}>
      {to ? (
        <Link to={to} className={base}>
          {content}
        </Link>
      ) : (
        <button type="button" onClick={() => navigate(-1)} className={base}>
          {content}
        </button>
      )}
    </div>
  );
};

export default BrowsePageBackBar;
