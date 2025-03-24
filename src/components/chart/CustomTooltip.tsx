
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
  showAverage?: boolean;
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
  metricType,
  showAverage
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    console.log("Tooltip payload:", payload);
    
    return (
      <div className="bg-popover border border-border shadow-md rounded-md p-2 text-xs">
        <p className="font-medium">{tooltipLabelFormatter(label || '')}</p>
        
        {/* For stacked or mixed charts when showing true/false values */}
        {(showTrue || showFalse) && !showAverage && (
          <div className="space-y-1 mt-1">
            {payload.map((entry, index) => (
              <div key={`tooltip-${index}`} className="flex justify-between gap-2">
                <span style={{ color: entry.color }}>{entry.name}:</span>
                <span className="text-textBase font-medium">
                  {tooltipValueFormatter(entry.value)}
                </span>
              </div>
            ))}
          </div>
        )}
        
        {/* For average values (when both true/false are selected) */}
        {showAverage && (
          <div className="space-y-1 mt-1">
            {/* Show the True value first */}
            <div className="flex justify-between gap-2">
              <span style={{ color: '#2BB7D2' }}>True:</span>
              <span className="text-textBase font-medium">
                {tooltipValueFormatter(payload[0].payload.valueTrue || 0)}
              </span>
            </div>
            
            {/* Show the False value */}
            <div className="flex justify-between gap-2">
              <span style={{ color: '#FFD099' }}>False:</span>
              <span className="text-textBase font-medium">
                {tooltipValueFormatter(payload.find(p => p.dataKey === 'valueFalse')?.value || 0)}
              </span>
            </div>
          </div>
        )}
        
        {/* If we're showing the original value */}
        {!showTrue && !showFalse && (
          <p className="text-textBase font-medium">
            {tooltipValueFormatter(payload[0].value)}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
