
import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { DataTable } from './components/DataTable';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { extractInformationFromPDF } from './services/geminiService';
import { Header } from './components/Header';
import { Welcome } from './components/Welcome';
import { HeaderSelector } from './components/HeaderSelector';
import type { ExtractedData } from './types';


export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [allHeaders, setAllHeaders] = useState<string[]>([]);
  const [selectedHeaders, setSelectedHeaders] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'welcome' | 'headerSelection' | 'table'>('welcome');

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    setExtractedData(null);
    setAllHeaders([]);
    setSelectedHeaders(new Set());
    setError(null);
    setView('welcome');
  };

  const handleExtract = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setExtractedData(null);
    setView('welcome');


    try {
      const data = await extractInformationFromPDF(file);
      if (!data || data.length === 0) {
        setError("The model could not find any structured data to display from the uploaded document.");
        setView('welcome');
        return;
      }
      
      const headers = new Set<string>();
      data.forEach(row => {
        Object.keys(row).forEach(key => headers.add(key));
      });
      const uniqueHeaders = Array.from(headers);

      setExtractedData(data);
      setAllHeaders(uniqueHeaders);
      setSelectedHeaders(new Set(uniqueHeaders));
      setView('headerSelection');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to extract information. ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHeaderToggle = (header: string) => {
    setSelectedHeaders(prev => {
        const newSet = new Set(prev);
        if (newSet.has(header)) {
            newSet.delete(header);
        } else {
            newSet.add(header);
        }
        return newSet;
    });
  };

  const handleSelectAllToggle = (isChecked: boolean) => {
      setSelectedHeaders(isChecked ? new Set(allHeaders) : new Set());
  };

  const handleShowTable = () => {
      if (selectedHeaders.size === 0) {
        // This should not be reachable as the button is disabled, but serves as a safeguard.
        return;
      }
      setView('table');
  };
  
  const handleBackToSelection = () => {
    setView('headerSelection');
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (error && view === 'welcome') {
      return <ErrorMessage message={error} />;
    }
    
    switch (view) {
      case 'headerSelection':
        return (
          <HeaderSelector
            allHeaders={allHeaders}
            selectedHeaders={selectedHeaders}
            onHeaderToggle={handleHeaderToggle}
            onSelectAllToggle={handleSelectAllToggle}
            onShowTable={handleShowTable}
          />
        );
      case 'table':
        const orderedSelectedHeaders = Array.from(selectedHeaders).sort((a,b) => allHeaders.indexOf(a) - allHeaders.indexOf(b));
        return <DataTable data={extractedData || []} headers={orderedSelectedHeaders} />;
      case 'welcome':
      default:
        return <Welcome />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <Header />
        <div className="max-w-3xl mx-auto mt-8 p-6 md:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <FileUpload onFileSelect={handleFileSelect} file={file} disabled={isLoading} />
          <div className="mt-6">
            <button
              onClick={handleExtract}
              disabled={!file || isLoading}
              className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100"
            >
              {isLoading ? 'Extracting...' : 'Extract Information'}
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-10">
          {view === 'table' && (
                <div className="mb-4 flex justify-end">
                    <button 
                        onClick={handleBackToSelection}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-200"
                    >
                        Change Columns
                    </button>
                </div>
            )}
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
