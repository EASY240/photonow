import React, { useState, useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Download, Loader, Brush } from 'lucide-react';
import SEO from '../components/ui/SEO';
import Button from '../components/ui/Button';
import ImageDropzone from '../components/ui/ImageDropzone';
import { tools } from '../data/tools';
import { processImage, uploadImageAndGetUrl, startCleanupJob, startExpandJob, startReplaceJob, checkOrderStatus } from '../utils/api';
import type { ImageFile, ProcessedImage, Tool } from '../types';

const ToolPage: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const [selectedImage, setSelectedImage] = useState<ImageFile>({ file: null, preview: null });
  const [processedImage, setProcessedImage] = useState<ProcessedImage>({
    url: null,
    isLoading: false,
    error: null
  });
  
  // AI Cleanup specific state
  const imageRef = useRef<HTMLImageElement>(null);
  const visibleCanvasRef = useRef<HTMLCanvasElement>(null);
  const dataMaskCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [canvasInitialized, setCanvasInitialized] = useState(false);
  
  // AI Expand specific state
  const [padding, setPadding] = useState({
    top: 50,
    left: 50,
    bottom: 50,
    right: 50
  });
  
  // AI Replace specific state
  const replaceImageRef = useRef<HTMLImageElement>(null);
  const replaceVisibleCanvasRef = useRef<HTMLCanvasElement>(null);
  const replaceDataMaskCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isReplaceDrawing, setIsReplaceDrawing] = useState(false);
  const [replaceBrushSize, setReplaceBrushSize] = useState(20);
  const [replaceCanvasInitialized, setReplaceCanvasInitialized] = useState(false);
  const [textPrompt, setTextPrompt] = useState('');
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
    setCanvasInitialized(false);
    setReplaceCanvasInitialized(false);
  };
  
  // Handle image load for AI Cleanup - synchronizes canvas with displayed image
  const handleCleanupImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const image = event.target as HTMLImageElement;
    const visibleCanvas = visibleCanvasRef.current;
    const dataCanvas = dataMaskCanvasRef.current;
    
    if (!visibleCanvas || !dataCanvas) return;
    
    // Set canvas dimensions to match the displayed image size
    const displayWidth = image.clientWidth;
    const displayHeight = image.clientHeight;
    
    // Set both canvases to match displayed image dimensions
    visibleCanvas.width = displayWidth;
    visibleCanvas.height = displayHeight;
    dataCanvas.width = displayWidth;
    dataCanvas.height = displayHeight;
    
    // Initialize data canvas with black background (unmask area)
    const dataCtx = dataCanvas.getContext('2d');
    if (dataCtx) {
      dataCtx.fillStyle = '#000000';
      dataCtx.fillRect(0, 0, displayWidth, displayHeight);
    }
    
    // Clear visible canvas (transparent background)
    const visibleCtx = visibleCanvas.getContext('2d');
    if (visibleCtx) {
      visibleCtx.clearRect(0, 0, displayWidth, displayHeight);
    }
    
    setCanvasInitialized(true);
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
    if (!isDrawing || !visibleCanvasRef.current || !dataMaskCanvasRef.current || tool?.id !== 'ai-cleanup') return;
    
    const visibleCanvas = visibleCanvasRef.current;
    const dataCanvas = dataMaskCanvasRef.current;
    const visibleCtx = visibleCanvas.getContext('2d');
    const dataCtx = dataCanvas.getContext('2d');
    
    if (!visibleCtx || !dataCtx) return;
    
    const rect = visibleCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Draw semi-transparent red on visible canvas for user feedback
    visibleCtx.globalCompositeOperation = 'source-over';
    visibleCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    visibleCtx.beginPath();
    visibleCtx.arc(x, y, brushSize, 0, 2 * Math.PI);
    visibleCtx.fill();
    
    // Draw white on data canvas for API mask
    dataCtx.globalCompositeOperation = 'source-over';
    dataCtx.fillStyle = '#FFFFFF';
    dataCtx.beginPath();
    dataCtx.arc(x, y, brushSize, 0, 2 * Math.PI);
    dataCtx.fill();
  };
  
  const clearCanvas = () => {
    const visibleCanvas = visibleCanvasRef.current;
    const dataCanvas = dataMaskCanvasRef.current;
    
    if (visibleCanvas) {
      const visibleCtx = visibleCanvas.getContext('2d');
      if (visibleCtx) {
        visibleCtx.clearRect(0, 0, visibleCanvas.width, visibleCanvas.height);
      }
    }
    
    if (dataCanvas) {
      const dataCtx = dataCanvas.getContext('2d');
      if (dataCtx) {
        dataCtx.fillStyle = '#000000';
        dataCtx.fillRect(0, 0, dataCanvas.width, dataCanvas.height);
      }
    }
  };
  
  // Handle image load for AI Replace - synchronizes canvas with displayed image
  const handleReplaceImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const image = event.target as HTMLImageElement;
    const visibleCanvas = replaceVisibleCanvasRef.current;
    const dataCanvas = replaceDataMaskCanvasRef.current;
    
    if (!visibleCanvas || !dataCanvas) return;
    
    // Set canvas dimensions to match the displayed image size
    const displayWidth = image.clientWidth;
    const displayHeight = image.clientHeight;
    
    // Set both canvases to match displayed image dimensions
    visibleCanvas.width = displayWidth;
    visibleCanvas.height = displayHeight;
    dataCanvas.width = displayWidth;
    dataCanvas.height = displayHeight;
    
    // Initialize data canvas with black background (unmask area)
    const dataCtx = dataCanvas.getContext('2d');
    if (dataCtx) {
      dataCtx.fillStyle = '#000000';
      dataCtx.fillRect(0, 0, displayWidth, displayHeight);
    }
    
    // Clear visible canvas (transparent background)
    const visibleCtx = visibleCanvas.getContext('2d');
    if (visibleCtx) {
      visibleCtx.clearRect(0, 0, displayWidth, displayHeight);
    }
    
    setReplaceCanvasInitialized(true);
  };
  
  // Canvas drawing functions for AI Replace
  const startReplaceDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool?.id !== 'ai-replace') return;
    setIsReplaceDrawing(true);
    drawReplace(e);
  };
  
  const stopReplaceDrawing = () => {
    setIsReplaceDrawing(false);
  };
  
  const drawReplace = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isReplaceDrawing || !replaceVisibleCanvasRef.current || !replaceDataMaskCanvasRef.current || tool?.id !== 'ai-replace') return;
    
    const visibleCanvas = replaceVisibleCanvasRef.current;
    const dataCanvas = replaceDataMaskCanvasRef.current;
    const visibleCtx = visibleCanvas.getContext('2d');
    const dataCtx = dataCanvas.getContext('2d');
    
    if (!visibleCtx || !dataCtx) return;
    
    const rect = visibleCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Draw semi-transparent red on visible canvas for user feedback
    visibleCtx.globalCompositeOperation = 'source-over';
    visibleCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    visibleCtx.beginPath();
    visibleCtx.arc(x, y, replaceBrushSize, 0, 2 * Math.PI);
    visibleCtx.fill();
    
    // Draw white on data canvas for API mask
    dataCtx.globalCompositeOperation = 'source-over';
    dataCtx.fillStyle = '#FFFFFF';
    dataCtx.beginPath();
    dataCtx.arc(x, y, replaceBrushSize, 0, 2 * Math.PI);
    dataCtx.fill();
  };
  
  const clearReplaceCanvas = () => {
    const visibleCanvas = replaceVisibleCanvasRef.current;
    const dataCanvas = replaceDataMaskCanvasRef.current;
    
    if (visibleCanvas) {
      const visibleCtx = visibleCanvas.getContext('2d');
      if (visibleCtx) {
        visibleCtx.clearRect(0, 0, visibleCanvas.width, visibleCanvas.height);
      }
    }
    
    if (dataCanvas) {
      const dataCtx = dataCanvas.getContext('2d');
      if (dataCtx) {
        dataCtx.fillStyle = '#000000';
        dataCtx.fillRect(0, 0, dataCanvas.width, dataCanvas.height);
      }
    }
  };
  
  // Convert canvas to file for AI Replace
  const replaceCanvasToFile = (): Promise<File> => {
    return new Promise((resolve, reject) => {
      if (!replaceDataMaskCanvasRef.current) {
        reject(new Error('Canvas not found'));
        return;
      }
      
      replaceDataMaskCanvasRef.current.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create blob from canvas'));
          return;
        }
        
        const file = new File([blob], 'mask.png', { type: 'image/png' });
        resolve(file);
      }, 'image/png');
    });
  };
  
  // Convert canvas to File for AI Cleanup
  const canvasToFile = (): Promise<File> => {
    return new Promise((resolve, reject) => {
      if (!dataMaskCanvasRef.current) {
        reject(new Error('Canvas not available'));
        return;
      }
      
      dataMaskCanvasRef.current.toBlob((blob) => {
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
  
  const handleAIExpandGenerate = async () => {
    if (!selectedImage.file) return;
    
    setProcessedImage({
      url: null,
      isLoading: true,
      error: null
    });
    
    try {
      // Upload the image and get the URL
      const imageUrl = await uploadImageAndGetUrl(selectedImage.file);
      
      // Start the expand job
      const orderId = await startExpandJob({
        imageUrl,
        padding
      });
      
      if (!orderId) {
        throw new Error('Failed to start expand job');
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
              error: 'AI expand failed. Please try again with a different image.'
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
      console.error('AI Expand error:', error);
      setProcessedImage({
        url: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  };
  
  const handleAIReplaceGenerate = async () => {
    if (!selectedImage.file || !textPrompt.trim()) {
      setProcessedImage({
        url: null,
        isLoading: false,
        error: 'Please provide both an image and a text prompt'
      });
      return;
    }
    
    setProcessedImage({
      url: null,
      isLoading: true,
      error: null
    });
    
    try {
      // Upload the original image
      const originalImageUrl = await uploadImageAndGetUrl(selectedImage.file);
      
      // Get the mask from canvas and upload it
      const maskFile = await replaceCanvasToFile();
      const maskedImageUrl = await uploadImageAndGetUrl(maskFile);
      
      // Start the replace job
      const orderId = await startReplaceJob({
        originalImageUrl,
        maskedImageUrl,
        prompt: textPrompt
      });
      
      if (!orderId) {
        throw new Error('Failed to start replace job');
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
              error: 'AI replace failed. Please try again with a different image or prompt.'
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
      console.error('AI Replace error:', error);
      setProcessedImage({
        url: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  };
  
  // Canvas initialization is now handled by onLoad events on the image elements
  
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
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">How to use {tool.name}</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              {tool.id === 'ai-cleanup' ? (
                <>
                  <li>Upload your image using the tool below</li>
                  <li>Use the brush tool to paint over areas you want to remove</li>
                  <li>Adjust brush size as needed for precision</li>
                  <li>Click "Generate" to let AI intelligently fill the painted areas</li>
                  <li>Download your enhanced image when processing is complete</li>
                </>
              ) : tool.id === 'ai-expand' ? (
                <>
                  <li>Upload your image using the tool below</li>
                  <li>Adjust the padding values to specify how much to expand each side</li>
                  <li>Click "Generate" to let AI expand your image with new content</li>
                  <li>Download your expanded image when processing is complete</li>
                </>
              ) : tool.id === 'ai-replace' ? (
                <>
                  <li>Upload your image using the tool below</li>
                  <li>Use the brush tool to paint over areas you want to replace</li>
                  <li>Enter a text prompt describing what you want in the painted areas</li>
                  <li>Adjust brush size as needed for precision</li>
                  <li>Click "Generate" to let AI replace the painted areas with your prompt</li>
                  <li>Download your enhanced image when processing is complete</li>
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <ImageDropzone 
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
              />
               
              {/* AI Cleanup specific controls */}
              {tool.id === 'ai-cleanup' && selectedImage.preview && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <Brush className="w-4 h-4" />
                      <span className="text-sm font-medium">Brush Size:</span>
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600 w-8">{brushSize}px</span>
                  </div>
                  
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden" style={{ display: 'inline-block' }}>
                    <img
                      ref={imageRef}
                      src={selectedImage.preview}
                      alt="Selected"
                      className="w-full h-auto"
                      draggable={false}
                      onLoad={handleCleanupImageLoad}
                      style={{ maxWidth: '100%', display: 'block' }}
                    />
                    <canvas
                      ref={visibleCanvasRef}
                      className="absolute top-0 left-0 cursor-crosshair"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={() => setIsDrawing(false)}
                      onMouseLeave={() => setIsDrawing(false)}
                      style={{ zIndex: 10 }}
                    />
                    <canvas
                      ref={dataMaskCanvasRef}
                      style={{ display: 'none' }}
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={clearCanvas}
                    className="w-full"
                  >
                    Clear Mask
                  </Button>
                </div>
              )}
              
              {/* AI Expand specific controls */}
              {tool.id === 'ai-expand' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Padding Settings</h3>
                  <p className="text-sm text-gray-600">Specify how many pixels to add to each side of your image.</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Top Padding
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="500"
                        value={padding.top}
                        onChange={(e) => setPadding(prev => ({ ...prev, top: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bottom Padding
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="500"
                        value={padding.bottom}
                        onChange={(e) => setPadding(prev => ({ ...prev, bottom: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Left Padding
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="500"
                        value={padding.left}
                        onChange={(e) => setPadding(prev => ({ ...prev, left: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Right Padding
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="500"
                        value={padding.right}
                        onChange={(e) => setPadding(prev => ({ ...prev, right: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* AI Replace specific controls */}
              {tool.id === 'ai-replace' && selectedImage.preview && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <Brush className="w-4 h-4" />
                      <span className="text-sm font-medium">Brush Size:</span>
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={replaceBrushSize}
                      onChange={(e) => setReplaceBrushSize(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600 w-8">{replaceBrushSize}px</span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Prompt
                    </label>
                    <textarea
                      value={textPrompt}
                      onChange={(e) => setTextPrompt(e.target.value)}
                      placeholder="Describe what you want to replace the painted areas with..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                    />
                  </div>
                  
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden" style={{ display: 'inline-block' }}>
                    <img
                      ref={replaceImageRef}
                      src={selectedImage.preview}
                      alt="Selected"
                      className="w-full h-auto"
                      draggable={false}
                      onLoad={handleReplaceImageLoad}
                      style={{ maxWidth: '100%', display: 'block' }}
                    />
                    <canvas
                      ref={replaceVisibleCanvasRef}
                      className="absolute top-0 left-0 cursor-crosshair"
                      onMouseDown={startReplaceDrawing}
                      onMouseMove={drawReplace}
                      onMouseUp={() => setIsReplaceDrawing(false)}
                      onMouseLeave={() => setIsReplaceDrawing(false)}
                      style={{ zIndex: 10 }}
                    />
                    <canvas
                      ref={replaceDataMaskCanvasRef}
                      style={{ display: 'none' }}
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={clearReplaceCanvas}
                    className="w-full"
                  >
                    Clear Mask
                  </Button>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Paint over the areas you want to replace, then describe what you want in those areas using the text prompt above.
                    </p>
                  </div>
                </div>
              )}
               
              <Button 
                fullWidth 
                onClick={
                  tool.id === 'ai-cleanup' ? handleAICleanupGenerate :
                  tool.id === 'ai-expand' ? handleAIExpandGenerate :
                  tool.id === 'ai-replace' ? handleAIReplaceGenerate :
                  handleProcessImage
                }
                disabled={!selectedImage.file || processedImage.isLoading || (tool.id === 'ai-replace' && !textPrompt.trim())}
                isLoading={processedImage.isLoading}
              >
                {processedImage.isLoading ? 'Processing...' : 
                 (tool.id === 'ai-cleanup' || tool.id === 'ai-expand' || tool.id === 'ai-replace') ? 'Generate' : tool.name}
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
      return 'automatically detect and fix imperfections, remove unwanted objects, and enhance the overall quality of your photos. Simply paint over the areas you want to remove and let AI intelligently fill in the space';
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