
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Play, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Session {
  id: string;
  account: string;
  os: string;
  conversions: boolean;
  errors: number;
  timestamp: Date;
}

interface SessionsTableProps {
  selectedTimestamp?: Date | null;
  selectedTimestamps?: Date[] | null;
  onSessionSelect?: (timestamp: Date | null) => void;
}

const sessionsData: Session[] = [
  {
    id: '1',
    account: 'acme@example.com',
    os: 'macOS 14.3',
    conversions: true,
    errors: 0,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: '2',
    account: 'widget.co@example.com',
    os: 'Windows 11',
    conversions: false,
    errors: 2,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
  },
  {
    id: '3',
    account: 'tech.startup@example.com',
    os: 'Ubuntu 22.04',
    conversions: true,
    errors: 1,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: '4',
    account: 'global.corp@example.com',
    os: 'iOS 17.4',
    conversions: false,
    errors: 3,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    id: '5',
    account: 'consulting.firm@example.com',
    os: 'Android 14',
    conversions: true,
    errors: 0,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  {
    id: '6',
    account: 'marketing.team@example.com',
    os: 'macOS 14.2',
    conversions: false,
    errors: 4,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
  },
  {
    id: '7',
    account: 'design.studio@example.com',
    os: 'Windows 10',
    conversions: true,
    errors: 0,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 hours ago
  },
  {
    id: '8',
    account: 'finance.dept@example.com',
    os: 'macOS 14.0',
    conversions: true,
    errors: 1,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
  },
  {
    id: '9',
    account: 'legal.team@example.com',
    os: 'Windows 11',
    conversions: false,
    errors: 5,
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000) // 18 hours ago
  },
  {
    id: '10',
    account: 'hr.support@example.com',
    os: 'Ubuntu 20.04',
    conversions: true,
    errors: 0,
    timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000) // 1.5 days ago
  },
  {
    id: '11',
    account: 'research.lab@example.com',
    os: 'ChromeOS 123',
    conversions: false,
    errors: 2,
    timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000) // 2.5 days ago
  },
  {
    id: '12',
    account: 'sales.team@example.com',
    os: 'iOS 17.3',
    conversions: true,
    errors: 0,
    timestamp: new Date(Date.now() - 3.2 * 24 * 60 * 60 * 1000) // 3.2 days ago
  },
  {
    id: '13',
    account: 'customer.support@example.com',
    os: 'Android 13',
    conversions: false,
    errors: 3,
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
  },
  {
    id: '14',
    account: 'product.dev@example.com',
    os: 'macOS 13.6',
    conversions: true,
    errors: 1,
    timestamp: new Date(Date.now() - 4.5 * 24 * 60 * 60 * 1000) // 4.5 days ago
  },
  {
    id: '15',
    account: 'quality.assurance@example.com',
    os: 'Windows 11',
    conversions: false,
    errors: 4,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  },
  {
    id: '16',
    account: 'executive.office@example.com',
    os: 'macOS 14.3',
    conversions: true,
    errors: 0,
    timestamp: new Date(Date.now() - 5.5 * 24 * 60 * 60 * 1000) // 5.5 days ago
  },
  {
    id: '17',
    account: 'operations.team@example.com',
    os: 'Ubuntu 22.04',
    conversions: false,
    errors: 2,
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
  },
  {
    id: '18',
    account: 'logistics.dept@example.com',
    os: 'Windows 10',
    conversions: true,
    errors: 0,
    timestamp: new Date(Date.now() - 6.5 * 24 * 60 * 60 * 1000) // 6.5 days ago
  },
  {
    id: '19',
    account: 'engineering.team@example.com',
    os: 'macOS 14.1',
    conversions: false,
    errors: 5,
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  },
  {
    id: '20',
    account: 'analytics.group@example.com',
    os: 'Windows 11',
    conversions: true,
    errors: 1,
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) // 8 days ago
  }
];

const formatTimestamp = (date: Date) => {
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

const getConversionBadge = (hasConverted: boolean) => {
  return hasConverted ? 
    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900">YES</Badge> : 
    <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-200">NO</Badge>;
};

const getErrorDisplay = (errorCount: number) => {
  return <span className="font-medium">{errorCount}</span>;
};

const SessionsTable: React.FC<SessionsTableProps> = ({ 
  selectedTimestamp, 
  selectedTimestamps,
  onSessionSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSessions, setFilteredSessions] = useState(sessionsData);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [hoveredSessionId, setHoveredSessionId] = useState<string | null>(null);

  useEffect(() => {
    let filtered = sessionsData.filter(session => {
      const query = searchQuery.toLowerCase();
      return (
        session.account.toLowerCase().includes(query) ||
        session.os.toLowerCase().includes(query)
      );
    });

    if (selectedTimestamps && selectedTimestamps.length >= 2) {
      const startTime = selectedTimestamps[0].getTime();
      const endTime = selectedTimestamps[selectedTimestamps.length - 1].getTime();
      
      filtered = filtered.filter(session => {
        const sessionTime = session.timestamp.getTime();
        return sessionTime >= startTime && sessionTime <= endTime;
      });
    } 
    else if (selectedTimestamp) {
      const selectedTime = selectedTimestamp.getTime();
      const dayInMs = 24 * 60 * 60 * 1000;
      
      filtered = filtered.filter(session => {
        const sessionTime = session.timestamp.getTime();
        return Math.abs(sessionTime - selectedTime) <= dayInMs; // Within a day of the selected time
      });
    }
    
    const sortedFilteredSessions = [...filtered].sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
    
    setFilteredSessions(sortedFilteredSessions);
  }, [searchQuery, selectedTimestamp, selectedTimestamps]);

  const handleRowClick = (session: Session) => {
    if (selectedSessionId === session.id) {
      setSelectedSessionId(null);
      if (onSessionSelect) onSessionSelect(null);
    } else {
      setSelectedSessionId(session.id);
      if (onSessionSelect) onSessionSelect(session.timestamp);
    }
  };

  const handleRowMouseEnter = (sessionId: string) => {
    setHoveredSessionId(sessionId);
  };

  const handleRowMouseLeave = () => {
    setHoveredSessionId(null);
  };

  // Clear selected session when component unmounts
  useEffect(() => {
    return () => {
      if (onSessionSelect) onSessionSelect(null);
    };
  }, [onSessionSelect]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-start items-center mt-5">
        <div className="relative w-72">
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
            <TableHead>Conversion</TableHead>
            <TableHead>Errors</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[80px] text-right">Replay</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <TableRow 
                key={session.id} 
                className={`cursor-pointer transition-colors relative ${
                  selectedSessionId === session.id ? 'bg-primary/10' : 
                  hoveredSessionId === session.id ? 'bg-muted/50' : ''
                }`}
                onClick={() => handleRowClick(session)}
                onMouseEnter={() => handleRowMouseEnter(session.id)}
                onMouseLeave={handleRowMouseLeave}
              >
                <TableCell className="font-medium">{session.account}</TableCell>
                <TableCell>{session.os}</TableCell>
                <TableCell>{getConversionBadge(session.conversions)}</TableCell>
                <TableCell>{getErrorDisplay(session.errors)}</TableCell>
                <TableCell>{formatTimestamp(session.timestamp)}</TableCell>
                <TableCell className="text-right">
                  <button className="p-1 rounded-full hover:bg-muted transition-colors" disabled>
                    <Play className="h-4 w-4 text-muted-foreground" />
                  </button>
                </TableCell>
                {(hoveredSessionId === session.id || selectedSessionId === session.id) && (
                  <div className="absolute right-0 h-full top-0 w-1 bg-primary" />
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                {selectedTimestamp || selectedTimestamps?.length 
                  ? "No sessions found in the selected time range" 
                  : `No results found for "${searchQuery}"`}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SessionsTable;
