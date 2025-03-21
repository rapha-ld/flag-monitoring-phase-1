
export interface Metric {
  id: string;
  name: string;
}

export interface MetricCategories {
  performance: Metric[];
  business: Metric[];
}

// List of available metrics categorized
export const metricCategories: MetricCategories = {
  performance: [
    { id: 'pageLoadTime', name: 'Page Load Time' },
    { id: 'timeToInteractive', name: 'Time to Interactive' },
    { id: 'firstContentfulPaint', name: 'First Contentful Paint' },
    { id: 'largestContentfulPaint', name: 'Largest Contentful Paint' },
    { id: 'cumulativeLayoutShift', name: 'Cumulative Layout Shift' },
    { id: 'firstInputDelay', name: 'First Input Delay' },
    { id: 'apiResponseTime', name: 'API Response Time' },
    { id: 'memoryUsage', name: 'Memory Usage' },
    { id: 'cpuUsage', name: 'CPU Usage' },
    { id: 'networkRequests', name: 'Network Requests' },
    { id: 'errorRate', name: 'Avg. Error Rate' },
    { id: 'p95FrontendLatency', name: 'P95 Frontend Latency' },
    { id: 'p90FrontendLatency', name: 'P90 Frontend Latency' },
    { id: 'p85FrontendLatency', name: 'P85 Frontend Latency' },
  ],
  business: [
    { id: 'evaluations', name: 'Unique Users' },
    { id: 'conversion', name: 'Avg. Checkout Conversion Rate' },
    { id: 'sessionDuration', name: 'Average Session Duration' },
    { id: 'bounceRate', name: 'Bounce Rate' },
    { id: 'userSatisfactionScore', name: 'User Satisfaction Score' },
    { id: 'timeOnPage', name: 'Time on Page' },
  ]
};

export const findMetricById = (metricId: string): Metric | undefined => {
  // Search in all categories
  for (const category of Object.values(metricCategories)) {
    const metric = category.find(m => m.id === metricId);
    if (metric) return metric;
  }
  
  // Fallback for any metric not found in categories
  return { 
    id: metricId, 
    name: metricId.charAt(0).toUpperCase() + metricId.slice(1) 
  };
};
