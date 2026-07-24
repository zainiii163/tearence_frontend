export const FUNDING_REQUEST_TYPES = [
  {
    id: 'all',
    label: 'All campaigns',
    subtitle: 'Browse every funding request',
  },
  {
    id: 'loan',
    label: 'Business loan',
    subtitle: 'Repayable funding for your business',
    emoji: '💰',
  },
  {
    id: 'partnership',
    label: 'Share partnership',
    subtitle: 'Equity or profit-share investment',
    emoji: '🤝',
  },
];

export const getProjectFundingType = (project) => {
  const model = (project.funding_model || '').toLowerCase();
  if (model.includes('loan')) return 'loan';
  if (
    model.includes('equity') ||
    model.includes('partnership') ||
    model.includes('hybrid') ||
    model.includes('share')
  ) {
    return 'partnership';
  }

  const text = [project.title, project.tagline, project.description, project.category]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (/\bloan\b|\bborrow\b|\brepay\b/.test(text)) return 'loan';
  if (/\bpartnership\b|\bequity\b|\bshare\b|\binvestor\b/.test(text)) return 'partnership';

  return 'partnership';
};

export const getFundingTypeLabel = (type) =>
  type === 'loan' ? 'Business loan' : 'Share partnership';

export const getFundingTypeBadgeClass = (type) =>
  type === 'loan'
    ? 'bg-sky-100 text-sky-800 border-sky-200'
    : 'bg-violet-100 text-violet-800 border-violet-200';
