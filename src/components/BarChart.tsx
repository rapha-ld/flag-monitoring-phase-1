
import React, { useState } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import VersionMarker from './VersionMarker';
import CustomTooltip from './chart/CustomTooltip';
import BarChartCell from './chart/BarChartCell';
import { getXAxisInterval, getBarSize, calculateYAxisDomain, processVersionChanges } from '@/utils/chartUtils';

export interface DataPoint {
  name: string;
  value: number;
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

  const yAxisDomain = calculateYAxisDomain(filteredData);

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
          <CartesianGrid 
            vertical={false} 
            horizontal={true} 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))" 
            strokeOpacity={0.4}
          />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tickMargin={16}
            stroke="#545A62"
            fontSize={10}
            interval={getXAxisInterval(filteredData.length)}
            minTickGap={8}
            angle={0}
            textAnchor="middle"
            height={40}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tickMargin={8}
            stroke="#545A62"
            fontSize={10}
            tickFormatter={valueFormatter}
            domain={yAxisDomain}
            width={40}
          />
          <Tooltip 
            content={(props) => (
              <CustomTooltip 
                {...props} 
                tooltipLabelFormatter={tooltipLabelFormatter}
                tooltipValueFormatter={tooltipValueFormatter}
              />
            )}
            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
          />
          <Bar 
            dataKey="value" 
            radius={[2, 2, 0, 0]} 
            isAnimationActive={false}
            onMouseOver={handleMouseOver}
          >
            {filteredData.map((entry, index) => (
              <BarChartCell 
                key={`cell-${index}`}
                index={index}
                activeIndex={activeIndex}
                barColor={barColor}
              />
            ))}
          </Bar>
          
          {/* Version Markers */}
          {updatedVersionChanges && updatedVersionChanges.length > 0 && updatedVersionChanges.map((change, index) => {
            if (change.position < 0) return null;
            const barWidth = 100 / filteredData.length;
            const xPosition = change.position * barWidth + (barWidth / 2);
            
            return (
              <VersionMarker 
                key={`version-${index}`}
                x={`${xPosition}%`}
                height={Number(height) - 35}
                version={change.version}
                date={change.date}
                details={change.details}
              />
            );
          })}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
