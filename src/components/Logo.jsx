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
        {/* Background Circle */}
        <circle cx="16" cy="16" r="16" className="fill-blue-500" />
        
        {/* Camera Body */}
        <path
          d="M8 12C8 11.4477 8.44772 11 9 11H23C23.5523 11 24 11.4477 24 12V21C24 21.5523 23.5523 22 23 22H9C8.44772 22 8 21.5523 8 21V12Z"
          className="fill-white"
        />
        
        {/* Camera Lens */}
        <circle
          cx="16"
          cy="16.5"
          r="3.5"
          className="fill-blue-500"
        />
        
        {/* Flash */}
        <rect
          x="10"
          y="9"
          width="4"
          height="2"
          rx="1"
          className="fill-white"
        />
        
        {/* Inner Lens Ring */}
        <circle
          cx="16"
          cy="16.5"
          r="2"
          className="fill-white"
          fillOpacity="0.5"
        />
      </svg>
    </div>
  )
}

export default Logo