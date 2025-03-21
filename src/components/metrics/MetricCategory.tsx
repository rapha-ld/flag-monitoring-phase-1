
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface MetricItem {
  id: string;
  name: string;
}

interface MetricCategoryProps {
  title: string;
  metrics: MetricItem[];
  selectedMetrics: string[];
  onMetricToggle: (metricId: string) => void;
}

const MetricCategory = ({
  title,
  metrics,
  selectedMetrics,
  onMetricToggle
}: MetricCategoryProps) => {
  if (metrics.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold mb-1 text-muted-foreground">{title}</h3>
      <div className="space-y-1">
        {metrics.map(metric => (
          <div key={metric.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md">
            <Checkbox 
              id={`modal-metric-${metric.id}`}
              checked={selectedMetrics.includes(metric.id)}
              onCheckedChange={() => onMetricToggle(metric.id)}
            />
            <Label 
              htmlFor={`modal-metric-${metric.id}`}
              className="flex-grow cursor-pointer"
            >
              {metric.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricCategory;
