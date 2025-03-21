
import React from 'react';
import { ReferenceLine } from 'recharts';
import { referenceLineMarkers, thresholdLines } from '@/utils/chartReferenceLines';
import { format } from 'date-fns';

interface ChartReferenceLinesProps {
  metricType?: 'evaluations' | 'conversion' | 'errorRate';
  selectedTimestamp?: Date | null;
  selectedPoint?: any;
}

const ChartReferenceLines: React.FC<ChartReferenceLinesProps> = ({
  metricType,
  selectedTimestamp,
  selectedPoint
}) => {
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
            value: marker.label,
            position: 'top',
            fill: marker.color,
            fontSize: 16,
            fontWeight: 'bold',
          }}
        />
      ))}
      
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
      
      {selectedTimestamp && selectedPoint && (
        <ReferenceLine
          x={selectedPoint.name}
          stroke="#7c5cfc"
          strokeWidth={2}
          label={{
            value: format(selectedTimestamp, "MMM d, h:mm a"),
            position: 'top',
            fill: '#7c5cfc',
            fontSize: 12,
          }}
        />
      )}
    </>
  );
};

export default ChartReferenceLines;
