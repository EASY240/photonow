import React from 'react';
import SEO from '../components/ui/SEO';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <SEO 
        title="Privacy Policy" 
        description="Learn how ModernPhotoTools.com protects your privacy and handles your data when you use our AI photo editing tools."
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Privacy <span className="text-blue-600">Policy</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Learn how we protect your privacy and handle your data when you use our AI photo editing tools
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
                <h2 className="text-2xl font-semibold mb-2">Introduction</h2>
                <p>
                  At <strong>ModernPhotoTools.com</strong>, your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your information when using our website and AI-powered photo editing tools.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Information We Collect</h2>

                <h3 className="text-xl font-medium mt-4 mb-1">📷 Images & Files</h3>
                <p>
                  When you use our tools (e.g., background remover, blurring, resizing), your uploaded images are processed securely on our servers. We do <strong>not store</strong> your images permanently — they are <strong>deleted automatically</strong> after processing.
                </p>

                <h3 className="text-xl font-medium mt-4 mb-1">📊 Usage Data</h3>
                <p>We may collect anonymous usage data such as:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Pages visited and time spent</li>
                  <li>Tools used and frequency</li>
                  <li>Browser type and device details</li>
                  <li>IP address and general location</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">How We Use Your Information</h2>
                <p>The data we collect helps us to:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Deliver fast and accurate photo editing via AI</li>
                  <li>Improve tool performance and user experience</li>
                  <li>Analyze anonymous usage patterns</li>
                  <li>Maintain website security and stability</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">🔐 Data Security</h2>
                <p>We prioritize the safety of your data through:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Encrypted connections (SSL/TLS)</li>
                  <li>Immediate deletion of uploaded images</li>
                  <li>No permanent image storage</li>
                  <li>Restricted, monitored server access</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">🍪 Cookies</h2>
                <p>
                  We may use cookies to enhance your browsing experience. You can manage your cookie preferences in your browser settings.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">🛡️ Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Know what data we collect</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of certain data collection</li>
                  <li>Contact us regarding privacy concerns</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">📬 Contact Us</h2>
                <p>
                  For any privacy-related inquiries, please reach out to us through the <a href="/contact" className="text-blue-600 hover:underline">contact page</a>.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-2">🔄 Updates to This Policy</h2>
                <p>
                  This policy may be updated occasionally. Changes will be reflected on this page along with the latest revision date.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicyPage;
