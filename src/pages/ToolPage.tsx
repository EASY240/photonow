<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Download, Loader } from 'lucide-react';
=======
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Download, Loader, Brush } from 'lucide-react';
>>>>>>> 6cdeecb (Fix cleanup tool)
import SEO from '../components/ui/SEO';
import Button from '../components/ui/Button';
import ImageDropzone from '../components/ui/ImageDropzone';
import { tools } from '../data/tools';
<<<<<<< HEAD
import { processImage } from '../utils/api';
=======
import { processImage, uploadImageAndGetUrl, startCleanupJob, checkOrderStatus } from '../utils/api';
>>>>>>> 6cdeecb (Fix cleanup tool)
import type { ImageFile, ProcessedImage, Tool } from '../types';

const ToolPage: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const [selectedImage, setSelectedImage] = useState<ImageFile>({ file: null, preview: null });
  const [processedImage, setProcessedImage] = useState<ProcessedImage>({
    url: null,
    isLoading: false,
    error: null
  });
  
<<<<<<< HEAD
=======
  // AI Cleanup specific state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [canvasInitialized, setCanvasInitialized] = useState(false);
  
>>>>>>> 6cdeecb (Fix cleanup tool)
  // Find the tool based on the toolId param
  const tool = tools.find(t => t.id === toolId);
  
  // If tool not found, redirect to tools page
  if (!tool) {
    return <Navigate to="/tools" replace />;
  }
  
  const handleImageSelect = (imageFile: ImageFile) => {
    setSelectedImage(imageFile);
    // Reset processed image when a new image is selected
    setProcessedImage({
      url: null,
      isLoading: false,
      error: null
    });
<<<<<<< HEAD
  };
  
=======
    setCanvasInitialized(false);
  };
  
  // Initialize canvas for AI Cleanup
  const initializeCanvas = () => {
    if (!canvasRef.current || !selectedImage.preview || canvasInitialized) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Fill with black background (unmask area)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      setCanvasInitialized(true);
    };
    img.src = selectedImage.preview;
  };
  
  // Canvas drawing functions for AI Cleanup
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool?.id !== 'ai-cleanup') return;
    setIsDrawing(true);
    draw(e);
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || tool?.id !== 'ai-cleanup') return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#FFFFFF'; // White for mask area
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, 2 * Math.PI);
    ctx.fill();
  };
  
  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  
  // Convert canvas to File for AI Cleanup
  const canvasToFile = (): Promise<File> => {
    return new Promise((resolve, reject) => {
      if (!canvasRef.current) {
        reject(new Error('Canvas not available'));
        return;
      }
      
      canvasRef.current.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to convert canvas to blob'));
          return;
        }
        
        const file = new File([blob], 'mask.png', { type: 'image/png' });
        resolve(file);
      }, 'image/png');
    });
  };
  
  // AI Cleanup specific generate function
  const handleAICleanupGenerate = async () => {
    if (!selectedImage.file) return;
    
    setProcessedImage({
      url: null,
      isLoading: true,
      error: null
    });
    
    try {
      // Prepare images
      const originalImageFile = selectedImage.file;
      const maskFile = await canvasToFile();
      
      // Upload both images
      const originalFinalUrl = await uploadImageAndGetUrl(originalImageFile);
      const maskFinalUrl = await uploadImageAndGetUrl(maskFile);
      
      // Start the cleanup job
      const orderId = await startCleanupJob({
        originalImageUrl: originalFinalUrl,
        maskedImageUrl: maskFinalUrl
      });
      
      if (!orderId) {
        throw new Error('Failed to start cleanup job');
      }
      
      // Implement polling
      let pollCount = 0;
      const maxPolls = 6; // 18 seconds max (3 seconds * 6)
      
      const pollInterval = setInterval(async () => {
        try {
          const result = await checkOrderStatus(orderId);
          
          if (result.body?.status === 'active' && result.body?.output) {
            clearInterval(pollInterval);
            setProcessedImage({
              url: result.body.output,
              isLoading: false,
              error: null
            });
          } else if (result.body?.status === 'failed') {
            clearInterval(pollInterval);
            setProcessedImage({
              url: null,
              isLoading: false,
              error: 'AI cleanup failed. Please try again with a different image.'
            });
          } else {
            pollCount++;
            if (pollCount >= maxPolls) {
              clearInterval(pollInterval);
              setProcessedImage({
                url: null,
                isLoading: false,
                error: 'Processing timeout. Please try again.'
              });
            }
          }
        } catch (error) {
          clearInterval(pollInterval);
          setProcessedImage({
            url: null,
            isLoading: false,
            error: error instanceof Error ? error.message : 'An error occurred during processing'
          });
        }
      }, 3000);
      
      // Safety timeout
      setTimeout(() => {
        clearInterval(pollInterval);
        if (processedImage.isLoading) {
          setProcessedImage({
            url: null,
            isLoading: false,
            error: 'Processing timeout. Please try again.'
          });
        }
      }, 20000);
      
    } catch (error) {
      console.error('AI Cleanup error:', error);
      setProcessedImage({
        url: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  };
  
  // Initialize canvas when image is selected for AI Cleanup
  useEffect(() => {
    if (tool?.id === 'ai-cleanup' && selectedImage.preview && !canvasInitialized) {
      setTimeout(initializeCanvas, 100);
    }
  }, [selectedImage.preview, tool?.id, canvasInitialized]);
  
>>>>>>> 6cdeecb (Fix cleanup tool)
  const handleProcessImage = async () => {
    if (!selectedImage.file) return;
    
    setProcessedImage({
      url: null,
      isLoading: true,
      error: null
    });
    
    try {
      const resultUrl = await processImage(tool.apiEndpoint, selectedImage.file);
      
      setProcessedImage({
        url: resultUrl,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Processing error:', error);
      setProcessedImage({
        url: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred while processing the image'
      });
    }
  };
  
  const handleDownload = () => {
    if (!processedImage.url) return;
    
    const link = document.createElement('a');
    link.href = processedImage.url;
    link.download = `${tool.id}-result.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Clean up object URLs when component unmounts or when a new image is processed
  useEffect(() => {
    return () => {
      if (processedImage.url) {
        URL.revokeObjectURL(processedImage.url);
      }
    };
  }, [processedImage.url]);
  
  return (
    <>
      <SEO 
        title={tool.name} 
        description={`${tool.description}. Free online tool with instant results.`}
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {tool.name}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {tool.description}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">How to use {tool.name}</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
<<<<<<< HEAD
              <li>Upload your image using the tool below</li>
              <li>Click the "{tool.name}" button to process your image</li>
              <li>Wait for the AI to work its magic</li>
              <li>Download your result when processing is complete</li>
            </ol>
=======
              {tool.id === 'ai-cleanup' ? (
                <>
                  <li>Upload your image using the tool below</li>
                  <li>Use the brush to paint over the area you want to remove</li>
                  <li>Adjust brush size as needed for precision</li>
                  <li>Click "Generate" to process your image</li>
                  <li>Wait for the AI to intelligently fill in the selected space</li>
                  <li>Download your result when processing is complete</li>
                </>
              ) : (
                <>
                  <li>Upload your image using the tool below</li>
                  <li>Click the "{tool.name}" button to process your image</li>
                  <li>Wait for the AI to work its magic</li>
                  <li>Download your result when processing is complete</li>
                </>
              )}
            </ol>
            {tool.id === 'ai-cleanup' && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Upload an image, then use the brush to paint over the area you want to remove. The AI will intelligently fill in the selected space.
                </p>
              </div>
            )}
>>>>>>> 6cdeecb (Fix cleanup tool)
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Upload Image</h2>
              <ImageDropzone 
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
              />
<<<<<<< HEAD
              <Button 
                fullWidth 
                onClick={handleProcessImage}
                disabled={!selectedImage.file || processedImage.isLoading}
                isLoading={processedImage.isLoading}
              >
                {processedImage.isLoading ? 'Processing...' : tool.name}
=======
              
              {/* AI Cleanup specific controls */}
              {tool.id === 'ai-cleanup' && selectedImage.preview && (
                <div className="space-y-4">
                  <div className="relative border rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={selectedImage.preview} 
                      alt="Original" 
                      className="w-full h-auto block"
                      style={{ maxHeight: '400px', objectFit: 'contain' }}
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute top-0 left-0 w-full h-full cursor-crosshair"
                      style={{ mixBlendMode: 'multiply', opacity: 0.7 }}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                    />
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Brush size={16} />
                      <label className="text-sm font-medium">Brush Size:</label>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        className="w-20"
                      />
                      <span className="text-sm text-gray-600">{brushSize}px</span>
                    </div>
                    <Button
                      onClick={clearCanvas}
                      variant="outline"
                      size="sm"
                    >
                      Clear Mask
                    </Button>
                  </div>
                </div>
              )}
              
              <Button 
                fullWidth 
                onClick={tool.id === 'ai-cleanup' ? handleAICleanupGenerate : handleProcessImage}
                disabled={!selectedImage.file || processedImage.isLoading}
                isLoading={processedImage.isLoading}
              >
                {processedImage.isLoading ? 'Processing...' : (tool.id === 'ai-cleanup' ? 'Generate' : tool.name)}
>>>>>>> 6cdeecb (Fix cleanup tool)
              </Button>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Result</h2>
              {processedImage.isLoading ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center">
                  <Loader className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                  <p className="text-gray-700">Processing your image...</p>
                </div>
              ) : processedImage.url ? (
                <div className="space-y-4">
                  <div className="border rounded-lg overflow-hidden">
                    <img 
                      src={processedImage.url} 
                      alt="Processed result" 
                      className="w-full h-auto"
                    />
                  </div>
                  <Button 
                    fullWidth 
                    onClick={handleDownload}
                    leftIcon={<Download size={18} />}
                  >
                    Download Result
                  </Button>
                </div>
              ) : processedImage.error ? (
                <div className="border-2 border-dashed border-red-300 bg-red-50 rounded-lg p-8 flex flex-col items-center justify-center">
                  <p className="text-red-600 mb-2">Error</p>
                  <p className="text-gray-700 text-center">{processedImage.error}</p>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center">
                  <p className="text-gray-500">Upload and process an image to see the result here</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-12 bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">About {tool.name}</h2>
            <p className="text-gray-700 mb-4">
              Our {tool.name.toLowerCase()} tool uses advanced AI algorithms to {getToolDescription(tool)}. 
              This tool is perfect for photographers, designers, social media managers, and anyone who wants to enhance their images.
            </p>
            <p className="text-gray-700">
              Unlike other tools, ModernPhotoTools offers this service completely free with no watermarks.
              Try it now and see the difference!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper function to generate more detailed descriptions for each tool
function getToolDescription(tool: Tool): string {
  switch (tool.id) {
    case 'remove-background':
      return 'automatically detect and remove backgrounds from any image, leaving you with a clean subject that can be placed on any new background';
    case 'ai-cleanup':
<<<<<<< HEAD
      return 'automatically detect and fix imperfections, remove unwanted objects, and enhance the overall quality of your photos';
=======
      return 'automatically detect and fix imperfections, remove unwanted objects, and enhance the overall quality of your photos. Simply paint over the areas you want to remove and let AI intelligently fill in the space';
>>>>>>> 6cdeecb (Fix cleanup tool)
    case 'ai-expand':
      return 'intelligently expand your images beyond their original boundaries, adding realistic content that matches the original image';
    case 'ai-replace':
      return 'replace objects or areas in your images with AI-generated content that seamlessly blends with the rest of the image';
    case 'ai-cartoon':
      return 'transform your photos into cartoon-style artwork with various artistic styles';
    default:
      return 'transform and enhance your images with professional-quality results';
  }
}

export default ToolPage;