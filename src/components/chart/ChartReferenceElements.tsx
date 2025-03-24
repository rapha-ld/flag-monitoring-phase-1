
import React from 'react';
import { ReferenceLine, ReferenceArea } from 'recharts';
import { format } from 'date-fns';
import { getEventIcon, determineEventName } from '@/utils/eventUtils';

interface ChartReferenceElementsProps {
  thresholdLine?: {
    value: number;
    label: string;
    color: string;
    strokeDasharray: string;
    labelPosition: {
      position: string;
      offset: number;
    };
  };
  selectedPoints?: Array<{
    name: string;
    exactTime: Date;
    index: number;
  }> | null;
  textGray: string;
}

const ChartReferenceElements = ({
  thresholdLine,
  selectedPoints,
  textGray
}: ChartReferenceElementsProps) => {
  if (!selectedPoints || selectedPoints.length === 0) {
    return thresholdLine ? (
      <ReferenceLine
        y={thresholdLine.value}
        label={{
          value: thresholdLine.label,
          position: thresholdLine.labelPosition.position as any,
          offset: thresholdLine.labelPosition.offset,
          fill: thresholdLine.color,
          fontSize: 11,
          dx: 5
        }}
        stroke={thresholdLine.color}
        strokeDasharray={thresholdLine.strokeDasharray}
        strokeWidth={1.5}
      />
    ) : null;
  }

  const firstPoint = selectedPoints[0];
  const lastPoint = selectedPoints.length > 1 ? selectedPoints[selectedPoints.length - 1] : null;
  const showReferenceArea = firstPoint && lastPoint;

  return (
    <>
      {thresholdLine && (
        <ReferenceLine
          y={thresholdLine.value}
          label={{
            value: thresholdLine.label,
            position: thresholdLine.labelPosition.position as any,
            offset: thresholdLine.labelPosition.offset,
            fill: thresholdLine.color,
            fontSize: 11,
            dx: 5
          }}
          stroke={thresholdLine.color}
          strokeDasharray={thresholdLine.strokeDasharray}
          strokeWidth={1.5}
        />
      )}
      
      {showReferenceArea && (
        <ReferenceArea
          x1={firstPoint.name}
          x2={lastPoint.name}
          fill="#f1f1f4"
          fillOpacity={0.5}
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
              value: eventName || formattedDate
            } : undefined}
          />
        );
      })}
    </>
  );
};

export default ChartReferenceElements;
