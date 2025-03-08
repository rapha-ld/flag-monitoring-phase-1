
import React from 'react';
import { Bar, CartesianGrid, Cell, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getXAxisInterval, getBarSize, calculateYAxisDomain } from '@/utils/chartUtils';
import VersionMarker from './VersionMarker';
import CustomTooltip from './chart/CustomTooltip';
import BarChartCell from './chart/BarChartCell';
import { referenceLineMarkers } from '@/utils/chartReferenceLines';

export interface DataPoint {
  name: string;
  value: number;
  valueTrue?: number;
  valueFalse?: number;
  valueAvg?: number;
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
  metricType
}: BarChartProps) => {
  const interval = getXAxisInterval(data.length);
  const barSize = getBarSize(data.length);
  const showAverage = showTrue && showFalse && (metricType === 'conversion' || metricType === 'errorRate');
  
  // Calculate y-axis domain
  const yAxisDomain = calculateYAxisDomain(
    data, 
    showTrue, 
    showFalse,
    metricType
  );
  
  // Only show the version markers that are within the visible data range
  const visibleVersionChanges = versionChanges.filter(change => 
    change.position >= 0 && change.position < data.length
  );
  
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
          barGap={0}
          barCategoryGap={1}
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
              return `${date.getDate()}/${date.getMonth() + 1}`;
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
          />
          
          {/* Reference lines for important dates */}
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
          
          {/* If showing mixed or both variants are selected */}
          {chartType === 'mixed' || (showTrue && showFalse) ? (
            <>
              {/* Only render stacked bars for the evaluations metric */}
              {metricType === 'evaluations' && showTrue && showFalse && (
                <Bar 
                  dataKey="valueTrue" 
                  name="True" 
                  fill="#2BB7D2" 
                  stackId="a"
                  barSize={barSize} 
                  isAnimationActive={false}
                />
              )}
              
              {metricType === 'evaluations' && showTrue && showFalse && (
                <Bar 
                  dataKey="valueFalse" 
                  name="False" 
                  fill="#9CA3AF" 
                  stackId="a"
                  barSize={barSize} 
                  isAnimationActive={false}
                />
              )}
              
              {/* For conversion and error rates, show bars and lines when both variants are selected */}
              {(metricType === 'conversion' || metricType === 'errorRate') && showTrue && showFalse && (
                <Bar
                  dataKey="valueAvg"
                  name="Average"
                  fill="#6E6F96"
                  barSize={barSize}
                  isAnimationActive={false}
                />
              )}
              
              {/* Show line chart only for conversion and error rate metrics with both variants */}
              {(metricType === 'conversion' || metricType === 'errorRate') && showFalse && (
                <Line
                  type="monotone"
                  dataKey="valueFalse"
                  name="False"
                  stroke="#9CA3AF"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              )}
              
              {/* Individual True variant - used for all metrics */}
              {showTrue && !(showTrue && showFalse && metricType === 'evaluations') && (
                <Bar
                  dataKey={showTrue && showFalse && (metricType === 'conversion' || metricType === 'errorRate') ? 'valueAvg' : 'valueTrue'}
                  name={showTrue && showFalse ? 'Average' : 'True'}
                  fill={showTrue && showFalse ? '#6E6F96' : '#2BB7D2'}
                  barSize={barSize}
                  isAnimationActive={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={barColor} />
                  ))}
                </Bar>
              )}
            </>
          ) : (
            // Simple bar chart (either showing True only, False only, or original value)
            <Bar
              dataKey={showTrue ? 'valueTrue' : showFalse ? 'valueFalse' : 'value'}
              name={showTrue ? 'True' : showFalse ? 'False' : 'Value'}
              fill={showTrue ? '#2BB7D2' : showFalse ? '#9CA3AF' : barColor}
              barSize={barSize}
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <BarChartCell key={`cell-${index}`} index={index} data={data} barColor={barColor} />
              ))}
            </Bar>
          )}
          
          {/* Version markers */}
          {visibleVersionChanges.map((change, index) => (
            <VersionMarker 
              key={`marker-${index}`}
              position={change.position} 
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
