
import React from 'react';
import { AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts';
import CustomTooltip from '../CustomTooltip';
import { useChartProps } from './useChartProps';

interface TelemetryAreaChartProps {
  data: any[];
  title: string;
  chartColor: string;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
  timeframe: string;
  height: number;
}

const TelemetryAreaChart: React.FC<TelemetryAreaChartProps> = ({
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

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart 
        data={data} 
        margin={{ top: 10, right: 5, left: 0, bottom: 5 }}
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
          interval={timeframe === "1h" ? 4 : timeframe === "1d" ? 3 : "preserveEnd"}
          tickMargin={10}
          minTickGap={10}
          padding={{ left: 10, right: 10 }}
        />
        <YAxis 
          tick={{ fontSize: 10, fill: axisLabelColor }}
          axisLine={false}
          tickLine={false}
          width={20}
          tickFormatter={(value) => Math.round(value).toString()}
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
        
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={chartColor} 
          strokeWidth={2}
          fill={`url(#colorGradient-${title.replace(/\s+/g, '')})`}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TelemetryAreaChart;
