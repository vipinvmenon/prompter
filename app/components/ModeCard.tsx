'use client';

import { ModeConfig } from '../types';

interface ModeCardProps {
  mode: ModeConfig;
  onClick: () => void;
}

export default function ModeCard({ mode, onClick }: ModeCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative rounded-xl border border-white/20 bg-white/5 backdrop-blur-md p-6 text-left transition-all hover:border-[var(--primary)] hover:bg-white/10 hover:shadow-[0_0_20px_rgba(138,43,226,0.3)] hover:-translate-y-1 cursor-pointer"
    >
      <div className="mb-3 text-3xl">{mode.icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{mode.title}</h3>
      <p className="text-sm text-gray-400">{mode.description}</p>
    </button>
  );
}

