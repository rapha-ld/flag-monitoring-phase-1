
import { DataPoint } from '@/components/BarChart';
import { format } from 'date-fns';
import { Flag, Settings, AlertTriangle, ToggleLeft, RefreshCw, ToggleRight } from 'lucide-react';
import React from 'react';

export const getEventIcon = (timestamp: Date) => {
  const timeMs = timestamp.getTime();
  
  if (timeMs > Date.now() - 10 * 24 * 60 * 60 * 1000) {
    return React.createElement(ToggleRight, { className: "h-4 w-4" });
  }
  else if (timeMs > Date.now() - 40 * 24 * 60 * 60 * 1000) {
    return React.createElement(RefreshCw, { className: "h-4 w-4" });
  }
  else if (timeMs > Date.now() - 47 * 24 * 60 * 60 * 1000) {
    return React.createElement(ToggleLeft, { className: "h-4 w-4" });
  }
  else if (timeMs > Date.now() - 55 * 24 * 60 * 60 * 1000) {
    return React.createElement(AlertTriangle, { className: "h-4 w-4" });
  }
  else if (timeMs > Date.now() - 80 * 24 * 60 * 60 * 1000) {
    return React.createElement(Settings, { className: "h-4 w-4" });
  }
  else {
    return React.createElement(Flag, { className: "h-4 w-4" });
  }
};

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

export function isPointInSelectedRange(
  point: DataPoint,
  selectedTimestamps: Date[] | null
): boolean {
  if (!selectedTimestamps || selectedTimestamps.length === 0) {
    return true; // No selection, so all points are visible
  }

  // Sort timestamps in ascending order
  const sortedTimestamps = [...selectedTimestamps].sort((a, b) => a.getTime() - b.getTime());
  
  // For single point selection, find the closest match
  if (sortedTimestamps.length === 1) {
    const pointDate = new Date(point.date || point.name);
    // Convert to string for comparison and check exact match
    return format(pointDate, 'yyyy-MM-dd') === format(sortedTimestamps[0], 'yyyy-MM-dd');
  }
  
  // For range selection, check if the point falls within the range
  const firstTimestamp = sortedTimestamps[0];
  const lastTimestamp = sortedTimestamps[sortedTimestamps.length - 1];
  
  const pointDate = new Date(point.date || point.name);
  const pointTime = pointDate.getTime();
  
  return pointTime >= firstTimestamp.getTime() && pointTime <= lastTimestamp.getTime();
}
