import React, { useEffect, useRef, useState } from 'react';

const REGIONS = [
  {
    id: 'europe',
    name: 'Europe',
    lat: 50.5,
    lng: 10,
    cities: ['London', 'Paris', 'Berlin', 'Madrid', 'Rome'],
  },
  {
    id: 'north-america',
    name: 'North America',
    lat: 39.8,
    lng: -98.5,
    cities: ['New York', 'Los Angeles', 'Toronto', 'Miami', 'Vancouver'],
  },
  {
    id: 'asia',
    name: 'Asia',
    lat: 34,
    lng: 100,
    cities: ['Tokyo', 'Singapore', 'Hong Kong', 'Shanghai', 'Seoul'],
  },
  {
    id: 'middle-east',
    name: 'Middle East',
    lat: 25,
    lng: 45,
    cities: ['Dubai', 'Abu Dhabi', 'Riyadh', 'Doha', 'Tel Aviv'],
  },
  {
    id: 'africa',
    name: 'Africa',
    lat: 2,
    lng: 20,
    cities: ['Cape Town', 'Nairobi', 'Lagos', 'Cairo', 'Marrakech'],
  },
  {
    id: 'south-america',
    name: 'South America',
    lat: -15,
    lng: -58,
    cities: ['São Paulo', 'Buenos Aires', 'Rio', 'Lima', 'Bogotá'],
  },
  {
    id: 'oceania',
    name: 'Oceania',
    lat: -25,
    lng: 135,
    cities: ['Sydney', 'Melbourne', 'Auckland', 'Brisbane', 'Perth'],
  },
];

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

/**
 * Real interactive world map (OpenStreetMap / CARTO Voyager via Leaflet CDN).
 * Click a region pin to filter property listings by that location.
 */
const PropertyWorldMap = ({ onLocationSelect }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const onSelectRef = useRef(onLocationSelect);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    onSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

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
        });

        L.tileLayer(TILE_URL, {
          attribution: TILE_ATTR,
          subdomains: 'abcd',
          maxZoom: 19,
        }).addTo(map);

        const pinIcon = L.divIcon({
          className: 'property-map-pin',
          html: `<span class="property-map-pin-dot"></span>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

        REGIONS.forEach((region) => {
          const marker = L.marker([region.lat, region.lng], { icon: pinIcon }).addTo(map);
          marker.bindTooltip(region.name, {
            direction: 'top',
            offset: [0, -10],
            className: 'property-map-tooltip',
          });
          marker.on('click', () => {
            setSelected(region);
            onSelectRef.current?.(region.name);
            map.flyTo([region.lat, region.lng], 4, { duration: 0.8 });
          });
        });

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
    };
  }, []);

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6 bg-transparent">
      <div className="text-center mb-5">
        <p className="prop-label text-[var(--prop-copper)] mb-1">Global map</p>
        <h2 className="prop-display text-2xl sm:text-3xl text-[var(--prop-ink)] mb-1">
          Explore properties worldwide
        </h2>
        <p className="text-sm text-[var(--prop-ink)]/55 max-w-2xl mx-auto">
          Click a region pin to filter listings by location
        </p>
      </div>

      <div className="relative border border-[var(--prop-ink)]/10 overflow-hidden bg-[#e8eef2]">
        {!ready && !error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#f3efe6]/80 text-sm text-[var(--prop-ink)]/60">
            Loading map…
          </div>
        )}
        {error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#f3efe6] text-sm text-red-700 px-4 text-center">
            {error}
          </div>
        )}
        <div ref={mapRef} className="property-leaflet-map w-full h-[320px] sm:h-[420px]" />
      </div>

      {selected && (
        <div className="mt-4 border border-[var(--prop-ink)]/10 bg-white/80 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="prop-label text-[var(--prop-copper)] mb-0.5">Selected region</p>
              <h3 className="prop-display text-xl text-[var(--prop-ink)]">{selected.name}</h3>
            </div>
            <button
              type="button"
              onClick={() => onLocationSelect?.(selected.name)}
              className="px-4 py-2 text-sm font-semibold bg-[var(--prop-ink)] text-white hover:bg-[var(--prop-ink-soft)]"
            >
              View properties in {selected.name}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {selected.cities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => onLocationSelect?.(city)}
                className="px-2.5 py-1 text-xs font-medium border border-[var(--prop-ink)]/15 bg-white hover:border-[var(--prop-copper)] text-[var(--prop-ink)]"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .property-leaflet-map .leaflet-control-attribution {
          font-size: 10px;
          background: rgba(255,255,255,0.85);
        }
        .property-map-pin {
          background: transparent !important;
          border: none !important;
        }
        .property-map-pin-dot {
          display: block;
          width: 14px;
          height: 14px;
          margin: 2px;
          border-radius: 50%;
          background: #0c1520;
          border: 2px solid #b8895a;
          box-shadow: 0 0 0 4px rgba(184, 137, 90, 0.25);
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
