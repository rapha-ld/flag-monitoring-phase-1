import React, { useState } from 'react';
import { Bar, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceArea } from 'recharts';
import { getXAxisInterval, getBarSize, calculateYAxisDomain } from '@/utils/chartUtils';
import VersionMarker from './VersionMarker';
import CustomTooltip from './chart/CustomTooltip';
import { referenceLineMarkers, thresholdLines } from '@/utils/chartReferenceLines';
import { format } from 'date-fns';
import BarChartCell from './chart/BarChartCell';
import { getEventIcon, determineEventName, isPointInSelectedRange, getEventNameFromVersion } from '@/utils/eventUtils';

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
  selectedTimestamps?: Date[] | null;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
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
  selectedTimestamp,
  selectedTimestamps,
  hoveredTimestamp,
  onHoverTimestamp
}: BarChartProps) => {
  const interval = getXAxisInterval(data.length);
  const calculatedBarSize = getBarSize(data.length);
  
  const barSize = Math.max(4, calculatedBarSize * 0.9);
  const barGap = 2;
  const barCategoryGap = Math.max(4, calculatedBarSize * 0.2);
  
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
  const textGray = '#545A62';

  const thresholdLine = metricType ? thresholdLines.find(t => t.metricType === metricType) : undefined;

  const findSelectedDataPoints = () => {
    if ((!selectedTimestamp && !selectedTimestamps) || data.length === 0) return null;
    
    const timestamps = selectedTimestamps || (selectedTimestamp ? [selectedTimestamp] : []);
    
    if (timestamps.length === 0) return null;
    
    const dataPoints = data.map((point, index) => {
      const pointDate = point.date ? new Date(point.date) : 
                       (point.name && !isNaN(new Date(point.name).getTime()) ? 
                       new Date(point.name) : null);
      
      return {
        ...point,
        index,
        timestamp: pointDate ? pointDate.getTime() : null
      };
    }).filter(point => point.timestamp !== null);
    
    if (dataPoints.length === 0) return null;
    
    return timestamps.map(selectedTime => {
      const selectedTimeMs = selectedTime.getTime();
      let closestPoint = dataPoints[0];
      let minDiff = Math.abs(dataPoints[0].timestamp! - selectedTimeMs);
      
      for (let i = 1; i < dataPoints.length; i++) {
        const diff = Math.abs(dataPoints[i].timestamp! - selectedTimeMs);
        if (diff < minDiff) {
          minDiff = diff;
          closestPoint = dataPoints[i];
        }
      }
      
      return {
        ...closestPoint,
        exactTime: selectedTime
      };
    }).sort((a, b) => a.timestamp! - b.timestamp!);
  };
  
  const selectedPoints = findSelectedDataPoints();
  const hasSelectedPoints = selectedPoints && selectedPoints.length > 0;
  
  const firstPoint = hasSelectedPoints ? selectedPoints[0] : null;
  const lastPoint = hasSelectedPoints && selectedPoints.length > 1 
    ? selectedPoints[selectedPoints.length - 1] 
    : null;
  
  const showReferenceArea = firstPoint && lastPoint;

  const getPointOpacity = () => 1;

  const handleMouseMove = (e: any) => {
    if (e && e.activeLabel && onHoverTimestamp) {
      onHoverTimestamp(e.activeLabel);
    }
  };

  const handleMouseLeave = () => {
    if (onHoverTimestamp) {
      onHoverTimestamp(null);
    }
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
          barGap={barGap}
          barCategoryGap={barCategoryGap}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
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
              const date = new Date(value);
              return isNaN(date.getTime()) 
                ? value
                : `${date.getMonth() + 1}/${date.getDate()}`;
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
          
          {hoveredTimestamp && (
            <ReferenceLine
              x={hoveredTimestamp}
              stroke="#6E6F96"
              strokeWidth={1}
              strokeDasharray="3 3"
              isFront={true}
            />
          )}
          
          {referenceLineMarkers.map((marker, index) => (
            <ReferenceLine
              key={`ref-line-${index}`}
              x={marker.date}
              stroke={marker.color}
              strokeWidth={2}
              strokeDasharray="3 3"
              label={{
                position: 'top',
                content: ({ viewBox }: { viewBox: ChartViewBox }) => (
                  <text
                    x={viewBox?.x ?? 0}
                    y={(viewBox?.y ?? 0) - 10}
                    fontSize={11}
                    textAnchor="middle"
                    fill={marker.color}
                    fontWeight="bold"
                  >
                    {marker.label}
                  </text>
                )
              }}
            />
          ))}
          
          {thresholdLine && (
            <ReferenceLine
              y={thresholdLine.value}
              label={{
                position: thresholdLine.labelPosition.position as any,
                content: ({ viewBox }: { viewBox: ChartViewBox }) => (
                  <text
                    x={(viewBox?.x ?? 0) + 5}
                    y={viewBox?.y ?? 0}
                    fontSize={11}
                    textAnchor="start"
                    fill={thresholdLine.color}
                  >
                    {thresholdLine.label}
                  </text>
                )
              }}
              stroke={thresholdLine.color}
              strokeDasharray={thresholdLine.strokeDasharray}
              strokeWidth={1.5}
            />
          )}
          
          {showReferenceArea && (
            <ReferenceArea
              x1={firstPoint.name}
              x2={lastPoint.name}
              fill="#6E6F96"
              fillOpacity={0.1}
              stroke="#6E6F96"
              strokeOpacity={0.3}
              strokeWidth={1}
            />
          )}
          
          {hasSelectedPoints && selectedPoints.map((point, index) => {
            const icon = getEventIcon(point.exactTime);
            const formattedDate = format(point.exactTime, "MMM d");
            
            const eventName = determineEventName(point.exactTime);
            
            return (
              <ReferenceLine
                key={`selected-time-${index}`}
                x={point.name}
                stroke={textGray}
                strokeWidth={1.5}
                label={index === 0 || index === selectedPoints.length - 1 ? {
                  position: 'top',
                  content: ({ viewBox }: { viewBox: ChartViewBox }) => (
                    <text
                      x={viewBox?.x ?? 0}
                      y={(viewBox?.y ?? 0) - 12}
                      fontSize={11}
                      textAnchor="middle"
                      fill={textGray}
                    >
                      {eventName || formattedDate}
                    </text>
                  )
                } : undefined}
              />
            );
          })}
          
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
          
          {visibleVersionChanges.map((change, index) => (
            <VersionMarker 
              key={`marker-${index}`}
              x={change.position}
              version={change.version}
              details={change.details}
              date={change.date}
              eventName={getEventNameFromVersion(change.version)}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
