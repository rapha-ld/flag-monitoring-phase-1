
import React, { useState } from 'react';
import {
  BarChart as RechartsBarChart,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DataPoint, VersionChange } from '../BarChart';
import { calculateYAxisDomain } from '@/utils/chartUtils';
import CustomTooltip from './CustomTooltip';
import ChartAxes from './ChartAxes';
import ChartBars from './ChartBars';
import VersionMarkerLayer from './VersionMarkerLayer';

interface BarChartContentProps {
  data: DataPoint[];
  versionChanges: VersionChange[];
  barColor: string;
  height: number | string;
  valueFormatter: (value: number) => string;
  tooltipValueFormatter: (value: number) => string;
  tooltipLabelFormatter: (label: string) => string;
  showTrue: boolean;
  showFalse: boolean;
}

const BarChartContent = ({
  data,
  versionChanges,
  barColor,
  height,
  valueFormatter,
  tooltipValueFormatter,
  tooltipLabelFormatter,
  showTrue,
  showFalse,
}: BarChartContentProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Filter to include all data points, even those with 0 values
  const filteredData = data;

  const handleMouseOver = (data: any, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  const yAxisDomain = calculateYAxisDomain(filteredData, showTrue, showFalse);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={filteredData}
        margin={{ top: 30, right: 16, left: 0, bottom: 24 }}
        barSize={getBarSize(filteredData.length)}
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
          barColor={barColor}
          handleMouseOver={handleMouseOver}
        />
        
        <VersionMarkerLayer 
          versionChanges={versionChanges}
          filteredData={filteredData}
          height={height}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

// Import getBarSize here since we're using it directly in this component
const getBarSize = (dataLength: number) => {
  if (dataLength > 60) return 2;
  if (dataLength > 30) return 4;
  if (dataLength > 14) return 8;
  return 24;
};

export default BarChartContent;
