import React from 'react';
import SEO from '../components/ui/SEO';
import { SchemaJSONLD } from '../components/ui/SchemaJSONLD';
import { generateBreadcrumbSchema } from '../utils/siteConfig';

const AcceptableUsePolicyPage: React.FC = () => {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Acceptable Use Policy', path: '/acceptable-use' }
  ]);

  return (
    <>
      <SEO 
        title="Acceptable Use Policy" 
        description="Learn what uses are permitted and prohibited when using ModernPhotoTools.com."
      />
      <SchemaJSONLD data={breadcrumbSchema} />

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Acceptable <span className="text-blue-600">Use Policy</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              This policy outlines how ModernPhotoTools.com can and cannot be used.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none text-gray-700">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Permitted Uses</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>Enhancing your own photographs</li>
                  <li>Removing blemishes from personal photos</li>
                  <li>Upscaling images you own or have rights to</li>
                  <li>Creative projects with original content</li>
                  <li>Educational purposes (fair use)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Prohibited Uses</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>Removing watermarks from others' work</li>
                  <li>Copyright infringement</li>
                  <li>Creating deepfakes or misleading content</li>
                  <li>Violating privacy rights</li>
                  <li>Commercial use of others' intellectual property without permission</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Consequences of Violations</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>Immediate suspension of access</li>
                  <li>Reporting to authorities if required by law</li>
                  <li>Cooperation with copyright holders</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AcceptableUsePolicyPage;
