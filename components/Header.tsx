
import React from 'react';
import { TableIcon } from './icons/Icons';

export const Header: React.FC = () => {
    return (
        <header className="text-center">
            <div className="inline-flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full mb-4">
              <TableIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                PDF Table Extractor
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
                Upload a PDF document to intelligently extract structured information and display it in a clean, usable table format.
            </p>
        </header>
    );
};
