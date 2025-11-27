'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const PixelBlast = dynamic(() => import('./PixelBlast'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-[var(--background)]" />
});

// Shared PixelBlast configuration
const PIXEL_BLAST_CONFIG = {
  variant: 'circle' as const,
  pixelSize: 6,
  color: '#8A2BE2',
  patternScale: 3,
  patternDensity: 1.2,
  pixelSizeJitter: 0.5,
  enableRipples: true,
  rippleSpeed: 0.4,
  rippleThickness: 0.12,
  rippleIntensityScale: 1.5,
  liquid: true,
  liquidStrength: 0.12,
  liquidRadius: 1.2,
  liquidWobbleSpeed: 5,
  speed: 0.6,
  edgeFade: 0.25,
  transparent: true,
};

export default function BackgroundAnimation() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      {mounted && <PixelBlast {...PIXEL_BLAST_CONFIG} />}
    </div>
  );
}

