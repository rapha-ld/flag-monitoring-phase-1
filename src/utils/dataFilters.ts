
import { ensureContinuousDates } from "./dateUtils";

// Filter data based on the selected timeframe and environment
export const getFilteredData = (data: any[], days: number, environment: string = 'production') => {
  // First filter by environment if specified
  const envFilteredData = environment === 'all' 
    ? data 
    : data.filter(item => item.environment === environment);
  
  // Take the last 'days' items and ensure we have all dates
  const timeFilteredData = envFilteredData.slice(-days);
  
  // Ensure we have continuous dates with values
  const continuousData = ensureContinuousDates(timeFilteredData, days);
  
  // Return all data points, including those with 0 values
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
