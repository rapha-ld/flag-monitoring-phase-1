
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import BarChart from '../BarChart';
import { DataPoint, VersionChange } from '../BarChart';
import MetricCardHeader from './MetricCardHeader';
import { calculateDisplayValue } from '@/utils/metricValueCalculator';
import { Toggle } from '@/components/ui/toggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ChartBreakdown from './ChartBreakdown';
import { BarChartHorizontal } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

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
  
  const handleHoverTimestamp = (timestamp: string | null) => {
    if (onHoverTimestamp) {
      onHoverTimestamp(timestamp);
    }
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
        
        <div className="flex items-center gap-2 pr-4 pt-4">
          {showVariantFilters && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-true" 
                  checked={showTrue}
                  onCheckedChange={onToggleTrue}
                  className="data-[state=checked]:bg-[#2BB7D2] data-[state=checked]:border-[#2BB7D2]"
                />
                <Label htmlFor="filter-true" className="text-sm">True</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-false" 
                  checked={showFalse}
                  onCheckedChange={onToggleFalse}
                  className="data-[state=checked]:bg-[#FFD099] data-[state=checked]:border-[#FFD099] data-[state=checked]:text-black"
                />
                <Label htmlFor="filter-false" className="text-sm">False</Label>
              </div>
            </div>
          )}
          
          {showBreakdownToggle && (
            <Toggle 
              size="sm"
              pressed={breakdownEnabled}
              onPressedChange={handleBreakdownToggle}
              aria-label="Toggle breakdown view"
              className="h-8 px-2 text-xs"
            >
              <BarChartHorizontal className="h-3.5 w-3.5 mr-1" />
              Breakdown
            </Toggle>
          )}
        </div>
      </div>
      
      {breakdownEnabled && showBreakdownToggle && (
        <div className="px-4 pb-2">
          <Select
            value={breakdownType}
            onValueChange={(value) => setBreakdownType(value as 'application' | 'sdk')}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select breakdown" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="application">Application</SelectItem>
              <SelectItem value="sdk">SDK</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <CardContent className="p-0">
        {breakdownEnabled && showBreakdownToggle ? (
          <ChartBreakdown 
            type={breakdownType} 
            chartData={chartData}
            showTrue={showTrue}
            showFalse={showFalse}
            selectedTimestamp={selectedTimestamp}
            selectedTimestamps={selectedTimestamps}
            hoveredTimestamp={hoveredTimestamp}
            onHoverTimestamp={handleHoverTimestamp}
          />
        ) : chartData && chartData.length > 0 ? (
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
            selectedTimestamps={selectedTimestamps}
            hoveredTimestamp={hoveredTimestamp}
            onHoverTimestamp={handleHoverTimestamp}
          />
        ) : children}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
