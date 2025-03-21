
import React from 'react';
import { getBarSize } from '@/utils/chartUtils';
import ChartContainer from './chart/ChartContainer';
import BaseChart from './chart/BaseChart';
import EvaluationChart from './chart/EvaluationChart';
import MetricLineChart from './chart/MetricLineChart';

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
  // Make bars 10% more narrow
  const calculatedBarSize = getBarSize(data.length);
  const barSize = Math.floor(calculatedBarSize * 0.9);
  
  const showAverage = showTrue && showFalse && (metricType === 'conversion' || metricType === 'errorRate');
  const useLineChart = (metricType === 'conversion' || metricType === 'errorRate');

  return (
    <ChartContainer height={height}>
      <BaseChart
        data={data}
        barSize={barSize}
        valueFormatter={valueFormatter}
        tooltipValueFormatter={tooltipValueFormatter}
        tooltipLabelFormatter={tooltipLabelFormatter}
        versionChanges={versionChanges}
        showTrue={showTrue}
        showFalse={showFalse}
        chartType={chartType}
        metricType={metricType}
        showAverage={showAverage}
      >
        {metricType === 'evaluations' && (
          <EvaluationChart 
            data={data}
            barSize={barSize}
            showTrue={showTrue}
            showFalse={showFalse}
          />
        )}
        
        {useLineChart && (
          <MetricLineChart 
            data={data}
            showTrue={showTrue}
            showFalse={showFalse}
          />
        )}
      </BaseChart>
    </ChartContainer>
  );
};

export default BarChart;
