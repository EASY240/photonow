import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Tool } from '../../types';

interface VideoToolCardProps {
  tool: Tool;
  videoUrl?: string;
}

const VideoToolCard: React.FC<VideoToolCardProps> = ({ tool, videoUrl }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    if (!videoUrl) return;

    if (typeof window === 'undefined' || !(window as Window & { IntersectionObserver?: typeof IntersectionObserver }).IntersectionObserver) {
      setShouldLoadVideo(true);
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoadVideo(true);
            obs.disconnect();
          }
        });
      },
      { rootMargin: '200px' }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [videoUrl]);

  return (
    <div className="col mt-3 apiSectionBox">
      <Link to={tool.path}>
        <div className="bg-white rounded-20">
          {videoUrl && (
            <div ref={containerRef} className="responsive rounded-20">
              {shouldLoadVideo && (
                <video
                  autoPlay
                  loop
                  playsInline
                  muted
                  preload="none"
                  className="w-full h-full"
                >
                  <source type="video/mp4" src={videoUrl} />
                </video>
              )}
            </div>
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
