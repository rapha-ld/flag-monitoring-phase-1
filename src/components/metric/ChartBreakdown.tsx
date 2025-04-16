import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DataPoint } from '../BarChart';
import MiniChart from './MiniChart';
import { getApplicationBreakdowns, getSDKBreakdowns } from '@/utils/chartBreakdownUtils';
import { ChartAnnotation } from '@/data/annotationData';

interface ChartBreakdownProps {
  type: 'application' | 'sdk';
  chartData?: DataPoint[];
  showTrue?: boolean;
  showFalse?: boolean;
  selectedTimestamp?: Date | null;
  selectedTimestamps?: Date[] | null;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
  timeframe?: string;
  annotations?: ChartAnnotation[];
}

const ChartBreakdown: React.FC<ChartBreakdownProps> = ({
  type,
  chartData,
  showTrue = true,
  showFalse = false,
  selectedTimestamp,
  selectedTimestamps,
  hoveredTimestamp,
  onHoverTimestamp,
  timeframe,
  annotations
}) => {
  // Get appropriate breakdown data based on the type
  const [breakdownData, setBreakdownData] = useState<any[]>([]);
  
  useEffect(() => {
    if (type === 'application') {
      setBreakdownData(getApplicationBreakdowns(chartData));
    } else {
      setBreakdownData(getSDKBreakdowns(chartData));
    }
  }, [type, chartData]);

  // Keep track of the highest value across all charts for consistent scaling
  const [maxYValue, setMaxYValue] = useState<number | undefined>(undefined);

  // Process all the data to find the maximum value for Y axis scaling
  useEffect(() => {
    if (!chartData || chartData.length === 0) return;
    
    // Calculate the max value across all data sets
    let overallMax = 0;
    
    breakdownData.forEach(item => {
      const maxInDataset = Math.max(...item.data.map((d: any) => {
        return Math.max(
          (showTrue && showFalse) ? ((d.valueTrue || 0) + (d.valueFalse || 0)) :
          showTrue ? (d.valueTrue || 0) :
          showFalse ? (d.valueFalse || 0) : (d.value || 0)
        );
      }));
      
      overallMax = Math.max(overallMax, maxInDataset);
    });
    
    // Add 10% padding to the max value
    setMaxYValue(overallMax * 1.1);
  }, [chartData, breakdownData, showTrue, showFalse]);

  // Handle the timestamp hover synchronization
  const handleHoverTimestamp = (timestamp: string | null) => {
    if (onHoverTimestamp) {
      onHoverTimestamp(timestamp);
    }
  };

  useEffect(() => {
    if (hoveredTimestamp) {
      console.log(`ChartBreakdown received hoveredTimestamp: ${hoveredTimestamp}`);
    }
  }, [hoveredTimestamp]);

  // Keep same colors as the main chart
  const trueColor = '#2BB7D2';
  const falseColor = '#FFD099';

  return (
    <div className="pt-4">
      <div className="grid grid-cols-2 gap-4">
        {breakdownData.map((item, index) => {
          // Calculate percentage of the total
          const totalEvaluations = chartData && chartData.length > 0 
            ? chartData.reduce((sum, point) => sum + (point.value || 0), 0)
            : 1;
            
          const itemEvaluations = item.data.reduce((sum: number, point: any) => sum + (point.value || 0), 0);
          const percentage = (itemEvaluations / totalEvaluations) * 100;
          
          // Find the annotations relevant to this specific breakdown item
          const itemAnnotations = annotations?.filter(a => {
            // Logic to determine if an annotation applies to this item
            // This might need customization based on your data structure
            return item.title.toLowerCase().includes(a.label.toLowerCase()) || 
                   a.label.toLowerCase().includes(item.title.toLowerCase());
          });
          
          return (
            <MiniChart
              key={`breakdown-${index}`} 
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
              onHoverTimestamp={handleHoverTimestamp}
              percentage={percentage}
              timeframe={timeframe}
              annotations={itemAnnotations}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ChartBreakdown;
