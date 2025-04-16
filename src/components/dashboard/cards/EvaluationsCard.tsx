
import React from 'react';
import MetricCard from '@/components/metric/MetricCard';
import { DataPoint, VersionChange } from '@/components/BarChart';
import { cn } from '@/lib/utils';
import { AnnotationData } from '@/components/chart/ChartAnnotation';
import { evaluationAnnotations } from '@/utils/annotationData';

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
  annotations?: AnnotationData[];
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
  onToggleFalse,
  annotations = evaluationAnnotations
}) => {
  return (
    <MetricCard 
      title="Evaluations" 
      value={value}
      change={change}
      info="Total evaluations for the selected time period"
      className="animate-slide-up [animation-delay:100ms] w-full"
      chartData={chartData}
      versionChanges={versionChanges.filter(change => 
        change.position < chartData.length
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
      onBreakdownToggle={onBreakdownToggle}
      hoveredTimestamp={hoveredTimestamp}
      onHoverTimestamp={onHoverTimestamp}
      onToggleTrue={onToggleTrue}
      onToggleFalse={onToggleFalse}
      annotations={annotations}
    />
  );
};

export default EvaluationsCard;
