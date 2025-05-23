
import React from 'react';
import { Area, Line, XAxis, YAxis, ResponsiveContainer, ComposedChart, Tooltip, ReferenceLine } from 'recharts';
import { DataPoint } from '@/components/BarChart';
import { getXAxisInterval, getBarSize } from '@/utils/chartUtils';
import { getTimestampPositions } from '@/utils/chartUtils';
import { IMPACT_COLOR, THIS_FLAG_COLOR, CHART_MARGIN } from './constants';
import SelectedDot from './SelectedDot';
import CustomTooltip from '@/components/chart/CustomTooltip';

interface ChartAreaProps {
  chartData: DataPoint[];
  selectedTimestamp?: Date | null;
  selectedTimestamps?: Date[] | null;
  timeframe: string;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
  title?: string;
}

const ChartArea: React.FC<ChartAreaProps> = ({
  chartData,
  selectedTimestamp,
  selectedTimestamps,
  timeframe,
  hoveredTimestamp,
  onHoverTimestamp,
  title = "Flag Changes"
}) => {
  // Adjust interval based on timeframe
  let xAxisInterval;
  if (timeframe === "1d") {
    xAxisInterval = 3; // Show every 4th hour for 1-day view (24 hours / 3 = 8 ticks)
  } else if (timeframe === "1h") {
    xAxisInterval = 9; // Show fewer ticks for minute-based data
  } else {
    xAxisInterval = getXAxisInterval(chartData.length);
  }
  
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

  // Format time label to use AM/PM format
  const formatTimeLabel = (value: string) => {
    if (timeframe === "1h") {
      // For 1-hour timeframe, show just the minute
      return value.replace('m', '');
    } else if (timeframe === "1d") {
      // For 1-day timeframe, show the hour
      return value;
    }
    // For other timeframes, show just the date part
    return value.split(" ")[0];
  };

  const tooltipLabelFormatter = (label: string) => {
    return formatTimeLabel(label);
  };

  const tooltipValueFormatter = (value: number) => `${value.toFixed(1)}%`;

  // Updated hover event handlers with improved timestamp handling
  const handleMouseMove = (e: any) => {
    if (e && e.activeLabel && onHoverTimestamp) {
      // Keep the original timestamp format for consistency across charts
      const timestamp = e.activeLabel;
      console.log(`ChartArea hover: ${timestamp}`);
      onHoverTimestamp(timestamp);
    }
  };

  const handleMouseLeave = () => {
    if (onHoverTimestamp) {
      console.log(`ChartArea hover cleared`);
      onHoverTimestamp(null);
    }
  };
  
  // Standardize axis label colors - same as Evaluations chart
  const axisLabelColor = '#9CA3AF';

  // Set a fixed height to match the Evaluations chart
  const chartHeight = 160;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <ComposedChart
        data={chartData}
        margin={CHART_MARGIN}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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
          tick={{ fontSize: 10, fill: axisLabelColor }}
          interval={xAxisInterval}
          tickMargin={10}
          minTickGap={10}
          tickFormatter={formatTimeLabel}
        />
        
        <YAxis
          domain={[0, 80]}
          tick={{ fontSize: 10, fill: axisLabelColor }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${Math.round(value)}`}
        />
        
        <Tooltip
          content={
            <CustomTooltip
              tooltipValueFormatter={tooltipValueFormatter}
              tooltipLabelFormatter={tooltipLabelFormatter}
              showTrue={false}
              showFalse={false}
              isImpactChart={true}
              title={title}
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
