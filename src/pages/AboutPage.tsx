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
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-blue-600">ModernPhotoTools</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Making professional photo editing accessible to everyone through the power of AI
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">



          <div className="max-w-4xl mx-auto">
          
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
              We use cutting-edge AI technology powered to deliver fast and accurate results. Our tools are constantly being improved to ensure that you always have access to the latest advancements in AI-powered photo editing.
            </p>
            
            <h2>Get Started Today</h2>
            <p>
              Ready to transform your photos? Explore our tools and see what you can create!
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
              Ready to Transform Your Photos?
            </h2>
            <p className="text-blue-100 mb-8">
              Join thousands of users who enhance their photos with our AI-powered tools every day.
            </p>
            <Link to="/tools">
              <Button size="lg" variant="secondary">
                Explore Our Tools
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;