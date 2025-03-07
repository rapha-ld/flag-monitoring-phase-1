
import { ensureContinuousDates } from "./dateUtils";

// Filter data based on the selected timeframe, environment, and device
export const getFilteredData = (
  data: any[], 
  days: number, 
  environment: string = 'production',
  device: string = 'all'
) => {
  // First filter by environment if specified
  const envFilteredData = environment === 'all' 
    ? data 
    : data.filter(item => item.environment === environment);
  
  // Next, filter by device if specified
  const deviceFilteredData = device === 'all'
    ? envFilteredData
    : envFilteredData.filter(item => item.device === device);
  
  // Take the exact number of days from the data
  // Make sure we get exactly the number of days requested
  const timeFilteredData = deviceFilteredData.slice(-days);
  
  // Ensure we have continuous dates with exact number of data points
  const continuousData = ensureContinuousDates(timeFilteredData, days);
  
  // If we have more than the requested days, trim the array
  if (continuousData.length > days) {
    return continuousData.slice(-days);
  }
  
  // If we have fewer than the requested days, pad the array
  if (continuousData.length < days) {
    const padding = Array(days - continuousData.length).fill(0).map((_, i) => ({
      name: `Pad-${i}`, // This will be replaced by ensureContinuousDates
      value: 0,
      date: new Date().toISOString(),
      environment: environment
    }));
    return ensureContinuousDates([...padding, ...continuousData], days);
  }
  
  return continuousData;
};

// Calculate metrics based on filtered data
export const calculateMetrics = (
  evaluationData: any[], 
  conversionData: any[], 
  errorRateData: any[],
  days: number
) => {
  // For evaluations, calculate the total
  const evalTotal = evaluationData.reduce((sum, item) => sum + item.value, 0);
  
  // For conversion, calculate the average
  const convSum = conversionData.reduce((sum, item) => sum + item.value, 0);
  const convAvg = parseFloat((convSum / conversionData.length).toFixed(1));
  
  // For error rate, calculate the average
  const errorSum = errorRateData.reduce((sum, item) => sum + item.value, 0);
  const errorAvg = parseFloat((errorSum / errorRateData.length).toFixed(1));
  
  // Calculate change (comparing to the first half of the period)
  const middleIndex = Math.floor(days / 2);
  
  // For evaluations, compare totals
  const evalFirstHalf = evaluationData.slice(0, middleIndex);
  const evalSecondHalf = evaluationData.slice(middleIndex);
  const evalFirstTotal = evalFirstHalf.reduce((sum, item) => sum + item.value, 0);
  const evalSecondTotal = evalSecondHalf.reduce((sum, item) => sum + item.value, 0);
  
  let evalChange = 0;
  if (evalFirstTotal > 0) {
    evalChange = parseFloat(((evalSecondTotal / evalFirstTotal - 1) * 100).toFixed(1));
  }
  
  // For conversion
  const convFirstHalf = conversionData.slice(0, middleIndex);
  const convSecondHalf = conversionData.slice(middleIndex);
  const convFirstAvg = convFirstHalf.length 
    ? convFirstHalf.reduce((sum, item) => sum + item.value, 0) / convFirstHalf.length 
    : convAvg;
  const convSecondAvg = convSecondHalf.length 
    ? convSecondHalf.reduce((sum, item) => sum + item.value, 0) / convSecondHalf.length 
    : convAvg;
  const convChange = parseFloat(((convSecondAvg / convFirstAvg - 1) * 100).toFixed(1));
  
  // For error rate
  const errorFirstHalf = errorRateData.slice(0, middleIndex);
  const errorSecondHalf = errorRateData.slice(middleIndex);
  const errorFirstAvg = errorFirstHalf.length 
    ? errorFirstHalf.reduce((sum, item) => sum + item.value, 0) / errorFirstHalf.length 
    : errorAvg;
  const errorSecondAvg = errorSecondHalf.length 
    ? errorSecondHalf.reduce((sum, item) => sum + item.value, 0) / errorSecondHalf.length 
    : errorAvg;
  const errorChange = parseFloat(((errorSecondAvg / errorFirstAvg - 1) * 100).toFixed(1));
  
  return {
    evaluations: {
      value: evalTotal,
      change: {
        value: evalChange,
        trend: evalChange >= 0 ? 'up' as const : 'down' as const
      }
    },
    conversion: {
      value: convAvg,
      change: {
        value: convChange,
        trend: convChange >= 0 ? 'up' as const : 'down' as const
      }
    },
    errorRate: {
      value: errorAvg,
      change: {
        value: errorChange,
        trend: errorChange <= 0 ? 'up' as const : 'down' as const
      }
    }
  };
};

// Process the data to ensure no true values are 0
export const processTrueFalseValues = (data: any[]) => {
  return data.filter(item => {
    // Only keep items where valueTrue is greater than 0
    // We'll add this property after filtering
    return item.value > 0;
  }).map(item => ({
    ...item,
    valueTrue: Math.round(item.value * 0.6), // 60% true
    valueFalse: Math.round(item.value * 0.4), // 40% false
  }));
};
