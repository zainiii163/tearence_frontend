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
      'fleet',
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
    id: 'publish',
    label: 'Publish',
    tabIds: ['books'],
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
    if (tab.id === 'books') return { ...tab, label: 'My publications' };
    return tab;
  });
}

/**
 * Soft UI accordion sidebar — Magnific-style user panel navigation.
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
            className={`dash-nav-item flex-1 ${isActive ? 'is-active' : ''}`}
          >
            <span className="dash-nav-ico">
              <tab.icon className="w-3.5 h-3.5" />
            </span>
            <span className="truncate">{tab.label}</span>
          </button>
          {hasChildren && (
            <button
              type="button"
              aria-label={`${sectionOpen ? 'Collapse' : 'Expand'} ${tab.label}`}
              onClick={() => toggleSection(tab.id)}
              className={`px-2 rounded-xl transition-colors ${
                isActive
                  ? 'text-[color:var(--dash-accent)] hover:bg-white/10'
                  : 'text-[color:var(--dash-muted)] hover:bg-white/5 hover:text-white'
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
              <div className="pl-3 pr-1 pb-1 space-y-0.5 border-l border-white/10 ml-5">
                {children.map((child) => {
                  const childOn = isActive && activeSub === child.id;
                  return (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => go(tab.id, child.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        childOn
                          ? 'bg-[rgba(142,240,90,0.12)] text-[color:var(--dash-accent)]'
                          : 'text-[color:var(--dash-muted)] hover:bg-white/5 hover:text-white'
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
      className={`flex-1 min-h-0 overflow-y-auto px-2.5 py-2 space-y-2 scrollbar-thin ${
        sidebarCollapsed ? 'lg:hidden' : ''
      }`}
    >
      {(accountBadgeTitle || accountBadgeSubtitle) && (
        <div className="mb-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
          {accountBadgeTitle ? (
            <p className="dash-nav-group-label">{accountBadgeTitle}</p>
          ) : null}
          {accountBadgeSubtitle ? (
            <p className="text-xs text-[color:var(--dash-muted)] mt-0.5 truncate font-medium">
              {accountBadgeSubtitle}
            </p>
          ) : null}
        </div>
      )}

      {groups.map((group) => {
        const isOpen = openGroups.has(group.id);
        const hasActive = group.tabs.some((t) => t.id === activeTab);

        return (
          <div key={group.id} className="rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleGroup(group.id)}
              aria-expanded={isOpen}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-left transition-colors ${
                hasActive ? 'bg-white/5' : 'hover:bg-white/5'
              }`}
            >
              <span className="dash-nav-group-label">{group.label}</span>
              <FaChevronDown
                className={`h-3 w-3 flex-shrink-0 text-[color:var(--dash-muted)] transition-transform duration-200 ${
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
                <div className="pt-0.5 pb-1 space-y-0.5 pl-0.5">
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
      <nav className="hidden lg:flex flex-1 min-h-0 overflow-y-auto p-2 space-y-1 scrollbar-thin flex-col">
        {railTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            title={tab.label}
            onClick={() =>
              go(tab.id, defaultSubForTab(tab.id, { isBusinessUser: !buying }))
            }
            className={`w-full flex items-center justify-center p-2.5 rounded-xl transition-colors ${
              activeTab === tab.id
                ? 'bg-[#036aa1] text-white shadow-md'
                : 'text-[color:var(--dash-muted)] hover:bg-white/5 hover:text-white'
            }`}
          >
            <tab.icon className="w-5 h-5 flex-shrink-0" />
          </button>
        ))}
      </nav>
    </>
  );
}
