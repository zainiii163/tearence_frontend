import React, { useEffect, useRef, useState } from 'react';
import { PROPERTY_CONTINENTS } from '../../data/propertyContinents';

const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

function loadLeaflet() {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.L) return Promise.resolve(window.L);

  return new Promise((resolve, reject) => {
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }

    const existing = document.querySelector(`script[src="${LEAFLET_JS}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.L));
      if (window.L) resolve(window.L);
      return;
    }

    const script = document.createElement('script');
    script.src = LEAFLET_JS;
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error('Failed to load Leaflet'));
    document.head.appendChild(script);
  });
}

const formatChange = (n) => {
  const v = Number(n) || 0;
  const sign = v > 0 ? '+' : '';
  return `${sign}${v.toFixed(1)}%`;
};

/**
 * Compact world / continent map with animated property market stats (Clive).
 * Continents strip renders under the map via children / footer slot.
 */
const PropertyWorldMap = ({
  onRegionSelect,
  selectedContinentId = null,
  compact = true,
}) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const onSelectRef = useRef(onRegionSelect);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const [statIndex, setStatIndex] = useState(0);

  const focusRegion =
    PROPERTY_CONTINENTS.find((c) => c.id === selectedContinentId) || null;

  const statsSource = focusRegion ? [focusRegion] : PROPERTY_CONTINENTS;
  const activeStat = statsSource[statIndex % statsSource.length];

  useEffect(() => {
    onSelectRef.current = onRegionSelect;
  }, [onRegionSelect]);

  useEffect(() => {
    const id = setInterval(() => {
      setStatIndex((i) => i + 1);
    }, 3200);
    return () => clearInterval(id);
  }, [statsSource.length]);

  useEffect(() => {
    setStatIndex(0);
  }, [selectedContinentId]);

  useEffect(() => {
    let cancelled = false;

    loadLeaflet()
      .then((L) => {
        if (cancelled || !mapRef.current || mapInstance.current) return;

        const map = L.map(mapRef.current, {
          center: [20, 10],
          zoom: 2,
          minZoom: 2,
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

  // Pins + focus when continent / ready changes
  useEffect(() => {
    if (!ready || !mapInstance.current || !window.L) return;
    const L = window.L;
    const map = mapInstance.current;

    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    const pinIcon = L.divIcon({
      className: 'property-map-pin',
      html: `<span class="property-map-pin-dot"></span>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    const regions = focusRegion ? [focusRegion] : PROPERTY_CONTINENTS;

    regions.forEach((region) => {
      const marker = L.marker([region.lat, region.lng], { icon: pinIcon }).addTo(map);
      const change = formatChange(region.marketChange);
      const up = Number(region.marketChange) >= 0;
      marker.bindTooltip(
        `<strong>${region.name}</strong><br/>Prices ${change} YoY · avg ${region.avgPriceLabel || '—'}`,
        {
          direction: 'top',
          offset: [0, -8],
          className: `property-map-tooltip ${up ? 'is-up' : 'is-down'}`,
          permanent: false,
        }
      );
      marker.on('click', () => {
        onSelectRef.current?.(region);
      });
      markersRef.current.push(marker);
    });

    if (focusRegion) {
      map.flyTo([focusRegion.lat, focusRegion.lng], focusRegion.zoom || 4, {
        duration: 0.55,
      });
    } else {
      map.flyTo([20, 10], 2, { duration: 0.45 });
    }

    setTimeout(() => map.invalidateSize(), 100);
  }, [ready, focusRegion]);

  const mapHeight = compact
    ? focusRegion
      ? 'h-[180px] sm:h-[200px]'
      : 'h-[200px] sm:h-[230px]'
    : 'h-[320px] sm:h-[420px]';

  const changeUp = Number(activeStat?.marketChange) >= 0;

  return (
    <div className="property-map-frame mb-3">
      <div className="relative border border-[var(--prop-ink)]/10 overflow-hidden bg-[#e8eef2]">
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

        {/* Animated market stats overlay (Clive) */}
        {activeStat && (
          <div
            key={`${activeStat.id}-${statIndex}`}
            className={`property-map-stat ${changeUp ? 'is-up' : 'is-down'}`}
          >
            <p className="text-[10px] uppercase tracking-wider opacity-80">
              {focusRegion ? `${focusRegion.name} market` : activeStat.name}
            </p>
            <p className="text-sm font-bold leading-tight mt-0.5">
              Prices {formatChange(activeStat.marketChange)}{' '}
              <span className="font-medium opacity-80">YoY</span>
            </p>
            <p className="text-[11px] mt-0.5 opacity-90">
              Avg listing {activeStat.avgPriceLabel || '—'}
            </p>
          </div>
        )}

        <div ref={mapRef} className={`property-leaflet-map w-full ${mapHeight}`} />
      </div>

      {/* Continents under map (global) — Clive */}
      {!focusRegion && (
        <div className="property-map-continents" role="list">
          {PROPERTY_CONTINENTS.map((region) => {
            const up = Number(region.marketChange) >= 0;
            return (
              <button
                key={region.id}
                type="button"
                role="listitem"
                onClick={() => onSelectRef.current?.(region)}
                className="property-map-continent-chip"
              >
                <span className="font-semibold text-[var(--prop-ink)]">{region.name}</span>
                <span className={`text-[10px] font-bold ${up ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {formatChange(region.marketChange)}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        .property-leaflet-map .leaflet-control-attribution {
          font-size: 9px;
          background: rgba(255,255,255,0.85);
        }
        .property-map-pin {
          background: transparent !important;
          border: none !important;
        }
        .property-map-pin-dot {
          display: block;
          width: 12px;
          height: 12px;
          margin: 2px;
          border-radius: 50%;
          background: #0c1520;
          border: 2px solid #b8895a;
          box-shadow: 0 0 0 3px rgba(184, 137, 90, 0.28);
          animation: property-pin-pulse 2.4s ease-in-out infinite;
        }
        @keyframes property-pin-pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(184, 137, 90, 0.28); }
          50% { box-shadow: 0 0 0 7px rgba(184, 137, 90, 0.08); }
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
