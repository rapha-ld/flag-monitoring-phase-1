
import React, { useState } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DataPoint, VersionChange } from '../BarChart';
import VersionMarker from '../VersionMarker';
import CustomTooltip from './CustomTooltip';
import BarChartCell from './BarChartCell';
import { getXAxisInterval, getBarSize, calculateYAxisDomain } from '@/utils/chartUtils';

interface BarChartContentProps {
  data: DataPoint[];
  versionChanges: VersionChange[];
  barColor: string;
  height: number | string;
  valueFormatter: (value: number) => string;
  tooltipValueFormatter: (value: number) => string;
  tooltipLabelFormatter: (label: string) => string;
  showTrue: boolean;
  showFalse: boolean;
}

const BarChartContent = ({
  data,
  versionChanges,
  barColor,
  height,
  valueFormatter,
  tooltipValueFormatter,
  tooltipLabelFormatter,
  showTrue,
  showFalse,
}: BarChartContentProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Filter to include all data points, even those with 0 values
  const filteredData = data;

  const handleMouseOver = (data: any, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  const yAxisDomain = calculateYAxisDomain(filteredData, showTrue, showFalse);

  // Colors for true/false bars
  const trueColor = "#2BB7D2";
  const falseColor = "#FFD099";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={filteredData}
        margin={{ top: 30, right: 16, left: 0, bottom: 24 }}
        barSize={getBarSize(filteredData.length)}
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
          tickMargin={16}
          stroke="#545A62"
          fontSize={10}
          interval={getXAxisInterval(filteredData.length)}
          minTickGap={8}
          angle={0}
          textAnchor="middle"
          height={40}
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
          content={(props) => (
            <CustomTooltip 
              {...props} 
              tooltipLabelFormatter={tooltipLabelFormatter}
              tooltipValueFormatter={tooltipValueFormatter}
              showTrue={showTrue}
              showFalse={showFalse}
            />
          )}
          cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
        />
        
        {/* Conditionally render the bars based on showTrue and showFalse */}
        {showTrue && (
          <Bar 
            dataKey="valueTrue" 
            name="True"
            stackId="stack1"
            radius={showFalse ? [0, 0, 0, 0] : [2, 2, 0, 0]} 
            isAnimationActive={false}
            onMouseOver={handleMouseOver}
            fill={trueColor}
          />
        )}
        
        {showFalse && (
          <Bar 
            dataKey="valueFalse" 
            name="False"
            stackId="stack1"
            radius={[2, 2, 0, 0]} 
            isAnimationActive={false}
            onMouseOver={handleMouseOver}
            fill={falseColor}
          />
        )}
        
        {/* If neither True/False is specified, use the original value */}
        {!showTrue && !showFalse && (
          <Bar 
            dataKey="value" 
            radius={[2, 2, 0, 0]} 
            isAnimationActive={false}
            onMouseOver={handleMouseOver}
          >
            {filteredData.map((entry, index) => (
              <BarChartCell 
                key={`cell-${index}`}
                index={index}
                activeIndex={activeIndex}
                barColor={barColor}
              />
            ))}
          </Bar>
        )}
        
        {/* Version Markers */}
        {versionChanges && versionChanges.length > 0 && versionChanges.map((change, index) => {
          if (change.position < 0) return null;
          const barWidth = 100 / filteredData.length;
          const xPosition = change.position * barWidth + (barWidth / 2);
          
          return (
            <VersionMarker 
              key={`version-${index}`}
              x={`${xPosition}%`}
              height={Number(height) - 35}
              version={change.version}
              date={change.date}
              details={change.details}
            />
          );
        })}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChartContent;
