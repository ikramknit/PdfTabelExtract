
import React from 'react';

interface HeaderSelectorProps {
    allHeaders: string[];
    selectedHeaders: Set<string>;
    onHeaderToggle: (header: string) => void;
    onSelectAllToggle: (isChecked: boolean) => void;
    onShowTable: () => void;
}

export const HeaderSelector: React.FC<HeaderSelectorProps> = ({ 
    allHeaders, 
    selectedHeaders, 
    onHeaderToggle, 
    onSelectAllToggle,
    onShowTable 
}) => {
    const isAllSelected = allHeaders.length > 0 && selectedHeaders.size === allHeaders.length;

    const formattedHeader = (header: string) => {
        return header.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Select Columns to Display</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Choose which columns from the extracted data you want to include in the table.</p>
            
            <div className="mt-6 border-t border-b border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
                <fieldset className="p-1">
                    <legend className="sr-only">Headers</legend>
                    <div className="relative flex items-start py-4">
                        <div className="flex-1 min-w-0 text-sm">
                            <label htmlFor="select-all" className="font-bold text-gray-800 dark:text-gray-200 select-none cursor-pointer">Select All</label>
                        </div>
                        <div className="flex items-center h-5 ml-3">
                            <input
                                id="select-all"
                                name="select-all"
                                type="checkbox"
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                                checked={isAllSelected}
                                onChange={(e) => onSelectAllToggle(e.target.checked)}
                            />
                        </div>
                    </div>
                </fieldset>
            </div>
            
            <div className="max-h-72 overflow-y-auto pr-2">
                <fieldset className="divide-y divide-gray-200 dark:divide-gray-700">
                    <legend className="sr-only">Header list</legend>
                    {allHeaders.map(header => (
                        <div key={header} className="relative flex items-start py-4">
                            <div className="flex-1 min-w-0 text-sm">
                                <label htmlFor={`header-${header}`} className="font-medium text-gray-700 dark:text-gray-300 select-none cursor-pointer">{formattedHeader(header)}</label>
                            </div>
                            <div className="flex items-center h-5 ml-3">
                                <input
                                    id={`header-${header}`}
                                    name={`header-${header}`}
                                    type="checkbox"
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                                    checked={selectedHeaders.has(header)}
                                    onChange={() => onHeaderToggle(header)}
                                />
                            </div>
                        </div>
                    ))}
                </fieldset>
            </div>


            <div className="pt-5 mt-5 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={onShowTable}
                    disabled={selectedHeaders.size === 0}
                    className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 disabled:bg-green-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-all duration-300 ease-in-out"
                >
                    Show Table ({selectedHeaders.size} selected)
                </button>
            </div>
        </div>
    );
};
