
import React from 'react';
import VersionMarker from '../VersionMarker';
import { VersionChange } from './types';

interface ChartVersionMarkersProps {
  versionChanges: VersionChange[];
}

const ChartVersionMarkers = ({ versionChanges }: ChartVersionMarkersProps) => {
  return (
    <>
      {versionChanges.map((change, index) => (
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

// Helper function to determine event name from version
const getEventNameFromVersion = (version: string): string => {
  const versionMap: Record<string, string> = {
    "1.0": "Flag created",
    "1.1": "Rules changed",
    "1.2": "Alert",
    "1.3": "Flag disabled",
    "1.4": "Flag updated",
    "1.5": "Flag enabled"
  };
  
  return versionMap[version] || "Version update";
};

export default ChartVersionMarkers;
