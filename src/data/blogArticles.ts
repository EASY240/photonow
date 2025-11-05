export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishDate: string;
  readTime: string;
  category: 'general' | 'tools';
  featuredImage: string;
  relatedTool?: string;
  keywords?: string[];
}

// Blog article metadata index - content is now loaded from individual Markdown files
export const blogArticleIndex = [
  {
    id: 'remove-people-from-photos-without-photoshop',
    title: 'How to Remove People from Photos Without Photoshop | Modern Tools',
    excerpt: 'Learn how to remove people from photos without Photoshop using AI-powered tools. Our step-by-step guide shows you how to clean up images and replace unwanted elements easily.',
    publishDate: '2025-10-14',
    readTime: '12 min read',
    category: 'tools' as const,
    featuredImage: 'https://storage.googleapis.com/48877118-7272-4a4d-b302-0465d8aa4548/0b16f7b9-eb19-45a7-b6af-e1473db97d56/cc414ba0-93ff-4984-8f71-08d0ce36a003.jpg',
    relatedTool: 'ai-cleanup'
  },
  {
    id: 'best-photo-background-editors-2025',
    title: '10 Best Photo Background Editors for Perfect Images in 2025',
    excerpt: 'Discover the top 10 best photo background editors in 2025. Compare features, pricing, and capabilities of leading tools for perfect image editing results.',
    publishDate: '2025-10-01',
    readTime: '18 min read',
    category: 'tools' as const,
    featuredImage: 'https://storage.googleapis.com/48877118-7272-4a4d-b302-0465d8aa4548/fb439d36-088b-4543-81bb-8d5a44941b85/9be73868-a1c3-46ec-b22a-7b6cf3d3f29b.jpg',
    relatedTool: 'remove-background'
  },
  {
    id: 'ai-image-enhancement-guide',
    title: 'AI Image Enhancement: Transform Your Photos with AI Technology',
    excerpt: 'Discover how AI image enhancement can transform your photos. Learn about the technology, benefits, and how to use Modern Photo Tools\' AI Image Upscaler for professional-quality results.',
    publishDate: '2025-03-14',
    readTime: '16 min read',
    category: 'tools' as const,
    featuredImage: 'https://storage.googleapis.com/48877118-7272-4a4d-b302-0465d8aa4548/fb439d36-088b-4543-81bb-8d5a44941b85/84aac6bc-2694-4a31-a785-8436eb830c27.jpg',
    relatedTool: 'ai-image-enhancer'
  },
  {
    id: 'studio-ghibli-ai-art-guide',
    title: 'How to Make Studio Ghibli AI Art: Step-by-Step Guide',
    excerpt: 'Learn how to make Studio Ghibli AI art with our comprehensive guide. Transform your photos into magical Ghibli-style artwork using our free AI Filter tool - no artistic skills required!',
    publishDate: '2025-04-27',
    readTime: '8 min read',
    category: 'general' as const,
    featuredImage: 'https://storage.googleapis.com/48877118-7272-4a4d-b302-0465d8aa4548/fb439d36-088b-4543-81bb-8d5a44941b85/d65ee843-871b-4f21-ab80-0a71ec0fd36e.jpg',
    relatedTool: 'ai-filter'
  },
  {
    id: 'ai-background-generators-2025',
    title: 'Best AI Background Generators in 2025: Top Tools Compared',
    excerpt: 'Discover the best AI background generators in 2025 for stunning visuals. Compare features, pricing, and capabilities of top tools to elevate your creative projects instantly.',
    publishDate: '2025-02-19',
    readTime: '12 min read',
    category: 'tools' as const,
    featuredImage: '\images\tools images\AI Background Generator Tool.jpg',
    relatedTool: 'ai-background-generator'
  },
  {
    id: 'easter-card-messages-2025',
    title: '100+ Easter Card Message Ideas in 2025 | Modern PhotoTools',
    excerpt: 'Discover 100+ Easter card message ideas for 2025! From religious blessings to funny greetings, find the perfect words to pair with your Easter photos and designs.',
    publishDate: '2025-05-30',
    readTime: '18 min read',
    category: 'general' as const,
    featuredImage: 'https://storage.googleapis.com/48877118-7272-4a4d-b302-0465d8aa4548/0cd66b1e-46e8-4f6e-a6dd-3d571e79013d/43b3a8d0-02da-49a5-91b1-4a27d9f12e48.jpg'
  },

  {
    id: 'holi-photoshoot-ideas-2025',
    title: '15 Unique Holi Photoshoot Ideas for Perfect Festive Clicks',
    excerpt: 'Discover creative Holi photoshoot ideas to capture the festival\'s vibrant spirit! From color powder portraits to action shots, learn how to enhance your festive photos with AI tools.',
    publishDate: '2025-08-07',
    readTime: '14 min read',
    category: 'general' as const,
    featuredImage: 'https://storage.googleapis.com/48877118-7272-4a4d-b302-0465d8aa4548/c8ed49ab-fa6e-4f28-9ab8-ea4721bdeeef/fc521256-ebea-4c1d-8deb-13bbc5800a8d.jpg'
  },
  {
    id: 'master-ai-photo-editing-prompts',
    title: 'Master AI Photo Editing Prompts: Create Stunning Images',
    excerpt: 'Learn how to craft perfect AI prompts for photo editing. Discover advanced techniques, tool-specific prompts, and practical examples to transform your images with AI.',
    publishDate: '2025-10-04',
    readTime: '15 min read',
    category: 'general' as const,
    featuredImage: 'https://storage.googleapis.com/48877118-7272-4a4d-b302-0465d8aa4548/c8ed49ab-fa6e-4f28-9ab8-ea4721bdeeef/eb9f05ad-ab2d-4927-b3f9-b3bc116a084d.jpg',
    relatedTool: 'ai-image-generator'
  },
  {
    id: 'nano-banana-ai-image-generator-with-modern-phototools',
    title: 'Nano Banana - AI Image Generator with Modern Phototools',
    excerpt: 'Unleash your creativity with Nano Banana - my AI image generator tool on ModernPhotoTools.com. Easily create stunning visuals with just a few clicks.',
    publishDate: '2025-10-09',
    readTime: '8 min read',
    category: 'tools' as const,
    featuredImage: 'https://storage.googleapis.com/48877118-7272-4a4d-b302-0465d8aa4548/c8ed49ab-fa6e-4f28-9ab8-ea4721bdeeef/0afb09e1-7aeb-4877-8bc0-c9af8da8bfc8.jpg',
    relatedTool: 'ai-image-generator'
  },
  {
    id: 'how-to-restore-old-family-photos',
    title: 'How to Restore Old Family Photos: A Step-by-Step AI Guide',
    excerpt: 'Learn how to restore old family photos using AI technology. Step-by-step guide to bring damaged photos back to life with Modern Photo Tools.',
    publishDate: '2025-10-18',
    readTime: '12 min read',
    category: 'tools' as const,
    featuredImage: 'https://storage.googleapis.com/48877118-7272-4a4d-b302-0465d8aa4548/0b16f7b9-eb19-45a7-b6af-e1473db97d56/6ff08068-9649-4f10-9595-ddd7a339576e.jpg',
    relatedTool: 'ai-image-upscaler',
    keywords: ['AI photo restoration', 'family photos', 'photo repair', 'digital preservation', 'old photos']
  }
];

// For backward compatibility, export as blogArticles
// Content will be loaded dynamically from Markdown files
export const blogArticles = blogArticleIndex;

// Helper function to get articles by category
export const getArticlesByCategory = (category: 'general' | 'tools') => {
  return blogArticleIndex.filter(article => article.category === category);
};

// Helper function to get recent articles
export const getRecentArticles = (count: number = 5) => {
  return blogArticleIndex
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, count);
};

// Helper function to get article by ID
export const getArticleById = (id: string) => {
  return blogArticleIndex.find(article => article.id === id);
};

// Helper function to get previous and next articles for navigation
export const getAdjacentArticles = (currentId: string) => {
  // Sort articles by publish date (newest first)
  const sortedArticles = blogArticleIndex
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  
  const currentIndex = sortedArticles.findIndex(article => article.id === currentId);
  
  if (currentIndex === -1) {
    return { previousArticle: null, nextArticle: null };
  }
  
  const previousArticle = currentIndex > 0 ? sortedArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < sortedArticles.length - 1 ? sortedArticles[currentIndex + 1] : null;
  
  return {
    previousArticle: previousArticle ? { id: previousArticle.id, title: previousArticle.title } : null,
    nextArticle: nextArticle ? { id: nextArticle.id, title: nextArticle.title } : null
  };
};