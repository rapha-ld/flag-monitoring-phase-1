
import React from 'react';
import { 
  CartesianGrid, 
  ComposedChart, 
  Tooltip, 
  XAxis, 
  YAxis,
  ReferenceLine
} from 'recharts';
import { DataPoint } from '../BarChart';
import { calculateYAxisDomain, getXAxisInterval } from '@/utils/chartUtils';
import CustomTooltip from './CustomTooltip';
import { referenceLineMarkers, thresholdLines } from '@/utils/chartReferenceLines';
import VersionMarker from '../VersionMarker';

interface BaseChartProps {
  data: DataPoint[];
  children: React.ReactNode;
  barSize: number;
  valueFormatter?: (value: number) => string;
  tooltipValueFormatter?: (value: number) => string;
  tooltipLabelFormatter?: (label: string) => string;
  versionChanges?: Array<{
    date: string;
    position: number;
    version: string;
    details?: string;
  }>;
  showTrue?: boolean;
  showFalse?: boolean;
  chartType?: 'stacked' | 'mixed';
  metricType?: 'evaluations' | 'conversion' | 'errorRate';
  showAverage?: boolean;
}

const BaseChart = ({
  data,
  children,
  barSize,
  valueFormatter = (value) => `${value}`,
  tooltipValueFormatter = (value) => `${value}`,
  tooltipLabelFormatter = (label) => label,
  versionChanges = [],
  showTrue = true,
  showFalse = false,
  chartType = 'stacked',
  metricType,
  showAverage
}: BaseChartProps) => {
  const interval = getXAxisInterval(data.length);
  
  const yAxisDomain = calculateYAxisDomain(
    data, 
    showTrue, 
    showFalse,
    metricType
  );
  
  const visibleVersionChanges = versionChanges.filter(change => 
    change.position >= 0 && change.position < data.length
  );
  
  // Get the threshold line for this metric type, if any
  const thresholdLine = metricType ? thresholdLines.find(t => t.metricType === metricType) : undefined;

  return (
    <ComposedChart
      data={data}
      margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
      barGap={0}
      barCategoryGap={barSize * 2} // Increased gap between bar groups by 100%
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
          return `${date.getMonth() + 1}/${date.getDate()}`;
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
      
      {/* Horizontal threshold line */}
      {thresholdLine && (
        <ReferenceLine
          y={thresholdLine.value}
          label={{
            value: thresholdLine.label,
            position: 'right',
            fill: thresholdLine.color,
            fontSize: 12,
          }}
          stroke={thresholdLine.color}
          strokeDasharray={thresholdLine.strokeDasharray}
          strokeWidth={1.5}
        />
      )}
      
      {children}
      
      {visibleVersionChanges.map((change, index) => (
        <VersionMarker 
          key={`marker-${index}`}
          x={change.position}
          version={change.version}
          details={change.details}
        />
      ))}
    </ComposedChart>
  );
};

export default BaseChart;
