import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import { SchemaJSONLD } from '../components/ui/SchemaJSONLD';
import Button from '../components/ui/Button';
import { generateBreadcrumbSchema, personalProfile } from '../utils/siteConfig';

const EditorialPolicyPage: React.FC = () => {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Editorial Policy', path: '/editorial-policy' }
  ]);

  return (
    <>
      <SEO
        title="Editorial Policy"
        description="How ModernPhotoTools creates, reviews, and updates its blog content, tutorials, and educational material."
      />
      <SchemaJSONLD data={breadcrumbSchema} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="text-blue-600">Editorial</span> Policy
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              How ModernPhotoTools writes, reviews, and updates the content on this site.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8 text-gray-700">

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Our commitment</h2>
              <p>
                ModernPhotoTools is an educational resource for creators, marketers, photographers, and developers who work with AI-powered image tools. The blog, tutorials, and reference guides published on this site are written to be accurate, original, and useful. Every article lists its author, its publication date, and its last-updated date so that readers can judge how current the information is.
              </p>
              <p className="mt-4">
                This page describes the standards we hold ourselves to: who writes the content, how we fact-check it, how we handle corrections, and how we disclose commercial relationships.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Authorship and accountability</h2>
              <p>
                Every blog post, tutorial, and reference article is attributed to a named human author. The author bio is linked from each article, includes a photograph, and lists the author's relevant experience. The site owner and lead author is {personalProfile.fullName}, a {personalProfile.title} with a documented background in AI tooling and creator economy products.
              </p>
              <p className="mt-4">
                Guest contributions, when accepted, follow the same standards and are clearly labelled as guest posts. The editorial team never publishes anonymous or pseudonymous content.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Sourcing and fact-checking</h2>
              <p>
                Claims about model behaviour, pricing, or platform features are verified against the official documentation of the relevant provider before publication. Statistics are linked to the original source. Screenshots are taken from a fresh build of the feature in question and dated.
              </p>
              <p className="mt-4">
                AI tools and platforms change quickly. We do not chase novelty for its own sake; an article is only updated when there is a material change to the underlying feature or pricing. When a tutorial relies on a third-party product that changes its interface, we re-record the steps and republish with a new last-updated date.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Originality and AI-assisted writing</h2>
              <p>
                All articles on this site are originally written by the named author. We use language models as assistive tools for outlining, grammar, and translation, but every sentence is reviewed and edited by a human writer. We do not publish auto-generated content, and we do not republish content from other sites.
              </p>
              <p className="mt-4">
                Photography and screenshots on the blog are produced by the author or are clearly attributed and used with permission. Stock imagery is sourced from royalty-free libraries and credited when required by the licence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-blue-50 border border-blue-100 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Corrections and updates</h3>
                <p className="text-blue-900">
                  If you spot a factual error, broken link, or outdated screenshot, please email {personalProfile.contactEmail} with the article URL. Verified corrections are applied within seven days and the article's last-updated date is refreshed. Material changes are noted at the bottom of the article.
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-6">
                <h3 className="text-lg font-semibold text-emerald-900 mb-2">Disclosures and conflicts</h3>
                <p className="text-emerald-900">
                  When an article mentions a product or service the author is affiliated with, the relationship is disclosed at the top of the article. Affiliate links, when used, are tagged with the appropriate rel attribute and the disclosure is repeated in-context.
                </p>
              </div>
              <div className="rounded-2xl bg-purple-50 border border-purple-100 p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Comments and community</h3>
                <p className="text-purple-900">
                  We do not host open comments to keep the moderation overhead manageable, but we actively monitor the <Link to="/contact" className="underline">contact form</Link> and the email inbox above. Substantive feedback is folded back into future updates.
                </p>
              </div>
              <div className="rounded-2xl bg-amber-50 border border-amber-100 p-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-2">Copyright and takedown</h3>
                <p className="text-amber-900">
                  If you believe material on this site infringes your copyright, follow the procedure in our <Link to="/dmca" className="underline">DMCA notice</Link>. Verified notices are actioned within five business days.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Diversity and accessibility</h2>
              <p>
                We aim to make every article readable and useful. We write in plain English, use descriptive headings, provide alt text for every image, and avoid jargon where a plain word will do. If a tutorial requires a paid tool, we always name a free alternative.
              </p>
              <p className="mt-4">
                We are a small team and we are still learning. Suggestions for how we can do better are always welcome via the <Link to="/contact" className="underline">contact form</Link>.
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
              Read our latest articles
            </h2>
            <p className="text-blue-100 mb-8">
              Browse the blog for tutorials, prompt libraries, and platform reviews.
            </p>
            <Link to="/blog">
              <Button size="lg" variant="secondary">
                Visit the Blog
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default EditorialPolicyPage;
