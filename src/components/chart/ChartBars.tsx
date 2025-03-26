
import React from 'react';
import { Bar } from 'recharts';
import BarChartCell from './BarChartCell';
import { DataPoint } from './types';

interface ChartBarsProps {
  data: DataPoint[];
  showTrue: boolean;
  showFalse: boolean;
  barSize: number;
  barColor: string;
}

const ChartBars = ({ data, showTrue, showFalse, barSize, barColor }: ChartBarsProps) => {
  const trueColor = '#2BB7D2';
  const falseColor = '#FFD099';
  
  if (!(showTrue && showFalse)) {
    return (
      <Bar
        dataKey={showTrue ? 'valueTrue' : showFalse ? 'valueFalse' : 'value'}
        name={showTrue ? 'True' : showFalse ? 'False' : 'Value'}
        fill={showTrue ? trueColor : showFalse ? falseColor : barColor}
        barSize={barSize}
        isAnimationActive={false}
        radius={[1, 1, 0, 0]}
        stroke="#FFFFFF"  // 1px white contour
        strokeWidth={1}
      >
        {data.map((entry, index) => (
          <BarChartCell 
            key={`cell-${index}`} 
            index={index} 
            barColor={showTrue ? trueColor : showFalse ? falseColor : barColor} 
            opacity={1}
          />
        ))}
      </Bar>
    );
  }
  
  return (
    <>
      <Bar
        dataKey="valueTrue"
        name="True"
        stackId="a"
        fill={trueColor}
        barSize={barSize}
        isAnimationActive={false}
        radius={[1, 1, 0, 0]}
        stroke="#FFFFFF"  // 1px white contour
        strokeWidth={1}
      >
        {data.map((entry, index) => (
          <BarChartCell 
            key={`true-cell-${index}`} 
            index={index} 
            barColor={trueColor}
            opacity={1}
          />
        ))}
      </Bar>
      <Bar
        dataKey="valueFalse"
        name="False"
        stackId="a"
        fill={falseColor}
        barSize={barSize}
        isAnimationActive={false}
        radius={[0, 0, 0, 0]}
        stroke="#FFFFFF"  // 1px white contour
        strokeWidth={1}
      >
        {data.map((entry, index) => (
          <BarChartCell 
            key={`false-cell-${index}`} 
            index={index} 
            barColor={falseColor}
            opacity={1}
          />
        ))}
      </Bar>
    </>
  );
};

export default ChartBars;
