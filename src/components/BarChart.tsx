
import React from 'react';
import { CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts';
import { getXAxisInterval, getBarSize, calculateYAxisDomain } from '@/utils/chartUtils';
import VersionMarker from './VersionMarker';
import CustomTooltip from './chart/CustomTooltip';
import { referenceLineMarkers, thresholdLines } from '@/utils/chartReferenceLines';
import { getEventNameFromVersion } from '@/utils/eventUtils';
import { findSelectedDataPoints } from '@/utils/chartSelectionUtils';
import ChartReferenceElements from './chart/ChartReferenceElements';
import ChartSeries from './chart/ChartSeries';

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
  
  const trueColor = '#2BB7D2';
  const falseColor = '#FFD099';
  const textGray = '#545A62';

  const thresholdLine = metricType ? thresholdLines.find(t => t.metricType === metricType) : undefined;

  const selectedPoints = findSelectedDataPoints(data, selectedTimestamp, selectedTimestamps);

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
          
          <ChartReferenceElements 
            thresholdLine={thresholdLine}
            selectedPoints={selectedPoints}
            textGray={textGray}
          />
          
          <ChartSeries 
            data={data}
            metricType={metricType}
            showTrue={showTrue}
            showFalse={showFalse}
            barSize={barSize}
            trueColor={trueColor}
            falseColor={falseColor}
            barColor={barColor}
          />
          
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
