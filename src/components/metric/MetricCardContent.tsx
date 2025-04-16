
import React, { useEffect } from 'react';
import BarChart from '../BarChart';
import { DataPoint, VersionChange } from '../BarChart';
import ChartBreakdown from './ChartBreakdown';
import { cn } from '@/lib/utils';
import { AnnotationData } from '../chart/ChartAnnotation';

interface MetricCardContentProps {
  breakdownEnabled: boolean;
  breakdownType: 'application' | 'sdk';
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
  children?: React.ReactNode;
  containerClassName?: string;
  title?: string;
  annotations?: AnnotationData[];
}

const MetricCardContent: React.FC<MetricCardContentProps> = ({
  breakdownEnabled,
  breakdownType,
  chartData,
  versionChanges,
  barColor = "#6E6F96",
  valueFormatter,
  tooltipValueFormatter,
  tooltipLabelFormatter,
  showTrue,
  showFalse,
  chartType = 'stacked',
  metricType,
  timeframe,
  selectedTimestamp,
  selectedTimestamps,
  hoveredTimestamp,
  onHoverTimestamp,
  children,
  containerClassName,
  title,
  annotations
}) => {
  // Debug logging for hover events
  useEffect(() => {
    if (hoveredTimestamp) {
      console.log(`MetricCardContent has hoveredTimestamp: ${hoveredTimestamp}`);
    }
  }, [hoveredTimestamp]);

  // Make sure to properly relay the hover timestamp event to parent components
  const handleHoverTimestamp = (timestamp: string | null) => {
    if (onHoverTimestamp) {
      console.log(`MetricCardContent forwarding hover: ${timestamp}`);
      onHoverTimestamp(timestamp);
    }
  };

  if (breakdownEnabled) {
    return (
      <ChartBreakdown 
        type={breakdownType} 
        chartData={chartData}
        showTrue={showTrue}
        showFalse={showFalse}
        selectedTimestamp={selectedTimestamp}
        selectedTimestamps={selectedTimestamps}
        hoveredTimestamp={hoveredTimestamp}
        onHoverTimestamp={handleHoverTimestamp}
        timeframe={timeframe}
      />
    );
  }
  
  if (chartData && chartData.length > 0) {
    return (
      <div className={cn("w-full -mx-4 px-0", containerClassName)}>
        <BarChart
          data={chartData}
          versionChanges={versionChanges}
          barColor={barColor}
          height={160}
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
          onHoverTimestamp={handleHoverTimestamp}
          annotations={annotations}
        />
      </div>
    );
  }
  
  return <>{children}</>;
};

export default MetricCardContent;
