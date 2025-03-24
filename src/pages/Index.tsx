
import React from 'react';
import { cn } from "@/lib/utils";
import Header from '@/components/Header';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import DashboardFooter from '@/components/dashboard/DashboardFooter';
import FeatureFlagHistory from '@/components/dashboard/FeatureFlagHistory';
import { useDashboardData } from '@/hooks/useDashboardData';

const Index = () => {
  const {
    isLoaded,
    timeframe,
    environment,
    selectedDevice,
    selectedMetrics,
    hiddenMetrics,
    visibleMetrics,
    showTrue,
    showFalse,
    filteredEvaluationData,
    filteredConversionData,
    filteredErrorRateData,
    currentMetrics,
    evaluationVersionChanges,
    conversionVersionChanges,
    errorRateVersionChanges,
    selectedTimestamp,
    selectedTimestamps,
    selectedEventTypes,
    handleTimeframeChange,
    handleEnvironmentChange,
    handleDeviceChange,
    handleMetricsChange,
    handleMetricVisibilityChange,
    handleToggleTrue,
    handleToggleFalse,
    handleTimestampSelect
  } = useDashboardData();

  // Create a properly structured metrics object
  const formattedMetrics = {
    evaluations: { 
      value: currentMetrics?.evaluations || 0, 
      change: { value: 0, trend: 'up' as const } 
    },
    conversion: { 
      value: currentMetrics?.conversion || 0, 
      change: { value: 0, trend: 'up' as const } 
    },
    errorRate: { 
      value: currentMetrics?.errorRate || 0, 
      change: { value: 0, trend: 'down' as const } 
    }
  };

  return (
    <DashboardLayout>
      <div className={cn(
        "min-h-screen bg-background px-6 py-8 transition-opacity duration-500 font-sans",
        isLoaded ? "opacity-100" : "opacity-0"
      )}>
        <div className="mx-auto max-w-full space-y-6">
          <Header 
            timeframe={timeframe}
            onTimeframeChange={handleTimeframeChange}
            environment={environment}
            onEnvironmentChange={handleEnvironmentChange}
            selectedDevice={selectedDevice}
            onDeviceChange={handleDeviceChange}
            selectedMetrics={selectedMetrics}
            onMetricsChange={handleMetricsChange}
            hiddenMetrics={hiddenMetrics}
            onMetricVisibilityChange={handleMetricVisibilityChange}
            showTrue={showTrue}
            showFalse={showFalse}
            onToggleTrue={handleToggleTrue}
            onToggleFalse={handleToggleFalse}
          />
          
          <DashboardMetrics 
            selectedMetrics={visibleMetrics}
            currentMetrics={formattedMetrics}
            filteredEvaluationData={filteredEvaluationData}
            filteredConversionData={filteredConversionData}
            filteredErrorRateData={filteredErrorRateData}
            evaluationVersionChanges={evaluationVersionChanges}
            conversionVersionChanges={conversionVersionChanges}
            errorRateVersionChanges={errorRateVersionChanges}
            showTrue={showTrue}
            showFalse={showFalse}
            timeframe={timeframe}
            selectedTimestamp={selectedTimestamp}
            selectedTimestamps={selectedTimestamps}
            selectedEventTypes={selectedEventTypes}
          />
          
          <DashboardFooter />
          
          <FeatureFlagHistory onEventSelect={handleTimestampSelect} selectedTimestamp={selectedTimestamp} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
