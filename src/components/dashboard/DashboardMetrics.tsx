import React, { useState } from 'react';
import MetricCard from '@/components/metric/MetricCard';
import { DataPoint, VersionChange } from '@/components/BarChart';
import { cn } from '@/lib/utils';

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
  selectedTimestamps
}) => {
  const [isBreakdownEnabled, setIsBreakdownEnabled] = useState(false);
  
  const handleBreakdownToggle = (enabled: boolean) => {
    setIsBreakdownEnabled(enabled);
  };
  
  return (
    <div className={cn(
      "grid gap-4",
      isBreakdownEnabled
        ? "grid-cols-3"
        : "grid-cols-1 md:grid-cols-3"
    )}>
      {selectedMetrics.includes('evaluations') && (
        <MetricCard 
          title="Evaluations" 
          value={currentMetrics.evaluations.value}
          change={currentMetrics.evaluations.change}
          info="Total evaluations for the selected time period"
          className={cn(
            "animate-slide-up [animation-delay:100ms]",
            isBreakdownEnabled && "col-span-2"
          )}
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
          onBreakdownToggle={handleBreakdownToggle}
        />
      )}
      
      {isBreakdownEnabled ? (
        <div className="flex flex-col gap-4">
          {selectedMetrics.includes('conversion') && (
            <MetricCard 
              title="Avg. Conversion Rate" 
              value={`${currentMetrics.conversion.value}%`}
              change={currentMetrics.conversion.change}
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
      ) : (
        <>
          {selectedMetrics.includes('conversion') && (
            <MetricCard 
              title="Avg. Conversion Rate" 
              value={`${currentMetrics.conversion.value}%`}
              change={currentMetrics.conversion.change}
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
        </>
      )}
    </div>
  );
};

export default DashboardMetrics;
