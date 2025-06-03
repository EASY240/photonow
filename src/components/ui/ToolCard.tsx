import React from 'react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import type { Tool } from '../../types';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  // Dynamically get the icon component with better error handling
  const getIconComponent = (iconName: string) => {
    // Convert kebab-case to PascalCase (e.g., 'refresh-cw' -> 'RefreshCw')
    const pascalCaseName = iconName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    
    // Try the converted name first, then the original with first letter capitalized
    const IconComponent = (LucideIcons as unknown as Record<string, React.FC<{ className?: string }>>)[pascalCaseName] ||
                         (LucideIcons as unknown as Record<string, React.FC<{ className?: string }>>)[iconName.charAt(0).toUpperCase() + iconName.slice(1)] ||
                         LucideIcons.Image;
    
    return IconComponent;
  };
  
  const IconComponent = getIconComponent(tool.icon);

  return (
    <Link 
      to={tool.path} 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-6">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
          <IconComponent className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.name}</h3>
        <p className="text-gray-600">{tool.description}</p>
      </div>
    </Link>
  );
};

export default ToolCard;