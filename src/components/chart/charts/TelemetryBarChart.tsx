
import React from 'react';
import { BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, ReferenceLine } from 'recharts';
import CustomTooltip from '../CustomTooltip';
import { useChartProps } from './useChartProps';
import { getBarSize } from './chartUtils';

interface TelemetryBarChartProps {
  data: any[];
  title: string;
  chartColor: string;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
  timeframe: string;
  height: number;
}

const TelemetryBarChart: React.FC<TelemetryBarChartProps> = ({
  data,
  title,
  chartColor,
  hoveredTimestamp,
  onHoverTimestamp,
  timeframe,
  height
}) => {
  const { 
    handleMouseMove, 
    handleMouseLeave, 
    tooltipLabelFormatter, 
    tooltipValueFormatter,
    axisLabelColor
  } = useChartProps(onHoverTimestamp);

  // Calculate appropriate interval based on timeframe
  const getXAxisInterval = () => {
    if (timeframe === "1h") return 10;
    if (timeframe === "1d") return 4;
    if (timeframe === "7d") return 4;
    if (timeframe === "14d") return 8;
    if (timeframe === "30d") return 10;
    if (timeframe === "60d") return 12;
    return "preserveEnd";
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart 
        data={data} 
        margin={{ top: 10, right: 5, left: 10, bottom: 5 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <linearGradient id={`colorGradient-${title.replace(/\s+/g, '')}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={chartColor} stopOpacity={0.05} />
            <stop offset="100%" stopColor={chartColor} stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
        <XAxis 
          dataKey="time" 
          tick={{ fontSize: 10, fill: axisLabelColor }}
          axisLine={{ stroke: '#eee' }} 
          tickLine={false}
          interval={getXAxisInterval()}
          tickMargin={10}
          minTickGap={15}
          padding={{ left: 10, right: 10 }}
        />
        <YAxis 
          tick={{ fontSize: 10, fill: axisLabelColor }}
          axisLine={false}
          tickLine={false}
          width={30}
          tickFormatter={(value) => Math.round(value).toString()}
          tickMargin={5}
        />
        <Tooltip 
          content={
            <CustomTooltip 
              tooltipValueFormatter={tooltipValueFormatter}
              tooltipLabelFormatter={tooltipLabelFormatter}
              showTrue={false}
              showFalse={false}
            />
          }
          cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }}
        />
        
        {hoveredTimestamp && (
          <ReferenceLine
            x={hoveredTimestamp}
            stroke="#6E6F96"
            strokeWidth={1}
            strokeDasharray="3 3"
            isFront={true}
          />
        )}
        
        <Bar 
          dataKey="value" 
          fill={chartColor}
          radius={[2, 2, 0, 0]}
          fillOpacity={0.3}
          isAnimationActive={false}
          barSize={getBarSize(data.length)}
          stroke="#FFFFFF"
          strokeWidth={1}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TelemetryBarChart;
