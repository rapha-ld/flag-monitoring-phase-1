
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
  hoveredTimestamp = null,
}: FlagChangeImpactProps) => {
  // Process data to add the flag impact line (simulated data)
  const processedData = chartData.map((data, index) => {
    const randomVariation = Math.random() * 0.8 + 0.6; // Random between 0.6 and 1.4
    const flagImpact = data.value * randomVariation;
    
    return {
      ...data,
      flag: flagImpact
    };
  });

  return (
    <div className={cn("bg-white p-4 rounded-lg shadow-sm border", className)}>
      <div className="mb-2">
        <h3 className="font-medium text-sm">Flag Change Impact</h3>
        <p className="text-xs text-textSecondary">How this flag affects conversion rate</p>
      </div>
      
      <CustomLegend />
      
      <ChartArea 
        chartData={processedData}
        selectedTimestamp={selectedTimestamp}
        selectedTimestamps={selectedTimestamps}
        timeframe={timeframe}
        hoveredTimestamp={hoveredTimestamp || null}
      />
    </div>
  );
};

export default FlagChangeImpact;
