/**
 * Canonical job categories for browse UI + merge with API.
 * Clive: Science, Agriculture, Professional, Consultancy, Other.
 */
export const FALLBACK_JOB_CATEGORIES = [
  { id: 'technology-it', name: 'Technology & IT', slug: 'technology-it' },
  { id: 'healthcare-medical', name: 'Healthcare & Medical', slug: 'healthcare-medical' },
  { id: 'sales-marketing', name: 'Sales & Marketing', slug: 'sales-marketing' },
  { id: 'finance-accounting', name: 'Finance & Accounting', slug: 'finance-accounting' },
  { id: 'engineering-construction', name: 'Engineering & Construction', slug: 'engineering-construction' },
  { id: 'hospitality-tourism', name: 'Hospitality & Tourism', slug: 'hospitality-tourism' },
  { id: 'retail-customer-service', name: 'Retail & Customer Service', slug: 'retail-customer-service' },
  { id: 'logistics-transport', name: 'Logistics & Transport', slug: 'logistics-transport' },
  { id: 'education-training', name: 'Education & Training', slug: 'education-training' },
  { id: 'creative-media', name: 'Creative & Media', slug: 'creative-media' },
  { id: 'remote-jobs', name: 'Remote Jobs', slug: 'remote-jobs' },
  { id: 'part-time-freelance', name: 'Part-Time & Freelance', slug: 'part-time-freelance' },
  { id: 'science', name: 'Science', slug: 'science' },
  { id: 'agriculture', name: 'Agriculture', slug: 'agriculture' },
  { id: 'professional', name: 'Professional', slug: 'professional' },
  { id: 'consultancy', name: 'Consultancy', slug: 'consultancy' },
  { id: 'other', name: 'Other', slug: 'other' },
];

export const mergeJobCategories = (apiCategories = []) => {
  const bySlug = new Map();
  FALLBACK_JOB_CATEGORIES.forEach((c) => bySlug.set(c.slug, { ...c }));
  (apiCategories || []).forEach((c) => {
    const slug = c.slug || String(c.id);
    bySlug.set(slug, {
      ...bySlug.get(slug),
      ...c,
      slug,
      name: c.name || bySlug.get(slug)?.name || slug,
      id: c.id ?? slug,
    });
  });
  return Array.from(bySlug.values());
};
