
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DataPoint, VersionChange } from '../BarChart';
import MetricCardHeader from './MetricCardHeader';
import { calculateDisplayValue } from '@/utils/metricValueCalculator';
import MetricCardContent from './MetricCardContent';
import MetricCardControls from './MetricCardControls';
import BreakdownTypeSelector from './BreakdownTypeSelector';

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
  onBreakdownToggle,
  hoveredTimestamp,
  onHoverTimestamp,
  onToggleTrue,
  onToggleFalse
}: MetricCardProps) => {
  const [breakdownEnabled, setBreakdownEnabled] = useState(false);
  const [breakdownType, setBreakdownType] = useState<'application' | 'sdk'>('application');
  
  const showAverage = showTrue && showFalse && (metricType === 'conversion' || metricType === 'errorRate');
  const displayValue = calculateDisplayValue(value, chartData, showTrue, showFalse, metricType);
  const showBreakdownToggle = metricType === 'evaluations';
  const showVariantFilters = metricType === 'evaluations' && onToggleTrue && onToggleFalse;
  
  const handleBreakdownToggle = (enabled: boolean) => {
    setBreakdownEnabled(enabled);
    if (onBreakdownToggle) {
      onBreakdownToggle(enabled);
    }
  };
  
  const handleBreakdownTypeChange = (type: 'application' | 'sdk') => {
    setBreakdownType(type);
  };
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in", 
      className,
      metricType === 'evaluations' && breakdownEnabled ? 'h-[522px]' : ''
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
          showTrue={Boolean(showTrue)}  // Ensure this is a boolean
          showFalse={Boolean(showFalse)}  // Ensure this is a boolean
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

      <CardContent className="p-0">
        <MetricCardContent
          breakdownEnabled={breakdownEnabled && showBreakdownToggle}
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
          selectedTimestamp={selectedTimestamp}
          selectedTimestamps={selectedTimestamps}
          hoveredTimestamp={hoveredTimestamp}
          onHoverTimestamp={onHoverTimestamp}
          children={children}
        />
      </CardContent>
    </Card>
  );
};

export default MetricCard;
