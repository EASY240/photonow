import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import { getArticleById } from '../data/blogArticles';

const BlogArticlePage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  
  if (!articleId) {
    return <Navigate to="/blog" replace />;
  }
  
  const article = getArticleById(articleId);
  
  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  // New helper function to parse inline formatting (bold, links)
  const parseLine = (line: string): (string | JSX.Element)[] => {
    // Regex to match Markdown links [text](url) and bold text **text**
    const regex = /(\[\s*(.*?)\s*\]\(\s*(.*?)\s*\))|(\*\*(.*?)\*\*)/g;
    let lastIndex = 0;
    const parts: (string | JSX.Element)[] = [];
    let match;
    let key = 0;

    while ((match = regex.exec(line)) !== null) {
      const [fullMatch, linkFull, linkText, linkUrl, boldFull, boldText] = match;
      
      // Add preceding text
      if (match.index > lastIndex) {
        parts.push(line.substring(lastIndex, match.index));
      }

      if (linkFull) { // It's a link
        const isInternal = linkUrl.startsWith('/');
        if (isInternal) {
          parts.push(<Link key={key++} to={linkUrl} className="text-blue-600 hover:underline">{linkText}</Link>);
        } else {
          parts.push(<a key={key++} href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{linkText}</a>);
        }
      } else if (boldFull) { // It's bold text
        parts.push(<strong key={key++}>{boldText}</strong>);
      }

      lastIndex = regex.lastIndex;
    }

    // Add any remaining text
    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }

    return parts;
  };

  // Convert markdown-like content to HTML-like JSX
  const renderContent = (content: string) => {
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
          listItems.push(<li key={j}>{parseLine(lines[j].trim().substring(2))}</li>);
          processedLines.add(j);
        }
        return <ul key={index} className="list-disc list-inside space-y-2 mb-4 text-gray-700">{listItems}</ul>;
      }

      // Handle ordered list items (e.g., "1. ...")
      const numberedListMatch = trimmedLine.match(/^(\d+)\.\s(.+)/);
      if (numberedListMatch) {
        const itemNumber = parseInt(numberedListMatch[1]);
        const itemText = numberedListMatch[2];
        
        // Create a single list item with proper numbering
        return (
          <div key={index} className="mb-6">
            <div className="flex items-start">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white text-sm font-bold rounded-full mr-4 mt-1 flex-shrink-0">
                {itemNumber}
              </span>
              <div className="flex-1">
                <div className="text-gray-900 font-semibold text-lg mb-2">
                  {parseLine(itemText)}
                </div>
              </div>
            </div>
          </div>
        );
      }

      // Handle paragraphs
      if (trimmedLine.length > 0) {
        return <p key={index} className="text-gray-700 mb-4 leading-relaxed">{parseLine(trimmedLine)}</p>;
      }

      return null;
    }).filter(Boolean); // Filter out null items
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
          <nav className="mb-8">
            <Link 
              to="/blog" 
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
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
                alt={article.title} 
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
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

export default BlogArticlePage;