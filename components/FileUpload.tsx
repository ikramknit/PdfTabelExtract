
import React, { useCallback, useState } from 'react';
import { PdfIcon, UploadIcon, FileGenericIcon, SpinnerIcon, CheckCircleIcon, XCircleIcon } from './icons/Icons';
import type { FileWithStatus } from '../types';

interface FileUploadProps {
  onFilesAdd: (files: File[]) => void;
  onFileRemove: (fileId: string) => void;
  files: FileWithStatus[];
  disabled: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesAdd, onFileRemove, files, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    const acceptedFiles = droppedFiles.filter(f => f.type === "application/pdf" || f.type.startsWith("image/"));
    
    if (acceptedFiles.length > 0) {
        onFilesAdd(acceptedFiles);
    }
    if (acceptedFiles.length < droppedFiles.length) {
        alert("Some files were not valid PDFs or images and were ignored.");
    }
  }, [disabled, onFilesAdd]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      onFilesAdd(selectedFiles);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const dragDropClasses = isDragging
    ? 'border-indigo-500 bg-indigo-50 dark:bg-gray-700'
    : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500';

  const getStatusIcon = (status: FileWithStatus['status']) => {
    switch (status) {
        case 'processing':
            return <SpinnerIcon className="flex-shrink-0 h-5 w-5 text-indigo-500" aria-label="Processing" />;
        case 'done':
            return <CheckCircleIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-label="Done" />;
        case 'error':
            return <XCircleIcon className="flex-shrink-0 h-5 w-5 text-red-500" aria-label="Error" />;
        default:
            return null;
    }
  }

  return (
    <div>
        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload PDF or Image Files
        </label>
        <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`relative flex justify-center items-center w-full px-6 pt-5 pb-6 border-2 ${dragDropClasses} border-dashed rounded-lg transition-colors duration-200 ease-in-out`}
        >
            <input id="file-upload" name="file-upload" type="file" accept=".pdf,image/*" multiple className="sr-only" onChange={handleFileChange} disabled={disabled} />
            <div className="space-y-1 text-center">
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 dark:focus-within:ring-offset-gray-800">
                        <span>Upload files</span>
                    </label>
                    <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500">PDFs and images up to 10MB</p>
            </div>
        </div>
        {files.length > 0 && (
            <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Files:</h4>
                <ul role="list" className="mt-2 border border-gray-200 dark:border-gray-700 rounded-md divide-y divide-gray-200 dark:divide-gray-700">
                    {files.map((fileWithStatus) => (
                        <li key={fileWithStatus.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm flex-wrap">
                            <div className="w-0 flex-1 flex items-center">
                                {fileWithStatus.file.type === 'application/pdf' ? <PdfIcon className="flex-shrink-0 h-5 w-5 text-gray-400" /> : <FileGenericIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />}
                                <span className="ml-2 flex-1 w-0 truncate text-gray-800 dark:text-gray-200">{fileWithStatus.file.name}</span>
                            </div>
                            <div className="ml-4 flex-shrink-0 flex items-center gap-3">
                                {getStatusIcon(fileWithStatus.status)}
                                <button onClick={() => onFileRemove(fileWithStatus.id)} className="font-medium text-red-600 hover:text-red-500 disabled:opacity-50" disabled={disabled}>
                                    Remove
                                </button>
                            </div>
                             {fileWithStatus.error && (
                                <div className="w-full pl-7 mt-1">
                                    <p className="text-xs text-red-600 dark:text-red-400" role="alert">Error: {fileWithStatus.error}</p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
  );
};
