import React from 'react';
import SEO from '../components/ui/SEO';
import { SchemaJSONLD } from '../components/ui/SchemaJSONLD';
import { generateBreadcrumbSchema } from '../utils/siteConfig';

const CookiesPolicyPage: React.FC = () => {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Cookies Policy', path: '/cookies-policy' }
  ]);
  return (
    <>
      <SEO 
        title="Cookies Policy" 
        description="Learn about how ModernPhotoTools.com uses cookies to enhance your browsing experience and improve our services."
      />
      <SchemaJSONLD data={breadcrumbSchema} />

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Cookies <span className="text-blue-600">Policy</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Learn how ModernPhotoTools.com uses cookies to improve your experience and how you can manage your preferences.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white text-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <p className="text-gray-700">
                This Cookies Policy explains how ModernPhotoTools.com ("we", "us", or "our") uses cookies and similar technologies when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">What Are Cookies?</h2>
                <p className="text-gray-700">
                  Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Why Do We Use Cookies?</h2>
                <p className="text-gray-700">
                  We use cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our website.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Types of Cookies We Use</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl bg-blue-50 border border-blue-100 p-5">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Essential Cookies</h3>
                  <p className="text-blue-900">
                    These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas.
                  </p>
                </div>
                <div className="rounded-xl bg-purple-50 border border-purple-100 p-5">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">Performance & Analytics</h3>
                  <p className="text-purple-900">
                    These cookies collect information about how visitors use our website, such as the pages visited most often and whether users receive error messages.
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-5">
                  <h3 className="text-lg font-semibold text-emerald-900 mb-2">Functionality Cookies</h3>
                  <p className="text-emerald-900">
                    These cookies allow our website to remember choices you make and provide enhanced, more personal features.
                  </p>
                </div>
                <div className="rounded-xl bg-amber-50 border border-amber-100 p-5">
                  <h3 className="text-lg font-semibold text-amber-900 mb-2">Targeting & Advertising</h3>
                  <p className="text-amber-900">
                    These cookies are used to deliver adverts more relevant to you and your interests and help measure campaign effectiveness.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Third-Party Cookies</h2>
                <p className="text-gray-700">
                  In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the service, deliver advertisements on and through the service, and so on. These third-party cookies are governed by the respective privacy policies of the third parties providing them.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">How Can You Control Cookies?</h2>
                <p className="text-gray-700 mb-4">
                  You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided in the cookie banner when you first visit our website.
                </p>
                <p className="text-gray-700">
                  You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Browser Controls</h3>
              <p className="text-gray-700">
                Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, since it will no longer be personalized to you.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Cookie Retention</h2>
              <p className="text-gray-700 mb-3">Cookies set by us will be retained for different periods depending on their purpose:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li><span className="font-semibold text-gray-900">Session cookies:</span> Temporary and deleted when you close your browser.</li>
                <li><span className="font-semibold text-gray-900">Persistent cookies:</span> Remain on your device for a set period or until you delete them.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Updates to This Policy</h2>
              <p className="text-gray-700">
                We may update this Cookies Policy from time to time in order to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons. Please revisit this policy regularly to stay informed about our use of cookies.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about our use of cookies or other technologies, please contact us through our <a href="/contact" className="text-blue-600 underline">contact page</a>.
              </p>
            </div>

            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700">Last updated:</span> {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default CookiesPolicyPage;
