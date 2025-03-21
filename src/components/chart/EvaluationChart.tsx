
import React from 'react';
import { Bar } from 'recharts';
import { DataPoint } from '../BarChart';
import BarChartCell from './BarChartCell';

interface EvaluationChartProps {
  data: DataPoint[];
  barSize: number;
  showTrue: boolean;
  showFalse: boolean;
}

const EvaluationChart = ({
  data,
  barSize,
  showTrue,
  showFalse
}: EvaluationChartProps) => {
  const trueColor = '#2BB7D2';
  const falseColor = '#FFD099';

  // Single bar chart (either true or false)
  if (!(showTrue && showFalse)) {
    return (
      <Bar
        dataKey={showTrue ? 'valueTrue' : showFalse ? 'valueFalse' : 'value'}
        name={showTrue ? 'True' : showFalse ? 'False' : 'Value'}
        fill={showTrue ? trueColor : showFalse ? falseColor : '#6E6F96'}
        barSize={barSize}
        isAnimationActive={false}
        radius={[1, 1, 0, 0]}
      >
        {data.map((entry, index) => (
          <BarChartCell 
            key={`cell-${index}`} 
            index={index} 
            barColor={showTrue ? trueColor : showFalse ? falseColor : '#6E6F96'} 
          />
        ))}
      </Bar>
    );
  }
  
  // Stacked bar chart (both true and false)
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
        className="stroke-[#2BB7D2] stroke-[1px]"
      />
      <Bar
        dataKey="valueFalse"
        name="False"
        stackId="a"
        fill={falseColor}
        barSize={barSize}
        isAnimationActive={false}
        radius={[0, 0, 0, 0]}
        className="stroke-[#FFD099] stroke-[1px]"
      />
    </>
  );
};

export default EvaluationChart;
