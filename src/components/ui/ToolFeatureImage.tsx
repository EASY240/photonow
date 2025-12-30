import React, { useState } from 'react';

interface ToolFeatureImageProps {
  toolId: string;
  toolName: string;
  imagePath: string;
  altText: string;
  className?: string;
}

const ToolFeatureImage: React.FC<ToolFeatureImageProps> = ({
  toolId,
  toolName,
  imagePath,
  altText,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    console.error(`Failed to load tool image for ${toolName}:`, imagePath);
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Don't render anything if image failed to load
  if (imageError) {
    return null;
  }

  return (
    <div className={`tool-feature-image mb-8 mt-6 ${className}`}>
      <div className="relative">
        {!imageLoaded && (
          <div className="w-full max-w-2xl mx-auto h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
            <div className="text-gray-400 text-sm">Loading image...</div>
          </div>
        )}
        
        {imagePath && (
          <img 
            src={imagePath}
            alt={altText}
            data-tool-id={toolId}
            className={`w-full max-w-2xl mx-auto rounded-lg shadow-lg object-contain transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0 absolute top-0 left-0'
            }`}
            style={{
              maxHeight: '400px',
              objectFit: 'contain'
            }}
            loading={toolId === 'ai-replace' ? 'eager' : 'lazy'}
            fetchpriority={toolId === 'ai-replace' ? 'high' : 'auto'}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}
      </div>
      
      {/* Optional caption */}
      <div className="text-center mt-3">
        <p className="text-sm text-gray-500">
          {toolName} - Professional AI-powered photo editing
        </p>
      </div>
    </div>
  );
};

export default ToolFeatureImage;
