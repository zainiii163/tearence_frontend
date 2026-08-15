import React, { useEffect, useRef, useState } from 'react';
import { PROPERTY_CONTINENTS } from '../../data/propertyContinents';
import Env from '../../useEnv';

/** Real street-map tiles (Google Maps–like). Multiple providers for reliability. */
const TILE_LAYERS = [
  {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, OpenStreetMap contributors',
    maxZoom: 19,
  },
  {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
    subdomains: 'abc',
  },
  {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19,
    subdomains: 'abcd',
  },
];

let leafletPromise;

/** Load Leaflet from the bundled package (avoids CDN / CSP blocks). */
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
      // Fix default marker icons broken by webpack asset hashing
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
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
 * Real interactive world map (street tiles like Google Maps).
 * Used on Property, Business, Jobs, Travel hubs.
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
  const regionList =
    Array.isArray(continents) && continents.length > 0 ? continents : PROPERTY_CONTINENTS;

  const focusRegion = regionList.find((c) => c.id === selectedContinentId) || null;
  const statsSource = focusRegion ? [focusRegion] : regionList;
  const activeStat = statsSource[statIndex % Math.max(statsSource.length, 1)];
  const googleKey = Env.GoogleApiKey || '';

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

  useEffect(() => {
    let cancelled = false;

    loadLeaflet()
      .then((L) => {
        if (cancelled || !mapRef.current || mapInstance.current) return;

        const map = L.map(mapRef.current, {
          center: [20, 10],
          zoom: 2,
          minZoom: 1,
          maxZoom: 12,
          worldCopyJump: true,
          scrollWheelZoom: false,
          attributionControl: true,
          zoomControl: false,
        });

        L.control.zoom({ position: 'topright' }).addTo(map);

        // Prefer real street imagery; fall through providers if tiles fail
        let layerAdded = false;
        TILE_LAYERS.forEach((cfg, index) => {
          if (layerAdded && index > 0) return;
          const layer = L.tileLayer(cfg.url, {
            attribution: cfg.attribution,
            maxZoom: cfg.maxZoom || 19,
            subdomains: cfg.subdomains,
            errorTileUrl:
              'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
          });
          if (index === 0) {
            layer.addTo(map);
            layerAdded = true;
            layer.on('tileerror', () => {
              // Swap to OSM if Esri tiles are blocked
              if (!map._wwaFallbackTiles) {
                map._wwaFallbackTiles = true;
                map.eachLayer((ly) => {
                  if (ly instanceof L.TileLayer) map.removeLayer(ly);
                });
                const fallback = TILE_LAYERS[1];
                L.tileLayer(fallback.url, {
                  attribution: fallback.attribution,
                  maxZoom: fallback.maxZoom,
                  subdomains: fallback.subdomains,
                }).addTo(map);
              }
            });
          }
        });

        mapInstance.current = map;
        setReady(true);
        setError(null);
        setTimeout(() => map.invalidateSize(), 80);
        setTimeout(() => map.invalidateSize(), 400);
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

    regions.forEach((region) => {
      const up = Number(region.marketChange) >= 0;
      const change = formatChange(region.marketChange);
      const active = selectedContinentId === region.id;
      const pinIcon = L.divIcon({
        className: 'property-map-pin',
        html: isGeo
          ? `<div class="property-map-pin-wrap is-up ${active ? 'is-active' : ''}">
            <span class="property-map-pin-dot"></span>
            <span class="property-map-pin-label">${region.name}</span>
          </div>`
          : `<div class="property-map-pin-wrap ${up ? 'is-up' : 'is-down'} ${active ? 'is-active' : ''}">
            <span class="property-map-pin-dot"></span>
            <span class="property-map-pin-label">${region.name.split(' ')[0]} · ${change}</span>
          </div>`,
        iconSize: [90, 36],
        iconAnchor: [45, 18],
      });

      const marker = L.marker([region.lat, region.lng], { icon: pinIcon }).addTo(map);
      marker.bindTooltip(
        isGeo
          ? `<strong>${region.name}</strong><br/>${region.countries?.length || 0} countries`
          : `<strong>${region.name}</strong><br/>${
              isTravel ? 'Travel demand' : 'Property prices'
            } ${change} YoY<br/>${isTravel ? 'Avg stay' : 'Avg listing'} ${
              region.avgPriceLabel || '—'
            }`,
        {
          direction: 'top',
          offset: [0, -14],
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
        duration: 0.6,
        padding: [24, 24],
        maxZoom: focusRegion.zoom || 4.5,
      });
    } else if (focusRegion) {
      map.flyTo([focusRegion.lat, focusRegion.lng], focusRegion.zoom || 4, {
        duration: 0.6,
      });
    } else {
      map.flyTo([20, 10], 2, { duration: 0.45 });
    }

    setTimeout(() => map.invalidateSize(), 120);
  }, [ready, focusRegion, regionList, isTravel, isGeo, selectedContinentId]);

  const mapHeight = compact
    ? focusRegion
      ? 'h-[240px] sm:h-[300px] md:h-[340px]'
      : 'h-[250px] sm:h-[310px] md:h-[360px]'
    : 'h-[320px] sm:h-[380px] md:h-[440px]';

  const changeUp = Number(activeStat?.marketChange) >= 0;
  const trendArrow = changeUp ? '▲' : '▼';

  // Optional Google Maps embed fallback if Leaflet never becomes ready
  const googleEmbed =
    !ready &&
    error &&
    googleKey &&
    `https://www.google.com/maps/embed/v1/view?key=${googleKey}&center=20,10&zoom=2&maptype=roadmap`;

  return (
    <div className="property-map-frame mb-3">
      <div className="relative border-b border-[var(--prop-ink)]/10 overflow-hidden bg-[#e8eef2]">
        {!ready && !error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#f3efe6]/80 text-xs text-[var(--prop-ink)]/60">
            Loading map…
          </div>
        )}
        {error && !googleEmbed && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#f3efe6] text-xs text-red-700 px-4 text-center">
            {error}
          </div>
        )}

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

        {googleEmbed ? (
          <iframe
            title={ariaLabel}
            src={googleEmbed}
            className={`w-full border-0 ${mapHeight}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <div
            ref={mapRef}
            className={`property-leaflet-map w-full ${mapHeight}`}
            role="img"
            aria-label={ariaLabel}
          />
        )}
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

      <style>{`
        .property-leaflet-map .leaflet-control-attribution {
          font-size: 8px;
          background: rgba(255,255,255,0.85);
        }
        .property-leaflet-map .leaflet-control-zoom a {
          width: 26px !important;
          height: 26px !important;
          line-height: 26px !important;
          font-size: 14px !important;
        }
        .property-map-pin {
          background: transparent !important;
          border: none !important;
        }
        .property-map-pin-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          animation: property-pin-float 2.6s ease-in-out infinite;
        }
        .property-map-pin-dot {
          display: block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #1a73e8;
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.35);
        }
        .property-map-pin-wrap.is-up .property-map-pin-dot {
          background: #059669;
        }
        .property-map-pin-wrap.is-down .property-map-pin-dot {
          background: #e11d48;
        }
        .property-map-pin-wrap.is-active .property-map-pin-dot {
          width: 14px;
          height: 14px;
          box-shadow: 0 0 0 4px rgba(26, 115, 232, 0.35);
        }
        .property-map-pin-label {
          font-size: 10px;
          font-weight: 700;
          line-height: 1.1;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(255,255,255,0.95);
          color: #0c1520;
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 1px 3px rgba(0,0,0,0.12);
          white-space: nowrap;
        }
        @keyframes property-pin-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .property-map-tooltip {
          background: #0c1520 !important;
          color: #f3efe6 !important;
          border: none !important;
          border-radius: 4px !important;
          padding: 6px 10px !important;
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
