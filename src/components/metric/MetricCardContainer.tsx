
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardContainerProps {
  className?: string;
  isBreakdownEnabled?: boolean;
  metricType?: 'evaluations' | 'conversion' | 'errorRate';
  children: React.ReactNode;
}

/**
 * Container component for the MetricCard that handles styling and animation
 */
const MetricCardContainer: React.FC<MetricCardContainerProps> = ({
  className,
  isBreakdownEnabled,
  metricType,
  children,
}) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in", 
      className,
      metricType === 'evaluations' && isBreakdownEnabled ? 'h-[522px]' : ''
    )}>
      {children}
    </Card>
  );
};

export default MetricCardContainer;
