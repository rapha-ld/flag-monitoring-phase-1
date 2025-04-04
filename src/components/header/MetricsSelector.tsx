import React, { useState } from 'react';
import { BarChart3, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import MetricsModal from '@/components/metrics/MetricsModal';
interface MetricsSelectorProps {
  selectedMetrics: string[];
  onMetricsChange: (metrics: string[]) => void;
  hiddenMetrics: string[];
  onMetricVisibilityChange: (metric: string, visible: boolean) => void;
}
const MetricsSelector = ({
  selectedMetrics,
  onMetricsChange,
  hiddenMetrics,
  onMetricVisibilityChange
}: MetricsSelectorProps) => {
  const [metricsOpen, setMetricsOpen] = useState(false);
  const [metricModalOpen, setMetricModalOpen] = useState(false);
  const handleMetricToggle = (metric: string) => {
    onMetricVisibilityChange(metric, hiddenMetrics.includes(metric));
  };
  const handleMetricRemove = (metric: string) => {
    if (selectedMetrics.length > 1) {
      const updatedMetrics = selectedMetrics.filter(m => m !== metric);
      onMetricsChange(updatedMetrics);
    }
  };
  const getMetricDisplayName = (metric: string) => {
    if (metric === 'evaluations') return 'Unique Users';
    if (metric === 'conversion') return 'Avg. Checkout Conversion Rate';
    if (metric === 'errorRate') return 'Avg. Error Rate';
    return metric.charAt(0).toUpperCase() + metric.slice(1).replace(/([A-Z])/g, ' $1');
  };
  return <div className="ml-auto">
      <Popover open={metricsOpen} onOpenChange={setMetricsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-1.5">
            <BarChart3 className="h-4 w-4" />
            <span>Select Metrics</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-2 z-50" align="end">
          <div className="space-y-2">
            <div className="text-sm font-medium pb-1 border-b mb-1">Display Metrics</div>
            <div className="space-y-2">
              {selectedMetrics.map(metric => <div key={metric} className="flex items-center space-x-2 group">
                  <Checkbox id={`metrics-${metric}`} checked={!hiddenMetrics.includes(metric)} onCheckedChange={() => handleMetricToggle(metric)} />
                  <Label htmlFor={`metrics-${metric}`} className="text-sm cursor-pointer flex-grow">
                    {getMetricDisplayName(metric)}
                  </Label>
                  <button onClick={() => handleMetricRemove(metric)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded-sm">
                    <X className="h-3 w-3" />
                  </button>
                </div>)}
            </div>
            <div className="pt-2 border-t mt-2">
              <Button variant="ghost" size="sm" className="w-full justify-start text-sm font-normal" onClick={() => {
              setMetricsOpen(false);
              setMetricModalOpen(true);
            }}>
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Metric(s)
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <MetricsModal open={metricModalOpen} onOpenChange={setMetricModalOpen} selectedMetrics={selectedMetrics} onMetricsChange={onMetricsChange} />
    </div>;
};
export default MetricsSelector;