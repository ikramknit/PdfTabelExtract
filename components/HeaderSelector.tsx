
import React from 'react';

interface HeaderSelectorProps {
  allHeaders: string[];
  selectedHeaders: string[];
  onHeaderChange: (header: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export const HeaderSelector: React.FC<HeaderSelectorProps> = ({ allHeaders, selectedHeaders, onHeaderChange, onSelectAll, onDeselectAll }) => {
    if (allHeaders.length === 0) {
        return null;
    }

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">Select Columns to Display</h4>
                <div className="flex gap-4">
                    <button onClick={onSelectAll} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Select All</button>
                    <button onClick={onDeselectAll} className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-500">Deselect All</button>
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {allHeaders.map(header => (
                    <label key={header} className="flex items-center space-x-2 cursor-pointer" title={header}>
                        <input
                            type="checkbox"
                            checked={selectedHeaders.includes(header)}
                            onChange={() => onHeaderChange(header)}
                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-700"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 select-none truncate">
                            {header.replace(/_/g, ' ')}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
};
