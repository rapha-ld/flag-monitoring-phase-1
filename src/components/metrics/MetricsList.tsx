
import React from 'react';
import MetricCategory from './MetricCategory';

export interface MetricItem {
  id: string;
  name: string;
}

export interface MetricCategories {
  performance: MetricItem[];
  business: MetricItem[];
}

interface MetricsListProps {
  metricCategories: MetricCategories;
  recentlyUsedMetrics: MetricItem[];
  selectedMetrics: string[];
  onMetricToggle: (metricId: string) => void;
  searchQuery: string;
}

const MetricsList = ({
  metricCategories,
  recentlyUsedMetrics,
  selectedMetrics,
  onMetricToggle,
  searchQuery
}: MetricsListProps) => {
  // Filter metrics based on search query
  const getFilteredMetrics = (metrics: MetricItem[]) => {
    return metrics.filter(metric => 
      metric.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredRecentlyUsed = getFilteredMetrics(recentlyUsedMetrics);
  const filteredPerformance = getFilteredMetrics(metricCategories.performance);
  const filteredBusiness = getFilteredMetrics(metricCategories.business);

  // Check if there are any filtered metrics for a search
  const hasFilteredMetrics = 
    filteredRecentlyUsed.length > 0 ||
    filteredPerformance.length > 0 ||
    filteredBusiness.length > 0;

  return (
    <div className="max-h-[300px] overflow-y-auto pr-1 space-y-4">
      {/* Recently Used Metrics */}
      {recentlyUsedMetrics.length > 0 && (
        <MetricCategory
          title="Recently Used"
          metrics={filteredRecentlyUsed}
          selectedMetrics={selectedMetrics}
          onMetricToggle={onMetricToggle}
        />
      )}
      
      {/* Performance Metrics */}
      <MetricCategory
        title="Performance"
        metrics={filteredPerformance}
        selectedMetrics={selectedMetrics}
        onMetricToggle={onMetricToggle}
      />
      
      {/* Business Metrics */}
      <MetricCategory
        title="Business"
        metrics={filteredBusiness}
        selectedMetrics={selectedMetrics}
        onMetricToggle={onMetricToggle}
      />
      
      {/* No results message */}
      {!hasFilteredMetrics && (
        <div className="text-center py-4 text-muted-foreground">
          No metrics found matching your search
        </div>
      )}
    </div>
  );
};

export default MetricsList;
