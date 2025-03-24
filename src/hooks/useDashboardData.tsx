import { useState, useEffect } from 'react';
import { subDays, subWeeks, subMonths, subYears } from 'date-fns';

interface DataPoint {
  name: string;
  value: number;
  valueTrue?: number;
  valueFalse?: number;
  date?: string;
}

interface VersionChange {
  date: string;
  position: number;
  version: string;
  details?: string;
}

interface DashboardDataReturn {
  isLoaded: boolean;
  timeframe: string;
  environment: string;
  selectedDevice: string;
  selectedMetrics: string[];
  hiddenMetrics: string[];
  visibleMetrics: string[];
  showTrue: boolean;
  showFalse: boolean;
  filteredEvaluationData: DataPoint[];
  filteredConversionData: DataPoint[];
  filteredErrorRateData: DataPoint[];
  currentMetrics: { [key: string]: number };
  evaluationVersionChanges: VersionChange[];
  conversionVersionChanges: VersionChange[];
  errorRateVersionChanges: VersionChange[];
  selectedTimestamp: Date | null;
  selectedTimestamps: Date[] | null;
  selectedEventTypes: string[] | null;
  handleTimeframeChange: (timeframe: string) => void;
  handleEnvironmentChange: (environment: string) => void;
  handleDeviceChange: (device: string) => void;
  handleMetricsChange: (metrics: string[]) => void;
  handleMetricVisibilityChange: (metric: string, visible: boolean) => void;
  handleToggleTrue: (checked: boolean) => void;
  handleToggleFalse: (checked: boolean) => void;
  handleTimestampSelect: (timestamps: Date[] | null, eventTypes?: string[] | null) => void;
}

export const useDashboardData = (): DashboardDataReturn => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [timeframe, setTimeframe] = useState('7d');
  const [environment, setEnvironment] = useState('Production');
  const [selectedDevice, setSelectedDevice] = useState('All Devices');
  const [selectedMetrics, setSelectedMetrics] = useState(['evaluations', 'conversion', 'errorRate']);
  const [hiddenMetrics, setHiddenMetrics] = useState<string[]>([]);
  const [showTrue, setShowTrue] = useState(true);
  const [showFalse, setShowFalse] = useState(false);
  const [evaluationData, setEvaluationData] = useState<DataPoint[]>([]);
  const [conversionData, setConversionData] = useState<DataPoint[]>([]);
  const [errorRateData, setErrorRateData] = useState<DataPoint[]>([]);
  const [filteredEvaluationData, setFilteredEvaluationData] = useState<DataPoint[]>([]);
  const [filteredConversionData, setFilteredConversionData] = useState<DataPoint[]>([]);
  const [filteredErrorRateData, setFilteredErrorRateData] = useState<DataPoint[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<{ [key: string]: number }>({});
	const [evaluationVersionChanges, setEvaluationVersionChanges] = useState<VersionChange[]>([]);
  const [conversionVersionChanges, setConversionVersionChanges] = useState<VersionChange[]>([]);
  const [errorRateVersionChanges, setErrorRateVersionChanges] = useState<VersionChange[]>([]);
  const [selectedTimestamp, setSelectedTimestamp] = useState<Date | null>(null);
  const [selectedTimestamps, setSelectedTimestamps] = useState<Date[] | null>(null);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[] | null>(null);

  useEffect(() => {
    // Simulate loading data from an API
    setTimeout(() => {
      const now = new Date();
      const evaluations = Array.from({ length: 90 }, (_, i) => {
        const date = subDays(now, 90 - i);
        const dateString = date.toISOString().split('T')[0];
        return {
          name: dateString,
          value: Math.floor(Math.random() * 50),
          valueTrue: Math.floor(Math.random() * 50),
          valueFalse: Math.floor(Math.random() * 50),
          date: dateString,
        };
      });

      const conversions = Array.from({ length: 90 }, (_, i) => {
        const date = subDays(now, 90 - i);
        const dateString = date.toISOString().split('T')[0];
        return {
          name: dateString,
          value: parseFloat((Math.random() * 0.5).toFixed(2)),
          valueTrue: parseFloat((Math.random() * 0.5).toFixed(2)),
          valueFalse: parseFloat((Math.random() * 0.5).toFixed(2)),
          date: dateString,
        };
      });

      const errorRates = Array.from({ length: 90 }, (_, i) => {
        const date = subDays(now, 90 - i);
        const dateString = date.toISOString().split('T')[0];
        return {
          name: dateString,
          value: parseFloat((Math.random() * 5).toFixed(2)),
          valueTrue: parseFloat((Math.random() * 5).toFixed(2)),
          valueFalse: parseFloat((Math.random() * 5).toFixed(2)),
          date: dateString,
        };
      });

			const evaluationVersionChangesData = [
        { date: subDays(now, 65).toISOString().split('T')[0], position: 25, version: '1.0', details: 'Initial release' },
        { date: subDays(now, 40).toISOString().split('T')[0], position: 50, version: '1.1', details: 'Performance improvements' },
        { date: subDays(now, 15).toISOString().split('T')[0], position: 75, version: '1.2', details: 'Bug fixes' },
      ];

      const conversionVersionChangesData = [
          { date: subDays(now, 55).toISOString().split('T')[0], position: 35, version: '2.0', details: 'New feature A' },
          { date: subDays(now, 30).toISOString().split('T')[0], position: 60, version: '2.1', details: 'Feature A improvements' },
          { date: subDays(now, 5).toISOString().split('T')[0], position: 85, version: '2.2', details: 'Bug fixes for Feature A' },
      ];

      const errorRateVersionChangesData = [
          { date: subDays(now, 70).toISOString().split('T')[0], position: 20, version: '3.0', details: 'Refactor module B' },
          { date: subDays(now, 45).toISOString().split('T')[0], position: 45, version: '3.1', details: 'Module B optimizations' },
          { date: subDays(now, 10).toISOString().split('T')[0], position: 80, version: '3.2', details: 'Security patches for Module B' },
      ];

      setEvaluationData(evaluations);
      setConversionData(conversions);
      setErrorRateData(errorRates);
			setEvaluationVersionChanges(evaluationVersionChangesData);
      setConversionVersionChanges(conversionVersionChangesData);
      setErrorRateVersionChanges(errorRateVersionChangesData);
      setIsLoaded(true);
    }, 500);
  }, []);

  useEffect(() => {
    const now = new Date();
    let startDate;

    switch (timeframe) {
      case '7d':
        startDate = subDays(now, 7);
        break;
      case '30d':
        startDate = subDays(now, 30);
        break;
      case '90d':
        startDate = subDays(now, 90);
        break;
      case '180d':
        startDate = subDays(now, 180);
        break;
      case '1y':
        startDate = subYears(now, 1);
        break;
      case 'all':
        startDate = subYears(now, 5);
        break;
      default:
        startDate = subDays(now, 7);
        break;
    }

    const filteredEvaluations = evaluationData.filter(item => new Date(item.name) >= startDate);
    const filteredConversions = conversionData.filter(item => new Date(item.name) >= startDate);
    const filteredErrorRates = errorRateData.filter(item => new Date(item.name) >= startDate);

    setFilteredEvaluationData(filteredEvaluations);
    setFilteredConversionData(filteredConversions);
    setFilteredErrorRateData(filteredErrorRates);

    if (filteredEvaluations.length > 0 && filteredConversions.length > 0 && filteredErrorRates.length > 0) {
      setCurrentMetrics({
        evaluations: filteredEvaluations[filteredEvaluations.length - 1].value,
        conversion: filteredConversions[filteredConversions.length - 1].value,
        errorRate: filteredErrorRates[filteredErrorRates.length - 1].value,
      });
    }
  }, [timeframe, evaluationData, conversionData, errorRateData]);

  const handleTimeframeChange = (timeframe: string) => {
    setTimeframe(timeframe);
  };

  const handleEnvironmentChange = (environment: string) => {
    setEnvironment(environment);
  };

  const handleDeviceChange = (device: string) => {
    setSelectedDevice(device);
  };

  const handleMetricsChange = (metrics: string[]) => {
    setSelectedMetrics(metrics);
  };

  const handleMetricVisibilityChange = (metric: string, visible: boolean) => {
    if (visible) {
      setHiddenMetrics(prev => prev.filter(m => m !== metric));
    } else {
      setHiddenMetrics(prev => [...prev, metric]);
    }
  };

  const handleToggleTrue = (checked: boolean) => {
    setShowTrue(checked);
  };

  const handleToggleFalse = (checked: boolean) => {
    setShowFalse(checked);
  };

  const handleTimestampSelect = (timestamps: Date[] | null, eventTypes?: string[] | null) => {
    setSelectedTimestamp(timestamps ? timestamps[0] : null);
    setSelectedTimestamps(timestamps);
    setSelectedEventTypes(eventTypes || null);
  };

  const visibleMetrics = selectedMetrics.filter(metric => !hiddenMetrics.includes(metric));

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
    selectedEventTypes,
    handleTimeframeChange,
    handleEnvironmentChange,
    handleDeviceChange,
    handleMetricsChange,
    handleMetricVisibilityChange,
    handleToggleTrue,
    handleToggleFalse,
    handleTimestampSelect,
  };
};
