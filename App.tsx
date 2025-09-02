
import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { DataTable } from './components/DataTable';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { extractSingleFileInformation } from './services/geminiService';
import { Header } from './components/Header';
import { Welcome } from './components/Welcome';
import type { ExtractedData, FileWithStatus, HistoryEntry } from './types';
import { GoogleGenAI } from '@google/genai';
import { ExportButton } from './components/ExportButton';
import { HistoryPanel } from './components/HistoryPanel';
import useLocalStorage from './hooks/useLocalStorage';
import { CustomInstructions } from './components/CustomInstructions';
import { HeaderSelector } from './components/HeaderSelector';


export default function App() {
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('extractionHistory', []);

  const [allHeaders, setAllHeaders] = useState<string[]>([]);
  const [selectedHeaders, setSelectedHeaders] = useState<string[]>([]);

  const processAndSetData = (data: ExtractedData | null) => {
    if (data && data.length > 0) {
        const headers = data.reduce((acc, curr) => {
            Object.keys(curr).forEach(key => {
                if (!acc.includes(key)) {
                    acc.push(key);
                }
            });
            return acc;
        }, [] as string[]);

        const fileNameIndex = headers.indexOf("File Name");
        if (fileNameIndex > 0) {
            const fileNameHeader = headers.splice(fileNameIndex, 1)[0];
            headers.unshift(fileNameHeader);
        }
        
        setExtractedData(data);
        setAllHeaders(headers);
        setSelectedHeaders(headers);
    } else {
        setExtractedData(data);
        setAllHeaders([]);
        setSelectedHeaders([]);
    }
  };

  const handleFilesAdd = (newFiles: File[]) => {
    const newFilesWithStatus: FileWithStatus[] = newFiles.map(f => ({
      id: `${f.name}-${f.size}-${f.lastModified}`,
      file: f,
      status: 'pending',
    }));

    setFiles(prevFiles => {
      const existingFileIds = new Set(prevFiles.map(f => f.id));
      const uniqueNewFiles = newFilesWithStatus.filter(newFile => !existingFileIds.has(newFile.id));
      return [...prevFiles, ...uniqueNewFiles];
    });

    processAndSetData(null);
    setError(null);
  };

  const handleFileRemove = (fileIdToRemove: string) => {
    setFiles(prevFiles => prevFiles.filter(f => f.id !== fileIdToRemove));
    if (files.length === 1) {
        processAndSetData(null);
    }
  };

  const handleSaveToHistory = (data: ExtractedData) => {
    if (data.length === 0) return;
    const newEntry: HistoryEntry = {
        id: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        fileCount: data.length,
        preview: data.map(d => d['File Name']).slice(0, 3).join(', ') || 'Extraction',
        data: data,
    };
    const updatedHistory = [newEntry, ...history].slice(0, 10); // Keep last 10
    setHistory(updatedHistory);
  };

  const handleLoadFromHistory = (id: string) => {
    const entry = history.find(e => e.id === id);
    if (entry) {
        processAndSetData(entry.data);
        setFiles([]);
        setError(null);
        window.scrollTo(0, 0);
    }
  };

  const handleDeleteFromHistory = (id: string) => {
    setHistory(history.filter(e => e.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleExtract = async () => {
    if (files.length === 0) {
      setError('Please select one or more files first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    processAndSetData(null);
    
    setFiles(currentFiles => currentFiles.map(f => ({ ...f, status: 'pending', error: undefined })));

    if (!process.env.API_KEY) {
        setError("API_KEY environment variable is not set.");
        setIsLoading(false);
        return;
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const results: ExtractedData = [];
    
    for (const fileWithStatus of files) {
        setFiles(currentFiles => currentFiles.map(f =>
            f.id === fileWithStatus.id ? { ...f, status: 'processing', error: undefined } : f
        ));

        try {
            const data = await extractSingleFileInformation(fileWithStatus.file, ai, customInstructions);
            const resultRow = { "File Name": fileWithStatus.file.name, ...data };
            results.push(resultRow);

            setFiles(currentFiles => currentFiles.map(f =>
                f.id === fileWithStatus.id ? { ...f, status: 'done' } : f
            ));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            console.error(`Error processing ${fileWithStatus.file.name}:`, err);
            setFiles(currentFiles => currentFiles.map(f =>
                f.id === fileWithStatus.id ? { ...f, status: 'error', error: errorMessage } : f
            ));
        }
    }

    if (results.length > 0) {
        processAndSetData(results);
        handleSaveToHistory(results);
    } else {
        setError("Could not extract data from any of the selected files.");
    }
    
    setIsLoading(false);
  };

  const handleHeaderSelectionChange = (header: string) => {
    setSelectedHeaders(prev =>
        prev.includes(header)
            ? prev.filter(h => h !== header)
            : [...prev, header]
    );
  };

  const renderContent = () => {
    if (error && !extractedData) {
      return <ErrorMessage message={error} />;
    }
    if (extractedData) {
      return (
        <div className="space-y-6">
            <HeaderSelector
                allHeaders={allHeaders}
                selectedHeaders={selectedHeaders}
                onHeaderChange={handleHeaderSelectionChange}
                onSelectAll={() => setSelectedHeaders(allHeaders)}
                onDeselectAll={() => setSelectedHeaders([])}
            />
            <div className="flex justify-end">
                <ExportButton data={extractedData} headers={selectedHeaders} />
            </div>
            <DataTable data={extractedData} headers={selectedHeaders} />
        </div>
      );
    }
     if (isLoading) {
      return <Loader />;
    }
    return <Welcome />;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <Header />
        <div className="max-w-3xl mx-auto mt-8 p-6 md:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <FileUpload onFilesAdd={handleFilesAdd} onFileRemove={handleFileRemove} files={files} disabled={isLoading} />
          <CustomInstructions value={customInstructions} onChange={setCustomInstructions} disabled={isLoading} />
          <div className="mt-6">
            <button
              onClick={handleExtract}
              disabled={files.length === 0 || isLoading}
              className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100"
            >
              {isLoading ? 'Extracting...' : `Extract Information from ${files.length} file(s)`}
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-10">
          {renderContent()}
        </div>

        <HistoryPanel 
            history={history} 
            onLoad={handleLoadFromHistory} 
            onDelete={handleDeleteFromHistory}
            onClear={handleClearHistory}
        />
      </main>
    </div>
  );
}
