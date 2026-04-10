import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import { SchemaJSONLD } from '../components/ui/SchemaJSONLD';
import Button from '../components/ui/Button';
import { generateBreadcrumbSchema, personalProfile } from '../utils/siteConfig';

const AboutPage: React.FC = () => {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' }
  ]);
  return (
    <>
      <SEO 
        title="About ModernPhotoTools"
        description={`Learn about ${personalProfile.title}, and the ModernPhotoTools mission to make professional AI photo editing accessible to everyone.`}
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

            <div className="mt-10 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <img
                  src={personalProfile.imageUrl}
                  alt={`Portrait of ${personalProfile.fullName}`}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-md shrink-0"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900">{personalProfile.fullName}</h2>
                  <p className="text-blue-700 font-semibold mt-1">{personalProfile.title}</p>
                  <p className="mt-4 text-lg text-gray-800 italic border-l-4 border-blue-600 pl-4">
                    "{personalProfile.quote}"
                  </p>
                  <div className="mt-5 space-y-4 text-gray-700">
                    {personalProfile.bioParagraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={personalProfile.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Visit Personal Site
                    </a>
                    <a
                      href={personalProfile.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 text-gray-800 font-semibold hover:border-blue-500 hover:text-blue-700 transition-colors"
                    >
                      Follow on Instagram
                    </a>
                    <a
                      href={`mailto:${personalProfile.contactEmail}`}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 text-gray-800 font-semibold hover:border-blue-500 hover:text-blue-700 transition-colors"
                    >
                      Contact Ali
                    </a>
                  </div>
                </div>
              </div>
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
