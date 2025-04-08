
import React from 'react';
import { DataPoint } from '@/components/BarChart';
import FlagChangeImpact from '../FlagChangeImpact';
import { cn } from '@/lib/utils';

interface ImpactCardProps {
  chartData: DataPoint[];
  isBreakdownEnabled: boolean;
  selectedTimestamp?: Date | null;
  selectedTimestamps?: Date[] | null;
  timeframe: string;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
}

const ImpactCard: React.FC<ImpactCardProps> = ({
  chartData,
  isBreakdownEnabled,
  selectedTimestamp,
  selectedTimestamps,
  timeframe,
  hoveredTimestamp,
  onHoverTimestamp
}) => {
  return (
    <FlagChangeImpact
      chartData={chartData}
      className={cn(
        "animate-slide-up [animation-delay:200ms]",
        isBreakdownEnabled ? "h-[522px]" : ""
      )}
      selectedTimestamp={selectedTimestamp}
      selectedTimestamps={selectedTimestamps}
      timeframe={timeframe}
      hoveredTimestamp={hoveredTimestamp}
      onHoverTimestamp={onHoverTimestamp}
    />
  );
};

export default ImpactCard;
