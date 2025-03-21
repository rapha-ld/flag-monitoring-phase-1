
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ToggleRight, ToggleLeft, RefreshCw, Settings, Flag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Define the interface for history events
interface HistoryEvent {
  id: string;
  type: 'enabled' | 'disabled' | 'updated' | 'settings' | 'created';
  title: string;
  description: string;
  timestamp: Date;
}

interface FeatureFlagHistoryProps {
  onEventSelect: (timestamp: Date | null) => void;
  selectedTimestamp: Date | null;
}

// Sample data for the history table - using more recent dates
const historyData: HistoryEvent[] = [
  {
    id: '1',
    type: 'enabled',
    title: 'Flag enabled',
    description: 'New checkout flow was enabled for production',
    timestamp: new Date(2024, 6, 15, 14, 30) // July 15, 2024
  },
  {
    id: '2',
    type: 'updated',
    title: 'Flag updated',
    description: 'Target audience changed from 10% to 25% of users',
    timestamp: new Date(2024, 5, 28, 9, 45) // June 28, 2024
  },
  {
    id: '3',
    type: 'disabled',
    title: 'Flag disabled',
    description: 'Old payment gateway was disabled',
    timestamp: new Date(2024, 5, 12, 16, 20) // June 12, 2024
  },
  {
    id: '4',
    type: 'settings',
    title: 'Settings changed',
    description: 'Changed rollout strategy to gradual',
    timestamp: new Date(2024, 4, 27, 11, 15) // May 27, 2024
  },
  {
    id: '5',
    type: 'created',
    title: 'Flag created',
    description: 'New feature flag "checkout-v2" was created',
    timestamp: new Date(2024, 4, 5, 10, 0) // May 5, 2024
  }
];

// Helper function to get the appropriate icon for each event type
const getEventIcon = (type: HistoryEvent['type']) => {
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
  }
};

// Format the date as a relative time (e.g., "2 days ago") and absolute time
const formatTimestamp = (date: Date) => {
  const relativeTime = formatDistanceToNow(date, { addSuffix: true });
  const absoluteTime = date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
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

const FeatureFlagHistory: React.FC<FeatureFlagHistoryProps> = ({ onEventSelect, selectedTimestamp }) => {
  // Handle row click
  const handleRowClick = (event: HistoryEvent) => {
    // If the timestamp is already selected, deselect it
    if (selectedTimestamp && selectedTimestamp.getTime() === event.timestamp.getTime()) {
      onEventSelect(null);
    } else {
      onEventSelect(event.timestamp);
    }
  };

  // Check if a row is selected
  const isRowSelected = (event: HistoryEvent) => {
    return selectedTimestamp && selectedTimestamp.getTime() === event.timestamp.getTime();
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-[15px] font-semibold">History</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Event</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right w-[200px]">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historyData.map((event) => (
            <TableRow 
              key={event.id}
              onClick={() => handleRowClick(event)}
              className={`cursor-pointer transition-colors ${isRowSelected(event) ? 'bg-primary/10' : ''}`}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  {getEventIcon(event.type)}
                  <span className="font-medium">{event.title}</span>
                </div>
              </TableCell>
              <TableCell>{event.description}</TableCell>
              <TableCell className="text-right">{formatTimestamp(event.timestamp)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FeatureFlagHistory;
