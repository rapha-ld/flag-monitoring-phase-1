
import React from 'react';
import VersionMarker from '../VersionMarker';
import { VersionChange } from '../BarChart';

interface VersionMarkersProps {
  versionChanges: VersionChange[];
}

const VersionMarkers: React.FC<VersionMarkersProps> = ({ versionChanges }) => {
  const visibleVersionChanges = versionChanges.filter(change => 
    change.position >= 0 && change.position < 1000 // Large number to ensure all are visible initially
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

export default VersionMarkers;
