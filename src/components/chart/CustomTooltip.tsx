
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
    // Filter out entries with undefined or null values
    const validPayloads = payload.filter(entry => 
      entry.value !== undefined && entry.value !== null
    );
    
    // If there are no valid payloads, don't show a tooltip
    if (validPayloads.length === 0) {
      return null;
    }
    
    return (
      <div className="bg-popover border border-border shadow-md rounded-md p-2 text-xs">
        <p className="font-medium">{tooltipLabelFormatter(label || '')}</p>
        
        {/* For stacked or mixed charts when showing true/false values */}
        {(showTrue || showFalse) && !showAverage && (
          <div className="space-y-1 mt-1">
            {validPayloads.map((entry, index) => (
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
        
        {/* For average values (when both true/false are selected) */}
        {showAverage && (
          <div className="space-y-1 mt-1">
            {/* Show the average value */}
            {payload.find(p => p.dataKey === 'valueAvg' && p.value !== null) && (
              <div className="flex justify-between gap-2">
                <span style={{ color: '#6E6F96' }}>Average:</span>
                <span className="text-primary font-medium">
                  {tooltipValueFormatter(payload.find(p => p.dataKey === 'valueAvg')?.value || 0)}
                </span>
              </div>
            )}
            
            {/* Also show the False value as it's displayed as a line */}
            {payload.map((entry, index) => (
              entry.dataKey === 'valueFalse' && entry.value !== null && (
                <div key={`tooltip-${index}`} className="flex justify-between gap-2">
                  <span style={{ color: entry.color }}>False:</span>
                  <span className="text-primary font-medium">
                    {tooltipValueFormatter(entry.value)}
                  </span>
                </div>
              )
            ))}
            
            {/* Show the True value too even though it's not directly displayed */}
            {payload.some(p => p.dataKey === 'valueAvg') && payload[0].payload.valueTrue !== null && (
              <div className="flex justify-between gap-2">
                <span style={{ color: '#2BB7D2' }}>True:</span>
                <span className="text-primary font-medium">
                  {tooltipValueFormatter(payload[0].payload.valueTrue || 0)}
                </span>
              </div>
            )}
          </div>
        )}
        
        {/* If we're showing the original value */}
        {!showTrue && !showFalse && validPayloads.length > 0 && (
          <p className="text-primary">
            {metricType === 'evaluations' 
              ? `Evaluations: ${validPayloads[0].value}` 
              : tooltipValueFormatter(validPayloads[0].value)}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
