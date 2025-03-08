
import React from 'react';
import { Cell } from 'recharts';
import { DataPoint } from '../BarChart';

interface BarChartCellProps {
  index: number;
  barColor: string;
  data?: DataPoint[];
  activeIndex?: number | null;
}

const BarChartCell = ({ index, barColor, activeIndex = null }: BarChartCellProps) => {
  return (
    <Cell
      key={`cell-${index}`}
      fill={activeIndex === index ? `${barColor}` : `${barColor}90`}
      className="transition-colors duration-200"
    />
  );
};

export default BarChartCell;
