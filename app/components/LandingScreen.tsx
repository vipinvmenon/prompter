'use client';

import { Mode } from '../types';
import { modes } from '../constants';
import ModeCard from './ModeCard';
import Header from './Header';

interface LandingScreenProps {
  onModeSelect: (mode: Mode) => void;
}

export default function LandingScreen({ onModeSelect }: LandingScreenProps) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <Header />
      <main className="mx-auto max-w-6xl px-8 py-12">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-5xl font-bold leading-tight">
            What do you want to create today?
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
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
  );
}

