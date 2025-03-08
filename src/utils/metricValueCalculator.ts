
import { DataPoint } from '@/components/BarChart';

/**
 * Calculates the displayed value based on chart data, selected variants, and metric type
 */
export const calculateDisplayValue = (
  value: string | number,
  chartData: DataPoint[] | undefined,
  showTrue?: boolean,
  showFalse?: boolean,
  metricType?: 'evaluations' | 'conversion' | 'errorRate'
): string | number => {
  if (!chartData || chartData.length === 0) return value;
  
  // For evaluations (Total Evaluations), calculate the sum based on selected variants
  if (metricType === 'evaluations') {
    let sum = 0;
    
    if (showTrue && showFalse) {
      // Sum both true and false values
      chartData.forEach(item => {
        sum += (item.valueTrue || 0) + (item.valueFalse || 0);
      });
    } else if (showTrue) {
      // Only sum true values
      chartData.forEach(item => {
        sum += (item.valueTrue || 0);
      });
    } else if (showFalse) {
      // Only sum false values
      chartData.forEach(item => {
        sum += (item.valueFalse || 0);
      });
    } else {
      // Default to the original value
      return value;
    }
    
    return sum;
  }
  
  // For conversion and error rates, calculate average based on selected variants
  else if (metricType === 'conversion' || metricType === 'errorRate') {
    let sum = 0;
    let count = 0;
    
    if (showTrue && showFalse) {
      // Take the average of true and false values per day, then average those
      const dailyAverages: number[] = [];
      
      chartData.forEach(item => {
        const trueVal = item.valueTrue || 0;
        const falseVal = item.valueFalse || 0;
        
        // Only include days with data
        if (trueVal > 0 || falseVal > 0) {
          // Calculate the average for this day (true mathematical average)
          const validValues = [];
          if (trueVal > 0) validValues.push(trueVal);
          if (falseVal > 0) validValues.push(falseVal);
          
          if (validValues.length > 0) {
            const dayAvg = validValues.reduce((a, b) => a + b) / validValues.length;
            dailyAverages.push(dayAvg);
          }
        }
      });
      
      // Calculate the average of all daily averages
      if (dailyAverages.length > 0) {
        const overallAvg = dailyAverages.reduce((a, b) => a + b) / dailyAverages.length;
        return metricType === 'conversion' || metricType === 'errorRate' 
          ? `${overallAvg.toFixed(1)}%` 
          : overallAvg.toFixed(1);
      }
    } else if (showTrue) {
      // Average of true values
      chartData.forEach(item => {
        const val = item.valueTrue || 0;
        if (val > 0) {
          sum += val;
          count++;
        }
      });
    } else if (showFalse) {
      // Average of false values
      chartData.forEach(item => {
        const val = item.valueFalse || 0;
        if (val > 0) {
          sum += val;
          count++;
        }
      });
    } else {
      // Default to the original value
      return value;
    }
    
    const avg = count > 0 ? sum / count : 0;
    return metricType === 'conversion' || metricType === 'errorRate' 
      ? `${avg.toFixed(1)}%` 
      : avg.toFixed(1);
  }
  
  return value;
};
