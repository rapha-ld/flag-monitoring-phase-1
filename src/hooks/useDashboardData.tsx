
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
  const [showTrue, setShowTrue] = useState(true);
  const [showFalse, setShowFalse] = useState(false);
  const [filteredEvaluationData, setFilteredEvaluationData] = useState<DataPoint[]>(evaluationData);
  const [filteredConversionData, setFilteredConversionData] = useState<DataPoint[]>(conversionData);
  const [filteredErrorRateData, setFilteredErrorRateData] = useState<DataPoint[]>(errorRateData);
  const [currentMetrics, setCurrentMetrics] = useState({
    evaluations: { value: 0, change: { value: 0, trend: 'up' as 'up' | 'down' } },
    conversion: { value: 0, change: { value: 0, trend: 'up' as 'up' | 'down' } },
    errorRate: { value: 0, change: { value: 0, trend: 'up' as 'up' | 'down' } }
  });

  // Initialize the data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Data filtering and processing
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

  // Event handlers
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

  return {
    isLoaded,
    timeframe,
    environment,
    selectedDevice,
    selectedMetrics,
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
    handleToggleFalse
  };
};
