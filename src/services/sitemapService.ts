import {
  getAllSitemapUrls,
  formatSitemapXml,
  formatSitemapIndexXml,
  chunkUrls,
  filterValidUrls,
  getSitemapCacheKey,
  isSitemapCacheValid,
  SITEMAP_CONFIG,
  type SitemapUrl,
} from '../utils/sitemap';

// Cache interface
interface SitemapCache {
  xml: string;
  timestamp: number;
  urlCount: number;
}

interface SitemapIndexCache {
  xml: string;
  sitemaps: string[];
  timestamp: number;
}

// In-memory cache (in production, this could be Redis or another cache store)
let sitemapCache: SitemapCache | null = null;
let sitemapIndexCache: SitemapIndexCache | null = null;

/**
 * Generate the main sitemap XML
 */
export async function generateSitemap(): Promise<string> {
  try {
    // Check cache first
    if (sitemapCache && isSitemapCacheValid(sitemapCache.timestamp)) {
      console.log('Returning cached sitemap');
      return sitemapCache.xml;
    }

    console.log('Generating new sitemap...');
    
    // Get all URLs
    const allUrls = await getAllSitemapUrls();
    console.log(`Found ${allUrls.length} URLs for sitemap`);
    
    // Validate URLs (filter out any that return non-200 status codes)
    const validUrls = await filterValidUrls(allUrls);
    console.log(`${validUrls.length} valid URLs after validation`);
    
    // Check if we need a sitemap index
    if (validUrls.length > SITEMAP_CONFIG.MAX_URLS_PER_SITEMAP) {
      return await generateSitemapIndex(validUrls);
    }
    
    // Generate single sitemap
    const xml = formatSitemapXml(validUrls);
    
    // Cache the result
    sitemapCache = {
      xml,
      timestamp: Date.now(),
      urlCount: validUrls.length,
    };
    
    console.log('Sitemap generated and cached successfully');
    return xml;
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw new Error('Failed to generate sitemap');
  }
}

/**
 * Generate sitemap index for large sites
 */
export async function generateSitemapIndex(urls?: SitemapUrl[]): Promise<string> {
  try {
    // Check cache first
    if (sitemapIndexCache && isSitemapCacheValid(sitemapIndexCache.timestamp)) {
      console.log('Returning cached sitemap index');
      return sitemapIndexCache.xml;
    }

    console.log('Generating new sitemap index...');
    
    // Get URLs if not provided
    if (!urls) {
      const allUrls = await getAllSitemapUrls();
      urls = await filterValidUrls(allUrls);
    }
    
    // Split URLs into chunks
    const urlChunks = chunkUrls(urls, SITEMAP_CONFIG.MAX_URLS_PER_SITEMAP);
    console.log(`Split ${urls.length} URLs into ${urlChunks.length} sitemaps`);
    
    // Generate individual sitemaps and store them
    const sitemapUrls: string[] = [];
    const baseUrl = getSiteOrigin();
    
    for (let i = 0; i < urlChunks.length; i++) {
      const chunkXml = formatSitemapXml(urlChunks[i]);
      const sitemapUrl = `${baseUrl}/sitemap-${i + 1}.xml`;
      sitemapUrls.push(sitemapUrl);
      
      // Store individual sitemap (in production, this would be saved to storage)
      await storeSitemapChunk(i + 1, chunkXml);
    }
    
    // Generate sitemap index XML
    const indexXml = formatSitemapIndexXml(sitemapUrls);
    
    // Cache the result
    sitemapIndexCache = {
      xml: indexXml,
      sitemaps: sitemapUrls,
      timestamp: Date.now(),
    };
    
    console.log('Sitemap index generated and cached successfully');
    return indexXml;
    
  } catch (error) {
    console.error('Error generating sitemap index:', error);
    throw new Error('Failed to generate sitemap index');
  }
}

/**
 * Get a specific sitemap chunk by number
 */
export async function getSitemapChunk(chunkNumber: number): Promise<string | null> {
  try {
    // In production, this would retrieve from storage
    const cacheKey = `sitemap_chunk_${chunkNumber}`;
    
    // For now, regenerate the chunk
    const allUrls = await getAllSitemapUrls();
    const validUrls = await filterValidUrls(allUrls);
    const urlChunks = chunkUrls(validUrls, SITEMAP_CONFIG.MAX_URLS_PER_SITEMAP);
    
    if (chunkNumber < 1 || chunkNumber > urlChunks.length) {
      return null;
    }
    
    const chunkUrls = urlChunks[chunkNumber - 1];
    return formatSitemapXml(chunkUrls);
    
  } catch (error) {
    console.error(`Error getting sitemap chunk ${chunkNumber}:`, error);
    return null;
  }
}

/**
 * Store a sitemap chunk (placeholder for production implementation)
 */
async function storeSitemapChunk(chunkNumber: number, xml: string): Promise<void> {
  // In production, this would save to file system, database, or cloud storage
  console.log(`Storing sitemap chunk ${chunkNumber} (${xml.length} characters)`);
  
  // For development, we could store in localStorage or memory
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(`sitemap_chunk_${chunkNumber}`, xml);
    } catch (error) {
      console.warn('Could not store sitemap chunk in localStorage:', error);
    }
  }
}

/**
 * Invalidate sitemap cache (call when content is updated)
 */
export function invalidateSitemapCache(): void {
  console.log('Invalidating sitemap cache');
  sitemapCache = null;
  sitemapIndexCache = null;
  
  // Clear localStorage cache if available
  if (typeof window !== 'undefined' && window.localStorage) {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('sitemap_chunk_')) {
        localStorage.removeItem(key);
      }
    });
  }
}

/**
 * Get sitemap statistics
 */
export async function getSitemapStats(): Promise<{
  totalUrls: number;
  validUrls: number;
  sitemapCount: number;
  lastGenerated: Date | null;
  cacheValid: boolean;
}> {
  try {
    const allUrls = await getAllSitemapUrls();
    const validUrls = await filterValidUrls(allUrls);
    const sitemapCount = Math.ceil(validUrls.length / SITEMAP_CONFIG.MAX_URLS_PER_SITEMAP);
    
    const lastGenerated = sitemapCache?.timestamp 
      ? new Date(sitemapCache.timestamp)
      : sitemapIndexCache?.timestamp 
        ? new Date(sitemapIndexCache.timestamp)
        : null;
    
    const cacheValid = sitemapCache 
      ? isSitemapCacheValid(sitemapCache.timestamp)
      : sitemapIndexCache 
        ? isSitemapCacheValid(sitemapIndexCache.timestamp)
        : false;
    
    return {
      totalUrls: allUrls.length,
      validUrls: validUrls.length,
      sitemapCount,
      lastGenerated,
      cacheValid,
    };
  } catch (error) {
    console.error('Error getting sitemap stats:', error);
    return {
      totalUrls: 0,
      validUrls: 0,
      sitemapCount: 0,
      lastGenerated: null,
      cacheValid: false,
    };
  }
}

/**
 * Trigger sitemap regeneration (useful for webhooks or manual updates)
 */
export async function regenerateSitemap(): Promise<{ success: boolean; message: string; stats?: any }> {
  try {
    console.log('Manual sitemap regeneration triggered');
    
    // Invalidate cache first
    invalidateSitemapCache();
    
    // Generate new sitemap
    const xml = await generateSitemap();
    const stats = await getSitemapStats();
    
    return {
      success: true,
      message: 'Sitemap regenerated successfully',
      stats,
    };
  } catch (error) {
    console.error('Error during manual sitemap regeneration:', error);
    return {
      success: false,
      message: `Failed to regenerate sitemap: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

// Helper function to get site origin (imported from siteConfig)
function getSiteOrigin(): string {
  // This should match the implementation in siteConfig.ts
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Server-side fallback
  return process.env.SITE_URL || 'https://modernphototools.com';
}