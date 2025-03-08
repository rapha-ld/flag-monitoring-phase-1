
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import BarChart from './BarChart';
import { DataPoint, VersionChange } from './BarChart';

interface MetricCardProps {
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
  metricType
}: MetricCardProps) => {
  // Determine if we should show average values (only for conversion and error rate when both variants selected)
  const showAverage = showTrue && showFalse && (metricType === 'conversion' || metricType === 'errorRate');

  // Calculate the displayed value based on variant selection
  const getDisplayValue = () => {
    if (!chartData || chartData.length === 0) return value;
    
    // For evaluations (Total Evaluations), calculate the sum based on selected variants
    if (metricType === 'evaluations') {
      let sum = 0;
      
      if (showTrue && showFalse) {
        // Sum both true and false values
        chartData.forEach(item => {
          sum += (item.valueTrue || 0) + (item.valueFalse || 0);
        });
      } else if (showTrue) {
        // Only sum true values
        chartData.forEach(item => {
          sum += (item.valueTrue || 0);
        });
      } else if (showFalse) {
        // Only sum false values
        chartData.forEach(item => {
          sum += (item.valueFalse || 0);
        });
      } else {
        // Default to the original value
        return value;
      }
      
      return sum;
    }
    
    // For conversion and error rates, calculate average based on selected variants
    else if (metricType === 'conversion' || metricType === 'errorRate') {
      let sum = 0;
      let count = 0;
      
      if (showTrue && showFalse) {
        // Average of both true and false values
        chartData.forEach(item => {
          const trueVal = item.valueTrue || 0;
          const falseVal = item.valueFalse || 0;
          let itemCount = 0;
          
          if (trueVal > 0) {
            sum += trueVal;
            itemCount++;
          }
          
          if (falseVal > 0) {
            sum += falseVal;
            itemCount++;
          }
          
          count += (itemCount > 0 ? 1 : 0);
        });
      } else if (showTrue) {
        // Average of true values
        chartData.forEach(item => {
          const val = item.valueTrue || 0;
          if (val > 0) {
            sum += val;
            count++;
          }
        });
      } else if (showFalse) {
        // Average of false values
        chartData.forEach(item => {
          const val = item.valueFalse || 0;
          if (val > 0) {
            sum += val;
            count++;
          }
        });
      } else {
        // Default to the original value
        return value;
      }
      
      const avg = count > 0 ? sum / count : 0;
      return metricType === 'conversion' || metricType === 'errorRate' 
        ? `${avg.toFixed(1)}%` 
        : avg.toFixed(1);
    }
    
    return value;
  };

  // Extract the number of days from the timeframe
  const getDaysFromTimeframe = () => {
    if (!timeframe) return 14; // Default to 14 days
    
    if (timeframe.startsWith('custom-')) {
      return parseInt(timeframe.replace('custom-', '').replace('d', ''));
    } else {
      return parseInt(timeframe.replace('d', ''));
    }
  };
  
  // Get the display value based on the selected variants
  const displayValue = getDisplayValue();
  
  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
            {title}
            {info && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground/70" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">{info}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <CardDescription className="text-2xl font-semibold text-foreground">
            {displayValue}
          </CardDescription>
          {change && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span 
                    className={cn(
                      "text-xs font-medium rounded-full px-1.5 py-0.5 flex items-center cursor-help",
                      change.trend === 'up' ? 'text-green-600 bg-green-100' : 
                      change.trend === 'down' ? 'text-red-600 bg-red-100' : 
                      'text-gray-600 bg-gray-100'
                    )}
                  >
                    {change.value > 0 ? '+' : ''}{change.value}%
                  </span>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-xs">Change from previous {getDaysFromTimeframe()} days</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>
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
          />
        ) : children}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
