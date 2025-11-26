'use client';

import { Mode } from '../types';
import { modes } from '../constants';
import ModeCard from './ModeCard';
import Header from './Header';
import TrueFocus from './TrueFocus';
import GridScan from './GridScan';

interface LandingScreenProps {
  onModeSelect: (mode: Mode) => void;
}

export default function LandingScreen({ onModeSelect }: LandingScreenProps) {
  return (
    <div className="min-h-screen relative" style={{ background: 'var(--background)' }}>
      {/* Background Grid Animation */}
      <div className="absolute inset-0 w-full h-full">
        <GridScan
          sensitivity={0.55}
          lineThickness={1}
          linesColor="#392e4e"
          gridScale={0.1}
          scanColor="#FF9FFC"
          scanOpacity={0.4}
          enablePost
          bloomIntensity={0.6}
          chromaticAberration={0.002}
          noiseIntensity={0.01}
        />
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

