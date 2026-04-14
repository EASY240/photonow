import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { SchemaJSONLD } from '../components/ui/SchemaJSONLD';
import Button from '../components/ui/Button';
import TurnstileCaptcha from '../components/ui/TurnstileCaptcha';
import { generateBreadcrumbSchema, personalProfile } from '../utils/siteConfig';

const ContactPage: React.FC = () => {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' }
  ]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState<{
    success: boolean;
    message: string;
    submitted: boolean;
  }>({
    success: false,
    message: '',
    submitted: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaResetCounter, setCaptchaResetCounter] = useState(0);
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        success: false,
        message: 'Please fill out all fields.',
        submitted: true
      });
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({
        success: false,
        message: 'Please enter a valid email address.',
        submitted: true
      });
      return;
    }

    if (!turnstileSiteKey) {
      setFormStatus({
        success: false,
        message: 'CAPTCHA is not configured. Please try again later.',
        submitted: true
      });
      return;
    }

    if (!captchaToken) {
      setFormStatus({
        success: false,
        message: 'Please complete the CAPTCHA challenge before sending your message.',
        submitted: true
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const contactApiUrl = '/api/contact-email';

      const response = await fetch(contactApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          captchaToken
        })
      });
      const rawResponse = await response.text();
      let result: { success?: boolean; message?: string } = {};
      if (rawResponse) {
        try {
          result = JSON.parse(rawResponse);
        } catch {
          result = { success: false, message: 'Unexpected server response format.' };
        }
      }
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to send message. Please try again.');
      }

      setFormStatus({
        success: true,
        message: result.message || 'Your message has been sent. We\'ll get back to you soon!',
        submitted: true
      });
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      setCaptchaToken('');
      setCaptchaResetCounter(prev => prev + 1);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send message. Please try again.';
      setFormStatus({
        success: false,
        message,
        submitted: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <SEO 
        title="Contact Us" 
        description={`Have questions or feedback? Contact ${personalProfile.fullName} at ${personalProfile.contactEmail} for support with ModernPhotoTools AI photo editing tools.`}
      />
      <SchemaJSONLD data={breadcrumbSchema} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
              <p className="text-gray-700 mb-6">
                We're here to help with any questions or feedback you might have about our tools or services.
              </p>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-start mb-4">
                  <Mail className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Email Us</h3>
                    <p className="text-gray-700">
                      {personalProfile.contactEmail}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    Founder: <span className="font-semibold">{personalProfile.fullName}</span>
                  </p>
                  <p>
                    Personal site:{' '}
                    <a
                      href={personalProfile.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {personalProfile.websiteUrl}
                    </a>
                  </p>
                  <p>
                    Instagram:{' '}
                    <a
                      href={personalProfile.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      @alizurschmiede
                    </a>
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  We typically respond within 24-48 hours during business days.
                </p>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Send a Message</h2>
              
              {formStatus.submitted && (
                <div className={`mb-6 p-4 rounded-lg ${formStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {formStatus.message}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john.doe@example.com"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-1">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="How can we help you?"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Verify You Are Human
                  </label>
                  <TurnstileCaptcha
                    siteKey={turnstileSiteKey}
                    onTokenChange={setCaptchaToken}
                    resetTrigger={captchaResetCounter}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  fullWidth
                  isLoading={isSubmitting}
                  disabled={isSubmitting || !captchaToken || !turnstileSiteKey}
                  leftIcon={<Send size={18} />}
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy Notice</h2>
            <p className="text-gray-700 text-sm">
              By submitting this form, you agree to our <Link to="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>. 
              We collect and process your personal data only for the purpose of responding to your inquiry. 
              Your information will not be shared with third parties without your consent.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
