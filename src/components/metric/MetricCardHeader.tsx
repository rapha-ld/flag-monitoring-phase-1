
import React from 'react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface MetricCardHeaderProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  info?: string;
  timeframe?: string;
  valueFormatter?: (value: number) => string;
}

const MetricCardHeader = ({
  title,
  value,
  change,
  info,
  timeframe,
  valueFormatter
}: MetricCardHeaderProps) => {
  // Extract the number of days from the timeframe
  const getDaysFromTimeframe = () => {
    if (!timeframe) return 14; // Default to 14 days

    if (timeframe.startsWith('custom-')) {
      return parseInt(timeframe.replace('custom-', '').replace('d', ''));
    } else {
      return parseInt(timeframe.replace('d', ''));
    }
  };

  // Format the value if valueFormatter is provided and value is a number
  const formattedValue = valueFormatter && typeof value === 'number' 
    ? valueFormatter(value) 
    : value;

  return <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium flex items-center gap-1.5 text-inherit">
          {title}
          {info && <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground/70" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">{info}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>}
        </CardTitle>
      </div>
      <div className="flex items-center gap-2">
        <CardDescription className="text-2xl font-semibold text-foreground">
          {formattedValue}
        </CardDescription>
        {change && <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn("text-xs font-medium rounded-full px-1.5 py-0.5 flex items-center cursor-help", change.trend === 'up' ? 'text-green-600 bg-green-100' : change.trend === 'down' ? 'text-red-600 bg-red-100' : 'text-gray-600 bg-gray-100')}>
                  {change.value > 0 ? '+' : ''}{change.value}%
                </span>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-xs">Change from previous {getDaysFromTimeframe()} days</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>}
      </div>
    </CardHeader>;
};

export default MetricCardHeader;
