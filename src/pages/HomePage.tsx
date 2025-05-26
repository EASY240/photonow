import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEO from '../components/ui/SEO';
import ToolCard from '../components/ui/ToolCard';
import Button from '../components/ui/Button';
import { tools } from '../data/tools';

const HomePage: React.FC = () => {
  // Display only the first 6 tools on the homepage
  const featuredTools = tools.slice(0, 6);

  return (
    <>
      <SEO />
      
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
              <Link to="/tools/remove-background">
                <Button size="lg" variant="outline">
                  Remove Background
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Tools Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Popular Photo Editing Tools
            </h2>
            <p className="text-gray-600">
              Discover our most popular AI-powered tools to enhance your photos in seconds.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
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