
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import HistoryTabs from '@/components/history/HistoryTabs';
import SessionsTable from '@/components/history/SessionsTable';
import UserFeedbackTable from '@/components/history/UserFeedbackTable';
import HistoryTable from '@/components/history/HistoryTable';
import { toast } from '@/components/ui/use-toast';
import { historyData } from '@/data/historyData';
import { filterHistoryEvents } from '@/utils/historyUtils';
import { FeatureFlagHistoryProps, HistoryEvent } from '@/types/historyTypes';

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
    const filtered = filterHistoryEvents(historyData, searchQuery, selectedTimestamp, selectedTimestamps);
    setFilteredHistoryData(filtered);
    
    // Auto-select events if timestamps are selected
    if (selectedTimestamps && selectedTimestamps.length >= 2) {
      const startTime = selectedTimestamps[0].getTime();
      const endTime = selectedTimestamps[selectedTimestamps.length - 1].getTime();
      
      const filteredByTime = filtered.filter(event => {
        const eventTime = event.timestamp.getTime();
        return eventTime >= startTime && eventTime <= endTime;
      });

      if (filteredByTime.length > 0) {
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
    // Auto-select the closest event to a single selected timestamp
    else if (selectedTimestamp) {
      const selectedTime = selectedTimestamp.getTime();
      
      const filteredByTime = filtered.filter(event => {
        const eventTime = event.timestamp.getTime();
        const dayInMs = 24 * 60 * 60 * 1000;
        return Math.abs(eventTime - selectedTime) <= dayInMs; // Within a day
      });
      
      if (filteredByTime.length > 0) {
        const closestEvent = filteredByTime.reduce((prev, curr) => {
          const prevDiff = Math.abs(prev.timestamp.getTime() - selectedTime);
          const currDiff = Math.abs(curr.timestamp.getTime() - selectedTime);
          return prevDiff < currDiff ? prev : curr;
        });
        setSelectedRows([closestEvent.id]);
      }
    }
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
          
          <HistoryTable 
            historyData={filteredHistoryData}
            selectedRows={selectedRows}
            handleRowClick={handleRowClick}
            searchQuery={searchQuery}
          />
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
