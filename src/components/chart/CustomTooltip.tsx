
import React from 'react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<any>;
  label?: string;
  tooltipLabelFormatter: (label: string) => string;
  tooltipValueFormatter: (value: number) => string;
}

const CustomTooltip = ({ 
  active, 
  payload, 
  label, 
  tooltipLabelFormatter, 
  tooltipValueFormatter 
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border shadow-md rounded-md p-2 text-xs">
        <p className="font-medium">{tooltipLabelFormatter(label || '')}</p>
        <p className="text-primary">
          {tooltipValueFormatter(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
