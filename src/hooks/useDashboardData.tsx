
import { useEffect, useState } from 'react';
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
import { DataPoint } from '@/components/BarChart';

export const useDashboardData = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [timeframe, setTimeframe] = useState("14d");
  const [environment, setEnvironment] = useState("production");
  const [selectedDevice, setSelectedDevice] = useState("all");
  const [selectedMetrics, setSelectedMetrics] = useState(['evaluations', 'conversion', 'errorRate']);
  const [hiddenMetrics, setHiddenMetrics] = useState<string[]>([]);
  const [showTrue, setShowTrue] = useState(true);
  const [showFalse, setShowFalse] = useState(true);
  const [filteredEvaluationData, setFilteredEvaluationData] = useState<DataPoint[]>(evaluationData);
  const [filteredConversionData, setFilteredConversionData] = useState<DataPoint[]>(conversionData);
  const [filteredErrorRateData, setFilteredErrorRateData] = useState<DataPoint[]>(errorRateData);
  const [selectedTimestamp, setSelectedTimestamp] = useState<Date | null>(null);
  const [currentMetrics, setCurrentMetrics] = useState({
    evaluations: { value: 0, change: { value: 0, trend: 'up' as 'up' | 'down' } },
    conversion: { value: 0, change: { value: 0, trend: 'up' as 'up' | 'down' } },
    errorRate: { value: 0, change: { value: 0, trend: 'up' as 'up' | 'down' } }
  });

  // Calculate visible metrics (selected metrics that aren't hidden)
  const visibleMetrics = selectedMetrics.filter(metric => !hiddenMetrics.includes(metric));

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
    
    const filteredEval = getFilteredData(evaluationData, days, environment, selectedDevice);
    const filteredConv = getFilteredData(conversionData, days, environment, selectedDevice);
    const filteredError = getFilteredData(errorRateData, days, environment, selectedDevice);
    
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

  const handleMetricVisibilityChange = (metric: string, visible: boolean) => {
    setHiddenMetrics(prev => 
      visible 
        ? prev.filter(m => m !== metric) // Remove from hidden if now visible
        : [...prev, metric] // Add to hidden if now hidden
    );
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

  const handleTimestampSelect = (timestamp: Date | null) => {
    setSelectedTimestamp(timestamp);
  };

  return {
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
    handleTimeframeChange,
    handleEnvironmentChange,
    handleDeviceChange,
    handleMetricsChange,
    handleMetricVisibilityChange,
    handleToggleTrue,
    handleToggleFalse,
    handleTimestampSelect
  };
};
