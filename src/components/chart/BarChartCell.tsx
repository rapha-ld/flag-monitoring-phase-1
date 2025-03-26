
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
  // Add a subtle stroke to make bars more distinct when they're close together
  return (
    <Cell
      key={`cell-${index}`}
      fill={barColor}
      fillOpacity={opacity}
      stroke={barColor}
      strokeOpacity={0.9}
      strokeWidth={0.5}
      className="transition-colors duration-200"
    />
  );
};

export default BarChartCell;
