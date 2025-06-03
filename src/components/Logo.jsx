import React from 'react'

function Logo({ width = '100px' }) {
  return (
    <div className="flex items-center" style={{ width }}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Gradients */}
        <defs>
          <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#EC4899' }} />
            <stop offset="100%" style={{ stopColor: '#8B5CF6' }} />
          </linearGradient>
        </defs>

        {/* Camera Body */}
        <path
          d="M6 10h20a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V13a3 3 0 013-3z"
          fill="url(#mainGradient)"
        />

        {/* Camera Top */}
        <path
          d="M13 7h6a2 2 0 012 2v1H11V9a2 2 0 012-2z"
          fill="url(#mainGradient)"
        />

        {/* Lens Ring */}
        <circle
          cx="16"
          cy="18"
          r="6"
          stroke="white"
          strokeWidth="2"
          opacity="0.9"
        />

        {/* Lens */}
        <circle
          cx="16"
          cy="18"
          r="4"
          fill="white"
          opacity="0.3"
        />

        {/* Flash */}
        <rect
          x="20"
          y="13"
          width="4"
          height="2"
          rx="1"
          fill="white"
          opacity="0.9"
        />

        {/* Simple Accent */}
        <circle
          cx="8"
          cy="14"
          r="1"
          fill="white"
          opacity="0.9"
        />
      </svg>
    </div>
  )
}

export default Logo