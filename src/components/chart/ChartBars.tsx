
import React from 'react';
import { Bar } from 'recharts';
import BarChartCell from './BarChartCell';
import { DataPoint } from '../BarChart';

interface ChartBarsProps {
  showTrue: boolean;
  showFalse: boolean;
  filteredData: DataPoint[];
  activeIndex: number | null;
  handleMouseOver: (data: any, index: number) => void;
  barColor: string;
}

const ChartBars = ({
  showTrue,
  showFalse,
  filteredData,
  activeIndex,
  handleMouseOver,
  barColor
}: ChartBarsProps) => {
  // True color from the design
  const trueColor = "#2BB7D2";
  // False color from the design
  const falseColor = "#FFD099";

  if (showTrue && showFalse) {
    return (
      <>
        <Bar 
          dataKey="valueTrue" 
          name="True"
          stackId="stack1"
          radius={[0, 0, 0, 0]} 
          isAnimationActive={false}
          onMouseOver={handleMouseOver}
          fill={trueColor}
        />
        <Bar 
          dataKey="valueFalse" 
          name="False"
          stackId="stack1"
          radius={[2, 2, 0, 0]} 
          isAnimationActive={false}
          onMouseOver={handleMouseOver}
          fill={falseColor}
        />
      </>
    );
  } else if (showTrue) {
    return (
      <Bar 
        dataKey="valueTrue" 
        name="True"
        radius={[2, 2, 0, 0]} 
        isAnimationActive={false}
        onMouseOver={handleMouseOver}
        fill={trueColor}
      />
    );
  } else if (showFalse) {
    return (
      <Bar 
        dataKey="valueFalse" 
        name="False"
        radius={[2, 2, 0, 0]} 
        isAnimationActive={false}
        onMouseOver={handleMouseOver}
        fill={falseColor}
      />
    );
  } else {
    return (
      <Bar 
        dataKey="value" 
        radius={[2, 2, 0, 0]} 
        isAnimationActive={false}
        onMouseOver={handleMouseOver}
      >
        {filteredData.map((entry, index) => (
          <BarChartCell 
            key={`cell-${index}`}
            index={index}
            activeIndex={activeIndex}
            barColor={barColor}
          />
        ))}
      </Bar>
    );
  }
};

export default ChartBars;
