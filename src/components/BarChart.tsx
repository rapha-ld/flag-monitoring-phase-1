import React from 'react';
import { Bar, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getXAxisInterval, getBarSize, calculateYAxisDomain } from '@/utils/chartUtils';
import VersionMarker from './VersionMarker';
import CustomTooltip from './chart/CustomTooltip';
import { referenceLineMarkers, thresholdLines } from '@/utils/chartReferenceLines';
import { format } from 'date-fns';

export interface DataPoint {
  name: string;
  value: number;
  valueTrue?: number;
  valueFalse?: number;
  valueAvg?: number;
  date?: string;
  [key: string]: any;
}

export interface VersionChange {
  date: string;
  position: number;
  version: string;
  details?: string;
}

interface BarChartProps {
  data: DataPoint[];
  height?: number;
  barColor?: string;
  valueFormatter?: (value: number) => string;
  tooltipValueFormatter?: (value: number) => string;
  tooltipLabelFormatter?: (label: string) => string;
  versionChanges?: VersionChange[];
  showTrue?: boolean;
  showFalse?: boolean;
  chartType?: 'stacked' | 'mixed';
  metricType?: 'evaluations' | 'conversion' | 'errorRate';
  selectedTimestamp?: Date | null;
}

const BarChart = ({
  data,
  height = 350,
  barColor = '#6E6F96',
  valueFormatter = (value) => `${value}`,
  tooltipValueFormatter = (value) => `${value}`,
  tooltipLabelFormatter = (label) => label,
  versionChanges = [],
  showTrue = true,
  showFalse = false,
  chartType = 'stacked',
  metricType,
  selectedTimestamp
}: BarChartProps) => {
  const interval = getXAxisInterval(data.length);
  const calculatedBarSize = getBarSize(data.length);
  const barSize = Math.floor(calculatedBarSize * 0.9);
  const showAverage = showTrue && showFalse && (metricType === 'conversion' || metricType === 'errorRate');
  
  const yAxisDomain = calculateYAxisDomain(
    data, 
    showTrue, 
    showFalse,
    metricType
  );
  
  const visibleVersionChanges = versionChanges.filter(change => 
    change.position >= 0 && change.position < data.length
  );
  
  const useLineChart = (metricType === 'conversion' || metricType === 'errorRate');
  
  const trueColor = '#2BB7D2';
  const falseColor = '#FFD099';

  const thresholdLine = metricType ? thresholdLines.find(t => t.metricType === metricType) : undefined;

  // Find the data point name that corresponds to the selected timestamp
  const findSelectedDataPoint = () => {
    if (!selectedTimestamp || data.length === 0) return null;
    
    // Convert all data points' dates to timestamps for comparison
    const dataPoints = data.map(point => {
      const pointDate = new Date(point.date || point.name);
      return {
        ...point,
        timestamp: pointDate.getTime()
      };
    });
    
    // Find the closest data point to the selected timestamp
    const selectedTime = selectedTimestamp.getTime();
    let closestPoint = dataPoints[0];
    let minDiff = Math.abs(dataPoints[0].timestamp - selectedTime);
    
    for (let i = 1; i < dataPoints.length; i++) {
      const diff = Math.abs(dataPoints[i].timestamp - selectedTime);
      if (diff < minDiff) {
        minDiff = diff;
        closestPoint = dataPoints[i];
      }
    }
    
    return closestPoint;
  };
  
  const selectedPoint = findSelectedDataPoint();
  const hasSelectedTimestamp = !!selectedPoint;

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
          barGap={0}
          barCategoryGap={barSize * 2}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#E5E7EB" 
          />
          <XAxis 
            dataKey="name" 
            fontSize={10}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => {
              // Parse the date from value (which could be in various formats)
              const date = new Date(value);
              return isNaN(date.getTime()) 
                ? value // If not a valid date, use the original value
                : `${date.getMonth() + 1}/${date.getDate()}`; // Format as "M/D"
            }}
            interval={interval}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis 
            fontSize={10}
            axisLine={false}
            tickLine={false}
            domain={yAxisDomain}
            allowDataOverflow={true}
            tickFormatter={valueFormatter}
          />
          <Tooltip 
            content={
              <CustomTooltip 
                tooltipValueFormatter={tooltipValueFormatter}
                tooltipLabelFormatter={tooltipLabelFormatter}
                showTrue={showTrue}
                showFalse={showFalse}
                chartType={chartType}
                metricType={metricType}
                showAverage={showAverage}
              />
            }
            trigger="hover"
            isAnimationActive={false}
          />
          
          {referenceLineMarkers.map((marker, index) => (
            <ReferenceLine
              key={`ref-line-${index}`}
              x={marker.date}
              stroke={marker.color}
              strokeWidth={2}
              strokeDasharray="3 3"
              label={{
                value: marker.label,
                position: 'top',
                fill: marker.color,
                fontSize: 16,
                fontWeight: 'bold',
              }}
            />
          ))}
          
          {thresholdLine && (
            <ReferenceLine
              y={thresholdLine.value}
              label={{
                value: thresholdLine.label,
                position: thresholdLine.labelPosition.position as any,
                offset: thresholdLine.labelPosition.offset,
                fill: thresholdLine.color,
                fontSize: 11,
                dx: 5
              }}
              stroke={thresholdLine.color}
              strokeDasharray={thresholdLine.strokeDasharray}
              strokeWidth={1.5}
            />
          )}
          
          {/* Selected timestamp vertical reference line */}
          {hasSelectedTimestamp && selectedPoint && (
            <ReferenceLine
              x={selectedPoint.name}
              stroke="#7c5cfc"
              strokeWidth={2}
              label={{
                value: format(selectedTimestamp!, "MMM d, h:mm a"),
                position: 'top',
                fill: '#7c5cfc',
                fontSize: 12,
              }}
            />
          )}
          
          {metricType === 'evaluations' && !(showTrue && showFalse) && (
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
            />
          )}
          
          {visibleVersionChanges.map((change, index) => (
            <VersionMarker 
              key={`marker-${index}`}
              x={change.position}
              version={change.version}
              details={change.details}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
