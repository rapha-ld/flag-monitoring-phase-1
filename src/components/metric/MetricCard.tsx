
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DataPoint, VersionChange } from '../BarChart';
import MetricCardHeader from './MetricCardHeader';
import { calculateDisplayValue } from '@/utils/metricValueCalculator';
import MetricCardContent from './MetricCardContent';
import MetricCardControls from './MetricCardControls';
import BreakdownTypeSelector from './BreakdownTypeSelector';
import { ChartAnnotation } from '@/data/annotationData';

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
  selectedTimestamps?: Date[] | null;
  onBreakdownToggle?: (enabled: boolean) => void;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
  onToggleTrue?: () => void;
  onToggleFalse?: () => void;
  annotations?: ChartAnnotation[];
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
  selectedTimestamp,
  selectedTimestamps,
  onBreakdownToggle: userOnBreakdownToggle,
  hoveredTimestamp,
  onHoverTimestamp,
  onToggleTrue,
  onToggleFalse,
  annotations
}: MetricCardProps) => {
  const [breakdownEnabled, setBreakdownEnabled] = useState(false);
  const [breakdownType, setBreakdownType] = useState<'application' | 'sdk'>('application');
  
  const showAverage = showTrue && showFalse && (metricType === 'conversion' || metricType === 'errorRate');
  const displayValue = calculateDisplayValue(value, chartData, showTrue, showFalse, metricType);
  const showBreakdownToggle = metricType === 'evaluations';
  const showVariantFilters = metricType === 'evaluations' && !!onToggleTrue && !!onToggleFalse;
  
  const handleBreakdownToggle = (enabled: boolean) => {
    setBreakdownEnabled(enabled);
    if (userOnBreakdownToggle) {
      userOnBreakdownToggle(enabled);
    }
  };
  
  const handleBreakdownTypeChange = (type: 'application' | 'sdk') => {
    setBreakdownType(type);
  };
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300",
      className,
      metricType === 'evaluations' && breakdownEnabled ? 'h-[560px]' : ''
    )}>
      <div className="flex justify-between items-center">
        <MetricCardHeader 
          title={title}
          value={displayValue}
          change={change}
          info={info}
          timeframe={timeframe}
        />
        
        <MetricCardControls
          showBreakdownToggle={showBreakdownToggle}
          breakdownEnabled={breakdownEnabled}
          onBreakdownToggle={handleBreakdownToggle}
          breakdownType={breakdownType}
          onBreakdownTypeChange={handleBreakdownTypeChange}
          showVariantFilters={showVariantFilters}
          showTrue={showTrue ?? false}
          showFalse={showFalse ?? false}
          onToggleTrue={onToggleTrue}
          onToggleFalse={onToggleFalse}
        />
      </div>
      
      {breakdownEnabled && showBreakdownToggle && (
        <BreakdownTypeSelector
          breakdownType={breakdownType}
          onBreakdownTypeChange={handleBreakdownTypeChange}
        />
      )}

      <CardContent className="p-4 pt-2">
        <MetricCardContent
          breakdownEnabled={breakdownEnabled}
          breakdownType={breakdownType}
          chartData={chartData}
          versionChanges={versionChanges}
          barColor={barColor}
          valueFormatter={valueFormatter}
          tooltipValueFormatter={tooltipValueFormatter}
          tooltipLabelFormatter={tooltipLabelFormatter}
          showTrue={showTrue}
          showFalse={showFalse}
          chartType={chartType}
          metricType={metricType}
          timeframe={timeframe}
          selectedTimestamp={selectedTimestamp}
          selectedTimestamps={selectedTimestamps}
          hoveredTimestamp={hoveredTimestamp}
          onHoverTimestamp={onHoverTimestamp}
          children={children}
          annotations={annotations}
        />
      </CardContent>
    </Card>
  );
};

export default MetricCard;
