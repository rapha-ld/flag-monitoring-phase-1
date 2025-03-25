
import { formatDistanceToNow } from 'date-fns';
import { HistoryEvent, HistoryEventType } from '@/types/historyTypes';
import { ToggleRight, ToggleLeft, RefreshCw, Settings, Flag, AlertTriangle, X } from 'lucide-react';
import React from 'react';

export const getEventIcon = (type: HistoryEventType) => {
  switch (type) {
    case 'enabled':
      return <ToggleRight className="h-5 w-5 text-green-500" />;
    case 'disabled':
      return <ToggleLeft className="h-5 w-5 text-red-500" />;
    case 'updated':
      return <RefreshCw className="h-5 w-5 text-blue-500" />;
    case 'settings':
      return <Settings className="h-5 w-5 text-gray-500" />;
    case 'created':
      return <Flag className="h-5 w-5 text-amber-500" />;
    case 'alert':
      return <AlertTriangle className="h-5 w-5 text-orange-500" />;
  }
};

export const formatTimestamp = (date: Date) => {
  const relativeTime = formatDistanceToNow(date, { addSuffix: true });
  const absoluteTime = date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium">{absoluteTime}</span>
      <span className="text-xs text-muted-foreground">{relativeTime}</span>
    </div>
  );
};

export const formatTimeRangeDisplay = (timestamps: Date[]) => {
  if (!timestamps || timestamps.length === 0) return null;
  
  if (timestamps.length === 1) {
    return timestamps[0].toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
  
  // Sort timestamps chronologically
  const sortedTimestamps = [...timestamps].sort((a, b) => a.getTime() - b.getTime());
  const firstDate = sortedTimestamps[0];
  const lastDate = sortedTimestamps[sortedTimestamps.length - 1];
  
  const firstFormatted = firstDate.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  const lastFormatted = lastDate.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  return `${firstFormatted} to ${lastFormatted}`;
};

export const filterHistoryEvents = (
  events: HistoryEvent[],
  searchQuery: string,
  selectedTimestamp: Date | null,
  selectedTimestamps: Date[] | null
): HistoryEvent[] => {
  let filtered = events.filter(event => {
    const searchLower = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower) ||
      event.type.toLowerCase().includes(searchLower)
    );
  });

  // Apply timestamp filtering if we have selectedTimestamps
  if (selectedTimestamps && selectedTimestamps.length >= 2) {
    const startTime = selectedTimestamps[0].getTime();
    const endTime = selectedTimestamps[selectedTimestamps.length - 1].getTime();
    
    const filteredByTime = filtered.filter(event => {
      const eventTime = event.timestamp.getTime();
      return eventTime >= startTime && eventTime <= endTime;
    });

    if (filteredByTime.length > 0) {
      filtered = filteredByTime;
    }
  } 
  // If we have a single timestamp selection
  else if (selectedTimestamp) {
    const selectedTime = selectedTimestamp.getTime();
    const dayInMs = 24 * 60 * 60 * 1000;
    
    const filteredByTime = filtered.filter(event => {
      const eventTime = event.timestamp.getTime();
      return Math.abs(eventTime - selectedTime) <= dayInMs; // Within a day of the selected time
    });
    
    if (filteredByTime.length > 0) {
      filtered = filteredByTime;
    }
  }

  // Sort by timestamp (newest first)
  return [...filtered].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );
};
