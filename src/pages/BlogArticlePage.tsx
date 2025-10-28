import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import { getBlogArticleById, BlogArticleWithContent } from '../utils/blogLoader';
import { getAdjacentArticles } from '../data/blogArticles';
import ArticleNavigation from '../components/ArticleNavigation';

const BlogArticlePage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const [article, setArticle] = useState<BlogArticleWithContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  
  useEffect(() => {
    const loadArticle = async () => {
      if (!articleId) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // Handle redirect for removed article
      if (articleId === 'remove-background-free-guide') {
        setRedirectTo('/blog/best-photo-background-editors-2025');
        return;
      }

      try {
        const loadedArticle = await getBlogArticleById(articleId);
        if (loadedArticle) {
          setArticle(loadedArticle);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Failed to load blog article:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [articleId]);
  
  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }
  
  if (!articleId || notFound) {
    return <Navigate to="/blog" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }
  
  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  // Render HTML content with proper styling
  const renderContent = (content: string) => {
    // Check if content contains HTML tags
    const hasHtmlTags = /<[^>]+>/.test(content);
    
    if (hasHtmlTags) {
      // Content contains HTML, render it directly with dangerouslySetInnerHTML
      // but add custom CSS classes for styling
      return (
        <div 
          className="article-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
    
    // Fallback to markdown-like parsing for plain text content
    const lines = content.split('\n');
    const processedLines = new Set<number>();
    
    return lines.map((line, index) => {
      if (processedLines.has(index)) return null;
      
      const trimmedLine = line.trim();

      // Handle headings
      if (trimmedLine.startsWith('# ')) return <h1 key={index} className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 mt-10">{trimmedLine.substring(2)}</h1>;
      if (trimmedLine.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold text-gray-900 mb-4 mt-8">{trimmedLine.substring(3)}</h2>;
      if (trimmedLine.startsWith('### ')) return <h3 key={index} className="text-xl font-semibold text-gray-900 mb-3 mt-6">{trimmedLine.substring(4)}</h3>;
      
      // Handle unordered list items
      if (trimmedLine.startsWith('- ')) {
        const listItems = [];
        for (let j = index; j < lines.length && lines[j].trim().startsWith('- '); j++) {
          listItems.push(<li key={j}>{trimmedLine.substring(2)}</li>);
          processedLines.add(j);
        }
        return <ul key={index} className="list-disc list-inside space-y-2 mb-4 text-gray-700">{listItems}</ul>;
      }

      // Handle paragraphs
      if (trimmedLine.length > 0) {
        return <p key={index} className="text-gray-700 mb-4 leading-relaxed">{trimmedLine}</p>;
      }

      return null;
    }).filter(Boolean);
  };

  return (
    <>
      <SEO 
        title={article.title}
        description={article.excerpt}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <Link 
              to="/blog" 
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
              aria-label="Go back to blog page"
            >
              ← Back to Blog
            </Link>
          </nav>

          {/* Article Header */}
          <article className="max-w-4xl mx-auto">
            {/* Featured Image */}
            <div className="h-64 md:h-80 bg-gray-200 rounded-xl mb-8 relative overflow-hidden">
              <img 
                src={article.featuredImage} 
                alt={`Featured image for ${article.title}`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="inline-block px-4 py-2 bg-white bg-opacity-90 text-blue-600 text-sm font-medium rounded-full mb-4">
                  {article.category === 'general' ? 'General' : 'Tools'}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {article.title}
                </h1>
              </div>
            </div>

            {/* Article Meta */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center text-sm text-gray-500">
                  <span>{new Date(article.publishDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                  <span className="mx-2">•</span>
                  <span>{article.readTime}</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button className="text-gray-400 hover:text-blue-600 transition-colors duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                {renderContent(article.content)}
              </div>

              {/* Call to Action */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Ready to Try Our AI Tools?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Transform your photos with our powerful AI-powered editing tools.
                  </p>
                  <Link 
                    to="/tools"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Explore Tools
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Article Navigation */}
              <ArticleNavigation currentArticleId={articleId!} />
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

export default BlogArticlePage;