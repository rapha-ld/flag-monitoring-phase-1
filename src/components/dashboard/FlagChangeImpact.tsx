
import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { DataPoint } from '@/components/BarChart';
import ChartArea from './impact/ChartArea';
import CustomLegend from './impact/CustomLegend';
import { historyData } from '@/components/history/historyEventData';

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
  // Extract all event dates from history data to use for flag impact
  const eventDates = useMemo(() => {
    return historyData.map(event => {
      // Format date to match our chart data format (just the date part)
      return event.timestamp.toISOString().split('T')[0];
    });
  }, []);

  // Process data to create the flag impact line with a distinct pattern
  // Using useMemo to ensure data doesn't change on hover
  const processedData = useMemo(() => {
    return chartData.map((data, index) => {
      // Generate values for "All flags" metric (up to 80)
      const scaledValue = Math.min(data.value * (80 / 4), 80); // Scale up the original value to fit in 0-80 range, cap at 80
      
      // Check if this data point corresponds to a date that has an event in history
      const dataDate = data.date ? new Date(data.date) : new Date(data.name);
      const dataDateStr = dataDate.toISOString().split('T')[0];
      const hasEventOnDate = eventDates.includes(dataDateStr);
      
      // "This flag" will only have values above 0 for dates with events
      // And those values will always be lower than the "All flags" data
      let flagImpact = 0;
      
      if (hasEventOnDate) {
        // Create value that's always lower than the scaledValue
        flagImpact = Math.max(5, scaledValue * (0.25 + Math.random() * 0.3)); // Between 25-55% of the main value, minimum 5
      }
      
      return {
        ...data,
        value: scaledValue,
        flag: flagImpact
      };
    });
  }, [chartData, eventDates]); // Only recompute when chartData or eventDates change, not on hover

  return (
    <div className={cn("bg-white p-4 rounded-lg shadow-sm border border-gray-200", className)}>
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
