import type { Tool } from '../types';

export const tools: Tool[] = [
  {
    id: 'remove-background',
    name: 'Remove Background',
    description: 'Remove the background from any image with AI precision',
    icon: 'scissors',
    path: '/tools/remove-background',
    apiEndpoint: 'https://api.lightxeditor.com/rpc/remove-background'
  },
  {
    id: 'ai-cleanup',
    name: 'AI Cleanup',
    description: 'Clean up imperfections and enhance your photos',
    icon: 'sparkles',
    path: '/tools/ai-cleanup',
    apiEndpoint: 'https://api.lightxeditor.com/rpc/ai-cleanup-picture'
  },
  {
    id: 'ai-expand',
    name: 'AI Expand',
    description: 'Expand your images beyond their original boundaries',
    icon: 'maximize',
    path: '/tools/ai-expand',
    apiEndpoint: 'https://api.lightxeditor.com/rpc/ai-expand'
  },
  {
    id: 'ai-replace',
    name: 'AI Replace',
    description: 'Replace objects or areas in your images with AI',
    icon: 'replace',
    path: '/tools/ai-replace',
    apiEndpoint: 'https://api.lightxeditor.com/rpc/ai-replace'
  },
  {
    id: 'ai-cartoon',
    name: 'AI Cartoon',
    description: 'Transform photos into cartoon-style artwork',
    icon: 'palette',
    path: '/tools/ai-cartoon',
    apiEndpoint: 'https://api.lightxeditor.com/rpc/ai-cartoon-generator'
  },
  {
    id: 'ai-caricature',
    name: 'AI Caricature',
    description: 'Create fun caricatures from portrait photos',
    icon: 'grin',
    path: '/tools/ai-caricature',
    apiEndpoint: 'https://api.lightxeditor.com/rpc/ai-caricature-generator'
  },
  {
    id: 'ai-avatar',
    name: 'AI Avatar',
    description: 'Generate personalized avatars from your photos',
    icon: 'user',
    path: '/tools/ai-avatar',
    apiEndpoint: 'https://api.lightxeditor.com/rpc/ai-avatar'
  },
  {
    id: 'ai-product-photoshoot',
    name: 'AI Product Photoshoot',
    description: 'Create professional product photos with AI',
    icon: 'shopping-bag',
    path: '/tools/ai-product-photoshoot',
    apiEndpoint: 'https://api.lightxeditor.com/rpc/ai-product-photoshoot'
  },
  {
    id: 'ai-background-generator',
    name: 'AI Background Generator',
    description: 'Generate custom backgrounds for your images',
    icon: 'image',
    path: '/tools/ai-background-generator',
    apiEndpoint: 'https://api.lightxeditor.com/rpc/ai-background-generator'
  },
  {
    id: 'ai-image-generator',
    name: 'AI Image Generator',
    description: 'Generate unique images from text descriptions',
    icon: 'bot',
    path: '/tools/ai-image-generator',
    apiEndpoint: 'https://api.lightxeditor.com/rpc/ai-image-generator'
  },
  {
    id: 'ai-portrait',
    name: 'AI Portrait',
    description: 'Create professional portrait photos with AI enhancement',
    icon: 'user-check',
    path: '/tools/ai-portrait',
    apiEndpoint: 'https://api.lightxeditor.com/rpc/ai-portrait'
  },
  {
    id: 'ai-face-swap',
    name: 'AI Face Swap',
    description: 'Swap faces between images with AI precision',
    icon: 'refresh-cw',
    path: '/tools/ai-face-swap',
    apiEndpoint: 'https://api.lightxeditor.com/rpc/ai-face-swap'
  },
  {
    id: 'ai-outfit',
    name: 'AI Outfit',
    description: 'Change outfits in photos with AI technology',
    icon: 'shirt',
    path: '/tools/ai-outfit',
    apiEndpoint: 'https://api.lightxeditor.com/rpc/ai-outfit'
  },
  {
    id: 'ai-image-to-image',
    name: 'AI Image to Image',
    description: 'Transform images with AI style transfer',
    icon: 'image-plus',
    path: '/tools/ai-image-to-image',
    apiEndpoint: 'https://api.lightxeditor.com/rpc/ai-image-to-image'
  },
  {
    id: 'ai-sketch-to-image',
    name: 'AI Sketch to Image',
    description: 'Convert sketches into detailed images',
    icon: 'pencil',
    path: '/tools/ai-sketch-to-image',
    apiEndpoint: 'https://api.lightxeditor.com/rpc/ai-sketch-to-image'
  },
  {
    id: 'ai-hairstyle',
    name: 'AI Hairstyle',
    description: 'Try different hairstyles with AI visualization',
    icon: 'scissors',
    path: '/tools/ai-hairstyle',
    apiEndpoint: 'https://api.lightxeditor.com/rpc/ai-hairstyle'
  },
  {
    id: 'ai-image-upscaler',
    name: 'AI Image Upscaler',
    description: 'Enhance image resolution without losing quality',
    icon: 'zoom-in',
    path: '/tools/ai-image-upscaler',
    apiEndpoint: 'https://api.lightxeditor.com/rpc/ai-image-upscaler'
  },
  {
    id: 'ai-filter',
    name: 'AI Filter',
    description: 'Apply AI-powered filters to enhance your photos',
    icon: 'sliders',
    path: '/tools/ai-filter',
    apiEndpoint: 'https://api.lightxeditor.com/rpc/ai-filter'
  },
  {
    id: 'ai-hair-color',
    name: 'AI Hair Color',
    description: 'Change hair color in photos with AI',
    icon: 'palette',
    path: '/tools/ai-hair-color',
    apiEndpoint: 'https://api.lightxeditor.com/rpc/ai-hair-color'
  },
  {
    id: 'ai-virtual-outfit',
    name: 'AI Virtual Outfit Try On',
    description: 'Virtually try on outfits with AI technology',
    icon: 'tshirt',
    path: '/tools/ai-virtual-outfit',
    apiEndpoint: 'https://api.lightxeditor.com/rpc/ai-virtual-outfit-try-on'
  }
];