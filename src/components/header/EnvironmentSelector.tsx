
import React from 'react';
import { cn } from '@/lib/utils';

interface EnvironmentSelectorProps {
  environment: string;
  onEnvironmentChange: (value: string) => void;
}

const EnvironmentSelector = ({ environment, onEnvironmentChange }: EnvironmentSelectorProps) => {
  // Define environment colors
  const prodColor = "#65A30D"; // Green color for production
  const stagingColor = "#CBD637"; // Yellow color for staging
  
  return (
    <div className="flex space-x-2">
      <button
        type="button"
        onClick={() => onEnvironmentChange('production')}
        className={cn(
          "flex items-center px-4 py-2 rounded-md bg-white text-sm",
          "hover:bg-gray-50 transition-colors h-9",
          environment === 'production' 
            ? `border-2 border-[${prodColor}]` 
            : "border border-gray-200"
        )}
      >
        <span 
          className="w-4 h-4 rounded-full mr-2" 
          style={{ backgroundColor: prodColor }}
        ></span>
        Production
      </button>
      
      <button
        type="button"
        onClick={() => onEnvironmentChange('staging')}
        className={cn(
          "flex items-center px-4 py-2 rounded-md bg-white text-sm",
          "hover:bg-gray-50 transition-colors h-9",
          environment === 'staging' 
            ? `border-2 border-[${stagingColor}]` 
            : "border border-gray-200"
        )}
      >
        <span 
          className="w-4 h-4 rounded-full mr-2" 
          style={{ backgroundColor: stagingColor }}
        ></span>
        Staging
      </button>
    </div>
  );
};

export default EnvironmentSelector;
