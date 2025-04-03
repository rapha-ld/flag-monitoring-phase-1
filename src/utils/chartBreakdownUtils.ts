
import { DataPoint } from '../components/BarChart';

// Create sample data with unique patterns for each item based on factor and additional variance
export const createSampleData = (chartData: DataPoint[] | undefined, factor: number, variance: number = 0) => {
  if (!chartData) return [];
  
  return chartData.map((point, index) => {
    // Apply factor and add some randomization specific to this dataset
    const pointFactor = factor * (1 + (Math.sin(index * variance) * 0.2));
    
    return {
      ...point,
      valueTrue: Math.round((point.valueTrue || 0) * pointFactor),
      valueFalse: Math.round((point.valueFalse || 0) * pointFactor),
      value: Math.round((point.value || 0) * pointFactor),
    };
  });
};

// Calculate the total value of all data points for sorting
export const calculateTotalValue = (data: any[]) => {
  return data.reduce((sum, item) => {
    const trueVal = item.valueTrue || 0;
    const falseVal = item.valueFalse || 0;
    return sum + trueVal + falseVal;
  }, 0);
};

// Get application breakdown data with proper sorting
export const getApplicationBreakdowns = (chartData: DataPoint[] | undefined) => {
  // Create app breakdowns with more variance
  const appBreakdownsUnsorted = [
    { title: 'iOS App', version: 'v3.4.1', factor: 0.85, variance: 1.1, data: [] },
    { title: 'Android App', version: 'v3.3.7', factor: 0.67, variance: 0.9, data: [] },
    { title: 'React Web', version: 'v2.1.0', factor: 0.42, variance: 1.3, data: [] },
    { title: 'Desktop App', version: 'v1.9.2', factor: 0.30, variance: 0.7, data: [] },
    { title: 'Vue Web', version: 'v1.2.3', factor: 0.15, variance: 1.5, data: [] },
    { title: 'API Direct', version: 'N/A', factor: 0.08, variance: 0.5, data: [] },
  ];
  
  // Generate data for each app with its unique variance pattern
  appBreakdownsUnsorted.forEach(app => {
    app.data = createSampleData(chartData, app.factor, app.variance);
  });
  
  // Calculate total values and sort by total in descending order
  return [...appBreakdownsUnsorted]
    .map(app => ({
      ...app,
      totalValue: calculateTotalValue(app.data)
    }))
    .sort((a, b) => b.totalValue - a.totalValue);
};

// Get SDK breakdown data with proper sorting
export const getSDKBreakdowns = (chartData: DataPoint[] | undefined) => {
  // Create SDK breakdowns with more variance
  const sdkBreakdownsUnsorted = [
    { title: 'JavaScript SDK', version: 'v2.8.3', factor: 0.90, variance: 0.8, data: [] },
    { title: 'iOS SDK', version: 'v2.3.1', factor: 0.65, variance: 1.2, data: [] },
    { title: 'Android SDK', version: 'v2.1.4', factor: 0.55, variance: 1.0, data: [] },
    { title: 'Server SDK', version: 'v1.5.1', factor: 0.40, variance: 0.7, data: [] },
    { title: 'Python SDK', version: 'v1.3.2', factor: 0.25, variance: 1.3, data: [] },
  ];
  
  // Generate data for each SDK with its unique variance pattern
  sdkBreakdownsUnsorted.forEach(sdk => {
    sdk.data = createSampleData(chartData, sdk.factor, sdk.variance);
  });
  
  // Calculate total values and sort by total in descending order
  return [...sdkBreakdownsUnsorted]
    .map(sdk => ({
      ...sdk,
      totalValue: calculateTotalValue(sdk.data)
    }))
    .sort((a, b) => b.totalValue - a.totalValue);
};
