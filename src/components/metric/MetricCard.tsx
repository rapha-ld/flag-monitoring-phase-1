
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import MetricCardHeader from './MetricCardHeader';
import MetricCardContent from './MetricCardContent';
import MetricCardControls from './MetricCardControls';
import BreakdownTypeSelector from './BreakdownTypeSelector';
import { DataPoint, VersionChange } from '../BarChart';

interface MetricCardProps {
  title: string;
  metric?: number;
  change?: { value: number; trend: 'up' | 'down' };
  chartData?: DataPoint[];
  versionChanges?: VersionChange[];
  isLoading?: boolean;
  valueFormatter?: (value: number) => string;
  tooltipValueFormatter?: (value: number) => string;
  tooltipLabelFormatter?: (label: string) => string;
  isVisible?: boolean;
  showTrue?: boolean;
  showFalse?: boolean;
  onToggleTrue?: () => void;
  onToggleFalse?: () => void;
  chartType?: 'stacked' | 'mixed';
  metricType?: 'evaluations' | 'conversion' | 'errorRate';
  selectedTimestamp?: Date | null;
  selectedTimestamps?: Date[] | null;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  metric = 0,
  change,
  chartData,
  versionChanges,
  isLoading = false,
  valueFormatter = (value) => `${value.toFixed(1)}%`,
  tooltipValueFormatter = (value) => `${value.toFixed(1)}%`,
  tooltipLabelFormatter = (label) => label,
  isVisible = true,
  showTrue = true,
  showFalse = true,
  onToggleTrue,
  onToggleFalse,
  chartType = 'stacked',
  metricType,
  selectedTimestamp,
  selectedTimestamps,
  hoveredTimestamp,
  onHoverTimestamp
}) => {
  // Local state to track if breakdown view is enabled and which type
  const [breakdownEnabled, setBreakdownEnabled] = useState(false);
  const [breakdownType, setBreakdownType] = useState<'application' | 'sdk'>('application');
  
  // Determine the chart color based on the metric type
  const barColor = 
    metricType === 'evaluations' ? '#6E6F96' : 
    metricType === 'conversion' ? '#55B464' : 
    metricType === 'errorRate' ? '#DB2251' : 
    '#6E6F96';
  
  // Only show the card if it's visible
  if (!isVisible) return null;
  
  // Determine if we should show the breakdown type selector
  const showBreakdownSelector = metricType === 'evaluations';
  
  const handleToggleBreakdown = () => {
    setBreakdownEnabled(!breakdownEnabled);
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <MetricCardHeader 
          title={title} 
          metric={metric} 
          change={change} 
          isLoading={isLoading} 
          valueFormatter={valueFormatter}
        />
      </CardHeader>
      <CardContent className="p-0">
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
        >
          <div className="flex items-center justify-center h-[160px] text-gray-400">
            No data available
          </div>
        </MetricCardContent>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2 pb-2">
        <MetricCardControls 
          breakdownEnabled={breakdownEnabled} 
          onToggleBreakdown={handleToggleBreakdown}
          showTrue={showTrue}
          showFalse={showFalse}
          onToggleTrue={onToggleTrue || (() => {})}
          onToggleFalse={onToggleFalse || (() => {})}
        />
        
        {showBreakdownSelector && breakdownEnabled && (
          <BreakdownTypeSelector 
            value={breakdownType} 
            onChange={setBreakdownType} 
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default MetricCard;
