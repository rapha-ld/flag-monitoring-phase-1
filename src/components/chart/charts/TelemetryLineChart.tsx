
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import CustomTooltip from '../CustomTooltip';
import { getXAxisInterval } from '@/utils/chartUtils';

interface TelemetryLineChartProps {
  data: any[];
  title: string;
  chartColor: string;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
  timeframe: string;
  height?: number;
}

const TelemetryLineChart: React.FC<TelemetryLineChartProps> = ({ 
  data, 
  title, 
  chartColor, 
  hoveredTimestamp,
  onHoverTimestamp,
  timeframe,
  height = 160 
}) => {
  const interval = getXAxisInterval(data.length);

  const formatTimeLabel = (value: string) => {
    if (/^\d{1,2}:\d{2}$/.test(value)) {
      const hour = parseInt(value.split(':')[0], 10);
      const period = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}${period}`;
    }
    
    // For minute-based labels
    if (/^\d{1,2}m$/.test(value)) {
      return value.replace('m', '');
    }
    
    return value;
  };

  const tooltipValueFormatter = (value: number) => {
    // For Largest Contentful Paint, display value in seconds
    return title === "Largest Contentful Paint" 
      ? `${value.toFixed(1)} sec` 
      : `${value.toFixed(1)}`;
  };

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
    <ResponsiveContainer width="100%" height={height}>
      <LineChart 
        data={data} 
        margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="name" 
          interval={interval}
          tick={{ fontSize: 10 }} 
          tickFormatter={formatTimeLabel}
        />
        <YAxis 
          tick={{ fontSize: 10 }} 
          tickFormatter={(value) => `${value.toFixed(1)}`} 
        />
        <Tooltip 
          content={
            <CustomTooltip 
              tooltipValueFormatter={tooltipValueFormatter}
              tooltipLabelFormatter={formatTimeLabel}
            />
          }
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
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={chartColor} 
          strokeWidth={2} 
          dot={false} 
          activeDot={{ r: 5 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TelemetryLineChart;
