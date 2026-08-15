import React, { useEffect, useRef, useState } from 'react';
import { PROPERTY_CONTINENTS } from '../../data/propertyContinents';

const formatChange = (n) => {
  const v = Number(n) || 0;
  const sign = v > 0 ? '+' : '';
  return `${sign}${v.toFixed(1)}%`;
};

/** viewBox zoom when a continent is selected (no tile CDN / Leaflet). */
const REGION_VIEWBOX = {
  world: '0 0 1000 520',
  'north-america': '20 20 320 300',
  'south-america': '140 230 200 270',
  europe: '390 50 200 170',
  africa: '400 150 220 290',
  'middle-east': '510 130 160 150',
  asia: '530 30 360 250',
  oceania: '750 260 220 180',
};

const CONTINENT_SHAPES = [
  {
    id: 'north-america',
    d: 'M78 92 C140 38 230 48 268 118 C292 168 252 228 208 258 C162 282 118 248 88 204 C48 152 38 112 78 92 Z',
  },
  {
    id: 'south-america',
    d: 'M198 268 C248 278 278 338 268 412 C256 468 214 478 192 432 C172 378 170 318 198 268 Z',
  },
  {
    id: 'europe',
    d: 'M428 88 C486 62 528 88 538 128 C526 162 478 168 444 152 C412 132 408 102 428 88 Z',
  },
  {
    id: 'africa',
    d: 'M448 178 C528 164 568 228 558 318 C546 402 486 438 452 392 C418 338 408 238 448 178 Z',
  },
  {
    id: 'middle-east',
    d: 'M538 158 C592 146 628 178 616 218 C594 242 552 232 538 198 Z',
  },
  {
    id: 'asia',
    d: 'M562 68 C692 32 838 78 868 158 C854 228 742 248 678 214 C618 178 558 138 562 68 Z',
  },
  {
    id: 'oceania',
    d: 'M788 308 C868 284 928 328 908 378 C866 412 802 398 788 352 Z',
  },
];

/**
 * Clickable world map that never depends on external map tiles.
 * Leaflet/Carto tiles were blocked or hung on “Loading map…”.
 */
const PropertyWorldMap = ({
  onRegionSelect,
  selectedContinentId = null,
  compact = true,
  children = null,
  /** 'property' | 'travel' | 'geo' — geo = continent/country browse without market YoY stats */
  mode = 'property',
  continents = null,
  ariaLabel = 'Browse by continent',
}) => {
  const onSelectRef = useRef(onRegionSelect);
  const [statIndex, setStatIndex] = useState(0);
  const [statVisible, setStatVisible] = useState(true);

  const isTravel = mode === 'travel';
  const isGeo = mode === 'geo';
  const showMarketStats = !isGeo;
  const regionList =
    Array.isArray(continents) && continents.length > 0 ? continents : PROPERTY_CONTINENTS;

  const focusRegion = regionList.find((c) => c.id === selectedContinentId) || null;
  const statsSource = focusRegion ? [focusRegion] : regionList;
  const activeStat = statsSource[statIndex % Math.max(statsSource.length, 1)];
  const viewBox = REGION_VIEWBOX[selectedContinentId] || REGION_VIEWBOX.world;

  useEffect(() => {
    onSelectRef.current = onRegionSelect;
  }, [onRegionSelect]);

  useEffect(() => {
    if (!showMarketStats || statsSource.length <= 1) return undefined;
    const id = setInterval(() => {
      setStatVisible(false);
      setTimeout(() => {
        setStatIndex((i) => i + 1);
        setStatVisible(true);
      }, 280);
    }, 3200);
    return () => clearInterval(id);
  }, [statsSource.length, selectedContinentId, showMarketStats]);

  useEffect(() => {
    setStatIndex(0);
    setStatVisible(true);
  }, [selectedContinentId]);

  const mapHeight = compact
    ? focusRegion
      ? 'h-[220px] sm:h-[280px] md:h-[320px]'
      : 'h-[230px] sm:h-[290px] md:h-[340px]'
    : 'h-[300px] sm:h-[360px] md:h-[420px]';

  const changeUp = Number(activeStat?.marketChange) >= 0;
  const trendArrow = changeUp ? '▲' : '▼';

  const selectRegion = (id) => {
    const region = regionList.find((c) => c.id === id);
    if (region) onSelectRef.current?.(region);
  };

  return (
    <div className="property-map-frame mb-3">
      <div className="relative border-b border-[var(--prop-ink)]/10 overflow-hidden bg-[#d7e4ee]">
        {activeStat && showMarketStats && (
          <div
            className={`property-map-stat ${changeUp ? 'is-up' : 'is-down'} ${
              statVisible ? 'is-shown' : 'is-hidden'
            }`}
            aria-live="polite"
          >
            <p className="property-map-stat-eyebrow">
              {focusRegion
                ? `${focusRegion.name} ${isTravel ? 'travel' : 'market'}`
                : isTravel
                  ? 'Live travel pulse'
                  : 'Live market pulse'}
            </p>
            <p className="property-map-stat-title">{activeStat.name}</p>
            <p className="property-map-stat-change">
              <span className="property-map-stat-arrow" aria-hidden="true">
                {trendArrow}
              </span>
              {isTravel ? 'Demand' : 'Prices'} {formatChange(activeStat.marketChange)}{' '}
              <span className="opacity-75 font-medium">YoY</span>
            </p>
            <p className="property-map-stat-avg">
              {isTravel ? 'Avg stay' : 'Avg listing'} {activeStat.avgPriceLabel || '—'}
            </p>
            {!focusRegion && (
              <div className="property-map-stat-dots" aria-hidden="true">
                {regionList.map((c, i) => (
                  <span key={c.id} className={i === statIndex % regionList.length ? 'is-on' : ''} />
                ))}
              </div>
            )}
          </div>
        )}
        {isGeo && focusRegion && (
          <div className="property-map-stat is-up is-shown" aria-live="polite">
            <p className="property-map-stat-eyebrow">Selected region</p>
            <p className="property-map-stat-title">{focusRegion.name}</p>
            <p className="property-map-stat-avg">
              {focusRegion.countries?.length || 0} countries — pick one below
            </p>
          </div>
        )}

        <svg
          viewBox={viewBox}
          className={`w-full ${mapHeight} transition-[viewBox] duration-500`}
          role="img"
          aria-label={ariaLabel}
        >
          <rect width="1000" height="520" fill="#cfe0ea" />
          {CONTINENT_SHAPES.map((shape) => {
            const region = regionList.find((c) => c.id === shape.id);
            if (!region) return null;
            const active = selectedContinentId === shape.id;
            const [labelX, labelY] = {
              'north-america': [168, 150],
              'south-america': [228, 360],
              europe: [478, 118],
              africa: [498, 290],
              'middle-east': [582, 188],
              asia: [720, 130],
              oceania: [848, 348],
            }[shape.id] || [0, 0];
            return (
              <g
                key={shape.id}
                className="cursor-pointer"
                onClick={() => selectRegion(shape.id)}
              >
                <path
                  d={shape.d}
                  fill={active ? '#1e3a5f' : '#8aa4b5'}
                  stroke={active ? '#b8895a' : '#f8fafc'}
                  strokeWidth={active ? 3 : 1.5}
                  className="transition-colors duration-200 hover:fill-[#5b7c90]"
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  className="pointer-events-none select-none"
                  fill={active ? '#fff' : '#0c1520'}
                  fontSize="13"
                  fontWeight="700"
                >
                  {region.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="property-map-continents" role="list" aria-label={ariaLabel}>
        {regionList.map((region) => {
          const up = Number(region.marketChange) >= 0;
          const active = selectedContinentId === region.id;
          return (
            <button
              key={region.id}
              type="button"
              role="listitem"
              aria-pressed={active}
              onClick={() => onSelectRef.current?.(region)}
              className={`property-map-continent-chip ${active ? 'is-active' : ''}`}
            >
              <span className="font-semibold">{region.name}</span>
              {showMarketStats ? (
                <span
                  className={`text-[10px] font-bold tabular-nums ${
                    active ? 'opacity-90' : up ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {formatChange(region.marketChange)}
                </span>
              ) : (
                <span className={`text-[10px] tabular-nums ${active ? 'opacity-90' : 'text-slate-500'}`}>
                  {region.countries?.length || 0}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {children && <div className="property-map-countries-slot">{children}</div>}
    </div>
  );
};

export default PropertyWorldMap;
