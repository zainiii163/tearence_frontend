import React, { useEffect, useMemo, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import {
  defaultSubForTab,
  getSectionSubItems,
  sectionHasSubNav,
} from './dashboardSectionNav';

/** Business (selling) accordion groups — only tabs present in visibleTabs render */
const BUSINESS_GROUPS = [
  {
    id: 'home',
    label: 'Home',
    tabIds: ['overview', 'team', 'notifications', 'security'],
  },
  {
    id: 'money',
    label: 'Money & reach',
    tabIds: [
      'affiliates',
      'commerce',
      'templates',
      'sponsored',
      'featured',
      'banners',
    ],
  },
  {
    id: 'listings',
    label: 'Your listings',
    tabIds: [
      'buy-sell',
      'business',
      'services',
      'properties',
      'jobs',
      'books',
      'events-venues',
      'resorts-travel',
      'vehicles',
      'funding',
      'donations',
      'store',
      'ads',
    ],
  },
];

/** Basic (buying) accordion groups */
const BUYING_GROUPS = [
  {
    id: 'home',
    label: 'Home',
    tabIds: ['overview', 'notifications', 'security'],
  },
  {
    id: 'shopping',
    label: 'Shopping',
    tabIds: ['purchases', 'commerce'],
  },
  {
    id: 'earn',
    label: 'Earn',
    tabIds: ['affiliates'],
  },
  {
    id: 'career',
    label: 'Career',
    tabIds: ['jobseeker'],
  },
];

function applyBuyingLabels(tabs) {
  return tabs.map((tab) => {
    if (tab.id === 'commerce') return { ...tab, label: 'Digital purchases' };
    if (tab.id === 'affiliates') return { ...tab, label: 'My promotions' };
    return tab;
  });
}

/**
 * Accordion sidebar — groups open, and each section expands to Overview / Table / Create (etc.).
 */
export default function DashboardSidebarNav({
  visibleTabs = [],
  activeTab,
  activeSub = null,
  lockedMode = 'buying',
  isBusinessUser = false,
  sidebarCollapsed = false,
  accountBadgeTitle,
  accountBadgeSubtitle,
  onNavigate,
}) {
  const buying = !isBusinessUser && lockedMode !== 'selling';

  const labeledTabs = useMemo(() => {
    if (!buying) return visibleTabs;
    return applyBuyingLabels(visibleTabs);
  }, [visibleTabs, buying]);

  const tabById = useMemo(() => {
    const map = new Map();
    labeledTabs.forEach((t) => map.set(t.id, t));
    return map;
  }, [labeledTabs]);

  const groups = useMemo(() => {
    const defs = buying ? BUYING_GROUPS : BUSINESS_GROUPS;
    const built = defs
      .map((g) => ({
        ...g,
        tabs: g.tabIds.map((id) => tabById.get(id)).filter(Boolean),
      }))
      .filter((g) => g.tabs.length > 0);

    const covered = new Set(built.flatMap((g) => g.tabs.map((t) => t.id)));
    const orphanTabs = labeledTabs.filter((t) => !covered.has(t.id));
    if (orphanTabs.length) {
      built.push({ id: 'more', label: 'More', tabs: orphanTabs });
    }
    return built;
  }, [buying, tabById, labeledTabs]);

  const groupIdForTab = useMemo(() => {
    const map = {};
    groups.forEach((g) => {
      g.tabs.forEach((t) => {
        map[t.id] = g.id;
      });
    });
    return map;
  }, [groups]);

  const [openGroups, setOpenGroups] = useState(() => {
    const activeGroup = groupIdForTab[activeTab] || groups[0]?.id;
    return activeGroup ? new Set([activeGroup]) : new Set();
  });

  /** Which section parents show nested Overview/Table/Create */
  const [openSections, setOpenSections] = useState(() =>
    activeTab && sectionHasSubNav(activeTab) ? new Set([activeTab]) : new Set()
  );

  useEffect(() => {
    const gid = groupIdForTab[activeTab];
    if (!gid) return;
    setOpenGroups((prev) => {
      if (prev.has(gid)) return prev;
      const next = new Set(prev);
      next.add(gid);
      return next;
    });
  }, [activeTab, groupIdForTab]);

  useEffect(() => {
    if (!activeTab || !sectionHasSubNav(activeTab)) return;
    setOpenSections((prev) => {
      if (prev.has(activeTab)) return prev;
      const next = new Set(prev);
      next.add(activeTab);
      return next;
    });
  }, [activeTab]);

  const toggleGroup = (gid) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(gid)) next.delete(gid);
      else next.add(gid);
      return next;
    });
  };

  const toggleSection = (tabId) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(tabId)) next.delete(tabId);
      else next.add(tabId);
      return next;
    });
  };

  const go = (tabId, sub = null) => {
    onNavigate?.(tabId, sub ? { sub } : {});
  };

  const renderTabRow = (tab) => {
    const children = getSectionSubItems(tab.id, { isBusinessUser: !buying });
    const hasChildren = children.length > 0;
    const sectionOpen = openSections.has(tab.id);
    const isActive = activeTab === tab.id;

    return (
      <div key={tab.id} className="space-y-0.5">
        <div className="flex items-stretch gap-0.5">
          <button
            type="button"
            onClick={() => {
              if (hasChildren) {
                const defaultSub = defaultSubForTab(tab.id, { isBusinessUser: !buying });
                go(tab.id, defaultSub);
                setOpenSections((prev) => new Set(prev).add(tab.id));
              } else {
                go(tab.id);
              }
            }}
            className={`flex-1 flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
              isActive
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4 flex-shrink-0 opacity-90" />
            <span className="text-sm font-medium truncate">{tab.label}</span>
          </button>
          {hasChildren && (
            <button
              type="button"
              aria-label={`${sectionOpen ? 'Collapse' : 'Expand'} ${tab.label}`}
              onClick={() => toggleSection(tab.id)}
              className={`px-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-white/90 hover:bg-white/15'
                  : 'text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <FaChevronDown
                className={`h-3 w-3 transition-transform duration-200 ${
                  sectionOpen ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>
          )}
        </div>

        {hasChildren && (
          <div
            className={`grid transition-[grid-template-rows] duration-200 ease-out ${
              sectionOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="overflow-hidden min-h-0">
              <div className="pl-4 pr-1 pb-1 space-y-0.5 border-l border-white/10 ml-4">
                {children.map((child) => {
                  const childOn = isActive && activeSub === child.id;
                  return (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => go(tab.id, child.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                        childOn
                          ? 'bg-white/15 text-white'
                          : 'text-slate-400 hover:bg-white/10 hover:text-slate-100'
                      }`}
                    >
                      {child.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const accordion = (
    <nav
      className={`flex-1 min-h-0 overflow-y-auto p-3 space-y-2 scrollbar-thin ${
        sidebarCollapsed ? 'lg:hidden' : ''
      }`}
    >
      {(accountBadgeTitle || accountBadgeSubtitle) && (
        <div className="mb-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2">
          {accountBadgeTitle ? (
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              {accountBadgeTitle}
            </p>
          ) : null}
          {accountBadgeSubtitle ? (
            <p className="text-xs text-slate-300 mt-0.5 truncate">{accountBadgeSubtitle}</p>
          ) : null}
        </div>
      )}

      {groups.map((group) => {
        const isOpen = openGroups.has(group.id);
        const hasActive = group.tabs.some((t) => t.id === activeTab);

        return (
          <div key={group.id} className="rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleGroup(group.id)}
              aria-expanded={isOpen}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                hasActive
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.14em]">
                {group.label}
              </span>
              <FaChevronDown
                className={`h-3 w-3 flex-shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden min-h-0">
                <div className="pt-0.5 pb-1 space-y-0.5 pl-1">
                  {group.tabs.map((tab) => renderTabRow(tab))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );

  if (!sidebarCollapsed) {
    return accordion;
  }

  const activeGroupId = groupIdForTab[activeTab];
  const railTabs =
    groups.find((g) => g.id === activeGroupId)?.tabs ||
    groups[0]?.tabs ||
    labeledTabs;

  return (
    <>
      {accordion}
      <nav className="hidden lg:flex flex-1 min-h-0 overflow-y-auto p-2 space-y-0.5 scrollbar-thin flex-col">
        {railTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            title={tab.label}
            onClick={() =>
              go(tab.id, defaultSubForTab(tab.id, { isBusinessUser: !buying }))
            }
            className={`w-full flex items-center justify-center p-2.5 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <tab.icon className="w-5 h-5 flex-shrink-0" />
          </button>
        ))}
      </nav>
    </>
  );
}
