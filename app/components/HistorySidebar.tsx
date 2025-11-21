'use client';

import { HistoryItem, Mode } from '../types';
import { modes } from '../constants';

interface HistorySidebarProps {
  isOpen: boolean;
  history: HistoryItem[];
  onClose: () => void;
  onSelectItem: (item: HistoryItem) => void;
}

export default function HistorySidebar({ isOpen, history, onClose, onSelectItem }: HistorySidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 border-l border-white/10 bg-[var(--surface)] p-6 shadow-2xl z-50">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">History</h3>
        <button
          onClick={onClose}
          className="rounded-lg p-1 transition-colors hover:bg-white/10"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="space-y-2">
        {history.length === 0 ? (
          <p className="text-sm text-gray-400">No history yet</p>
        ) : (
          history.map((item) => {
            const mode = modes.find(m => m.id === item.mode);
            return (
              <button
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="w-full rounded-lg border border-white/10 bg-[var(--background)] p-3 text-left transition-colors hover:bg-white/5"
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-lg">{mode?.icon}</span>
                  <span className="text-xs font-medium text-gray-400">{mode?.title}</span>
                </div>
                <p className="mb-1 text-sm text-white">{item.title}</p>
                <p className="text-xs text-gray-500">
                  {item.timestamp.toLocaleTimeString()}
                </p>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

