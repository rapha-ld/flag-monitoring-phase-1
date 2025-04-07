
import { useState, useCallback, useMemo } from 'react';
import { evaluationData } from '@/data/evaluationData';
import { conversionData } from '@/data/conversionData';
import { errorRateData } from '@/data/errorRateData';
import { DataPoint } from '@/components/BarChart';
import { filterData } from '@/utils/dataFilters';

export const useDashboardData = () => {
  const [isLoaded, setIsLoaded] = useState(true);
  const [timeframe, setTimeframe] = useState('7d');
  const [environment, setEnvironment] = useState('production');
  const [selectedDevice, setSelectedDevice] = useState('all');
  const [showTrue, setShowTrue] = useState(true);
  const [showFalse, setShowFalse] = useState(false);
  const [selectedTimestamp, setSelectedTimestamp] = useState<Date | null>(null);
  const [selectedTimestamps, setSelectedTimestamps] = useState<Date[] | null>(null);

  // Hardcoded default metrics
  const selectedMetrics = ['evaluations', 'conversion', 'errorRate'];
  const hiddenMetrics: string[] = [];

  const handleTimeframeChange = useCallback((value: string) => {
    setTimeframe(value);
  }, []);

  const handleEnvironmentChange = useCallback((value: string) => {
    setEnvironment(value);
  }, []);

  const handleDeviceChange = useCallback((value: string) => {
    setSelectedDevice(value);
  }, []);

  const handleToggleTrue = useCallback(() => {
    setShowTrue(!showTrue);
  }, [showTrue]);

  const handleToggleFalse = useCallback(() => {
    setShowFalse(!showFalse);
  }, [showFalse]);

  const handleTimestampSelect = useCallback((timestamp: Date | null, isMultiSelect = false) => {
    if (isMultiSelect) {
      setSelectedTimestamps(prev => {
        if (!prev) return [timestamp!];
        if (prev.some(t => t.getTime() === timestamp?.getTime())) {
          return prev.filter(t => t.getTime() !== timestamp?.getTime());
        }
        return [...prev, timestamp!];
      });
    } else {
      setSelectedTimestamp(timestamp);
      setSelectedTimestamps(timestamp ? [timestamp] : null);
    }
  }, []);

  const filteredEvaluationData = useMemo(() => 
    filterData(evaluationData, { timeframe, environment, device: selectedDevice, showTrue, showFalse }), 
    [timeframe, environment, selectedDevice, showTrue, showFalse]
  );

  const filteredConversionData = useMemo(() => 
    filterData(conversionData, { timeframe, environment, device: selectedDevice, showTrue, showFalse }), 
    [timeframe, environment, selectedDevice, showTrue, showFalse]
  );

  const filteredErrorRateData = useMemo(() => 
    filterData(errorRateData, { timeframe, environment, device: selectedDevice, showTrue, showFalse }), 
    [timeframe, environment, selectedDevice, showTrue, showFalse]
  );

  const currentMetrics = useMemo(() => {
    const metrics: { [key: string]: DataPoint[] } = {};
    if (selectedMetrics.includes('evaluations')) metrics['evaluations'] = filteredEvaluationData;
    if (selectedMetrics.includes('conversion')) metrics['conversion'] = filteredConversionData;
    if (selectedMetrics.includes('errorRate')) metrics['errorRate'] = filteredErrorRateData;
    return metrics;
  }, [selectedMetrics, filteredEvaluationData, filteredConversionData, filteredErrorRateData]);

  const visibleMetrics = selectedMetrics.filter(metric => !hiddenMetrics.includes(metric));
  
  const evaluationVersionChanges = filteredEvaluationData.filter(point => point.versionChange);
  const conversionVersionChanges = filteredConversionData.filter(point => point.versionChange);
  const errorRateVersionChanges = filteredErrorRateData.filter(point => point.versionChange);

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
    handleToggleTrue,
    handleToggleFalse,
    handleTimestampSelect,
  };
};

