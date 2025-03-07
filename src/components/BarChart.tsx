
import React, { useState } from 'react';
import {
  BarChart as RechartsBarChart,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import CustomTooltip from './chart/CustomTooltip';
import { getBarSize, calculateYAxisDomain, processVersionChanges } from '@/utils/chartUtils';
import ChartAxes from './chart/ChartAxes';
import ChartContent from './chart/ChartContent';
import VersionMarkers from './chart/VersionMarkers';

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
  chartType?: 'stacked' | 'line-false';
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
  chartType = 'stacked',
}: BarChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Include all data points, even those with 0 values
  const filteredData = data;

  const handleMouseOver = (data: any, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  // Make sure we have data to display
  if (filteredData.length === 0) {
    return <div className="flex items-center justify-center h-full">No data available</div>;
  }

  const yAxisDomain = calculateYAxisDomain(filteredData, showTrue, showFalse);

  // Find the February 21 position in the data array
  const feb21Position = filteredData.findIndex(item => item.name === "Feb 21");
  
  // Combine version changes with our new Feb 21 annotation
  const allVersionChanges = [...versionChanges];
  
  // Only add Feb 21 annotation if it exists in our data
  if (feb21Position !== -1) {
    // Check if we already have a version change on Feb 21
    const existingFeb21 = allVersionChanges.find(change => 
      filteredData[change.position]?.name === "Feb 21"
    );
    
    if (!existingFeb21) {
      allVersionChanges.push({
        date: "Feb 21",
        position: feb21Position,
        version: "1.0.2",
        details: "Release v1.0.2"
      });
    }
  }

  // Update version change positions to match all data
  const updatedVersionChanges = processVersionChanges(allVersionChanges, data, filteredData);

  const trueColor = "#2BB7D2";
  const falseColor = "#FFD099";

  return (
    <div className={cn("w-full h-full chart-container", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={filteredData}
          margin={{ top: 30, right: 16, left: 0, bottom: 24 }}
          barSize={getBarSize(filteredData.length)}
          barGap={2}
          onMouseLeave={handleMouseLeave}
        >
          <ChartAxes 
            data={filteredData} 
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
          
          <ChartContent 
            chartType={chartType}
            showTrue={showTrue}
            showFalse={showFalse}
            data={filteredData}
            handleMouseOver={handleMouseOver}
            activeIndex={activeIndex}
            trueColor={trueColor}
            falseColor={falseColor}
          />
          
          <VersionMarkers 
            versionChanges={updatedVersionChanges} 
            data={filteredData} 
            height={height}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
