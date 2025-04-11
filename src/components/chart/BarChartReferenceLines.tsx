
import React from 'react';
import { ReferenceLine, ReferenceArea } from 'recharts';
import { format } from 'date-fns';
import { getEventIcon, determineEventName, getEventNameFromVersion } from '@/utils/eventUtils';

interface ChartViewBox {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

interface BarChartReferenceLinesProps {
  referenceLineMarkers: Array<{
    date: string;
    color: string;
    label: string;
  }>;
  thresholdLine?: {
    value: number;
    color: string;
    label: string;
    strokeDasharray: string;
    labelPosition: {
      position: string;
    };
  };
  hoveredTimestamp: string | null;
  selectedPoints: any[] | null;
  firstPoint: any | null;
  lastPoint: any | null;
  showReferenceArea: boolean;
  metricType?: 'evaluations' | 'conversion' | 'errorRate';
  textGray: string;
}

const BarChartReferenceLines: React.FC<BarChartReferenceLinesProps> = ({
  referenceLineMarkers,
  thresholdLine,
  hoveredTimestamp,
  selectedPoints,
  firstPoint,
  lastPoint,
  showReferenceArea,
  metricType,
  textGray
}) => {
  return (
    <>
      {hoveredTimestamp && (
        <ReferenceLine
          x={hoveredTimestamp}
          stroke="#6E6F96"
          strokeWidth={1}
          strokeDasharray="3 3"
          isFront={true}
        />
      )}
      
      {referenceLineMarkers.map((marker, index) => (
        <ReferenceLine
          key={`ref-line-${index}`}
          x={marker.date}
          stroke={marker.color}
          strokeWidth={2}
          strokeDasharray="3 3"
          label={{
            position: 'top',
            content: ({ viewBox }: { viewBox: ChartViewBox }) => (
              <text
                x={viewBox?.x ?? 0}
                y={(viewBox?.y ?? 0) - 10}
                fontSize={11}
                textAnchor="middle"
                fill={marker.color}
                fontWeight="bold"
              >
                {marker.label}
              </text>
            )
          }}
        />
      ))}
      
      {thresholdLine && (
        <ReferenceLine
          y={thresholdLine.value}
          label={{
            position: thresholdLine.labelPosition.position as any,
            content: ({ viewBox }: { viewBox: ChartViewBox }) => (
              <text
                x={(viewBox?.x ?? 0) + 5}
                y={viewBox?.y ?? 0}
                fontSize={11}
                textAnchor="start"
                fill={thresholdLine.color}
              >
                {thresholdLine.label}
              </text>
            )
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
          fill="#6E6F96"
          fillOpacity={0.1}
          stroke="#6E6F96"
          strokeOpacity={0.3}
          strokeWidth={1}
        />
      )}
      
      {selectedPoints && selectedPoints.map((point, index) => {
        const icon = getEventIcon(point.exactTime);
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

export default BarChartReferenceLines;
