
import React from 'react';
import { Area, Line, XAxis, YAxis, ResponsiveContainer, ComposedChart, Tooltip, ReferenceLine } from 'recharts';
import { DataPoint } from '@/components/BarChart';
import { getXAxisInterval, getBarSize } from '@/utils/chartUtils';
import { getTimestampPositions } from '@/utils/chartUtils';
import { IMPACT_COLOR, THIS_FLAG_COLOR, CHART_HEIGHT, CHART_MARGIN } from './constants';
import SelectedDot from './SelectedDot';

interface ChartAreaProps {
  chartData: DataPoint[];
  selectedTimestamp?: Date | null;
  selectedTimestamps?: Date[] | null;
  timeframe: string;
  hoveredTimestamp?: string | null;
}

const ChartArea: React.FC<ChartAreaProps> = ({
  chartData,
  selectedTimestamp,
  selectedTimestamps,
  timeframe,
  hoveredTimestamp
}) => {
  const xAxisInterval = timeframe === "1d" ? 2 : getXAxisInterval(chartData.length);
  const barSize = getBarSize(chartData.length);

  // Calculate positions for selected timestamps
  const selectedPositions = selectedTimestamps 
    ? getTimestampPositions(chartData, selectedTimestamps)
    : selectedTimestamp 
      ? getTimestampPositions(chartData, [selectedTimestamp])
      : [];

  const renderSelectedDots = (data: any, dataKey: string) => {
    if (!selectedPositions.length) return null;
    
    return selectedPositions.map((position, index) => {
      if (position < 0 || position >= data.length) return null;
      const dataPoint = data[position];
      if (!dataPoint) return null;
      
      const x = dataPoint.x;
      const y = dataPoint[dataKey];
      
      if (x === undefined || y === undefined) return null;
      
      return <SelectedDot key={`selected-dot-${index}`} cx={x} cy={y} />;
    });
  };

  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <ComposedChart
        data={chartData}
        margin={CHART_MARGIN}
      >
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={IMPACT_COLOR} stopOpacity={0.1} />
            <stop offset="75%" stopColor={IMPACT_COLOR} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: '#9CA3AF' }}
          interval={xAxisInterval}
          tickMargin={10}
          minTickGap={10}
          tickFormatter={(value) => {
            if (timeframe === "1d") {
              // For 1-day timeframe, show just the hour
              const hourPart = value.split(":")[0];
              return hourPart;
            }
            // For other timeframes, show just the date part
            return value.split(" ")[0];
          }}
        />
        
        <YAxis
          domain={[0, 80]}
          tick={{ fontSize: 10, fill: '#9CA3AF' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${Math.round(value)}`}
        />
        
        <Tooltip
          formatter={(value) => [`${Math.round(Number(value))}`, 'Impact']}
          labelFormatter={(label) => {
            if (timeframe === "1d") {
              return `${label}`; // Already formatted properly for 1d
            }
            return label;
          }}
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
          stroke="#A9AFB4"
          strokeWidth={1}
          fillOpacity={1}
          fill="url(#areaFill)"
          activeDot={false}
          isAnimationActive={false}
          style={{ stroke: '#A9AFB4', strokeWidth: '1px' }}
        />
        
        <Line
          type="monotone"
          dataKey="flag"
          stroke={THIS_FLAG_COLOR}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, stroke: THIS_FLAG_COLOR, strokeWidth: 2, fill: 'white' }}
          isAnimationActive={false}
        />
        
        {renderSelectedDots(chartData, 'flag')}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default ChartArea;
