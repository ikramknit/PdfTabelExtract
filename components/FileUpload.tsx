import React, { useCallback, useState } from 'react';
import { PdfIcon, UploadIcon, FileGenericIcon, SpinnerIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from './icons/Icons';
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

  const renderStatus = (status: FileWithStatus['status']) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <ClockIcon className="flex-shrink-0 h-4 w-4" aria-label="Pending" />
            <span className="text-xs font-medium">Pending</span>
          </div>
        );
      case 'processing':
        return (
          <div className="flex items-center gap-1 text-indigo-500 dark:text-indigo-400">
            <SpinnerIcon className="flex-shrink-0 h-4 w-4" aria-label="Processing" />
            <span className="text-xs font-medium">Processing...</span>
          </div>
        );
      case 'done':
        return (
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <CheckCircleIcon className="flex-shrink-0 h-4 w-4" aria-label="Done" />
            <span className="text-xs font-medium">Done</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
            <XCircleIcon className="flex-shrink-0 h-4 w-4" aria-label="Error" />
            <span className="text-xs font-medium">Error</span>
          </div>
        );
      default:
        return null;
    }
  };


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
                        <li key={fileWithStatus.id} className="px-3 py-3 text-sm">
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                                <div className="w-0 flex-1 flex items-center min-w-0">
                                    {fileWithStatus.file.type === 'application/pdf' ? <PdfIcon className="flex-shrink-0 h-5 w-5 text-gray-400" /> : <FileGenericIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />}
                                    <span className="ml-2 flex-1 w-0 truncate text-gray-800 dark:text-gray-200" title={fileWithStatus.file.name}>{fileWithStatus.file.name}</span>
                                </div>
                                <div className="flex-shrink-0 flex items-center gap-3">
                                    {renderStatus(fileWithStatus.status)}
                                    <button onClick={() => onFileRemove(fileWithStatus.id)} className="font-medium text-red-600 hover:text-red-500 disabled:opacity-50 text-xs" disabled={disabled}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                            {fileWithStatus.error && (
                                <div className="pl-7 mt-1.5">
                                    <div className="p-2 rounded-md bg-red-50 dark:bg-red-900/30">
                                      <p className="text-xs text-red-700 dark:text-red-300" role="alert">{fileWithStatus.error}</p>
                                    </div>
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