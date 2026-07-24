import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { resolveStorageUrl } from '../../utils/dashboardEditMappers';
import {
  getProjectFundingType,
  getFundingTypeLabel,
  getFundingTypeBadgeClass,
} from './fundingConstants';

/** Compact funding campaign card — essential info only. */
const FundingCampaignCard = ({ project }) => {
  const fundingType = getProjectFundingType(project);
  const raised = project.current_funded ?? project.amount_raised ?? project.current_funding ?? 0;
  const goal = project.funding_goal ?? 0;
  const progress = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
  const currency = project.currency || 'USD';
  const currencySymbol = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';

  const image =
    resolveStorageUrl(project.cover_image) || project.cover_image || '/img/NoImage.png';
  const location = [project.city, project.country].filter(Boolean).join(', ');

  return (
    <Link
      to={`/funding/project/${project.id}`}
      className="group flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-emerald-400 hover:shadow-md transition-all"
    >
      <div className="relative h-24 sm:h-28 bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/img/NoImage.png';
          }}
        />
        <span
          className={`absolute top-1 left-1 px-1.5 py-0.5 text-[9px] font-bold uppercase rounded ${getFundingTypeBadgeClass(fundingType)}`}
        >
          {getFundingTypeLabel(fundingType)}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-2 sm:p-2.5">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#02a95c]">
          {project.title}
        </h3>
        {location && (
          <p className="flex items-center gap-0.5 text-[10px] text-gray-500 mt-1 truncate">
            <MapPin className="h-2.5 w-2.5 shrink-0" />
            <span className="truncate">{location}</span>
          </p>
        )}
        <div className="mt-2">
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#02a95c] rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-[10px] sm:text-xs text-gray-600 mt-1">
            <span className="font-bold text-gray-900">
              {currencySymbol}
              {Number(raised).toLocaleString()}
            </span>
            {' of '}
            {currencySymbol}
            {Number(goal).toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default FundingCampaignCard;
