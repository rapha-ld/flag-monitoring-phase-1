
import React from 'react';
import MetricCard from '@/components/metric/MetricCard';
import { DataPoint, VersionChange } from '@/components/BarChart';

interface DashboardMetricsProps {
  selectedMetrics: string[];
  currentMetrics: {
    evaluations: { value: number, change: { value: number, trend: 'up' | 'down' } },
    conversion: { value: number, change: { value: number, trend: 'up' | 'down' } },
    errorRate: { value: number, change: { value: number, trend: 'up' | 'down' } }
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
  selectedEventTypes?: string[] | null;
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
  selectedEventTypes
}) => {
  // Default metrics with safe fallbacks to prevent undefined errors
  const safeMetrics = {
    evaluations: currentMetrics?.evaluations || { value: 0, change: { value: 0, trend: 'up' as const } },
    conversion: currentMetrics?.conversion || { value: 0, change: { value: 0, trend: 'up' as const } },
    errorRate: currentMetrics?.errorRate || { value: 0, change: { value: 0, trend: 'up' as const } }
  };

  return (
    <div className="grid grid-cols-1 gap-6 animate-fade-in">
      {selectedMetrics.includes('evaluations') && (
        <MetricCard 
          title="Unique Users" 
          value={safeMetrics.evaluations.value}
          change={safeMetrics.evaluations.change}
          info="Total unique users for the selected time period"
          className="animate-slide-up [animation-delay:100ms]"
          chartData={filteredEvaluationData}
          versionChanges={evaluationVersionChanges.filter(change => 
            change.position < filteredEvaluationData.length
          )}
          valueFormatter={(value) => `${value}`}
          tooltipValueFormatter={(value) => `${value}`}
          barColor="#6E6F96"
          showTrue={showTrue}
          showFalse={showFalse}
          chartType="stacked"
          metricType="evaluations"
          timeframe={timeframe}
          selectedTimestamp={selectedTimestamp}
          selectedTimestamps={selectedTimestamps}
        />
      )}
      
      {selectedMetrics.includes('conversion') && (
        <MetricCard 
          title="Avg. Checkout Conversion Rate" 
          value={`${safeMetrics.conversion.value}%`}
          change={safeMetrics.conversion.change}
          info="Percentage of checkout completions from initiated sessions"
          className="animate-slide-up [animation-delay:200ms]"
          chartData={filteredConversionData}
          versionChanges={conversionVersionChanges.filter(change => 
            change.position < filteredConversionData.length
          )}
          valueFormatter={(value) => `${value}%`}
          tooltipValueFormatter={(value) => `${value}%`}
          barColor="#6E6F96"
          showTrue={showTrue}
          showFalse={showFalse}
          chartType="mixed"
          metricType="conversion"
          timeframe={timeframe}
          selectedTimestamp={selectedTimestamp}
          selectedTimestamps={selectedTimestamps}
        />
      )}
      
      {selectedMetrics.includes('errorRate') && (
        <MetricCard 
          title="Avg. Error Rate" 
          value={`${safeMetrics.errorRate.value}%`}
          change={{
            value: Math.abs(safeMetrics.errorRate.change.value),
            trend: safeMetrics.errorRate.change.value < 0 ? 'up' : 'down'
          }}
          info="Percentage of requests resulting in error responses"
          className="animate-slide-up [animation-delay:300ms]"
          chartData={filteredErrorRateData}
          versionChanges={errorRateVersionChanges.filter(change => 
            change.position < filteredErrorRateData.length
          )}
          valueFormatter={(value) => `${value}%`}
          tooltipValueFormatter={(value) => `${value}%`}
          barColor="#6E6F96"
          showTrue={showTrue}
          showFalse={showFalse}
          chartType="mixed"
          metricType="errorRate"
          timeframe={timeframe}
          selectedTimestamp={selectedTimestamp}
          selectedTimestamps={selectedTimestamps}
        />
      )}
    </div>
  );
};

export default DashboardMetrics;
