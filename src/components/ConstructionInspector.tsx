import { useState } from 'react';
import { EditorialImage } from './EditorialImage';

export interface SystemHotspot {
  id: string;
  number: string;
  code: string;
  pieceName: string;
  title: string;
  description: string;
  /** Position in % on the 16:9 image */
  x: number;
  y: number;
  isSignal?: boolean;
}

interface ConstructionInspectorProps {
  image: string;
  imageAlt: string;
  hotspots: SystemHotspot[];
  helperText?: string;
  badgeText?: string;
  placeholderText?: string;
}

export function ConstructionInspector({
  image,
  imageAlt,
  hotspots,
  helperText = 'Survolez les points d’intérêt sur la silhouette pour inspecter chaque couche',
  badgeText = '4 points actifs · Système complet',
  placeholderText = 'Passez la souris sur un repère (01 à 04) pour afficher les détails techniques de la couche.',
}: ConstructionInspectorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(hotspots[0]?.id ?? null);

  const activeSpot = hotspots.find((h) => h.id === hoveredId) ?? null;

  return (
    <div className="mt-10 pt-10 border-t border-[#2B2B28]">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-xs font-mono text-[#898985]">
        <span>{helperText}</span>
        <span className="text-[#D6FF3F]">{badgeText}</span>
      </div>

      <figure className="relative border border-[#2B2B28] bg-[#1B1B19] overflow-hidden">
        {/* 16:9 Single Unified Image with Interactive Hotspots */}
        <div
          className="relative aspect-video w-full overflow-hidden bg-[#151515]"
          onMouseLeave={() => setHoveredId(null)}
        >
          <EditorialImage
            src={image}
            alt={imageAlt}
            fallbackTitle="OUTSIDE SYSTEM — VUE D'ENSEMBLE"
            className="w-full h-full object-cover"
          />

          {/* Interactive Hotspot Markers */}
          {hotspots.map((spot) => {
            const isActive = hoveredId === spot.id;
            return (
              <div
                key={spot.id}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <button
                  type="button"
                  onMouseEnter={() => setHoveredId(spot.id)}
                  onFocus={() => setHoveredId(spot.id)}
                  onClick={() =>
                    setHoveredId((prev) => (prev === spot.id ? null : spot.id))
                  }
                  aria-label={`${spot.code} — ${spot.pieceName} : ${spot.title}`}
                  aria-expanded={isActive}
                  className={`w-8 h-8 font-mono text-xs font-semibold border transition-transform duration-150 flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6FF3F] ${
                    isActive
                      ? 'bg-[#D6FF3F] text-[#151515] border-[#151515] scale-115'
                      : 'bg-[#151515]/90 text-[#D6FF3F] border-[#D6FF3F] hover:scale-110'
                  }`}
                >
                  {spot.number}
                </button>

                {/* Floating Info Card on Hover / Focus (Desktop) */}
                {isActive && (
                  <div
                    role="tooltip"
                    className={`hidden md:block absolute z-20 w-72 p-4 bg-[#151515]/95 border border-[#D6FF3F] text-[#E8E7E2] pointer-events-none ${
                      spot.x > 55 ? 'right-10 top-0' : 'left-10 top-0'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-[#D6FF3F]">
                      <span>{spot.code}</span>
                      <span>{spot.pieceName}</span>
                    </div>
                    <p className="mt-1.5 text-sm font-semibold text-[#E8E7E2]">
                      {spot.title}
                    </p>
                    <p className="mt-1 text-xs text-[#B8BBB7] leading-relaxed">
                      {spot.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Interactive Readout Bar (always legible on mobile & desktop) */}
        <figcaption className="p-4 sm:px-6 sm:py-4 border-t border-[#2B2B28] bg-[#1B1B19] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {activeSpot ? (
            <div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[#D6FF3F]">{activeSpot.code}</span>
                <span aria-hidden="true" className="text-[#898985]">
                  ·
                </span>
                <span className="text-[#E8E7E2] font-medium">
                  {activeSpot.pieceName}
                </span>
                <span aria-hidden="true" className="text-[#898985]">
                  —
                </span>
                <span className="text-[#B8BBB7]">{activeSpot.title}</span>
              </div>
              <p className="mt-1 text-xs text-[#B8BBB7]">
                {activeSpot.description}
              </p>
            </div>
          ) : (
            <p className="text-xs font-mono text-[#898985]">
              {placeholderText}
            </p>
          )}

          <div className="flex items-center gap-1.5 shrink-0">
            {hotspots.map((spot) => (
              <button
                key={spot.id}
                type="button"
                onMouseEnter={() => setHoveredId(spot.id)}
                onClick={() => setHoveredId(spot.id)}
                className={`px-2.5 py-1 text-xs font-mono border transition-colors ${
                  hoveredId === spot.id
                    ? 'bg-[#D6FF3F] text-[#151515] border-[#D6FF3F] font-semibold'
                    : 'bg-transparent text-[#B8BBB7] border-[#2B2B28] hover:border-[#D6FF3F]'
                }`}
              >
                {spot.number}
              </button>
            ))}
          </div>
        </figcaption>
      </figure>
    </div>
  );
}
