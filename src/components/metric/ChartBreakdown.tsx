
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
  const { breakdowns, maxYValue, percentages } = useMemo(() => {
    const getBreakdowns = type === 'application' 
      ? getApplicationBreakdowns 
      : getSDKBreakdowns;
    
    const breakdownData = getBreakdowns(chartData);
    
    // Calculate the highest value across all charts
    let maxValue = 0;
    let totalValue = 0;
    
    // First, calculate the total value across all charts and find the maximum value
    const updatedBreakdowns = breakdownData.map(item => {
      let itemTotal = 0;
      
      item.data.forEach(d => {
        const trueVal = d.valueTrue || 0;
        const falseVal = d.valueFalse || 0;
        const pointValue = (showTrue && showFalse) ? (trueVal + falseVal) : 
                          showTrue ? trueVal : 
                          showFalse ? falseVal : d.value || 0;
                          
        maxValue = Math.max(maxValue, pointValue);
        itemTotal += pointValue;
      });
      
      // Return a new object with the calculated total
      return {
        ...item,
        calculatedTotal: itemTotal
      };
    });
    
    // Sum up all the calculated totals
    totalValue = updatedBreakdowns.reduce((sum, item) => sum + item.calculatedTotal, 0);
    
    // Add 10% padding to the max value
    maxValue = maxValue * 1.1;
    
    // Now calculate percentages
    const itemPercentages = updatedBreakdowns.map(item => {
      return totalValue > 0 ? (item.calculatedTotal / totalValue) * 100 : 0;
    });
    
    return { 
      breakdowns: updatedBreakdowns, 
      maxYValue: maxValue,
      percentages: itemPercentages
    };
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
          percentage={percentages[index]}
        />
      ))}
    </div>
  );
};

export default ChartBreakdown;
