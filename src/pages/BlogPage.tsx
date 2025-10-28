import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import { loadBlogArticles, BlogArticleWithContent } from '../utils/blogLoader';

const BlogPage: React.FC = () => {
  const [articles, setArticles] = useState<BlogArticleWithContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const loadedArticles = await loadBlogArticles();
        setArticles(loadedArticles);
      } catch (error) {
        console.error('Failed to load blog articles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading articles...</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <SEO 
        title="Blog" 
        description="Stay updated with the latest tips, tutorials, and news about AI photo editing and digital image processing."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover tips, tutorials, and insights about AI photo editing and digital creativity
            </p>
          </div>

          {/* Blog Articles Grid */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link 
                  to={`/blog/${article.id}`} 
                  key={article.id} 
                  className="block group"
                  aria-label={`Read article: ${article.title}`}
                >
                  <article className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                    {/* Featured Image */}
                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                      <img 
                        src={article.featuredImage} 
                        alt={`Featured image for ${article.title}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="inline-block px-3 py-1 bg-white bg-opacity-90 text-blue-600 text-sm font-medium rounded-full">
                          {article.category === 'general' ? 'General' : 'Tools'}
                        </span>
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-6 flex flex-col">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span>{new Date(article.publishDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                        <span className="mx-2">•</span>
                        <span>{article.readTime}</span>
                      </div>
                      
                      <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                        {article.title}
                      </h2>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      
                      {/* Article Tags */}
                      {article.keywords && article.keywords.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {article.keywords.slice(0, 3).map((keyword, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-md"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-auto pt-4">
                        <div className="inline-flex items-center text-blue-600 group-hover:text-blue-700 font-medium transition-colors duration-300">
                          Read More
                          <svg 
                            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Transform Your Photos?
              </h3>
              <p className="text-gray-600 mb-6">
                Explore our powerful AI-powered photo editing tools and bring your creative vision to life.
              </p>
              <Link 
                to="/tools"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Explore Our Tools
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPage;