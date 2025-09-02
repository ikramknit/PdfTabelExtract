
import React from 'react';

interface CustomInstructionsProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export const CustomInstructions: React.FC<CustomInstructionsProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="mt-6">
      <label htmlFor="custom-instructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Custom Extraction Instructions (Optional)
      </label>
      <div className="mt-1">
        <textarea
          id="custom-instructions"
          name="custom-instructions"
          rows={3}
          className="shadow-sm block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
          placeholder="e.g., Only extract the invoice number, total amount, and vendor name."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Provide specific instructions to guide the AI for more accurate results.
      </p>
    </div>
  );
};
