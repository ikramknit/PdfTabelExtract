
import React from 'react';
import type { HistoryEntry } from '../types';
import { HistoryIcon, TrashIcon } from './icons/Icons';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onLoad, onDelete, onClear }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 md:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <HistoryIcon className="h-6 w-6" />
          Extraction History
        </h3>
        <button
            onClick={onClear}
            className="text-sm font-medium text-red-600 hover:text-red-500 disabled:opacity-50"
            aria-label="Clear all history"
        >
            Clear All
        </button>
      </div>
      <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
        {history.map((entry) => (
          <li key={entry.id} className="py-4 flex items-center justify-between gap-4">
            <div className="flex-grow min-w-0">
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate" title={entry.preview}>{entry.preview}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {entry.fileCount} file(s) - {new Date(entry.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-4">
                <button
                    onClick={() => onLoad(entry.id)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                    Load
                </button>
                <button
                    onClick={() => onDelete(entry.id)}
                    className="text-red-600 hover:text-red-500"
                    aria-label={`Delete history entry from ${new Date(entry.timestamp).toLocaleString()}`}
                >
                    <TrashIcon className="h-5 w-5" />
                </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
