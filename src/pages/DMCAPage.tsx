import React from 'react';
import SEO from '../components/ui/SEO';

const DMCAPage: React.FC = () => {
  return (
    <>
      <SEO 
        title="DMCA Notice" 
        description="Digital Millennium Copyright Act (DMCA) notice and takedown policy for ModernPhotoTools.com."
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="text-blue-600">DMCA</span> Notice
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Our copyright policy and takedown procedures in accordance with the Digital Millennium Copyright Act (DMCA).
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none text-gray-700">

              <h2>DMCA Policy Overview</h2>
              <p>
                At <strong>ModernPhotoTools.com</strong>, we respect the intellectual property rights of others and expect our users to do the same.
                This DMCA Policy outlines how we respond to copyright infringement notifications in compliance with the
                <em>Digital Millennium Copyright Act</em> (DMCA).
              </p>

              <h2>Submitting a DMCA Takedown Notice</h2>
              <p>
                If you believe that material on our website infringes your copyright, please submit a written notification including:
              </p>

              <ol>
                <li><strong>Identification</strong> of the copyrighted work.</li>
                <li><strong>Identification</strong> of the allegedly infringing material with enough detail for us to locate it.</li>
                <li><strong>Your contact information</strong>: name, address, phone number, and email.</li>
                <li><strong>Statement</strong> that you have a good faith belief the use is unauthorized.</li>
                <li><strong>Statement</strong> that the notice is accurate and you are authorized to act on behalf of the copyright owner.</li>
                <li><strong>Your physical or electronic signature</strong> (typing your full name suffices).</li>
              </ol>

              <p>
                Send your takedown notice via our <a href="/contact" className="text-blue-600 underline">Contact Page</a> and include "DMCA Takedown Notice" in the subject line.
              </p>

              <h2>Submitting a Counter-Notification</h2>
              <p>
                If you believe your content was removed by mistake or misidentification, you may submit a counter-notice containing:
              </p>

              <ol>
                <li>Your physical or electronic signature.</li>
                <li>Identification of the removed material and its location prior to removal.</li>
                <li>A good faith statement under penalty of perjury that the removal was in error.</li>
                <li>Your name, address, phone number, and consent to the jurisdiction of the relevant U.S. Federal District Court.</li>
              </ol>

              <p>
                Counter-notices should also be submitted via our <a href="/contact" className="text-blue-600 underline">Contact Page</a> with "DMCA Counter Notice" in the subject.
              </p>

              <h2>Repeat Infringers</h2>
              <p>
                We may terminate accounts or restrict access for users who repeatedly violate copyright policies.
              </p>

              <h2>False Claims Warning</h2>
              <p>
                Under Section 512(f) of the DMCA, anyone who knowingly submits false claims may be liable for damages, including costs and attorney’s fees.
              </p>

              <h2>No Legal Advice</h2>
              <p>
                This DMCA page is provided for informational purposes only and does not constitute legal advice. Please consult a qualified attorney for legal guidance.
              </p>

              <h2>Contact Information</h2>
              <p>
                For DMCA-related issues, please reach out via our <a href="/contact" className="text-blue-600 underline">Contact Page</a> with "DMCA" in the subject line.
              </p>

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DMCAPage;
