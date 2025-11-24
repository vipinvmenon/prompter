'use client';

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
            className="mr-2 rounded-lg p-2 transition-colors hover:bg-white/10 cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 text-2xl font-bold">
          PP
        </div>
        <h1 className="text-2xl font-bold">Prompter</h1>
      </div>
      {showHistoryButton && (
        <button
          onClick={onHistoryClick}
          className="rounded-lg border border-white/20 p-2 transition-colors hover:bg-white/10 cursor-pointer"
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

