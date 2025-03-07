import React, { useState } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { cn } from '@/lib/utils';
import VersionMarker from './VersionMarker';

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
  
  // We keep all data points, but filter out those with 0 values
  const filteredData = data.filter(item => item.value > 0);

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

  const maxValue = Math.max(...filteredData.map(item => item.value));
  const yAxisDomain = [0, Math.ceil(maxValue * 1.1)];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border shadow-md rounded-md p-2 text-xs">
          <p className="font-medium">{tooltipLabelFormatter(label)}</p>
          <p className="text-primary">
            {tooltipValueFormatter(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

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
  const updatedVersionChanges = allVersionChanges.map(change => {
    // Find the date of the original version change
    const originalDate = data[change.position]?.name;
    // Find the new position in filtered data
    const newPosition = filteredData.findIndex(item => item.name === originalDate);
    return {
      ...change,
      position: newPosition >= 0 ? newPosition : 0 // Default to 0 if not found
    };
  }).filter(change => change.position >= 0);

  // Calculate optimal interval for the X axis based on data length
  const getXAxisInterval = () => {
    if (filteredData.length > 60) return 6;
    if (filteredData.length > 40) return 4;
    if (filteredData.length > 20) return 2;
    if (filteredData.length > 14) return 1;
    return 'preserveStartEnd';
  };

  // Calculate optimal bar size based on data length
  const getBarSize = () => {
    if (filteredData.length > 60) return 2;
    if (filteredData.length > 30) return 4;
    if (filteredData.length > 14) return 8;
    return 24;
  };

  return (
    <div className={cn("w-full h-full chart-container", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={filteredData}
          margin={{ top: 30, right: 16, left: 0, bottom: 12 }}
          barSize={getBarSize()}
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
            tickMargin={12}
            stroke="#545A62"
            fontSize={10}
            interval={getXAxisInterval()}
            minTickGap={5}
            angle={filteredData.length > 14 ? -45 : 0}
            textAnchor={filteredData.length > 14 ? "end" : "middle"}
            height={filteredData.length > 14 ? 70 : 35}
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
            content={<CustomTooltip />} 
            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
          />
          <Bar 
            dataKey="value" 
            radius={[2, 2, 0, 0]} 
            isAnimationActive={false}
            onMouseOver={handleMouseOver}
          >
            {filteredData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={activeIndex === index ? `${barColor}` : `${barColor}90`}
                className="transition-colors duration-200"
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
