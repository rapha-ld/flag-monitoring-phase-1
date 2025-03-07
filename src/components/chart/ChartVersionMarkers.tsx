
import React from 'react';
import VersionMarker from '../VersionMarker';
import { VersionChange } from '../BarChart';

interface ChartVersionMarkersProps {
  versionChanges: VersionChange[];
  filteredData: Array<{name: string}>;
  height: number | string;
}

const ChartVersionMarkers = ({ 
  versionChanges,
  filteredData,
  height
}: ChartVersionMarkersProps) => {
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

export default ChartVersionMarkers;
