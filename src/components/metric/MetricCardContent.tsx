
import React from 'react';
import BarChart from '../BarChart';
import { DataPoint, VersionChange } from '../BarChart';
import ChartBreakdown from './ChartBreakdown';

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
  selectedTimestamp?: Date | null;
  selectedTimestamps?: Date[] | null;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
  children?: React.ReactNode;
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
  selectedTimestamp,
  selectedTimestamps,
  hoveredTimestamp,
  onHoverTimestamp,
  children
}) => {
  const handleHoverTimestamp = (timestamp: string | null) => {
    if (onHoverTimestamp) {
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
      />
    );
  }
  
  if (chartData && chartData.length > 0) {
    return (
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
        selectedTimestamp={selectedTimestamp}
        selectedTimestamps={selectedTimestamps}
        hoveredTimestamp={hoveredTimestamp}
        onHoverTimestamp={handleHoverTimestamp}
      />
    );
  }
  
  return <>{children}</>;
};

export default MetricCardContent;
