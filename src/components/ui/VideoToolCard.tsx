import React from 'react';
import { Link } from 'react-router-dom';
import type { Tool } from '../../types';

interface VideoToolCardProps {
  tool: Tool;
  videoUrl?: string;
}

const VideoToolCard: React.FC<VideoToolCardProps> = ({ tool, videoUrl }) => {
  return (
    <div className="col mt-3 apiSectionBox">
      <Link to={tool.path}>
        <div className="bg-white rounded-20">
          {videoUrl && (
            <video 
              autoPlay 
              loop 
              playsInline 
              muted
              className="responsive rounded-20"
            >
              <source type="video/mp4" src={videoUrl} />
            </video>
          )}
          <div className="card-body p-3">
            <h3 className="text-xxl text-semi text-black pb-2 mb-0 text-center">
              {tool.name}
            </h3>
            <p className="text-lg text-black text-center">
              {tool.description}
            </p>
            <div className="d-flex justify-content-between align-items-center"></div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default VideoToolCard;