
import React from 'react';
import { ReferenceLine, ReferenceArea } from 'recharts';
import { format } from 'date-fns';
import { determineEventName, getEventIcon } from '@/utils/eventUtils';
import { ChartViewBox } from './types';

interface SelectionPoint {
  name: string;
  index: number;
  exactTime: Date;
  timestamp?: number | null;
  [key: string]: any;
}

interface ChartSelectionIndicatorsProps {
  selectedPoints: SelectionPoint[] | null;
}

const ChartSelectionIndicators = ({ selectedPoints }: ChartSelectionIndicatorsProps) => {
  if (!selectedPoints || selectedPoints.length === 0) return null;
  
  const hasSelectedPoints = selectedPoints && selectedPoints.length > 0;
  const firstPoint = hasSelectedPoints ? selectedPoints[0] : null;
  const lastPoint = hasSelectedPoints && selectedPoints.length > 1 
    ? selectedPoints[selectedPoints.length - 1] 
    : null;
  
  const showReferenceArea = firstPoint && lastPoint;
  const textGray = '#545A62';
  
  return (
    <>
      {showReferenceArea && (
        <ReferenceArea
          x1={firstPoint.name}
          x2={lastPoint.name}
          fill="#6E6F96"
          fillOpacity={0.1}
          stroke="#6E6F96"
          strokeOpacity={0.3}
          strokeWidth={1}
        />
      )}
      
      {selectedPoints.map((point, index) => {
        const formattedDate = format(point.exactTime, "MMM d");
        const eventName = determineEventName(point.exactTime);
        
        return (
          <ReferenceLine
            key={`selected-time-${index}`}
            x={point.name}
            stroke={textGray}
            strokeWidth={1.5}
            label={index === 0 || index === selectedPoints.length - 1 ? {
              position: 'top',
              content: ({ viewBox }: { viewBox: ChartViewBox }) => (
                <text
                  x={viewBox?.x ?? 0}
                  y={(viewBox?.y ?? 0) - 12}
                  fontSize={11}
                  textAnchor="middle"
                  fill={textGray}
                >
                  {eventName || formattedDate}
                </text>
              )
            } : undefined}
          />
        );
      })}
    </>
  );
};

export default ChartSelectionIndicators;
