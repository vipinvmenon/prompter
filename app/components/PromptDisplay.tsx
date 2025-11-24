'use client';

interface PromptDisplayProps {
  prompt: string;
}

export default function PromptDisplay({ prompt }: PromptDisplayProps) {
  return (
    <div className="relative mb-6 min-h-[300px] rounded-xl border border-white/20 bg-[var(--surface)] p-6">
      <pre className="font-mono text-sm text-white whitespace-pre-wrap break-words max-h-[500px] overflow-auto pr-16"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#4B5563 transparent'
        }}
      >
        {prompt}
      </pre>
    </div>
  );
}

