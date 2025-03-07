
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
    // Update data based on selected timeframe and environment
    let days = 14; // default
    
    if (timeframe.startsWith('custom-')) {
      // Handle custom date range
      days = parseInt(timeframe.replace('custom-', '').replace('d', ''));
    } else {
      days = parseInt(timeframe.replace('d', ''));
    }
    
    // Apply filter for time frame
    const filteredEval = getFilteredData(evaluationData, days, environment);
    const filteredConv = getFilteredData(conversionData, days, environment);
    const filteredError = getFilteredData(errorRateData, days, environment);
    
    setFilteredEvaluationData(filteredEval);
    setFilteredConversionData(filteredConv);
    setFilteredErrorRateData(filteredError);
    
    // Update metrics based on the filtered data
    const metrics = calculateMetrics(filteredEval, filteredConv, filteredError, days);
    setCurrentMetrics(metrics);
    
  }, [timeframe, environment]);

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
  };

  const handleEnvironmentChange = (value: string) => {
    setEnvironment(value);
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
        />
        
        {/* Metrics Cards with Embedded Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard 
            title="Evaluations" 
            value={currentMetrics.evaluations.value}
            change={currentMetrics.evaluations.change}
            info="Daily average evaluation score (0-100)"
            className="animate-slide-up [animation-delay:100ms]"
            chartData={filteredEvaluationData}
            versionChanges={evaluationVersionChanges.filter(change => 
              change.position < filteredEvaluationData.length
            )}
            valueFormatter={(value) => `${value}`}
            tooltipValueFormatter={(value) => `Score: ${value}`}
            barColor="#6E6F96"
            timeframe={timeframe}
          />
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
          />
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
          />
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
