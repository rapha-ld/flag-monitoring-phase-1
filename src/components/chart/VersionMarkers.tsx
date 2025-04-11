
import React from 'react';
import VersionMarker from '../VersionMarker';
import { getEventNameFromVersion } from '@/utils/eventUtils';

export interface VersionChange {
  date: string;
  position: number;
  version: string;
  details?: string;
}

interface VersionMarkersProps {
  versionChanges: VersionChange[];
}

const VersionMarkers: React.FC<VersionMarkersProps> = ({ versionChanges }) => {
  // Filter out version changes with invalid positions
  const visibleVersionChanges = versionChanges.filter(change => 
    change.position >= 0 && change.position < 1000 // Using a large number as a proxy for data.length
  );
  
  return (
    <>
      {visibleVersionChanges.map((change, index) => (
        <VersionMarker 
          key={`marker-${index}`}
          x={change.position}
          version={change.version}
          details={change.details}
          date={change.date}
          eventName={getEventNameFromVersion(change.version)}
        />
      ))}
    </>
  );
};

export default VersionMarkers;
