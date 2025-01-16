'use client';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  questionType: string;
  questionId: number;
  onSave: (data: string, questionId: number) => void;
}

const UploadDialog: React.FC<UploadDialogProps> = ({ open, onClose, questionType, questionId, onSave }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      handleUpload(e.target.files[0]); // Automatically trigger upload when file is selected
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/file/upload_and_return_link`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const downloadLink = response.data?.file_url;
      console.log(downloadLink)
      if (downloadLink) {
        setInputValue(downloadLink); // Set the generated link to the input field
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    onSave(inputValue, questionId); // Pass the questionId when saving
    onClose();
  };

  useEffect(() => {
    setInputValue('');
    setFile(null);
  }, [questionId]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md space-y-4">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">{questionType === 'Text' ? 'Add Text' : 'Add Link'}</DialogTitle>
        </DialogHeader>

        {/* Conditional rendering based on questionType */}
        {questionType === 'Text' ? (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter your text"
            className="border border-gray-300 p-2 rounded-md w-full"
          />
        ) : (
          <>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter file link or upload a file"
              className="border border-gray-300 p-2 rounded-md w-full"
            />

            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <span>OR</span>
            </div>

            <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-md p-4 text-blue-500 cursor-pointer">
              <label className="cursor-pointer">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span>Browse or upload a file</span>
              </label>
            </div>

            {/* Show loader while uploading */}
            {uploading && (
              <div className="flex items-center justify-center mt-2">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-500">Uploading...</span>
              </div>
            )}
          </>
        )}

        <DialogFooter className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={!inputValue || uploading} // Disable while uploading or if no input value
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
