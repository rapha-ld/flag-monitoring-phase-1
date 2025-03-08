
import React from 'react';
import { Line } from 'recharts';

interface ChartLinesProps {
  showTrue: boolean;
  showFalse: boolean;
  trueColor: string;
  falseColor: string;
}

const ChartLines: React.FC<ChartLinesProps> = ({
  showTrue,
  showFalse,
  trueColor,
  falseColor
}) => {
  return (
    <>
      {showTrue && (
        <Line
          type="monotone"
          dataKey="valueTrue"
          name="True"
          stroke={trueColor}
          strokeWidth={3.5}
          dot={false}
          activeDot={{ r: 5 }}
          isAnimationActive={false}
        />
      )}
      
      {showFalse && (
        <Line
          type="monotone"
          dataKey="valueFalse"
          name="False"
          stroke={falseColor}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
          isAnimationActive={false}
        />
      )}
    </>
  );
};

export default ChartLines;
