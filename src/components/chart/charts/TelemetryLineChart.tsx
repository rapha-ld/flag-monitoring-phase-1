
import React from 'react';
import { LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine, ReferenceArea, Line } from 'recharts';
import CustomTooltip from '../CustomTooltip';
import { useChartProps } from './useChartProps';

interface TelemetryLineChartProps {
  data: any[];
  title: string;
  chartColor: string;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
  timeframe: string;
  height: number;
}

const TelemetryLineChart: React.FC<TelemetryLineChartProps> = ({
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

  // Default constants for LCP performance zones
  let goodZoneColor = "#F2FCE2";
  let needsImprovementZoneColor = "#FEF7CD";
  let poorZoneColor = "#FEC6A1";
  const dashedLineColor = "#8E9196";
  
  // Default thresholds for LCP
  let goodThreshold = 2.5;
  let needsImprovementThreshold = 4;
  let maxDomain = 6;
  
  // Adjust thresholds based on chart type
  if (title === "Interaction to Next Paint") {
    goodThreshold = 200;     // 200ms
    needsImprovementThreshold = 500;  // 500ms
    maxDomain = 800;          // 800ms
    chartColor = "#2BB7D2";  // Match the LCP chart color
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart 
        data={data} 
        margin={{ top: 10, right: 5, left: 10, bottom: 5 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
        
        <ReferenceArea 
          y1={needsImprovementThreshold} 
          y2={maxDomain}
          fill={poorZoneColor} 
          fillOpacity={0.5}
          ifOverflow="extendDomain"
          label={{ 
            value: "Poor", 
            position: "insideTopRight",
            fontSize: 10,
            fill: "#B45309",
            dy: 5,
            dx: -5
          }}
        />
        
        <ReferenceLine
          y={needsImprovementThreshold}
          stroke={dashedLineColor}
          strokeWidth={1}
          strokeDasharray="3 3"
          opacity={0.5}
        />
        
        <ReferenceArea 
          y1={goodThreshold} 
          y2={needsImprovementThreshold} 
          fill={needsImprovementZoneColor} 
          fillOpacity={0.5}
          ifOverflow="extendDomain"
          label={{ 
            value: "Needs improvement", 
            position: "insideTopRight",
            fontSize: 10,
            fill: "#854D0E",
            dy: 5,
            dx: -5
          }}
        />
        
        <ReferenceLine
          y={goodThreshold}
          stroke={dashedLineColor}
          strokeWidth={1}
          strokeDasharray="3 3"
          opacity={0.5}
        />
        
        <ReferenceArea 
          y1={0} 
          y2={goodThreshold} 
          fill={goodZoneColor} 
          fillOpacity={0.5}
          ifOverflow="extendDomain"
          label={{ 
            value: "Good", 
            position: "insideTopRight",
            fontSize: 10,
            fill: "#3F6212",
            dy: 5,
            dx: -5
          }}
        />
        
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
          width={30}
          domain={[0, maxDomain]}
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
        
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={chartColor} 
          strokeWidth={2}
          dot={false}
          activeDot={false}
          isAnimationActive={false}
          strokeOpacity={1}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TelemetryLineChart;
