
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

  const handleMouseOver = (data: any, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  const maxValue = Math.max(...data.map(item => item.value));
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
  const feb21Position = data.findIndex(item => item.name === "Feb 21");
  
  // Combine version changes with our new Feb 21 annotation
  const allVersionChanges = [...versionChanges];
  
  // Only add Feb 21 annotation if it exists in our data
  if (feb21Position !== -1) {
    // Check if we already have a version change on Feb 21
    const existingFeb21 = allVersionChanges.find(change => 
      data[change.position]?.name === "Feb 21"
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

  // Calculate optimal interval for the X axis based on data length
  const getXAxisInterval = () => {
    if (data.length > 60) return 6;
    if (data.length > 40) return 4;
    if (data.length > 20) return 2;
    if (data.length > 14) return 1;
    return 'preserveStartEnd';
  };

  // Calculate optimal bar size based on data length
  const getBarSize = () => {
    if (data.length > 60) return 2;
    if (data.length > 30) return 4;
    if (data.length > 14) return 8;
    return 24;
  };

  return (
    <div className={cn("w-full h-full chart-container", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          margin={{ top: 30, right: 16, left: 0, bottom: 0 }}
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
            tickMargin={8}
            stroke="#545A62"
            fontSize={10}
            interval={getXAxisInterval()}
            minTickGap={5}
            angle={data.length > 14 ? -45 : 0}
            textAnchor={data.length > 14 ? "end" : "middle"}
            height={data.length > 14 ? 60 : 30}
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
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={activeIndex === index ? `${barColor}` : `${barColor}90`}
                className="transition-colors duration-200"
              />
            ))}
          </Bar>
          
          {/* Version Markers */}
          {allVersionChanges && allVersionChanges.length > 0 && allVersionChanges.map((change, index) => {
            // Calculate pixel position instead of percentage
            const barWidth = 100 / data.length;
            const xPosition = change.position * barWidth + (barWidth / 2);
            
            return (
              <VersionMarker 
                key={`version-${index}`}
                x={`${xPosition}%`}
                height={Number(height) - 30}
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
