
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Analyzing Document...
      </p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        This may take a few moments.
      </p>
    </div>
  );
};
