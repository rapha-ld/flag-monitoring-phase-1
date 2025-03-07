
import React from 'react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<any>;
  label?: string;
  tooltipLabelFormatter: (label: string) => string;
  tooltipValueFormatter: (value: number) => string;
  showTrue?: boolean;
  showFalse?: boolean;
  chartType?: 'stacked' | 'mixed';
  metricType?: 'evaluations' | 'conversion' | 'errorRate';
}

const CustomTooltip = ({ 
  active, 
  payload, 
  label, 
  tooltipLabelFormatter, 
  tooltipValueFormatter,
  showTrue,
  showFalse,
  chartType = 'stacked',
  metricType
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    // Log to inspect the payload structure
    console.log("Tooltip payload:", payload);
    
    return (
      <div className="bg-popover border border-border shadow-md rounded-md p-2 text-xs">
        <p className="font-medium">{tooltipLabelFormatter(label || '')}</p>
        
        {/* For stacked or mixed charts when showing true/false values */}
        {(showTrue || showFalse) && (
          <div className="space-y-1 mt-1">
            {payload.map((entry, index) => (
              <div key={`tooltip-${index}`} className="flex justify-between gap-2">
                <span style={{ color: entry.color }}>{entry.name}:</span>
                <span className="text-primary font-medium">
                  {metricType === 'evaluations' && entry.name === 'True' 
                    ? `Evaluations: ${entry.value}` 
                    : tooltipValueFormatter(entry.value)}
                </span>
              </div>
            ))}
          </div>
        )}
        
        {/* If we're showing the original value */}
        {!showTrue && !showFalse && (
          <p className="text-primary">
            {metricType === 'evaluations' 
              ? `Evaluations: ${payload[0].value}` 
              : tooltipValueFormatter(payload[0].value)}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
