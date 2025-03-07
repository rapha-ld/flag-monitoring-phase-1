
import React from 'react';
import { Line } from 'recharts';

interface LineChartElementProps {
  dataKey: string;
  name: string;
  color: string;
}

const LineChartElement = ({ dataKey, name, color }: LineChartElementProps) => {
  return (
    <Line
      type="monotone"
      dataKey={dataKey}
      name={name}
      stroke={color}
      strokeWidth={2}
      dot={{ fill: color, r: 4 }}
      activeDot={{ r: 6 }}
      isAnimationActive={false}
    />
  );
};

export default LineChartElement;
