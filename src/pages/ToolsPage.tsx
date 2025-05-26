import React from 'react';
import SEO from '../components/ui/SEO';
import ToolCard from '../components/ui/ToolCard';
import { tools } from '../data/tools';

const ToolsPage: React.FC = () => {
  return (
    <>
      <SEO 
        title="All Photo Editing Tools" 
        description="Explore our complete collection of AI-powered photo editing tools. Transform, enhance, and perfect your images with professional results in seconds."
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            All Photo Editing Tools
          </h1>
          <p className="text-gray-600">
            Discover our complete collection of AI-powered tools to transform your photos
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ToolsPage;