import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import { SchemaJSONLD } from '../components/ui/SchemaJSONLD';
import Button from '../components/ui/Button';
import { generateBreadcrumbSchema, generateCanonicalUrl, personalProfile } from '../utils/siteConfig';

const AboutPage: React.FC = () => {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' }
  ]);

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: personalProfile.fullName,
    jobTitle: personalProfile.title,
    url: personalProfile.websiteUrl,
    sameAs: [personalProfile.instagramUrl, personalProfile.websiteUrl],
    knowsAbout: personalProfile.expertiseAreas,
    worksFor: {
      '@type': 'Organization',
      name: 'ModernPhotoTools',
      url: 'https://modernphototools.com'
    }
  };

  return (
    <>
      <SEO
        title="About ModernPhotoTools"
        description={`Learn about ${personalProfile.fullName}, founder of ModernPhotoTools — a US-based independent platform making professional AI photo editing free and accessible to everyone.`}
        canonicalUrl={generateCanonicalUrl('/about')}
      />
      <SchemaJSONLD data={[breadcrumbSchema, personSchema]} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-blue-600">ModernPhotoTools</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              An independent, US-based platform making professional photo editing accessible to everyone — no software subscriptions, no design degree required.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Profile — E-E-A-T anchor */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">

            <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 shadow-sm mb-10">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <img
                  src={personalProfile.imageUrl}
                  alt={`Portrait of ${personalProfile.fullName}, founder of ModernPhotoTools`}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-md shrink-0"
                  width="96"
                  height="96"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900">{personalProfile.fullName}</h2>
                  <p className="text-blue-700 font-semibold mt-1">{personalProfile.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{personalProfile.location}</p>

                  <p className="mt-4 text-lg text-gray-800 italic border-l-4 border-blue-600 pl-4">
                    "{personalProfile.quote}"
                  </p>

                  {/* Expertise Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {personalProfile.expertiseAreas.map((area) => (
                      <span key={area} className="px-3 py-1 bg-white border border-blue-200 text-blue-700 text-sm rounded-full font-medium">
                        {area}
                      </span>
                    ))}
                  </div>

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

            {/* Mission & What We Offer */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-700 mb-4">
                  ModernPhotoTools.com was built on a simple frustration: professional photo editing tools were either too expensive, too complex, or locked behind monthly subscriptions that small business owners couldn't justify. This platform exists to remove every one of those barriers.
                </p>
                <p className="text-gray-700">
                  Every tool on this site is free to use, requires no account, and is designed to deliver results in seconds — not after a learning curve measured in weeks. That's the mission: bring studio-quality output within reach of anyone with a browser.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Offer</h2>
                <p className="text-gray-700 mb-6">
                  Twenty AI-powered editing tools covering the most common visual content needs — background removal, portrait enhancement, image upscaling, product photography, avatar creation, and more.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li><span className="font-semibold text-gray-900">Free to use</span> — no hidden fees or subscriptions</li>
                  <li><span className="font-semibold text-gray-900">No account required</span> — upload and download, done</li>
                  <li><span className="font-semibold text-gray-900">Fast</span> — most tools deliver results in under 10 seconds</li>
                  <li><span className="font-semibold text-gray-900">High quality</span> — professional-grade output from a smartphone photo</li>
                  <li><span className="font-semibold text-gray-900">Private</span> — images are not stored or used for AI training</li>
                  <li><span className="font-semibold text-gray-900">Independent</span> — no vendor sponsorships; editorial choices are our own</li>
                </ul>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-blue-50 border border-blue-100 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Creator-First Design</h3>
                <p className="text-blue-900">
                  Every tool is chosen because it solves a real workflow problem — not because it was easy to build. If a task was taking Ali's clients hours to complete manually, that's the next tool we built.
                </p>
              </div>
              <div className="rounded-2xl bg-purple-50 border border-purple-100 p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Editorially Independent</h3>
                <p className="text-purple-900">
                  ModernPhotoTools has no VC funding, no paid partnerships, and no affiliate incentives that influence which tools are featured. Recommendations reflect genuine testing and editorial judgment.
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-6">
                <h3 className="text-lg font-semibold text-emerald-900 mb-2">Always Improving</h3>
                <p className="text-emerald-900">
                  AI image technology is advancing fast. We test new model releases, update tool descriptions when capabilities change, and retire tools that no longer meet quality standards.
                </p>
              </div>
            </div>

            {/* Editorial Policy link */}
            <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Editorial Standards</h2>
              <p className="text-gray-700 mb-4">
                All articles and tool guides published on ModernPhotoTools are written from firsthand experience testing the tools described. We do not publish sponsored content disguised as editorial reviews. When we mention a third-party tool for comparison, no compensation is involved.
              </p>
              <p className="text-gray-700">
                Our <Link to="/editorial-policy" className="text-blue-600 hover:underline">Editorial Policy</Link> outlines exactly how content is researched, reviewed, and updated. Our <Link to="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link> explains how uploaded images are handled (short version: they're not stored or shared).
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
              Ready to See What's Possible?
            </h2>
            <p className="text-blue-100 mb-8">
              Browse all twenty AI tools — no account, no cost, results in seconds.
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
