import React, { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '../../constants';
import type { ImageFile } from '../../types';

interface ImageDropzoneProps {
  onImageSelect: (imageFile: ImageFile) => void;
  selectedImage: ImageFile;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onImageSelect, selectedImage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return 'File type not supported. Please upload a JPEG, PNG, or WebP image.';
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 5MB limit. Please upload a smaller image.';
    }

    return null;
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validationError = validateFile(file);
      
      if (validationError) {
        setError(validationError);
        return;
      }
      
      setError(null);
      const reader = new FileReader();
      reader.onload = () => {
        onImageSelect({
          file,
          preview: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validationError = validateFile(file);
      
      if (validationError) {
        setError(validationError);
        return;
      }
      
      setError(null);
      const reader = new FileReader();
      reader.onload = () => {
        onImageSelect({
          file,
          preview: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const handleRemoveImage = useCallback(() => {
    onImageSelect({ file: null, preview: null });
    setError(null);
  }, [onImageSelect]);

  return (
    <div className="w-full">
      {!selectedImage.preview ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <Upload className="w-10 h-10 text-gray-400 mb-4" />
          <p className="text-gray-700 font-medium mb-1">Drag and drop your image here</p>
          <p className="text-gray-500 text-sm mb-4">or click to browse</p>
          <p className="text-gray-400 text-xs">
            Supported formats: JPEG, PNG, WebP (max 5MB)
          </p>
          <input
            id="file-input"
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
          />
        </div>
      ) : (
        <div className="relative border rounded-lg overflow-hidden">
          <img
            src={selectedImage.preview}
            alt="Selected"
            className="w-full h-auto object-contain"
          />
          <button
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            onClick={handleRemoveImage}
            aria-label="Remove image"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}
      
      {error && (
        <div className="mt-2 text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
};

export default ImageDropzone;