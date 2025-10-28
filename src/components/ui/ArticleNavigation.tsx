import React from 'react';
import { Link } from 'react-router-dom';

interface NavigationArticle {
  id: string;
  title: string;
}

interface ArticleNavigationProps {
  previousArticle?: NavigationArticle;
  nextArticle?: NavigationArticle;
}

const ArticleNavigation: React.FC<ArticleNavigationProps> = ({ 
  previousArticle, 
  nextArticle 
}) => {
  if (!previousArticle && !nextArticle) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-stretch gap-4">
        {/* Previous Article */}
        <div className="flex-1">
          {previousArticle ? (
            <Link
              to={`/blog/${previousArticle.id}`}
              className="group flex items-center p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 h-full"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                    <svg 
                      className="w-5 h-5 text-blue-600" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 19l-7-7 7-7" 
                      />
                    </svg>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500 mb-1">Previous Article</p>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                    {previousArticle.title}
                  </h3>
                </div>
              </div>
            </Link>
          ) : (
            <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl h-full opacity-50">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg 
                      className="w-5 h-5 text-gray-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 19l-7-7 7-7" 
                      />
                    </svg>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-400 mb-1">Previous Article</p>
                  <h3 className="text-lg font-medium text-gray-400">
                    No previous article
                  </h3>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next Article */}
        <div className="flex-1">
          {nextArticle ? (
            <Link
              to={`/blog/${nextArticle.id}`}
              className="group flex items-center p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 h-full"
            >
              <div className="flex items-center w-full">
                <div className="min-w-0 flex-1 text-right">
                  <p className="text-sm text-gray-500 mb-1">Next Article</p>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                    {nextArticle.title}
                  </h3>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                    <svg 
                      className="w-5 h-5 text-blue-600" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7" 
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl h-full opacity-50">
              <div className="flex items-center w-full">
                <div className="min-w-0 flex-1 text-right">
                  <p className="text-sm text-gray-400 mb-1">Next Article</p>
                  <h3 className="text-lg font-medium text-gray-400">
                    No next article
                  </h3>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg 
                      className="w-5 h-5 text-gray-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7" 
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleNavigation;