
import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine, ReferenceArea } from 'recharts';
import { ChartComponentProps } from '@/types/telemetry';
import CustomTooltip from './CustomTooltip';

const LCPChart: React.FC<ChartComponentProps> = ({
  data,
  chartColor,
  chartHeight,
  hoveredTimestamp,
  tooltipValueFormatter,
  tooltipLabelFormatter,
  onHoverTimestamp
}) => {
  const goodZoneColor = "#F2FCE2";
  const needsImprovementZoneColor = "#FEF7CD";
  const poorZoneColor = "#FEC6A1";
  const dashedLineColor = "#8E9196";
  const goodThreshold = 2.5;
  const needsImprovementThreshold = 4;

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
      <AreaChart 
        data={data} 
        margin={{ top: 10, right: 5, left: 0, bottom: 5 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <linearGradient id={`colorGradient-LCP`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={chartColor} stopOpacity={0.05} />
            <stop offset="100%" stopColor={chartColor} stopOpacity={0.2} />
          </linearGradient>
        </defs>
        
        <ReferenceArea 
          y1={needsImprovementThreshold} 
          y2={6}
          fill={poorZoneColor} 
          fillOpacity={0.5}
          ifOverflow="extendDomain"
          label={{ 
            value: "Poor", 
            position: "insideTopRight",
            fontSize: 8,
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
            fontSize: 8,
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
            fontSize: 8,
            fill: "#3F6212",
            dy: 5,
            dx: -5
          }}
        />
        
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
          domain={[0, 6]}
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
          fill={`url(#colorGradient-LCP)`}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default LCPChart;
