import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import { SchemaJSONLD } from '../components/ui/SchemaJSONLD';
import VideoToolCard from '../components/ui/VideoToolCard';
import { tools } from '../data/tools';
import { getVideoUrl } from '../utils/videoMapping';
import { generateBreadcrumbSchema, generateCanonicalUrl } from '../utils/siteConfig';
import '../styles/video-tool-card.css';

const ToolsPage: React.FC = () => {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools' }
  ]);

  const toolsSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AI Photo Editing Tools',
    description: 'Free AI-powered photo editing tools for background removal, portrait enhancement, image upscaling, and more.',
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: tool.name,
      description: tool.description,
      url: `https://modernphototools.com${tool.path}`,
    }))
  };

  // Group tools by category
  const toolGroups = {
    'Photo Enhancement': tools.filter(t =>
      ['remove-background', 'ai-cleanup', 'ai-expand', 'ai-replace', 'ai-image-upscaler'].includes(t.id)
    ),
    'Creative AI': tools.filter(t =>
      ['ai-cartoon', 'ai-caricature', 'ai-avatar', 'ai-filter', 'ai-sketch-to-image', 'ai-image-to-image', 'ai-hairstyle'].includes(t.id)
    ),
    'Image Generation': tools.filter(t =>
      ['ai-image-generator', 'ai-background-generator', 'ai-logo-generator', 'prompt-generator'].includes(t.id)
    ),
    'Professional & Portrait': tools.filter(t =>
      ['ai-portrait', 'ai-product-photoshoot', 'ai-face-swap', 'ai-outfit'].includes(t.id)
    ),
  };

  return (
    <>
      <SEO
        title="All Photo Editing Tools"
        description="Explore 20 free AI-powered photo editing tools. Remove backgrounds, enhance portraits, upscale images, generate custom backgrounds, and more — no account required."
        canonicalUrl={generateCanonicalUrl('/tools')}
      />
      <SchemaJSONLD data={[breadcrumbSchema, toolsSchema]} />

      {/* Hero intro — substantial static content for crawlers */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            All Photo Editing Tools
          </h1>
          <p className="text-xl text-gray-700 mb-6 max-w-3xl mx-auto">
            Twenty free AI-powered tools for every photo editing task — from removing backgrounds and enhancing portraits to generating product photos and upscaling images for print. No account, no software download, and no cost.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {Object.keys(toolGroups).map(group => (
              <a
                key={group}
                href={`#${group.replace(/\s+/g, '-').toLowerCase()}`}
                className="px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-full font-medium hover:bg-blue-50 transition-colors"
              >
                {group}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Who are these tools for */}
      <section className="py-12 bg-white px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Who Uses These Tools?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              {
                icon: '🛍️',
                title: 'E-Commerce Sellers',
                desc: 'Remove backgrounds from product shots, add professional backdrops, and upscale images to meet marketplace resolution requirements — without hiring a photographer.'
              },
              {
                icon: '👤',
                title: 'Job Seekers & Professionals',
                desc: 'Create polished LinkedIn headshots and CV portraits from a smartphone photo in under 10 minutes. No studio, no appointment.'
              },
              {
                icon: '📱',
                title: 'Content Creators',
                desc: 'Generate avatars, apply artistic filters, try different hairstyles, and produce custom AI backgrounds for Instagram, TikTok, and YouTube content.'
              },
              {
                icon: '💼',
                title: 'Small Business Owners',
                desc: 'Produce clean product photos, professional logos, and branded visuals without a graphic design budget or a retainer with a freelancer.'
              }
            ].map(persona => (
              <div key={persona.title} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="text-3xl mb-3">{persona.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{persona.title}</h3>
                <p className="text-sm text-gray-600">{persona.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tool groups */}
      {Object.entries(toolGroups).map(([group, groupTools]) => (
        <section
          key={group}
          id={group.replace(/\s+/g, '-').toLowerCase()}
          className="py-12 bg-gray-50 px-[10%]"
        >
          <div className="w-full mx-auto">
            <div className="max-w-3xl mx-auto mb-8">
              <h2 className="text-2xl font-bold text-gray-900">{group}</h2>
              <p className="text-gray-600 mt-1">
                {group === 'Photo Enhancement' && 'Clean up, fix, and transform existing photos. These tools work with photos you already have.'}
                {group === 'Creative AI' && 'Apply artistic styles, convert sketches to images, and try new looks — from hairstyles to cartoon versions of yourself.'}
                {group === 'Image Generation' && 'Generate entirely new images from text prompts. Useful for backgrounds, logos, product mockups, and creative concepts.'}
                {group === 'Professional & Portrait' && 'Tools designed for portraits, professional photos, and virtual wardrobe changes for LinkedIn, CVs, and social profiles.'}
              </p>
            </div>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
              {groupTools.map((tool) => (
                <div key={tool.id} className="col mt-10 px-3 apiSectionBox">
                  <VideoToolCard
                    tool={tool}
                    videoUrl={getVideoUrl(tool.name)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* How It Works */}
      <section className="py-14 bg-white px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">How Every Tool Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Upload Your Image', desc: 'Select a photo from your device. Most tools accept JPEG, PNG, and WebP. No account or login required.' },
              { step: '2', title: 'AI Processes It', desc: 'The AI model analyzes your image and applies the editing task automatically. Most operations complete in under 15 seconds.' },
              { step: '3', title: 'Download the Result', desc: 'Preview the output and download your edited image. No watermarks. No export fees. Ready to use anywhere.' },
            ].map(item => (
              <div key={item.step} className="bg-gray-50 p-6 rounded-xl text-center border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-blue-600 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Not Sure Where to Start?</h2>
          <p className="text-blue-100 mb-6">
            The <Link to="/tools/remove-background" className="text-white underline font-medium">Remove Background</Link> and <Link to="/tools/ai-image-upscaler" className="text-white underline font-medium">AI Image Upscaler</Link> are the two most used tools on this platform — and both deliver results in under 10 seconds.
          </p>
          <Link to="/blog">
            <span className="inline-flex items-center px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
              Read Our Guides & Tutorials
            </span>
          </Link>
        </div>
      </section>
    </>
  );
};

export default ToolsPage;
