import React from 'react';
import SEO from '../components/ui/SEO';
import { SchemaJSONLD } from '../components/ui/SchemaJSONLD';
import { generateBreadcrumbSchema } from '../utils/siteConfig';

const DMCAPage: React.FC = () => {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'DMCA', path: '/dmca' }
  ]);
  return (
    <>
      <SEO 
        title="DMCA Notice" 
        description="Digital Millennium Copyright Act (DMCA) notice and takedown policy for ModernPhotoTools.com."
      />
      <SchemaJSONLD data={breadcrumbSchema} />

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
            <div className="space-y-8 text-gray-700">
              <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">DMCA Policy Overview</h2>
                <p>
                  At <span className="font-semibold text-gray-900">ModernPhotoTools.com</span>, we respect the intellectual property rights of others and expect our users to do the same. This DMCA Policy outlines how we respond to copyright infringement notifications in compliance with the <em>Digital Millennium Copyright Act</em> (DMCA).
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">DMCA Takedown Notice</h3>
                  <p className="mb-4">If you believe that material on our website infringes your copyright, please submit a written notification including:</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li><span className="font-semibold text-gray-900">Identification</span> of the copyrighted work.</li>
                    <li><span className="font-semibold text-gray-900">Identification</span> of the allegedly infringing material with enough detail for us to locate it.</li>
                    <li><span className="font-semibold text-gray-900">Your contact information</span>: name, address, phone number, and email.</li>
                    <li><span className="font-semibold text-gray-900">Statement</span> that you have a good faith belief the use is unauthorized.</li>
                    <li><span className="font-semibold text-gray-900">Statement</span> that the notice is accurate and you are authorized to act on behalf of the copyright owner.</li>
                    <li><span className="font-semibold text-gray-900">Your physical or electronic signature</span> (typing your full name suffices).</li>
                  </ol>
                  <p className="mt-4">
                    Send your takedown notice via our <a href="/contact" className="text-blue-600 underline">Contact Page</a> and include "DMCA Takedown Notice" in the subject line.
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Counter-Notification</h3>
                  <p className="mb-4">If you believe your content was removed by mistake or misidentification, you may submit a counter-notice containing:</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Your physical or electronic signature.</li>
                    <li>Identification of the removed material and its location prior to removal.</li>
                    <li>A good faith statement under penalty of perjury that the removal was in error.</li>
                    <li>Your name, address, phone number, and consent to the jurisdiction of the relevant U.S. Federal District Court.</li>
                  </ol>
                  <p className="mt-4">
                    Counter-notices should also be submitted via our <a href="/contact" className="text-blue-600 underline">Contact Page</a> with "DMCA Counter Notice" in the subject.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Repeat Infringers</h3>
                  <p className="text-blue-900">
                    We may terminate accounts or restrict access for users who repeatedly violate copyright policies.
                  </p>
                </div>
                <div className="rounded-2xl bg-amber-50 border border-amber-100 p-5">
                  <h3 className="text-lg font-semibold text-amber-900 mb-2">False Claims Warning</h3>
                  <p className="text-amber-900">
                    Under Section 512(f) of the DMCA, anyone who knowingly submits false claims may be liable for damages, including costs and attorney’s fees.
                  </p>
                </div>
                <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5">
                  <h3 className="text-lg font-semibold text-emerald-900 mb-2">No Legal Advice</h3>
                  <p className="text-emerald-900">
                    This DMCA page is provided for informational purposes only and does not constitute legal advice.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Contact Information</h3>
                <p>
                  For DMCA-related issues, please reach out via our <a href="/contact" className="text-blue-600 underline">Contact Page</a> with "DMCA" in the subject line.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DMCAPage;
