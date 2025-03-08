
import React from 'react';
import { ComposedChart, ResponsiveContainer, Tooltip } from 'recharts';
import { getXAxisInterval, getBarSize, calculateYAxisDomain } from '@/utils/chartUtils';
import CustomTooltip from './chart/CustomTooltip';
import { referenceLineMarkers } from '@/utils/chartReferenceLines';
import ChartAxes from './chart/ChartAxes';
import EvaluationBars from './chart/EvaluationBars';
import ChartLines from './chart/ChartLines';
import ChartReferenceLines from './chart/ChartReferenceLines';
import VersionMarkers from './chart/VersionMarkers';

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
  
  const yAxisDomain = calculateYAxisDomain(
    data, 
    showTrue, 
    showFalse,
    metricType
  );
  
  const useLineChart = (metricType === 'conversion' || metricType === 'errorRate');
  
  const trueColor = '#2BB7D2';
  const falseColor = '#FFD099';

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
          barGap={0}
          barCategoryGap={1}
        >
          <ChartAxes 
            interval={interval} 
            yAxisDomain={yAxisDomain} 
            valueFormatter={valueFormatter} 
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
          
          <ChartReferenceLines referenceLines={referenceLineMarkers} />
          
          {metricType === 'evaluations' && (
            <EvaluationBars 
              data={data}
              showTrue={showTrue}
              showFalse={showFalse}
              barSize={barSize}
              trueColor={trueColor}
              falseColor={falseColor}
              barColor={barColor}
            />
          )}
          
          {useLineChart && (
            <ChartLines 
              showTrue={showTrue}
              showFalse={showFalse}
              trueColor={trueColor}
              falseColor={falseColor}
            />
          )}
          
          <VersionMarkers versionChanges={versionChanges} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
