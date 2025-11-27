'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Mode, PromptOptions } from '../types';
import { modes } from '../constants';
import Header from './Header';
import AdvancedOptions from './AdvancedOptions';

const PixelBlast = dynamic(() => import('./PixelBlast'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-[var(--background)]" />
});

interface ModeDetailScreenProps {
  selectedMode: Mode;
  idea: string;
  onIdeaChange: (idea: string) => void;
  options: PromptOptions; 
  onOptionsChange: (options: PromptOptions) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  onBack: () => void;
}

export default function ModeDetailScreen({
  selectedMode,
  idea,
  onIdeaChange,
  options,
  onOptionsChange,
  isGenerating,
  onGenerate,
  onBack,
}: ModeDetailScreenProps) {
  const [mounted, setMounted] = useState(false);
  const currentMode = modes.find(m => m.id === selectedMode);

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
        <Header showBackButton onBackClick={onBack} />
        <main className="mx-auto max-w-7xl px-8 py-8">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold">{currentMode?.title} Mode</h2>
            <p className="text-gray-400">{currentMode?.description}</p>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Describe your task...
                </label>
                <textarea
                  value={idea}
                  onChange={(e) => onIdeaChange(e.target.value)}
                  placeholder="Enter your idea or task description here..."
                  className="min-h-[200px] w-full rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-3 text-white placeholder:text-gray-500 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                  rows={8}
                />
              </div>

              <AdvancedOptions options={options} onOptionsChange={onOptionsChange} />
            </div>
          </div>

          {/* Sticky Bottom Bar */}
          <div className="sticky bottom-0 mt-8 flex justify-center py-4">
            <button
              onClick={onGenerate}
              disabled={isGenerating || !idea.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-8 py-3 text-lg font-semibold text-white transition-all hover:from-[var(--primary-hover)] hover:to-[var(--secondary-hover)] hover:shadow-[0_0_20px_rgba(138,43,226,0.4)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Prompt'
              )}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

