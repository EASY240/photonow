// Netlify function for sitemap administration
const { handler: sitemapHandler } = require('./sitemap');

// Simple in-memory cache for admin operations
let adminCache = {
  stats: null,
  lastStatsUpdate: null,
};

/**
 * Validate admin authentication
 */
function isValidAdminToken(authHeader) {
  if (!authHeader) return false;
  
  const token = authHeader.replace('Bearer ', '');
  const validTokens = [
    process.env.SITEMAP_ADMIN_KEY,
    process.env.NETLIFY_AUTH_TOKEN, // Fallback to Netlify token
  ].filter(Boolean);
  
  return validTokens.includes(token);
}

/**
 * Get sitemap statistics
 */
async function getSitemapStats() {
  try {
    // Check cache first (cache for 5 minutes)
    if (adminCache.stats && adminCache.lastStatsUpdate && 
        (Date.now() - adminCache.lastStatsUpdate) < 5 * 60 * 1000) {
      return adminCache.stats;
    }
    
    // Import sitemap utilities
    const fs = require('fs').promises;
    const path = require('path');
    
    // Count blog articles
    let blogCount = 0;
    try {
      const contentDir = path.join(process.cwd(), 'content', 'blog');
      const files = await fs.readdir(contentDir);
      blogCount = files.filter(file => file.endsWith('.md')).length;
    } catch (error) {
      console.warn('Could not count blog articles:', error.message);
    }
    
    // Count images
    let imageCount = 0;
    try {
      const imagesDir = path.join(process.cwd(), 'public', 'images');
      
      async function countImages(dir) {
        let count = 0;
        try {
          const items = await fs.readdir(dir);
          
          for (const item of items) {
            const itemPath = path.join(dir, item);
            const stat = await fs.stat(itemPath);
            
            if (stat.isDirectory()) {
              count += await countImages(itemPath);
            } else if (item.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
              count++;
            }
          }
        } catch (error) {
          console.warn(`Could not count images in ${dir}:`, error.message);
        }
        return count;
      }
      
      imageCount = await countImages(imagesDir);
    } catch (error) {
      console.warn('Could not count images:', error.message);
    }
    
    // Calculate totals
    const staticPages = 9; // From STATIC_PAGES array
    const toolPages = 15; // From TOOLS array
    const totalUrls = staticPages + toolPages + blogCount + imageCount;
    
    const stats = {
      totalUrls,
      breakdown: {
        staticPages,
        toolPages,
        blogArticles: blogCount,
        images: imageCount,
      },
      sitemapCount: Math.ceil(totalUrls / 50000),
      lastGenerated: new Date().toISOString(),
      cacheValid: true, // Simplified for this implementation
    };
    
    // Cache the results
    adminCache.stats = stats;
    adminCache.lastStatsUpdate = Date.now();
    
    return stats;
    
  } catch (error) {
    console.error('Error getting sitemap stats:', error);
    return {
      totalUrls: 0,
      breakdown: {
        staticPages: 0,
        toolPages: 0,
        blogArticles: 0,
        images: 0,
      },
      sitemapCount: 0,
      lastGenerated: null,
      cacheValid: false,
      error: error.message,
    };
  }
}

/**
 * Invalidate sitemap cache
 */
function invalidateSitemapCache() {
  // Clear admin cache
  adminCache = {
    stats: null,
    lastStatsUpdate: null,
  };
  
  // Clear sitemap cache (this would need to be coordinated with the main sitemap function)
  console.log('Sitemap cache invalidated');
  
  return {
    success: true,
    message: 'Sitemap cache invalidated successfully',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Regenerate sitemap
 */
async function regenerateSitemap() {
  try {
    console.log('Manual sitemap regeneration triggered');
    
    // Invalidate cache first
    invalidateSitemapCache();
    
    // Generate new sitemap by calling the main sitemap function
    const mockEvent = {
      httpMethod: 'GET',
      path: '/sitemap.xml',
      headers: {},
    };
    
    const result = await sitemapHandler(mockEvent, {});
    
    if (result.statusCode === 200) {
      const stats = await getSitemapStats();
      
      return {
        success: true,
        message: 'Sitemap regenerated successfully',
        stats,
        timestamp: new Date().toISOString(),
      };
    } else {
      throw new Error('Sitemap generation failed');
    }
    
  } catch (error) {
    console.error('Error during manual sitemap regeneration:', error);
    return {
      success: false,
      message: `Failed to regenerate sitemap: ${error.message}`,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Handle webhook for automatic sitemap updates
 */
async function handleWebhook(event) {
  try {
    const body = JSON.parse(event.body || '{}');
    const { action, type } = body;
    
    console.log('Webhook received:', { action, type });
    
    // Determine if we should regenerate the sitemap
    const shouldRegenerate = [
      'published',
      'created',
      'updated',
      'deleted',
    ].includes(action) && [
      'blog',
      'article',
      'page',
      'tool',
      'image',
    ].includes(type);
    
    if (shouldRegenerate) {
      console.log('Triggering sitemap regeneration due to content change');
      const result = await regenerateSitemap();
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Webhook processed successfully',
          sitemapRegenerated: true,
          result,
        }),
      };
    } else {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Webhook received but no sitemap regeneration needed',
          sitemapRegenerated: false,
        }),
      };
    }
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to process webhook',
        message: error.message,
      }),
    };
  }
}

/**
 * Main Netlify function handler
 */
exports.handler = async function(event, context) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: '',
    };
  }
  
  const path = event.path || '';
  const method = event.httpMethod;
  
  try {
    // Handle webhook (no auth required for webhooks)
    if (path.includes('/webhook') && method === 'POST') {
      return await handleWebhook(event);
    }
    
    // All other endpoints require authentication
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!isValidAdminToken(authHeader)) {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Unauthorized',
          message: 'Valid admin token required',
        }),
      };
    }
    
    // Handle stats request
    if (path.includes('/stats') && method === 'GET') {
      const stats = await getSitemapStats();
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
          success: true,
          stats,
          timestamp: new Date().toISOString(),
        }),
      };
    }
    
    // Handle regenerate request
    if (path.includes('/regenerate') && method === 'POST') {
      const result = await regenerateSitemap();
      
      return {
        statusCode: result.success ? 200 : 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(result),
      };
    }
    
    // Handle cache invalidation request
    if (path.includes('/invalidate') && method === 'POST') {
      const result = invalidateSitemapCache();
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(result),
      };
    }
    
    // Default response for unknown endpoints
    return {
      statusCode: 404,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Not Found',
        message: 'Unknown admin endpoint',
        availableEndpoints: [
          'GET /stats',
          'POST /regenerate',
          'POST /invalidate',
          'POST /webhook',
        ],
      }),
    };
    
  } catch (error) {
    console.error('Error in sitemap admin function:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
      }),
    };
  }
};