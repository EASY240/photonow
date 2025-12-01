import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send } from 'lucide-react';
import SEO from '../components/ui/SEO';
import Button from '../components/ui/Button';

const ContactPage: React.FC = () => {
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        success: false,
        message: 'Please fill out all fields.',
        submitted: true
      });
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({
        success: false,
        message: 'Please enter a valid email address.',
        submitted: true
      });
      return;
    }
    
    // In a real implementation, you would send the form data to your backend
    // For now, we'll just simulate a successful submission
    
    // Simulate API call
    setTimeout(() => {
      setFormStatus({
        success: true,
        message: 'Your message has been sent. We\'ll get back to you soon!',
        submitted: true
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    }, 1000);
  };
  
  return (
    <>
      <SEO 
        title="Contact Us" 
        description="Have questions or feedback? Contact the ModernPhotoTools.com team. We're here to help with any inquiries about our AI photo editing tools."
        canonicalUrl="https://modernphototools.com/contact"
      />
      
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
                      support@modernphototools.com
                    </p>
                  </div>
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
                
                <Button 
                  type="submit" 
                  fullWidth
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
