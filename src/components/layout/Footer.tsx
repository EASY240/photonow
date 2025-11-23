import React from 'react';
import { Link } from 'react-router-dom';
import { Image } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Image className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">ModernPhotoTools</span>
            </Link>
            <p className="text-gray-600 mb-4">
              Free online photo editing tools powered by AI. Edit, enhance, and transform your images with professional-quality results in seconds.
            </p>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/tools" className="text-gray-600 hover:text-blue-600 transition-colors">
                  All Tools
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/tools/remove-background" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Remove Background
                </Link>
              </li>
              <li>
                <Link to="/tools/ai-image-generator" className="text-gray-600 hover:text-blue-600 transition-colors">
                  AI Image Generator
                </Link>
              </li>
              <li>
                <Link to="/tools/prompt-generator" className="text-gray-600 hover:text-blue-600 transition-colors">
                  AI Prompt Generator
                </Link>
              </li>
              <li>
                <Link to="/tools/ai-portrait" className="text-gray-600 hover:text-blue-600 transition-colors">
                  AI Portrait
                </Link>
              </li>
              <li>
                <Link to="/tools/ai-image-upscaler" className="text-gray-600 hover:text-blue-600 transition-colors">
                  AI Image Upscaler
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-use" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/dmca" className="text-gray-600 hover:text-blue-600 transition-colors">
                  DMCA
                </Link>
              </li>
              <li>
                <Link to="/cookies-policy" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Cookies Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600">
            © {currentYear} ModernPhotoTools.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;