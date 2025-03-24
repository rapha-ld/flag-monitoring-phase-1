import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ToggleRight, ToggleLeft, RefreshCw, Settings, Flag, AlertTriangle, Search } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import HistoryTabs from '@/components/history/HistoryTabs';
import SessionsTable from '@/components/history/SessionsTable';
import UserFeedbackTable from '@/components/history/UserFeedbackTable';

interface HistoryEvent {
  id: string;
  type: 'enabled' | 'disabled' | 'updated' | 'settings' | 'created' | 'alert';
  title: string;
  description: string;
  timestamp: Date;
}

interface FeatureFlagHistoryProps {
  onEventSelect: (timestamps: Date[] | null) => void;
  selectedTimestamp: Date | null;
  selectedTimestamps: Date[] | null;
}

const historyData: HistoryEvent[] = [
  {
    id: '1',
    type: 'enabled',
    title: 'Flag enabled',
    description: 'New checkout flow was enabled for production',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 17 * 60 * 1000 + 37 * 1000) // 1 week ago + 17m37s
  },
  {
    id: '2',
    type: 'updated',
    title: 'Flag updated',
    description: 'Target audience changed from 10% to 25% of users',
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 - 42 * 60 * 1000 - 23 * 1000) // 1 month ago - 42m23s
  },
  {
    id: '3',
    type: 'disabled',
    title: 'Flag disabled',
    description: 'New checkout flow was disabled for production',
    timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000 + 28 * 60 * 1000 + 11 * 1000) // 1.5 months ago + 28m11s
  },
  {
    id: '7',
    type: 'alert',
    title: 'Alert',
    description: 'Avg. Error Rate exceeded alert threshold',
    timestamp: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000 - 13 * 60 * 1000 - 49 * 1000) // ~1.7 months ago - 13m49s
  },
  {
    id: '4',
    type: 'settings',
    title: 'Rules changed',
    description: 'New rule "LD users" was created',
    timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000 + 53 * 60 * 1000 + 7 * 1000) // 2 months ago + 53m7s
  },
  {
    id: '6',
    type: 'enabled', 
    title: 'Flag enabled',
    description: 'New checkout flow was enabled for testing',
    timestamp: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000 - 31 * 60 * 1000 - 15 * 1000) // 3 months ago - 31m15s
  },
  {
    id: '5',
    type: 'created',
    title: 'Flag created',
    description: 'New feature flag "New Checkout" was created',
    timestamp: new Date(Date.now() - 115 * 24 * 60 * 60 * 1000 + 39 * 60 * 1000 + 42 * 1000) // ~3.8 months ago + 39m42s
  }
];

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
    case 'alert':
      return <AlertTriangle className="h-5 w-5 text-orange-500" />;
  }
};

const formatTimestamp = (date: Date) => {
  const relativeTime = formatDistanceToNow(date, { addSuffix: true });
  const absoluteTime = format(date, "MMM d ''yy");
  const exactTime = format(date, "h:mm a");
  
  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium">{absoluteTime}</span>
      <span className="text-xs text-muted-foreground">{relativeTime}</span>
      <span className="text-xs text-muted-foreground">{exactTime}</span>
    </div>
  );
};

const FeatureFlagHistory: React.FC<FeatureFlagHistoryProps> = ({ 
  onEventSelect, 
  selectedTimestamp,
  selectedTimestamps
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('history');

  const filteredHistoryData = historyData.filter(event => {
    const searchLower = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower) ||
      event.type.toLowerCase().includes(searchLower)
    );
  });

  const sortedHistoryData = [...filteredHistoryData].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>, historyEvent: HistoryEvent) => {
    const id = historyEvent.id;
    
    if (event.shiftKey && lastSelectedId) {
      const currentIdIndex = sortedHistoryData.findIndex(item => item.id === id);
      const lastSelectedIdIndex = sortedHistoryData.findIndex(item => item.id === lastSelectedId);
      
      if (currentIdIndex >= 0 && lastSelectedIdIndex >= 0) {
        const startIndex = Math.min(currentIdIndex, lastSelectedIdIndex);
        const endIndex = Math.max(currentIdIndex, lastSelectedIdIndex);
        
        const newSelectedRows = sortedHistoryData
          .slice(startIndex, endIndex + 1)
          .map(item => item.id);
        
        setSelectedRows(newSelectedRows);
      }
    } 
    else if (event.ctrlKey || event.metaKey) {
      setSelectedRows(prevSelectedRows => {
        if (prevSelectedRows.includes(id)) {
          return prevSelectedRows.filter(rowId => rowId !== id);
        } else {
          return [...prevSelectedRows, id];
        }
      });
      setLastSelectedId(id);
    } 
    else {
      if (selectedRows.length === 1 && selectedRows[0] === id) {
        setSelectedRows([]);
        setLastSelectedId(null);
      } else {
        setSelectedRows([id]);
        setLastSelectedId(id);
      }
    }
  };

  useEffect(() => {
    if (selectedRows.length === 0) {
      onEventSelect(null);
    } else {
      const selectedEvents = sortedHistoryData.filter(event => selectedRows.includes(event.id));
      const selectedTimestamps = selectedEvents.map(event => event.timestamp);
      
      selectedTimestamps.sort((a, b) => a.getTime() - b.getTime());
      
      onEventSelect(selectedTimestamps);
    }
  }, [selectedRows, sortedHistoryData, onEventSelect]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value !== 'history') {
      setSelectedRows([]);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <HistoryTabs activeTab={activeTab} onChange={handleTabChange} />
        
        <TabsContent value="history" className="mt-0 space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative w-72 ml-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search history..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Event</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right w-[200px]">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedHistoryData.length > 0 ? (
                sortedHistoryData.map((event) => (
                  <TableRow 
                    key={event.id}
                    onClick={(e) => handleRowClick(e, event)}
                    className={`cursor-pointer transition-colors ${
                      selectedRows.includes(event.id) ? 'bg-primary/10' : ''
                    }`}
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                    No results found for "{searchQuery}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="sessions" className="mt-0">
          <SessionsTable 
            selectedTimestamp={selectedTimestamp}
            selectedTimestamps={selectedTimestamps}
          />
        </TabsContent>
        
        <TabsContent value="feedback" className="mt-0">
          <UserFeedbackTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeatureFlagHistory;
