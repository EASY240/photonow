import React, { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '../../constants';
import type { ImageFile } from '../../types';

interface ImageDropzoneProps {
  onImageSelect: (imageFile: ImageFile) => void;
  selectedImage: ImageFile;
  disabled?: boolean;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onImageSelect, selectedImage, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, [disabled]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
  }, [disabled]);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return 'File type not supported. Please upload a JPEG or PNG image.';
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 5MB limit. Please upload a smaller image.';
    }

    return null;
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
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
  }, [onImageSelect, disabled]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
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
  }, [onImageSelect, disabled]);

  const handleRemoveImage = useCallback(() => {
    onImageSelect({ file: null, preview: null });
    setError(null);
  }, [onImageSelect]);

  return (
    <div className="w-full">
      {!selectedImage.preview ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors ${
            disabled
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
              : error
                ? 'border-red-500 bg-red-50 cursor-pointer'
                : isDragging
                  ? 'border-blue-500 bg-blue-50 cursor-pointer'
                  : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50 cursor-pointer'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={disabled ? undefined : () => document.getElementById('file-input')?.click()}
        >
          <Upload className="w-10 h-10 text-gray-400 mb-4" />
          <p className="text-gray-700 font-medium mb-1">Drag and drop your image here</p>
          <p className="text-gray-500 text-sm mb-4">or click to browse</p>
          <p className="text-gray-400 text-xs">
            Supported formats: JPEG, PNG (max 5MB)
          </p>
          <input
            id="file-input"
            type="file"
            className="hidden"
            accept="image/jpeg,image/png"
            onChange={handleFileSelect}
            disabled={disabled}
          />
        </div>
      ) : (
        <div className="relative border-2 border-green-500 rounded-lg overflow-hidden bg-green-50/40">
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
        <div className="mt-2 text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;
