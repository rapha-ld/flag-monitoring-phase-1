
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// List of available metrics
const availableMetrics = [
  { id: 'evaluations', name: 'Total Evaluations' },
  { id: 'conversion', name: 'Avg. Checkout Conversion Rate' },
  { id: 'errorRate', name: 'Avg. Error Rate' },
  { id: 'pageLoadTime', name: 'Page Load Time' },
  { id: 'timeToInteractive', name: 'Time to Interactive' },
  { id: 'firstContentfulPaint', name: 'First Contentful Paint' },
  { id: 'largestContentfulPaint', name: 'Largest Contentful Paint' },
  { id: 'cumulativeLayoutShift', name: 'Cumulative Layout Shift' },
  { id: 'firstInputDelay', name: 'First Input Delay' },
  { id: 'sessionDuration', name: 'Average Session Duration' },
  { id: 'bounceRate', name: 'Bounce Rate' },
  { id: 'apiResponseTime', name: 'API Response Time' },
  { id: 'memoryUsage', name: 'Memory Usage' },
  { id: 'cpuUsage', name: 'CPU Usage' },
  { id: 'networkRequests', name: 'Network Requests' },
  { id: 'userSatisfactionScore', name: 'User Satisfaction Score' },
  { id: 'timeOnPage', name: 'Time on Page' },
];

interface MetricsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMetrics: string[];
  onMetricsChange: (metrics: string[]) => void;
}

const MetricsModal = ({
  open,
  onOpenChange,
  selectedMetrics,
  onMetricsChange,
}: MetricsModalProps) => {
  const [localSelectedMetrics, setLocalSelectedMetrics] = useState<string[]>(selectedMetrics);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter metrics based on search query
  const filteredMetrics = availableMetrics.filter(metric => 
    metric.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMetricToggle = (metricId: string) => {
    setLocalSelectedMetrics(current => 
      current.includes(metricId)
        ? current.filter(id => id !== metricId)
        : [...current, metricId]
    );
  };

  const handleSave = () => {
    onMetricsChange(localSelectedMetrics);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLocalSelectedMetrics(selectedMetrics);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Metrics</DialogTitle>
        </DialogHeader>
        
        <div className="relative mt-2 mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search metrics..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="max-h-[300px] overflow-y-auto pr-1 space-y-1">
          {filteredMetrics.map(metric => (
            <div key={metric.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md">
              <Checkbox 
                id={`modal-metric-${metric.id}`}
                checked={localSelectedMetrics.includes(metric.id)}
                onCheckedChange={() => handleMetricToggle(metric.id)}
              />
              <Label 
                htmlFor={`modal-metric-${metric.id}`}
                className="flex-grow cursor-pointer"
              >
                {metric.name}
              </Label>
            </div>
          ))}
          {filteredMetrics.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No metrics found matching your search
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0 mt-4">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MetricsModal;
