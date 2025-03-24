
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ToggleRight, ToggleLeft, RefreshCw, Settings, Flag, AlertTriangle, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import HistoryTabs from '@/components/history/HistoryTabs';
import SessionsTable from '@/components/history/SessionsTable';
import UserFeedbackTable from '@/components/history/UserFeedbackTable';
import { toast } from '@/components/ui/use-toast';

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

const FeatureFlagHistory: React.FC<FeatureFlagHistoryProps> = ({ 
  onEventSelect, 
  selectedTimestamp,
  selectedTimestamps
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('history');
  const [filteredHistoryData, setFilteredHistoryData] = useState<HistoryEvent[]>([]);

  // Filter and sort history data based on search query and selected timestamps
  useEffect(() => {
    let filtered = historyData.filter(event => {
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
        // Auto-select these events
        const newSelectedRows = filteredByTime.map(event => event.id);
        setSelectedRows(newSelectedRows);
      } else if (filteredByTime.length === 0 && selectedTimestamps.length > 0) {
        // No events in selected timeframe
        toast({
          title: "No events found",
          description: "No events found in the selected time range",
          variant: "default"
        });
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
        // Auto-select the event closest to the selected timestamp
        const closestEvent = filteredByTime.reduce((prev, curr) => {
          const prevDiff = Math.abs(prev.timestamp.getTime() - selectedTime);
          const currDiff = Math.abs(curr.timestamp.getTime() - selectedTime);
          return prevDiff < currDiff ? prev : curr;
        });
        setSelectedRows([closestEvent.id]);
      }
    }

    // Sort by timestamp (newest first)
    const sorted = [...filtered].sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
    
    setFilteredHistoryData(sorted);
  }, [searchQuery, selectedTimestamp, selectedTimestamps]);

  // Sync selected rows with parent component when they change
  useEffect(() => {
    if (selectedRows.length === 0) {
      // Only clear selection if we don't have selected timestamps
      if (!selectedTimestamps || selectedTimestamps.length === 0) {
        onEventSelect(null);
      }
    } else {
      const selectedEvents = historyData.filter(event => selectedRows.includes(event.id));
      const selectedTimestamps = selectedEvents.map(event => event.timestamp);
      
      selectedTimestamps.sort((a, b) => a.getTime() - b.getTime());
      
      console.log("Selected events timestamps:", selectedTimestamps);
      onEventSelect(selectedTimestamps);
    }
  }, [selectedRows, onEventSelect, selectedTimestamps]);

  const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>, historyEvent: HistoryEvent) => {
    const id = historyEvent.id;
    
    if (event.shiftKey && lastSelectedId) {
      const currentIdIndex = filteredHistoryData.findIndex(item => item.id === id);
      const lastSelectedIdIndex = filteredHistoryData.findIndex(item => item.id === lastSelectedId);
      
      if (currentIdIndex >= 0 && lastSelectedIdIndex >= 0) {
        const startIndex = Math.min(currentIdIndex, lastSelectedIdIndex);
        const endIndex = Math.max(currentIdIndex, lastSelectedIdIndex);
        
        const newSelectedRows = filteredHistoryData
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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value !== 'history') {
      // Don't clear selection when changing tabs
      // setSelectedRows([]);
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
                <TableHead className="text-right w-[200px]">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistoryData.length > 0 ? (
                filteredHistoryData.map((event) => (
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
                    {selectedTimestamp || (selectedTimestamps && selectedTimestamps.length > 0)
                      ? "No events found in the selected time range"
                      : `No results found for "${searchQuery}"`}
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
