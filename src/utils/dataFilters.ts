
import { ensureContinuousDates, generatePastDates, formatDate } from "./dateUtils";

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
  
  // Generate exact dates we need for the timeframe
  const requiredDates = generatePastDates(days).map(date => formatDate(date));
  
  // Pass all filtered data to ensureContinuousDates which will 
  // generate the exact number of days we need with the correct dates
  const result = ensureContinuousDates(deviceFilteredData, days);
  
  // Verify we have the exact number of days requested and they match our required dates
  if (result.length !== days) {
    console.error(`Data filtering error: Expected exactly ${days} data points but got ${result.length}`);
  }
  
  // Make sure names match exactly with our required dates and ensure minimum values with variation
  const sortedResult = result.map((item, index) => {
    // Use either the existing value or generate a small random value between 15-25
    // For evaluation charts, ensure minimum value is 15
    const minValue = 15;
    const maxRandomVariation = 10;
    const value = item.value !== undefined && item.value >= minValue 
      ? item.value 
      : minValue + Math.floor(Math.random() * maxRandomVariation); // Random value between 15-25
    
    return {
      ...item,
      name: requiredDates[index],
      value
    };
  });
  
  return sortedResult;
};

// Calculate metrics based on filtered data
export const calculateMetrics = (
  evaluationData: any[], 
  conversionData: any[], 
  errorRateData: any[],
  days: number
) => {
  // For evaluations, calculate the total
  const evalTotal = evaluationData.reduce((sum, item) => sum + (item.value || 0), 0);
  
  // For conversion, calculate the average
  const convSum = conversionData.reduce((sum, item) => sum + (item.value || 0), 0);
  const convAvg = parseFloat((convSum / conversionData.length).toFixed(1));
  
  // For error rate, calculate the average
  const errorSum = errorRateData.reduce((sum, item) => sum + (item.value || 0), 0);
  const errorAvg = parseFloat((errorSum / errorRateData.length).toFixed(1));
  
  // Calculate change (comparing to the first half of the period)
  const middleIndex = Math.floor(days / 2);
  
  // For evaluations, compare totals
  const evalFirstHalf = evaluationData.slice(0, middleIndex);
  const evalSecondHalf = evaluationData.slice(middleIndex);
  const evalFirstTotal = evalFirstHalf.reduce((sum, item) => sum + (item.value || 0), 0);
  const evalSecondTotal = evalSecondHalf.reduce((sum, item) => sum + (item.value || 0), 0);
  
  let evalChange = 0;
  if (evalFirstTotal > 0) {
    evalChange = parseFloat(((evalSecondTotal / evalFirstTotal - 1) * 100).toFixed(1));
  }
  
  // For conversion
  const convFirstHalf = conversionData.slice(0, middleIndex);
  const convSecondHalf = conversionData.slice(middleIndex);
  const convFirstAvg = convFirstHalf.length 
    ? convFirstHalf.reduce((sum, item) => sum + (item.value || 0), 0) / convFirstHalf.length 
    : convAvg;
  const convSecondAvg = convSecondHalf.length 
    ? convSecondHalf.reduce((sum, item) => sum + (item.value || 0), 0) / convSecondHalf.length 
    : convAvg;
  const convChange = parseFloat(((convSecondAvg / convFirstAvg - 1) * 100).toFixed(1));
  
  // For error rate
  const errorFirstHalf = errorRateData.slice(0, middleIndex);
  const errorSecondHalf = errorRateData.slice(middleIndex);
  const errorFirstAvg = errorFirstHalf.length 
    ? errorFirstHalf.reduce((sum, item) => sum + (item.value || 0), 0) / errorFirstHalf.length 
    : errorAvg;
  const errorSecondAvg = errorSecondHalf.length 
    ? errorSecondHalf.reduce((sum, item) => sum + (item.value || 0), 0) / errorSecondHalf.length 
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

// Process the data to ensure true/false values and calculate averages properly
export const processTrueFalseValues = (data: any[]) => {
  return data.map(item => {
    // Get the value, ensuring it's not below minimum (15 for evaluations)
    const value = item.value !== undefined ? Math.max(item.value, 15) : (15 + Math.floor(Math.random() * 10));
    
    // Calculate true/false values with slight randomness
    const trueRatio = 0.5 + (Math.random() * 0.2); // Between 50-70% true
    const trueValue = Math.max(Math.round(value * trueRatio), 8); // Ensure true values are at least 8
    const falseValue = Math.max(Math.round(value * (1 - trueRatio)), 7); // Ensure false values are at least 7
    
    return {
      ...item,
      value, // Use the existing or randomized value
      valueTrue: trueValue,
      valueFalse: falseValue,
      // Add an average value - this is the true mathematical average (not sum)
      valueAvg: (trueValue + falseValue) / 2,
    };
  });
};
