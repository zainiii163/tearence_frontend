import React from 'react';
import AdvertReportingSystem from '../DetailsPages/AdvertReportingSystem';

/**
 * Report button for any Worldwide Adverts listing detail page.
 * Props: advertId, advertSlug (optional), advertType (optional), onReportSubmitted (optional)
 */
export default function ReportAdvertButton({
  advertId,
  advertSlug,
  advertType,
  onReportSubmitted,
  className = '',
}) {
  if (!advertId && !advertSlug) return null;

  return (
    <div className={className || 'inline-flex'}>
      <AdvertReportingSystem
        advertId={advertId}
        advertSlug={advertSlug || advertType || undefined}
        onReportSubmitted={onReportSubmitted}
      />
    </div>
  );
}
