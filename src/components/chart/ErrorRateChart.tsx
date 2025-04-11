
import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts';
import { ChartComponentProps } from '@/types/telemetry';
import CustomTooltip from './CustomTooltip';
import { getBarSize } from '@/utils/telemetryDataUtils';

const ErrorRateChart: React.FC<ChartComponentProps> = ({
  data,
  chartColor,
  chartHeight,
  hoveredTimestamp,
  tooltipValueFormatter,
  tooltipLabelFormatter,
  onHoverTimestamp
}) => {
  const barSize = getBarSize(data.length);

  const handleMouseMove = (e: any) => {
    if (e && e.activeLabel && onHoverTimestamp) {
      onHoverTimestamp(e.activeLabel);
    }
  };

  const handleMouseLeave = () => {
    if (onHoverTimestamp) {
      onHoverTimestamp(null);
    }
  };

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart 
        data={data} 
        margin={{ top: 10, right: 5, left: 0, bottom: 5 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <linearGradient id={`colorGradient-ErrorRate`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={chartColor} stopOpacity={0.05} />
            <stop offset="100%" stopColor={chartColor} stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
        <XAxis 
          dataKey="time" 
          tick={{ fontSize: 10, fill: '#9CA3AF' }}
          axisLine={{ stroke: '#eee' }} 
          tickLine={false}
          interval="preserveEnd"
          tickMargin={10}
          minTickGap={10}
          padding={{ left: 10, right: 10 }}
        />
        <YAxis 
          tick={{ fontSize: 10, fill: '#9CA3AF' }}
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
        
        <Bar 
          dataKey="value" 
          fill={chartColor}
          radius={[2, 2, 0, 0]}
          fillOpacity={0.3}
          isAnimationActive={false}
          barSize={barSize}
          stroke="#FFFFFF"
          strokeWidth={1}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ErrorRateChart;
