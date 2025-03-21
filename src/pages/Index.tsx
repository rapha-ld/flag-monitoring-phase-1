
import React from 'react';
import { cn } from "@/lib/utils";
import Header from '@/components/Header';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import DashboardFooter from '@/components/dashboard/DashboardFooter';
import { useDashboardData } from '@/hooks/useDashboardData';
import { referenceLineMarkers } from '@/utils/chartReferenceLines';

const Index = () => {
  const {
    isLoaded,
    timeframe,
    environment,
    selectedDevice,
    selectedMetrics,
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
    handleTimeframeChange,
    handleEnvironmentChange,
    handleDeviceChange,
    handleMetricsChange,
    handleToggleTrue,
    handleToggleFalse,
    handleMetricVisibilityChange
  } = useDashboardData();

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
            showTrue={showTrue}
            showFalse={showFalse}
            onToggleTrue={handleToggleTrue}
            onToggleFalse={handleToggleFalse}
            onMetricVisibilityChange={handleMetricVisibilityChange}
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
          />
          
          <DashboardFooter />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
