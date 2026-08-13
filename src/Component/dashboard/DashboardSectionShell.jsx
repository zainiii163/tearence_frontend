import React, { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  defaultSubForTab,
  getSectionSubItems,
  sectionHasSubNav,
} from './dashboardSectionNav';
import DashboardSectionSubNav from './DashboardSectionSubNav';

/**
 * Wraps a dashboard section with Overview | Table | Create (or custom) sub-nav
 * synced to ?sub= in the URL.
 */
export default function DashboardSectionShell({
  tabId,
  title,
  subtitle,
  isBusinessUser = true,
  stats = [],
  children,
  /** When true, force open create sub once */
  openCreateOnMount = false,
  onCreateOpened,
  /** Render props: ({ sub, requestCreate }) => node — or plain children for table body */
  renderBody,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const hasSub = sectionHasSubNav(tabId);
  const items = useMemo(
    () => getSectionSubItems(tabId, { isBusinessUser }),
    [tabId, isBusinessUser]
  );

  const activeSub =
    searchParams.get('sub') ||
    defaultSubForTab(tabId, { isBusinessUser }) ||
    'table';

  const setSub = useCallback(
    (nextSub) => {
      const next = new URLSearchParams(searchParams);
      if (nextSub) next.set('sub', nextSub);
      else next.delete('sub');
      // create deep-link helper
      if (nextSub === 'create') next.set('create', 'true');
      else next.delete('create');
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  useEffect(() => {
    if (!hasSub) return;
    if (!searchParams.get('sub')) {
      const d = defaultSubForTab(tabId, { isBusinessUser });
      if (d) {
        const next = new URLSearchParams(searchParams);
        next.set('sub', d);
        setSearchParams(next, { replace: true });
      }
    }
  }, [hasSub, tabId, isBusinessUser, searchParams, setSearchParams]);

  useEffect(() => {
    if (openCreateOnMount && hasSub) {
      setSub('create');
      onCreateOpened?.();
    }
  }, [openCreateOnMount, hasSub, setSub, onCreateOpened]);

  if (!hasSub) {
    return children;
  }

  const isListingStyle = items.some((i) => i.id === 'table' || i.id === 'overview');

  return (
    <div className="space-y-4">
      <DashboardSectionSubNav
        title={title}
        subtitle={subtitle}
        items={items}
        activeSub={activeSub}
        onChange={setSub}
      />

      {isListingStyle && activeSub === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Array.isArray(stats) ? stats : []).length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-4 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
              No summary stats yet. Switch to <strong>Table</strong> to manage listings, or{' '}
              <button
                type="button"
                className="text-primary font-semibold hover:underline"
                onClick={() => setSub('create')}
              >
                Create
              </button>{' '}
              a new one.
            </div>
          ) : (
            stats.map((stat, index) => (
              <div
                key={stat.label || index}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5"
              >
                <div className="flex items-center gap-3">
                  {stat.icon ? (
                    <div className={`p-3 rounded-full ${stat.color || 'bg-primary'} text-white`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                  ) : null}
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSub('table')}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Open table
            </button>
            <button
              type="button"
              onClick={() => setSub('create')}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Create new
            </button>
          </div>
        </div>
      )}

      {typeof renderBody === 'function'
        ? renderBody({
            sub: activeSub,
            setSub,
            showTable: !isListingStyle || activeSub === 'table' || activeSub === 'create',
            openCreate: activeSub === 'create' || searchParams.get('create') === 'true',
          })
        : isListingStyle
          ? activeSub === 'table' || activeSub === 'create'
            ? children
            : null
          : children}
    </div>
  );
}
