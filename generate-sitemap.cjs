const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');

class SitemapGenerator {
  constructor() {
    this.baseUrl = 'https://modernphototools.com';
    this.contentDir = path.resolve('./content/blog');
    this.toolsPath = path.resolve('./src/data/tools.ts');
    this.blogArticlesPath = path.resolve('./src/data/blogArticles.ts');
    this.sitemapPath = path.resolve('./public/sitemap.xml');
    this.lastGeneratedPath = path.resolve('./public/.sitemap-lastgen');
  }

  // Parse TypeScript data files
  parseDataFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const exportMatch = content.match(/export const (\w+):\s*\w+\[\]\s*=\s*(\[[\s\S]*?\]);/);
      
      if (exportMatch) {
        const [, varName, arrayContent] = exportMatch;
        let jsonContent = arrayContent
          .replace(/'/g, '"')
          .replace(/(\w+):/g, '"$1":')
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']');
        
        return JSON.parse(jsonContent);
      }
      return [];
    } catch (error) {
      console.warn(`Could not parse ${filePath}:`, error.message);
      return [];
    }
  }

  // Scan blog directory for markdown files
  async scanBlogArticles() {
    const articles = [];
    
    try {
      if (!fs.existsSync(this.contentDir)) {
        console.warn(`Blog content directory not found: ${this.contentDir}`);
        return articles;
      }

      const files = fs.readdirSync(this.contentDir);
      const markdownFiles = files.filter(file => file.endsWith('.md'));

      for (const file of markdownFiles) {
        try {
          const filePath = path.join(this.contentDir, file);
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const { data: frontmatter } = matter(fileContent);
          
          // Get file stats for lastmod
          const stats = fs.statSync(filePath);
          
          // Validate required frontmatter fields
          if (!frontmatter.id || !frontmatter.title) {
            console.warn(`Skipping ${file}: Missing required frontmatter (id or title)`);
            continue;
          }

          // Check if article is published (not draft)
          if (frontmatter.draft === true) {
            console.log(`Skipping draft article: ${file}`);
            continue;
          }

          articles.push({
            id: frontmatter.id,
            title: frontmatter.title,
            category: frontmatter.category || 'general',
            featuredImage: frontmatter.featuredImage || '',
            keywords: frontmatter.keywords || [],
            publishDate: frontmatter.publishDate || stats.birthtime.toISOString().split('T')[0],
            lastModified: stats.mtime,
            filePath: filePath
          });
        } catch (error) {
          console.warn(`Error processing ${file}:`, error.message);
        }
      }

      console.log(`✅ Scanned ${articles.length} published articles from ${markdownFiles.length} markdown files`);
      return articles;
    } catch (error) {
      console.error('Error scanning blog articles:', error);
      return articles;
    }
  }

  // Extract tools data
  extractToolsData() {
    try {
      const toolsContent = fs.readFileSync(this.toolsPath, 'utf-8');
      const toolMatches = toolsContent.matchAll(/{\s*id:\s*'([^']+)',[\s\S]*?path:\s*'([^']+)'[\s\S]*?}/g);
      
      return Array.from(toolMatches).map(match => ({
        id: match[1],
        path: match[2]
      }));
    } catch (error) {
      console.warn('Error extracting tools data:', error.message);
      return [];
    }
  }

  // Generate sitemap URLs
  generateUrls(tools, articles) {
    const urls = [];

    // Static pages with priorities and change frequencies
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

    urls.push(...staticPages);

    // Tool pages
    const toolPages = tools.map(tool => ({
      url: tool.path,
      changefreq: 'monthly',
      priority: 0.8,
      lastmod: new Date().toISOString()
    }));

    urls.push(...toolPages);

    // Blog article pages with proper lastmod dates
    const blogPages = articles.map(article => {
      const blogUrl = {
        url: `/blog/${article.id}`,
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: article.lastModified.toISOString()
      };

      // Add image if featured image exists
      if (article.featuredImage) {
        blogUrl.img = [{
          url: article.featuredImage.startsWith('http') 
            ? article.featuredImage 
            : `${this.baseUrl}${article.featuredImage}`,
          title: article.title,
          caption: `Featured image for: ${article.title}`
        }];
      }

      return blogUrl;
    });

    urls.push(...blogPages);

    // Blog category pages
    const uniqueCategories = [...new Set(articles.map(article => article.category))];
    const categoryPages = uniqueCategories.map(category => ({
      url: `/blog/category/${category}`,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString()
    }));

    urls.push(...categoryPages);

    // Blog tag pages from keywords
    const allKeywords = new Set();
    articles.forEach(article => {
      if (Array.isArray(article.keywords)) {
        article.keywords.forEach(keyword => {
          if (keyword && keyword.trim()) {
            allKeywords.add(keyword.trim());
          }
        });
      }
    });

    const tagPages = Array.from(allKeywords).map(tag => ({
      url: `/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
      changefreq: 'weekly',
      priority: 0.6,
      lastmod: new Date().toISOString()
    }));

    urls.push(...tagPages);

    return {
      urls,
      counts: {
        static: staticPages.length,
        tools: toolPages.length,
        articles: blogPages.length,
        categories: categoryPages.length,
        tags: tagPages.length,
        total: urls.length
      }
    };
  }

  // Validate sitemap XML
  validateSitemap(xmlContent) {
    try {
      // Basic XML validation
      if (!xmlContent.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
        throw new Error('Missing XML declaration');
      }
      
      // Check for sitemap namespace (more flexible)
      if (!xmlContent.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
        throw new Error('Missing sitemap namespace');
      }

      // Count URLs
      const urlCount = (xmlContent.match(/<url>/g) || []).length;
      if (urlCount === 0) {
        throw new Error('No URLs found in sitemap');
      }

      // Check for duplicate URLs
      const urlMatches = xmlContent.match(/<loc>(.*?)<\/loc>/g) || [];
      const urls = urlMatches.map(match => match.replace(/<\/?loc>/g, ''));
      const uniqueUrls = new Set(urls);
      
      if (urls.length !== uniqueUrls.size) {
        throw new Error(`Found ${urls.length - uniqueUrls.size} duplicate URLs`);
      }

      console.log(`✅ Sitemap validation passed: ${urlCount} URLs, no duplicates`);
      return true;
    } catch (error) {
      console.error('❌ Sitemap validation failed:', error.message);
      return false;
    }
  }

  // Check if regeneration is needed
  shouldRegenerate() {
    try {
      if (!fs.existsSync(this.sitemapPath)) {
        console.log('🔄 Sitemap not found, generating new one');
        return true;
      }

      if (!fs.existsSync(this.lastGeneratedPath)) {
        console.log('🔄 Last generation timestamp not found, regenerating');
        return true;
      }

      const lastGenerated = new Date(fs.readFileSync(this.lastGeneratedPath, 'utf-8'));
      const sitemapStats = fs.statSync(this.sitemapPath);
      
      // Check if any blog files are newer than the sitemap
      if (fs.existsSync(this.contentDir)) {
        const blogFiles = fs.readdirSync(this.contentDir)
          .filter(file => file.endsWith('.md'))
          .map(file => path.join(this.contentDir, file));

        for (const file of blogFiles) {
          const fileStats = fs.statSync(file);
          if (fileStats.mtime > sitemapStats.mtime) {
            console.log(`🔄 Blog file ${path.basename(file)} is newer than sitemap, regenerating`);
            return true;
          }
        }
      }

      // Check if data files are newer
      const dataFiles = [this.toolsPath, this.blogArticlesPath];
      for (const file of dataFiles) {
        if (fs.existsSync(file)) {
          const fileStats = fs.statSync(file);
          if (fileStats.mtime > sitemapStats.mtime) {
            console.log(`🔄 Data file ${path.basename(file)} is newer than sitemap, regenerating`);
            return true;
          }
        }
      }

      console.log('✅ Sitemap is up to date');
      return false;
    } catch (error) {
      console.warn('Error checking if regeneration needed:', error.message);
      return true;
    }
  }

  // Main generation method
  async generate(force = false) {
    try {
      console.log('🚀 Starting sitemap generation...');

      // Check if regeneration is needed (unless forced)
      if (!force && !this.shouldRegenerate()) {
        return { success: true, message: 'Sitemap is up to date' };
      }

      // Scan for articles and extract tools
      const [articles, tools] = await Promise.all([
        this.scanBlogArticles(),
        Promise.resolve(this.extractToolsData())
      ]);

      console.log(`📊 Found ${tools.length} tools and ${articles.length} articles`);

      // Generate URLs
      const { urls, counts } = this.generateUrls(tools, articles);

      // Create sitemap
      const sitemapStream = new SitemapStream({ hostname: this.baseUrl });
      
      urls.forEach(url => {
        sitemapStream.write(url);
      });
      
      sitemapStream.end();
      
      const sitemapXML = await streamToPromise(sitemapStream).then(data => data.toString());

      // Validate sitemap
      if (!this.validateSitemap(sitemapXML)) {
        throw new Error('Sitemap validation failed');
      }

      // Ensure public directory exists
      const publicDir = path.dirname(this.sitemapPath);
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      // Write sitemap
      fs.writeFileSync(this.sitemapPath, sitemapXML);
      
      // Update last generated timestamp
      fs.writeFileSync(this.lastGeneratedPath, new Date().toISOString());

      console.log(`✅ Sitemap generated successfully at ${this.sitemapPath}`);
      console.log(`📊 Breakdown:`);
      console.log(`   - Static pages: ${counts.static}`);
      console.log(`   - Tool pages: ${counts.tools}`);
      console.log(`   - Blog articles: ${counts.articles}`);
      console.log(`   - Blog categories: ${counts.categories}`);
      console.log(`   - Blog tags: ${counts.tags}`);
      console.log(`   - Total URLs: ${counts.total}`);

      return { 
        success: true, 
        message: 'Sitemap generated successfully',
        counts,
        path: this.sitemapPath
      };

    } catch (error) {
      console.error('❌ Sitemap generation failed:', error);
      return { 
        success: false, 
        message: error.message,
        error: error
      };
    }
  }
}

// CLI execution
async function main() {
  const generator = new SitemapGenerator();
  const force = process.argv.includes('--force') || process.argv.includes('-f');
  
  const result = await generator.generate(force);
  
  if (!result.success) {
    process.exit(1);
  }
}

// Export for programmatic use
module.exports = { SitemapGenerator };

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}