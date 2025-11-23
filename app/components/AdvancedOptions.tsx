'use client';

import { PromptOptions } from '../types';

interface AdvancedOptionsProps {
  options: PromptOptions;
  onOptionsChange: (options: PromptOptions) => void;
}

export default function AdvancedOptions({ options, onOptionsChange }: AdvancedOptionsProps) {
  const handleChange = (key: keyof PromptOptions, value: boolean) => {
    onOptionsChange({ ...options, [key]: value });
  };

  return (
    <div className="rounded-lg border border-white/10 bg-[var(--surface)] p-4">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">Advanced Options</h3>
      <div className="space-y-3">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={options.includeRole}
            onChange={(e) => handleChange('includeRole', e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-white/5 text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
          />
          <span className="text-sm">Role</span>
        </label>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={options.includeTone}
            onChange={(e) => handleChange('includeTone', e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-white/5 text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
          />
          <span className="text-sm">Tone</span>
        </label>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={options.includeSafetyRules}
            onChange={(e) => handleChange('includeSafetyRules', e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-white/5 text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
          />
          <span className="text-sm">Safety Rules</span>
        </label>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={options.includeExamples}
            onChange={(e) => handleChange('includeExamples', e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-white/5 text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
          />
          <span className="text-sm">Include Examples</span>
        </label>
      </div>
    </div>
  );
}

