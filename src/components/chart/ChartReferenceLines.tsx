
import React from 'react';
import { ReferenceLine } from 'recharts';
import { referenceLineMarkers, thresholdLines } from '@/utils/chartReferenceLines';
import { ChartViewBox } from './types';

interface ChartReferenceLinesProps {
  metricType?: 'evaluations' | 'conversion' | 'errorRate';
}

const ChartReferenceLines = ({ metricType }: ChartReferenceLinesProps) => {
  const thresholdLine = metricType ? thresholdLines.find(t => t.metricType === metricType) : undefined;
  
  return (
    <>
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
    </>
  );
};

export default ChartReferenceLines;
