
import React from 'react';
import { Cell } from 'recharts';

interface BarChartCellProps {
  index: number;
  activeIndex: number | null;
  barColor: string;
}

const BarChartCell = ({ index, activeIndex, barColor }: BarChartCellProps) => {
  return (
    <Cell
      key={`cell-${index}`}
      fill={activeIndex === index ? `${barColor}` : `${barColor}90`}
      className="transition-colors duration-200"
    />
  );
};

export default BarChartCell;
