import { getSiteOrigin } from './siteConfig';
import { loadBlogArticles } from './blogLoader';
import { tools } from '../data/tools';

// Sitemap URL entry interface following Google's sitemap protocol
export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

// Sitemap configuration
export const SITEMAP_CONFIG = {
  MAX_URLS_PER_SITEMAP: 50000,
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  DEFAULT_CHANGEFREQ: 'weekly' as const,
  DEFAULT_PRIORITY: 0.5,
  HIGH_PRIORITY: 0.9,
  MEDIUM_PRIORITY: 0.7,
  LOW_PRIORITY: 0.3,
};

// Static pages configuration
const STATIC_PAGES = [
  { path: '/', changefreq: 'daily', priority: 1.0 },
  { path: '/tools', changefreq: 'weekly', priority: 0.9 },
  { path: '/blog', changefreq: 'daily', priority: 0.8 },
  { path: '/about', changefreq: 'monthly', priority: 0.6 },
  { path: '/contact', changefreq: 'monthly', priority: 0.6 },
  { path: '/privacy-policy', changefreq: 'yearly', priority: 0.3 },
  { path: '/terms-of-use', changefreq: 'yearly', priority: 0.3 },
  { path: '/dmca', changefreq: 'yearly', priority: 0.3 },
  { path: '/cookies-policy', changefreq: 'yearly', priority: 0.3 },
] as const;

/**
 * Generate sitemap URLs for static pages
 */
export function getStaticPageUrls(): SitemapUrl[] {
  const baseUrl = getSiteOrigin();
  
  return STATIC_PAGES.map(page => ({
    loc: `${baseUrl}${page.path}`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: page.changefreq,
    priority: page.priority,
  }));
}

/**
 * Generate sitemap URLs for blog articles
 */
export async function getBlogArticleUrls(): Promise<SitemapUrl[]> {
  try {
    const articles = await loadBlogArticles();
    const baseUrl = getSiteOrigin();
    
    return articles.map(article => ({
      loc: `${baseUrl}/blog/${article.id}`,
      lastmod: article.publishDate,
      changefreq: 'monthly' as const,
      priority: SITEMAP_CONFIG.MEDIUM_PRIORITY,
    }));
  } catch (error) {
    console.error('Error loading blog articles for sitemap:', error);
    return [];
  }
}

/**
 * Generate sitemap URLs for tools
 */
export function getToolUrls(): SitemapUrl[] {
  const baseUrl = getSiteOrigin();
  
  return tools.map(tool => ({
    loc: `${baseUrl}${tool.path}`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly' as const,
    priority: SITEMAP_CONFIG.HIGH_PRIORITY,
  }));
}

/**
 * Generate sitemap URLs for images in the public directory
 */
export function getImageUrls(): SitemapUrl[] {
  const baseUrl = getSiteOrigin();
  const imageUrls: SitemapUrl[] = [];
  
  // Blog images
  const blogImages = [
    'DO&AVOID.webp',
    'Ghibli-Style.webp',
    'Modern-Phototools-AI-Background-Generator.webp',
    'ai-background-generators.svg',
    'ai-cartoon-effect.svg',
    'ai-image-enhancement.svg',
    'ai-photo-upscaling.svg',
    'ai-portrait-enhancement.svg',
    'easter-card-messages.svg',
    'holi-photoshoot-ideas.svg',
    'remove-background-guide.svg',
    'studio-ghibli-ai-art.svg',
  ];
  
  blogImages.forEach(image => {
    imageUrls.push({
      loc: `${baseUrl}/images/blog/${image}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'yearly' as const,
      priority: SITEMAP_CONFIG.LOW_PRIORITY,
    });
  });
  
  // Tool images
  const toolImages = [
    'AI Avatar Tool.jpg',
    'AI Background Generator Tool.jpg',
    'AI Caricature Generator Tool.jpg',
    'AI Cartoon Tool.jpg',
    'AI Cleanup Tool.jpg',
    'AI Face Swap Tool.jpg',
    'AI Filter Tool.jpg',
    'AI Hairstyle Tool.jpg',
    'AI Image Generator Tool.jpg',
    'AI Image Upscaler Tool.jpg',
    'AI Image to Image Tool.jpg',
    'AI Outfit Tool.jpg',
    'AI Portrait Tool.jpg',
    'AI Product Photoshoot Tool.jpg',
    'AI Replace tool.jpg',
    'AI Sketch to Image Tool.jpg',
    'Ai Expand tool.jpg',
    'Remove Background tool.jpg',
  ];
  
  toolImages.forEach(image => {
    imageUrls.push({
      loc: `${baseUrl}/images/tools%20images/${encodeURIComponent(image)}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'yearly' as const,
      priority: SITEMAP_CONFIG.LOW_PRIORITY,
    });
  });
  
  return imageUrls;
}

/**
 * Generate all sitemap URLs
 */
export async function getAllSitemapUrls(): Promise<SitemapUrl[]> {
  const [staticUrls, blogUrls, toolUrls, imageUrls] = await Promise.all([
    Promise.resolve(getStaticPageUrls()),
    getBlogArticleUrls(),
    Promise.resolve(getToolUrls()),
    Promise.resolve(getImageUrls()),
  ]);
  
  return [...staticUrls, ...blogUrls, ...toolUrls, ...imageUrls];
}

/**
 * Format sitemap URLs as XML following Google's sitemap protocol
 */
export function formatSitemapXml(urls: SitemapUrl[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = '</urlset>';
  
  const urlEntries = urls.map(url => {
    let urlXml = `  <url>\n    <loc>${escapeXml(url.loc)}</loc>`;
    
    if (url.lastmod) {
      urlXml += `\n    <lastmod>${url.lastmod}</lastmod>`;
    }
    
    if (url.changefreq) {
      urlXml += `\n    <changefreq>${url.changefreq}</changefreq>`;
    }
    
    if (url.priority !== undefined) {
      urlXml += `\n    <priority>${url.priority.toFixed(1)}</priority>`;
    }
    
    urlXml += '\n  </url>';
    return urlXml;
  }).join('\n');
  
  return `${xmlHeader}\n${urlsetOpen}\n${urlEntries}\n${urlsetClose}`;
}

/**
 * Format sitemap index XML for large sites
 */
export function formatSitemapIndexXml(sitemapUrls: string[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const sitemapIndexOpen = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const sitemapIndexClose = '</sitemapindex>';
  
  const sitemapEntries = sitemapUrls.map(url => {
    const lastmod = new Date().toISOString().split('T')[0];
    return `  <sitemap>\n    <loc>${escapeXml(url)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`;
  }).join('\n');
  
  return `${xmlHeader}\n${sitemapIndexOpen}\n${sitemapEntries}\n${sitemapIndexClose}`;
}

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Split URLs into chunks for sitemap index
 */
export function chunkUrls(urls: SitemapUrl[], chunkSize: number = SITEMAP_CONFIG.MAX_URLS_PER_SITEMAP): SitemapUrl[][] {
  const chunks: SitemapUrl[][] = [];
  
  for (let i = 0; i < urls.length; i += chunkSize) {
    chunks.push(urls.slice(i, i + chunkSize));
  }
  
  return chunks;
}

/**
 * Validate URL accessibility (returns true if URL returns 200 status)
 */
export async function validateUrl(url: string): Promise<boolean> {
  try {
    // For client-side validation, we'll use a simple approach
    // In a real implementation, this would be done server-side
    if (typeof window !== 'undefined') {
      // Client-side: assume internal URLs are valid
      const baseUrl = getSiteOrigin();
      return url.startsWith(baseUrl);
    }
    
    // Server-side validation would go here
    // For now, return true for all URLs
    return true;
  } catch (error) {
    console.error(`Error validating URL ${url}:`, error);
    return false;
  }
}

/**
 * Filter out invalid URLs from sitemap
 */
export async function filterValidUrls(urls: SitemapUrl[]): Promise<SitemapUrl[]> {
  const validationPromises = urls.map(async (url) => {
    const isValid = await validateUrl(url.loc);
    return isValid ? url : null;
  });
  
  const results = await Promise.all(validationPromises);
  return results.filter((url): url is SitemapUrl => url !== null);
}

/**
 * Get sitemap cache key
 */
export function getSitemapCacheKey(): string {
  return 'sitemap_cache';
}

/**
 * Check if sitemap cache is valid
 */
export function isSitemapCacheValid(cacheTimestamp: number): boolean {
  return Date.now() - cacheTimestamp < SITEMAP_CONFIG.CACHE_DURATION;
}