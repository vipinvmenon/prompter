'use client';

import { Mode } from '../types';
import { modes } from '../constants';
import ModeCard from './ModeCard';
import Header from './Header';
import TrueFocus from './TrueFocus';
import BackgroundAnimation from './BackgroundAnimation';

interface LandingScreenProps {
  onModeSelect: (mode: Mode) => void;
}

export default function LandingScreen({ onModeSelect }: LandingScreenProps) {
  return (
    <div className="min-h-screen relative" style={{ background: 'var(--background)' }}>
      <BackgroundAnimation />
      
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

