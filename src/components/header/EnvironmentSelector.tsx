
import React from 'react';
import { cn } from '@/lib/utils';

interface EnvironmentSelectorProps {
  environment: string;
  onEnvironmentChange: (value: string) => void;
}

const EnvironmentSelector = ({ environment, onEnvironmentChange }: EnvironmentSelectorProps) => {
  // Define environment colors
  const prodColor = "#8BEF34"; // Updated production color
  const stagingColor = "#EBFF38"; // Staging color
  const circleBorderColor = "#07080C"; // Border color for the circles
  
  return (
    <div className="flex space-x-2">
      <button
        type="button"
        onClick={() => onEnvironmentChange('production')}
        className={cn(
          "flex items-center w-[240px] h-[32px] rounded-md bg-white pl-4", 
          "hover:bg-gray-50 transition-colors text-[11px]",
          environment === 'production' 
            ? `border-2 border-[${prodColor}]` 
            : "border border-gray-200"
        )}
      >
        <div className="flex items-center">
          <div 
            className="w-[12px] h-[12px] rounded-full mr-2 border border-[#07080C]" 
            style={{ backgroundColor: prodColor }}
          ></div>
          <span>Production</span>
        </div>
      </button>
      
      <button
        type="button"
        onClick={() => onEnvironmentChange('staging')}
        className={cn(
          "flex items-center w-[240px] h-[32px] rounded-md bg-white pl-4", 
          "hover:bg-gray-50 transition-colors text-[11px]",
          environment === 'staging' 
            ? `border-2 border-[${stagingColor}]` 
            : "border border-gray-200"
        )}
      >
        <div className="flex items-center">
          <div 
            className="w-[12px] h-[12px] rounded-full mr-2 border border-[#07080C]" 
            style={{ backgroundColor: stagingColor }}
          ></div>
          <span>Staging</span>
        </div>
      </button>
    </div>
  );
};

export default EnvironmentSelector;
