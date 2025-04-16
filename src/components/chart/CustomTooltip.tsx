
import React from 'react';
import { Card } from '@/components/ui/card';
import { ChartAnnotation } from '@/data/annotationData';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  tooltipValueFormatter?: (value: number) => string;
  tooltipLabelFormatter?: (label: string) => string;
  showTrue?: boolean;
  showFalse?: boolean;
  chartType?: 'stacked' | 'mixed';
  metricType?: 'evaluations' | 'conversion' | 'errorRate';
  showAverage?: boolean;
  title?: string;
  activeAnnotation?: ChartAnnotation | null;
  isImpactChart?: boolean; // Add this prop to support the ChartArea component
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  tooltipValueFormatter = (value) => `${value}`,
  tooltipLabelFormatter = (label) => label,
  showTrue = false,
  showFalse = false,
  chartType,
  metricType,
  showAverage = false,
  title,
  activeAnnotation,
  isImpactChart = false // Default to false
}) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const formattedLabel = tooltipLabelFormatter(label || '');
  const hasAnnotation = activeAnnotation !== null && activeAnnotation !== undefined;

  return (
    <Card className="p-2 max-w-[280px] shadow-md bg-white">
      <div className="text-sm font-medium mb-1">{title ? `${title} - ${formattedLabel}` : formattedLabel}</div>
      
      {/* Annotation display */}
      {hasAnnotation && (
        <div className="mb-2 border-b pb-2">
          <div className="flex items-center gap-1.5 mb-1">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: activeAnnotation.color || '#6366F1' }}
            ></div>
            <span className="font-medium text-sm">{activeAnnotation.label}</span>
          </div>
          <p className="text-xs text-gray-600">{activeAnnotation.description}</p>
        </div>
      )}
      
      <div className="space-y-1">
        {payload.map((entry, index) => {
          // Skip false values if they're not to be shown
          if (!showFalse && entry.dataKey === 'valueFalse') return null;
          // Skip true values if they're not to be shown  
          if (!showTrue && entry.dataKey === 'valueTrue') return null;
          
          // Determine the name based on the dataKey
          let name = entry.name;
          if (!name) {
            if (entry.dataKey === 'valueTrue') name = 'True';
            else if (entry.dataKey === 'valueFalse') name = 'False';
            else if (entry.dataKey === 'valueAvg') name = 'Average';
            else name = 'Value';
          }
          
          const value = entry.value !== undefined && entry.value !== null 
            ? tooltipValueFormatter(entry.value) 
            : 'N/A';
          
          return (
            <div key={`tooltip-item-${index}`} className="flex justify-between">
              <div className="flex items-center gap-1.5">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-xs">{name}</span>
              </div>
              <span className="font-medium text-xs">{value}</span>
            </div>
          );
        })}
        
        {showAverage && payload[0]?.payload?.valueAvg !== undefined && (
          <div className="flex justify-between border-t pt-1 mt-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span className="text-xs">Average</span>
            </div>
            <span className="font-medium text-xs">
              {tooltipValueFormatter(payload[0].payload.valueAvg)}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CustomTooltip;
