import React, { useState } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
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

  return (
    <div className={cn("w-full h-full chart-container", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
          barSize={24}
          barGap={5}
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
            interval="preserveStartEnd"
            minTickGap={5}
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
          
          {versionChanges.map((change, index) => {
            const xPos = change.position * (100 / (data.length - 1)) + '%';
            
            return (
              <VersionMarker 
                key={`version-${index}`}
                x={change.position * (100 / (data.length - 1))}
                height={height as number - 30}
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
