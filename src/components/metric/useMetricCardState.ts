
import { useState } from 'react';

/**
 * Custom hook to manage the state logic for MetricCard component
 */
export function useMetricCardState(
  metricType?: 'evaluations' | 'conversion' | 'errorRate',
  onBreakdownToggle?: (enabled: boolean) => void
) {
  const [breakdownEnabled, setBreakdownEnabled] = useState(false);
  const [breakdownType, setBreakdownType] = useState<'application' | 'sdk'>('application');
  
  const showBreakdownToggle = metricType === 'evaluations';
  
  const handleBreakdownToggle = (enabled: boolean) => {
    setBreakdownEnabled(enabled);
    if (onBreakdownToggle) {
      onBreakdownToggle(enabled);
    }
  };
  
  const handleBreakdownTypeChange = (type: 'application' | 'sdk') => {
    setBreakdownType(type);
  };
  
  return {
    breakdownEnabled,
    breakdownType,
    showBreakdownToggle,
    handleBreakdownToggle,
    handleBreakdownTypeChange
  };
}
