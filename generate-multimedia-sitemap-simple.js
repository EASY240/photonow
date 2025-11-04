const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'https://modernphototools.com';
const OUTPUT_FILE = 'public/sitemap-multimedia.xml';

// Tool mapping for metadata
const toolMetadata = {
  'AI Avatar': { title: 'AI Avatar Generator Tool', description: 'Create stunning AI avatars from your photos with advanced artificial intelligence technology', duration: '45' },
  'AI Background Generator': { title: 'AI Background Generator Tool', description: 'Generate professional backgrounds for your photos using AI technology', duration: '60' },
  'AI Caricature': { title: 'AI Caricature Generator Tool', description: 'Transform your photos into fun caricatures with AI-powered technology', duration: '50' },
  'AI Cartoon': { title: 'AI Cartoon Generator Tool', description: 'Convert your photos into cartoon style images using advanced AI', duration: '55' },
  'AI Cleanup': { title: 'AI Cleanup Tool', description: 'Remove unwanted objects and clean up your photos with AI technology', duration: '40' },
  'AI Expand': { title: 'AI Expand Tool', description: 'Expand your images beyond their original boundaries using AI', duration: '65' },
  'AI Face Swap': { title: 'AI Face Swap Tool', description: 'Swap faces in photos seamlessly with advanced AI face recognition', duration: '45' },
  'AI Filter': { title: 'AI Filter Tool', description: 'Apply artistic filters to your photos using AI-powered technology', duration: '35' },
  'AI Hairstyle': { title: 'AI Hairstyle Tool', description: 'Try different hairstyles on your photos with AI technology', duration: '50' },
  'AI Image Generator_text-to-image': { title: 'AI Image Generator Tool', description: 'Generate images from text descriptions using advanced AI technology', duration: '70' },
  'AI Image Upscaler': { title: 'AI Image Upscaler Tool', description: 'Enhance and upscale your images with AI-powered technology', duration: '55' },
  'AI Image to Image': { title: 'AI Image to Image Tool', description: 'Transform images from one style to another using AI technology', duration: '60' },
  'AI Outfit': { title: 'AI Outfit Tool', description: 'Try different outfits on your photos with AI-powered fashion technology', duration: '55' },
  'AI Portrait': { title: 'AI Portrait Tool', description: 'Create professional portraits from your photos using AI technology', duration: '60' },
  'AI Product Photoshoot': { title: 'AI Product Photoshoot Tool', description: 'Create professional product photos with AI-powered background technology', duration: '65' },
  'AI Replace': { title: 'AI Replace Tool', description: 'Replace objects in photos seamlessly with AI technology', duration: '50' },
  'AI Sketch to Image': { title: 'AI Sketch to Image Tool', description: 'Convert sketches into realistic images using AI technology', duration: '75' },
  'Remove Background': { title: 'Remove Background Tool', description: 'Remove backgrounds from photos instantly with AI technology', duration: '30' }
};

// Video files
const videoFiles = [
  'AI Avatar.mp4', 'AI Background Generator.mp4', 'AI Caricature.mp4', 'AI Cartoon.mp4',
  'AI Cleanup.mp4', 'AI Expand.mp4', 'AI Face Swap.mp4', 'AI Filter.mp4', 'AI Hairstyle.mp4',
  'AI Image Generator_text-to-image.mp4', 'AI Image Upscaler.mp4', 'AI Image to Image.mp4',
  'AI Outfit.mp4', 'AI Portrait.mp4', 'AI Product Photoshoot.mp4', 'AI Replace.mp4',
  'AI Sketch to Image.mp4', 'Remove Background.mp4'
];

// Image files
const imageFiles = [
  'AI Avatar Tool.jpg', 'AI Background Generator Tool.jpg', 'AI Caricature Generator Tool.jpg',
  'AI Cartoon Tool.jpg', 'AI Cleanup Tool.jpg', 'Ai Expand tool.jpg', 'AI Face Swap Tool.jpg',
  'AI Filter Tool.jpg', 'AI Hairstyle Tool.jpg', 'AI Image Generator Tool.jpg',
  'AI Image Upscaler Tool.jpg', 'AI Image to Image Tool.jpg', 'AI Outfit Tool.jpg',
  'AI Portrait Tool.jpg', 'AI Product Photoshoot Tool.jpg', 'AI Replace tool.jpg',
  'AI Sketch to Image Tool.jpg', 'Remove Background tool.jpg'
];

function getCurrentDate() {
  return new Date().toISOString();
}

function generateVideoEntry(filename) {
  const toolKey = filename.replace('.mp4', '');
  const metadata = toolMetadata[toolKey] || { title: filename.replace('.mp4', ''), description: 'AI-powered photo editing tool video demonstration', duration: '60' };
  
  const videoUrl = `${BASE_URL}/tools%20videos/${encodeURIComponent(filename)}`;
  const thumbnailUrl = `${BASE_URL}/images/tools%20images/${encodeURIComponent(toolKey + ' Tool.jpg')}`;
  const toolPageUrl = `${BASE_URL}/tools/${toolKey.toLowerCase().replace(/_/g, '-').replace(/\s+/g, '-')}`;
  
  const lastmod = getCurrentDate();

  return `  <url>
    <loc>${toolPageUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <video:video>
      <video:thumbnail_loc>${thumbnailUrl}</video:thumbnail_loc>
      <video:title>${metadata.title}</video:title>
      <video:description>${metadata.description}</video:description>
      <video:content_loc>${videoUrl}</video:content_loc>
      <video:duration>${metadata.duration}</video:duration>
      <video:publication_date>${lastmod}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:tag>AI tools</video:tag>
      <video:tag>photo editing</video:tag>
      <video:tag>artificial intelligence</video:tag>
      <video:tag>image processing</video:tag>
    </video:video>
  </url>`;
}

function generateImageEntry(filename) {
  const toolKey = filename.replace(' Tool.jpg', '').replace('.jpg', '');
  const metadata = toolMetadata[toolKey] || { title: filename.replace('.jpg', ''), description: 'AI-powered photo editing tool demonstration image' };
  
  const imageUrl = `${BASE_URL}/images/tools%20images/${encodeURIComponent(filename)}`;
  const toolPageUrl = `${BASE_URL}/tools/${toolKey.toLowerCase().replace(/_/g, '-').replace(/\s+/g, '-')}`;
  
  const lastmod = getCurrentDate();

  return `  <url>
    <loc>${toolPageUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${metadata.title}</image:title>
      <image:caption>${metadata.description}</image:caption>
      <image:license>${BASE_URL}/terms-of-use</image:license>
      <image:geo_location>Global</image:geo_location>
    </image:image>
  </url>`;
}

function generateMultimediaSitemap() {
  console.log('Generating multimedia sitemap...');
  
  let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

  // Add video entries
  console.log(`Processing ${videoFiles.length} video files...`);
  videoFiles.forEach(filename => {
    xmlContent += generateVideoEntry(filename) + '\n';
  });

  // Add image entries
  console.log(`Processing ${imageFiles.length} image files...`);
  imageFiles.forEach(filename => {
    xmlContent += generateImageEntry(filename) + '\n';
  });

  xmlContent += '</urlset>';

  // Write to file
  fs.writeFileSync(OUTPUT_FILE, xmlContent, 'utf8');
  console.log(`Multimedia sitemap generated successfully: ${OUTPUT_FILE}`);
  console.log(`Total entries: ${videoFiles.length + imageFiles.length}`);
}

// Run the generator
try {
  generateMultimediaSitemap();
} catch (error) {
  console.error('Failed to generate multimedia sitemap:', error);
  process.exit(1);
}