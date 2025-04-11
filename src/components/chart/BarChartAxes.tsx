
import React from 'react';
import { XAxis, YAxis, CartesianGrid } from 'recharts';

interface BarChartAxesProps {
  data: any[];
  interval: number;
  valueFormatter: (value: number) => string;
  yAxisDomain: [number, number];
}

const BarChartAxes: React.FC<BarChartAxesProps> = ({
  data,
  interval,
  valueFormatter,
  yAxisDomain
}) => {
  return (
    <>
      <CartesianGrid 
        strokeDasharray="3 3" 
        vertical={false} 
        stroke="#E5E7EB" 
      />
      <XAxis 
        dataKey="name" 
        fontSize={10}
        axisLine={false}
        tickLine={false}
        tickFormatter={(value) => {
          const date = new Date(value);
          return isNaN(date.getTime()) 
            ? value
            : `${date.getMonth() + 1}/${date.getDate()}`;
        }}
        interval={interval}
        padding={{ left: 10, right: 10 }}
      />
      <YAxis 
        fontSize={10}
        axisLine={false}
        tickLine={false}
        domain={yAxisDomain}
        allowDataOverflow={true}
        tickFormatter={valueFormatter}
      />
    </>
  );
};

export default BarChartAxes;
