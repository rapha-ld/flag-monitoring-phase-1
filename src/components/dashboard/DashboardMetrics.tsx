import React, { useState } from 'react';
import MetricCard from '@/components/metric/MetricCard';
import { DataPoint, VersionChange } from '@/components/BarChart';
import { cn } from '@/lib/utils';
import FlagChangeImpact from './FlagChangeImpact';
interface DashboardMetricsProps {
  selectedMetrics: string[];
  currentMetrics: {
    evaluations: {
      value: number;
      change: {
        value: number;
        trend: 'up' | 'down';
      };
    };
    conversion: {
      value: number;
      change: {
        value: number;
        trend: 'up' | 'down';
      };
    };
    errorRate: {
      value: number;
      change: {
        value: number;
        trend: 'up' | 'down';
      };
    };
  };
  filteredEvaluationData: DataPoint[];
  filteredConversionData: DataPoint[];
  filteredErrorRateData: DataPoint[];
  evaluationVersionChanges: VersionChange[];
  conversionVersionChanges: VersionChange[];
  errorRateVersionChanges: VersionChange[];
  showTrue: boolean;
  showFalse: boolean;
  timeframe: string;
  selectedTimestamp?: Date | null;
  selectedTimestamps?: Date[] | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
}
const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  selectedMetrics,
  currentMetrics,
  filteredEvaluationData,
  filteredConversionData,
  filteredErrorRateData,
  evaluationVersionChanges,
  conversionVersionChanges,
  errorRateVersionChanges,
  showTrue,
  showFalse,
  timeframe,
  selectedTimestamp,
  selectedTimestamps,
  onHoverTimestamp
}) => {
  const [isBreakdownEnabled, setIsBreakdownEnabled] = useState(false);
  const [hoveredTimestamp, setHoveredTimestamp] = useState<string | null>(null);
  const handleBreakdownToggle = (enabled: boolean) => {
    setIsBreakdownEnabled(enabled);
  };
  const handleHoverTimestamp = (timestamp: string | null) => {
    setHoveredTimestamp(timestamp);
    if (onHoverTimestamp) {
      onHoverTimestamp(timestamp);
    }
  };
  return;
};
export default DashboardMetrics;