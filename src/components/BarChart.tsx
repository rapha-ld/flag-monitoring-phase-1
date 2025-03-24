import React from 'react';
import { Bar, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceArea } from 'recharts';
import { getXAxisInterval, getBarSize, calculateYAxisDomain } from '@/utils/chartUtils';
import VersionMarker from './VersionMarker';
import CustomTooltip from './chart/CustomTooltip';
import { referenceLineMarkers, thresholdLines } from '@/utils/chartReferenceLines';
import { format } from 'date-fns';
import BarChartCell from './chart/BarChartCell';
import { Flag, AlertTriangle, RefreshCw } from 'lucide-react';

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
  eventType?: 'feature' | 'bug' | 'update';
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
  selectedTimestamps
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

  const getEventIcon = (eventType?: string) => {
    switch(eventType) {
      case 'feature':
        return <Flag size={14} />;
      case 'bug':
        return <AlertTriangle size={14} />;
      case 'update':
        return <RefreshCw size={14} />;
      default:
        return <Flag size={14} />;
    }
  };

  return (
    <div className="w-full h-full">
      <style>
        {`
          .recharts-reference-line {
            z-index: 1;
          }
          .threshold-line {
            z-index: 10 !important;
          }
        `}
      </style>
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
          
          {referenceLineMarkers.map((marker, index) => (
            <ReferenceLine
              key={`ref-line-${index}`}
              x={marker.date}
              stroke="#545A62"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              label={{
                position: 'top',
                content: () => (
                  <foreignObject width={20} height={20} x={-10} y={-20}>
                    <div style={{ color: '#545A62', display: 'flex', justifyContent: 'center' }}>
                      {marker.label === 'Feature Release' && <Flag size={14} />}
                      {marker.label === 'Bug Fix' && <AlertTriangle size={14} />}
                      {marker.label === 'Major Update' && <RefreshCw size={14} />}
                    </div>
                  </foreignObject>
                ),
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
              className="threshold-line"
            />
          )}
          
          {showReferenceArea && (
            <ReferenceArea
              x1={firstPoint.name}
              x2={lastPoint.name}
              fill="#f1f1f4"
              fillOpacity={0.5}
            />
          )}
          
          {hasSelectedPoints && selectedPoints.map((point, index) => (
            <ReferenceLine
              key={`selected-time-${index}`}
              x={point.name}
              stroke="#7c5cfc"
              strokeWidth={2}
              label={index === 0 || index === selectedPoints.length - 1 ? {
                value: format(point.exactTime, "MMM d, h:mm a"),
                position: 'top',
                fill: '#7c5cfc',
                fontSize: 12,
              } : undefined}
            />
          ))}
          
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
              eventType={change.eventType}
              color="#545A62"
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
