
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { getXAxisInterval, getBarSize, calculateYAxisDomain } from '@/utils/chartUtils';
import { isPointInSelectedRange } from '@/utils/eventUtils';

export interface DataPoint {
  name: string;
  value: number;
  valueTrue?: number;
  valueFalse?: number;
  valueAvg?: number;
  date?: string;
  [key: string]: any;
}

export function useBarChartState(
  data: DataPoint[],
  showTrue: boolean,
  showFalse: boolean,
  metricType?: 'evaluations' | 'conversion' | 'errorRate',
  selectedTimestamp?: Date | null,
  selectedTimestamps?: Date[] | null
) {
  const interval = getXAxisInterval(data.length);
  const calculatedBarSize = getBarSize(data.length);
  
  const barSize = Math.max(4, calculatedBarSize * 0.9);
  const barGap = 2;
  const barCategoryGap = Math.max(4, calculatedBarSize * 0.2);
  
  const showAverage = showTrue && showFalse && (metricType === 'conversion' || metricType === 'errorRate');
  
  const yAxisDomain = calculateYAxisDomain(
    data, 
    showTrue, 
    showFalse,
    metricType
  );
  
  const trueColor = '#2BB7D2';
  const falseColor = '#FFD099';
  const textGray = '#545A62';
  
  const useLineChart = (metricType === 'conversion' || metricType === 'errorRate');
  
  const selectedPoints = useMemo(() => {
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
  }, [data, selectedTimestamp, selectedTimestamps]);
  
  const hasSelectedPoints = selectedPoints && selectedPoints.length > 0;
  
  const firstPoint = hasSelectedPoints ? selectedPoints[0] : null;
  const lastPoint = hasSelectedPoints && selectedPoints.length > 1 
    ? selectedPoints[selectedPoints.length - 1] 
    : null;
  
  const showReferenceArea = firstPoint && lastPoint;
  
  const getPointOpacity = () => 1;
  
  return {
    interval,
    barSize,
    barGap,
    barCategoryGap,
    showAverage,
    yAxisDomain,
    trueColor,
    falseColor,
    textGray,
    useLineChart,
    selectedPoints,
    hasSelectedPoints,
    firstPoint,
    lastPoint,
    showReferenceArea,
    getPointOpacity
  };
}
