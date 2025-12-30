import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { tools } from '../../data/tools';
import type { Tool } from '../../types';

interface ToolRecommendationsProps {
  currentToolId: string;
  hasResult?: boolean;
}

const ToolRecommendations: React.FC<ToolRecommendationsProps> = ({ 
  currentToolId, 
  hasResult = false 
}) => {
  // Only show recommendations if user has generated a result
  if (!hasResult) return null;

  const getRecommendations = (toolId: string): Tool[] => {
    const recommendationMap: Record<string, string[]> = {
      'remove-background': ['ai-background-generator', 'ai-product-photoshoot', 'ai-expand'],
      'ai-cleanup': ['ai-image-upscaler', 'ai-filter', 'ai-expand'],
      'watermark-remover': ['ai-cleanup', 'ai-image-upscaler', 'ai-filter'],
      'ai-expand': ['ai-background-generator', 'ai-cleanup', 'ai-filter'],
      'ai-replace': ['ai-cleanup', 'ai-background-generator', 'ai-expand'],
      'ai-cartoon': ['ai-caricature', 'ai-avatar', 'ai-portrait'],
      'ai-caricature': ['ai-cartoon', 'ai-avatar', 'ai-face-swap'],
      'ai-avatar': ['ai-portrait', 'ai-cartoon', 'ai-caricature'],
      'ai-product-photoshoot': ['remove-background', 'ai-background-generator', 'ai-cleanup'],
      'ai-background-generator': ['remove-background', 'ai-product-photoshoot', 'ai-expand'],
      'ai-image-generator': ['ai-image-to-image', 'ai-filter', 'ai-background-generator'],
      'ai-portrait': ['ai-avatar', 'ai-hairstyle', 'ai-face-swap'],
      'ai-face-swap': ['ai-portrait', 'ai-avatar', 'ai-caricature'],
      'ai-outfit': ['ai-hairstyle', 'ai-portrait', 'ai-background-generator'],
      'ai-image-to-image': ['ai-filter', 'ai-image-generator', 'ai-sketch-to-image'],
      'ai-sketch-to-image': ['ai-image-to-image', 'ai-image-generator', 'ai-cartoon'],
      'ai-hairstyle': ['ai-outfit', 'ai-portrait', 'ai-face-swap'],
      'ai-image-upscaler': ['ai-cleanup', 'ai-filter', 'ai-expand'],
      'ai-filter': ['ai-image-upscaler', 'ai-cleanup', 'ai-image-to-image']
    };

    const recommendedIds = recommendationMap[toolId] || [];
    return tools.filter(tool => recommendedIds.includes(tool.id)).slice(0, 3);
  };

  const recommendations = getRecommendations(currentToolId);

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-5 mb-8 max-w-5xl mx-auto bg-white border border-gray-200 rounded-lg p-6 fade-in-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">You Might Also Like</h3>
        <Link 
          to="/tools" 
          className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          View All Tools
          <ExternalLink className="w-4 h-4 ml-1" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((tool) => (
          <Link
            key={tool.id}
            to={tool.path}
            className="group bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-lg p-4 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                {tool.name}
              </h4>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
            </div>
            <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors line-clamp-2">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Discover more tools to enhance your creative workflow
        </p>
      </div>
    </div>
  );
};

export default ToolRecommendations;
