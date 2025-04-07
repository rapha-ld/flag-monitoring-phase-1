
import React from 'react';
import { cn } from '@/lib/utils';
import BarChart from '@/components/BarChart';
import FlagChangeImpact from './FlagChangeImpact';
import { DataPoint } from '@/components/BarChart';

interface DashboardMetricsProps {
  selectedMetrics: string[];
  currentMetrics: { [key: string]: DataPoint[] };
  filteredEvaluationData: DataPoint[];
  filteredConversionData: DataPoint[];
  filteredErrorRateData: DataPoint[];
  evaluationVersionChanges: DataPoint[];
  conversionVersionChanges: DataPoint[];
  errorRateVersionChanges: DataPoint[];
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
  const renderMetricCharts = () => {
    const charts = [];

    if (selectedMetrics.includes('evaluations')) {
      charts.push(
        <BarChart
          key="evaluations"
          title="Unique Users"
          data={currentMetrics['evaluations']}
          versionChanges={evaluationVersionChanges}
          showTrue={showTrue}
          showFalse={showFalse}
          timeframe={timeframe}
        />
      );
    }

    if (selectedMetrics.includes('conversion')) {
      charts.push(
        <BarChart
          key="conversion"
          title="Flag Change Impact"
          data={currentMetrics['conversion']}
          versionChanges={conversionVersionChanges}
          showTrue={showTrue}
          showFalse={showFalse}
          timeframe={timeframe}
        />
      );
    }

    if (selectedMetrics.includes('errorRate')) {
      charts.push(
        <BarChart
          key="errorRate"
          title="Avg. Error Rate"
          data={currentMetrics['errorRate']}
          versionChanges={errorRateVersionChanges}
          showTrue={showTrue}
          showFalse={showFalse}
          timeframe={timeframe}
        />
      );
    }

    return charts;
  };

  return (
    <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", 
      selectedMetrics.length === 1 ? "md:grid-cols-1 lg:grid-cols-1" : 
      selectedMetrics.length === 2 ? "md:grid-cols-2 lg:grid-cols-2" : 
      "md:grid-cols-2 lg:grid-cols-3")}>
      {renderMetricCharts()}
      
      <FlagChangeImpact 
        chartData={filteredConversionData} 
        selectedTimestamp={selectedTimestamp}
        selectedTimestamps={selectedTimestamps}
      />
    </div>
  );
};

export default DashboardMetrics;

