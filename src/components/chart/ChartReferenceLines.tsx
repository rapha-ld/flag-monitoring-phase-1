
import React from 'react';
import { ReferenceLine } from 'recharts';

interface ReferenceLineMarker {
  date: string;
  label: string;
  color: string;
}

interface ChartReferenceLinesProps {
  referenceLines: ReferenceLineMarker[];
}

const ChartReferenceLines: React.FC<ChartReferenceLinesProps> = ({ referenceLines }) => {
  return (
    <>
      {referenceLines.map((marker, index) => (
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
    </>
  );
};

export default ChartReferenceLines;
