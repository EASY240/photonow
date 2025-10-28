// Video URL mapping for tools
export const videoUrlMapping: Record<string, string> = {
  'Remove Background': 'https://lightseagreen-louse-706784.hostingersite.com/media/Remove%20Background.mp4',
  'AI Cleanup': 'https://lightseagreen-louse-706784.hostingersite.com/media/AI%20Cleanup.mp4',
  'AI Expand': 'https://lightseagreen-louse-706784.hostingersite.com/media/AI%20Expand.mp4',
  'AI Replace': 'https://lightseagreen-louse-706784.hostingersite.com/media/AI%20Replace.mp4',
  'AI Cartoon': 'https://lightseagreen-louse-706784.hostingersite.com/media/AI%20Cartoon.mp4',
  'AI Caricature': 'https://lightseagreen-louse-706784.hostingersite.com/media/AI%20Caricature.mp4',
  'AI Avatar': 'https://lightseagreen-louse-706784.hostingersite.com/media/AI%20Avatar.mp4',
  'AI Product Photoshoot': 'https://lightseagreen-louse-706784.hostingersite.com/media/AI%20Product%20Photoshoot.mp4',
  'AI Background Generator': 'https://lightseagreen-louse-706784.hostingersite.com/media/AI%20Background%20Generator.mp4',
  'AI Image Generator': 'https://lightseagreen-louse-706784.hostingersite.com/media/AI%20Image%20Generator_text-to-image.mp4',
  'AI Portrait': 'https://lightseagreen-louse-706784.hostingersite.com/media/AI%20Portrait.mp4',
  'AI Face Swap': 'https://lightseagreen-louse-706784.hostingersite.com/media/AI%20Face%20Swap.mp4',
  'AI Outfit': 'https://lightseagreen-louse-706784.hostingersite.com/media/AI%20Outfit.mp4',
  'AI Image to Image': 'https://lightseagreen-louse-706784.hostingersite.com/media/AI%20Image%20to%20Image.mp4',
  'AI Sketch to Image': 'https://lightseagreen-louse-706784.hostingersite.com/media/AI%20Sketch%20to%20Image.mp4',
  'AI Hairstyle': 'https://lightseagreen-louse-706784.hostingersite.com/media/AI%20Hairstyle.mp4',
  'AI Image Upscaler': 'https://lightseagreen-louse-706784.hostingersite.com/media/AI%20Image%20Upscaler.mp4',
  'AI Filter': 'https://lightseagreen-louse-706784.hostingersite.com/media/AI%20Filter.mp4'
};

// Function to get video URL for a tool
export const getVideoUrl = (toolName: string): string | undefined => {
  return videoUrlMapping[toolName];
};