
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import BarChart from '../BarChart';
import { DataPoint, VersionChange } from '../BarChart';
import MetricCardHeader from './MetricCardHeader';
import { calculateDisplayValue } from '@/utils/metricValueCalculator';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  info?: string;
  className?: string;
  children?: React.ReactNode;
  chartData?: DataPoint[];
  versionChanges?: VersionChange[];
  barColor?: string;
  valueFormatter?: (value: number) => string;
  tooltipValueFormatter?: (value: number) => string;
  tooltipLabelFormatter?: (label: string) => string;
  timeframe?: string;
  isTotal?: boolean;
  showTrue?: boolean;
  showFalse?: boolean;
  chartType?: 'stacked' | 'mixed';
  metricType?: 'evaluations' | 'conversion' | 'errorRate';
  selectedTimestamp?: Date | null;
}

const MetricCard = ({ 
  title, 
  value, 
  change, 
  info, 
  className, 
  children,
  chartData,
  versionChanges,
  barColor = "#6E6F96",
  valueFormatter,
  tooltipValueFormatter,
  tooltipLabelFormatter,
  timeframe,
  isTotal = false,
  showTrue,
  showFalse,
  chartType = 'stacked',
  metricType,
  selectedTimestamp
}: MetricCardProps) => {
  // Determine if we should show average values (only for conversion and error rate when both variants selected)
  const showAverage = showTrue && showFalse && (metricType === 'conversion' || metricType === 'errorRate');
  
  // Get the display value based on the selected variants
  const displayValue = calculateDisplayValue(value, chartData, showTrue, showFalse, metricType);
  
  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in", className)}>
      <MetricCardHeader 
        title={title}
        value={displayValue}
        change={change}
        info={info}
        timeframe={timeframe}
      />
      <CardContent className="p-0">
        {chartData && chartData.length > 0 ? (
          <BarChart
            data={chartData}
            versionChanges={versionChanges}
            barColor={barColor}
            height={160}
            valueFormatter={valueFormatter}
            tooltipValueFormatter={tooltipValueFormatter}
            tooltipLabelFormatter={tooltipLabelFormatter}
            showTrue={showTrue}
            showFalse={showFalse}
            chartType={chartType}
            metricType={metricType}
            selectedTimestamp={selectedTimestamp}
          />
        ) : children}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
