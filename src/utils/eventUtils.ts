
import { ToggleRight, ToggleLeft, RefreshCw, Settings, Flag, AlertTriangle } from 'lucide-react';
import React from 'react';

// Determine event name based on timestamp
export function determineEventName(timestamp: Date): string {
  const timeMs = timestamp.getTime();
  
  if (timeMs > Date.now() - 10 * 24 * 60 * 60 * 1000) {
    return "Flag enabled";
  }
  else if (timeMs > Date.now() - 40 * 24 * 60 * 60 * 1000) {
    return "Flag updated";
  }
  else if (timeMs > Date.now() - 47 * 24 * 60 * 60 * 1000) {
    return "Flag disabled";
  }
  else if (timeMs > Date.now() - 55 * 24 * 60 * 60 * 1000) {
    return "Alert";
  }
  else if (timeMs > Date.now() - 80 * 24 * 60 * 60 * 1000) {
    return "Rules changed";
  }
  else {
    return "Flag created";
  }
}

// Get event name from version string
export function getEventNameFromVersion(version: string): string {
  const versionMap: Record<string, string> = {
    "1.0": "Flag created",
    "1.1": "Rules changed",
    "1.2": "Alert",
    "1.3": "Flag disabled",
    "1.4": "Flag updated",
    "1.5": "Flag enabled"
  };
  
  return versionMap[version] || "Version update";
}

// Get event icon based on date
export const getEventIcon = (date: Date) => {
  const timestamp = date.getTime();
  
  if (timestamp > Date.now() - 10 * 24 * 60 * 60 * 1000) {
    return <ToggleRight className="h-4 w-4" />;
  }
  else if (timestamp > Date.now() - 40 * 24 * 60 * 60 * 1000) {
    return <RefreshCw className="h-4 w-4" />;
  }
  else if (timestamp > Date.now() - 47 * 24 * 60 * 60 * 1000) {
    return <ToggleLeft className="h-4 w-4" />;
  }
  else if (timestamp > Date.now() - 55 * 24 * 60 * 60 * 1000) {
    return <AlertTriangle className="h-4 w-4" />;
  }
  else if (timestamp > Date.now() - 80 * 24 * 60 * 60 * 1000) {
    return <Settings className="h-4 w-4" />;
  }
  else {
    return <Flag className="h-4 w-4" />;
  }
};
