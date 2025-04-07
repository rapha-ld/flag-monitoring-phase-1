
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
  const [timeframe, setTimeframe] = useState("30d");
  const [environment, setEnvironment] = useState("production");
  const [selectedDevice, setSelectedDevice] = useState("all");
  const [selectedMetrics, setSelectedMetrics] = useState(['evaluations', 'conversion']);
  const [hiddenMetrics, setHiddenMetrics] = useState<string[]>([]);
  const [showTrue, setShowTrue] = useState(true);
  const [showFalse, setShowFalse] = useState(true);
  const [filteredEvaluationData, setFilteredEvaluationData] = useState<DataPoint[]>(evaluationData);
  const [filteredConversionData, setFilteredConversionData] = useState<DataPoint[]>(conversionData);
  const [filteredErrorRateData, setFilteredErrorRateData] = useState<DataPoint[]>(errorRateData);
  const [selectedTimestamp, setSelectedTimestamp] = useState<Date | null>(null);
  const [selectedTimestamps, setSelectedTimestamps] = useState<Date[] | null>(null);
  const [currentMetrics, setCurrentMetrics] = useState({
    evaluations: { value: 0, change: { value: 0, trend: 'up' as 'up' | 'down' } },
    conversion: { value: 0, change: { value: 0, trend: 'up' as 'up' | 'down' } },
    errorRate: { value: 0, change: { value: 0, trend: 'up' as 'up' | 'down' } }
  });

  const visibleMetrics = selectedMetrics.filter(metric => !hiddenMetrics.includes(metric));

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let days = 30; // default
    
    if (timeframe.startsWith('custom-')) {
      days = parseInt(timeframe.replace('custom-', '').replace('d', ''));
    } else {
      days = parseInt(timeframe.replace('d', ''));
    }
    
    console.log(`Filtering data for ${days} days`);
    
    const filteredEval = getFilteredData(evaluationData, days, environment, selectedDevice, 'evaluations');
    const filteredConv = getFilteredData(conversionData, days, environment, selectedDevice, 'conversion');
    const filteredError = getFilteredData(errorRateData, days, environment, selectedDevice, 'errorRate');
    
    const processedEval = processTrueFalseValues(filteredEval, 'evaluations');
    const processedConv = processTrueFalseValues(filteredConv, 'conversion');
    const processedError = processTrueFalseValues(filteredError, 'errorRate');
    
    console.log(`Processed eval data length: ${processedEval.length}`);
    
    setFilteredEvaluationData(processedEval);
    setFilteredConversionData(processedConv);
    setFilteredErrorRateData(processedError);
    
    const metrics = calculateMetrics(filteredEval, filteredConv, filteredError, days);
    setCurrentMetrics(metrics);
  }, [timeframe, environment, selectedDevice]);

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
    setSelectedTimestamp(null);
    setSelectedTimestamps(null);
  };

  const handleEnvironmentChange = (value: string) => {
    setEnvironment(value);
    setSelectedTimestamp(null);
    setSelectedTimestamps(null);
  };

  const handleDeviceChange = (value: string) => {
    setSelectedDevice(value);
    setSelectedTimestamp(null);
    setSelectedTimestamps(null);
  };

  const handleMetricsChange = (metrics: string[]) => {
    setSelectedMetrics(metrics);
  };

  const handleMetricVisibilityChange = (metric: string, visible: boolean) => {
    setHiddenMetrics(prev => 
      visible 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
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

  const handleTimestampSelect = (timestamps: Date[] | null) => {
    if (!timestamps) {
      setSelectedTimestamp(null);
      setSelectedTimestamps(null);
    } else if (timestamps.length === 1) {
      setSelectedTimestamp(timestamps[0]);
      setSelectedTimestamps(null);
    } else {
      setSelectedTimestamp(null);
      setSelectedTimestamps(timestamps);
    }
  };

  // Add the missing handleHoverTimestamp function
  const handleHoverTimestamp = (timestamp: string | null) => {
    // This function will be used to handle hover events on the chart
    // No state update is needed here as it's just for UI feedback
    // The actual handling is done in child components
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
    selectedTimestamps,
    handleTimeframeChange,
    handleEnvironmentChange,
    handleDeviceChange,
    handleMetricsChange,
    handleMetricVisibilityChange,
    handleToggleTrue,
    handleToggleFalse,
    handleTimestampSelect,
    handleHoverTimestamp  // Add the function to the returned object
  };
};
