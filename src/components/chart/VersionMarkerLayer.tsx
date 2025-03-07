
import React from 'react';
import { VersionChange } from '../BarChart';
import VersionMarker from '../VersionMarker';

interface VersionMarkerLayerProps {
  versionChanges: VersionChange[];
  filteredData: Array<{name: string}>;
  height: number | string;
}

const VersionMarkerLayer = ({ 
  versionChanges,
  filteredData,
  height
}: VersionMarkerLayerProps) => {
  if (!versionChanges || versionChanges.length === 0) {
    return null;
  }

  return (
    <>
      {versionChanges.map((change, index) => {
        if (change.position < 0) return null;
        const barWidth = 100 / filteredData.length;
        const xPosition = change.position * barWidth + (barWidth / 2);
        
        return (
          <VersionMarker 
            key={`version-${index}`}
            x={`${xPosition}%`}
            height={Number(height) - 35}
            version={change.version}
            date={change.date}
            details={change.details}
          />
        );
      })}
    </>
  );
};

export default VersionMarkerLayer;
