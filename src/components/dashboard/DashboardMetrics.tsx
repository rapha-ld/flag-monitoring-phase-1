import React, { useState } from 'react';
import MetricCard from '@/components/metric/MetricCard';
import { DataPoint, VersionChange } from '@/components/BarChart';
import { cn } from '@/lib/utils';
import FlagChangeImpact from './FlagChangeImpact';

interface DashboardMetricsProps {
  selectedMetrics: string[];
  currentMetrics: {
    evaluations: { value: number, change: { value: number, trend: 'up' | 'down' } },
    conversion: { value: number, change: { value: number, trend: 'up' | 'down' } },
    errorRate: { value: number, change: { value: number, trend: 'up' | 'down' } }
  };
  filteredEvaluationData: DataPoint[];
  filteredConversionData: DataPoint[];
  filteredErrorRateData: DataPoint[];
  evaluationVersionChanges: VersionChange[];
  conversionVersionChanges: VersionChange[];
  errorRateVersionChanges: VersionChange[];
  showTrue: boolean;
  showFalse: boolean;
  timeframe: string;
  selectedTimestamp?: Date | null;
  selectedTimestamps?: Date[] | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
  onToggleTrue?: () => void;
  onToggleFalse?: () => void;
  hoveredTimestamp?: string | null;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  selectedMetrics,
  currentMetrics,
  filteredEvaluationData,
  filteredConversionData,
  filteredErrorRateData,
  evaluationVersionChanges,
  conversionVersionChanges,
  errorRateVersionChanges,
  showTrue,
  showFalse,
  timeframe,
  selectedTimestamp,
  selectedTimestamps,
  onHoverTimestamp,
  onToggleTrue,
  onToggleFalse,
  hoveredTimestamp
}) => {
  const [isBreakdownEnabled, setIsBreakdownEnabled] = useState(false);
  
  const handleBreakdownToggle = (enabled: boolean) => {
    setIsBreakdownEnabled(enabled);
  };
  
  return (
    <div className={cn(
      "grid gap-4",
      isBreakdownEnabled
        ? "grid-cols-3"
        : "grid-cols-2"
    )}>
      {selectedMetrics.includes('evaluations') && (
        <MetricCard 
          title="Evaluations" 
          value={currentMetrics.evaluations.value}
          change={currentMetrics.evaluations.change}
          info="Total evaluations for the selected time period"
          className={cn(
            "animate-slide-up [animation-delay:100ms]",
            isBreakdownEnabled ? "col-span-2" : ""
          )}
          chartData={filteredEvaluationData}
          versionChanges={evaluationVersionChanges.filter(change => 
            change.position < filteredEvaluationData.length
          )}
          valueFormatter={(value) => `${value}`}
          tooltipValueFormatter={(value) => `${value}`}
          barColor="#6E6F96"
          showTrue={showTrue}
          showFalse={showFalse}
          chartType="stacked"
          metricType="evaluations"
          timeframe={timeframe}
          selectedTimestamp={selectedTimestamp}
          selectedTimestamps={selectedTimestamps}
          onBreakdownToggle={handleBreakdownToggle}
          hoveredTimestamp={hoveredTimestamp}
          onHoverTimestamp={onHoverTimestamp}
          onToggleTrue={onToggleTrue}
          onToggleFalse={onToggleFalse}
        />
      )}
      
      <FlagChangeImpact
        chartData={filteredConversionData}
        className={cn(
          "animate-slide-up [animation-delay:200ms]",
          isBreakdownEnabled ? "h-[522px]" : ""
        )}
        selectedTimestamp={selectedTimestamp}
        selectedTimestamps={selectedTimestamps}
        timeframe={timeframe}
        hoveredTimestamp={hoveredTimestamp}
      />
    </div>
  );
};

export default DashboardMetrics;
