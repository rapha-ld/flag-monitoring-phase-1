import React from 'react';
import { Card } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import CustomTooltip from '../chart/CustomTooltip';

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
  maxYValue
}) => {
  // Calculate local max value if no shared max is provided
  const localMaxValue = Math.max(...data.map(d => 
    Math.max(
      (showTrue && showFalse) ? (d.valueTrue || 0) + (d.valueFalse || 0) : 
      showTrue ? (d.valueTrue || 0) : 
      showFalse ? (d.valueFalse || 0) : d.value || 0
    )
  ));
  
  // Use the shared maxYValue if provided, otherwise use local max
  const yAxisMax = maxYValue !== undefined ? maxYValue : localMaxValue * 1.1;
  
  // Custom tooltip formatters matching the main chart format
  const tooltipLabelFormatter = (label: string) => {
    const date = new Date(label);
    return isNaN(date.getTime()) 
      ? label
      : `${date.getMonth() + 1}/${date.getDate()}`;
  };
  
  const tooltipValueFormatter = (value: number) => `${value}`;
  
  return (
    <Card className="p-3 h-32 transition-all duration-300 hover:shadow-md chart-container">
      <div className="text-xs font-semibold mb-1 truncate">{title}</div>
      <div className="text-xs text-muted-foreground mb-2">{version}</div>
      <ResponsiveContainer width="100%" height={70} className="mb-1">
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
