import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import { SchemaJSONLD } from '../components/ui/SchemaJSONLD';
import Button from '../components/ui/Button';
import { generateBreadcrumbSchema, personalProfile } from '../utils/siteConfig';

const HowItWorksPage: React.FC = () => {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'How it Works', path: '/how-it-works' }
  ]);

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How ModernPhotoTools Works',
    description: 'Step-by-step explanation of how ModernPhotoTools processes, enhances, and generates images using AI.',
    step: [
      { '@type': 'HowToStep', name: 'Upload your image', text: 'Drop or select a photo from your device. Common formats like JPG, PNG, and WEBP are supported.' },
      { '@type': 'HowToStep', name: 'Choose a tool', text: 'Pick the editing or generation tool that matches what you want to do, such as Remove Background or AI Image Upscaler.' },
      { '@type': 'HowToStep', name: 'AI processing', text: 'Our AI models analyze your image and apply the requested transformation in seconds, entirely in your browser or via secure cloud calls.' },
      { '@type': 'HowToStep', name: 'Review and download', text: 'Compare the result side-by-side with the original, then download the final image in high resolution.' }
    ]
  };

  return (
    <>
      <SEO
        title="How ModernPhotoTools Works"
        description="A transparent, step-by-step explanation of how ModernPhotoTools uses AI to remove backgrounds, upscale images, generate new visuals, and protect your privacy."
      />
      <SchemaJSONLD data={breadcrumbSchema} />
      <SchemaJSONLD data={howToSchema} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How <span className="text-blue-600">ModernPhotoTools</span> Works
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              A transparent look at the AI, the pipeline, and the privacy guarantees behind every tool on ModernPhotoTools.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8 text-gray-700">

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Our guiding principle</h2>
              <p>
                ModernPhotoTools was built around a single idea: powerful image editing should not require expensive software, a steep learning curve, or a privacy trade-off. Every feature you see on this site is engineered to be fast, free to use, and respectful of the files you upload. The platform is maintained by {personalProfile.fullName}, a {personalProfile.title}, and runs on a modern, containerised stack hosted on reliable cloud infrastructure.
              </p>
              <p className="mt-4">
                The rest of this page walks you through the four-stage pipeline that powers every tool, the AI models we use, and the security and privacy choices we make on your behalf. We publish this detail so that creators, marketers, and developers can trust the platform with their work.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">The four-stage pipeline</h2>
              <ol className="space-y-6 list-decimal list-inside">
                <li>
                  <h3 className="text-lg font-semibold text-gray-900 inline">Upload or import</h3>
                  <p className="mt-1">You drop a file from your device, paste a URL, or pick a sample. The browser reads the image into memory; we never write your source file to long-term storage. Supported formats include JPEG, PNG, WEBP, and most RAW previews.</p>
                </li>
                <li>
                  <h3 className="text-lg font-semibold text-gray-900 inline">Pre-processing</h3>
                  <p className="mt-1">We normalise orientation, downscale extremely large inputs, and extract metadata. For tools that mask a subject we run a quick subject-detection pass so the model focuses on the right pixels.</p>
                </li>
                <li>
                  <h3 className="text-lg font-semibold text-gray-900 inline">AI inference</h3>
                  <p className="mt-1">The selected tool sends the prepared image to a specialised model. Generation tools compose a fresh image; editing tools return a transformed version. The inference step typically takes between two and twelve seconds depending on tool complexity and image size.</p>
                </li>
                <li>
                  <h3 className="text-lg font-semibold text-gray-900 inline">Delivery and cleanup</h3>
                  <p className="mt-1">The result streams back to your browser, is shown in a side-by-side viewer, and is offered as a one-click download. We hold the result in memory only for the duration of your session; temporary buffers are purged after the tab closes.</p>
                </li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-blue-50 border border-blue-100 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">The AI models</h3>
                <p className="text-blue-900">
                  We use a curated set of state-of-the-art vision and diffusion models. Each tool is paired with the model that performs best on its specific task, whether that is segmentation, super-resolution, style transfer, or text-to-image generation. Models are versioned and we publish notes when an upgrade is rolled out.
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-6">
                <h3 className="text-lg font-semibold text-emerald-900 mb-2">Browser-side vs cloud</h3>
                <p className="text-emerald-900">
                  Lightweight tools (such as simple filters and the prompt helper) run entirely in your browser, so the image never leaves your device. Heavy models run in our cloud with encrypted transport, and we sign a strict data-retention contract with every provider.
                </p>
              </div>
              <div className="rounded-2xl bg-purple-50 border border-purple-100 p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Privacy by design</h3>
                <p className="text-purple-900">
                  We do not sell or share user uploads. We do not train third-party models on your images. We log only the minimum metadata required for abuse prevention and product analytics. The full policy is in our <Link to="/privacy-policy" className="underline">Privacy Policy</Link>.
                </p>
              </div>
              <div className="rounded-2xl bg-amber-50 border border-amber-100 p-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-2">Performance and limits</h3>
                <p className="text-amber-900">
                  Most tools complete in seconds. We apply fair-use rate limits to keep the service fast for everyone. Heavy users can apply for higher quotas by emailing {personalProfile.contactEmail}.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Quality assurance</h2>
              <p>
                Every new model goes through a structured evaluation before it ships. We test on a private benchmark of more than a thousand curated images that cover portraits, products, real estate, food, fashion, and low-light photography. We also keep a manual review queue where the community reports regressions; reports sent to {personalProfile.contactEmail} are usually answered within one business day.
              </p>
              <p className="mt-4">
                If a result does not meet your expectations, the simplest fix is to retry with a higher-resolution source or a different style preset. For persistent issues we publish a public status page and a changelog so you always know what changed.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Frequently asked questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Is ModernPhotoTools really free?</h3>
                  <p>Yes. Every tool on this site is free to use. We may add optional paid tiers in the future for batch processing and team features, but the existing tools will remain free.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Do you store my images?</h3>
                  <p>Only for as long as needed to return the result. Source files and outputs are purged from memory after your session ends. We do not use your uploads to train third-party AI models.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Can I use the results commercially?</h3>
                  <p>Yes, you retain ownership of your source images. Outputs produced by the tools on this site are yours to use, subject to our <Link to="/terms-of-use" className="underline">Terms of Use</Link>.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">How do I report a problem?</h3>
                  <p>Open a ticket through the <Link to="/contact" className="underline">Contact</Link> page or email {personalProfile.contactEmail}. We answer most messages within one business day.</p>
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
              Ready to try it yourself?
            </h2>
            <p className="text-blue-100 mb-8">
              Open any tool, drop in an image, and watch the pipeline in action.
            </p>
            <Link to="/tools">
              <Button size="lg" variant="secondary">
                Explore All Tools
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorksPage;
