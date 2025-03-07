
import React from 'react';
import { Bar } from 'recharts';
import BarChartCell from './BarChartCell';

interface BarChartElementProps {
  dataKey: string;
  name?: string;
  stackId?: string;
  color?: string;
  handleMouseOver?: (data: any, index: number) => void;
  activeIndex?: number | null;
  data?: any[];
}

const BarChartElement = ({ 
  dataKey, 
  name, 
  stackId, 
  color,
  handleMouseOver,
  activeIndex,
  data
}: BarChartElementProps) => {
  return (
    <Bar 
      dataKey={dataKey} 
      name={name}
      stackId={stackId}
      radius={[2, 2, 0, 0]} 
      isAnimationActive={false}
      onMouseOver={handleMouseOver}
      fill={color}
    >
      {!color && data && data.map((entry, index) => (
        <BarChartCell 
          key={`cell-${index}`}
          index={index}
          activeIndex={activeIndex || null}
          barColor="#6E6F96"
        />
      ))}
    </Bar>
  );
};

export default BarChartElement;
