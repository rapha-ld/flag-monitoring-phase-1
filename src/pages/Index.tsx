
import React from 'react';
import { cn } from "@/lib/utils";
import Header from '@/components/Header';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import DashboardFooter from '@/components/dashboard/DashboardFooter';
import FeatureFlagHistory from '@/components/dashboard/FeatureFlagHistory';
import { useDashboardData } from '@/hooks/useDashboardData';
import CollapsibleBanner from '@/components/layout/CollapsibleBanner';

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

  // State to track hovered timestamp across all charts
  const [hoveredTimestamp, setHoveredTimestamp] = React.useState<string | null>(null);

  // Centralized handler for chart hover events
  const handleChartHover = (timestamp: string | null) => {
    setHoveredTimestamp(timestamp);
    handleHoverTimestamp(timestamp);
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
            metricsButtonVisible={false}
          />
          
          <CollapsibleBanner 
            timeframe={timeframe} 
            environment={environment}
            hoveredTimestamp={hoveredTimestamp}
            onHoverTimestamp={handleChartHover}
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
            onHoverTimestamp={handleChartHover}
            onToggleTrue={handleToggleTrue}
            onToggleFalse={handleToggleFalse}
            hoveredTimestamp={hoveredTimestamp}
          />
          
          <DashboardFooter />
          
          <FeatureFlagHistory 
            onEventSelect={handleTimestampSelect} 
            selectedTimestamp={selectedTimestamp}
            selectedTimestamps={selectedTimestamps}
            onHoverTimestamp={handleHoverTimestamp}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
