
import React, { useState, useEffect } from 'react';

interface PdfPreviewProps {
  file: File;
}

export const PdfPreview: React.FC<PdfPreviewProps> = ({ file }) => {
  const [fileUrl, setFileUrl] = useState<string>('');

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  if (!fileUrl) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Document Preview</h3>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden aspect-[8.5/11] max-h-[70vh] bg-gray-50 dark:bg-gray-900">
        <iframe
          src={`${fileUrl}#toolbar=0&navpanes=0`}
          title={`Preview of ${file.name}`}
          className="w-full h-full border-none"
          aria-label={`Preview of ${file.name}`}
        ></iframe>
      </div>
    </div>
  );
};
