
import React from 'react';
import { XAxis, YAxis, CartesianGrid } from 'recharts';
import { getXAxisInterval } from '@/utils/chartUtils';

interface ChartAxesProps {
  filteredData: Array<{name: string}>;
  valueFormatter: (value: number) => string;
  yAxisDomain: [number, number];
}

const ChartAxes = ({
  filteredData,
  valueFormatter,
  yAxisDomain
}: ChartAxesProps) => {
  return (
    <>
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
    </>
  );
};

export default ChartAxes;
