'use client';

interface ActionButtonsProps {
  copied: boolean;
  onCopy: () => void;
}

export default function ActionButtons({
  copied,
  onCopy,
}: ActionButtonsProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button
        onClick={onCopy}
        className="flex items-center gap-2 rounded-lg border border-white/20 bg-[var(--surface)] px-4 py-2 text-sm transition-colors hover:bg-white/10 cursor-pointer"
      >
        {copied ? (
          <>
            <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </>
        )}
      </button>
    </div>
  );
}

