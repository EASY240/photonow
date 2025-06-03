import React from 'react';
import SEO from '../components/ui/SEO';

const TermsOfUsePage: React.FC = () => {
  return (
    <>
      <SEO 
        title="Terms of Use" 
        description="Read the terms and conditions for using ModernPhotoTools.com and our AI-powered photo editing services."
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Terms of <span className="text-blue-600">Use</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Read the terms and conditions for using our AI-powered photo editing services.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none text-gray-700">

              <p className="text-sm text-gray-500 mb-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Acceptance of Terms</h2>
                <p>
                  By accessing and using <strong>ModernPhotoTools.com</strong>, you accept and agree to be bound by the terms and conditions outlined below. If you do not agree, please do not use our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Use License</h2>
                <p>
                  You are granted a temporary, non-exclusive license to use ModernPhotoTools.com for personal, non-commercial purposes only. Under this license, you may not:
                </p>
                <ul className="list-disc list-inside ml-4">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for commercial purposes or public display</li>
                  <li>Attempt to reverse-engineer any software on the site</li>
                  <li>Remove copyright or proprietary notations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Acceptable Use</h2>
                <p>You agree to use our platform lawfully. You must not:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Upload copyrighted or infringing materials</li>
                  <li>Submit offensive, illegal, or harmful content</li>
                  <li>Use services for deepfakes or deceptive media</li>
                  <li>Disrupt our servers or services</li>
                  <li>Use bots or automation without permission</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Content Ownership</h2>
                <p>
                  You retain full ownership of any images you upload. We do not claim rights over your content. By using our tools, you grant us a temporary license to process your content securely and privately.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Service Availability</h2>
                <p>
                  While we aim for high availability, we do not guarantee uninterrupted access. Downtime may occur due to maintenance or unforeseen technical issues.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Disclaimer</h2>
                <p>
                  All materials and tools are provided "as is". We disclaim all warranties—express or implied—including but not limited to merchantability, fitness for a particular purpose, or non-infringement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Limitations</h2>
                <p>
                  In no event shall ModernPhotoTools.com or its affiliates be liable for any indirect or consequential damages, including data loss or business interruption, even if notified of such possibility.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Privacy Policy</h2>
                <p>
                  Your use of our services is also governed by our <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>. Please review it to understand how we handle your data.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Modifications</h2>
                <p>
                  We may update these Terms of Use at any time without notice. Continued use of our website indicates your acceptance of the most recent version.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Governing Law</h2>
                <p>
                  These terms shall be governed by and interpreted in accordance with the laws applicable in your jurisdiction. Any legal disputes shall be resolved under these laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-2">📬 Contact Us</h2>
                <p>
                  If you have any questions about these Terms of Use, please <a href="/contact" className="text-blue-600 hover:underline">contact us</a>.
                </p>
              </section>

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TermsOfUsePage;
