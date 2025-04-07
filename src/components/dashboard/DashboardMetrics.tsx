
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
  selectedTimestamps
}) => {
  const [isBreakdownEnabled, setIsBreakdownEnabled] = useState(false);
  const [hoveredTimestamp, setHoveredTimestamp] = useState<string | null>(null);
  
  const handleBreakdownToggle = (enabled: boolean) => {
    setIsBreakdownEnabled(enabled);
  };
  
  const handleHoverTimestamp = (timestamp: string | null) => {
    setHoveredTimestamp(timestamp);
  };
  
  return (
    <div className={cn(
      "grid gap-4",
      isBreakdownEnabled
        ? "grid-cols-3"
        : "grid-cols-1 md:grid-cols-3"
    )}>
      {selectedMetrics.includes('evaluations') && (
        <MetricCard 
          title="Evaluations" 
          value={currentMetrics.evaluations.value}
          change={currentMetrics.evaluations.change}
          info="Total evaluations for the selected time period"
          className={cn(
            "animate-slide-up [animation-delay:100ms]",
            isBreakdownEnabled && "col-span-2"
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
          onHoverTimestamp={handleHoverTimestamp}
        />
      )}
      
      {isBreakdownEnabled ? (
        <div className="flex flex-col gap-4">
          <FlagChangeImpact
            chartData={filteredConversionData}
            className="flex-1 animate-slide-up [animation-delay:200ms]"
            selectedTimestamp={selectedTimestamp}
            selectedTimestamps={selectedTimestamps}
            timeframe={timeframe}
          />
        </div>
      ) : (
        <>
          <FlagChangeImpact
            chartData={filteredConversionData}
            className="animate-slide-up [animation-delay:200ms]"
            selectedTimestamp={selectedTimestamp}
            selectedTimestamps={selectedTimestamps}
            timeframe={timeframe}
          />
          
          {/* Removed the error rate card as per the request */}
        </>
      )}
    </div>
  );
};

export default DashboardMetrics;
