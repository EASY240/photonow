import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Download, Loader, MessageSquare } from 'lucide-react';
import SEO from '../components/ui/SEO';
import Button from '../components/ui/Button';
import ImageDropzone from '../components/ui/ImageDropzone';
import { tools } from '../data/tools';
import { processImage, ProcessImageResult } from '../utils/api';
import type { ImageFile, ProcessedImage, Tool } from '../types';

const ToolPage: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const [selectedImage, setSelectedImage] = useState<ImageFile>({ file: null, preview: null });
  const [processedImage, setProcessedImage] = useState<ProcessedImage>({
    url: null,
    isLoading: false,
    error: null
  });
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [showPrompt, setShowPrompt] = useState<boolean>(true);
  
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
  };
  
  const handleProcessImage = async () => {
    if (!selectedImage.file) return;
    
    setProcessedImage({
      url: null,
      isLoading: true,
      error: null
    });
    
    try {
      const result: ProcessImageResult = await processImage(
        tool.apiEndpoint, 
        selectedImage.file, 
        userPrompt.trim() || undefined
      );
      
      if (result.success && result.imageUrl) {
        setProcessedImage({
          url: result.imageUrl,
          isLoading: false,
          error: null
        });
      } else {
        setProcessedImage({
          url: null,
          isLoading: false,
          error: result.error || 'Failed to process image'
        });
      }
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

  const getPromptPlaceholder = (tool: Tool): string => {
    const placeholders: Record<string, string> = {
      'remove-background': 'e.g., Remove the background cleanly, keep sharp edges',
      'ai-cleanup': 'e.g., Remove unwanted objects, clean up the background',
      'ai-expand': 'e.g., Extend the image naturally, add more sky and landscape',
      'ai-cartoon': 'e.g., Convert to cartoon style, vibrant colors, animated look',
      'ai-caricature': 'e.g., Create a fun caricature with exaggerated features',
      'ai-avatar': 'e.g., Professional avatar, clean background, portrait style',
      'ai-product-photoshoot': 'e.g., Professional product photo, white background',
      'ai-background-generator': 'e.g., Modern office background, natural lighting',
      'ai-image-generator': 'e.g., A beautiful sunset over mountains, photorealistic',
      'ai-portrait': 'e.g., Professional headshot, soft lighting, natural pose',
      'ai-face-swap': 'e.g., Swap faces naturally, maintain lighting and expression',
      'ai-outfit': 'e.g., Casual summer outfit, bright colors, trendy style',
      'ai-image-to-image': 'e.g., Transform into oil painting style, artistic look',
      'ai-sketch-to-image': 'e.g., Convert sketch to realistic photo, detailed',
      'ai-hairstyle': 'e.g., Modern bob cut, natural hair color, professional style',
      'ai-upscale': 'e.g., Enhance image quality, sharpen details, increase resolution',
      'ai-filter': 'e.g., Vintage film look, warm tones, soft contrast',
      'ai-hair-color': 'e.g., Change to blonde hair, natural highlights',
      'ai-virtual-try-on': 'e.g., Try on red dress, perfect fit, natural draping'
    };
    return placeholders[tool.id] || `Describe what you want to achieve with ${tool.name}`;
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
              <li>Upload your image using the tool below</li>
              <li>Click the "{tool.name}" button to process your image</li>
              <li>Wait for the AI to work its magic</li>
              <li>Download your result when processing is complete</li>
            </ol>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Upload Image</h2>
              <ImageDropzone 
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
              />
              
              {/* User Prompt Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <MessageSquare size={18} />
                    Describe Your Vision
                  </h3>
                  <button
                    onClick={() => setShowPrompt(!showPrompt)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {showPrompt ? 'Hide' : 'Show'} Prompt
                  </button>
                </div>
                
                {showPrompt && (
                  <div className="space-y-2">
                    <label htmlFor="userPrompt" className="block text-sm font-medium text-gray-700">
                      What do you want this {tool.name} tool to do?
                    </label>
                    <textarea
                      id="userPrompt"
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      placeholder={getPromptPlaceholder(tool)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500">
                      Optional: Describe the style, mood, or specific changes you want to achieve.
                    </p>
                  </div>
                )}
              </div>
              
              <Button 
                fullWidth 
                onClick={handleProcessImage}
                disabled={!selectedImage.file || processedImage.isLoading}
                isLoading={processedImage.isLoading}
              >
                {processedImage.isLoading ? 'Processing...' : tool.name}
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
            <p className="text-gray-700 mb-6">
              Unlike other tools, ModernPhotoTools offers this service completely free with no watermarks.
              Try it now and see the difference!
            </p>
            
            {/* FAQ Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">How to Use & Tips</h3>
              <div className="space-y-3">
                {getToolTips(tool).map((tip, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">{tip.title}</h4>
                    <p className="text-gray-600 text-sm">{tip.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper function to get tips and usage instructions for each tool
function getToolTips(tool: Tool): Array<{title: string, content: string}> {
  const commonTips = [
    {
      title: "📸 Image Quality",
      content: "For best results, use high-quality images (at least 512x512 pixels). JPG, PNG, and WebP formats are supported."
    },
    {
      title: "⚡ Processing Time",
      content: "Processing typically takes 10-30 seconds depending on image size and complexity. Please be patient for the best results."
    }
  ];

  const toolSpecificTips: Record<string, Array<{title: string, content: string}>> = {
    'remove-background': [
      {
        title: "🎯 Best Subjects",
        content: "Works best with clear subjects like people, products, or objects with defined edges. Avoid busy or cluttered backgrounds."
      },
      {
        title: "💡 Pro Tip",
        content: "For hair and fine details, ensure good contrast between the subject and background for cleaner results."
      }
    ],
    'ai-cleanup': [
      {
        title: "🔧 What It Removes",
        content: "Effectively removes unwanted objects, blemishes, scratches, and background distractions while preserving important details."
      },
      {
        title: "✨ Best Practices",
        content: "Describe specifically what you want removed in the prompt for more accurate results."
      }
    ],
    'ai-expand': [
      {
        title: "📐 Expansion Areas",
        content: "The tool intelligently extends images in all directions. Specify which areas you want expanded in your prompt."
      },
      {
        title: "🌟 Creative Uses",
        content: "Perfect for creating wider landscapes, extending portraits, or adding more space around subjects."
      }
    ],
    'ai-cartoon': [
      {
        title: "🎨 Style Variations",
        content: "Experiment with different cartoon styles by describing the look you want: anime, Disney-style, comic book, etc."
      },
      {
        title: "👤 Portrait Tips",
        content: "Works exceptionally well with clear portrait photos. Ensure the face is well-lit and clearly visible."
      }
    ]
  };

  const specificTips = toolSpecificTips[tool.id] || [
    {
      title: "🚀 Getting Started",
      content: "Upload your image and describe what you want to achieve. Be specific about style, mood, or changes you're looking for."
    }
  ];

  return [...specificTips, ...commonTips];
}

// Helper function to generate more detailed descriptions for each tool
function getToolDescription(tool: Tool): string {
  switch (tool.id) {
    case 'remove-background':
      return 'automatically detect and remove backgrounds from any image, leaving you with a clean subject that can be placed on any new background';
    case 'ai-cleanup':
      return 'automatically detect and fix imperfections, remove unwanted objects, and enhance the overall quality of your photos';
    case 'ai-expand':
      return 'intelligently expand your images beyond their original boundaries, adding realistic content that matches the original image';
    case 'ai-cartoon':
      return 'transform your photos into vibrant cartoon-style artwork with various artistic styles and animated looks';
    case 'ai-caricature':
      return 'create fun and entertaining caricatures with exaggerated features while maintaining recognizable characteristics';
    case 'ai-avatar':
      return 'generate professional avatars and profile pictures with clean backgrounds and portrait-style compositions';
    case 'ai-product-photoshoot':
      return 'create professional product photography with perfect lighting and clean backgrounds for e-commerce';
    case 'ai-background-generator':
      return 'generate stunning backgrounds and environments that perfectly complement your subject matter';
    case 'ai-image-generator':
      return 'create completely new images from text descriptions with photorealistic quality and artistic styles';
    case 'ai-portrait':
      return 'enhance and perfect portrait photography with professional lighting, poses, and retouching';
    case 'ai-face-swap':
      return 'seamlessly swap faces between images while maintaining natural lighting and facial expressions';
    case 'ai-outfit':
      return 'virtually try on different outfits and clothing styles with realistic fitting and draping';
    case 'ai-image-to-image':
      return 'transform images into different artistic styles, from oil paintings to digital art and beyond';
    case 'ai-sketch-to-image':
      return 'convert hand-drawn sketches and drawings into detailed, realistic photographs';
    case 'ai-hairstyle':
      return 'experiment with different hairstyles and hair colors to find your perfect look';
    case 'ai-upscale':
      return 'enhance image quality and resolution while preserving and sharpening important details';
    case 'ai-filter':
      return 'apply artistic filters and effects to create vintage, modern, or stylized looks';
    case 'ai-hair-color':
      return 'change hair colors naturally with realistic highlights and color blending';
    case 'ai-virtual-try-on':
      return 'virtually try on clothing and accessories with realistic fitting and natural draping';
    default:
      return 'transform and enhance your images with professional-quality AI-powered results';
  }
}

export default ToolPage;