
import React from 'react';
import MetricCard from '@/components/metric/MetricCard';
import { DataPoint, VersionChange } from '@/components/BarChart';
import { cn } from '@/lib/utils';

interface EvaluationsCardProps {
  value: number;
  change: { value: number; trend: 'up' | 'down' };
  chartData: DataPoint[];
  versionChanges: VersionChange[];
  showTrue: boolean;
  showFalse: boolean;
  timeframe: string;
  selectedTimestamp?: Date | null;
  selectedTimestamps?: Date[] | null;
  isBreakdownEnabled: boolean;
  onBreakdownToggle: (enabled: boolean) => void;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
  onToggleTrue?: () => void;
  onToggleFalse?: () => void;
}

const EvaluationsCard: React.FC<EvaluationsCardProps> = ({
  value,
  change,
  chartData,
  versionChanges,
  showTrue,
  showFalse,
  timeframe,
  selectedTimestamp,
  selectedTimestamps,
  isBreakdownEnabled,
  onBreakdownToggle,
  hoveredTimestamp,
  onHoverTimestamp,
  onToggleTrue,
  onToggleFalse
}) => {
  return (
    <MetricCard 
      title="Evaluations" 
      value={value}
      change={change}
      info="Total evaluations for the selected time period"
      className={cn(
        "animate-slide-up [animation-delay:100ms]",
        isBreakdownEnabled ? "col-span-2" : ""
      )}
      chartData={chartData}
      versionChanges={versionChanges.filter(change => 
        change.position < chartData.length
      )}
      metricType="evaluations"
      timeframe={timeframe}
      selectedTimestamp={selectedTimestamp}
      selectedTimestamps={selectedTimestamps}
      onBreakdownToggle={onBreakdownToggle}
      hoveredTimestamp={hoveredTimestamp}
      onHoverTimestamp={onHoverTimestamp}
      onToggleTrue={onToggleTrue}
      onToggleFalse={onToggleFalse}
      showTrue={showTrue}
      showFalse={showFalse}
      chartType="stacked"
    />
  );
};

export default EvaluationsCard;
