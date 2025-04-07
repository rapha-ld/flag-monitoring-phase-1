
import React, { useMemo } from 'react';
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
  // Process data to create the flag impact line with a distinct pattern
  // Using useMemo to ensure data doesn't change on hover
  const processedData = useMemo(() => {
    return chartData.map((data, index) => {
      // Generate values for "All flags" metric (up to 80)
      const scaledValue = data.value * (80 / 4); // Scale up the original value to fit in 0-80 range
      
      // Generate a distinct pattern for "This flag" that doesn't follow "All flags" shape
      let flagImpact = 0;
      
      // Create a wave-like pattern that's independent of the main chart shape
      if (index % 10 === 0 || index % 10 === 9) {
        // Valleys - near zero
        flagImpact = Math.random() * 5;
      } else if (index % 10 === 4 || index % 10 === 5) {
        // Peaks - higher but still below the main values
        flagImpact = 20 + Math.random() * 15;
      } else if (index % 10 === 2 || index % 10 === 7) {
        // Mid-range values
        flagImpact = 10 + Math.random() * 10;
      } else {
        // Transition values
        flagImpact = 5 + Math.random() * 15;
      }
      
      return {
        ...data,
        value: scaledValue,
        flag: flagImpact
      };
    });
  }, [chartData]); // Only recompute when chartData changes, not on hover

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
