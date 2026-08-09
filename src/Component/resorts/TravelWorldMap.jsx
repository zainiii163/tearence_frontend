import React from 'react';
import PropertyWorldMap from '../property/PropertyWorldMap';
import { TRAVEL_CONTINENTS } from '../../data/travelContinents';
import '../../styles/property.css';

/**
 * Same real Leaflet + CARTO map as Property — not a fake CSS “world map”.
 */
const TravelWorldMap = ({ onRegionSelect, selectedRegion }) => {
  const selectedId =
    typeof selectedRegion === 'string'
      ? selectedRegion
      : selectedRegion?.id || null;

  return (
    <div
      className="mb-4"
      style={{
        ['--prop-ink']: '#0c1520',
        ['--prop-ink-soft']: '#1a2838',
        ['--prop-stone']: '#f3efe6',
        ['--prop-stone-deep']: '#e8e1d4',
        ['--prop-copper']: '#b8895a',
      }}
    >
      <PropertyWorldMap
        mode="travel"
        continents={TRAVEL_CONTINENTS}
        selectedContinentId={selectedId}
        compact
        onRegionSelect={(region) => {
          if (!region) {
            onRegionSelect?.(null);
            return;
          }
          // Toggle off if same continent clicked again
          if (selectedId && region.id === selectedId) {
            onRegionSelect?.(null);
            return;
          }
          onRegionSelect?.(region.id);
        }}
      />
    </div>
  );
};

export default TravelWorldMap;
