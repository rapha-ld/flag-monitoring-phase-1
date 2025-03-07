
import React from 'react';
import { Bar } from 'recharts';
import BarChartCell from './BarChartCell';
import { DataPoint } from '../BarChart';

interface ChartBarsProps {
  showTrue: boolean;
  showFalse: boolean;
  filteredData: DataPoint[];
  activeIndex: number | null;
  barColor: string;
  handleMouseOver: (data: any, index: number) => void;
}

const ChartBars = ({
  showTrue,
  showFalse,
  filteredData,
  activeIndex,
  barColor,
  handleMouseOver
}: ChartBarsProps) => {
  // Colors for true/false bars
  const trueColor = "#2BB7D2";
  const falseColor = "#FFD099";

  return (
    <>
      {/* Conditionally render the bars based on showTrue and showFalse */}
      {showTrue && (
        <Bar 
          dataKey="valueTrue" 
          name="True"
          stackId="stack1"
          radius={showFalse ? [0, 0, 0, 0] : [2, 2, 0, 0]} 
          isAnimationActive={false}
          onMouseOver={handleMouseOver}
          fill={trueColor}
        />
      )}
      
      {showFalse && (
        <Bar 
          dataKey="valueFalse" 
          name="False"
          stackId="stack1"
          radius={[2, 2, 0, 0]} 
          isAnimationActive={false}
          onMouseOver={handleMouseOver}
          fill={falseColor}
        />
      )}
      
      {/* If neither True/False is specified, use the original value */}
      {!showTrue && !showFalse && (
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
      )}
    </>
  );
};

export default ChartBars;
