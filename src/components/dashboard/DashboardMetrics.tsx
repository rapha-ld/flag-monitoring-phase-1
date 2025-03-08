
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
  timeframe
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {selectedMetrics.includes('evaluations') && (
        <MetricCard 
          title="Total Evaluations" 
          value={currentMetrics.evaluations.value}
          change={currentMetrics.evaluations.change}
          info="Total evaluation score for the selected time period"
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
        />
      )}
      
      {selectedMetrics.includes('conversion') && (
        <MetricCard 
          title="Avg. Checkout Conversion Rate" 
          value={`${currentMetrics.conversion.value}%`}
          change={currentMetrics.conversion.change}
          info="Percentage of checkout completions from initiated sessions"
          className="animate-slide-up [animation-delay:200ms]"
          chartData={filteredConversionData}
          versionChanges={conversionVersionChanges.filter(change => 
            change.position < filteredConversionData.length
          )}
          valueFormatter={(value) => `${value}%`}
          tooltipValueFormatter={(value) => `Rate: ${value}%`}
          barColor="#6E6F96"
          showTrue={showTrue}
          showFalse={showFalse}
          chartType="mixed"
          metricType="conversion"
          timeframe={timeframe}
        />
      )}
      
      {selectedMetrics.includes('errorRate') && (
        <MetricCard 
          title="Avg. Error Rate" 
          value={`${currentMetrics.errorRate.value}%`}
          change={{
            value: Math.abs(currentMetrics.errorRate.change.value),
            trend: currentMetrics.errorRate.change.value < 0 ? 'up' : 'down'
          }}
          info="Percentage of requests resulting in error responses"
          className="animate-slide-up [animation-delay:300ms]"
          chartData={filteredErrorRateData}
          versionChanges={errorRateVersionChanges.filter(change => 
            change.position < filteredErrorRateData.length
          )}
          valueFormatter={(value) => `${value}%`}
          tooltipValueFormatter={(value) => `Rate: ${value}%`}
          barColor="#6E6F96"
          showTrue={showTrue}
          showFalse={showFalse}
          chartType="mixed"
          metricType="errorRate"
          timeframe={timeframe}
        />
      )}
    </div>
  );
};

export default DashboardMetrics;
