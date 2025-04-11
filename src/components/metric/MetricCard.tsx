
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { DataPoint, VersionChange } from '../BarChart';
import MetricCardHeader from './MetricCardHeader';
import MetricCardContent from './MetricCardContent';
import MetricCardControls from './MetricCardControls';
import BreakdownTypeSelector from './BreakdownTypeSelector';
import MetricCardContainer from './MetricCardContainer';
import { MetricCardProps } from './MetricCardProps';
import { useMetricCardState } from './useMetricCardState';
import { shouldShowVariantFilters, getDisplayValue } from './MetricCardUtils';

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
  const {
    breakdownEnabled,
    breakdownType,
    showBreakdownToggle,
    handleBreakdownToggle,
    handleBreakdownTypeChange
  } = useMetricCardState(metricType, onBreakdownToggle);
  
  const showVariantFilters = shouldShowVariantFilters(metricType, onToggleTrue, onToggleFalse);
  const displayValue = getDisplayValue(value, chartData, showTrue, showFalse, metricType);
  
  return (
    <MetricCardContainer 
      className={className}
      isBreakdownEnabled={breakdownEnabled}
      metricType={metricType}
    >
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
          showTrue={!!showTrue}
          showFalse={!!showFalse}
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
          selectedTimestamp={selectedTimestamp}
          selectedTimestamps={selectedTimestamps}
          hoveredTimestamp={hoveredTimestamp}
          onHoverTimestamp={onHoverTimestamp}
          children={children}
        />
      </CardContent>
    </MetricCardContainer>
  );
};

export default MetricCard;
