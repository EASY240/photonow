import React from 'react';

interface SupportBannerProps {
  className?: string;
}

const COFFEE_URL = 'https://ko-fi.com/modernai';
const PAYPAL_URL = 'https://paypal.me/modernai';
const COFFEE_ICON = '/images/blog/ko-fi%20logo.webp';
const PAYPAL_ICON = '/images/blog/paypal%20logo.png';

const SupportBanner: React.FC<SupportBannerProps> = ({ className = '' }) => {
  return (
    <div className={`mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-1">
        Did this tool save your time?
      </h3>
      <p className="text-sm text-gray-700 mb-4">
        All tools here are <b>free</b> to use, but running fast image servers is expensive.
        My goal is to keep Modern PhotoTools <b>100% free</b> and accessible to <b>everyone</b>, <b>forever</b>.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={COFFEE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 bg-yellow-300 hover:bg-yellow-500 text-gray-900 px-4 py-2 sm:w-1/2"
        >
          <img src={COFFEE_ICON} alt="Ko-fi" className="w-5 h-5 mr-2" />
          <span>Buy me a Coffee</span>
        </a>
        <a
          href={PAYPAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-blue-400 hover:bg-blue-700 text-white px-4 py-2 sm:w-1/2"
        >
          <img src={PAYPAL_ICON} alt="PayPal" className="w-5 h-5 mr-2" />
          <span>Donate via PayPal</span>
        </a>
      </div>
    </div>
  );
};

export default SupportBanner;
