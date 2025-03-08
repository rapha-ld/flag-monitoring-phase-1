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
  
  // Keep only non-zero values
  const nonZeroData = deviceFilteredData.filter(item => item.value > 0);
  
  // Generate exact dates we need for the timeframe
  const requiredDates = generatePastDates(days).map(date => formatDate(date));
  
  // Pass all filtered data to ensureContinuousDates which will 
  // generate the exact number of days we need with the correct dates
  const result = ensureContinuousDates(nonZeroData, days);
  
  // Verify we have the exact number of days requested and they match our required dates
  if (result.length !== days) {
    console.error(`Data filtering error: Expected exactly ${days} data points but got ${result.length}`);
  }
  
  // Make sure names match exactly with our required dates
  const sortedResult = result.map((item, index) => ({
    ...item,
    name: requiredDates[index],
    // Keep null values as null, don't convert to 0
    value: item.value === null ? null : item.value,
    valueTrue: item.valueTrue === null ? null : item.valueTrue,
    valueFalse: item.valueFalse === null ? null : item.valueFalse
  }));
  
  return sortedResult;
};

// Process the data to ensure no true values are 0
export const processTrueFalseValues = (data: any[]) => {
  return data.map(item => {
    // Only process items that have a non-null value
    if (item.value !== null) {
      return {
        ...item,
        valueTrue: item.valueTrue !== undefined && item.valueTrue !== null ? 
          item.valueTrue : Math.round(item.value * 0.6), // 60% true
        valueFalse: item.valueFalse !== undefined && item.valueFalse !== null ? 
          item.valueFalse : Math.round(item.value * 0.4), // 40% false
      };
    }
    // Keep null values as is
    return item;
  });
};

// Calculate metrics based on filtered data
export const calculateMetrics = (
  evaluationData: any[], 
  conversionData: any[], 
  errorRateData: any[],
  days: number
) => {
  // Filter out null values before calculations
  const validEvalData = evaluationData.filter(item => item.value !== null);
  const validConvData = conversionData.filter(item => item.value !== null);
  const validErrorData = errorRateData.filter(item => item.value !== null);
  
  // For evaluations, calculate the total from non-null values
  const evalTotal = validEvalData.reduce((sum, item) => sum + item.value, 0);
  
  // For conversion, calculate the average from non-null values
  const convAvg = validConvData.length > 0 
    ? parseFloat((validConvData.reduce((sum, item) => sum + item.value, 0) / validConvData.length).toFixed(1))
    : 0;
  
  // For error rate, calculate the average from non-null values
  const errorAvg = validErrorData.length > 0
    ? parseFloat((validErrorData.reduce((sum, item) => sum + item.value, 0) / validErrorData.length).toFixed(1))
    : 0;
  
  // Calculate change (comparing to the first half of the period)
  const middleIndex = Math.floor(days / 2);
  
  // For evaluations, compare totals using non-null values
  const evalFirstHalf = validEvalData.filter((_, i) => i < middleIndex);
  const evalSecondHalf = validEvalData.filter((_, i) => i >= middleIndex);
  const evalFirstTotal = evalFirstHalf.reduce((sum, item) => sum + item.value, 0);
  const evalSecondTotal = evalSecondHalf.reduce((sum, item) => sum + item.value, 0);
  
  let evalChange = 0;
  if (evalFirstTotal > 0) {
    evalChange = parseFloat(((evalSecondTotal / evalFirstTotal - 1) * 100).toFixed(1));
  }
  
  // For conversion using non-null values
  const convFirstHalf = validConvData.filter((_, i) => i < middleIndex);
  const convSecondHalf = validConvData.filter((_, i) => i >= middleIndex);
  const convFirstAvg = convFirstHalf.length 
    ? convFirstHalf.reduce((sum, item) => sum + item.value, 0) / convFirstHalf.length 
    : convAvg;
  const convSecondAvg = convSecondHalf.length 
    ? convSecondHalf.reduce((sum, item) => sum + item.value, 0) / convSecondHalf.length 
    : convAvg;
  const convChange = parseFloat(((convSecondAvg / convFirstAvg - 1) * 100).toFixed(1));
  
  // For error rate using non-null values
  const errorFirstHalf = validErrorData.filter((_, i) => i < middleIndex);
  const errorSecondHalf = validErrorData.filter((_, i) => i >= middleIndex);
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
