import React from 'react';
import { cn } from '@/lib/utils';
import { DataPoint } from '@/components/BarChart';
import ChartArea from './impact/ChartArea';
import CustomLegend from './impact/CustomLegend';

interface FlagChangeImpactProps {
  chartData: DataPoint[];
  className?: string;
  selectedTimestamp?: Date | null;
  selectedTimestamps?: Date[] | null;
  timeframe: string;
  hoveredTimestamp?: string | null;
}

const FlagChangeImpact = ({
  chartData,
  className,
  selectedTimestamp,
  selectedTimestamps,
  timeframe,
  hoveredTimestamp
}: FlagChangeImpactProps) => {
  // Process data to create the flag impact line (much lower than the area chart)
  const processedData = chartData.map((data, index) => {
    // Generate values for "All flags" metric (up to 80)
    const scaledValue = data.value * (80 / 4); // Scale up the original value to fit in 0-80 range
    
    // Generate lower values for "This flag" with some points at 0
    let flagImpact = 0;
    if (index % 7 === 0) {
      // Every 7th point will be 0
      flagImpact = 0;
    } else {
      // Otherwise, make it lower than the main value
      const ratio = Math.random() * 0.4 + 0.2; // Random between 0.2 and 0.6
      flagImpact = scaledValue * ratio;
    }
    
    return {
      ...data,
      value: scaledValue,
      flag: flagImpact
    };
  });

  return (
    <div className={cn("bg-white p-4 rounded-lg shadow-sm border", className)}>
      <div className="mb-2">
        <h3 className="font-medium text-sm">Flag Change Impact</h3>
      </div>
      
      <ChartArea 
        chartData={processedData} 
        selectedTimestamp={selectedTimestamp} 
        selectedTimestamps={selectedTimestamps} 
        timeframe={timeframe} 
        hoveredTimestamp={hoveredTimestamp} 
      />
      
      <CustomLegend />
    </div>
  );
};

export default FlagChangeImpact;
