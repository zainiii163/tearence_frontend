import React, { memo } from 'react';
import { Briefcase } from 'lucide-react';
import { BrowseListingCard, BrowseListingGrid } from '../shared/BrowseListingCard';
import { getJobLogoUrl, normalizeJobForCard } from '../../utils/jobsHelpers';

const badgeFor = (job) => {
  if (job.is_featured || job.featured) return 'Featured';
  if (job.is_sponsored || job.sponsored) return 'Sponsored';
  if (job.is_urgent || job.urgent) return 'Urgent';
  if (job.is_remote || job.remote || job.remote_available) return 'Remote';
  return null;
};

const jobHref = (job) => {
  if (job.slug) return `/jobs/${job.slug}`;
  if (job.id) return `/jobs/${job.id}`;
  return '/jobs';
};

const JobCard = memo(function JobCard({ job }) {
  const normalized = normalizeJobForCard(job);
  const imageUrl =
    getJobLogoUrl(job.company_logo || job.logo_url || job.logo || normalized.logo) || null;

  return (
    <BrowseListingCard
      href={jobHref(job)}
      title={normalized.title || job.title}
      subtitle={normalized.company}
      priceLabel={normalized.salary}
      location={normalized.location}
      imageUrl={imageUrl}
      badge={badgeFor(job) || badgeFor(normalized)}
      ctaLabel="View job"
      compact
      fallbackGradient="from-[#1e3a5f] to-sky-500"
      FallbackIcon={Briefcase}
    />
  );
});

const JobsGrid = ({ jobs = [], loading = false, maxItems = null, emptyMessage = 'No jobs found.' }) => {
  const list = Array.isArray(jobs) ? jobs : [];
  const visible =
    maxItems != null && Number(maxItems) > 0 ? list.slice(0, Number(maxItems)) : list;

  if (loading) {
    return <BrowseListingGrid loading compact columns={3} />;
  }

  if (visible.length === 0) {
    return <BrowseListingGrid emptyMessage={emptyMessage} compact />;
  }

  return (
    <BrowseListingGrid compact columns={3}>
      {visible.map((job) => (
        <JobCard key={job.id ?? job.slug ?? job.title} job={job} />
      ))}
    </BrowseListingGrid>
  );
};

export default JobsGrid;
