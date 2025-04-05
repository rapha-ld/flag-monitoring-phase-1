
import React, { useMemo } from 'react';
import { DataPoint } from '../BarChart';
import MiniChart from './MiniChart';
import { getApplicationBreakdowns, getSDKBreakdowns } from '@/utils/chartBreakdownUtils';

interface ChartBreakdownProps {
  type: 'application' | 'sdk';
  chartData?: DataPoint[];
  showTrue?: boolean;
  showFalse?: boolean;
  selectedTimestamp?: Date | null;
  selectedTimestamps?: Date[] | null;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
}

const ChartBreakdown: React.FC<ChartBreakdownProps> = ({
  type,
  chartData,
  showTrue = true,
  showFalse = true,
  selectedTimestamp,
  selectedTimestamps,
  hoveredTimestamp,
  onHoverTimestamp
}) => {
  const trueColor = '#2BB7D2';
  const falseColor = '#FFD099';
  
  // Use useMemo to avoid recomputing breakdowns on each render
  const { breakdowns, maxYValue } = useMemo(() => {
    const getBreakdowns = type === 'application' 
      ? getApplicationBreakdowns 
      : getSDKBreakdowns;
    
    const breakdownData = getBreakdowns(chartData);
    
    // Calculate the highest value across all charts
    let maxValue = 0;
    breakdownData.forEach(item => {
      item.data.forEach(d => {
        const currentMax = Math.max(
          (showTrue && showFalse) ? (d.valueTrue || 0) + (d.valueFalse || 0) : 
          showTrue ? (d.valueTrue || 0) : 
          showFalse ? (d.valueFalse || 0) : d.value || 0
        );
        maxValue = Math.max(maxValue, currentMax);
      });
    });
    
    // Add 10% padding to the max value
    maxValue = maxValue * 1.1;
    
    return { breakdowns: breakdownData, maxYValue: maxValue };
  }, [chartData, type, showTrue, showFalse]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 h-full">
      {breakdowns.map((item, index) => (
        <MiniChart 
          key={`${type}-${index}`} 
          title={item.title} 
          version={item.version} 
          data={item.data} 
          showTrue={showTrue}
          showFalse={showFalse}
          trueColor={trueColor}
          falseColor={falseColor}
          factor={item.factor}
          maxYValue={maxYValue}
          selectedTimestamp={selectedTimestamp}
          selectedTimestamps={selectedTimestamps}
          hoveredTimestamp={hoveredTimestamp}
          onHoverTimestamp={onHoverTimestamp}
        />
      ))}
    </div>
  );
};

export default ChartBreakdown;
