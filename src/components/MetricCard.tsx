
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
}

const MetricCard = ({ title, value, change, info, className, children }: MetricCardProps) => {
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
        <div className="flex items-end justify-between">
          <CardDescription className="text-2xl font-semibold text-foreground">
            {value}
          </CardDescription>
          {change && (
            <span 
              className={cn(
                "text-xs font-medium rounded-full px-1.5 py-0.5 flex items-center",
                change.trend === 'up' ? 'text-green-600 bg-green-100' : 
                change.trend === 'down' ? 'text-red-600 bg-red-100' : 
                'text-gray-600 bg-gray-100'
              )}
            >
              {change.value > 0 ? '+' : ''}{change.value}%
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {children}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
