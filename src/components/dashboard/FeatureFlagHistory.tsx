
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { CheckCircle, XCircle, RefreshCw, Share2, Settings, Flag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Define the interface for history events
interface HistoryEvent {
  id: string;
  type: 'enabled' | 'disabled' | 'updated' | 'shared' | 'settings' | 'created';
  title: string;
  description: string;
  timestamp: Date;
}

// Sample data for the history table
const historyData: HistoryEvent[] = [
  {
    id: '1',
    type: 'enabled',
    title: 'Feature flag enabled',
    description: 'New checkout flow was enabled for production',
    timestamp: new Date(2023, 10, 15, 14, 30)
  },
  {
    id: '2',
    type: 'updated',
    title: 'Feature flag updated',
    description: 'Target audience changed from 10% to 25% of users',
    timestamp: new Date(2023, 10, 14, 9, 45)
  },
  {
    id: '3',
    type: 'disabled',
    title: 'Feature flag disabled',
    description: 'Old payment gateway was disabled',
    timestamp: new Date(2023, 10, 12, 16, 20)
  },
  {
    id: '4',
    type: 'settings',
    title: 'Settings changed',
    description: 'Changed rollout strategy to gradual',
    timestamp: new Date(2023, 10, 10, 11, 15)
  },
  {
    id: '5',
    type: 'shared',
    title: 'Flag shared',
    description: 'Flag was shared with the marketing team',
    timestamp: new Date(2023, 10, 8, 13, 50)
  },
  {
    id: '6',
    type: 'created',
    title: 'Flag created',
    description: 'New feature flag "checkout-v2" was created',
    timestamp: new Date(2023, 10, 5, 10, 0)
  }
];

// Helper function to get the appropriate icon for each event type
const getEventIcon = (type: HistoryEvent['type']) => {
  switch (type) {
    case 'enabled':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'disabled':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'updated':
      return <RefreshCw className="h-5 w-5 text-blue-500" />;
    case 'shared':
      return <Share2 className="h-5 w-5 text-purple-500" />;
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

const FeatureFlagHistory = () => {
  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-semibold">History</h2>
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
            <TableRow key={event.id}>
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
