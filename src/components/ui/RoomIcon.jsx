import React from 'react';

const paths = {
  // Chair (Curved backrest, slats, cushion, 4 legs & crossbar — matching screenshot)
  chair: (
    <g>
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      <path d="M12 7v4" />
      <rect x="5" y="11" width="14" height="4" rx="1.5" />
      <path d="M6 15v6m12-6v6" />
      <path d="M6 18.5h12" />
    </g>
  ),
  chairs: (
    <g>
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      <path d="M12 7v4" />
      <rect x="5" y="11" width="14" height="4" rx="1.5" />
      <path d="M6 15v6m12-6v6" />
      <path d="M6 18.5h12" />
    </g>
  ),

  // Sofa / Couch (Wide backrest, cushions, armrests & legs — matching screenshot)
  sofa: (
    <g>
      <path d="M5 9a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4H5V9z" />
      <path d="M12 9v4" />
      <rect x="2.5" y="9" width="3" height="7" rx="1.5" />
      <rect x="18.5" y="9" width="3" height="7" rx="1.5" />
      <path d="M5 13h14v3H5z" />
      <path d="M6 16v3.5m12-3.5v3.5" />
    </g>
  ),
  living: (
    <g>
      <path d="M5 9a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4H5V9z" />
      <path d="M12 9v4" />
      <rect x="2.5" y="9" width="3" height="7" rx="1.5" />
      <rect x="18.5" y="9" width="3" height="7" rx="1.5" />
      <path d="M5 13h14v3H5z" />
      <path d="M6 16v3.5m12-3.5v3.5" />
    </g>
  ),

  // Table / Dining (Smooth tabletop, pedestal/tapered legs & stretcher — matching screenshot)
  table: (
    <g>
      <path d="M3 8.5h18a1 1 0 0 1 1 1v1H2v-1a1 1 0 0 1 1-1z" />
      <path d="M6 10.5l-1.5 9m13.5-9l1.5 9" />
      <path d="M5.5 16h13" />
    </g>
  ),
  dining: (
    <g>
      <path d="M3 8.5h18a1 1 0 0 1 1 1v1H2v-1a1 1 0 0 1 1-1z" />
      <path d="M6 10.5l-1.5 9m13.5-9l1.5 9" />
      <path d="M5.5 16h13" />
    </g>
  ),

  // Bed (Headboard, 2 pillows, mattress and legs — matching screenshot)
  bed: (
    <g>
      <path d="M3 6.5v13m18-13v13" />
      <path d="M3 11.5h18" />
      <rect x="5" y="8" width="5.5" height="3.5" rx="1" />
      <rect x="13.5" y="8" width="5.5" height="3.5" rx="1" />
      <rect x="3" y="11.5" width="18" height="5.5" rx="1" />
    </g>
  ),
  bedroom: (
    <g>
      <path d="M3 6.5v13m18-13v13" />
      <path d="M3 11.5h18" />
      <rect x="5" y="8" width="5.5" height="3.5" rx="1" />
      <rect x="13.5" y="8" width="5.5" height="3.5" rx="1" />
      <rect x="3" y="11.5" width="18" height="5.5" rx="1" />
    </g>
  ),

  // Lamp (Trapezoid shade, stem, circular base — matching screenshot)
  lamp: (
    <g>
      <path d="M8 5.5l-2.5 7h13l-2.5-7H8z" />
      <path d="M12 12.5v6.5" />
      <path d="M8 19h8" />
    </g>
  ),

  // Executive Desk (Modern desk with side drawer unit)
  desk: (
    <g>
      <path d="M3 7.5h18v2.5H3z" />
      <path d="M5 10v9m14-9v9" />
      <rect x="13" y="10" width="5.5" height="7" rx="0.5" />
      <path d="M15 13h1.5m-1.5 2.5h1.5" />
    </g>
  ),
  executive: (
    <g>
      <path d="M3 7.5h18v2.5H3z" />
      <path d="M5 10v9m14-9v9" />
      <rect x="13" y="10" width="5.5" height="7" rx="0.5" />
      <path d="M15 13h1.5m-1.5 2.5h1.5" />
    </g>
  ),

  // Meeting Table (Conference boardroom table)
  meeting: (
    <g>
      <rect x="3.5" y="9" width="17" height="6" rx="3" />
      <path d="M7 6v3m5-3v3m5-3v3m-10 6v3m5-3v3m5-3v3" />
    </g>
  ),

  // All Pieces (Minimal 4-square grid)
  all: (
    <g>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
    </g>
  ),

  // Home
  home: (
    <g>
      <path d="M3 10.5L12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 19.5v-9z" />
      <path d="M9 21v-7h6v7" />
    </g>
  ),

  // Office
  office: (
    <g>
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <path d="M9 7h2m2 0h2m-6 4h2m2 0h2m-6 4h2m2 0h2M10 21v-3h4v3" />
    </g>
  ),
};

export default function RoomIcon({ name, size = 32, strokeWidth = 1.75, className = '', color = 'currentColor' }) {
  const content = paths[name] || paths.living;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {content}
    </svg>
  );
}
