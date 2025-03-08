
import React from 'react';
import { Bar } from 'recharts';
import BarChartCell from './BarChartCell';
import { DataPoint } from '../BarChart';

interface EvaluationBarsProps {
  data: DataPoint[];
  showTrue: boolean;
  showFalse: boolean;
  barSize: number;
  trueColor: string;
  falseColor: string;
  barColor: string;
}

const EvaluationBars: React.FC<EvaluationBarsProps> = ({
  data,
  showTrue,
  showFalse,
  barSize,
  trueColor,
  falseColor,
  barColor
}) => {
  // Single bar for either true or false values
  if (!(showTrue && showFalse)) {
    return (
      <Bar
        dataKey={showTrue ? 'valueTrue' : showFalse ? 'valueFalse' : 'value'}
        name={showTrue ? 'True' : showFalse ? 'False' : 'Value'}
        fill={showTrue ? trueColor : showFalse ? falseColor : barColor}
        barSize={barSize}
        isAnimationActive={false}
        radius={[1, 1, 0, 0]}
      >
        {data.map((entry, index) => (
          <BarChartCell 
            key={`cell-${index}`} 
            index={index} 
            barColor={showTrue ? trueColor : showFalse ? falseColor : barColor} 
          />
        ))}
      </Bar>
    );
  }
  
  // Stacked bars for both true and false values
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

export default EvaluationBars;
