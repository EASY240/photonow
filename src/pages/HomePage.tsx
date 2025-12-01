import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Edit3, Brain, ClipboardCopy } from 'lucide-react';
import Button from '../components/ui/Button';
import VideoToolCard from '../components/ui/VideoToolCard';
import SEO from '../components/ui/SEO';
import PromptsGuide from '../components/ui/PromptsGuide';
import { tools } from '../data/tools';
import { getVideoUrl } from '../utils/videoMapping';
import '../styles/video-tool-card.css';

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
      <SEO canonicalUrl="https://modernphototools.com/" />
      
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
    </>
  );
};

export default HomePage;
