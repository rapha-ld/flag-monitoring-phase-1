
import { ensureContinuousDates, generatePastDates, formatDate } from "./dateUtils";

// Filter data based on the selected timeframe, environment, and device
export const getFilteredData = (
  data: any[], 
  days: number, 
  environment: string = 'production',
  device: string = 'all',
  metricType?: string
) => {
  // First filter by environment if specified
  const envFilteredData = environment === 'all' 
    ? data 
    : data.filter(item => item.environment === environment);
  
  // Next, filter by device if specified
  const deviceFilteredData = device === 'all'
    ? envFilteredData
    : envFilteredData.filter(item => item.device === device);
  
  // For 1-hour timeframe, generate minute-based data
  if (days < 0.05) { // About 1 hour (1/24th of a day)
    // Generate 60 minutes of data
    const minuteData = Array.from({ length: 60 }, (_, i) => {
      const minute = i.toString().padStart(2, '0');
      const time = `${minute}m`;
      
      // Apply different base values based on metric type
      let baseValue = 0;
      if (metricType === 'evaluations') {
        baseValue = 5 + Math.floor(Math.random() * 10);
      } else if (metricType === 'conversion') {
        baseValue = 1 + Math.floor(Math.random() * 3);
      } else if (metricType === 'errorRate') {
        baseValue = 0.5 + Math.floor(Math.random() * 2);
      } else {
        baseValue = 2 + Math.floor(Math.random() * 5);
      }
      
      // Add some spikes for visual interest
      if (i % 5 === 0) {
        baseValue += Math.floor(Math.random() * 8);
      }
      
      const now = new Date();
      const minuteDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), i);
      
      return {
        name: time,
        time: time,
        value: baseValue,
        // Add device and environment to match the structure
        device: device === 'all' ? 'mobile' : device,
        environment: environment === 'all' ? 'production' : environment,
        date: minuteDate.toISOString()
      };
    });
    
    return minuteData;
  }
  
  // For 1-day timeframe, generate hourly data
  if (days === 1) {
    // Generate 24 hours of data
    const hourlyData = Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, '0');
      const time = `${hour}:00`;
      
      // Apply different base values based on metric type
      let baseValue = 0;
      if (metricType === 'evaluations') {
        baseValue = 15 + Math.floor(Math.random() * 25);
      } else if (metricType === 'conversion') {
        baseValue = 2 + Math.floor(Math.random() * 5);
      } else if (metricType === 'errorRate') {
        baseValue = 1 + Math.floor(Math.random() * 4);
      } else {
        baseValue = 5 + Math.floor(Math.random() * 15);
      }
      
      return {
        name: time,
        time: time,
        value: baseValue,
        // Add device and environment to match the structure
        device: device === 'all' ? 'mobile' : device,
        environment: environment === 'all' ? 'production' : environment,
        date: new Date().setHours(i, 0, 0, 0)
      };
    });
    
    return hourlyData;
  }
  
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
    // Apply different minimums based on metric type
    let value = item.value;
    
    // Only apply the 15+ minimum to evaluation data
    if (metricType === 'evaluations') {
      const minValue = 15;
      const maxRandomVariation = 10;
      value = item.value !== undefined && item.value >= minValue 
        ? item.value 
        : minValue + Math.floor(Math.random() * maxRandomVariation); // Random value between 15-25
    } else {
      // For other metrics, use either the existing value or a small random value
      value = item.value !== undefined && item.value > 1 
        ? item.value 
        : 1 + Math.floor(Math.random() * 4); // Random value between 1-5
    }
    
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
  const middleIndex = Math.floor(evaluationData.length / 2);
  
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
export const processTrueFalseValues = (data: any[], metricType?: string) => {
  return data.map(item => {
    let value, trueValue, falseValue;
    
    // Apply different processing based on metric type
    if (metricType === 'evaluations') {
      // For evaluations, ensure minimum value of 15
      value = item.value !== undefined ? Math.max(item.value, 15) : (15 + Math.floor(Math.random() * 10));
      
      // Calculate true/false values with slight randomness
      const trueRatio = 0.5 + (Math.random() * 0.2); // Between 50-70% true
      trueValue = Math.max(Math.round(value * trueRatio), 8); // Ensure true values are at least 8
      falseValue = Math.max(Math.round(value * (1 - trueRatio)), 7); // Ensure false values are at least 7
    } else {
      // For other metrics, use normal processing
      value = item.value !== undefined ? item.value : (1 + Math.floor(Math.random() * 4));
      
      // Calculate true/false values with slight randomness
      const trueRatio = 0.5 + (Math.random() * 0.2); // Between 50-70% true
      trueValue = Math.max(Math.round(value * trueRatio), 1);
      falseValue = Math.max(Math.round(value * (1 - trueRatio)), 1);
    }
    
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
