import React, { useState, useEffect } from 'react';
import { Share2, Copy, Check } from 'lucide-react';

interface ShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ 
  url, 
  title,
  description = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');

  useEffect(() => {
    // Set default values on client side only
    if (typeof window !== 'undefined') {
      setCurrentUrl(url || window.location.href);
      setCurrentTitle(title || document.title);
    }
  }, [url, title]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      const scrolled = window.scrollY;
      const threshold = 200; // Show after scrolling 200px
      setIsVisible(scrolled > threshold);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const shareData = [
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(currentTitle)}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: 'hover:bg-black hover:text-white'
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(currentTitle)}&summary=${encodeURIComponent(description)}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      color: 'hover:bg-blue-600 hover:text-white'
    },
    {
      name: 'Reddit',
      url: `https://reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(currentTitle)}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
        </svg>
      ),
      color: 'hover:bg-orange-500 hover:text-white'
    },
    {
      name: 'Quora',
      url: `https://www.quora.com/share?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(currentTitle)}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M12.738 18.701a4.441 4.441 0 0 0 1.362-.235 2.136 2.136 0 0 1-1.362.235zm11.262-6.701c0 6.627-5.373 12-12 12s-12-5.373-12-12 5.373-12 12-12 12 5.373 12 12zm-2.5 0c0-5.238-4.262-9.5-9.5-9.5s-9.5 4.262-9.5 9.5 4.262 9.5 9.5 9.5 9.5-4.262 9.5-9.5zm-4.5 0c0 2.485-2.015 4.5-4.5 4.5s-4.5-2.015-4.5-4.5 2.015-4.5 4.5-4.5 4.5 2.015 4.5 4.5z"/>
        </svg>
      ),
      color: 'hover:bg-red-600 hover:text-white'
    },
    {
      name: 'Instagram',
      url: `https://www.instagram.com/`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      color: 'hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white'
    }
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Desktop - Floating Vertical Bar */}
      {!isMobile && (
        <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 flex flex-col space-y-3">
          {shareData.map((platform) => (
            <button
              key={platform.name}
              onClick={() => handleShare(platform.url)}
              onKeyDown={(e) => handleKeyDown(e, () => handleShare(platform.url))}
              aria-label={`Share on ${platform.name}`}
              className={`p-3 bg-white border border-gray-200 rounded-full shadow-lg transition-all duration-200 ${platform.color} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              {platform.icon}
            </button>
          ))}
          <button
            onClick={handleCopyLink}
            onKeyDown={(e) => handleKeyDown(e, handleCopyLink)}
            aria-label="Copy link to clipboard"
            className="p-3 bg-white border border-gray-200 rounded-full shadow-lg transition-all duration-200 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {copySuccess ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>
      )}

      {/* Mobile - Floating Action Button */}
      {isMobile && (
        <div className="fixed bottom-6 right-6 z-50">
          {/* Expanded Menu */}
          {showMobileMenu && (
            <div className="absolute bottom-16 right-0 flex flex-col space-y-3 mb-2">
              {shareData.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => {
                    handleShare(platform.url);
                    setShowMobileMenu(false);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, () => {
                    handleShare(platform.url);
                    setShowMobileMenu(false);
                  })}
                  aria-label={`Share on ${platform.name}`}
                  className={`p-3 bg-white border border-gray-200 rounded-full shadow-lg transition-all duration-200 ${platform.color} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  {platform.icon}
                </button>
              ))}
              <button
                onClick={() => {
                  handleCopyLink();
                  setShowMobileMenu(false);
                }}
                onKeyDown={(e) => handleKeyDown(e, () => {
                  handleCopyLink();
                  setShowMobileMenu(false);
                })}
                aria-label="Copy link to clipboard"
                className="p-3 bg-white border border-gray-200 rounded-full shadow-lg transition-all duration-200 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {copySuccess ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          )}

          {/* Main FAB Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            onKeyDown={(e) => handleKeyDown(e, () => setShowMobileMenu(!showMobileMenu))}
            aria-label="Share options"
            aria-expanded={showMobileMenu}
            className={`p-4 bg-blue-600 text-white rounded-full shadow-lg transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              showMobileMenu ? 'rotate-45' : ''
            }`}
          >
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  );
};

export default ShareButtons;