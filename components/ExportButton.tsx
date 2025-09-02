
import React from 'react';
import type { ExtractedData } from '../types';
import { DownloadIcon } from './icons/Icons';

interface ExportButtonProps {
  data: ExtractedData;
  headers: string[];
}

export const ExportButton: React.FC<ExportButtonProps> = ({ data, headers }) => {
  const convertToCSV = (jsonData: ExtractedData): string => {
    if (!jsonData || jsonData.length === 0 || headers.length === 0) {
      return '';
    }

    const csvRows = [headers.join(',')];

    jsonData.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] === null || row[header] === undefined ? '' : row[header];
        const escaped = ('' + value).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  };

  const handleExport = () => {
    const csvData = convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    link.setAttribute('download', `extracted_data_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      disabled={headers.length === 0 || data.length === 0}
      className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:bg-green-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
    >
      <DownloadIcon className="h-5 w-5" />
      Export to CSV
    </button>
  );
};
