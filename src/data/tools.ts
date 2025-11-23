import type { Tool } from '../types';

export const tools: Tool[] = [
  {
    id: 'prompt-generator',
    name: 'AI Prompt Generator',
    description: 'Turn a simple idea into a professional AI prompt',
    icon: 'bot',
    path: '/tools/prompt-generator',
    apiEndpoint: '/api/optimize-prompt'
  },
  {
    id: 'remove-background',
    name: 'Remove Background',
    description: 'Remove the background from any image with AI precision',
    icon: 'scissors',
    path: '/tools/remove-background',
    apiEndpoint: '/api/external/api/v2/remove-background'
  },
  {
    id: 'ai-cleanup',
    name: 'AI Cleanup',
    description: 'Clean up imperfections and enhance your photos',
    icon: 'sparkles',
    path: '/tools/ai-cleanup',
    apiEndpoint: '/api/external/api/v2/cleanup-picture'
  },
  {
    id: 'ai-expand',
    name: 'AI Expand',
    description: 'Expand your images beyond their original boundaries',
    icon: 'maximize',
    path: '/tools/ai-expand',
    apiEndpoint: '/api/external/api/v2/ai-expand'
  },
  {
    id: 'ai-replace',
    name: 'AI Replace',
    description: 'Replace objects or areas in your images with AI',
    icon: 'replace-all',
    path: '/tools/ai-replace',
    apiEndpoint: '/api/external/api/v2/ai-replace'
  },
  {
    id: 'ai-cartoon',
    name: 'AI Cartoon',
    description: 'Transform photos into cartoon-style artwork',
    icon: 'palette',
    path: '/tools/ai-cartoon',
    apiEndpoint: '/api/external/api/v2/ai-cartoon-generator'
  },
  {
    id: 'ai-caricature',
    name: 'AI Caricature',
    description: 'Create fun caricatures from portrait photos',
    icon: 'smile',
    path: '/tools/ai-caricature',
    apiEndpoint: '/api/external/api/v2/ai-caricature-generator'
  },
  {
    id: 'ai-avatar',
    name: 'AI Avatar',
    description: 'Generate personalized avatars from your photos',
    icon: 'user',
    path: '/tools/ai-avatar',
    apiEndpoint: '/api/external/api/v2/ai-avatar'
  },
  {
    id: 'ai-product-photoshoot',
    name: 'AI Product Photoshoot',
    description: 'Create professional product photos with AI',
    icon: 'shopping-bag',
    path: '/tools/ai-product-photoshoot',
    apiEndpoint: '/api/external/api/v2/ai-product-photoshoot'
  },
  {
    id: 'ai-background-generator',
    name: 'AI Background Generator',
    description: 'Generate custom backgrounds for your images',
    icon: 'image',
    path: '/tools/ai-background-generator',
    apiEndpoint: '/api/external/api/v2/ai-background-generator'
  },
  {
    id: 'ai-image-generator',
    name: 'AI Image Generator',
    description: 'Generate unique images from text descriptions',
    icon: 'bot',
    path: '/tools/ai-image-generator',
    apiEndpoint: '/api/external/api/v2/ai-image-generator'
  },
  {
    id: 'ai-portrait',
    name: 'AI Portrait',
    description: 'Create professional portrait photos with AI enhancement',
    icon: 'user-check',
    path: '/tools/ai-portrait',
    apiEndpoint: '/api/external/api/v2/ai-portrait'
  },
  {
    id: 'ai-face-swap',
    name: 'AI Face Swap',
    description: 'Swap faces between images with AI precision',
    icon: 'refresh-cw',
    path: '/tools/ai-face-swap',
    apiEndpoint: '/api/external/api/v2/ai-face-swap'
  },
  {
    id: 'ai-outfit',
    name: 'AI Outfit',
    description: 'Change outfits in photos with AI technology',
    icon: 'shirt',
    path: '/tools/ai-outfit',
    apiEndpoint: '/api/external/api/v2/ai-outfit'
  },
  {
    id: 'ai-image-to-image',
    name: 'AI Image to Image',
    description: 'Transform images with AI style transfer',
    icon: 'image-plus',
    path: '/tools/ai-image-to-image',
    apiEndpoint: '/api/external/api/v2/ai-image-to-image'
  },
  {
    id: 'ai-sketch-to-image',
    name: 'AI Sketch to Image',
    description: 'Convert sketches into detailed images',
    icon: 'pencil',
    path: '/tools/ai-sketch-to-image',
    apiEndpoint: '/api/external/api/v2/ai-sketch-to-image'
  },
  {
    id: 'ai-hairstyle',
    name: 'AI Hairstyle',
    description: 'Try different hairstyles with AI visualization',
    icon: 'scissors',
    path: '/tools/ai-hairstyle',
    apiEndpoint: '/api/external/api/v2/ai-hairstyle'
  },
  {
    id: 'ai-image-upscaler',
    name: 'AI Image Upscaler',
    description: 'Enhance image resolution without losing quality',
    icon: 'zoom-in',
    path: '/tools/ai-image-upscaler',
    apiEndpoint: '/api/external/api/v2/ai-image-upscaler'
  },
  {
    id: 'ai-filter',
    name: 'AI Filter',
    description: 'Apply AI-powered filters to enhance your photos',
    icon: 'sliders',
    path: '/tools/ai-filter',
    apiEndpoint: '/api/external/api/v2/ai-filter'
  },

  {
    id: 'watermark-remover',
    name: 'Watermark Remover',
    description: 'Automatically detect and remove watermarks, logos, and text overlays',
    icon: 'erase',
    path: '/tools/watermark-remover',
    apiEndpoint: '/api/external/api/v2/watermark-remover'
  },

];