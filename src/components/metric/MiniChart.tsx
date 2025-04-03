
import React from 'react';
import { Card } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import CustomTooltip from '../chart/CustomTooltip';
import { getTimestampPositions } from '@/utils/chartUtils';

interface MiniChartProps { 
  title: string; 
  version: string; 
  data: any[];
  showTrue: boolean;
  showFalse: boolean;
  trueColor: string;
  falseColor: string;
  factor: number;
  maxYValue?: number; // Optional prop for shared y-axis scaling
  selectedTimestamp?: Date | null;
  selectedTimestamps?: Date[] | null;
}

const MiniChart: React.FC<MiniChartProps> = ({ 
  title, 
  version, 
  data, 
  showTrue,
  showFalse,
  trueColor,
  falseColor,
  factor,
  maxYValue,
  selectedTimestamp,
  selectedTimestamps
}) => {
  const localMaxValue = Math.max(...data.map(d => 
    Math.max(
      (showTrue && showFalse) ? (d.valueTrue || 0) + (d.valueFalse || 0) : 
      showTrue ? (d.valueTrue || 0) : 
      showFalse ? (d.valueFalse || 0) : d.value || 0
    )
  ));
  
  const yAxisMax = maxYValue !== undefined ? maxYValue : localMaxValue * 1.1;
  
  const tooltipLabelFormatter = (label: string) => {
    const date = new Date(label);
    return isNaN(date.getTime()) 
      ? label
      : `${date.getMonth() + 1}/${date.getDate()}`;
  };
  
  const tooltipValueFormatter = (value: number) => `${value}`;
  
  // Calculate positions for vertical lines based on selected timestamps
  const referenceLinePositions = getTimestampPositions(
    data,
    selectedTimestamp,
    selectedTimestamps
  );
  
  return (
    <Card className="p-3 h-32 transition-all duration-300 hover:shadow-md chart-container border-none">
      <div className="text-xs font-semibold mb-1 truncate">{title}</div>
      <div className="text-xs text-muted-foreground mb-2">{version}</div>
      <ResponsiveContainer width="100%" height={70} className="mb-[-8px]">
        <BarChart 
          data={data} 
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          barSize={6}
          barGap={0}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            tick={false} 
            axisLine={false} 
            tickLine={false} 
          />
          <YAxis 
            domain={[0, yAxisMax]} 
            tick={false} 
            axisLine={false} 
            tickLine={false} 
            width={0}
          />
          <Tooltip 
            content={
              <CustomTooltip 
                tooltipValueFormatter={tooltipValueFormatter}
                tooltipLabelFormatter={tooltipLabelFormatter}
                showTrue={showTrue}
                showFalse={showFalse}
                chartType="stacked"
                metricType="evaluations"
              />
            }
            isAnimationActive={false}
            position={{ y: -75 }}  // Move the tooltip 75px higher
          />
          
          {/* Render vertical reference lines for the selected timestamps */}
          {referenceLinePositions.map((position, index) => (
            <ReferenceLine
              key={`ref-line-${index}`}
              x={position.x}
              stroke="#6B7280"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          ))}
          
          {showTrue && (
            <Bar 
              dataKey="valueTrue" 
              name="True"
              stackId="a"
              fill={trueColor} 
              radius={[1, 1, 0, 0]} 
              isAnimationActive={false}
            />
          )}
          
          {showFalse && (
            <Bar 
              dataKey="valueFalse" 
              name="False"
              stackId="a"
              fill={falseColor} 
              radius={showTrue ? [0, 0, 0, 0] : [1, 1, 0, 0]} 
              isAnimationActive={false}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default MiniChart;
