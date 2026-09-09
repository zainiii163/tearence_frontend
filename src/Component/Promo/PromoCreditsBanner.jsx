import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiGift } from 'react-icons/fi';
import promoService from '../../services/PromoService';

/**
 * Shows remaining free promoted / featured / sponsored credits from onboarding codes.
 */
const PromoCreditsBanner = ({ className = '' }) => {
  const [totals, setTotals] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await promoService.myCredits();
        if (!cancelled && res?.success) {
          setTotals(res.totals || null);
        }
      } catch {
        /* optional — user may not be authed */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!totals) return null;

  const promoted = Number(totals.promoted || 0);
  const featured = Number(totals.featured || 0);
  const sponsored = Number(totals.sponsored || 0);
  const sum = promoted + featured + sponsored;
  if (sum < 1) return null;

  return (
    <div
      className={`rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950 ${className}`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2 min-w-0">
          <FiGift className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
          <div>
            <p className="font-semibold">Free promotion credits</p>
            <p className="text-xs text-emerald-800/90 mt-0.5">
              {promoted > 0 && <span className="mr-2">Promoted ×{promoted}</span>}
              {featured > 0 && <span className="mr-2">Featured ×{featured}</span>}
              {sponsored > 0 && <span>Sponsored ×{sponsored}</span>}
              <span className="block sm:inline sm:before:content-['·_'] mt-0.5 sm:mt-0">
                Creating a matching post uses one credit automatically (no payment).
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          {promoted > 0 && (
            <Link
              to="/post-promoted-ad"
              className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
            >
              Use promoted
            </Link>
          )}
          {featured > 0 && (
            <Link
              to="/featured-adverts?postForm=true"
              className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-100"
            >
              Use featured
            </Link>
          )}
          {sponsored > 0 && (
            <Link
              to="/sponsored-adverts?postForm=true"
              className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-100"
            >
              Use sponsored
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromoCreditsBanner;
