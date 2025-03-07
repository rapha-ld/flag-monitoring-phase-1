
import React from 'react';
import BarChartElement from './BarChartElement';
import LineChartElement from './LineChartElement';

interface ChartContentProps {
  chartType: 'stacked' | 'line-false';
  showTrue: boolean;
  showFalse: boolean;
  data: any[];
  handleMouseOver: (data: any, index: number) => void;
  activeIndex: number | null;
  trueColor: string;
  falseColor: string;
}

const ChartContent = ({ 
  chartType, 
  showTrue, 
  showFalse, 
  data, 
  handleMouseOver, 
  activeIndex,
  trueColor,
  falseColor 
}: ChartContentProps) => {
  return (
    <>
      {/* Conditionally render the bars based on showTrue and chartType */}
      {showTrue && (
        <BarChartElement 
          dataKey="valueTrue" 
          name="True"
          stackId={chartType === 'stacked' ? "stack1" : undefined}
          handleMouseOver={handleMouseOver}
          color={trueColor}
        />
      )}
      
      {/* Show False as bars only if stacked chart type */}
      {showFalse && chartType === 'stacked' && (
        <BarChartElement 
          dataKey="valueFalse" 
          name="False"
          stackId="stack1"
          handleMouseOver={handleMouseOver}
          color={falseColor}
        />
      )}
      
      {/* Show False as line when line-false chart type */}
      {showFalse && chartType === 'line-false' && (
        <LineChartElement
          dataKey="valueFalse"
          name="False"
          color={falseColor}
        />
      )}
      
      {/* If neither True/False is specified, use the original value */}
      {!showTrue && !showFalse && (
        <BarChartElement 
          dataKey="value" 
          handleMouseOver={handleMouseOver}
          data={data}
          activeIndex={activeIndex}
        />
      )}
    </>
  );
};

export default ChartContent;
