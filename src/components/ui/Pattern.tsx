import React from 'react';

export const KarakalpakPattern: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    className={className}
    style={{ opacity: 0.1, pointerEvents: 'none' }}
  >
    <defs>
      <pattern id="kk-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        {/* Simple geometric ornament inspired by KK patterns */}
        <path
          d="M50 0 L100 50 L50 100 L0 50 Z M50 20 L80 50 L50 80 L20 50 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        />
        <circle cx="50" cy="50" r="5" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <path d="M0 0 L20 20 M80 20 L100 0 M0 100 L20 80 M80 80 L100 100" stroke="currentColor" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#kk-pattern)" />
  </svg>
);
