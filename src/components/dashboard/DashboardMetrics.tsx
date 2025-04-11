
import React, { useState } from 'react';
import { DataPoint, VersionChange } from '@/components/BarChart';
import { cn } from '@/lib/utils';
import EvaluationsCard from './cards/EvaluationsCard';
import ImpactCard from './cards/ImpactCard';

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
    <div className="space-y-4">
      <h2 className="text-base font-medium text-gray-800 px-1">Flag-specific Metrics</h2>
      <div className={cn(
        "grid gap-4",
        isBreakdownEnabled
          ? "grid-cols-3"
          : "grid-cols-2"
      )}>
        {selectedMetrics.includes('evaluations') && (
          <EvaluationsCard
            value={currentMetrics.evaluations.value}
            change={currentMetrics.evaluations.change}
            chartData={filteredEvaluationData}
            versionChanges={evaluationVersionChanges}
            showTrue={showTrue}
            showFalse={showFalse}
            timeframe={timeframe}
            selectedTimestamp={selectedTimestamp}
            selectedTimestamps={selectedTimestamps}
            isBreakdownEnabled={isBreakdownEnabled}
            onBreakdownToggle={handleBreakdownToggle}
            hoveredTimestamp={hoveredTimestamp}
            onHoverTimestamp={onHoverTimestamp}
            onToggleTrue={onToggleTrue}
            onToggleFalse={onToggleFalse}
          />
        )}
        
        <ImpactCard
          chartData={filteredConversionData}
          isBreakdownEnabled={isBreakdownEnabled}
          selectedTimestamp={selectedTimestamp}
          selectedTimestamps={selectedTimestamps}
          timeframe={timeframe}
          hoveredTimestamp={hoveredTimestamp}
        />
      </div>
    </div>
  );
};

export default DashboardMetrics;
