
import React from 'react';
import { DocIcon } from './icons/Icons';

export const Welcome: React.FC = () => {
    return (
        <div className="text-center py-10 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <DocIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Ready to Start</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Upload a PDF file and click "Extract Information" to see the magic happen.
            </p>
        </div>
    );
};
