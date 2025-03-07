
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import Header from '@/components/Header';
import MetricCard from '@/components/MetricCard';
import { 
  evaluationData, 
  evaluationVersionChanges,
  conversionData,
  conversionVersionChanges,
  errorRateData,
  errorRateVersionChanges,
  getFilteredData,
  calculateMetrics
} from '@/data/chartData';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [timeframe, setTimeframe] = useState("14d");
  const [environment, setEnvironment] = useState("production");
  const [selectedDevice, setSelectedDevice] = useState("all");
  const [selectedMetrics, setSelectedMetrics] = useState(['evaluations', 'conversion', 'errorRate']);
  const [showTrue, setShowTrue] = useState(true);
  const [showFalse, setShowFalse] = useState(false);
  const [filteredEvaluationData, setFilteredEvaluationData] = useState(evaluationData);
  const [filteredConversionData, setFilteredConversionData] = useState(conversionData);
  const [filteredErrorRateData, setFilteredErrorRateData] = useState(errorRateData);
  const [currentMetrics, setCurrentMetrics] = useState({
    evaluations: { value: 0, change: { value: 0, trend: 'up' as 'up' | 'down' } },
    conversion: { value: 0, change: { value: 0, trend: 'up' as 'up' | 'down' } },
    errorRate: { value: 0, change: { value: 0, trend: 'up' as 'up' | 'down' } }
  });

  useEffect(() => {
    // Simulate loading state for animation purposes
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update data based on selected timeframe, environment, and device
    let days = 14; // default
    
    if (timeframe.startsWith('custom-')) {
      // Handle custom date range
      days = parseInt(timeframe.replace('custom-', '').replace('d', ''));
    } else {
      days = parseInt(timeframe.replace('d', ''));
    }
    
    // Apply filters for time frame, environment, and device
    const filteredEval = getFilteredData(evaluationData, days, environment, selectedDevice);
    const filteredConv = getFilteredData(conversionData, days, environment, selectedDevice);
    const filteredError = getFilteredData(errorRateData, days, environment, selectedDevice);
    
    // Add true/false data for the stacked bar chart
    const processedEval = filteredEval.map(item => ({
      ...item,
      valueTrue: Math.round(item.value * 0.6), // 60% true
      valueFalse: Math.round(item.value * 0.4), // 40% false
    }));
    
    const processedConv = filteredConv.map(item => ({
      ...item,
      valueTrue: Math.round(item.value * 0.7), // 70% true
      valueFalse: Math.round(item.value * 0.3), // 30% false
    }));
    
    const processedError = filteredError.map(item => ({
      ...item,
      valueTrue: Math.round(item.value * 0.3), // 30% true
      valueFalse: Math.round(item.value * 0.7), // 70% false
    }));
    
    setFilteredEvaluationData(processedEval);
    setFilteredConversionData(processedConv);
    setFilteredErrorRateData(processedError);
    
    // Update metrics based on the filtered data
    const metrics = calculateMetrics(filteredEval, filteredConv, filteredError, days);
    setCurrentMetrics(metrics);
    
  }, [timeframe, environment, selectedDevice]);

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
  };

  const handleEnvironmentChange = (value: string) => {
    setEnvironment(value);
  };

  const handleDeviceChange = (value: string) => {
    setSelectedDevice(value);
  };

  const handleMetricsChange = (metrics: string[]) => {
    setSelectedMetrics(metrics);
  };

  const handleToggleTrue = () => {
    setShowTrue(!showTrue);
    // If both would be unchecked, force at least one to be checked
    if (!showTrue === false && !showFalse) {
      setShowFalse(true);
    }
  };

  const handleToggleFalse = () => {
    setShowFalse(!showFalse);
    // If both would be unchecked, force at least one to be checked
    if (!showFalse === false && !showTrue) {
      setShowTrue(true);
    }
  };

  return (
    <div className={cn(
      "min-h-screen bg-background px-6 py-8 transition-opacity duration-500 font-sans",
      isLoaded ? "opacity-100" : "opacity-0"
    )}>
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Controls */}
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
        />
        
        {/* Metrics Cards with Embedded Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedMetrics.includes('evaluations') && (
            <MetricCard 
              title="Evaluations" 
              value={currentMetrics.evaluations.value}
              change={currentMetrics.evaluations.change}
              info="Total evaluation score for the selected time period"
              className="animate-slide-up [animation-delay:100ms]"
              chartData={filteredEvaluationData}
              versionChanges={evaluationVersionChanges.filter(change => 
                change.position < filteredEvaluationData.length
              )}
              valueFormatter={(value) => `${value}`}
              tooltipValueFormatter={(value) => `Score: ${value}`}
              barColor="#6E6F96"
              timeframe={timeframe}
              isTotal={true}
              showTrue={showTrue}
              showFalse={showFalse}
            />
          )}
          {selectedMetrics.includes('conversion') && (
            <MetricCard 
              title="Checkout Conversion" 
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
              timeframe={timeframe}
              showTrue={showTrue}
              showFalse={showFalse}
            />
          )}
          {selectedMetrics.includes('errorRate') && (
            <MetricCard 
              title="Error Rate" 
              value={`${currentMetrics.errorRate.value}%`}
              change={{
                value: Math.abs(currentMetrics.errorRate.change.value),
                trend: currentMetrics.errorRate.change.value < 0 ? 'up' : 'down' as 'up' | 'down'
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
              timeframe={timeframe}
              showTrue={showTrue}
              showFalse={showFalse}
            />
          )}
        </div>
        
        {/* Footer */}
        <footer className="py-6 text-center text-sm text-textSecondary animate-fade-in [animation-delay:700ms]">
          <p>Data refreshed every 24 hours. Last updated: {new Date().toLocaleDateString()}</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
