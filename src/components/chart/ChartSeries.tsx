
import React from 'react';
import { Bar, Line } from 'recharts';
import BarChartCell from './BarChartCell';
import { DataPoint } from '../BarChart';

interface ChartSeriesProps {
  data: DataPoint[];
  metricType?: 'evaluations' | 'conversion' | 'errorRate';
  showTrue: boolean;
  showFalse: boolean;
  barSize: number;
  trueColor: string;
  falseColor: string;
  barColor: string;
}

const ChartSeries = ({
  data,
  metricType,
  showTrue,
  showFalse,
  barSize,
  trueColor,
  falseColor,
  barColor
}: ChartSeriesProps) => {
  const useLineChart = (metricType === 'conversion' || metricType === 'errorRate');
  
  if (useLineChart) {
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
  }

  if (metricType === 'evaluations' && !(showTrue && showFalse)) {
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

  if (metricType === 'evaluations' && showTrue && showFalse) {
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
  }

  return null;
};

export default ChartSeries;
