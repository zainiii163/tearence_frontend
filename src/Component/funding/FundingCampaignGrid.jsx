import React from 'react';
import { resolveStorageUrl } from '../../utils/dashboardEditMappers';
import {
  getProjectFundingType,
  getFundingTypeLabel,
} from './fundingConstants';
import { BrowseListingCard, BrowseListingGrid } from '../shared/BrowseListingCard';

/** Funding campaign cards — same CarServices card size as other category pages. */
const FundingCampaignGrid = ({ campaigns = [], loading }) => {
  if (loading) {
    return <BrowseListingGrid loading />;
  }

  if (!campaigns.length) {
    return (
      <BrowseListingGrid emptyMessage="No funding campaigns found. Try another filter." />
    );
  }

  return (
    <BrowseListingGrid>
      {campaigns.map((project) => {
        const fundingType = getProjectFundingType(project);
        const raised = project.current_funded ?? project.amount_raised ?? project.current_funding ?? 0;
        const goal = project.funding_goal ?? 0;
        const currency = project.currency || 'USD';
        const symbol = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
        const image =
          resolveStorageUrl(project.cover_image) || project.cover_image || null;
        const location = [project.city, project.country].filter(Boolean).join(', ');

        return (
          <BrowseListingCard
            key={project.id}
            href={`/funding/project/${project.id}`}
            title={project.title}
            subtitle={getFundingTypeLabel(fundingType)}
            priceLabel={`${symbol}${Number(raised).toLocaleString()} / ${symbol}${Number(goal).toLocaleString()}`}
            location={location}
            imageUrl={image && image !== '/img/NoImage.png' ? image : null}
            badge={getFundingTypeLabel(fundingType)}
            ctaLabel="View"
            fallbackGradient="from-[#1e3a5f] to-emerald-500"
          />
        );
      })}
    </BrowseListingGrid>
  );
};

export default FundingCampaignGrid;
