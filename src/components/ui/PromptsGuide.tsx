import React from 'react';

const PromptsGuide: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How to create effective prompts
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ideal prompt structure</h3>
            <p className="text-gray-600 text-left">
              <strong>[Main subject]</strong> + <strong>[Environment / Setting]</strong> + <strong>[Style]</strong> + <strong>[Lighting / Mood]</strong> + <strong>[Details / Adjectives]</strong> + (optional) <strong>[Camera / Perspective / Composition info]</strong>
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Role of negative prompts</h3>
            <p className="text-gray-600">
              Remove unwanted elements that the AI might generate based on its interpretation of your positive prompt, such as poor quality, extra fingers, or distorted features.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Use seeds for consistency</h3>
            <p className="text-gray-600">
              AI image generators can produce a variety of images from the same prompt. Enable the 'seed' option, and change the prompt with the same seed number to see consistent images.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromptsGuide;