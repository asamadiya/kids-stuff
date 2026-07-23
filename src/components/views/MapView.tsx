import { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { getMeta, REGION_COLOR } from '../../data/meta';
import type { Story } from '../../types';

const GEO_URL = `${import.meta.env.BASE_URL}world-110m.json`;

export interface MapViewProps {
  readonly stories: readonly Story[];
  readonly onOpen: (slug: string) => void;
}

interface Hover {
  readonly title: string;
  readonly place: string;
  readonly yearLabel: string;
  readonly x: number;
  readonly y: number;
}

/** World map with a pin per story (coloured by region); hover to peek, tap to read. */
export function MapView({ stories, onOpen }: MapViewProps) {
  const [hover, setHover] = useState<Hover | null>(null);
  const points = stories
    .map((s) => ({ story: s, meta: getMeta(s.slug) }))
    .filter((p): p is { story: Story; meta: NonNullable<ReturnType<typeof getMeta>> } => !!p.meta);

  return (
    <div className="mapview">
      <div className="mapview__frame">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ scale: 165 }}
          width={900}
          height={460}
          style={{ width: '100%', height: 'auto' }}
        >
          <ZoomableGroup center={[15, 20]} zoom={1} minZoom={1} maxZoom={6}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    className="mapview__land"
                    tabIndex={-1}
                  />
                ))
              }
            </Geographies>
            {points.map(({ story, meta }) => (
              <Marker
                key={story.slug}
                coordinates={[meta.lng, meta.lat]}
                onMouseEnter={(e) =>
                  setHover({
                    title: story.title,
                    place: meta.place,
                    yearLabel: meta.yearLabel,
                    x: e.clientX,
                    y: e.clientY,
                  })
                }
                onMouseLeave={() => setHover(null)}
                onClick={() => onOpen(story.slug)}
                style={{ default: { cursor: 'pointer' }, hover: { cursor: 'pointer' }, pressed: {} }}
              >
                <circle
                  r={3.4}
                  className="mapview__pin"
                  fill={REGION_COLOR[meta.region] ?? '#e9a24c'}
                />
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
        {hover ? (
          <div className="mapview__tip" style={{ left: hover.x, top: hover.y }} role="status">
            <strong>{hover.title}</strong>
            <span>
              {hover.place} · {hover.yearLabel}
            </span>
          </div>
        ) : null}
      </div>
      <p className="mapview__hint">Drag to pan, scroll to zoom. Tap a dot to read the story.</p>
      <ul className="mapview__legend" aria-label="Regions">
        {Object.entries(REGION_COLOR).map(([region, color]) => (
          <li key={region} className="mapview__legend-item">
            <span className="mapview__swatch" style={{ background: color }} aria-hidden="true" />
            {region}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MapView;
