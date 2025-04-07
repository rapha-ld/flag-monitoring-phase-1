
import React from 'react';
import { Area, Line, XAxis, YAxis, ResponsiveContainer, ComposedChart, Tooltip } from 'recharts';
import { DataPoint } from '@/components/BarChart';
import { getXAxisInterval, getBarSize } from '@/utils/chartUtils';
import { IMPACT_COLOR, THIS_FLAG_COLOR, CHART_HEIGHT, CHART_MARGIN } from './constants';

interface ChartAreaProps {
  chartData: DataPoint[];
  timeframe: string;
}

const ChartArea: React.FC<ChartAreaProps> = ({
  chartData,
  timeframe,
}) => {
  const xAxisInterval = getXAxisInterval(chartData.length);
  const barSize = getBarSize(chartData.length);

  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <ComposedChart
        data={chartData}
        margin={CHART_MARGIN}
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
          tick={{ fontSize: 10, fill: '#9CA3AF' }}
          interval={xAxisInterval}
          tickMargin={10}
          minTickGap={10}
          tickFormatter={(value) => value.split(" ")[0]}
        />
        
        <YAxis
          domain={[0, 'dataMax']}
          tick={{ fontSize: 10, fill: '#9CA3AF' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        
        <Tooltip
          formatter={(value) => [`${value}%`, 'Impact']}
          labelFormatter={(label) => label}
          cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }}
        />
        
        <Area
          type="monotone"
          dataKey="value"
          stroke={IMPACT_COLOR}
          strokeWidth={1.5}
          fillOpacity={1}
          fill="url(#areaFill)"
          activeDot={false}
        />
        
        <Line
          type="monotone"
          dataKey="flag"
          stroke={THIS_FLAG_COLOR}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, stroke: THIS_FLAG_COLOR, strokeWidth: 2, fill: 'white' }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default ChartArea;
