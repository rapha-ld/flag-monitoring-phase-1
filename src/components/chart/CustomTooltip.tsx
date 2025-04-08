
import React from 'react';
import { cn } from "@/lib/utils";
import { Popover, PopoverContent } from "@/components/ui/popover";

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
  isTelemetryChart?: boolean;
  isImpactChart?: boolean;
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
  showAverage,
  isTelemetryChart = false,
  isImpactChart = false
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    // For the flag impact chart, we want to show both series
    if (isImpactChart) {
      const allFlagsValue = payload.find(p => p.dataKey === 'value')?.value || 0;
      const thisFlagValue = payload.find(p => p.dataKey === 'flag')?.value || 0;
      
      return (
        <div className="bg-white border border-gray-200 shadow-md rounded-md p-3 text-xs z-[100]">
          <p className="font-medium text-sm mb-2">{tooltipLabelFormatter(label || '')}</p>
          <div className="space-y-2 mt-1">
            {/* All Flags value */}
            <div className="flex justify-between gap-2 items-center">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#A9AFB4]" />
                <span className="text-gray-700">All flags:</span>
              </div>
              <span className="text-gray-900 font-medium">
                {tooltipValueFormatter(allFlagsValue)}
              </span>
            </div>
            
            {/* This Flag value - only show if greater than 0 */}
            {thisFlagValue > 0 && (
              <div className="flex justify-between gap-2 items-center">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#7861C6]" />
                  <span className="text-gray-700">This flag:</span>
                </div>
                <span className="text-gray-900 font-medium">
                  {tooltipValueFormatter(thisFlagValue)}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // Original tooltip for other chart types
    return (
      <div className="bg-white border border-gray-200 shadow-md rounded-md p-3 text-xs z-[100]">
        <p className="font-medium text-sm mb-2">{tooltipLabelFormatter(label || '')}</p>
        
        {/* For stacked or mixed charts when showing true/false values */}
        {(showTrue || showFalse) && !showAverage && (
          <div className="space-y-2 mt-1">
            {payload.map((entry, index) => (
              <div key={`tooltip-${index}`} className="flex justify-between gap-2 items-center">
                <div className="flex items-center gap-1.5">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-gray-700">{entry.name}:</span>
                </div>
                <span className="text-gray-900 font-medium">
                  {tooltipValueFormatter(entry.value)}
                </span>
              </div>
            ))}
          </div>
        )}
        
        {/* For average values (when both true/false are selected) */}
        {showAverage && (
          <div className="space-y-2 mt-1">
            {/* Show the True value first */}
            <div className="flex justify-between gap-2 items-center">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#2BB7D2]" />
                <span className="text-gray-700">True:</span>
              </div>
              <span className="text-gray-900 font-medium">
                {tooltipValueFormatter(payload[0].payload.valueTrue || 0)}
              </span>
            </div>
            
            {/* Show the False value */}
            <div className="flex justify-between gap-2 items-center">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FFD099]" />
                <span className="text-gray-700">False:</span>
              </div>
              <span className="text-gray-900 font-medium">
                {tooltipValueFormatter(payload.find(p => p.dataKey === 'valueFalse')?.value || 0)}
              </span>
            </div>
          </div>
        )}
        
        {/* If we're showing the original value - simplified for telemetry charts */}
        {!showTrue && !showFalse && (
          <div className="mt-1">
            {isTelemetryChart ? (
              <p className="text-gray-900 font-medium text-center">
                {tooltipValueFormatter(payload[0].value)}
              </p>
            ) : (
              <div className="flex justify-between gap-2 items-center">
                <div className="flex items-center gap-1.5">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: payload[0].color }}
                  />
                  <span className="text-gray-700">Value:</span>
                </div>
                <p className="text-gray-900 font-medium">
                  {tooltipValueFormatter(payload[0].value)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
