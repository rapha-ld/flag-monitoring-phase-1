
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
        <DialogHeader>
          <DialogTitle>Select Metrics</DialogTitle>
        </DialogHeader>
        
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
