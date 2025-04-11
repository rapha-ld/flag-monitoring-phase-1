
import React, { useEffect } from 'react';
import { cn } from "@/lib/utils";
import Header from '@/components/Header';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import DashboardFooter from '@/components/dashboard/DashboardFooter';
import CollapsibleBanner from '@/components/layout/CollapsibleBanner';
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
    hoveredTimestamp,
    handleTimeframeChange,
    handleEnvironmentChange,
    handleDeviceChange,
    handleMetricsChange,
    handleMetricVisibilityChange,
    handleToggleTrue,
    handleToggleFalse,
    handleTimestampSelect,
    handleHoverTimestamp
  } = useDashboardData();

  // Global handler for chart hover events to sync across all charts
  const handleGlobalHover = (timestamp: string | null) => {
    console.log(`Index global hover handler called with: ${timestamp}`);
    handleHoverTimestamp(timestamp);
  };

  // Debug log to see if hoveredTimestamp is being updated
  useEffect(() => {
    console.log(`Index component detected hoveredTimestamp: ${hoveredTimestamp}`);
  }, [hoveredTimestamp]);

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
            selectedMetrics={selectedMetrics}
            onMetricsChange={handleMetricsChange}
            hiddenMetrics={hiddenMetrics}
            onMetricVisibilityChange={handleMetricVisibilityChange}
            showTrue={showTrue}
            showFalse={showFalse}
            onToggleTrue={handleToggleTrue}
            onToggleFalse={handleToggleFalse}
            metricsButtonVisible={false}
          />
          
          <DashboardMetrics 
            selectedMetrics={visibleMetrics}
            currentMetrics={currentMetrics}
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
            onHoverTimestamp={handleGlobalHover}
            onToggleTrue={handleToggleTrue}
            onToggleFalse={handleToggleFalse}
            hoveredTimestamp={hoveredTimestamp}
          />
          
          <CollapsibleBanner 
            timeframe={timeframe} 
            environment={environment}
            hoveredTimestamp={hoveredTimestamp}
            onHoverTimestamp={handleGlobalHover}
          />
          
          <DashboardFooter />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
