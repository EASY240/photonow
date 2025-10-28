import React from 'react';
import { Link } from 'react-router-dom';
import { getAdjacentArticles } from '../data/blogArticles';

interface ArticleNavigationProps {
  currentArticleId: string;
}

const ArticleNavigation: React.FC<ArticleNavigationProps> = ({ currentArticleId }) => {
  const { previousArticle, nextArticle } = getAdjacentArticles(currentArticleId);

  if (!previousArticle && !nextArticle) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Previous Article */}
        <div className="flex-1">
          {previousArticle ? (
            <Link
              to={`/blog/${previousArticle.id}`}
              className="group flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center">
                <svg 
                  className="w-5 h-5 text-gray-400 group-hover:text-gray-600 mr-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Next Article</div>
                  <div className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors">
                    {previousArticle.title}
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg opacity-50">
              <div className="flex items-center">
                <svg 
                  className="w-5 h-5 text-gray-300 mr-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Next Article</div>
                  <div className="text-gray-400">No Next Article</div>
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
              className="group flex items-center justify-end p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center">
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">Previous Article</div>
                  <div className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors">
                    {nextArticle.title}
                  </div>
                </div>
                <svg 
                  className="w-5 h-5 text-gray-400 group-hover:text-gray-600 ml-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg opacity-50">
              <div className="flex items-center justify-end">
                <div className="text-right">
                  <div className="text-sm text-gray-400 mb-1">Previous Article</div>
                  <div className="text-gray-400">No previous article</div>
                </div>
                <svg 
                  className="w-5 h-5 text-gray-300 ml-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleNavigation;