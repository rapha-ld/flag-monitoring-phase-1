
import React from 'react';
import { Bar, Line } from 'recharts';
import BarChartCell from './BarChartCell';

interface BarChartSeriesProps {
  data: any[];
  metricType?: 'evaluations' | 'conversion' | 'errorRate';
  showTrue: boolean;
  showFalse: boolean;
  barSize: number;
  trueColor: string;
  falseColor: string;
  barColor: string;
  getPointOpacity: () => number;
}

const BarChartSeries: React.FC<BarChartSeriesProps> = ({
  data,
  metricType,
  showTrue,
  showFalse,
  barSize,
  trueColor,
  falseColor,
  barColor,
  getPointOpacity
}) => {
  const useLineChart = (metricType === 'conversion' || metricType === 'errorRate');
  
  return (
    <>
      {metricType === 'evaluations' && !(showTrue && showFalse) && (
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
              opacity={getPointOpacity()}
            />
          ))}
        </Bar>
      )}
      
      {metricType === 'evaluations' && showTrue && showFalse && (
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
                opacity={getPointOpacity()}
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
                opacity={getPointOpacity()}
              />
            ))}
          </Bar>
        </>
      )}
      
      {useLineChart && showTrue && (
        <Line
          type="monotone"
          dataKey="valueTrue"
          name="True"
          stroke={trueColor}
          strokeWidth={3.5}
          dot={false}
          activeDot={{ r: 5 }}
          isAnimationActive={false}
          strokeOpacity={1}
        />
      )}
      
      {useLineChart && showFalse && (
        <Line
          type="monotone"
          dataKey="valueFalse"
          name="False"
          stroke={falseColor}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
          isAnimationActive={false}
          strokeOpacity={1}
        />
      )}
    </>
  );
};

export default BarChartSeries;
