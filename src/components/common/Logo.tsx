import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  lightBackground?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, lightBackground = true }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
  };

  const textClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {/* SVG Emblem representing Wapi Pathum Technical College DBT Gear + Purple Logo + Orange Flame */}
      <div className={`relative flex items-center justify-center rounded-xl bg-slate-900 p-1.5 shadow-md border border-purple-800/40 shrink-0 ${sizeClasses[size]}`}>
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
          <defs>
            {/* Metallic Silver Gradient */}
            <linearGradient id="silverGear" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="40%" stopColor="#cbd5e1" />
              <stop offset="70%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* Purple DBT Gradient */}
            <linearGradient id="purpleDbt" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#7e22ce" />
              <stop offset="100%" stopColor="#581c87" />
            </linearGradient>

            {/* Vibrant Orange Flame Gradient */}
            <linearGradient id="orangeFlame" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
          </defs>

          {/* Outer Gear Teeth (12 cogs) */}
          <g fill="url(#silverGear)">
            <path d="M 100 10 L 112 10 L 115 25 L 128 30 L 139 20 L 148 29 L 138 42 L 148 52 L 163 48 L 168 60 L 153 71 L 158 84 L 172 90 L 172 103 L 158 109 L 153 122 L 168 133 L 163 145 L 148 141 L 138 151 L 148 164 L 139 173 L 128 163 L 115 168 L 112 183 L 100 183 L 97 168 L 84 163 L 73 173 L 64 164 L 74 151 L 64 141 L 49 145 L 44 133 L 59 122 L 54 109 L 40 103 L 40 90 L 54 84 L 59 71 L 44 60 L 49 48 L 64 52 L 74 42 L 64 29 L 73 20 L 84 30 L 97 25 Z" />
          </g>

          {/* Inner Circular Rim */}
          <circle cx="100" cy="96" r="62" fill="#0f172a" stroke="url(#silverGear)" strokeWidth="8" />

          {/* Gear Top Arc Text */}
          <path id="topArcPath" d="M 52,96 A 48,48 0 0,1 148,96" fill="none" />
          <text fill="#ffffff" fontSize="10.5" fontWeight="bold" letterSpacing="0.8">
            <textPath href="#topArcPath" startOffset="50%" textAnchor="middle">
              WAPI PATHUM TECHNICAL
            </textPath>
          </text>

          {/* Gear Bottom Arc Text */}
          <path id="bottomArcPath" d="M 148,96 A 48,48 0 0,1 52,96" fill="none" />
          <text fill="#e2e8f0" fontSize="9" fontWeight="600" letterSpacing="0.5">
            <textPath href="#bottomArcPath" startOffset="50%" textAnchor="middle">
              Digital Business Tech
            </textPath>
          </text>

          {/* Core Bold DBT Purple 3D Text */}
          <text x="74" y="112" fill="url(#purpleDbt)" fontSize="48" fontWeight="900" fontFamily="sans-serif" filter="drop-shadow(2px 2px 4px rgba(0,0,0,0.8))">
            DBT
          </text>

          {/* Orange Flame / Digital Spark Motif on the right */}
          <path d="M 145,115 C 142,90 152,70 168,55 C 160,82 178,92 172,118 C 168,135 152,142 145,115 Z" fill="url(#orangeFlame)" />
          <path d="M 152,110 C 150,95 158,80 166,72 C 162,90 172,98 168,112 C 165,122 155,126 152,110 Z" fill="url(#purpleDbt)" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight ${lightBackground ? 'text-slate-900' : 'text-white'} ${textClasses[size]}`}>
              วิทยาลัยการอาชีพวาปีปทุม
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-purple-600 text-white tracking-wider uppercase shadow-xs">
              WPTC
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-purple-700 dark:text-purple-400">
            <span className="font-bold text-orange-600">DBT</span>
            <span>สาขาเทคโนโลยีธุรกิจดิจิทัล</span>
          </div>
        </div>
      )}
    </div>
  );
};
