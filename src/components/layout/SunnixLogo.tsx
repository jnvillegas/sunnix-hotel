import React from 'react';

interface SunnixLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SunnixLogo({ className = '', size = 'md' }: SunnixLogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Geometría Isotipo: Doble diamante entrelazado neón */}
      <div className={`relative shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_8px_rgba(0,245,212,0.4)]"
        >
          {/* Primer diamante inclinado */}
          <path
            d="M8 14L22 4L32 16L18 26L8 14Z"
            stroke="#00f5d4"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Segundo diamante cruzado */}
          <path
            d="M14 24L24 14L34 26L24 36L14 24Z"
            stroke="#10b981"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Logotipo Tipográfico */}
      <div className="flex flex-col leading-none">
        <span
          className={`font-black tracking-wider text-white font-sans ${textSizes[size]}`}
          style={{ letterSpacing: '0.08em' }}
        >
          SUNNIX
        </span>
        <span
          className="text-[10px] font-bold text-[#00f5d4] uppercase tracking-[0.28em] mt-0.5"
        >
          HOTEL
        </span>
      </div>
    </div>
  );
}
