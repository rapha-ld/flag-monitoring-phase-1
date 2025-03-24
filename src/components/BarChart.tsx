
import React, { useState, useRef, useCallback } from 'react';
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
  onRangeSelect?: (startIndex: number, endIndex: number, dates: Date[]) => void;
}

interface ChartViewBox {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  cx?: number;
  cy?: number;
  innerRadius?: number;
  outerRadius?: number;
  [key: string]: any;
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
  onRangeSelect
}: BarChartProps) => {
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

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
  const textGray = '#545A62';
  const selectionColor = '#9b87f5';  // Purple color for selection

  const thresholdLine = metricType ? thresholdLines.find(t => t.metricType === metricType) : undefined;

  // Get index from name
  const getIndexFromName = (name: string): number => {
    return data.findIndex(item => item.name === name);
  };

  // Mouse down event handler
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!chartRef.current) return;
    
    // Get chart bounds
    const chartRect = chartRef.current.getBoundingClientRect();
    const chartWidth = chartRect.width;
    const mouseX = e.clientX - chartRect.left;
    
    // Calculate relative position (0-1)
    const relativeX = mouseX / chartWidth;
    
    // Get closest data point
    const index = Math.floor(relativeX * data.length);
    if (index >= 0 && index < data.length) {
      setRefAreaLeft(data[index].name);
      setIsSelecting(true);
    }
  }, [data]);
  
  // Mouse move event handler
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelecting || !chartRef.current || !refAreaLeft) return;
    
    const chartRect = chartRef.current.getBoundingClientRect();
    const chartWidth = chartRect.width;
    const mouseX = e.clientX - chartRect.left;
    
    // Calculate relative position (0-1)
    const relativeX = mouseX / chartWidth;
    
    // Get closest data point
    const index = Math.min(data.length - 1, Math.max(0, Math.floor(relativeX * data.length)));
    if (index >= 0 && index < data.length) {
      setRefAreaRight(data[index].name);
    }
  }, [isSelecting, refAreaLeft, data]);
  
  // Mouse up event handler
  const handleMouseUp = useCallback(() => {
    if (!isSelecting || !refAreaLeft || !refAreaRight) {
      setIsSelecting(false);
      setRefAreaLeft(null);
      setRefAreaRight(null);
      return;
    }
    
    let startIndex = getIndexFromName(refAreaLeft);
    let endIndex = getIndexFromName(refAreaRight);
    
    // Make sure start is before end
    if (startIndex > endIndex) {
      [startIndex, endIndex] = [endIndex, startIndex];
    }
    
    // Don't trigger if it's just a click (same point)
    if (startIndex !== endIndex && onRangeSelect) {
      // Get the dates for the selected range
      const selectedDates = data
        .slice(startIndex, endIndex + 1)
        .map(point => {
          if (point.date) {
            return new Date(point.date);
          } else if (point.name && !isNaN(new Date(point.name).getTime())) {
            return new Date(point.name);
          }
          return null;
        })
        .filter((date): date is Date => date !== null);
      
      onRangeSelect(startIndex, endIndex, selectedDates);
    }
    
    setIsSelecting(false);
    setRefAreaLeft(null);
    setRefAreaRight(null);
  }, [isSelecting, refAreaLeft, refAreaRight, data, onRangeSelect]);
  
  // Mouse leave event handler
  const handleMouseLeave = useCallback(() => {
    if (isSelecting) {
      setIsSelecting(false);
      setRefAreaLeft(null);
      setRefAreaRight(null);
    }
  }, [isSelecting]);

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
  
  const showReferenceArea = (firstPoint && lastPoint) || (refAreaLeft && refAreaRight);

  // Remove conditional opacity - always using full opacity to make selection clear
  const getPointOpacity = () => 1;

  return (
    <div 
      className="w-full h-full relative"
      ref={chartRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: isSelecting ? 'col-resize' : 'crosshair' }}
    >
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
          
          {/* Reference lines for markers */}
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
                    y={(viewBox?.y ?? 0) - 10} // Increased space between line and label
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
          
          {/* Threshold line */}
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
          
          {/* Reference area for user selection */}
          {isSelecting && refAreaLeft && refAreaRight && (
            <ReferenceArea
              x1={refAreaLeft}
              x2={refAreaRight}
              fill={selectionColor}
              fillOpacity={0.1}
              stroke={selectionColor}
              strokeOpacity={0.5}
              strokeWidth={1}
            />
          )}
          
          {/* Reference area for selected time range - MODIFIED to make it more visible */}
          {showReferenceArea && firstPoint && lastPoint && (
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
          
          {/* Reference lines for selected points */}
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
                      y={(viewBox?.y ?? 0) - 12} // Increased space between line and label
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
          
          {/* For evaluation metrics with only one visibility option */}
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
                  opacity={getPointOpacity()}
                />
              ))}
            </Bar>
          )}
          
          {/* For evaluation metrics with both True and False visibility */}
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
                className="stroke-[#FFD099] stroke-[1px]"
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
          
          {/* Line charts for conversion and error rate metrics */}
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
          
          {/* Version markers */}
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
