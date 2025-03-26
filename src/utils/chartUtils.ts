// Calculate optimal interval for the X axis based on data length
export const getXAxisInterval = (dataLength: number) => {
  if (dataLength > 60) return 14;
  if (dataLength > 40) return 8;
  if (dataLength > 20) return 4;
  if (dataLength > 14) return 2;
  return 1;
};

// Calculate optimal bar size based on data length
export const getBarSize = (dataLength: number) => {
  if (dataLength > 60) return 2;
  if (dataLength > 30) return 4;
  if (dataLength > 14) return 6;
  return 12;
};

// Predetermined max y-axis values for each metric type
// These values are based on the highest possible values when all variants are shown
const FIXED_Y_AXIS_MAX = {
  evaluations: 75, // Maximum for stacked evaluations
  conversion: 4,   // Maximum for conversion rate
  errorRate: 5     // Maximum for error rate
};

// Calculate Y axis domain with some padding based on which data series are visible
export const calculateYAxisDomain = (
  data: Array<{value: number, valueTrue?: number, valueFalse?: number}>,
  showTrue = false,
  showFalse = false,
  metricType?: 'evaluations' | 'conversion' | 'errorRate'
): [number, number] => {
  // If metricType is provided, use the fixed max value
  if (metricType && FIXED_Y_AXIS_MAX[metricType] !== undefined) {
    return [0, FIXED_Y_AXIS_MAX[metricType]];
  }
  
  // Otherwise, calculate dynamically (fallback)
  if (showTrue && showFalse) {
    // For stacked bars, calculate the total of both values
    const maxValue = Math.max(...data.map(item => {
      const trueVal = item.valueTrue || 0;
      const falseVal = item.valueFalse || 0;
      return trueVal + falseVal;
    }));
    return [0, Math.ceil(maxValue * 1.1)];
  } else if (showTrue) {
    const maxValue = Math.max(...data.map(item => item.valueTrue || 0));
    return [0, Math.ceil(maxValue * 1.1)];
  } else if (showFalse) {
    const maxValue = Math.max(...data.map(item => item.valueFalse || 0));
    return [0, Math.ceil(maxValue * 1.1)];
  } else {
    // Default to the original value
    const maxValue = Math.max(...data.map(item => item.value));
    return [0, Math.ceil(maxValue * 1.1)];
  }
};

// Process version changes to match filtered data positions
export const processVersionChanges = (
  versionChanges: Array<{
    date: string;
    position: number;
    version: string;
    details?: string;
  }>,
  originalData: Array<{name: string}>,
  filteredData: Array<{name: string}>
) => {
  return versionChanges
    .map(change => {
      // Find the date of the original version change
      const originalDate = originalData[change.position]?.name;
      // Find the new position in filtered data
      const newPosition = filteredData.findIndex(item => item.name === originalDate);
      return {
        ...change,
        position: newPosition >= 0 ? newPosition : 0 // Default to 0 if not found
      };
    })
    .filter(change => change.position >= 0);
};
