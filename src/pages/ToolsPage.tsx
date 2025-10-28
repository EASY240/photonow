import React from 'react';
import SEO from '../components/ui/SEO';
import VideoToolCard from '../components/ui/VideoToolCard';
import { tools } from '../data/tools';
import { getVideoUrl } from '../utils/videoMapping';
import '../styles/video-tool-card.css';

const ToolsPage: React.FC = () => {
  return (
    <>
      <SEO 
        title="All Photo Editing Tools" 
        description="Explore our complete collection of AI-powered photo editing tools. Transform, enhance, and perfect your images with professional results in seconds."
      />
      
      <div className="min-h-screen bg-gray-50 py-12 px-[10%]">
        <div className="w-full mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              All Photo Editing Tools
            </h1>
            <p className="text-gray-600">
              Discover our complete collection of AI-powered tools to transform your photos
            </p>
          </div>
          
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
            {tools.map((tool) => (
              <div key={tool.id} className="col mt-10 px-3 apiSectionBox">
                <VideoToolCard 
                  tool={tool} 
                  videoUrl={getVideoUrl(tool.name)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ToolsPage;