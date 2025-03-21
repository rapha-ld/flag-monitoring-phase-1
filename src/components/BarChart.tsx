
import React from 'react';
import { CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getXAxisInterval, getBarSize, calculateYAxisDomain } from '@/utils/chartUtils';
import CustomTooltip from './chart/CustomTooltip';
import ChartReferenceLines from './chart/ChartReferenceLines';
import ChartSeries from './chart/ChartSeries';
import ChartVersionMarkers from './chart/ChartVersionMarkers';

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
  
  const findSelectedDataPoint = () => {
    if (!selectedTimestamp || data.length === 0) return null;
    
    const dataPoints = data.map(point => {
      const pointDate = new Date(point.date || point.name);
      return {
        ...point,
        timestamp: pointDate.getTime()
      };
    });
    
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
          
          <ChartReferenceLines 
            metricType={metricType}
            selectedTimestamp={selectedTimestamp}
            selectedPoint={selectedPoint}
          />
          
          <ChartSeries 
            data={data}
            showTrue={showTrue}
            showFalse={showFalse}
            metricType={metricType}
            chartType={chartType}
            barSize={barSize}
            barColor={barColor}
          />
          
          <ChartVersionMarkers versionChanges={versionChanges} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
