import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Edit3, Brain, ClipboardCopy, HelpCircle, ChevronDown } from 'lucide-react';
import Button from '../components/ui/Button';
import VideoToolCard from '../components/ui/VideoToolCard';
import SEO from '../components/ui/SEO';
import PromptsGuide from '../components/ui/PromptsGuide';
import { SchemaJSONLD } from '../components/ui/SchemaJSONLD';
import { tools } from '../data/tools';
import { getVideoUrl } from '../utils/videoMapping';
import '../styles/video-tool-card.css';

const homeFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is ModernPhotoTools?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'ModernPhotoTools is a collection of browser-based AI tools for editing, enhancing, and generating images without installing heavy desktop software. You can remove backgrounds, clean up photos, upscale, retouch portraits, generate new images, and more directly from your browser on desktop or mobile.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are the tools free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Yes. The core tools on ModernPhotoTools are free to use with no registration required. Some features may have usage limits based on fair use and infrastructure costs, but there is no subscription you must buy to try the tools.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you store or share my uploaded photos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Uploaded images are processed securely and are not kept longer than necessary to generate your result. The Privacy Policy describes how temporary files are handled and clarifies that images are not used to train models or shared with third parties for advertising.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need an account to use the tools?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'No account is required. You can open any tool, upload an image, and download the result without signing up. If new features that benefit from accounts are added in the future, core tools will still remain accessible without registration.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use the edited images for commercial projects?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'In general, you retain ownership of the images you upload and the results generated from them. For most typical use cases, such as social media content, product photos, or marketing visuals, commercial use is allowed, but you remain responsible for respecting any third-party rights in your original images.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which image formats and sizes are supported?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'The tools work best with common web image formats such as JPEG and PNG. Some tools may also support WebP and other formats depending on the browser. Extremely large images may be resized or rejected for performance reasons, so for best results start with files that are optimized for web use.',
      },
    },
  ],
} as const;

const homeFaqItems = [
  {
    id: 'what-is-mpt',
    question: 'What is ModernPhotoTools?',
    answer:
      'ModernPhotoTools is a collection of browser-based AI tools for editing, enhancing, and generating images without installing heavy desktop software. You can remove backgrounds, clean up photos, upscale, retouch portraits, generate new images, and more directly from your browser on desktop or mobile.',
  },
  {
    id: 'are-tools-free',
    question: 'Are the tools free to use?',
    answer:
      'Yes. The core tools on ModernPhotoTools are free to use with no registration required. Some features may have usage limits based on fair use and infrastructure costs, but there is no subscription you must buy to try the tools.',
  },
  {
    id: 'store-photos',
    question: 'Do you store or share my uploaded photos?',
    answer:
      'Uploaded images are processed securely and are not kept longer than necessary to generate your result. The Privacy Policy describes how temporary files are handled and clarifies that images are not used to train models or shared with third parties for advertising.',
  },
  {
    id: 'need-account',
    question: 'Do I need an account to use the tools?',
    answer:
      'No account is required. You can open any tool, upload an image, and download the result without signing up. If new features that benefit from accounts are added in the future, core tools will still remain accessible without registration.',
  },
  {
    id: 'commercial-use',
    question: 'Can I use the edited images for commercial projects?',
    answer:
      'In general, you retain ownership of the images you upload and the results generated from them. For most typical use cases, such as social media content, product photos, or marketing visuals, commercial use is allowed, but you remain responsible for respecting any third-party rights in your original images.',
  },
  {
    id: 'formats-sizes',
    question: 'Which image formats and sizes are supported?',
    answer:
      'The tools work best with common web image formats such as JPEG and PNG. Some tools may also support WebP and other formats depending on the browser. Extremely large images may be resized or rejected for performance reasons, so for best results start with files that are optimized for web use.',
  },
] as const;

const HomePage: React.FC = () => {
  // Define the 6 specific popular tools as requested
  const popularToolNames = [
    'Remove Background',
    'AI Cleanup',
    'Watermark Remover',
    'AI Replace',
    'AI Portrait',
    'AI Image Upscaler'
  ];
  
  // Filter tools to get only the specified popular tools
  const featuredTools = tools.filter(tool => 
    popularToolNames.includes(tool.name)
  ).slice(0, 6);

  return (
    <>
      <SEO />
      <SchemaJSONLD data={homeFaqSchema} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Professional Photo Editing Tools, <span className="text-blue-600">Powered by AI</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Transform your photos with our free, powerful AI-powered editing tools. No design skills required.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/tools">
                <Button size="lg" rightIcon={<ArrowRight size={20} />}>
                  Explore All Tools
                </Button>
              </Link>
              <Link to="/tools/ai-image-generator">
                <Button size="lg" variant="outline">
                  AI Image Generator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Tools Section */}
      <section className="py-16 bg-white px-[10%]">
        <div className="w-full mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Popular Photo Editing Tools
            </h2>
            <p className="text-gray-600">
              Discover our most popular AI-powered tools to enhance your photos in seconds.
            </p>
          </div>
          
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
            {featuredTools.map((tool) => (
              <div key={tool.id} className="col mt-10 px-3 apiSectionBox">
                <VideoToolCard 
                  tool={tool} 
                  videoUrl={getVideoUrl(tool.name)}
                />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/tools">
              <Button variant="outline" rightIcon={<ArrowRight size={18} />}>
                View All Tools
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600">
              Edit your photos in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Your Image</h3>
              <p className="text-gray-600">
                Select or drag and drop the image you want to edit. We support JPEG, PNG, and WebP formats.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Apply AI Magic</h3>
              <p className="text-gray-600">
                Our AI automatically processes your image with the selected tool. No manual editing required.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Download Result</h3>
              <p className="text-gray-600">
                Download your professionally edited image and use it anywhere you want.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Prompts Guide Section */}
      <PromptsGuide />

      {/* Create Perfect AI Prompts Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Create Perfect AI Prompts in Seconds</h2>
            <p className="text-gray-600">Follow these simple steps to create optimized Prompts for AI models in seconds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Edit3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enter Your Idea</h3>
              <p className="text-gray-600">Simply input your task, goal, or a simple prompt. Our tool works with any type of input to create custom AI instructions.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Enhancements</h3>
              <p className="text-gray-600">Our AI analyzes your input and generates a comprehensive, optimized prompt tailored for various AI models.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardCopy className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Usage and Refinement</h3>
              <p className="text-gray-600">You can instantly view the generated prompt. Copy and paste it directly into ChatGPT, Claude, Gemini, or any other AI model.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/tools/prompt-generator">
              <Button size="lg" rightIcon={<ArrowRight size={18} />}>Try Prompt Generator</Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Start Editing Your Photos Today
            </h2>
            <p className="text-blue-100 mb-8">
              Join thousands of users who transform their photos with our AI-powered tools every day.
            </p>
            <Link to="/tools">
              <Button size="lg" variant="secondary">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">
              Answers to common questions about ModernPhotoTools and how the browser-based tools work.
            </p>
          </div>
          <HomePageFAQ />
        </div>
      </section>
    </>
  );
};

const HomePageFAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(homeFaqItems[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-4">
        {homeFaqItems.map((item) => {
          const isOpen = openId === item.id;
          const answerId = `home-faq-answer-${item.id}`;
          return (
            <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200">
              <button
                type="button"
                onClick={() => handleToggle(item.id)}
                className="w-full flex items-center justify-between px-4 md:px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-expanded={isOpen}
                aria-controls={answerId}
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-600 mt-1" />
                  <span className="font-semibold text-gray-900">{item.question}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    isOpen ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              <div
                id={answerId}
                className={`px-4 md:px-6 pb-4 text-gray-700 text-sm leading-relaxed ${
                  isOpen ? 'block' : 'hidden'
                }`}
              >
                {item.answer}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
