import React, { useEffect, useState, useCallback } from 'react';
import {
  FaBook, FaCheckSquare, FaCalculator, FaFileAlt, FaLightbulb, FaCogs,
  FaSpinner, FaChevronDown, FaChevronRight, FaExternalLinkAlt, FaSearch,
} from 'react-icons/fa';
import api from '../../api';

const TOOL_TYPE_ICONS = {
  guide: FaBook,
  checklist: FaCheckSquare,
  calculator: FaCalculator,
  template: FaFileAlt,
  strategy: FaLightbulb,
  resource: FaCogs,
};

const TOOL_TYPE_LABELS = {
  guide: 'Guides',
  checklist: 'Checklists',
  calculator: 'Calculators',
  template: 'Templates',
  strategy: 'Strategies',
  resource: 'Resources',
};

const CATEGORY_LABELS = {
  property: 'Property',
  vehicles: 'Vehicles',
  jobs: 'Jobs & Employment',
  services: 'Services',
  events: 'Events & Venues',
  resorts: 'Resorts & Travel',
  books: 'Books & Literature',
  'buy-sell': 'Buy & Sell',
  business: 'Business & Stores',
  funding: 'Funding',
  donations: 'Donations',
  adverts: 'Advertising',
};

const MarketingToolkitPanel = () => {
  const [toolkits, setToolkits] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedTools, setExpandedTools] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadToolkits = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/marketing-toolkits');
      const data = response.data?.toolkits || {};
      setToolkits(data);
      setCategories(Object.keys(data).sort());
      if (Object.keys(data).length > 0) {
        setSelectedCategory(Object.keys(data)[0]);
      }
    } catch (error) {
      console.error('Failed to load marketing toolkits:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadToolkits();
  }, [loadToolkits]);

  const toggleTool = (toolId) => {
    setExpandedTools((prev) => ({ ...prev, [toolId]: !prev[toolId] }));
  };

  const renderItems = (items) => {
    if (!items) return null;

    if (Array.isArray(items)) {
      return (
        <ul style={styles.itemList}>
          {items.map((item, i) => (
            <li key={i} style={styles.listItem}>{item}</li>
          ))}
        </ul>
      );
    }

    if (typeof items === 'object') {
      return (
        <div style={styles.itemsContainer}>
          {Object.entries(items).map(([key, value]) => (
            <div key={key} style={styles.itemBlock}>
              <div style={styles.itemKey}>{key.replace(/_/g, ' ')}</div>
              {typeof value === 'string' ? (
                <div style={styles.itemValue}>{value}</div>
              ) : Array.isArray(value) ? (
                <ul style={styles.itemList}>
                  {value.map((v, i) => (
                    <li key={i} style={styles.listItem}>
                      {typeof v === 'object' ? (
                        <div style={styles.nestedObject}>
                          {Object.entries(v).map(([k, val]) => (
                            <div key={k}><strong>{k.replace(/_/g, ' ')}:</strong> {val}</div>
                          ))}
                        </div>
                      ) : v}
                    </li>
                  ))}
                </ul>
              ) : typeof value === 'object' ? (
                <div style={styles.nestedObject}>
                  {Object.entries(value).map(([k, val]) => (
                    <div key={k} style={styles.nestedItem}>
                      <strong>{k.replace(/_/g, ' ')}:</strong> {Array.isArray(val) ? val.join(', ') : String(val)}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      );
    }

    return <div style={styles.itemValue}>{String(items)}</div>;
  };

  const renderToolkitCard = (tool, idx) => {
    const toolId = `${tool.category_slug}-${tool.id || idx}`;
    const isExpanded = expandedTools[toolId];
    const Icon = TOOL_TYPE_ICONS[tool.tool_type] || FaBook;

    return (
      <div key={toolId} style={styles.toolCard}>
        <div
          style={styles.toolHeader}
          onClick={() => toggleTool(toolId)}
        >
          <div style={styles.toolHeaderLeft}>
            <div style={{ ...styles.toolIcon, backgroundColor: getTypeColor(tool.tool_type) }}>
              <Icon size={16} color="#ffffff" />
            </div>
            <div>
              <div style={styles.toolName}>{tool.name}</div>
              <div style={styles.toolTypeBadge}>{TOOL_TYPE_LABELS[tool.tool_type] || tool.tool_type}</div>
            </div>
          </div>
          <div style={styles.expandIcon}>
            {isExpanded ? <FaChevronDown size={14} /> : <FaChevronRight size={14} />}
          </div>
        </div>

        <div style={styles.toolDescription}>{tool.description}</div>

        {isExpanded && tool.items && (
          <div style={styles.toolContent}>
            {renderItems(tool.items)}
          </div>
        )}
      </div>
    );
  };

  const getTypeColor = (type) => {
    const colors = {
      guide: '#3b82f6',
      checklist: '#10b981',
      calculator: '#f59e0b',
      template: '#8b5cf6',
      strategy: '#ec4899',
      resource: '#6b7280',
    };
    return colors[type] || '#6b7280';
  };

  const filteredToolkits = selectedCategory && toolkits[selectedCategory]
    ? toolkits[selectedCategory].filter((tool) =>
        !searchQuery ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const groupedByType = filteredToolkits.reduce((acc, tool) => {
    if (!acc[tool.tool_type]) acc[tool.tool_type] = [];
    acc[tool.tool_type].push(tool);
    return acc;
  }, {});

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <FaSpinner style={styles.spinner} />
        <p>Loading marketing toolkits...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Marketing Toolkits</h2>
        <p style={styles.subtitle}>Category-specific marketing tools, templates, and guides for your business</p>
      </div>

      {/* Category Tabs */}
      <div style={styles.categoryTabs}>
        {categories.map((cat) => (
          <button
            key={cat}
            style={{
              ...styles.categoryTab,
              backgroundColor: selectedCategory === cat ? '#3b82f6' : '#ffffff',
              color: selectedCategory === cat ? '#ffffff' : '#374151',
              borderColor: selectedCategory === cat ? '#3b82f6' : '#e5e7eb',
            }}
            onClick={() => setSelectedCategory(cat)}
          >
            {CATEGORY_LABELS[cat] || cat}
            {toolkits[cat] && (
              <span style={{
                ...styles.tabCount,
                backgroundColor: selectedCategory === cat ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
                color: selectedCategory === cat ? '#ffffff' : '#6b7280',
              }}>
                {toolkits[cat].length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={styles.searchContainer}>
        <FaSearch style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Tools by Type */}
      <div style={styles.toolsContainer}>
        {Object.keys(groupedByType).length === 0 ? (
          <div style={styles.emptyState}>
            <p>No tools found. Try a different search or category.</p>
          </div>
        ) : (
          Object.entries(groupedByType)
            .sort(([a], [b]) => {
              const order = ['guide', 'checklist', 'calculator', 'template', 'strategy', 'resource'];
              return order.indexOf(a) - order.indexOf(b);
            })
            .map(([type, tools]) => (
              <div key={type} style={styles.typeSection}>
                <h3 style={styles.typeTitle}>
                  {React.createElement(TOOL_TYPE_ICONS[type] || FaBook, { size: 18, style: { marginRight: 8 } })}
                  {TOOL_TYPE_LABELS[type] || type}
                  <span style={styles.typeCount}>{tools.length}</span>
                </h3>
                {tools.map((tool, idx) => renderToolkitCard(tool, idx))}
              </div>
            ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '0 0 40px' },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 700, color: '#1f2937', margin: 0 },
  subtitle: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  loadingContainer: { textAlign: 'center', padding: 60, color: '#6b7280' },
  spinner: { fontSize: 32, color: '#3b82f6', animation: 'spin 1s linear infinite', marginBottom: 12 },
  categoryTabs: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  categoryTab: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '8px 14px', borderRadius: 8, border: '1px solid #e5e7eb',
    fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
  },
  tabCount: {
    fontSize: 11, padding: '2px 6px', borderRadius: 10, fontWeight: 600,
  },
  searchContainer: {
    position: 'relative', marginBottom: 24,
  },
  searchIcon: {
    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
    color: '#9ca3af', fontSize: 14,
  },
  searchInput: {
    width: '100%', padding: '10px 12px 10px 36px', borderRadius: 8,
    border: '1px solid #e5e7eb', fontSize: 14, outline: 'none',
    boxSizing: 'border-box',
  },
  toolsContainer: {},
  emptyState: { textAlign: 'center', padding: 40, color: '#6b7280' },
  typeSection: { marginBottom: 32 },
  typeTitle: {
    display: 'flex', alignItems: 'center', fontSize: 16, fontWeight: 600,
    color: '#1f2937', marginBottom: 12, paddingBottom: 8,
    borderBottom: '1px solid #e5e7eb',
  },
  typeCount: {
    marginLeft: 8, fontSize: 12, padding: '2px 8px', borderRadius: 10,
    backgroundColor: '#f3f4f6', color: '#6b7280', fontWeight: 600,
  },
  toolCard: {
    border: '1px solid #e5e7eb', borderRadius: 10, marginBottom: 8,
    backgroundColor: '#ffffff', overflow: 'hidden',
  },
  toolHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 16px', cursor: 'pointer',
  },
  toolHeaderLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  toolIcon: {
    width: 32, height: 32, borderRadius: 8, display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  toolName: { fontSize: 14, fontWeight: 600, color: '#1f2937' },
  toolTypeBadge: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  expandIcon: { color: '#9ca3af' },
  toolDescription: {
    padding: '0 16px 12px', fontSize: 13, color: '#6b7280', lineHeight: 1.5,
  },
  toolContent: {
    padding: '0 16px 16px', borderTop: '1px solid #f3f4f6',
  },
  itemsContainer: { paddingTop: 12 },
  itemBlock: { marginBottom: 16 },
  itemKey: {
    fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'capitalize',
    marginBottom: 6, paddingBottom: 4, borderBottom: '1px solid #f3f4f6',
  },
  itemValue: { fontSize: 13, color: '#4b5563', lineHeight: 1.6 },
  itemList: { margin: '4px 0 0 0', padding: '0 0 0 16px', listStyle: 'disc' },
  listItem: { fontSize: 13, color: '#4b5563', lineHeight: 1.6, marginBottom: 4 },
  nestedObject: { fontSize: 13, color: '#4b5563', lineHeight: 1.6 },
  nestedItem: { marginBottom: 4 },
};

export default MarketingToolkitPanel;
