import React from 'react';
import SEO from '../components/ui/SEO';

const CookiesPolicyPage: React.FC = () => {
  return (
    <>
      <SEO 
        title="Cookies Policy" 
        description="Learn about how ModernPhotoTools.com uses cookies to enhance your browsing experience and improve our services."
      />

      <section className="bg-white text-gray-800 py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">
            Cookies Policy
          </h1>

          <div className="prose prose-lg prose-gray max-w-none">
            <p>
              This Cookies Policy explains how ModernPhotoTools.com ("we", "us", or "our") uses cookies and similar technologies 
              when you visit our website. It explains what these technologies are and why we use them, as well as your rights 
              to control our use of them.
            </p>

            <hr className="my-10 border-gray-200" />

            <h2>What Are Cookies?</h2>
            <p>
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
              Cookies are widely used by website owners to make their websites work, or to work more efficiently, 
              as well as to provide reporting information.
            </p>

            <h2>Why Do We Use Cookies?</h2>
            <p>
              We use cookies for several reasons. Some cookies are required for technical reasons in order for our website 
              to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to 
              track and target the interests of our users to enhance the experience on our website.
            </p>

            <h2>Types of Cookies We Use</h2>

            <h3>Essential Cookies</h3>
            <p>
              These cookies are strictly necessary to provide you with services available through our website and to use 
              some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver 
              the website, you cannot refuse them without impacting how our site functions.
            </p>

            <h3>Performance and Analytics Cookies</h3>
            <p>
              These cookies collect information about how visitors use our website, for instance which pages visitors go to most often, 
              and if they get error messages from web pages. These cookies don't collect information that identifies a visitor. 
              All information these cookies collect is aggregated and therefore anonymous.
            </p>

            <h3>Functionality Cookies</h3>
            <p>
              These cookies allow our website to remember choices you make (such as your user name, language, or the region you are in) 
              and provide enhanced, more personal features. These cookies can also be used to remember changes you have made to 
              text size, fonts, and other parts of web pages that you can customize.
            </p>

            <h3>Targeting and Advertising Cookies</h3>
            <p>
              These cookies are used to deliver adverts more relevant to you and your interests. They are also used to limit the 
              number of times you see an advertisement as well as help measure the effectiveness of the advertising campaign.
            </p>

            <h2>Third-Party Cookies</h2>
            <p>
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the service, 
              deliver advertisements on and through the service, and so on. These third-party cookies are governed by the respective 
              privacy policies of the third parties providing them.
            </p>

            <h2>How Can You Control Cookies?</h2>
            <p>
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking 
              on the appropriate opt-out links provided in the cookie banner when you first visit our website.
            </p>

            <p>
              You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, 
              you may still use our website though your access to some functionality and areas of our website may be restricted.
            </p>

            <h3>Browser Controls</h3>
            <p>
              Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability 
              of websites to set cookies, you may worsen your overall user experience, since it will no longer be personalized to you.
            </p>

            <h2>Cookie Retention</h2>
            <p>Cookies set by us will be retained for different periods depending on their purpose:</p>
            <ul>
              <li><strong>Session cookies:</strong> Temporary and deleted when you close your browser.</li>
              <li><strong>Persistent cookies:</strong> Remain on your device for a set period or until you delete them.</li>
            </ul>

            <h2>Updates to This Policy</h2>
            <p>
              We may update this Cookies Policy from time to time in order to reflect changes to the cookies we use or for other 
              operational, legal, or regulatory reasons. Please revisit this policy regularly to stay informed about our use of cookies.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about our use of cookies or other technologies, please contact us through our <a href="/contact">contact page</a>.
            </p>

            <p className="text-sm text-gray-500 mt-10">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default CookiesPolicyPage;
