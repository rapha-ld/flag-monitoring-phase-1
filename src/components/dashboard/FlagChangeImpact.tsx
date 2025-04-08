
import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { DataPoint } from '@/components/BarChart';
import ChartArea from './impact/ChartArea';
import CustomLegend from './impact/CustomLegend';
import { historyData } from '@/components/history/historyEventData';
import ImpactLevelSelector, { ImpactLevel } from './impact/ImpactLevelSelector';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FlagChangeImpactProps {
  chartData: DataPoint[];
  className?: string;
  selectedTimestamp?: Date | null;
  selectedTimestamps?: Date[] | null;
  timeframe: string;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
}

const FlagChangeImpact = ({
  chartData,
  className,
  selectedTimestamp,
  selectedTimestamps,
  timeframe,
  hoveredTimestamp,
  onHoverTimestamp
}: FlagChangeImpactProps) => {
  // State for impact level selection (default to all levels selected)
  const [selectedImpactLevels, setSelectedImpactLevels] = useState<ImpactLevel[]>(['high', 'medium', 'low']);

  // Extract all event dates from history data to use for flag impact
  const eventDates = useMemo(() => {
    return historyData.map(event => {
      // Format date to match our chart data format (just the date part)
      return event.timestamp.toISOString().split('T')[0];
    });
  }, []);

  // Get impact multiplier based on selected levels
  const getImpactMultiplier = useMemo(() => {
    let multiplier = 0;
    
    if (selectedImpactLevels.includes('high')) multiplier += 1;
    if (selectedImpactLevels.includes('medium')) multiplier += 0.6;
    if (selectedImpactLevels.includes('low')) multiplier += 0.3;
    
    // Normalize to ensure we don't exceed original scale when all are selected
    return multiplier / (selectedImpactLevels.length ? selectedImpactLevels.length : 1);
  }, [selectedImpactLevels]);

  // Process data to create the flag impact line with a distinct pattern
  // Using useMemo to ensure data doesn't change on hover
  const processedData = useMemo(() => {
    return chartData.map((data, index) => {
      // Apply impact multiplier to scale the values based on selected impact levels
      const scaledValue = Math.min(data.value * (80 / 4) * getImpactMultiplier, 80);
      
      // Handle different timeframes
      let hasEventOnDate = false;
      
      if (timeframe === "1h") {
        // For 1h view, simulate events at specific minutes
        const minuteStr = data.name?.replace('m', '') || "0";
        const minute = parseInt(minuteStr);
        // Add events at minutes 10, 25, 40, and 55
        hasEventOnDate = [10, 25, 40, 55].includes(minute);
      } else if (timeframe === "1d") {
        // For 1d view, simulate events at specific hours
        const hourStr = data.name?.split(":")[0] || "0";
        const hour = parseInt(hourStr);
        // Add events at 8:00, 12:00 and 16:00
        hasEventOnDate = [8, 12, 16].includes(hour);
      } else {
        // For other timeframes, check history data as before
        const dataDate = data.date ? new Date(data.date) : new Date(data.name);
        const dataDateStr = dataDate.toISOString().split('T')[0];
        hasEventOnDate = eventDates.includes(dataDateStr);
      }
      
      // "This flag" will only have values above 0 for dates with events
      // And those values will always be lower than the "All flags" data
      let flagImpact = 0;
      
      if (hasEventOnDate) {
        // Create value that's always lower than the scaledValue
        flagImpact = Math.max(5, scaledValue * (0.25 + Math.random() * 0.3) * getImpactMultiplier);
      }
      
      return {
        ...data,
        value: scaledValue,
        flag: flagImpact
      };
    });
  }, [chartData, eventDates, getImpactMultiplier, timeframe]);

  // Handle hover events from the chart
  const handleChartHover = (timestamp: string | null) => {
    if (onHoverTimestamp) {
      onHoverTimestamp(timestamp);
    }
  };

  return (
    <div className={cn("bg-white p-4 rounded-lg shadow-sm border border-gray-200", className)}>
      <div className="mb-2 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <h3 className="font-medium text-sm">Flag Change Impact</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3.5 w-3.5 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Number of flag changes</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <ImpactLevelSelector 
          selectedLevels={selectedImpactLevels} 
          onLevelChange={setSelectedImpactLevels} 
        />
      </div>
      
      <ChartArea 
        chartData={processedData} 
        selectedTimestamp={selectedTimestamp} 
        selectedTimestamps={selectedTimestamps} 
        timeframe={timeframe} 
        hoveredTimestamp={hoveredTimestamp}
        onHoverTimestamp={handleChartHover} 
      />
      
      <CustomLegend />
    </div>
  );
};

export default FlagChangeImpact;
