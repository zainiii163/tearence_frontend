import React, { useEffect, useRef, useState } from 'react';
import { PROPERTY_CONTINENTS } from '../../data/propertyContinents';

const TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

let leafletPromise;

/** Load Leaflet from the bundled package (CSP blocks unpkg.com). */
function loadLeaflet() {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.L) return Promise.resolve(window.L);
  if (!leafletPromise) {
    leafletPromise = Promise.all([
      import('leaflet'),
      import('leaflet/dist/leaflet.css'),
    ]).then(([mod]) => {
      const L = mod.default || window.L;
      if (!L) throw new Error('Leaflet failed to load');
      window.L = L;
      return L;
    });
  }
  return leafletPromise;
}

const formatChange = (n) => {
  const v = Number(n) || 0;
  const sign = v > 0 ? '+' : '';
  return `${sign}${v.toFixed(1)}%`;
};

/**
 * Clive (new.mp4): compact world / continent map.
 * - Animated property market stats (up / down YoY)
 * - Continents clickable strip at bottom of map
 * - Continent focus zooms to that region only (not world)
 * - Optional children (country A–Z) sit under map inside the same frame
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
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const onSelectRef = useRef(onRegionSelect);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const [statIndex, setStatIndex] = useState(0);
  const [statVisible, setStatVisible] = useState(true);

  const isTravel = mode === 'travel';
  const isGeo = mode === 'geo';
  const showMarketStats = !isGeo;
  const regionList = Array.isArray(continents) && continents.length > 0
    ? continents
    : PROPERTY_CONTINENTS;

  const focusRegion =
    regionList.find((c) => c.id === selectedContinentId) || null;

  const statsSource = focusRegion ? [focusRegion] : regionList;
  const activeStat = statsSource[statIndex % Math.max(statsSource.length, 1)];

  useEffect(() => {
    onSelectRef.current = onRegionSelect;
  }, [onRegionSelect]);

  // Rotate continent stats with a brief fade (animated market info)
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

  useEffect(() => {
    let cancelled = false;

    loadLeaflet()
      .then((L) => {
        if (cancelled || !mapRef.current || mapInstance.current) return;

        const map = L.map(mapRef.current, {
          center: [20, 10],
          zoom: 1.4,
          minZoom: 1,
          maxZoom: 8,
          worldCopyJump: true,
          scrollWheelZoom: false,
          attributionControl: true,
          zoomControl: false,
        });

        L.control.zoom({ position: 'topright' }).addTo(map);

        L.tileLayer(TILE_URL, {
          attribution: TILE_ATTR,
          subdomains: 'abcd',
          maxZoom: 19,
        }).addTo(map);

        mapInstance.current = map;
        setReady(true);
        setTimeout(() => map.invalidateSize(), 80);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Map failed to load');
      });

    return () => {
      cancelled = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
      markersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!ready || !mapInstance.current || !window.L) return;
    const L = window.L;
    const map = mapInstance.current;

    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    const regions = focusRegion ? [focusRegion] : regionList;
    const metricLabel = isTravel ? 'Travel demand' : 'Property prices';
    const avgLabel = isTravel ? 'Avg stay' : 'Avg listing';

    regions.forEach((region) => {
      const up = Number(region.marketChange) >= 0;
      const change = formatChange(region.marketChange);
      const pinIcon = L.divIcon({
        className: 'property-map-pin',
        html: isGeo
          ? `<div class="property-map-pin-wrap is-up">
            <span class="property-map-pin-dot"></span>
            <span class="property-map-pin-label">${region.name.split(' ')[0]}</span>
          </div>`
          : `<div class="property-map-pin-wrap ${up ? 'is-up' : 'is-down'}">
            <span class="property-map-pin-dot"></span>
            <span class="property-map-pin-label">${change}</span>
          </div>`,
        iconSize: [52, 28],
        iconAnchor: [26, 14],
      });

      const marker = L.marker([region.lat, region.lng], { icon: pinIcon }).addTo(map);
      marker.bindTooltip(
        isGeo
          ? `<strong>${region.name}</strong><br/>${region.countries?.length || 0} countries`
          : `<strong>${region.name}</strong><br/>${metricLabel} ${change} YoY<br/>${avgLabel} ${region.avgPriceLabel || '—'}`,
        {
          direction: 'top',
          offset: [0, -12],
          className: `property-map-tooltip ${up ? 'is-up' : 'is-down'}`,
          permanent: false,
        }
      );
      marker.on('click', () => {
        onSelectRef.current?.(region);
      });
      markersRef.current.push(marker);
    });

    if (focusRegion?.bounds) {
      map.flyToBounds(focusRegion.bounds, {
        duration: 0.55,
        padding: [8, 8],
        maxZoom: focusRegion.zoom || 4.5,
      });
    } else if (focusRegion) {
      map.flyTo([focusRegion.lat, focusRegion.lng], focusRegion.zoom || 4, {
        duration: 0.55,
      });
    } else {
      map.flyTo([20, 10], 1.4, { duration: 0.45 });
    }

    setTimeout(() => map.invalidateSize(), 100);
  }, [ready, focusRegion, regionList, isTravel, isGeo]);

  // Slightly taller so the world map / continent zoom is readable
  const mapHeight = compact
    ? focusRegion
      ? 'h-[220px] sm:h-[280px] md:h-[320px]'
      : 'h-[230px] sm:h-[290px] md:h-[340px]'
    : 'h-[300px] sm:h-[360px] md:h-[420px]';

  const changeUp = Number(activeStat?.marketChange) >= 0;
  const trendArrow = changeUp ? '▲' : '▼';

  return (
    <div className="property-map-frame mb-3">
      <div className="relative border-b border-[var(--prop-ink)]/10 overflow-hidden bg-[#e8eef2]">
        {!ready && !error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#f3efe6]/80 text-xs text-[var(--prop-ink)]/60">
            Loading map…
          </div>
        )}
        {error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#f3efe6] text-xs text-red-700 px-4 text-center">
            {error}
          </div>
        )}

        {/* Animated YoY statistics (property/travel) — geo mode shows a simple region label */}
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
                  <span
                    key={c.id}
                    className={i === statIndex % regionList.length ? 'is-on' : ''}
                  />
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

        <div ref={mapRef} className={`property-leaflet-map w-full ${mapHeight}`} />
      </div>

      {/* Continents fitted at bottom of the map (clickable) */}
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

      {/* Countries A–Z sit under the map inside the same frame (continent view) */}
      {children && <div className="property-map-countries-slot">{children}</div>}

      <style>{`
        .property-leaflet-map .leaflet-control-attribution {
          font-size: 8px;
          background: rgba(255,255,255,0.8);
        }
        .property-leaflet-map .leaflet-control-zoom a {
          width: 22px !important;
          height: 22px !important;
          line-height: 22px !important;
          font-size: 12px !important;
        }
        .property-map-pin {
          background: transparent !important;
          border: none !important;
        }
        .property-map-pin-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
          animation: property-pin-float 2.6s ease-in-out infinite;
        }
        .property-map-pin-dot {
          display: block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #0c1520;
          border: 2px solid #b8895a;
          box-shadow: 0 0 0 3px rgba(184, 137, 90, 0.25);
        }
        .property-map-pin-wrap.is-up .property-map-pin-dot {
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.25);
        }
        .property-map-pin-wrap.is-down .property-map-pin-dot {
          border-color: #e11d48;
          box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.25);
        }
        .property-map-pin-label {
          font-size: 9px;
          font-weight: 800;
          line-height: 1;
          padding: 1px 4px;
          border-radius: 3px;
          background: rgba(12, 21, 32, 0.88);
          color: #f3efe6;
          white-space: nowrap;
        }
        .property-map-pin-wrap.is-up .property-map-pin-label {
          color: #6ee7b7;
        }
        .property-map-pin-wrap.is-down .property-map-pin-label {
          color: #fda4af;
        }
        @keyframes property-pin-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .property-map-tooltip {
          background: #0c1520 !important;
          color: #f3efe6 !important;
          border: none !important;
          border-radius: 2px !important;
          padding: 4px 8px !important;
          font-size: 11px !important;
          font-weight: 600 !important;
        }
        .property-map-tooltip::before {
          border-top-color: #0c1520 !important;
        }
      `}</style>
    </div>
  );
};

export default PropertyWorldMap;
