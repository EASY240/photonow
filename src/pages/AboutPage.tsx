import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import Button from '../components/ui/Button';

const AboutPage: React.FC = () => {
  return (
    <>
      <SEO 
        title="About Us" 
        description="Learn about ModernPhotoTools.com, our mission, and how we're making professional photo editing accessible to everyone with AI-powered tools."
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              About ModernPhotoTools.com
            </h1>
            <p className="text-xl text-gray-600">
              Making professional photo editing accessible to everyone
            </p>
          </div>
          
          <div className="prose prose-lg max-w-none text-gray-700">
            <h2>Our Mission</h2>
            <p>
              At ModernPhotoTools.com, we believe that everyone should have access to professional-quality photo editing tools, regardless of their technical skills or budget. Our mission is to democratize photo editing by leveraging the power of artificial intelligence to make complex editing tasks simple and accessible.
            </p>
            
            <h2>What We Offer</h2>
            <p>
              We provide a comprehensive suite of AI-powered photo editing tools that can help you transform your images in seconds. From removing backgrounds to generating completely new images with AI, our tools are designed to save you time and effort while delivering professional results.
            </p>
            <p>
              All our tools are:
            </p>
            <ul>
              <li><strong>Free to use</strong> - No hidden fees or subscriptions</li>
              <li><strong>Easy to use</strong> - No technical skills required</li>
              <li><strong>Fast</strong> - Get results in seconds</li>
              <li><strong>High quality</strong> - Professional-grade output</li>
              <li><strong>Private</strong> - We respect your privacy</li>
            </ul>
            
            <h2>Why Choose ModernPhotoTools</h2>
            <p>
              In a world where visual content is increasingly important, having access to powerful editing tools can make a significant difference. Whether you're a professional photographer, a social media manager, a small business owner, or just someone who wants to enhance their personal photos, our tools can help you achieve your goals without the steep learning curve or high cost of traditional photo editing software.
            </p>
            
            <h2>Our Technology</h2>
            <p>
              We use cutting-edge AI technology powered by LightXEditor to deliver fast and accurate results. Our tools are constantly being improved to ensure that you always have access to the latest advancements in AI-powered photo editing.
            </p>
            
            <h2>Get Started Today</h2>
            <p>
              Ready to transform your photos? Explore our tools and see what you can create!
            </p>
            
            <div className="flex justify-center mt-8">
              <Link to="/tools">
                <Button size="lg">
                  Explore Our Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;