
import React from 'react';
import { Card } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface MiniChartProps { 
  title: string; 
  version: string; 
  data: any[];
  showTrue: boolean;
  showFalse: boolean;
  trueColor: string;
  falseColor: string;
  factor: number;
}

const MiniChart: React.FC<MiniChartProps> = ({ 
  title, 
  version, 
  data, 
  showTrue,
  showFalse,
  trueColor,
  falseColor,
  factor
}) => {
  const maxValue = Math.max(...data.map(d => 
    Math.max(
      (showTrue && showFalse) ? (d.valueTrue || 0) + (d.valueFalse || 0) : 
      showTrue ? (d.valueTrue || 0) : 
      showFalse ? (d.valueFalse || 0) : d.value || 0
    )
  ));
  
  return (
    <Card className="p-3 h-32 transition-all duration-300 hover:shadow-md chart-container group">
      <div className="text-xs font-semibold mb-1 truncate">{title}</div>
      <div className="text-xs text-muted-foreground mb-2">{version}</div>
      <ResponsiveContainer width="100%" height={70}>
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
            domain={[0, maxValue * 1.1]} 
            tick={false} 
            axisLine={false} 
            tickLine={false} 
            width={0}
          />
          <Tooltip 
            formatter={(value: any) => [`${value}`, 'Users']}
            labelFormatter={(label) => {
              const date = new Date(label);
              return isNaN(date.getTime()) 
                ? label
                : `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          
          {showTrue && (
            <Bar 
              dataKey="valueTrue" 
              name="True"
              stackId="a"
              fill={trueColor} 
              radius={[1, 1, 0, 0]} 
              isAnimationActive={false}
              className="transition-all duration-300 group-hover:opacity-80"
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
              className="transition-all duration-300 group-hover:opacity-80"
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default MiniChart;
