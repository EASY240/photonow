import React, { useState, useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Download, Loader, Brush, XCircle, HelpCircle } from 'lucide-react';
import SEO from '../components/ui/SEO';
import Button from '../components/ui/Button';
import ImageDropzone from '../components/ui/ImageDropzone';
import { tools } from '../data/tools';
import { processImage, uploadImageAndGetUrl, startCleanupJob, startExpandJob, startReplaceJob, startCartoonJob, startCaricatureJob, startAvatarJob, startProductPhotoshootJob, startBackgroundGeneratorJob, startImageGeneratorJob, startPortraitJob, startFaceSwapJob, startOutfitJob, startImageToImageJob, startSketchToImageJob, startHairstyleJob, startUpscaleJob, checkOrderStatus, convertUrlToBlob, pollJobUntilComplete } from '../utils/api';
import type { ImageFile, ProcessedImage, Tool, FaceSwapStyle } from '../types';
import { maleCartoonStyles, femaleCartoonStyles } from '../constants/cartoonStyles';
import { caricatureStyles, Style } from '../constants/caricatureStyles';
import { avatarStyles, AvatarStyle } from '../constants/avatarStyles';
import { productStyles, suggestedPrompts, type ProductStyle } from '../constants/productStyles';
import { imageResolutions, suggestedPrompts as imageGeneratorPrompts, type ImageResolution } from '../constants/imageGeneratorOptions';
import { portraitStyles, suggestedPortraitPrompts, type PortraitStyle } from '../constants/portraitStyles';
import { faceSwapStyles } from '../constants/faceSwapStyles';
import { presetOutfitStyles, suggestedOutfitPrompts, type OutfitStyle } from '../constants/outfitStyles';
import { suggestedHairstylePrompts } from '../constants/hairstylePrompts';

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

  const [cleanupBrushSize, setCleanupBrushSize] = useState(20);
  const [canvasInitialized, setCanvasInitialized] = useState(false);
  const [isMaskDrawn, setIsMaskDrawn] = useState(false);
  
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
  
  // AI Product Photoshoot specific state
  const [selectedProductStyle, setSelectedProductStyle] = useState<ProductStyle | null>(null);
  const [productCustomStyleImage, setProductCustomStyleImage] = useState<File | null>(null);
  const [productTextPrompt, setProductTextPrompt] = useState('');
  
  // AI Background Generator specific state
  const [backgroundTextPrompt, setBackgroundTextPrompt] = useState('');
  
  // AI Image Generator specific state
  const [imageGeneratorTextPrompt, setImageGeneratorTextPrompt] = useState('');
  const [selectedResolution, setSelectedResolution] = useState<ImageResolution>(imageResolutions[0]); // Default to square
  
  // AI Portrait specific state
  const [portraitSelectedGender, setPortraitSelectedGender] = useState<'male' | 'female'>('female');
  const [portraitSelectedStyle, setPortraitSelectedStyle] = useState<PortraitStyle | null>(null);
  const [portraitCustomStyleImage, setPortraitCustomStyleImage] = useState<File | null>(null);
  const [portraitTextPrompt, setPortraitTextPrompt] = useState('');
  
  // AI Face Swap specific state
  const [faceSwapTargetImage, setFaceSwapTargetImage] = useState<ImageFile>({ file: null, preview: null });
  const [faceSwapSourceImage, setFaceSwapSourceImage] = useState<ImageFile>({ file: null, preview: null });
  const [selectedFaceSwapPreset, setSelectedFaceSwapPreset] = useState<FaceSwapStyle | null>(null);
  
  // AI Outfit specific state
  const [outfitTextPrompt, setOutfitTextPrompt] = useState('');
  
  // AI Image to Image specific state
  const [i2iMainImage, setI2iMainImage] = useState<ImageFile>({ file: null, preview: null });
  const [i2iStyleImage, setI2iStyleImage] = useState<ImageFile>({ file: null, preview: null });
  const [i2iTextPrompt, setI2iTextPrompt] = useState('');
  const [i2iStrength, setI2iStrength] = useState(0.5); // Default value from 0.0 to 1.0
  const [i2iStyleStrength, setI2iStyleStrength] = useState(0.9); // Default value from 0.0 to 1.0
  
  // AI Sketch to Image specific state
  const [s2iInputMode, setS2iInputMode] = useState<'draw' | 'upload'>('upload'); // To switch between drawing and uploading
  const [s2iSketchImage, setS2iSketchImage] = useState<ImageFile>({ file: null, preview: null });
  const [s2iStyleImage, setS2iStyleImage] = useState<ImageFile>({ file: null, preview: null });
  const [s2iTextPrompt, setS2iTextPrompt] = useState('');
  const [s2iStrength, setS2iStrength] = useState(0.8); // Higher default to respect sketch more
  const [s2iStyleStrength, setS2iStyleStrength] = useState(0.5); // Lower default
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null); // For the drawing canvas
  const [isDrawingSketch, setIsDrawingSketch] = useState(false);
  const [s2iBrushSize, setS2iBrushSize] = useState(5);
  const [s2iBrushColor, setS2iBrushColor] = useState('#000000');
  
  // AI Hairstyle state
  const [hairstyleTextPrompt, setHairstyleTextPrompt] = useState('');
  
  // AI Image Upscaler state
  const [upscaleFactor, setUpscaleFactor] = useState<2 | 4>(2);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [availableUpscaleOptions, setAvailableUpscaleOptions] = useState<(2 | 4)[]>([2, 4]);
  
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
    setIsMaskDrawn(false);
    setImageDimensions(null); // Reset dimensions on new image select

    if (imageFile.file && imageFile.preview) {
      const img = new Image();
      img.onload = () => {
        // We have the dimensions! Store them in state.
        const dimensions = { width: img.naturalWidth, height: img.naturalHeight };
        console.log("Image dimensions:", dimensions);
        setImageDimensions(dimensions);

        // --- THE VALIDATION LOGIC ---
        const longestSide = Math.max(dimensions.width, dimensions.height);
        if (longestSide > 2048) {
          setAvailableUpscaleOptions([]); // No options available
          setProcessedImage({ url: null, isLoading: false, error: "Image is too large (max 2048px on longest side) and cannot be upscaled." });
        } else if (longestSide > 1024) {
          setAvailableUpscaleOptions([2]); // Only 2x is available
          setUpscaleFactor(2); // Automatically select 2x
        } else {
          setAvailableUpscaleOptions([2, 4]); // Both 2x and 4x are available
          setUpscaleFactor(2); // Default to 2x
        }
      };
      img.src = imageFile.preview;
    }
  };

const handleAIFaceSwapGenerate = async () => {
  // Validate that we have a target image
  if (!faceSwapTargetImage.file) {
    setProcessedImage({ url: null, isLoading: false, error: 'Please upload a target image.' });
    return;
  }
  
  // Validate that we have a source face (either preset or uploaded)
  if (!selectedFaceSwapPreset && !faceSwapSourceImage.file) {
    setProcessedImage({ url: null, isLoading: false, error: 'Please select a preset face or upload a source face image.' });
    return;
  }
  
  setProcessedImage({ url: null, isLoading: true, error: null });

  try {
    // 1. Upload target image
    const targetImageUrl = await uploadImageAndGetUrl(faceSwapTargetImage.file);

    // 2. Get source face image URL
    let sourceImageUrl: string;
    
    if (selectedFaceSwapPreset) {
      // Use preset face - convert URL to blob and upload
      const sourceImageBlob = await convertUrlToBlob(selectedFaceSwapPreset.imageUrl);
      sourceImageUrl = await uploadImageAndGetUrl(new File([sourceImageBlob], "source-face.jpeg", { type: 'image/jpeg' }));
    } else {
      // Use uploaded source image
      sourceImageUrl = await uploadImageAndGetUrl(faceSwapSourceImage.file!);
    }

    // 3. Start face swap job
    const orderId = await startFaceSwapJob({
      imageUrl: targetImageUrl,
      styleImageUrl: sourceImageUrl,
    });

    // 4. Poll until complete
    const resultUrl = await pollJobUntilComplete(orderId);

    // 5. Display the result
    setProcessedImage({ url: resultUrl, isLoading: false, error: null });

  } catch (error) {
    console.error("An error occurred during face swap generation:", error);
    setProcessedImage({ url: null, isLoading: false, error: (error as Error).message });
  }
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
    if (!isDrawing || tool?.id !== 'ai-cleanup') return;
    
    const { x, y } = getCoordinatesFromEvent(e.nativeEvent);
    drawAtPoint(x, y);
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
    
    setIsMaskDrawn(false);
  };
  
  // Helper function to get coordinates from mouse or touch events
  const getCoordinatesFromEvent = (event: MouseEvent | Touch): { x: number; y: number } => {
    const canvas = visibleCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };
  
  // Function to draw at a specific point (used by both mouse and touch)
  const drawAtPoint = (x: number, y: number) => {
    if (!visibleCanvasRef.current || !dataMaskCanvasRef.current || tool?.id !== 'ai-cleanup') return;
    
    const visibleCanvas = visibleCanvasRef.current;
    const dataCanvas = dataMaskCanvasRef.current;
    const visibleCtx = visibleCanvas.getContext('2d');
    const dataCtx = dataCanvas.getContext('2d');
    
    if (!visibleCtx || !dataCtx) return;
    
    // Set mask drawn flag on first draw
    if (!isMaskDrawn) {
      setIsMaskDrawn(true);
    }
    
    // Draw semi-transparent red on visible canvas for user feedback
    visibleCtx.globalCompositeOperation = 'source-over';
    visibleCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    visibleCtx.beginPath();
    visibleCtx.arc(x, y, cleanupBrushSize, 0, 2 * Math.PI);
    visibleCtx.fill();
    
    // Draw white on data canvas for API mask
    dataCtx.globalCompositeOperation = 'source-over';
    dataCtx.fillStyle = '#FFFFFF';
    dataCtx.beginPath();
    dataCtx.arc(x, y, cleanupBrushSize, 0, 2 * Math.PI);
    dataCtx.fill();
  };
  
  // Touch event handlers for AI Cleanup
  const handleDrawStart = (event: React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    event.preventDefault(); // Prevent page scrolling
    const touch = event.touches[0];
    const { x, y } = getCoordinatesFromEvent(touch);
    drawAtPoint(x, y);
  };
  
  const handleDrawMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    event.preventDefault();
    const touch = event.touches[0];
    const { x, y } = getCoordinatesFromEvent(touch);
    drawAtPoint(x, y);
  };
  
  const handleDrawEnd = () => {
    setIsDrawing(false);
  };
  
  // Clear selection handler functions
  const handleCartoonClearSelection = () => {
    setSelectedPresetUrl(null);
  };
  
  const handleCaricatureClearSelection = () => {
    setCaricatureSelectedStyle(null);
  };
  
  const handleAvatarClearSelection = () => {
    setAvatarSelectedStyle(null);
  };
  
  const handleProductClearSelection = () => {
    setSelectedProductStyle(null);
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
    
    // --- VALIDATION: Check if mask is drawn ---
    if (!isMaskDrawn) {
      setProcessedImage({
        url: null,
        isLoading: false,
        error: 'Error: Please paint over the area you want to clean up before generating.'
      });
      return;
    }
    // --- END OF VALIDATION ---
    
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

const handleAIPortraitGenerate = async () => {
  if (!selectedImage.file) {
    console.error("No user image provided.");
    return;
  }
  
  // A style source (preset or custom) should be guaranteed by the disabled button logic
  if (!portraitSelectedStyle && !portraitCustomStyleImage) {
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
    if (portraitSelectedStyle) {
      // === PATH A: USER CHOSE A PRESET STYLE ===
      finalPrompt = portraitSelectedStyle.prompt; // Get the prompt from the preset data
      console.log(`Processing PRESET style: ${portraitSelectedStyle.name}`);
      
      // Fetch the preset image and re-upload it
      const styleImageBlob = await convertUrlToBlob(portraitSelectedStyle.imageUrl);
      finalStyleUrl = await uploadImageAndGetUrl(new File([styleImageBlob], "style.jpeg", { type: 'image/jpeg' }));

    } else if (portraitCustomStyleImage) {
      // === PATH B: USER UPLOADED A CUSTOM STYLE IMAGE ===
      finalPrompt = portraitTextPrompt; // Get the prompt from the TEXTAREA state
      console.log("Processing CUSTOM uploaded style image.");

      // Upload the user's local file directly
      finalStyleUrl = await uploadImageAndGetUrl(portraitCustomStyleImage);
    }

    // 4. Call the job with guaranteed valid data
    const orderId = await startPortraitJob({
      imageUrl: mainImageUrl,
      styleImageUrl: finalStyleUrl,
      textPrompt: finalPrompt || "A high-quality portrait"
    });

    const resultUrl = await pollJobUntilComplete(orderId);
    setProcessedImage({ 
      url: resultUrl, 
      isLoading: false, 
      error: null 
    });
  } catch (error) {
    console.error("An error occurred during portrait generation:", error);
    setProcessedImage({ 
      url: null, 
      isLoading: false, 
      error: (error as Error).message || 'An unknown error occurred.' 
    });
  }
};

const handleAIProductPhotoshootGenerate = async () => {
  if (!selectedImage.file) {
    console.error("No user image provided.");
    return;
  }
  
  // A style source (preset, custom image, or text) is needed
  if (!selectedProductStyle && !productCustomStyleImage && !productTextPrompt) {
    setProcessedImage({ url: null, isLoading: false, error: 'Please select a style, upload a style image, or enter a text prompt.' });
    return;
  }

  setProcessedImage({ url: null, isLoading: true, error: null });

  try {
    // 1. Upload the main product image
    const mainImageUrl = await uploadImageAndGetUrl(selectedImage.file);

    // 2. Initialize final parameters
    let finalStyleUrl: string | undefined = undefined;
    let finalPrompt: string = "";

    // 3. Correctly determine the style source and prepare parameters
    if (selectedProductStyle) {
      // Path A: User chose a PRESET style
      finalPrompt = selectedProductStyle.prompt;
      console.log(`Processing PRESET style: ${selectedProductStyle.name}`);
      
      // Fetch the preset image and re-upload it
      const styleImageBlob = await convertUrlToBlob(selectedProductStyle.imageUrl);
      finalStyleUrl = await uploadImageAndGetUrl(new File([styleImageBlob], "style.jpeg", { type: 'image/jpeg' }));

    } else if (productCustomStyleImage) {
      // Path B: User uploaded a CUSTOM style image
      finalPrompt = productTextPrompt; // Use the text from the textarea
      console.log("Processing CUSTOM uploaded style image.");
      
      // Upload the user's local file directly
      finalStyleUrl = await uploadImageAndGetUrl(productCustomStyleImage);
    } else {
      // Path C: User is using ONLY a text prompt
      finalPrompt = productTextPrompt;
    }

    // 4. Call the API job function with all parameters
    const orderId = await startProductPhotoshootJob({
      imageUrl: mainImageUrl,
      styleImageUrl: finalStyleUrl,
      textPrompt: finalPrompt,
    });

    // 5. Use our robust, unified poller to get the result
    const resultUrl = await pollJobUntilComplete(orderId);
    setProcessedImage({ 
      url: resultUrl, 
      isLoading: false, 
      error: null 
    });

  } catch (error) {
    console.error("An error occurred during product photo generation:", error);
    setProcessedImage({ 
      url: null, 
      isLoading: false, 
      error: (error as Error).message || 'An unknown error occurred.' 
    });
  }
};

const handleAIBackgroundGeneratorGenerate = async () => {
  if (!selectedImage.file) {
    setProcessedImage({ url: null, isLoading: false, error: 'Please select an image first.' });
    return;
  }

  if (!backgroundTextPrompt.trim()) {
    setProcessedImage({ url: null, isLoading: false, error: 'Please enter a text prompt describing the background you want.' });
    return;
  }

  setProcessedImage({ url: null, isLoading: true, error: null });

  try {
    // Upload the main image
    const mainImageUrl = await uploadImageAndGetUrl(selectedImage.file);

    // Start the background generator job
    const orderId = await startBackgroundGeneratorJob({
      imageUrl: mainImageUrl,
      textPrompt: backgroundTextPrompt
    });

    // Poll for completion
    const resultUrl = await pollJobUntilComplete(orderId);
    setProcessedImage({ 
      url: resultUrl, 
      isLoading: false, 
      error: null 
    });

  } catch (error) {
    console.error('An error occurred during background generation:', error);
    setProcessedImage({ 
      url: null, 
      isLoading: false, 
      error: (error as Error).message || 'An unknown error occurred.' 
    });
  }
};

// Add this function to resize images client-side if needed
const resizeImageToResolution = async (imageUrl: string, targetWidth: number, targetHeight: number): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      resolve(canvas.toDataURL('image/png'));
    };
    
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
  });
};

const handleAIImageGeneratorGenerate = async () => {
  if (!imageGeneratorTextPrompt.trim()) {
    setProcessedImage({ url: null, isLoading: false, error: 'Please enter a text prompt describing the image you want to generate.' });
    return;
  }

  setProcessedImage({ url: null, isLoading: true, error: null });

  try {
    // Start the image generator job
    const orderId = await startImageGeneratorJob({
      textPrompt: imageGeneratorTextPrompt,
      width: selectedResolution.width,
      height: selectedResolution.height
    });

    // Poll for completion
    const resultUrl = await pollJobUntilComplete(orderId);

    // Optionally resize to match selected resolution
    const resizedUrl = await resizeImageToResolution(
      resultUrl, 
      selectedResolution.width, 
      selectedResolution.height
    );

    setProcessedImage({ 
      url: resizedUrl, 
      isLoading: false, 
      error: null 
    });

  } catch (error) {
    console.error('An error occurred during image generation:', error);
    setProcessedImage({ 
      url: null, 
      isLoading: false, 
      error: (error as Error).message || 'An unknown error occurred.' 
    });
  }
};

const handleAIOutfitGenerate = async () => {
  if (!selectedImage.file) {
    setProcessedImage({ url: null, isLoading: false, error: 'Please upload an image.' });
    return;
  }
  
  if (!outfitTextPrompt.trim()) {
    setProcessedImage({ url: null, isLoading: false, error: 'Please enter a text prompt describing the outfit you want.' });
    return;
  }

  setProcessedImage({ url: null, isLoading: true, error: null });

  try {
    // 1. Upload the image
    const imageUrl = await uploadImageAndGetUrl(selectedImage.file);

    // 2. Start the outfit job
    const orderId = await startOutfitJob({
      imageUrl: imageUrl,
      textPrompt: outfitTextPrompt,
    });

    // 3. Poll until complete
    const resultUrl = await pollJobUntilComplete(orderId);

    // 4. Display the result
    setProcessedImage({ url: resultUrl, isLoading: false, error: null });

  } catch (error) {
    console.error("An error occurred during outfit generation:", error);
    setProcessedImage({ url: null, isLoading: false, error: (error as Error).message });
  }
};

const handleAIImageToImageGenerate = async () => {
  if (!i2iMainImage.file) {
    setProcessedImage({ url: null, isLoading: false, error: 'Please upload a main image.' });
    return;
  }
  
  if (!i2iTextPrompt.trim()) {
    setProcessedImage({ url: null, isLoading: false, error: 'Please enter a text prompt describing the transformation you want.' });
    return;
  }

  setProcessedImage({ url: null, isLoading: true, error: null });

  try {
    // 1. Upload the main image
    const mainImageUrl = await uploadImageAndGetUrl(i2iMainImage.file);
    console.log('DEBUG: mainImageUrl after upload:', mainImageUrl);

    // 2. Upload style image if provided
    let styleImageUrl: string | undefined;
    if (i2iStyleImage.file) {
      styleImageUrl = await uploadImageAndGetUrl(i2iStyleImage.file);
      console.log('DEBUG: styleImageUrl after upload:', styleImageUrl);
    }

    // 3. Start the image-to-image job
    const jobParams = {
      imageUrl: mainImageUrl,
      textPrompt: i2iTextPrompt,
      styleImageUrl: styleImageUrl,
      strength: i2iStrength,
      styleStrength: i2iStyleImage.file ? i2iStyleStrength : undefined,
    };
    console.log('DEBUG: jobParams before API call:', jobParams);
    
    const orderId = await startImageToImageJob(jobParams);

    // 4. Poll until complete
    const resultUrl = await pollJobUntilComplete(orderId);

    // 5. Display the result
    setProcessedImage({ url: resultUrl, isLoading: false, error: null });

  } catch (error) {
     console.error("An error occurred during image-to-image generation:", error);
     setProcessedImage({ url: null, isLoading: false, error: (error as Error).message });
   }
 };

 const handleAISketchToImageGenerate = async () => {
   // Validation
   if (s2iInputMode === 'upload' && !s2iSketchImage.file) {
     setProcessedImage({ url: null, isLoading: false, error: 'Please upload a sketch image.' });
     return;
   }
   
   if (s2iInputMode === 'draw') {
     const canvas = drawingCanvasRef.current;
     if (!canvas) {
       setProcessedImage({ url: null, isLoading: false, error: 'Drawing canvas not available.' });
       return;
     }
     
     // Check if canvas has any drawing (not just white)
     const ctx = canvas.getContext('2d');
     if (!ctx) {
       setProcessedImage({ url: null, isLoading: false, error: 'Cannot access drawing canvas.' });
       return;
     }
     
     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
     const data = imageData.data;
     let hasDrawing = false;
     
     // Check if any pixel is not white (255, 255, 255)
     for (let i = 0; i < data.length; i += 4) {
       if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) {
         hasDrawing = true;
         break;
       }
     }
     
     if (!hasDrawing) {
       setProcessedImage({ url: null, isLoading: false, error: 'Please draw something on the canvas first.' });
       return;
     }
   }
   
   if (!s2iTextPrompt.trim()) {
     setProcessedImage({ url: null, isLoading: false, error: 'Please enter a text prompt describing the final image you want.' });
     return;
   }

   setProcessedImage({ url: null, isLoading: true, error: null });

   try {
     let sketchImageUrl: string;
     
     if (s2iInputMode === 'upload') {
       // Upload the sketch file
       sketchImageUrl = await uploadImageAndGetUrl(s2iSketchImage.file!);
     } else {
       // Convert canvas to blob and upload
       const canvas = drawingCanvasRef.current!;
       const blob = await new Promise<Blob>((resolve) => {
         canvas.toBlob((blob) => resolve(blob!), 'image/png');
       });
       
       sketchImageUrl = await uploadImageAndGetUrl(blob);
     }
     
     console.log('DEBUG: sketchImageUrl after upload:', sketchImageUrl);

     // Upload style image if provided
     let styleImageUrl: string | undefined;
     if (s2iStyleImage.file) {
       styleImageUrl = await uploadImageAndGetUrl(s2iStyleImage.file);
       console.log('DEBUG: styleImageUrl after upload:', styleImageUrl);
     }

     // Start the sketch-to-image job
     const jobParams = {
       imageUrl: sketchImageUrl,
       textPrompt: s2iTextPrompt,
       strength: s2iStrength,
       styleImageUrl: styleImageUrl,
       styleStrength: s2iStyleImage.file ? s2iStyleStrength : undefined,
     };
     console.log('DEBUG: sketch-to-image jobParams before API call:', jobParams);
     
     const orderId = await startSketchToImageJob(jobParams);

     // Poll until complete
     const resultUrl = await pollJobUntilComplete(orderId);

     // Display the result
     setProcessedImage({ url: resultUrl, isLoading: false, error: null });

   } catch (error) {
     console.error("An error occurred during sketch-to-image generation:", error);
     setProcessedImage({ url: null, isLoading: false, error: (error as Error).message });
   }
 };

 const handleAIHairstyleGenerate = async () => {
   // Validate that we have an image
   if (!selectedImage.file) {
     setProcessedImage({ url: null, isLoading: false, error: 'Please upload an image.' });
     return;
   }
   
   // Validate that we have a text prompt
   if (!hairstyleTextPrompt.trim()) {
     setProcessedImage({ url: null, isLoading: false, error: 'Please enter a hairstyle description.' });
     return;
   }
   
   setProcessedImage({ url: null, isLoading: true, error: null });
 
   try {
     // Upload the image
     const imageUrl = await uploadImageAndGetUrl(selectedImage.file);
 
     // Start the hairstyle job
     const orderId = await startHairstyleJob({
       imageUrl: imageUrl,
       textPrompt: hairstyleTextPrompt,
     });
 
     // Poll until complete
     const resultUrl = await pollJobUntilComplete(orderId);
 
     // Display the result
     setProcessedImage({ url: resultUrl, isLoading: false, error: null });
 
   } catch (error) {
     console.error("An error occurred during hairstyle generation:", error);
     setProcessedImage({ url: null, isLoading: false, error: (error as Error).message });
   }
 };

 const handleAIUpscalerGenerate = async () => {
   if (!selectedImage.file) { return; }
   
   setProcessedImage({ url: null, isLoading: true, error: null });

   try {
       // 1. Upload the main image.
       const mainImageUrl = await uploadImageAndGetUrl(selectedImage.file);
       
       // 2. Call the API job function with the user's selected (and validated) factor.
       const orderId = await startUpscaleJob({
           imageUrl: mainImageUrl,
           quality: upscaleFactor,
       });

       // 3. Use our unified poller to get the result.
       const resultUrl = await pollJobUntilComplete(orderId);

       // 4. Display the upscaled image.
       setProcessedImage({ url: resultUrl, isLoading: false, error: null });

   } catch (error) {
       console.error("An error occurred during image upscaling:", error);
       setProcessedImage({ url: null, isLoading: false, error: (error as Error).message });
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

  // Initialize canvas with white background when drawing mode is selected
  useEffect(() => {
    if (tool.id === 'ai-sketch-to-image' && s2iInputMode === 'draw' && drawingCanvasRef.current) {
      const canvas = drawingCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set canvas size
        canvas.width = 512;
        canvas.height = 512;
        // Fill with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Set drawing properties
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [tool.id, s2iInputMode]);
  
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
              ) : tool.id === 'ai-portrait' ? (
                <>
                  <li>Upload a clear photo of a person's face using the tool below</li>
                  <li>Select your gender to see appropriate portrait styles</li>
                  <li>Choose from preset realistic portrait styles OR upload your own style image</li>
                  <li>Use suggested prompts or add your own text prompt to customize the portrait</li>
                  <li>Click "Generate" to create your realistic portrait</li>
                  <li>Download your portrait when processing is complete</li>
                </>
              ) : tool.id === 'ai-face-swap' ? (
                <>
                  <li>Upload a target image (the photo you want to modify) using the first dropzone</li>
                  <li>Either choose a preset face from the gallery OR upload your own source face image</li>
                  <li>Click "Generate" to swap the faces</li>
                  <li>Download your face-swapped image when processing is complete</li>
                </>
              ) : tool.id === 'ai-product-photoshoot' ? (
                <>
                  <li>Upload a clear photo of your product using the tool below</li>
                  <li>Choose from preset professional photoshoot styles OR upload your own style image</li>
                  <li>Optionally add a text prompt to describe the desired scene or background</li>
                  <li>Click "Generate" to create your professional product photo</li>
                  <li>Download your enhanced product photo when processing is complete</li>
                </>
              ) : tool.id === 'ai-background-generator' ? (
                <>
                  <li>Upload your image using the tool below</li>
                  <li>Enter a text prompt describing the background you want to generate</li>
                  <li>Be specific about scenes, settings, colors, textures, and style preferences</li>
                  <li>Click "Generate" to let AI create a custom background for your image</li>
                  <li>Download your enhanced image when processing is complete</li>
                </>
              ) : tool.id === 'ai-image-generator' ? (
                <>
                  <li>Select your desired image resolution from the available options</li>
                  <li>Enter a detailed text prompt describing the image you want to create</li>
                  <li>Use suggested prompts for inspiration or create your own custom description</li>
                  <li>Be specific about style, colors, composition, and artistic elements</li>
                  <li>Click "Generate" to let AI create your unique image</li>
                  <li>Download your generated image when processing is complete</li>
                </>
              ) : tool.id === 'ai-outfit' ? (
                <>
                  <li>Upload a clear photo of a person using the tool below</li>
                  <li>Choose from preset outfit styles organized by category OR use suggested prompts</li>
                  <li>Enter a detailed text prompt describing the outfit you want to apply</li>
                  <li>Be specific about clothing type, style, colors, and materials</li>
                  <li>Click "Generate" to let AI change the outfit in your photo</li>
                  <li>Download your transformed image when processing is complete</li>
                </>
              ) : tool.id === 'ai-image-to-image' ? (
                <>
                  <li>Upload your main image that you want to transform</li>
                  <li>Optionally upload a style reference image for visual guidance</li>
                  <li>Adjust the Image Strength slider to control how much the result resembles your main image</li>
                  <li>Adjust the Style Strength slider to control how much the result follows your style image</li>
                  <li>Enter a detailed text prompt describing the transformation you want</li>
                  <li>Click "Generate" to let AI transform your image based on your prompt and settings</li>
                  <li>Download your transformed image when processing is complete</li>
                </>
              ) : tool.id === 'ai-sketch-to-image' ? (
                <>
                  <li>Choose to either draw your sketch or upload an existing sketch image</li>
                  <li>If drawing: Use the canvas to create your sketch with the drawing tools</li>
                  <li>If uploading: Select your sketch image file</li>
                  <li>Enter a detailed text prompt describing the final image you want to create</li>
                  <li>Optionally upload a style reference image for visual guidance</li>
                  <li>Adjust the Sketch Adherence slider to control how closely AI follows your sketch</li>
                  <li>Adjust the Style Strength slider if using a style image</li>
                  <li>Click "Generate" to transform your sketch into a rendered image</li>
                  <li>Download your transformed image when processing is complete</li>
                </>
              ) : tool.id === 'ai-hairstyle' ? (
                <>
                  <li>Upload a clear, front-facing photo of yourself or someone else</li>
                  <li>Describe the hairstyle you want to try on in the text box</li>
                  <li>Or click on one of the suggested hairstyle prompts for inspiration</li>
                  <li>Click "Generate" to see the new hairstyle applied to your photo</li>
                  <li>Download your result when processing is complete</li>
                </>
              ) : tool.id === 'ai-image-upscaler' ? (
                <>
                  <li>Upload your image using the tool below (max 2048px on longest side)</li>
                  <li>Select an upscale factor (2x or 4x) based on your image size</li>
                  <li>Click "Generate" to enhance your image with AI upscaling</li>
                  <li>Download your high-resolution result when processing is complete</li>
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
              {/* Show ImageDropzone for all tools except AI Image Generator, AI Face Swap, AI Image to Image, and AI Sketch to Image */}
              {tool.id !== 'ai-image-generator' && tool.id !== 'ai-face-swap' && tool.id !== 'ai-image-to-image' && tool.id !== 'ai-sketch-to-image' && (
                <ImageDropzone 
                  onImageSelect={handleImageSelect}
                  selectedImage={selectedImage}
                />
              )}
              
              {/* AI Face Swap specific image inputs */}
              {tool.id === 'ai-face-swap' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">1. Upload Target Image</h3>
                    <p className="text-sm text-gray-600 mb-3">The photo you want to modify</p>
                    <ImageDropzone 
                      onImageSelect={(imageFile) => setFaceSwapTargetImage(imageFile)}
                      selectedImage={faceSwapTargetImage}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">2. Upload Source Face Image</h3>
                    <p className="text-sm text-gray-600 mb-3">The face you want to use (disabled if preset selected)</p>
                    <ImageDropzone 
                      onImageSelect={(imageFile) => setFaceSwapSourceImage(imageFile)}
                      selectedImage={faceSwapSourceImage}
                      disabled={!!selectedFaceSwapPreset}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Or Choose a Preset Source Face</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {faceSwapStyles.map((style) => {
                        const isSelected = selectedFaceSwapPreset?.imageUrl === style.imageUrl;
                        return (
                          <div
                            key={style.imageUrl}
                            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all group ${
                              isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-gray-300'
                            }`}
                            onClick={() => {
                              setSelectedFaceSwapPreset(style);
                              setFaceSwapSourceImage({ file: null, preview: null });
                            }}
                          >
                            {isSelected && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setSelectedFaceSwapPreset(null); }}
                                className="absolute top-1 right-1 z-10 p-1 bg-white bg-opacity-70 rounded-full text-red-600 hover:bg-opacity-100 hover:scale-110 transition-transform"
                                aria-label="Clear selection"
                              >
                                <XCircle size={20} />
                              </button>
                            )}
                            <img src={style.imageUrl} alt={style.name} className="w-full h-auto object-cover" />
                            <p className="text-center text-xs p-1 bg-gray-100">{style.name}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
               
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
                      value={cleanupBrushSize}
                      onChange={(e) => setCleanupBrushSize(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600 w-8">{cleanupBrushSize}px</span>
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
                      onTouchStart={handleDrawStart}
                      onTouchMove={handleDrawMove}
                      onTouchEnd={handleDrawEnd}
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
              
              {/* AI Background Generator specific controls */}
              {tool.id === 'ai-background-generator' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Description
                    </label>
                    <textarea
                      value={backgroundTextPrompt}
                      onChange={(e) => setBackgroundTextPrompt(e.target.value)}
                      placeholder="Describe the background you want to generate (e.g., 'sunset beach with palm trees', 'modern office interior', 'mountain landscape with snow')..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={4}
                    />
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Tips for better results:</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Be specific about the scene or setting you want</li>
                      <li>• Include details about lighting, colors, and mood</li>
                      <li>• Mention the style (realistic, artistic, vintage, etc.)</li>
                      <li>• Example: "Professional studio with soft lighting and neutral background"</li>
                    </ul>
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
                      {(selectedGender === 'female' ? femaleCartoonStyles : maleCartoonStyles).map((style) => {
                        const isSelected = selectedPresetUrl === style.imageUrl;
                        return (
                          <div
                            key={style.imageUrl}
                            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all group ${
                              isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedPresetUrl(style.imageUrl)}
                          >
                            {/* The "Clear Selection" button - shows ONLY on the selected item */}
                            {isSelected && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleCartoonClearSelection(); }}
                                className="absolute top-1 right-1 z-10 p-1 bg-white bg-opacity-70 rounded-full text-red-600 hover:bg-opacity-100 hover:scale-110 transition-transform"
                                aria-label="Clear selection"
                              >
                                <XCircle size={20} />
                              </button>
                            )}
                            <img src={style.imageUrl} alt={style.name} className="w-full h-auto object-cover" />
                            <p className="text-center text-xs p-1 bg-gray-100">{style.name}</p>
                          </div>
                        );
                      })}
                    </div>
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
                      {caricatureStyles.map((style) => {
                        const isSelected = caricatureSelectedStyle?.imageUrl === style.imageUrl;
                        return (
                          <div
                            key={style.imageUrl}
                            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all group ${
                              isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-gray-300'
                            }`}
                            onClick={() => setCaricatureSelectedStyle(style)}
                          >
                            {/* The "Clear Selection" button - shows ONLY on the selected item */}
                            {isSelected && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleCaricatureClearSelection(); }}
                                className="absolute top-1 right-1 z-10 p-1 bg-white bg-opacity-70 rounded-full text-red-600 hover:bg-opacity-100 hover:scale-110 transition-transform"
                                aria-label="Clear selection"
                              >
                                <XCircle size={20} />
                              </button>
                            )}
                            <img src={style.imageUrl} alt={style.name} className="w-full h-auto object-cover" />
                            <p className="text-center text-xs p-1 bg-gray-100">{style.name}</p>
                          </div>
                        );
                      })}
                    </div>
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
                          .map((style) => {
                            const isSelected = avatarSelectedStyle?.imageUrl === style.imageUrl;
                            return (
                              <div
                                key={style.imageUrl}
                                className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all group ${
                                  isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-gray-300'
                                }`}
                                onClick={() => setAvatarSelectedStyle(style)}
                              >
                                {/* The "Clear Selection" button - shows ONLY on the selected item */}
                                {isSelected && (
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleAvatarClearSelection(); }}
                                    className="absolute top-1 right-1 z-10 p-1 bg-white bg-opacity-70 rounded-full text-red-600 hover:bg-opacity-100 hover:scale-110 transition-transform"
                                    aria-label="Clear selection"
                                  >
                                    <XCircle size={20} />
                                  </button>
                                )}
                                <img src={style.imageUrl} alt={style.name} className="w-full h-auto object-cover" />
                                <p className="text-center text-xs p-1 bg-gray-100">{style.name}</p>
                              </div>
                            );
                          })
                        }
                      </div>
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
              
              {/* AI Portrait specific controls */}
              {tool.id === 'ai-portrait' && selectedImage.preview && (
                <div className="space-y-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-sm text-purple-800">
                      <strong>Note:</strong> For best results, use a clear photo of a person's face.
                    </p>
                  </div>
                  
                  {/* Gender Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Gender</label>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setPortraitSelectedGender('female')}
                        className={`px-4 py-2 rounded-md border ${
                          portraitSelectedGender === 'female'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Female
                      </button>
                      <button
                        type="button"
                        onClick={() => setPortraitSelectedGender('male')}
                        className={`px-4 py-2 rounded-md border ${
                          portraitSelectedGender === 'male'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Male
                      </button>
                    </div>
                  </div>

                  {/* Preset Style Gallery */}
                  {portraitSelectedGender && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Choose a Preset Style</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {portraitStyles
                          .filter(style => style.gender === portraitSelectedGender)
                          .map((style) => {
                            const isSelected = portraitSelectedStyle?.imageUrl === style.imageUrl;
                            return (
                              <div
                                key={style.imageUrl}
                                className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all group ${
                                  isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-gray-300'
                                }`}
                                onClick={() => setPortraitSelectedStyle(style)}
                              >
                                {/* The "Clear Selection" button - shows ONLY on the selected item */}
                                {isSelected && (
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setPortraitSelectedStyle(null); }}
                                    className="absolute top-1 right-1 z-10 p-1 bg-white bg-opacity-70 rounded-full text-red-600 hover:bg-opacity-100 hover:scale-110 transition-transform"
                                    aria-label="Clear selection"
                                  >
                                    <XCircle size={20} />
                                  </button>
                                )}
                                <img src={style.imageUrl} alt={style.name} className="w-full h-auto object-cover" />
                                <p className="text-center text-xs p-1 bg-gray-100">{style.name}</p>
                              </div>
                            );
                          })
                        }
                      </div>
                    </div>
                  )}

                  {/* Suggested Prompts */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Suggested Prompts</label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {suggestedPortraitPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => setPortraitTextPrompt(prompt)}
                          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full border transition-colors"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Style Section */}
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-700 text-center">Or Use a Custom Style</p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload a Style Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPortraitCustomStyleImage(e.target.files?.[0] || null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!!portraitSelectedStyle}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Text Prompt</label>
                      <textarea
                        value={portraitTextPrompt}
                        onChange={(e) => setPortraitTextPrompt(e.target.value)}
                        placeholder="Describe the portrait style you want..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={2}
                        disabled={!!portraitSelectedStyle}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* AI Product Photoshoot specific controls */}
              {tool.id === 'ai-product-photoshoot' && selectedImage.preview && (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      <strong>Note:</strong> This tool works best with clear product photos on neutral backgrounds.
                    </p>
                  </div>
                  
                  {/* Preset Style Gallery */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Choose a Style</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                      {productStyles.map((style) => {
                        const isSelected = selectedProductStyle?.name === style.name;
                        return (
                          <div
                            key={style.name}
                            onClick={() => {
                              setSelectedProductStyle(style);
                              setProductCustomStyleImage(null); // Clear custom image when preset is selected
                            }}
                            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all group ${
                              isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-gray-300'
                            }`}
                          >
                            {/* The "Clear Selection" button - shows ONLY on the selected item */}
                            {isSelected && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleProductClearSelection(); }}
                                className="absolute top-1 right-1 z-10 p-1 bg-white bg-opacity-70 rounded-full text-red-600 hover:bg-opacity-100 hover:scale-110 transition-transform"
                                aria-label="Clear selection"
                              >
                                <XCircle size={20} />
                              </button>
                            )}
                            <img
                              src={style.imageUrl}
                              alt={style.name}
                              className="w-full h-24 object-cover"
                            />
                            <div className="p-2 bg-gray-50">
                              <p className="text-sm font-medium text-center">{style.name}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Style Image Upload */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Or Upload a Custom Style Image</h3>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setProductCustomStyleImage(file);
                        if (file) {
                          setSelectedProductStyle(null); // Clear preset when custom image is uploaded
                        }
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {productCustomStyleImage && (
                      <p className="mt-2 text-sm text-green-600">Custom style image selected: {productCustomStyleImage.name}</p>
                    )}
                  </div>

                  {/* Suggested Prompts */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Don't have a style? Try these prompts</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {suggestedPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => setProductTextPrompt(prompt)}
                          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full border transition-colors"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text Prompt Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Prompt (Optional)
                    </label>
                    <textarea
                      value={productTextPrompt}
                      onChange={(e) => setProductTextPrompt(e.target.value)}
                      placeholder="Describe the style or setting you want for your product photo..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                </div>
              )}
              
              {/* AI Background Generator specific controls */}
              {tool.id === 'ai-background-generator' && selectedImage.preview && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Description
                    </label>
                    <textarea
                      value={backgroundTextPrompt}
                      onChange={(e) => setBackgroundTextPrompt(e.target.value)}
                      placeholder="Describe the background you want to generate..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                    />
                    
                    <div className="mt-2">
                      <span className="text-sm text-gray-600 mb-2 block">💡 Tips for better results:</span>
                      <ul className="text-sm text-gray-600 ml-4 list-disc space-y-1">
                        <li>Be specific about scenes, settings, colors, and textures</li>
                        <li>Mention lighting conditions (bright, soft, dramatic, etc.)</li>
                        <li>Include style preferences (realistic, artistic, vintage, etc.)</li>
                        <li>Example: "Professional studio with soft lighting and neutral background"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {/* AI Image Generator specific controls */}
              {tool.id === 'ai-image-generator' && (
                <div className="space-y-6">
                  {/* Resolution Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Image Resolution
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {imageResolutions.map((resolution) => (
                        <div
                          key={`${resolution.width}x${resolution.height}`}
                          className={`cursor-pointer p-3 border-2 rounded-lg transition-colors ${
                            selectedResolution.width === resolution.width && selectedResolution.height === resolution.height
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedResolution(resolution)}
                        >
                          <div className="text-sm font-medium">{resolution.name}</div>
                          <div className="text-xs text-gray-500">{resolution.aspectRatio}</div>
                          <div className="text-xs text-gray-400">{resolution.width}x{resolution.height} px</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Text Prompt Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Description
                    </label>
                    <textarea
                      value={imageGeneratorTextPrompt}
                      onChange={(e) => setImageGeneratorTextPrompt(e.target.value)}
                      placeholder="Describe the image you want to generate in detail (e.g., 'a majestic mountain landscape at sunset', 'portrait of a cat wearing sunglasses', 'abstract digital art with vibrant colors')..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={4}
                    />
                    
                    {/* Updated Tips Section to match AI Background Generator */}
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Tips for better results:</h4>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Be specific about style, colors, composition, and artistic elements</li>
                        <li>• Include details about lighting, mood, and atmosphere</li>
                        <li>• Mention art styles (realistic, cartoon, anime, oil painting, etc.)</li>
                        <li>• Add quality descriptors (high quality, detailed, masterpiece, etc.)</li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Suggested Prompts */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Suggested Prompts
                    </label>
                    <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                      {imageGeneratorPrompts.map((prompt, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setImageGeneratorTextPrompt(prompt)}
                          className="text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md border transition-colors"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* AI Outfit specific controls */}
              {tool.id === 'ai-outfit' && selectedImage.preview && (
                <div className="space-y-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-sm text-purple-800">
                      <strong>Note:</strong> This tool works best with clear photos of people wearing clothing.
                    </p>
                  </div>
                  
                  {/* Preset Outfit Styles */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Choose an Outfit Style</h3>
                    {Object.entries(
                      presetOutfitStyles.reduce((acc, style) => {
                        if (!acc[style.category]) acc[style.category] = [];
                        acc[style.category].push(style);
                        return acc;
                      }, {} as Record<string, typeof presetOutfitStyles>)
                    ).map(([category, styles]) => (
                      <div key={category} className="mb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-3">{category}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {styles.map((style) => (
                            <button
                              key={style.name}
                              onClick={() => setOutfitTextPrompt(style.prompt)}
                              className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border transition-colors"
                            >
                              <div className="text-sm font-medium">{style.name}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Suggested Prompts */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Suggested Outfit Ideas</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {suggestedOutfitPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => setOutfitTextPrompt(prompt)}
                          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full border transition-colors"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text Prompt Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Outfit Description
                    </label>
                    <textarea
                      value={outfitTextPrompt}
                      onChange={(e) => setOutfitTextPrompt(e.target.value)}
                      placeholder="Describe the outfit you want to apply (e.g., 'elegant black evening dress', 'casual denim jacket and jeans', 'professional business suit')..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={4}
                    />
                    
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Tips for better results:</h4>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Be specific about clothing type, style, colors, and materials</li>
                        <li>• Include details about fit and silhouette (loose, fitted, flowing, etc.)</li>
                        <li>• Mention specific garments (dress, shirt, pants, jacket, etc.)</li>
                        <li>• Add style descriptors (casual, formal, vintage, modern, etc.)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {/* AI Image to Image specific controls */}
              {tool.id === 'ai-image-to-image' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Upload a main image to transform and optionally a style reference image for visual guidance.
                    </p>
                  </div>
                  
                  {/* Main Image Upload */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">1. Main Image</h3>
                    <p className="text-sm text-gray-600 mb-3">The image you want to transform</p>
                    <ImageDropzone 
                      onImageSelect={(imageFile) => setI2iMainImage(imageFile)}
                      selectedImage={i2iMainImage}
                    />
                  </div>
                  
                  {/* Style Image Upload */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">2. Style Reference Image (Optional)</h3>
                    <p className="text-sm text-gray-600 mb-3">Upload an image to use as style guidance</p>
                    <ImageDropzone 
                      onImageSelect={(imageFile) => setI2iStyleImage(imageFile)}
                      selectedImage={i2iStyleImage}
                    />
                  </div>
                  
                  {/* Strength Sliders */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image Strength: {i2iStrength.toFixed(1)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={i2iStrength}
                        onChange={(e) => setI2iStrength(Number(e.target.value))}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Higher strength makes the result look more like your main image
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label className="text-sm font-medium text-gray-700">
                          Style Strength: {i2iStyleStrength.toFixed(1)}
                        </label>
                        <div className="relative group">
                          <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                            Slider is disabled if no style image has been uploaded
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={i2iStyleStrength}
                        onChange={(e) => setI2iStyleStrength(Number(e.target.value))}
                        disabled={!i2iStyleImage.file}
                        className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Higher strength makes the result look more like your style image
                        {!i2iStyleImage.file && " (disabled - upload a style image first)"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Text Prompt Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter Prompt *
                    </label>
                    <textarea
                      value={i2iTextPrompt}
                      onChange={(e) => setI2iTextPrompt(e.target.value)}
                      placeholder="Describe the final image you want to create (e.g., 'turn this into a watercolor painting', 'make it look like a vintage photograph', 'transform into a cyberpunk scene')..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={4}
                      required
                    />
                    
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-green-800 mb-2">💡 Tips for better results:</h4>
                      <ul className="text-xs text-green-700 space-y-1">
                        <li>• Be specific about the style, mood, or transformation you want</li>
                        <li>• Mention artistic styles (watercolor, oil painting, digital art, etc.)</li>
                        <li>• Include lighting and atmosphere details (dramatic, soft, bright, etc.)</li>
                        <li>• Use the Image Strength slider to control how much of the original to keep</li>
                        <li>• Use the Style Strength slider to control style reference influence</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {/* AI Sketch to Image specific controls */}
              {tool.id === 'ai-sketch-to-image' && (
                <div className="space-y-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-sm text-purple-800">
                      <strong>Note:</strong> Create or upload a sketch, then describe the final image you want to generate.
                    </p>
                  </div>
                  
                  {/* Input Mode Switcher */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">1. Choose Input Method</h3>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setS2iInputMode('upload')}
                        className={`px-4 py-2 rounded-md border ${
                          s2iInputMode === 'upload'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Upload Sketch
                      </button>
                      <button
                        type="button"
                        onClick={() => setS2iInputMode('draw')}
                        className={`px-4 py-2 rounded-md border ${
                          s2iInputMode === 'draw'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Draw Sketch
                      </button>
                    </div>
                  </div>
                  
                  {/* Conditional Input */}
                  {s2iInputMode === 'upload' ? (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">2. Upload Your Sketch</h3>
                      <p className="text-sm text-gray-600 mb-3">Upload an existing sketch or drawing</p>
                      <ImageDropzone 
                        onImageSelect={(imageFile) => setS2iSketchImage(imageFile)}
                        selectedImage={s2iSketchImage}
                      />
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">2. Draw Your Sketch</h3>
                      <p className="text-sm text-gray-600 mb-3">Use the canvas below to draw your sketch</p>
                      
                      {/* Drawing Controls */}
                      <div className="flex items-center gap-4 mb-3">
                        <label className="flex items-center gap-2">
                          <span className="text-sm font-medium">Brush Size:</span>
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="20"
                          value={s2iBrushSize}
                          onChange={(e) => setS2iBrushSize(Number(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-600 w-8">{s2iBrushSize}px</span>
                        
                        <label className="flex items-center gap-2">
                          <span className="text-sm font-medium">Color:</span>
                          <input
                            type="color"
                            value={s2iBrushColor}
                            onChange={(e) => setS2iBrushColor(e.target.value)}
                            className="w-8 h-8 rounded border"
                          />
                        </label>
                        
                        <button
                          type="button"
                          onClick={() => {
                            const canvas = drawingCanvasRef.current;
                            if (canvas) {
                              const ctx = canvas.getContext('2d');
                              if (ctx) {
                                ctx.fillStyle = 'white';
                                ctx.fillRect(0, 0, canvas.width, canvas.height);
                              }
                            }
                          }}
                          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border"
                        >
                          Clear
                        </button>
                      </div>
                      
                      {/* Drawing Canvas */}
                      <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                        <canvas
                          ref={drawingCanvasRef}
                          width={400}
                          height={400}
                          className="w-full h-auto cursor-crosshair bg-white"
                          onMouseDown={(e) => {
                            setIsDrawingSketch(true);
                            const canvas = drawingCanvasRef.current;
                            if (canvas) {
                              const rect = canvas.getBoundingClientRect();
                              const x = (e.clientX - rect.left) * (canvas.width / rect.width);
                              const y = (e.clientY - rect.top) * (canvas.height / rect.height);
                              const ctx = canvas.getContext('2d');
                              if (ctx) {
                                ctx.beginPath();
                                ctx.moveTo(x, y);
                              }
                            }
                          }}
                          onMouseMove={(e) => {
                            if (!isDrawingSketch) return;
                            const canvas = drawingCanvasRef.current;
                            if (canvas) {
                              const rect = canvas.getBoundingClientRect();
                              const x = (e.clientX - rect.left) * (canvas.width / rect.width);
                              const y = (e.clientY - rect.top) * (canvas.height / rect.height);
                              const ctx = canvas.getContext('2d');
                              if (ctx) {
                                ctx.lineTo(x, y);
                                ctx.strokeStyle = s2iBrushColor;
                                ctx.lineWidth = s2iBrushSize;
                                ctx.lineCap = 'round';
                                ctx.stroke();
                              }
                            }
                          }}
                          onMouseUp={() => setIsDrawingSketch(false)}
                          onMouseLeave={() => setIsDrawingSketch(false)}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Text Prompt Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      3. Describe the Final Image *
                    </label>
                    <textarea
                      value={s2iTextPrompt}
                      onChange={(e) => setS2iTextPrompt(e.target.value)}
                      placeholder="Describe the final image you want to create from your sketch (e.g., 'a realistic portrait of a woman', 'a fantasy castle in a magical forest', 'a modern car design')..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={4}
                      required
                    />
                  </div>
                  
                  {/* Style Image Upload */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">4. Style Reference Image </h3>
                    <p className="text-sm text-gray-600 mb-3">Upload an image to use as style guidance</p>
                    <ImageDropzone 
                      onImageSelect={(imageFile) => setS2iStyleImage(imageFile)}
                      selectedImage={s2iStyleImage}
                    />
                  </div>
                  
                  {/* Strength Sliders */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sketch Adherence: {s2iStrength.toFixed(1)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={s2iStrength}
                        onChange={(e) => setS2iStrength(Number(e.target.value))}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Higher values make the result follow your sketch more closely
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label className="text-sm font-medium text-gray-700">
                          Style Strength: {s2iStyleStrength.toFixed(1)}
                        </label>
                        <div className="relative group">
                          <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                            This slider is disabled if no style image is present
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={s2iStyleStrength}
                        onChange={(e) => setS2iStyleStrength(Number(e.target.value))}
                        disabled={!s2iStyleImage.file}
                        className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Higher values make the result look more like your style image
                        {!s2iStyleImage.file && " (disabled - upload a style image first)"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-green-800 mb-2">💡 Tips for better results:</h4>
                    <ul className="text-xs text-green-700 space-y-1">
                      <li>• Use clear, simple sketches with defined shapes and lines</li>
                      <li>• Be specific in your text prompt about style, colors, and details</li>
                      <li>• Higher sketch adherence preserves your drawing structure</li>
                      <li>• Style images help guide the artistic direction</li>
                      <li>• Try different combinations of sketch and style strength</li>
                    </ul>
                  </div>
                </div>
              )}
              
              {/* AI Hairstyle specific controls */}
              {tool.id === 'ai-hairstyle' && selectedImage.preview && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe the hairstyle you want to try on
                    </label>
                    <textarea
                      value={hairstyleTextPrompt}
                      onChange={(e) => setHairstyleTextPrompt(e.target.value)}
                      placeholder="Describe the hairstyle you want to try on..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Or choose from suggested prompts:</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {suggestedHairstylePrompts.map((prompt, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setHairstyleTextPrompt(prompt)}
                          className="px-3 py-2 text-xs bg-gray-100 hover:bg-blue-100 border border-gray-300 rounded-md transition-colors duration-200 text-left"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Tip:</h4>
                    <p className="text-xs text-blue-700">
                      For best results, use a clear, front-facing photo with good lighting.
                    </p>
                  </div>
                </div>
              )}
              
              {/* AI Image Upscaler specific controls */}
              {tool.id === 'ai-image-upscaler' && selectedImage.preview && (
                <div className="space-y-4">
                  {/* Display Image Dimensions */}
                  {imageDimensions && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-gray-800 mb-1">Current Image Size:</h4>
                      <p className="text-sm text-gray-600">{imageDimensions.width} x {imageDimensions.height}px</p>
                    </div>
                  )}
                  
                  {/* Upscale Factor Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Upscale Factor
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setUpscaleFactor(2)}
                        disabled={!availableUpscaleOptions.includes(2)}
                        className={`px-4 py-2 rounded-md border transition-colors ${
                          upscaleFactor === 2
                            ? 'bg-blue-500 text-white border-blue-500'
                            : availableUpscaleOptions.includes(2)
                            ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        }`}
                      >
                        2X
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpscaleFactor(4)}
                        disabled={!availableUpscaleOptions.includes(4)}
                        className={`px-4 py-2 rounded-md border transition-colors ${
                          upscaleFactor === 4
                            ? 'bg-blue-500 text-white border-blue-500'
                            : availableUpscaleOptions.includes(4)
                            ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        }`}
                      >
                        4X
                      </button>
                    </div>
                    {availableUpscaleOptions.length === 0 && (
                      <p className="text-sm text-red-600 mt-2">
                        Image is too large for upscaling. Maximum size is 2048px on the longest side.
                      </p>
                    )}
                    {availableUpscaleOptions.length === 1 && availableUpscaleOptions[0] === 2 && (
                      <p className="text-sm text-amber-600 mt-2">
                        Only 2X upscaling is available for images larger than 1024px on the longest side.
                      </p>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Tip:</h4>
                    <p className="text-xs text-blue-700">
                      AI upscaling works best on photos and detailed images. The larger the upscale factor, the longer the processing time.
                    </p>
                  </div>
                </div>
              )}

              <Button
                onClick={
                  tool.id === 'ai-cleanup' ? handleAICleanupGenerate :
                  tool.id === 'ai-expand' ? handleAIExpandGenerate :
                  tool.id === 'ai-replace' ? handleAIReplaceGenerate :
                  tool.id === 'ai-cartoon' ? handleAICartoonGenerate :
                  tool.id === 'ai-caricature' ? handleAICaricatureGenerate :
                  tool.id === 'ai-avatar' ? handleAIAvatarGenerate :
                  tool.id === 'ai-portrait' ? handleAIPortraitGenerate :
                  tool.id === 'ai-face-swap' ? handleAIFaceSwapGenerate :
                  tool.id === 'ai-product-photoshoot' ? handleAIProductPhotoshootGenerate :
                  tool.id === 'ai-background-generator' ? handleAIBackgroundGeneratorGenerate :
                  tool.id === 'ai-image-generator' ? handleAIImageGeneratorGenerate :
                  tool.id === 'ai-outfit' ? handleAIOutfitGenerate :
                  tool.id === 'ai-image-to-image' ? handleAIImageToImageGenerate :
                  tool.id === 'ai-sketch-to-image' ? handleAISketchToImageGenerate :
                  tool.id === 'ai-hairstyle' ? handleAIHairstyleGenerate :
                  tool.id === 'ai-image-upscaler' ? handleAIUpscalerGenerate :
                  handleProcessImage
                }
                disabled={
                  processedImage.isLoading ||
                  (tool.id !== 'ai-image-generator' && tool.id !== 'ai-face-swap' && tool.id !== 'ai-image-to-image' && tool.id !== 'ai-sketch-to-image' && !selectedImage.file) ||
                  (tool.id === 'ai-replace' && !textPrompt.trim()) ||
                  (tool.id === 'ai-background-generator' && !backgroundTextPrompt.trim()) ||
                  (tool.id === 'ai-image-generator' && !imageGeneratorTextPrompt.trim()) ||
                  (tool.id === 'ai-cartoon' && !(selectedPresetUrl || cartoonStyleImage?.name)) ||
                  (tool.id === 'ai-caricature' && !caricatureSelectedStyle && !caricatureCustomStyleImage) ||
                  (tool.id === 'ai-avatar' && !avatarSelectedStyle && !avatarCustomStyleImage) ||
                  (tool.id === 'ai-portrait' && !portraitSelectedStyle && !portraitCustomStyleImage) ||
                  (tool.id === 'ai-face-swap' && (!faceSwapTargetImage.file || (!selectedFaceSwapPreset && !faceSwapSourceImage.file))) ||
                  (tool.id === 'ai-product-photoshoot' && !selectedProductStyle && !productCustomStyleImage && !productTextPrompt) ||
                  (tool.id === 'ai-outfit' && (!selectedImage.file || !outfitTextPrompt.trim())) ||
                  (tool.id === 'ai-image-to-image' && (!i2iMainImage.file || !i2iTextPrompt.trim())) ||
                  (tool.id === 'ai-sketch-to-image' && (
                    (s2iInputMode === 'upload' && !s2iSketchImage.file) ||
                    !s2iTextPrompt.trim()
                  )) ||
                  (tool.id === 'ai-hairstyle' && (!selectedImage.file || !hairstyleTextPrompt.trim())) ||
                  (tool.id === 'ai-image-upscaler' && (!selectedImage.file || availableUpscaleOptions.length === 0))
                }
                className="w-full"
              >
                {processedImage.isLoading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  `Generate ${tool.name}`
                )}
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
    case 'ai-portrait':
      return 'create realistic portrait transformations with professional styling and artistic effects';
    case 'ai-face-swap':
      return 'seamlessly swap faces between two images, allowing you to replace faces in photos with either preset faces or custom source images';
    case 'ai-product-photoshoot':
      return 'create professional product photography with AI-generated backgrounds and lighting that make your products look stunning';
    case 'ai-background-generator':
      return 'generate stunning new backgrounds for your images using AI, perfect for creating professional-looking photos with custom scenes';
    case 'ai-outfit':
      return 'virtually change clothing on people in photos using AI, allowing you to transform outfits with simple text descriptions';
    case 'ai-image-to-image':
      return 'transform any image based on text prompts and optional style references, with adjustable strength controls for precise artistic control';
    case 'ai-hairstyle':
      return 'virtually try on new hairstyles by uploading a photo and describing the desired look, perfect for experimenting with different hair styles and colors';
    case 'ai-image-upscaler':
      return 'enhance image resolution and quality using advanced AI upscaling technology, supporting 2x and 4x enlargement while preserving fine details and sharpness';
    default:
      return 'transform and enhance your images with professional-quality results';
  }
}

export default ToolPage;