'use client';

import Logo from './Logo';

interface HeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
  showHistoryButton?: boolean;
  onHistoryClick?: () => void;
}

export default function Header({ 
  showBackButton = false, 
  onBackClick,
  showHistoryButton = false,
  onHistoryClick 
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-8 py-6">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <button
            onClick={onBackClick}
            className="mr-2 rounded-lg p-2 transition-all hover:bg-white/10 hover:shadow-[0_0_10px_rgba(138,43,226,0.3)] cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <Logo />
      </div>
      {showHistoryButton && (
        <button
          onClick={onHistoryClick}
          className="rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm p-2 transition-all hover:bg-white/10 hover:shadow-[0_0_15px_rgba(138,43,226,0.3)] cursor-pointer"
          title="History"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      )}
    </header>
  );
}

