
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import MetricCardHeader from './MetricCardHeader';
import MetricCardContent from './MetricCardContent';
import MetricCardControls from './MetricCardControls';
import { DataPoint, VersionChange } from '../BarChart';
import { AnnotationData } from '../chart/ChartAnnotation';

interface MetricCardProps {
  title: string;
  value: number;
  change: {
    value: number;
    trend: 'up' | 'down';
  };
  info?: string;
  className?: string;
  chartData?: DataPoint[];
  versionChanges?: VersionChange[];
  barColor?: string;
  valueFormatter?: (value: number) => string;
  tooltipValueFormatter?: (value: number) => string;
  tooltipLabelFormatter?: (label: string) => string;
  showTrue?: boolean;
  showFalse?: boolean;
  chartType?: 'stacked' | 'mixed';
  metricType?: 'evaluations' | 'conversion' | 'errorRate';
  timeframe?: string;
  selectedTimestamp?: Date | null;
  selectedTimestamps?: Date[] | null;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
  onBreakdownToggle?: (enabled: boolean) => void;
  onToggleTrue?: () => void;
  onToggleFalse?: () => void;
  annotations?: AnnotationData[];
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  info,
  className,
  chartData,
  versionChanges,
  barColor,
  valueFormatter,
  tooltipValueFormatter,
  tooltipLabelFormatter,
  showTrue = false,
  showFalse = false,
  chartType,
  metricType,
  timeframe,
  selectedTimestamp,
  selectedTimestamps,
  hoveredTimestamp,
  onHoverTimestamp,
  onBreakdownToggle,
  onToggleTrue,
  onToggleFalse,
  annotations
}) => {
  const [breakdownEnabled, setBreakdownEnabled] = useState(false);
  const [breakdownType, setBreakdownType] = useState<'application' | 'sdk'>('application');
  
  const handleBreakdownToggle = (enabled: boolean) => {
    setBreakdownEnabled(enabled);
    if (onBreakdownToggle) {
      onBreakdownToggle(enabled);
    }
  };
  
  const handleBreakdownTypeChange = (type: 'application' | 'sdk') => {
    setBreakdownType(type);
  };
  
  return (
    <Card className={cn("overflow-hidden shadow-sm", className)}>
      <CardHeader className="px-4 py-3 border-b border-border flex flex-col gap-1">
        <MetricCardHeader 
          title={title} 
          value={value} 
          change={change} 
          info={info}
        />
        <MetricCardControls 
          breakdownEnabled={breakdownEnabled}
          onBreakdownToggle={handleBreakdownToggle}
          breakdownType={breakdownType}
          onBreakdownTypeChange={handleBreakdownTypeChange}
          showTrue={showTrue}
          showFalse={showFalse}
          onToggleTrue={onToggleTrue}
          onToggleFalse={onToggleFalse}
          metricType={metricType}
        />
      </CardHeader>
      <CardContent className="p-0">
        <MetricCardContent 
          breakdownEnabled={breakdownEnabled}
          breakdownType={breakdownType}
          chartData={chartData}
          versionChanges={versionChanges}
          barColor={barColor}
          valueFormatter={valueFormatter}
          tooltipValueFormatter={tooltipValueFormatter}
          tooltipLabelFormatter={tooltipLabelFormatter}
          showTrue={showTrue}
          showFalse={showFalse}
          chartType={chartType}
          metricType={metricType}
          timeframe={timeframe}
          selectedTimestamp={selectedTimestamp}
          selectedTimestamps={selectedTimestamps}
          hoveredTimestamp={hoveredTimestamp}
          onHoverTimestamp={onHoverTimestamp}
          title={title}
          annotations={annotations}
        />
      </CardContent>
    </Card>
  );
};

export default MetricCard;
