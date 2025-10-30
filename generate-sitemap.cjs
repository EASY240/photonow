const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('node:fs');
const path = require('node:path');

// Since we can't directly import TypeScript files in Node.js,
// we'll read and parse the data files manually
function parseDataFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract the export statement and evaluate it
  // This is a simple approach for our specific data structure
  const exportMatch = content.match(/export const (\w+):\s*\w+\[\]\s*=\s*(\[[\s\S]*?\]);/);
  if (exportMatch) {
    const [, varName, arrayContent] = exportMatch;
    // Clean up the array content to make it valid JSON
    let jsonContent = arrayContent
      .replace(/'/g, '"')  // Replace single quotes with double quotes
      .replace(/(\w+):/g, '"$1":')  // Quote object keys
      .replace(/,\s*}/g, '}')  // Remove trailing commas
      .replace(/,\s*]/g, ']'); // Remove trailing commas in arrays
    
    try {
      return JSON.parse(jsonContent);
    } catch (e) {
      console.warn(`Could not parse ${filePath}:`, e.message);
      return [];
    }
  }
  return [];
}

async function generateSitemap() {
  const baseUrl = 'https://modernphototools.com';

  // Read data files
  const toolsPath = path.resolve('./src/data/tools.ts');
  const blogArticlesPath = path.resolve('./src/data/blogArticles.ts');
  
  let tools = [];
  let blogArticles = [];
  
  try {
    // For tools, we need to extract the tools array
    const toolsContent = fs.readFileSync(toolsPath, 'utf-8');
    const toolsMatch = toolsContent.match(/export const tools:\s*Tool\[\]\s*=\s*(\[[\s\S]*?\]);/);
    if (toolsMatch) {
      // Manually extract tool data
      const toolMatches = toolsContent.matchAll(/{\s*id:\s*'([^']+)',[\s\S]*?path:\s*'([^']+)'[\s\S]*?}/g);
      tools = Array.from(toolMatches).map(match => ({
        id: match[1],
        path: match[2]
      }));
    }
    
    // For blog articles, extract the blogArticleIndex
    const blogContent = fs.readFileSync(blogArticlesPath, 'utf-8');
    
    // Extract each article object from the blogArticleIndex array
    const blogArrayMatch = blogContent.match(/export const blogArticleIndex = \[([\s\S]*?)\];/);
    if (blogArrayMatch) {
      const arrayContent = blogArrayMatch[1];
      
      // Split by objects (looking for id: pattern at the start of objects)
      const articleMatches = arrayContent.matchAll(/{\s*id:\s*'([^']+)',[\s\S]*?category:\s*'([^']+)'[\s\S]*?(?=\s*},?\s*(?:{|$))/g);
      
      blogArticles = Array.from(articleMatches).map(match => {
        const fullMatch = match[0];
        const id = match[1];
        const category = match[2];
        
        // Extract featuredImage
        const imageMatch = fullMatch.match(/featuredImage:\s*'([^']+)'/);
        const featuredImage = imageMatch ? imageMatch[1] : '';
        
        // Extract keywords if present
        const keywordsMatch = fullMatch.match(/keywords\?:\s*\[([^\]]*)\]/);
        let keywords = [];
        if (keywordsMatch) {
          keywords = keywordsMatch[1]
            .split(',')
            .map(k => k.trim().replace(/'/g, ''))
            .filter(k => k.length > 0);
        }
        
        return {
          id,
          featuredImage,
          category,
          keywords
        };
      });
    }
    
  } catch (error) {
    console.error('Error reading data files:', error);
    return;
  }

  console.log(`Found ${tools.length} tools and ${blogArticles.length} blog articles`);

  // --- 1. Define all your routes ---

  // Static Pages (High Priority)
  const staticPages = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/tools', changefreq: 'daily', priority: 0.9 },
    { url: '/blog', changefreq: 'daily', priority: 0.9 },
    { url: '/about', changefreq: 'yearly', priority: 0.7 },
    { url: '/contact', changefreq: 'yearly', priority: 0.7 },
    { url: '/privacy-policy', changefreq: 'yearly', priority: 0.5 },
    { url: '/terms-of-use', changefreq: 'yearly', priority: 0.5 },
    { url: '/dmca', changefreq: 'yearly', priority: 0.5 },
    { url: '/cookies-policy', changefreq: 'yearly', priority: 0.5 },
  ];

  // Dynamic Tool Pages (High Priority)
  const toolPages = tools.map(tool => ({
    url: tool.path,
    changefreq: 'monthly',
    priority: 0.8
  }));

  // Dynamic Blog Pages (Medium Priority)
  const blogPages = blogArticles.map(article => ({
    url: `/blog/${article.id}`,
    changefreq: 'monthly',
    priority: 0.7,
    img: [
      {
        url: article.featuredImage.startsWith('http') 
          ? article.featuredImage 
          : `${baseUrl}${article.featuredImage}`,
        title: `Image for ${article.id}`,
        caption: `Featured image for blog article: ${article.id}`,
      }
    ]
  }));

  // Blog Category Pages (based on actual categories in your data)
  const uniqueCategories = [...new Set(blogArticles.map(article => article.category))];
  const blogCategoryPages = uniqueCategories.map(category => ({
    url: `/blog/category/${category}`,
    changefreq: 'weekly',
    priority: 0.7
  }));

  // Blog Tag Pages (based on keywords from articles)
  const allKeywords = new Set();
  blogArticles.forEach(article => {
    if (article.keywords && Array.isArray(article.keywords)) {
      article.keywords.forEach(keyword => {
        if (keyword && keyword.trim()) {
          allKeywords.add(keyword.trim());
        }
      });
    }
  });
  
  const blogTagPages = Array.from(allKeywords).map(tag => ({
    url: `/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
    changefreq: 'weekly',
    priority: 0.6
  }));

  // --- 2. Combine all routes into one list ---
  const allRoutes = [
    ...staticPages,
    ...toolPages,
    ...blogPages,
    ...blogCategoryPages,
    ...blogTagPages,
  ];

  // --- 3. Create the sitemap ---
  const sitemapStream = new SitemapStream({ hostname: baseUrl });
  
  // Write all URLs to the stream
  allRoutes.forEach(route => {
    sitemapStream.write(route);
  });
  
  // End the stream
  sitemapStream.end();
  
  // Convert stream to string
  const sitemapXML = await streamToPromise(sitemapStream).then(data => data.toString());

  // --- 4. Write the sitemap to a file in the public directory ---
  const publicPath = path.resolve('./public');
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath);
  }
  
  const sitemapPath = path.join(publicPath, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapXML);

  console.log(`✅ Sitemap with ${allRoutes.length} URLs generated at ${sitemapPath}`);
  console.log(`📊 Breakdown:`);
  console.log(`   - Static pages: ${staticPages.length}`);
  console.log(`   - Tool pages: ${toolPages.length}`);
  console.log(`   - Blog articles: ${blogPages.length}`);
  console.log(`   - Blog categories: ${blogCategoryPages.length}`);
  console.log(`   - Blog tags: ${blogTagPages.length}`);
}

generateSitemap().catch(console.error);