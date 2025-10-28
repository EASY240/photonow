import { BlogArticle } from '../data/blogArticles';

// Use Vite's glob import to get all markdown files
const blogModules = import.meta.glob('/content/blog/*.md', { 
  as: 'raw',
  eager: true 
});

export interface BlogArticleWithContent extends BlogArticle {
  rawContent: string;
}

// Cache for parsed articles
let articlesCache: BlogArticleWithContent[] | null = null;

/**
 * Browser-compatible frontmatter parser
 */
function parseFrontmatter(content: string): { data: any; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, content };
  }
  
  const [, yamlContent, markdownContent] = match;
  const data: any = {};
  
  // Simple YAML parser for frontmatter
  const lines = yamlContent.split('\n');
  let currentKey = '';
  let inArray = false;
  let arrayItems: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      // Handle array items
      if (trimmed.startsWith('- ')) {
        if (inArray) {
          arrayItems.push(trimmed.substring(2).trim().replace(/^["']|["']$/g, ''));
        }
        continue;
      }
      
      // If we were in an array, save it
      if (inArray && currentKey) {
        data[currentKey] = arrayItems;
        inArray = false;
        arrayItems = [];
        currentKey = '';
      }
      
      const colonIndex = trimmed.indexOf(':');
      if (colonIndex > 0) {
        const key = trimmed.substring(0, colonIndex).trim();
        let value = trimmed.substring(colonIndex + 1).trim();
        
        // Check if this is the start of an array
        if (value === '' || value === '[') {
          currentKey = key;
          inArray = true;
          arrayItems = [];
          continue;
        }
        
        // Handle inline arrays
        if (value.startsWith('[') && value.endsWith(']')) {
          const arrayContent = value.slice(1, -1);
          data[key] = arrayContent.split(',').map(item => item.trim().replace(/^["']|["']$/g, ''));
          continue;
        }
        
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        data[key] = value;
      }
    }
  }
  
  // Handle final array if we ended in one
  if (inArray && currentKey) {
    data[currentKey] = arrayItems;
  }
  
  return { data, content: markdownContent };
}

/**
 * Load and parse all blog articles from markdown files
 */
export async function loadBlogArticles(): Promise<BlogArticleWithContent[]> {
  if (articlesCache) {
    return articlesCache;
  }

  const articles: BlogArticleWithContent[] = [];

  for (const [path, content] of Object.entries(blogModules)) {
    try {
      // Parse frontmatter and content
      const { data, content: markdownContent } = parseFrontmatter(content as string);
      
      // Extract filename without extension for ID validation
      const filename = path.split('/').pop()?.replace('.md', '') || '';
      
      // Create article object
      const article: BlogArticleWithContent = {
        id: data.id || filename,
        title: data.title || 'Untitled',
        excerpt: data.excerpt || '',
        content: markdownContent,
        rawContent: content as string,
        publishDate: data.publishDate || new Date().toISOString().split('T')[0],
        readTime: data.readTime || '5 min read',
        category: data.category || 'general',
        featuredImage: data.featuredImage || '/images/blog/default.svg',
        relatedTool: data.relatedTool,
        keywords: data.keywords ? (Array.isArray(data.keywords) ? data.keywords : [data.keywords]) : []
      };

      articles.push(article);
    } catch (error) {
      console.error(`Error parsing blog article at ${path}:`, error);
    }
  }

  // Sort articles by publish date (newest first)
  articles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  articlesCache = articles;
  return articles;
}

/**
 * Get a single article by ID
 */
export async function getBlogArticleById(id: string): Promise<BlogArticleWithContent | undefined> {
  const articles = await loadBlogArticles();
  return articles.find(article => article.id === id);
}

/**
 * Get articles by category
 */
export async function getBlogArticlesByCategory(category: 'general' | 'tools'): Promise<BlogArticleWithContent[]> {
  const articles = await loadBlogArticles();
  return articles.filter(article => article.category === category);
}

/**
 * Get recent articles
 */
export async function getRecentBlogArticles(limit: number = 3): Promise<BlogArticleWithContent[]> {
  const articles = await loadBlogArticles();
  return articles.slice(0, limit);
}

/**
 * Clear the articles cache (useful for development)
 */
export function clearBlogCache(): void {
  articlesCache = null;
}

/**
 * Get all article IDs for routing
 */
export async function getAllBlogArticleIds(): Promise<string[]> {
  const articles = await loadBlogArticles();
  return articles.map(article => article.id);
}