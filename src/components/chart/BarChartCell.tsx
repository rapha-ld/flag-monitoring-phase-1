
import React from 'react';
import { Cell } from 'recharts';
import { DataPoint } from '../BarChart';

interface BarChartCellProps {
  index: number;
  barColor: string;
  data?: DataPoint[];
  activeIndex?: number | null;
  opacity?: number;
}

const BarChartCell = ({ index, barColor, activeIndex = null, opacity = 1 }: BarChartCellProps) => {
  return (
    <Cell
      key={`cell-${index}`}
      fill={activeIndex === index ? `${barColor}` : `${barColor}`}
      fillOpacity={opacity}
      className="transition-colors duration-200"
    />
  );
};

export default BarChartCell;
