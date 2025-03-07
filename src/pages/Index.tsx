
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import Header from '@/components/Header';
import MetricCard from '@/components/MetricCard';
import DashboardLayout from '@/components/layout/DashboardLayout';
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
import { processTrueFalseValues } from '@/utils/dataFilters';

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
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let days = 14; // default
    
    if (timeframe.startsWith('custom-')) {
      days = parseInt(timeframe.replace('custom-', '').replace('d', ''));
    } else {
      days = parseInt(timeframe.replace('d', ''));
    }
    
    console.log(`Filtering data for ${days} days`);
    
    // Get filtered data for the selected timeframe
    const filteredEval = getFilteredData(evaluationData, days, environment, selectedDevice);
    const filteredConv = getFilteredData(conversionData, days, environment, selectedDevice);
    const filteredError = getFilteredData(errorRateData, days, environment, selectedDevice);
    
    // Process data to add valueTrue and valueFalse properties
    const processedEval = processTrueFalseValues(filteredEval);
    const processedConv = processTrueFalseValues(filteredConv);
    const processedError = processTrueFalseValues(filteredError);
    
    console.log(`Processed eval data length: ${processedEval.length}`);
    
    setFilteredEvaluationData(processedEval);
    setFilteredConversionData(processedConv);
    setFilteredErrorRateData(processedError);
    
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
    if (!showTrue === false && !showFalse) {
      setShowFalse(true);
    }
  };

  const handleToggleFalse = () => {
    setShowFalse(!showFalse);
    if (!showFalse === false && !showTrue) {
      setShowTrue(true);
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
            showTrue={showTrue}
            showFalse={showFalse}
            onToggleTrue={handleToggleTrue}
            onToggleFalse={handleToggleFalse}
          />
          
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
                tooltipValueFormatter={(value) => `Score: ${value}`}
                barColor="#6E6F96"
                showTrue={showTrue}
                showFalse={showFalse}
                chartType="stacked"
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
              />
            )}
            {selectedMetrics.includes('errorRate') && (
              <MetricCard 
                title="Avg. Error Rate" 
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
                showTrue={showTrue}
                showFalse={showFalse}
                chartType="mixed"
              />
            )}
          </div>
          
          <footer className="py-6 text-center text-sm text-textSecondary animate-fade-in [animation-delay:700ms]">
            <p>Data refreshed every 2min. Last updated: about 1min ago</p>
          </footer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
