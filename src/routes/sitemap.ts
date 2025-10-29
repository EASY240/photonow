import { Request, Response } from 'express';
import { 
  generateSitemap, 
  generateSitemapIndex, 
  getSitemapChunk, 
  getSitemapStats,
  regenerateSitemap,
  invalidateSitemapCache 
} from '../services/sitemapService';

/**
 * Handle sitemap.xml requests
 */
export async function handleSitemapRequest(req: Request, res: Response): Promise<void> {
  try {
    console.log('Sitemap request received');
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600'); // Cache for 1 hour
    
    // Generate sitemap
    const sitemapXml = await generateSitemap();
    
    // Send response
    res.status(200).send(sitemapXml);
    
  } catch (error) {
    console.error('Error serving sitemap:', error);
    res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><error>Internal Server Error</error>');
  }
}

/**
 * Handle sitemap index requests (for large sites)
 */
export async function handleSitemapIndexRequest(req: Request, res: Response): Promise<void> {
  try {
    console.log('Sitemap index request received');
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    
    // Generate sitemap index
    const indexXml = await generateSitemapIndex();
    
    // Send response
    res.status(200).send(indexXml);
    
  } catch (error) {
    console.error('Error serving sitemap index:', error);
    res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><error>Internal Server Error</error>');
  }
}

/**
 * Handle individual sitemap chunk requests (sitemap-1.xml, sitemap-2.xml, etc.)
 */
export async function handleSitemapChunkRequest(req: Request, res: Response): Promise<void> {
  try {
    const chunkNumber = parseInt(req.params.chunkNumber, 10);
    
    if (isNaN(chunkNumber) || chunkNumber < 1) {
      res.status(404).send('<?xml version="1.0" encoding="UTF-8"?><error>Sitemap chunk not found</error>');
      return;
    }
    
    console.log(`Sitemap chunk ${chunkNumber} request received`);
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    
    // Get sitemap chunk
    const chunkXml = await getSitemapChunk(chunkNumber);
    
    if (!chunkXml) {
      res.status(404).send('<?xml version="1.0" encoding="UTF-8"?><error>Sitemap chunk not found</error>');
      return;
    }
    
    // Send response
    res.status(200).send(chunkXml);
    
  } catch (error) {
    console.error(`Error serving sitemap chunk ${req.params.chunkNumber}:`, error);
    res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><error>Internal Server Error</error>');
  }
}

/**
 * Handle sitemap stats requests (for debugging/monitoring)
 */
export async function handleSitemapStatsRequest(req: Request, res: Response): Promise<void> {
  try {
    console.log('Sitemap stats request received');
    
    const stats = await getSitemapStats();
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    
    res.status(200).json({
      success: true,
      stats,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Error getting sitemap stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get sitemap stats',
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Handle manual sitemap regeneration requests
 */
export async function handleSitemapRegenerateRequest(req: Request, res: Response): Promise<void> {
  try {
    console.log('Manual sitemap regeneration request received');
    
    // Check for authorization (in production, add proper auth)
    const authHeader = req.headers.authorization;
    if (!authHeader || !isValidAuthToken(authHeader)) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date().toISOString(),
      });
      return;
    }
    
    const result = await regenerateSitemap();
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    
    res.status(result.success ? 200 : 500).json({
      ...result,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Error during manual sitemap regeneration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to regenerate sitemap',
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Handle cache invalidation requests
 */
export async function handleSitemapCacheInvalidateRequest(req: Request, res: Response): Promise<void> {
  try {
    console.log('Sitemap cache invalidation request received');
    
    // Check for authorization (in production, add proper auth)
    const authHeader = req.headers.authorization;
    if (!authHeader || !isValidAuthToken(authHeader)) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date().toISOString(),
      });
      return;
    }
    
    invalidateSitemapCache();
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    
    res.status(200).json({
      success: true,
      message: 'Sitemap cache invalidated successfully',
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Error invalidating sitemap cache:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to invalidate sitemap cache',
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Validate auth token (placeholder - implement proper authentication)
 */
function isValidAuthToken(authHeader: string): boolean {
  // In production, implement proper JWT validation or API key checking
  const token = authHeader.replace('Bearer ', '');
  
  // For development, accept a simple token
  const validTokens = [
    process.env.SITEMAP_API_KEY,
    'dev-sitemap-key', // Development fallback
  ].filter(Boolean);
  
  return validTokens.includes(token);
}

/**
 * Middleware to handle sitemap-related requests
 */
export function sitemapMiddleware(req: Request, res: Response, next: Function): void {
  // Add CORS headers for sitemap requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
}

/**
 * Route configuration for Express.js
 */
export const sitemapRoutes = {
  // Main sitemap
  'GET /sitemap.xml': handleSitemapRequest,
  
  // Sitemap index (for large sites)
  'GET /sitemap-index.xml': handleSitemapIndexRequest,
  
  // Individual sitemap chunks
  'GET /sitemap-:chunkNumber.xml': handleSitemapChunkRequest,
  
  // Admin/debugging endpoints
  'GET /api/sitemap/stats': handleSitemapStatsRequest,
  'POST /api/sitemap/regenerate': handleSitemapRegenerateRequest,
  'POST /api/sitemap/invalidate-cache': handleSitemapCacheInvalidateRequest,
};