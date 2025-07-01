import React, { useState, useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Download, Loader, Brush } from 'lucide-react';
import SEO from '../components/ui/SEO';
import Button from '../components/ui/Button';
import ImageDropzone from '../components/ui/ImageDropzone';
import { tools } from '../data/tools';
import { processImage, uploadImageAndGetUrl, startCleanupJob, startExpandJob, startReplaceJob, startCartoonJob, startCaricatureJob, startAvatarJob, checkOrderStatus, convertUrlToBlob, pollJobUntilComplete } from '../utils/api';
import type { ImageFile, ProcessedImage, Tool } from '../types';
import { maleCartoonStyles, femaleCartoonStyles } from '../constants/cartoonStyles';
import { caricatureStyles, Style } from '../constants/caricatureStyles';
import { avatarStyles, AvatarStyle } from '../constants/avatarStyles';

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
  
  // AI Cartoon specific state
  const [cartoonStyleChoice, setCartoonStyleChoice] = useState<'text' | 'image'>('text');
  const [cartoonTextPrompt, setCartoonTextPrompt] = useState('');
  const [cartoonStyleImage, setCartoonStyleImage] = useState<File | null>(null);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('female');
  const [selectedPresetUrl, setSelectedPresetUrl] = useState<string | null>(null);
  
  // AI Caricature specific state
  const [caricatureSelectedStyle, setCaricatureSelectedStyle] = useState<Style | null>(null);
  const [caricatureCustomStyleImage, setCaricatureCustomStyleImage] = useState<File | null>(null);
  const [caricatureTextPrompt, setCaricatureTextPrompt] = useState('');
  
  // AI Avatar specific state
  const [avatarSelectedGender, setAvatarSelectedGender] = useState<'male' | 'female'>('male');
  const [avatarSelectedStyle, setAvatarSelectedStyle] = useState<AvatarStyle | null>(null);
  const [avatarCustomStyleImage, setAvatarCustomStyleImage] = useState<File | null>(null);
  const [avatarTextPrompt, setAvatarTextPrompt] = useState('');
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

      const resultUrl = await pollJobUntilComplete(orderId);
      setProcessedImage({
        url: resultUrl,
        isLoading: false,
        error: null
      });
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

      const resultUrl = await pollJobUntilComplete(orderId);
      setProcessedImage({
        url: resultUrl,
        isLoading: false,
        error: null
      });
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
    
    console.log('Submitting to API with this prompt:', textPrompt);
    
    // Start the replace job
    const orderId = await startReplaceJob({
      originalImageUrl,
      maskedImageUrl,
      prompt: textPrompt
    });

    if (!orderId) {
      throw new Error('Failed to start replace job');
    }

    const resultUrl = await pollJobUntilComplete(orderId);
    setProcessedImage({
      url: resultUrl,
      isLoading: false,
      error: null
    });
    
  } catch (error) {
    console.error('AI Replace error:', error);
    setProcessedImage({
      url: null,
      isLoading: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
};

const handleAICartoonGenerate = async () => {
  if (!selectedImage.file) {
    setProcessedImage({ ...processedImage, error: 'Please select an image first.' });
    return;
  }

  setProcessedImage({ url: null, isLoading: true, error: null });

  try {
    // 1. Upload the main user image
    const mainImageUrl = await uploadImageAndGetUrl(selectedImage.file);

    // 2. Initialize final parameters
    let finalStyleImageUrl: string | undefined = undefined;
    let finalPrompt: string = "";

    // 3. Handle the two different style sources correctly
    if (selectedPresetUrl) {
      // === PATH A: USER CHOSE A PRESET STYLE ===
      finalPrompt = "cartoon style transformation"; // Default for preset
      console.log(`Processing preset style from URL: ${selectedPresetUrl}`);
      
      // Fetch the preset image and re-upload it
      const styleImageBlob = await convertUrlToBlob(selectedPresetUrl);
      finalStyleImageUrl = await uploadImageAndGetUrl(new File([styleImageBlob], "style.jpg", { type: 'image/jpeg' }));

    } else if (cartoonStyleImage) {
      // === PATH B: USER UPLOADED A CUSTOM STYLE IMAGE (THIS IS THE FIX) ===
      finalPrompt = cartoonTextPrompt; // CRITICAL: Get the prompt from the TEXTAREA state
      console.log("Processing CUSTOM uploaded style image.");

      // CRITICAL: Upload the user's local file directly
      finalStyleImageUrl = await uploadImageAndGetUrl(cartoonStyleImage);
    
    } else {
      // Path C: User is using TEXT-PROMPT ONLY
      finalPrompt = cartoonTextPrompt;
    }

    // 4. Clean debug logging (FIXED: removed problematic template literal)
    console.log('Main URL:', mainImageUrl);
    console.log('Style URL:', finalStyleImageUrl);
    console.log('Text Prompt:', finalPrompt);
    
    // 5. Start the cartoon job with corrected logic
    const orderId = await startCartoonJob({
      imageUrl: mainImageUrl,
      styleImageUrl: finalStyleImageUrl,
      textPrompt: finalPrompt || "cartoon style transformation" // ALWAYS send the prompt, never undefined
    });

    const resultUrl = await pollJobUntilComplete(orderId);
    setProcessedImage({ 
      url: resultUrl, 
      isLoading: false, 
      error: null 
    });

  } catch (error) {
    setProcessedImage({ 
      url: null, 
      isLoading: false, 
      error: (error as Error).message || 'An unknown error occurred.' 
    });
  }
};

const handleAICaricatureGenerate = async () => {
  if (!selectedImage.file) {
    console.error("No user image provided.");
    return;
  }
  
  // A style source (preset or custom) should be guaranteed by the disabled button logic
  if (!caricatureSelectedStyle && !caricatureCustomStyleImage) {
    setProcessedImage({ url: null, isLoading: false, error: 'Please select a style image before generating.' });
    return;
  }

  setProcessedImage({ url: null, isLoading: true, error: null });

  try {
    // 1. Upload the main user image
    const mainImageUrl = await uploadImageAndGetUrl(selectedImage.file);

    // 2. Initialize final parameters
    let finalStyleUrl: string | undefined = undefined;
    let finalPrompt: string = "";

    // 3. Handle the two different style sources correctly
    if (caricatureSelectedStyle) {
      // === PATH A: USER CHOSE A PRESET STYLE ===
      finalPrompt = caricatureSelectedStyle.prompt; // Get the prompt from the preset data
      console.log(`Processing PRESET style: ${caricatureSelectedStyle.name}`);
      
      // Fetch the preset image and re-upload it
      const styleImageBlob = await convertUrlToBlob(caricatureSelectedStyle.imageUrl);
      finalStyleUrl = await uploadImageAndGetUrl(new File([styleImageBlob], "style.jpeg", { type: 'image/jpeg' }));

    } else if (caricatureCustomStyleImage) {
      // === PATH B: USER UPLOADED A CUSTOM STYLE IMAGE (THIS IS THE FIX) ===
      finalPrompt = caricatureTextPrompt; // CRITICAL: Get the prompt from the TEXTAREA state
      console.log("Processing CUSTOM uploaded style image.");

      // CRITICAL: Upload the user's local file directly
      finalStyleUrl = await uploadImageAndGetUrl(caricatureCustomStyleImage);
    }

    // 4. Call the job with guaranteed valid data
    const orderId = await startCaricatureJob({
      imageUrl: mainImageUrl,
      styleImageUrl: finalStyleUrl,
      textPrompt: finalPrompt || "humorous artistic caricature"
    });

    const resultUrl = await pollJobUntilComplete(orderId);
    setProcessedImage({ 
      url: resultUrl, 
      isLoading: false, 
      error: null 
    });
  } catch (error) {
    console.error("An error occurred during caricature generation:", error);
    setProcessedImage({ 
      url: null, 
      isLoading: false, 
      error: (error as Error).message || 'An unknown error occurred.' 
    });
  }
};

const handleAIAvatarGenerate = async () => {
  if (!selectedImage.file) {
    console.error("No user image provided.");
    return;
  }
  
  // A style source (preset or custom) should be guaranteed by the disabled button logic
  if (!avatarSelectedStyle && !avatarCustomStyleImage) {
    setProcessedImage({ url: null, isLoading: false, error: 'Please select a style before generating.' });
    return;
  }

  setProcessedImage({ url: null, isLoading: true, error: null });

  try {
    // 1. Upload the main user image
    const mainImageUrl = await uploadImageAndGetUrl(selectedImage.file);

    // 2. Initialize final parameters
    let finalStyleUrl: string | undefined = undefined;
    let finalPrompt: string = "";

    // 3. Handle the two different style sources correctly
    if (avatarSelectedStyle) {
      // === PATH A: USER CHOSE A PRESET STYLE ===
      finalPrompt = avatarSelectedStyle.prompt; // Get the prompt from the preset data
      console.log(`Processing PRESET style: ${avatarSelectedStyle.name}`);
      
      // Fetch the preset image and re-upload it
      const styleImageBlob = await convertUrlToBlob(avatarSelectedStyle.imageUrl);
      finalStyleUrl = await uploadImageAndGetUrl(new File([styleImageBlob], "style.jpeg", { type: 'image/jpeg' }));

    } else if (avatarCustomStyleImage) {
      // === PATH B: USER UPLOADED A CUSTOM STYLE IMAGE (THIS IS THE FIX) ===
      finalPrompt = avatarTextPrompt; // CRITICAL: Get the prompt from the TEXTAREA state
      console.log("Processing CUSTOM uploaded style image.");

      // CRITICAL: Upload the user's local file directly
      finalStyleUrl = await uploadImageAndGetUrl(avatarCustomStyleImage);
    }

    // 4. Call the job with guaranteed valid data
    const orderId = await startAvatarJob({
      imageUrl: mainImageUrl,
      styleImageUrl: finalStyleUrl,
      textPrompt: finalPrompt || "A high-quality avatar"
    });

    const resultUrl = await pollJobUntilComplete(orderId);
    setProcessedImage({ 
      url: resultUrl, 
      isLoading: false, 
      error: null 
    });
  } catch (error) {
    console.error("An error occurred during avatar generation:", error);
    setProcessedImage({ 
      url: null, 
      isLoading: false, 
      error: (error as Error).message || 'An unknown error occurred.' 
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
              ) : tool.id === 'ai-cartoon' ? (
                <>
                  <li>Upload your photo using the tool below (works best with human faces)</li>
                  <li>Choose your stylization method: describe a style with text OR upload a style image</li>
                  <li>If using text: describe the cartoon style you want (e.g., "anime style", "Disney cartoon")</li>
                  <li>If using a style image: upload a reference image with the desired artistic style</li>
                  <li>Click "Generate" to transform your photo into cartoon artwork</li>
                  <li>Download your cartoonized image when processing is complete</li>
                </>
              ) : tool.id === 'ai-avatar' ? (
                <>
                  <li>Upload a clear photo of a human face using the tool below</li>
                  <li>Select your gender to see appropriate avatar styles</li>
                  <li>Choose from preset professional avatar styles OR upload your own style image</li>
                  <li>Optionally add a text prompt to customize the avatar further</li>
                  <li>Click "Generate" to create your professional avatar</li>
                  <li>Download your avatar when processing is complete</li>
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
                    
                    <div className="mt-2">
                      <span className="text-sm text-gray-600 mb-2 block">Try an example:</span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setTextPrompt('A beautiful cherry blossom tree')}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          Cherry Blossom Tree
                        </button>
                        <button
                          type="button"
                          onClick={() => setTextPrompt('Sunglasses with a futuristic design, cyberpunk style')}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          Futuristic Sunglasses
                        </button>
                        <button
                          type="button"
                          onClick={() => setTextPrompt('A classic red brick wall')}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          Red Brick Wall
                        </button>
                      </div>
                    </div>
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
                      style={{ zIndex: 10, opacity: 0.5 }}
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
                      <strong>Important Note:</strong> This tool generates a new image from your text. For best results:
                    </p>
                    <ul className="text-sm text-yellow-800 mt-2 ml-4 list-disc space-y-1">
                      <li>Describe what you want to see, don't give commands. (e.g., say "a tall sunflower," not "replace this with a sunflower").</li>
                      <li>The AI works best on images containing human faces. Results on objects or landscapes may vary.</li>
                    </ul>
                  </div>
                </div>
              )}
              
              {/* AI Cartoon specific controls */}
              {tool.id === 'ai-cartoon' && selectedImage.preview && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Persona</label>
                    <div className="flex gap-4">
                      <Button
                        variant={selectedGender === 'female' ? 'primary' : 'outline'}
                        onClick={() => setSelectedGender('female')}
                      >
                        Female
                      </Button>
                      <Button
                        variant={selectedGender === 'male' ? 'primary' : 'outline'}
                        onClick={() => setSelectedGender('male')}
                      >
                        Male
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Choose a Preset Style</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {(selectedGender === 'female' ? femaleCartoonStyles : maleCartoonStyles).map((style) => (
                        <div
                          key={style.imageUrl}
                          className={`cursor-pointer rounded-lg overflow-hidden border-2 ${selectedPresetUrl === style.imageUrl ? 'border-blue-500' : 'border-transparent'}`}
                          onClick={() => setSelectedPresetUrl(style.imageUrl)}
                        >
                          <img src={style.imageUrl} alt={style.name} className="w-full h-auto object-cover" />
                          <p className="text-center text-xs p-1 bg-gray-100">{style.name}</p>
                        </div>
                      ))}
                    </div>
                    {selectedPresetUrl && (
                      <Button variant="link" onClick={() => setSelectedPresetUrl(null)} className="mt-2 text-sm">
                        Clear Selection
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-700 text-center">Or Use a Custom Style</p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload a Style Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCartoonStyleImage(e.target.files?.[0] || null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!!selectedPresetUrl}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Describe a Style with Text</label>
                      <textarea
                        value={cartoonTextPrompt}
                        onChange={(e) => setCartoonTextPrompt(e.target.value)}
                        placeholder="e.g., 'anime style', 'Disney cartoon'..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={2}
                        disabled={!!selectedPresetUrl}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* AI Caricature specific controls */}
              {tool.id === 'ai-caricature' && selectedImage.preview && (
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> This tool works best with clear photos of human faces. Results on other subjects may vary.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Choose a Preset Style</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {caricatureStyles.map((style) => (
                        <div
                          key={style.imageUrl}
                          className={`cursor-pointer rounded-lg overflow-hidden border-2 ${caricatureSelectedStyle?.imageUrl === style.imageUrl ? 'border-blue-500' : 'border-transparent'}`}
                          onClick={() => setCaricatureSelectedStyle(style)}
                        >
                          <img src={style.imageUrl} alt={style.name} className="w-full h-auto object-cover" />
                          <p className="text-center text-xs p-1 bg-gray-100">{style.name}</p>
                        </div>
                      ))}
                    </div>
                    {caricatureSelectedStyle && (
                      <Button variant="link" onClick={() => setCaricatureSelectedStyle(null)} className="mt-2 text-sm">
                        Clear Selection
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-700 text-center">Or Use a Custom Style</p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload a Style Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCaricatureCustomStyleImage(e.target.files?.[0] || null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!!caricatureSelectedStyle}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Describe a Style with Text</label>
                      <textarea
                        value={caricatureTextPrompt}
                        onChange={(e) => setCaricatureTextPrompt(e.target.value)}
                        placeholder="Optional: Add descriptive text to modify your chosen style..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={2}
                        disabled={!!caricatureSelectedStyle}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* AI Avatar specific controls */}
              {tool.id === 'ai-avatar' && selectedImage.preview && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> This tool generates the best avatars from a single, clear photo of a human face.
                    </p>
                  </div>
                  
                  {/* Gender Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Gender</label>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setAvatarSelectedGender('male')}
                        className={`px-4 py-2 rounded-md border ${
                          avatarSelectedGender === 'male'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => setAvatarSelectedGender('female')}
                        className={`px-4 py-2 rounded-md border ${
                          avatarSelectedGender === 'female'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Female
                      </button>
                    </div>
                  </div>

                  {/* Preset Style Gallery */}
                  {avatarSelectedGender && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Choose a Preset Style</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {avatarStyles
                          .filter(style => style.gender === avatarSelectedGender)
                          .map((style) => (
                            <div
                              key={style.imageUrl}
                              className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                                avatarSelectedStyle?.imageUrl === style.imageUrl ? 'border-blue-500' : 'border-transparent'
                              }`}
                              onClick={() => setAvatarSelectedStyle(style)}
                            >
                              <img src={style.imageUrl} alt={style.name} className="w-full h-auto object-cover" />
                              <p className="text-center text-xs p-1 bg-gray-100">{style.name}</p>
                            </div>
                          ))
                        }
                      </div>
                      {avatarSelectedStyle && (
                        <Button variant="link" onClick={() => setAvatarSelectedStyle(null)} className="mt-2 text-sm">
                          Clear Selection
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Custom Style Section */}
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-700 text-center">Or Use a Custom Style</p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload a Style Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAvatarCustomStyleImage(e.target.files?.[0] || null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!!avatarSelectedStyle}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Text Prompt (Optional)</label>
                      <textarea
                        value={avatarTextPrompt}
                        onChange={(e) => setAvatarTextPrompt(e.target.value)}
                        placeholder="Optional: Describe the avatar style you want..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              )}
               
              <Button 
                fullWidth 
                onClick={
                  tool.id === 'ai-cleanup' ? handleAICleanupGenerate :
                  tool.id === 'ai-expand' ? handleAIExpandGenerate :
                  tool.id === 'ai-replace' ? handleAIReplaceGenerate :
                  tool.id === 'ai-cartoon' ? handleAICartoonGenerate :
                  tool.id === 'ai-caricature' ? handleAICaricatureGenerate :
                  tool.id === 'ai-avatar' ? handleAIAvatarGenerate :
                  handleProcessImage
                }
                disabled={!selectedImage.file || processedImage.isLoading || 
                  (tool.id === 'ai-caricature' && !caricatureSelectedStyle && !caricatureCustomStyleImage) ||
                  (tool.id === 'ai-avatar' && (!avatarSelectedGender || (!avatarSelectedStyle && !avatarCustomStyleImage)))}
                isLoading={processedImage.isLoading}
              >
                {processedImage.isLoading ? 'Processing...' : 
                 (tool.id === 'ai-cleanup' || tool.id === 'ai-expand' || tool.id === 'ai-replace' || tool.id === 'ai-cartoon' || tool.id === 'ai-caricature' || tool.id === 'ai-avatar') ? 'Generate' : tool.name}
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