import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import { SchemaJSONLD } from '../components/ui/SchemaJSONLD';
import Button from '../components/ui/Button';
import { generateBreadcrumbSchema } from '../utils/siteConfig';

const AboutPage: React.FC = () => {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' }
  ]);
  return (
    <>
      <SEO 
        title="About Us" 
        description="Learn about ModernPhotoTools.com, our mission, and how we're making professional photo editing accessible to everyone with AI-powered tools."
      />
      <SchemaJSONLD data={breadcrumbSchema} />
      
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
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-700 mb-4">
                  At ModernPhotoTools.com, we believe that everyone should have access to professional-quality photo editing tools, regardless of their technical skills or budget. Our mission is to democratize photo editing by leveraging the power of artificial intelligence to make complex editing tasks simple and accessible.
                </p>
                <p className="text-gray-700">
                  We build tools that are fast, reliable, and simple to use so creators can spend more time on their ideas.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Offer</h2>
                <p className="text-gray-700 mb-6">
                  We provide a comprehensive suite of AI-powered photo editing tools that can help you transform your images in seconds. From removing backgrounds to generating completely new images with AI, our tools are designed to save you time and effort while delivering professional results.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li><span className="font-semibold text-gray-900">Free to use</span> — no hidden fees or subscriptions</li>
                  <li><span className="font-semibold text-gray-900">Easy to use</span> — no technical skills required</li>
                  <li><span className="font-semibold text-gray-900">Fast</span> — get results in seconds</li>
                  <li><span className="font-semibold text-gray-900">High quality</span> — professional-grade output</li>
                  <li><span className="font-semibold text-gray-900">Private</span> — we respect your privacy</li>
                </ul>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-blue-50 border border-blue-100 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Creators First</h3>
                <p className="text-blue-900">
                  Whether you are a photographer, marketer, or casual user, our tools are designed to keep you in control.
                </p>
              </div>
              <div className="rounded-2xl bg-purple-50 border border-purple-100 p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Reliable Quality</h3>
                <p className="text-purple-900">
                  Consistent results you can trust for social posts, product shots, and creative projects.
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-6">
                <h3 className="text-lg font-semibold text-emerald-900 mb-2">Always Improving</h3>
                <p className="text-emerald-900">
                  We keep refining our AI pipelines so every update makes your workflow faster.
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose ModernPhotoTools</h2>
              <p className="text-gray-700 mb-4">
                In a world where visual content is increasingly important, having access to powerful editing tools can make a significant difference. Whether you're a professional photographer, a social media manager, a small business owner, or just someone who wants to enhance their personal photos, our tools can help you achieve your goals without the steep learning curve or high cost of traditional photo editing software.
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Technology</h3>
              <p className="text-gray-700">
                We use cutting-edge AI technology powered to deliver fast and accurate results. Our tools are constantly being improved to ensure that you always have access to the latest advancements in AI-powered photo editing.
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
