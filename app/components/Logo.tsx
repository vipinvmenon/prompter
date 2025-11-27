'use client';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function Logo({ className = '', showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 280 200"
        role="img"
        aria-label="Prompter logo: speech bubble icon"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="blueGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#8A2BE2"/>
            <stop offset="1" stopColor="#3A8DFF"/>
          </linearGradient>
          <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#8A2BE2" floodOpacity="0.3"/>
          </filter>
        </defs>
        {/* Outer stroke for the bubble */}
        <path
          d="M240 24.5H48C36.9543 24.5 28 33.4543 28 44.5V140.5C28 151.546 36.9543 160.5 48 160.5H188.5L228 178.5C233.5 181.5 240 177 240 170.5V48.5C240 37.4543 231.0457 28.5 220 28.5Z"
          fill="rgba(255,255,255,0.1)"
        />
        {/* Inner bubble */}
        <path
          d="M232 34H56C46.0589 34 38 42.0589 38 52V128C38 137.941 46.0589 146 56 146H196.5L228 166.5C231.166 168.666 236 165.25 236 161V52C236 42.0589 227.9411 34 218 34Z"
          fill="url(#blueGrad)"
          filter="url(#softShadow)"
        />
        {/* Three text lines */}
        <g transform="translate(64,62)">
          <rect x="0" y="0" rx="6" ry="6" width="144" height="12" fill="#FFFFFF" opacity="0.9"/>
          <rect x="0" y="30" rx="6" ry="6" width="110" height="12" fill="#FFFFFF" opacity="0.9"/>
          <rect x="0" y="60" rx="6" ry="6" width="88" height="12" fill="#FFFFFF" opacity="0.9"/>
        </g>
      </svg>
      {showText && (
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
          Prompter
        </h1>
      )}
    </div>
  );
}

