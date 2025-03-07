
import React from 'react';
import VersionMarker from '../VersionMarker';
import { VersionChange } from '../BarChart';

interface VersionMarkersProps {
  versionChanges: VersionChange[];
  data: any[];
  height: number | string;
}

const VersionMarkers = ({ versionChanges, data, height }: VersionMarkersProps) => {
  if (!versionChanges || versionChanges.length === 0) return null;

  return (
    <>
      {versionChanges.map((change, index) => {
        if (change.position < 0) return null;
        const barWidth = 100 / data.length;
        const xPosition = change.position * barWidth + (barWidth / 2);
        
        return (
          <VersionMarker 
            key={`version-${index}`}
            x={`${xPosition}%`}
            height={typeof height === 'number' ? height - 35 : 165}
            version={change.version}
            date={change.date}
            details={change.details}
          />
        );
      })}
    </>
  );
};

export default VersionMarkers;
