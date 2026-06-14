import { useState } from 'react';
import './BodyMap.css';

interface BodyMapProps {
  selectedRegions: string[];
  onRegionToggle: (region: string) => void;
  view: 'front' | 'back';
  onViewChange: (view: 'front' | 'back') => void;
}

interface RegionDef {
  id: string;
  label: string;
  path: string;
}

/* ─── Front-view body region paths ─── */
const frontRegions: RegionDef[] = [
  {
    id: 'head',
    label: 'Head',
    path: 'M140,12 C140,12 128,10 120,16 C112,22 108,34 108,46 C108,58 112,68 120,74 C124,76 130,80 140,80 C150,80 156,76 160,74 C168,68 172,58 172,46 C172,34 168,22 160,16 C152,10 140,12 140,12 Z',
  },
  {
    id: 'neck',
    label: 'Neck',
    path: 'M130,80 L130,96 C130,96 134,100 140,100 C146,100 150,96 150,96 L150,80 C150,80 146,84 140,84 C134,84 130,80 130,80 Z',
  },
  {
    id: 'chest',
    label: 'Chest',
    path: 'M104,106 L104,170 C104,170 110,178 140,178 C170,178 176,170 176,170 L176,106 C176,106 170,100 150,96 L150,100 C150,100 146,104 140,104 C134,104 130,100 130,100 L130,96 C110,100 104,106 104,106 Z',
  },
  {
    id: 'abdomen',
    label: 'Abdomen',
    path: 'M108,178 L108,240 C108,244 112,252 140,252 C168,252 172,244 172,240 L172,178 C172,178 166,184 140,184 C114,184 108,178 108,178 Z',
  },
  {
    id: 'left_arm',
    label: 'Left Arm',
    path: 'M104,106 C96,108 82,116 76,124 L60,170 L52,210 C52,214 54,218 58,218 C62,218 64,216 66,212 L78,170 L88,142 L100,170 L104,170 L104,106 Z',
  },
  {
    id: 'right_arm',
    label: 'Right Arm',
    path: 'M176,106 C184,108 198,116 204,124 L220,170 L228,210 C228,214 226,218 222,218 C218,218 216,216 214,212 L202,170 L192,142 L180,170 L176,170 L176,106 Z',
  },
  {
    id: 'left_leg',
    label: 'Left Leg',
    path: 'M110,252 L108,280 L104,320 L100,370 L98,400 L96,430 C96,436 100,440 104,440 C108,440 110,436 112,430 L118,380 L124,320 L130,280 L140,252 C140,252 124,256 110,252 Z',
  },
  {
    id: 'right_leg',
    label: 'Right Leg',
    path: 'M170,252 L172,280 L176,320 L180,370 L182,400 L184,430 C184,436 180,440 176,440 C172,440 170,436 168,430 L162,380 L156,320 L150,280 L140,252 C140,252 156,256 170,252 Z',
  },
];

/* ─── Back-view body region paths ─── */
const backRegions: RegionDef[] = [
  {
    id: 'head',
    label: 'Head',
    path: 'M140,12 C140,12 128,10 120,16 C112,22 108,34 108,46 C108,58 112,68 120,74 C124,76 130,80 140,80 C150,80 156,76 160,74 C168,68 172,58 172,46 C172,34 168,22 160,16 C152,10 140,12 140,12 Z',
  },
  {
    id: 'neck',
    label: 'Neck',
    path: 'M130,80 L130,96 C130,96 134,100 140,100 C146,100 150,96 150,96 L150,80 C150,80 146,84 140,84 C134,84 130,80 130,80 Z',
  },
  {
    id: 'upper_back',
    label: 'Upper Back',
    path: 'M104,106 L104,178 C104,178 110,184 140,184 C170,184 176,178 176,178 L176,106 C176,106 170,100 150,96 L150,100 C150,100 146,104 140,104 C134,104 130,100 130,100 L130,96 C110,100 104,106 104,106 Z',
  },
  {
    id: 'lower_back',
    label: 'Lower Back',
    path: 'M108,184 L108,240 C108,244 112,252 140,252 C168,252 172,244 172,240 L172,184 C172,184 166,188 140,188 C114,188 108,184 108,184 Z',
  },
  {
    id: 'left_arm',
    label: 'Left Arm',
    path: 'M104,106 C96,108 82,116 76,124 L60,170 L52,210 C52,214 54,218 58,218 C62,218 64,216 66,212 L78,170 L88,142 L100,170 L104,170 L104,106 Z',
  },
  {
    id: 'right_arm',
    label: 'Right Arm',
    path: 'M176,106 C184,108 198,116 204,124 L220,170 L228,210 C228,214 226,218 222,218 C218,218 216,216 214,212 L202,170 L192,142 L180,170 L176,170 L176,106 Z',
  },
  {
    id: 'left_leg',
    label: 'Left Leg',
    path: 'M110,252 L108,280 L104,320 L100,370 L98,400 L96,430 C96,436 100,440 104,440 C108,440 110,436 112,430 L118,380 L124,320 L130,280 L140,252 C140,252 124,256 110,252 Z',
  },
  {
    id: 'right_leg',
    label: 'Right Leg',
    path: 'M170,252 L172,280 L176,320 L180,370 L182,400 L184,430 C184,436 180,440 176,440 C172,440 170,436 168,430 L162,380 L156,320 L150,280 L140,252 C140,252 156,256 170,252 Z',
  },
];

export default function BodyMap({
  selectedRegions,
  onRegionToggle,
  view,
  onViewChange,
}: BodyMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const regions = view === 'front' ? frontRegions : backRegions;

  const handleMouseEnter = (
    regionId: string,
    e: React.MouseEvent<SVGPathElement>
  ) => {
    setHoveredRegion(regionId);
    const svgContainer = (e.target as SVGPathElement).closest(
      '.body-map__svg-container'
    );
    if (svgContainer) {
      const containerRect = svgContainer.getBoundingClientRect();
      const bbox = (e.target as SVGPathElement).getBBox();
      const svgEl = (e.target as SVGPathElement).ownerSVGElement;
      if (svgEl) {
        const svgRect = svgEl.getBoundingClientRect();
        const scaleX = svgRect.width / 280;
        const scaleY = svgRect.height / 450;
        const cx = (bbox.x + bbox.width / 2) * scaleX + svgRect.left - containerRect.left;
        const cy = bbox.y * scaleY + svgRect.top - containerRect.top - 8;
        setTooltipPos({ x: cx, y: cy });
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredRegion(null);
  };

  const hoveredLabel = regions.find((r) => r.id === hoveredRegion)?.label || '';

  return (
    <div className="body-map">
      {/* View Toggle */}
      <div className="body-map__toggle">
        <button
          type="button"
          className={`body-map__toggle-btn ${view === 'front' ? 'body-map__toggle-btn--active' : ''}`}
          onClick={() => onViewChange('front')}
        >
          Front
        </button>
        <button
          type="button"
          className={`body-map__toggle-btn ${view === 'back' ? 'body-map__toggle-btn--active' : ''}`}
          onClick={() => onViewChange('back')}
        >
          Back
        </button>
      </div>

      {/* SVG Body */}
      <div className="body-map__svg-container">
        {/* Tooltip */}
        <div
          className={`body-map__tooltip ${hoveredRegion ? 'body-map__tooltip--visible' : ''}`}
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          {hoveredLabel}
        </div>

        <svg
          className="body-map__svg"
          viewBox="0 0 280 450"
          width="240"
          height="340"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="regionGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {regions.map((region) => {
            const isSelected = selectedRegions.includes(region.id);
            return (
              <path
                key={region.id}
                d={region.path}
                className={`body-map__region ${
                  isSelected
                    ? 'body-map__region--selected'
                    : 'body-map__region--default'
                }`}
                onClick={() => onRegionToggle(region.id)}
                onMouseEnter={(e) => handleMouseEnter(region.id, e)}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}
        </svg>
      </div>

      <p className="body-map__hint">
        {view === 'front' ? 'Front view' : 'Back view'} — tap regions to select
      </p>
    </div>
  );
}
