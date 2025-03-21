import React, { useState } from 'react';
import { BarChart3, Plus, X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import MetricsModal from '@/components/MetricsModal';

interface MetricsSelectorProps {
  selectedMetrics: string[];
  onMetricsChange: (metrics: string[]) => void;
}

const MetricsSelector = ({ selectedMetrics, onMetricsChange }: MetricsSelectorProps) => {
  const [metricsOpen, setMetricsOpen] = useState(false);
  const [metricModalOpen, setMetricModalOpen] = useState(false);
  const [hiddenMetrics, setHiddenMetrics] = useState<string[]>([]);

  const handleMetricToggle = (metric: string) => {
    if (hiddenMetrics.includes(metric)) {
      setHiddenMetrics(hiddenMetrics.filter(m => m !== metric));
    } else {
      setHiddenMetrics([...hiddenMetrics, metric]);
    }
  };

  const handleMetricRemove = (metric: string) => {
    if (selectedMetrics.length > 1) {
      const updatedMetrics = selectedMetrics.filter(m => m !== metric);
      onMetricsChange(updatedMetrics);
      if (hiddenMetrics.includes(metric)) {
        setHiddenMetrics(hiddenMetrics.filter(m => m !== metric));
      }
    }
  };

  const getMetricDisplayName = (metric: string) => {
    if (metric === 'evaluations') return 'Total Evaluations';
    if (metric === 'conversion') return 'Avg. Checkout Conversion Rate';
    if (metric === 'errorRate') return 'Avg. Error Rate';
    
    return metric.charAt(0).toUpperCase() + metric.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const visibleMetrics = selectedMetrics.filter(metric => !hiddenMetrics.includes(metric));

  const handleMetricsChangeFromModal = (metrics: string[]) => {
    onMetricsChange(metrics);
    const newMetrics = metrics.filter(m => !selectedMetrics.includes(m));
    setHiddenMetrics(hiddenMetrics.filter(m => metrics.includes(m)));
  };

  return (
    <div className="ml-auto">
      <Popover open={metricsOpen} onOpenChange={setMetricsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-1.5">
            <BarChart3 className="h-4 w-4" />
            <span>Metrics</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-2 z-50" align="end">
          <div className="space-y-2">
            <div className="text-sm font-medium pb-1 border-b mb-1">Display Metrics</div>
            <div className="space-y-2">
              {selectedMetrics.map(metric => (
                <div key={metric} className="flex items-center justify-between space-x-2 group py-1 px-1 hover:bg-muted rounded-md">
                  <Label className="text-sm cursor-pointer flex-grow">
                    {getMetricDisplayName(metric)}
                  </Label>
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => handleMetricToggle(metric)}
                      className="p-1 hover:bg-muted rounded-sm text-muted-foreground hover:text-foreground"
                      title={hiddenMetrics.includes(metric) ? "Show metric" : "Hide metric"}
                    >
                      {hiddenMetrics.includes(metric) ? 
                        <EyeOff className="h-3.5 w-3.5" /> : 
                        <Eye className="h-3.5 w-3.5" />
                      }
                    </button>
                    <button 
                      onClick={() => handleMetricRemove(metric)}
                      className="p-1 hover:bg-muted rounded-sm text-muted-foreground hover:text-foreground"
                      title="Remove metric"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t mt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-sm font-normal"
                onClick={() => {
                  setMetricsOpen(false);
                  setMetricModalOpen(true);
                }}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Metric(s)
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <MetricsModal 
        open={metricModalOpen}
        onOpenChange={setMetricModalOpen}
        selectedMetrics={selectedMetrics}
        onMetricsChange={handleMetricsChangeFromModal}
      />
    </div>
  );
};

export default MetricsSelector;
