import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import SEO from '../components/ui/SEO';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEO 
        title="Page Not Found" 
        description="Sorry, the page you are looking for could not be found."
      />
      
      <div className="min-h-[60vh] flex items-center">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Page Not Found</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/">
              <Button leftIcon={<Home size={18} />}>
                Back to Home
              </Button>
            </Link>
            <Link to="/tools">
              <Button variant="outline" leftIcon={<Search size={18} />}>
                Explore Tools
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;