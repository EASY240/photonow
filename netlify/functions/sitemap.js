// Netlify function for serving sitemap.xml
const fs = require('fs').promises;
const path = require('path');

// Import the sitemap utilities (we'll need to adapt these for Node.js)
// Since we can't directly import TypeScript modules in Netlify functions,
// we'll implement the core functionality here

// Configuration
const SITEMAP_CONFIG = {
  MAX_URLS_PER_SITEMAP: 50000,
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  DEFAULT_CHANGEFREQ: 'weekly',
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
];

/**
 * Load tools from the actual tools data file
 */
async function loadTools() {
  try {
    // Read the tools.ts file and extract the tools array
    const toolsFilePath = path.join(process.cwd(), 'src', 'data', 'tools.ts');
    const toolsContent = await fs.readFile(toolsFilePath, 'utf-8');
    
    // Extract tools data using regex (since we can't directly import TypeScript)
    const toolsMatch = toolsContent.match(/export const tools: Tool\[\] = \[([\s\S]*?)\];/);
    if (!toolsMatch) {
      throw new Error('Could not parse tools from tools.ts');
    }
    
    // Parse each tool object
    const toolsArrayContent = toolsMatch[1];
    const toolObjects = [];
    
    // Split by tool objects (looking for id, name, path patterns)
    const toolMatches = toolsArrayContent.match(/\{[^}]*id:\s*['"`]([^'"`]+)['"`][^}]*name:\s*['"`]([^'"`]+)['"`][^}]*path:\s*['"`]([^'"`]+)['"`][^}]*\}/g);
    
    if (toolMatches) {
      for (const toolMatch of toolMatches) {
        const idMatch = toolMatch.match(/id:\s*['"`]([^'"`]+)['"`]/);
        const nameMatch = toolMatch.match(/name:\s*['"`]([^'"`]+)['"`]/);
        const pathMatch = toolMatch.match(/path:\s*['"`]([^'"`]+)['"`]/);
        
        if (idMatch && nameMatch && pathMatch) {
          toolObjects.push({
            id: idMatch[1],
            name: nameMatch[1],
            path: pathMatch[1]
          });
        }
      }
    }
    
    return toolObjects;
  } catch (error) {
    console.error('Error loading tools:', error);
    // Fallback to empty array if loading fails
    return [];
  }
}

// Cache storage (in production, this could be in a database or external cache)
let sitemapCache = null;

/**
 * Get site origin
 */
function getSiteOrigin() {
  return process.env.URL || process.env.SITE_URL || 'https://modernphototools.com';
}

/**
 * Escape XML characters
 */
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Load blog articles from markdown files
 */
async function loadBlogArticles() {
  try {
    const contentDir = path.join(process.cwd(), 'content', 'blog');
    const files = await fs.readdir(contentDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    const articles = [];
    for (const file of markdownFiles) {
      const filePath = path.join(contentDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Extract frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        const slug = file.replace('.md', '');
        
        // Parse basic frontmatter (simplified)
        const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n]+)["']?/);
        const dateMatch = frontmatter.match(/date:\s*["']?([^"'\n]+)["']?/);
        
        if (titleMatch) {
          articles.push({
            slug,
            title: titleMatch[1],
            date: dateMatch ? dateMatch[1] : new Date().toISOString(),
          });
        }
      }
    }
    
    return articles;
  } catch (error) {
    console.error('Error loading blog articles:', error);
    return [];
  }
}

/**
 * Get all image files from public directory
 */
async function getImageFiles() {
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    const images = [];
    
    async function scanDirectory(dir, relativePath = '') {
      try {
        const items = await fs.readdir(dir);
        
        for (const item of items) {
          const itemPath = path.join(dir, item);
          const stat = await fs.stat(itemPath);
          
          if (stat.isDirectory()) {
            await scanDirectory(itemPath, path.join(relativePath, item));
          } else if (item.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
            images.push({
              path: `/images/${path.join(relativePath, item).replace(/\\/g, '/')}`,
              filename: item,
            });
          }
        }
      } catch (error) {
        console.warn(`Could not scan directory ${dir}:`, error.message);
      }
    }
    
    await scanDirectory(imagesDir);
    return images;
  } catch (error) {
    console.error('Error loading images:', error);
    return [];
  }
}

/**
 * Generate all sitemap URLs
 */
async function getAllSitemapUrls() {
  const baseUrl = getSiteOrigin();
  const urls = [];
  const now = new Date().toISOString().split('T')[0];
  
  // Add static pages
  STATIC_PAGES.forEach(page => {
    urls.push({
      loc: `${baseUrl}${page.path}`,
      lastmod: now,
      changefreq: page.changefreq,
      priority: page.priority,
    });
  });
  
  // Add tool pages
  TOOLS.forEach(tool => {
    urls.push({
      loc: `${baseUrl}${tool.path}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: SITEMAP_CONFIG.MEDIUM_PRIORITY,
    });
  });
  
  // Add blog articles
  try {
    const articles = await loadBlogArticles();
    articles.forEach(article => {
      urls.push({
        loc: `${baseUrl}/blog/${article.slug}`,
        lastmod: article.date.split('T')[0],
        changefreq: 'monthly',
        priority: SITEMAP_CONFIG.MEDIUM_PRIORITY,
      });
    });
  } catch (error) {
    console.error('Error adding blog articles to sitemap:', error);
  }
  
  // Add image files
  try {
    const images = await getImageFiles();
    images.forEach(image => {
      urls.push({
        loc: `${baseUrl}${image.path}`,
        lastmod: now,
        changefreq: 'yearly',
        priority: SITEMAP_CONFIG.LOW_PRIORITY,
      });
    });
  } catch (error) {
    console.error('Error adding images to sitemap:', error);
  }
  
  return urls;
}

/**
 * Format sitemap XML
 */
function formatSitemapXml(urls) {
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
 * Check if cache is valid
 */
function isCacheValid(timestamp) {
  return timestamp && (Date.now() - timestamp) < SITEMAP_CONFIG.CACHE_DURATION;
}

/**
 * Generate sitemap
 */
async function generateSitemap() {
  try {
    // Check cache first
    if (sitemapCache && isCacheValid(sitemapCache.timestamp)) {
      console.log('Returning cached sitemap');
      return sitemapCache.xml;
    }
    
    console.log('Generating new sitemap...');
    
    // Get all URLs
    const allUrls = await getAllSitemapUrls();
    console.log(`Found ${allUrls.length} URLs for sitemap`);
    
    // Generate XML
    const xml = formatSitemapXml(allUrls);
    
    // Cache the result
    sitemapCache = {
      xml,
      timestamp: Date.now(),
      urlCount: allUrls.length,
    };
    
    console.log('Sitemap generated and cached successfully');
    return xml;
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw new Error('Failed to generate sitemap');
  }
}

/**
 * Netlify function handler
 */
exports.handler = async function(event, context) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }
  
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
      body: '<?xml version="1.0" encoding="UTF-8"?><error>Method Not Allowed</error>',
    };
  }
  
  try {
    console.log('Sitemap request received');
    
    // Generate sitemap
    const sitemapXml = await generateSitemap();
    
    // Return sitemap with appropriate headers
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
        'Access-Control-Allow-Origin': '*',
      },
      body: sitemapXml,
    };
    
  } catch (error) {
    console.error('Error serving sitemap:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
      body: '<?xml version="1.0" encoding="UTF-8"?><error>Internal Server Error</error>',
    };
  }
};