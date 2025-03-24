
import { DataPoint } from '@/components/BarChart';

export const findSelectedDataPoints = (
  data: DataPoint[],
  selectedTimestamp?: Date | null,
  selectedTimestamps?: Date[] | null
) => {
  if ((!selectedTimestamp && !selectedTimestamps) || data.length === 0) return null;
  
  const timestamps = selectedTimestamps || (selectedTimestamp ? [selectedTimestamp] : []);
  
  if (timestamps.length === 0) return null;
  
  const dataPoints = data.map((point, index) => {
    const pointDate = point.date ? new Date(point.date) : 
                     (point.name && !isNaN(new Date(point.name).getTime()) ? 
                     new Date(point.name) : null);
    
    return {
      ...point,
      index,
      timestamp: pointDate ? pointDate.getTime() : null
    };
  }).filter(point => point.timestamp !== null);
  
  if (dataPoints.length === 0) return null;
  
  return timestamps.map(selectedTime => {
    const selectedTimeMs = selectedTime.getTime();
    let closestPoint = dataPoints[0];
    let minDiff = Math.abs(dataPoints[0].timestamp! - selectedTimeMs);
    
    for (let i = 1; i < dataPoints.length; i++) {
      const diff = Math.abs(dataPoints[i].timestamp! - selectedTimeMs);
      if (diff < minDiff) {
        minDiff = diff;
        closestPoint = dataPoints[i];
      }
    }
    
    return {
      ...closestPoint,
      exactTime: selectedTime
    };
  }).sort((a, b) => a.timestamp! - b.timestamp!);
};
