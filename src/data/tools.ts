import type { Tool } from '../types';

export const tools: Tool[] = [
  {
    id: 'remove-background',
    name: 'Remove Background',
    description: 'Remove backgrounds from images instantly with AI precision',
    icon: 'Scissors',
    path: '/tools/remove-background',
    apiEndpoint: 'v1/remove-background'
  },
  {
    id: 'ai-cleanup',
    name: 'AI Cleanup',
    description: 'Remove unwanted objects and clean up your photos',
    icon: 'Eraser',
    path: '/tools/ai-cleanup',
    apiEndpoint: 'v1/cleanup-picture'
  },
  {
    id: 'ai-expand',
    name: 'AI Expand',
    description: 'Expand your images beyond their borders with AI',
    icon: 'Maximize',
    path: '/tools/ai-expand',
    apiEndpoint: 'v1/expand-photo'
  },
  {
    id: 'ai-cartoon',
    name: 'AI Cartoon',
    description: 'Transform photos into cartoon-style images',
    icon: 'Palette',
    path: '/tools/ai-cartoon',
    apiEndpoint: 'v1/cartoon'
  },
  {
    id: 'ai-caricature',
    name: 'AI Caricature Generator',
    description: 'Create fun caricatures from your photos',
    icon: 'Smile',
    path: '/tools/ai-caricature',
    apiEndpoint: 'v1/caricature'
  },
  {
    id: 'ai-avatar',
    name: 'AI Avatar',
    description: 'Generate personalized avatars from your photos',
    icon: 'User',
    path: '/tools/ai-avatar',
    apiEndpoint: 'v1/avatar'
  },
  {
    id: 'ai-product-photoshoot',
    name: 'AI Product Photoshoot',
    description: 'Create professional product photos with AI',
    icon: 'Camera',
    path: '/tools/ai-product-photoshoot',
    apiEndpoint: 'v1/product-photoshoot'
  },
  {
    id: 'ai-background-generator',
    name: 'AI Background Generator',
    description: 'Generate stunning backgrounds for your images',
    icon: 'Image',
    path: '/tools/ai-background-generator',
    apiEndpoint: 'v1/background-generator'
  },
  {
    id: 'ai-image-generator',
    name: 'AI Image Generator',
    description: 'Create images from text descriptions',
    icon: 'Wand2',
    path: '/tools/ai-image-generator',
    apiEndpoint: 'v1/image-generator'
  },
  {
    id: 'ai-portrait',
    name: 'AI Portrait',
    description: 'Transform photos into artistic portraits',
    icon: 'UserCircle',
    path: '/tools/ai-portrait',
    apiEndpoint: 'v1/portrait'
  },
  {
    id: 'ai-face-swap',
    name: 'AI Face Swap',
    description: 'Swap faces between different photos',
    icon: 'Users',
    path: '/tools/ai-face-swap',
    apiEndpoint: 'v1/face-swap'
  },
  {
    id: 'ai-outfit',
    name: 'AI Outfit',
    description: 'Try on different outfits with AI',
    icon: 'Shirt',
    path: '/tools/ai-outfit',
    apiEndpoint: 'v1/outfit'
  },
  {
    id: 'ai-image-to-image',
    name: 'AI Image to Image',
    description: 'Transform images using AI with reference images',
    icon: 'ArrowRightLeft',
    path: '/tools/ai-image-to-image',
    apiEndpoint: 'v1/image2image'
  },
  {
    id: 'ai-sketch-to-image',
    name: 'AI Sketch to Image',
    description: 'Convert sketches into realistic images',
    icon: 'PenTool',
    path: '/tools/ai-sketch-to-image',
    apiEndpoint: 'v1/sketch-to-image'
  },
  {
    id: 'ai-hairstyle',
    name: 'AI Hairstyle',
    description: 'Try different hairstyles with AI',
    icon: 'Scissors',
    path: '/tools/ai-hairstyle',
    apiEndpoint: 'v1/hairstyle'
  },
  {
    id: 'ai-image-upscaler',
    name: 'AI Image Upscaler',
    description: 'Enhance and upscale image resolution',
    icon: 'ZoomIn',
    path: '/tools/ai-image-upscaler',
    apiEndpoint: 'v1/upscale'
  },
  {
    id: 'ai-filter',
    name: 'AI Filter',
    description: 'Apply AI-powered filters to your images',
    icon: 'Filter',
    path: '/tools/ai-filter',
    apiEndpoint: 'v1/filter'
  },
  {
    id: 'ai-hair-color',
    name: 'AI Hair Color',
    description: 'Change hair color with AI precision',
    icon: 'Palette',
    path: '/tools/ai-hair-color',
    apiEndpoint: 'v1/hair-color'
  },
  {
    id: 'ai-virtual-outfit-try-on',
    name: 'AI Virtual Outfit Try On',
    description: 'Virtually try on different outfits',
    icon: 'Shirt',
    path: '/tools/ai-virtual-outfit-try-on',
    apiEndpoint: 'v1/virtual-try-on'
  }
];