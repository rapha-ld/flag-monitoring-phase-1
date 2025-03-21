
import React from 'react';
import { Line } from 'recharts';
import { DataPoint } from '../BarChart';

interface MetricLineChartProps {
  data: DataPoint[];
  showTrue: boolean;
  showFalse: boolean;
}

const MetricLineChart = ({
  showTrue,
  showFalse
}: MetricLineChartProps) => {
  const trueColor = '#2BB7D2';
  const falseColor = '#FFD099';
  
  return (
    <>
      {showTrue && (
        <Line
          type="monotone"
          dataKey="valueTrue"
          name="True"
          stroke={trueColor}
          strokeWidth={3.5}
          dot={false}
          activeDot={{ r: 5 }}
          isAnimationActive={false}
        />
      )}
      
      {showFalse && (
        <Line
          type="monotone"
          dataKey="valueFalse"
          name="False"
          stroke={falseColor}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
          isAnimationActive={false}
        />
      )}
    </>
  );
};

export default MetricLineChart;
