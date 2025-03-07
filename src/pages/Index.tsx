
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import Header from '@/components/Header';
import MetricCard from '@/components/MetricCard';
import BarChart from '@/components/BarChart';
import { 
  evaluationData, 
  evaluationVersionChanges,
  conversionData,
  conversionVersionChanges,
  errorRateData,
  errorRateVersionChanges,
  currentMetrics,
  getFilteredData
} from '@/data/chartData';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [timeframe, setTimeframe] = useState("14d");
  const [filteredEvaluationData, setFilteredEvaluationData] = useState(evaluationData);
  const [filteredConversionData, setFilteredConversionData] = useState(conversionData);
  const [filteredErrorRateData, setFilteredErrorRateData] = useState(errorRateData);

  useEffect(() => {
    // Simulate loading state for animation purposes
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update data based on selected timeframe
    const days = parseInt(timeframe.replace('d', ''));
    setFilteredEvaluationData(getFilteredData(evaluationData, days));
    setFilteredConversionData(getFilteredData(conversionData, days));
    setFilteredErrorRateData(getFilteredData(errorRateData, days));
  }, [timeframe]);

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
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
        />
        
        {/* Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard 
            title="Evaluations" 
            value={currentMetrics.evaluations.value}
            change={currentMetrics.evaluations.change}
            info="Daily average evaluation score (0-100)"
            className="animate-slide-up [animation-delay:100ms]"
          />
          <MetricCard 
            title="Checkout Conversion" 
            value={`${currentMetrics.conversion.value}%`}
            change={currentMetrics.conversion.change}
            info="Percentage of checkout completions from initiated sessions"
            className="animate-slide-up [animation-delay:200ms]"
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
          />
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up [animation-delay:400ms]">
          {/* Evaluations Chart */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Evaluations</h2>
              <span className="text-xs text-muted-foreground">Last {timeframe}</span>
            </div>
            <div className="bg-card border rounded-lg p-4 shadow-sm">
              <BarChart 
                data={filteredEvaluationData} 
                versionChanges={evaluationVersionChanges}
                barColor="hsl(221.2, 83%, 53.3%)"
                height={220}
                valueFormatter={(value) => `${value}`}
                tooltipValueFormatter={(value) => `Score: ${value}`}
              />
            </div>
          </div>
          
          {/* Conversion Rate Chart */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Checkout Conversion</h2>
              <span className="text-xs text-muted-foreground">Last {timeframe}</span>
            </div>
            <div className="bg-card border rounded-lg p-4 shadow-sm">
              <BarChart 
                data={filteredConversionData} 
                versionChanges={conversionVersionChanges}
                barColor="hsl(142.1, 76.2%, 36.3%)"
                height={220}
                valueFormatter={(value) => `${value}%`}
                tooltipValueFormatter={(value) => `Rate: ${value}%`}
              />
            </div>
          </div>
          
          {/* Error Rate Chart */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Error Rate</h2>
              <span className="text-xs text-muted-foreground">Last {timeframe}</span>
            </div>
            <div className="bg-card border rounded-lg p-4 shadow-sm">
              <BarChart 
                data={filteredErrorRateData} 
                versionChanges={errorRateVersionChanges}
                barColor="hsl(0, 84.2%, 60.2%)"
                height={220}
                valueFormatter={(value) => `${value}%`}
                tooltipValueFormatter={(value) => `Rate: ${value}%`}
              />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="py-6 text-center text-sm text-muted-foreground animate-fade-in [animation-delay:700ms]">
          <p>Data refreshed every 24 hours. Last updated: {new Date().toLocaleDateString()}</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
