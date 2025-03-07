
import React from 'react';
import { cn } from '@/lib/utils';
import BarChartContent from './chart/BarChartContent';
import EmptyState from './chart/EmptyState';

export interface DataPoint {
  name: string;
  value: number;
  valueTrue?: number;
  valueFalse?: number;
  date?: string;
  device?: string;
}

export interface VersionChange {
  date: string;
  position: number; // Index position in the data array
  version: string;
  details?: string;
}

interface BarChartProps {
  data: DataPoint[];
  versionChanges?: VersionChange[];
  barColor?: string;
  height?: number | string;
  className?: string;
  valueFormatter?: (value: number) => string;
  tooltipValueFormatter?: (value: number) => string;
  tooltipLabelFormatter?: (label: string) => string;
  showTrue?: boolean;
  showFalse?: boolean;
}

const BarChart = ({
  data,
  versionChanges = [],
  barColor = "#6E6F96",
  height = 200,
  className,
  valueFormatter = (value) => value.toString(),
  tooltipValueFormatter = (value) => value.toString(),
  tooltipLabelFormatter = (label) => label,
  showTrue = true,
  showFalse = false,
}: BarChartProps) => {
  // Make sure we have data to display
  if (data.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className={cn("w-full h-full chart-container", className)}>
      <BarChartContent
        data={data}
        versionChanges={versionChanges}
        barColor={barColor}
        height={height}
        valueFormatter={valueFormatter}
        tooltipValueFormatter={tooltipValueFormatter}
        tooltipLabelFormatter={tooltipLabelFormatter}
        showTrue={showTrue}
        showFalse={showFalse}
      />
    </div>
  );
};

export default BarChart;
