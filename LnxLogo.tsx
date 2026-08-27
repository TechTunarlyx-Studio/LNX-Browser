import React from 'react';

interface LnxLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  className?: string;
  showSubtitle?: boolean;
}

export const LnxLogo: React.FC<LnxLogoProps> = ({
  size = 'md',
  className = '',
  showSubtitle = true,
}) => {
  let dimension = 36;
  if (typeof size === 'number') {
    dimension = size;
  } else {
    switch (size) {
      case 'xs':
        dimension = 16;
        break;
      case 'sm':
        dimension = 24;
        break;
      case 'md':
        dimension = 36;
        break;
      case 'lg':
        dimension = 56;
        break;
      case 'xl':
        dimension = 84;
        break;
      case '2xl':
        dimension = 128;
        break;
    }
  }

  const gradientId = React.useId ? `lnx-grad-${React.useId().replace(/:/g, '')}` : 'lnx-logo-grad';

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${className}`}
      style={{ minWidth: dimension, minHeight: dimension }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="30%" x2="100%" y2="70%">
          <stop offset="0%" stopColor="#0096c7" />
          <stop offset="35%" stopColor="#00b4d8" />
          <stop offset="65%" stopColor="#2ec4b6" />
          <stop offset="100%" stopColor="#48ca54" />
        </linearGradient>
      </defs>

      {/* Outer Background Circle with Gradient */}
      <circle
        cx="200"
        cy="200"
        r="175"
        fill={`url(#${gradientId})`}
        stroke="#000000"
        strokeWidth="18"
      />

      {/* Main "LNX" Text */}
      <text
        x="200"
        y={showSubtitle ? '220' : '235'}
        textAnchor="middle"
        fill="#000000"
        fontFamily="system-ui, -apple-system, 'Plus Jakarta Sans', BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight="800"
        fontSize={showSubtitle ? '118' : '135'}
        letterSpacing="2px"
      >
        LNX
      </text>

      {/* Subtitle "Browser" Text */}
      {showSubtitle && (
        <text
          x="200"
          y="262"
          textAnchor="middle"
          fill="#000000"
          fontFamily="system-ui, -apple-system, 'Plus Jakarta Sans', BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="600"
          fontSize="34"
          letterSpacing="0.5px"
        >
          Browser
        </text>
      )}
    </svg>
  );
};
