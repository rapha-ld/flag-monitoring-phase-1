
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MetricSearch from './MetricSearch';
import MetricsList from './MetricsList';
import { metricCategories, findMetricById } from './metricData';

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

  // Get recently used metrics (those that are currently selected)
  const recentlyUsedMetrics = selectedMetrics.map(metricId => findMetricById(metricId));

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
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Select Metrics</DialogTitle>
          <Button variant="outline" size="sm" className="h-8">
            <Plus className="mr-1 h-3.5 w-3.5" />
            Create New Metric
          </Button>
        </DialogHeader>
        
        <DialogClose className="absolute right-4 top-4 p-2.5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <DialogClose />
        </DialogClose>

        <MetricSearch 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <MetricsList
          metricCategories={metricCategories}
          recentlyUsedMetrics={recentlyUsedMetrics}
          selectedMetrics={localSelectedMetrics}
          onMetricToggle={handleMetricToggle}
          searchQuery={searchQuery}
        />

        <DialogFooter className="flex gap-2 sm:gap-0 mt-4">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MetricsModal;
