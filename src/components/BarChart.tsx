
import React, { useState } from 'react';
import {
  BarChart as RechartsBarChart,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import CustomTooltip from './chart/CustomTooltip';
import ChartAxes from './chart/ChartAxes';
import ChartBars from './chart/ChartBars';
import ChartVersionMarkers from './chart/ChartVersionMarkers';
import { calculateYAxisDomain } from '@/utils/chartUtils';

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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Include all data points, even those with 0 values
  const filteredData = data || [];

  const handleMouseOver = (data: any, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  // Make sure we have data to display
  if (!filteredData || filteredData.length === 0) {
    return <div className="flex items-center justify-center h-full">No data available</div>;
  }

  const yAxisDomain = calculateYAxisDomain(filteredData, showTrue, showFalse);

  // Process version changes
  const updatedVersionChanges = versionChanges.filter(change => change.position < filteredData.length);

  return (
    <div className={cn("w-full h-full chart-container", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={filteredData}
          margin={{ top: 30, right: 16, left: 0, bottom: 24 }}
          barSize={filteredData.length > 60 ? 2 : filteredData.length > 30 ? 4 : filteredData.length > 14 ? 8 : 24}
          barGap={2}
          onMouseLeave={handleMouseLeave}
        >
          <ChartAxes 
            filteredData={filteredData}
            valueFormatter={valueFormatter}
            yAxisDomain={yAxisDomain}
          />
          
          <Tooltip 
            content={(props) => (
              <CustomTooltip 
                {...props} 
                tooltipLabelFormatter={tooltipLabelFormatter}
                tooltipValueFormatter={tooltipValueFormatter}
                showTrue={showTrue}
                showFalse={showFalse}
              />
            )}
            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
          />
          
          <ChartBars
            showTrue={showTrue}
            showFalse={showFalse}
            filteredData={filteredData}
            activeIndex={activeIndex}
            handleMouseOver={handleMouseOver}
            barColor={barColor}
          />
          
          <ChartVersionMarkers 
            versionChanges={updatedVersionChanges}
            filteredData={filteredData}
            height={height}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
