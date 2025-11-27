'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Mode } from '../types';
import { modes } from '../constants';
import ModeCard from './ModeCard';
import Header from './Header';
import TrueFocus from './TrueFocus';

const PixelBlast = dynamic(() => import('./PixelBlast'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-[var(--background)]" />
});

interface LandingScreenProps {
  onModeSelect: (mode: Mode) => void;
}

export default function LandingScreen({ onModeSelect }: LandingScreenProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--background)' }}>
      {/* Background Pixel Animation */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {mounted && (
          <PixelBlast
            variant="circle"
            pixelSize={6}
            color="#8A2BE2"
            patternScale={3}
            patternDensity={1.2}
            pixelSizeJitter={0.5}
            enableRipples
            rippleSpeed={0.4}
            rippleThickness={0.12}
            rippleIntensityScale={1.5}
            liquid
            liquidStrength={0.12}
            liquidRadius={1.2}
            liquidWobbleSpeed={5}
            speed={0.6}
            edgeFade={0.25}
            transparent
          />
        )}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Header />
        <main className="mx-auto max-w-6xl px-8 py-12">
        <div className="mb-12 text-center">
          <TrueFocus 
            sentence="What do you want to create today?"
            manualMode={false}
            blurAmount={4}
            borderColor="#8A2BE2"
            glowColor="rgba(138, 43, 226, 0.6)"
            animationDuration={0.8}
            pauseBetweenAnimations={0.4}
          />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-50">
          {modes.map((mode) => (
            <ModeCard
              key={mode.id}
              mode={mode}
              onClick={() => onModeSelect(mode.id)}
            />
          ))}
        </div>
      </main>
      </div>
    </div>
  );
}

