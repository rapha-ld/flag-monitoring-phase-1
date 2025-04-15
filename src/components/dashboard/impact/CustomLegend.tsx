
import React from 'react';
import { IMPACT_COLOR, THIS_FLAG_COLOR } from './constants';

const CustomLegend = () => {
  return (
    <div className="flex items-center space-x-2 text-xs mb-2">
      <div className="flex items-center">
        <div className="h-[2px] w-6 mr-1.5" style={{ backgroundColor: THIS_FLAG_COLOR }}></div>
        <span>This flag</span>
      </div>
      <div className="flex items-center">
        <div className="h-3 w-3 rounded-sm mr-1.5" style={{ backgroundColor: IMPACT_COLOR, opacity: 0.3 }}></div>
        <span>All flags</span>
      </div>
    </div>
  );
};

export default CustomLegend;
