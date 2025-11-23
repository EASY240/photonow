// Video URL mapping for tools
export const videoUrlMapping: Record<string, string> = {
  'AI Prompt Generator': '/tools videos/AI Prompt Generator.mp4',
  'Remove Background': '/tools videos/Remove Background.mp4',
  'AI Cleanup': '/tools videos/AI Cleanup.mp4',
  'AI Expand': '/tools videos/AI Expand.mp4',
  'AI Replace': '/tools videos/AI Replace.mp4',
  'AI Cartoon': '/tools videos/AI Cartoon.mp4',
  'AI Caricature': '/tools videos/AI Caricature.mp4',
  'AI Avatar': '/tools videos/AI Avatar.mp4',
  'AI Product Photoshoot': '/tools videos/AI Product Photoshoot.mp4',
  'AI Background Generator': '/tools videos/AI Background Generator.mp4',
  'AI Image Generator': '/tools videos/AI Image Generator_text-to-image.mp4',
  'AI Portrait': '/tools videos/AI Portrait.mp4',
  'AI Face Swap': '/tools videos/AI Face Swap.mp4',
  'AI Outfit': '/tools videos/AI Outfit.mp4',
  'AI Image to Image': '/tools videos/AI Image to Image.mp4',
  'AI Sketch to Image': '/tools videos/AI Sketch to Image.mp4',
  'AI Hairstyle': '/tools videos/AI Hairstyle.mp4',
  'AI Image Upscaler': '/tools videos/AI Image Upscaler.mp4',
  'AI Filter': '/tools videos/AI Filter.mp4',
  'Watermark Remover': '/tools videos/Watermark Remover.mp4'
};

// Function to get video URL for a tool
export const getVideoUrl = (toolName: string): string | undefined => {
  return videoUrlMapping[toolName];
};