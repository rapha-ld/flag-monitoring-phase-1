
import React from 'react';
import VersionMarker from '../VersionMarker';
import { VersionChange } from '../BarChart';

interface ChartVersionMarkersProps {
  versionChanges: VersionChange[];
}

const ChartVersionMarkers: React.FC<ChartVersionMarkersProps> = ({ 
  versionChanges 
}) => {
  const visibleVersionChanges = versionChanges.filter(change => 
    change.position >= 0 && change.position < 100 // Arbitrary large number to show all
  );
  
  return (
    <>
      {visibleVersionChanges.map((change, index) => (
        <VersionMarker 
          key={`marker-${index}`}
          x={change.position}
          version={change.version}
          details={change.details}
        />
      ))}
    </>
  );
};

export default ChartVersionMarkers;
