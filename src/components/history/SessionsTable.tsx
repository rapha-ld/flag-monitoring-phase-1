
import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Play, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Input } from '@/components/ui/input';

// Define the interface for sessions data
interface Session {
  id: string;
  account: string;
  os: string;
  timestamp: Date;
}

// Sample data for the sessions table
const sessionsData: Session[] = [
  {
    id: '1',
    account: 'acme@example.com',
    os: 'macOS 14.3',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: '2',
    account: 'widget.co@example.com',
    os: 'Windows 11',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
  },
  {
    id: '3',
    account: 'tech.startup@example.com',
    os: 'Ubuntu 22.04',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: '4',
    account: 'global.corp@example.com',
    os: 'iOS 17.4',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    id: '5',
    account: 'consulting.firm@example.com',
    os: 'Android 14',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  // Additional 15 sessions
  {
    id: '6',
    account: 'marketing.team@example.com',
    os: 'macOS 14.2',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
  },
  {
    id: '7',
    account: 'design.studio@example.com',
    os: 'Windows 10',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 hours ago
  },
  {
    id: '8',
    account: 'finance.dept@example.com',
    os: 'macOS 14.0',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
  },
  {
    id: '9',
    account: 'legal.team@example.com',
    os: 'Windows 11',
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000) // 18 hours ago
  },
  {
    id: '10',
    account: 'hr.support@example.com',
    os: 'Ubuntu 20.04',
    timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000) // 1.5 days ago
  },
  {
    id: '11',
    account: 'research.lab@example.com',
    os: 'ChromeOS 123',
    timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000) // 2.5 days ago
  },
  {
    id: '12',
    account: 'sales.team@example.com',
    os: 'iOS 17.3',
    timestamp: new Date(Date.now() - 3.2 * 24 * 60 * 60 * 1000) // 3.2 days ago
  },
  {
    id: '13',
    account: 'customer.support@example.com',
    os: 'Android 13',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
  },
  {
    id: '14',
    account: 'product.dev@example.com',
    os: 'macOS 13.6',
    timestamp: new Date(Date.now() - 4.5 * 24 * 60 * 60 * 1000) // 4.5 days ago
  },
  {
    id: '15',
    account: 'quality.assurance@example.com',
    os: 'Windows 11',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  },
  {
    id: '16',
    account: 'executive.office@example.com',
    os: 'macOS 14.3',
    timestamp: new Date(Date.now() - 5.5 * 24 * 60 * 60 * 1000) // 5.5 days ago
  },
  {
    id: '17',
    account: 'operations.team@example.com',
    os: 'Ubuntu 22.04',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
  },
  {
    id: '18',
    account: 'logistics.dept@example.com',
    os: 'Windows 10',
    timestamp: new Date(Date.now() - 6.5 * 24 * 60 * 60 * 1000) // 6.5 days ago
  },
  {
    id: '19',
    account: 'engineering.team@example.com',
    os: 'macOS 14.1',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  },
  {
    id: '20',
    account: 'analytics.group@example.com',
    os: 'Windows 11',
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) // 8 days ago
  }
];

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

const SessionsTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter sessions based on search query
  const filteredSessions = sessionsData.filter(session => {
    const query = searchQuery.toLowerCase();
    return (
      session.account.toLowerCase().includes(query) ||
      session.os.toLowerCase().includes(query)
    );
  });

  // Sort the filtered sessions data by timestamp in descending order
  const sortedSessionsData = [...filteredSessions].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="relative w-72 ml-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sessions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account</TableHead>
            <TableHead>OS</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead className="w-[80px] text-right">Replay</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSessionsData.length > 0 ? (
            sortedSessionsData.map((session) => (
              <TableRow key={session.id}>
                <TableCell className="font-medium">{session.account}</TableCell>
                <TableCell>{session.os}</TableCell>
                <TableCell>{formatTimestamp(session.timestamp)}</TableCell>
                <TableCell className="text-right">
                  <button className="p-1 rounded-full hover:bg-muted transition-colors" disabled>
                    <Play className="h-4 w-4 text-muted-foreground" />
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                No results found for "{searchQuery}"
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SessionsTable;
