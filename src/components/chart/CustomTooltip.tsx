
import React from 'react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<any>;
  label?: string;
  tooltipLabelFormatter: (label: string) => string;
  tooltipValueFormatter: (value: number) => string;
  showTrue?: boolean;
  showFalse?: boolean;
}

const CustomTooltip = ({ 
  active, 
  payload, 
  label, 
  tooltipLabelFormatter, 
  tooltipValueFormatter,
  showTrue,
  showFalse
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    // Find the true and false values in the payload
    const trueData = payload.find(p => p.name === 'True');
    const falseData = payload.find(p => p.name === 'False');
    
    return (
      <div className="bg-popover border border-border shadow-md rounded-md p-2 text-xs">
        <p className="font-medium">{tooltipLabelFormatter(label || '')}</p>
        
        <div className="space-y-1 mt-1">
          {showTrue && trueData && (
            <div className="flex justify-between gap-2">
              <span style={{ color: trueData.color }}>True:</span>
              <span className="text-primary font-medium">
                {tooltipValueFormatter(trueData.value)}
              </span>
            </div>
          )}
          
          {showFalse && falseData && (
            <div className="flex justify-between gap-2">
              <span style={{ color: falseData.color }}>False:</span>
              <span className="text-primary font-medium">
                {tooltipValueFormatter(falseData.value)}
              </span>
            </div>
          )}
          
          {/* If we're showing the original value */}
          {!showTrue && !showFalse && payload[0] && (
            <p className="text-primary">
              {tooltipValueFormatter(payload[0].value)}
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
