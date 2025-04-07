
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import HistoryTabs from '@/components/history/HistoryTabs';
import SessionsTable from '@/components/history/SessionsTable';
import UserFeedbackTable from '@/components/history/UserFeedbackTable';
import SearchInput from '@/components/history/SearchInput';
import HistoryEventTable from '@/components/history/HistoryEventTable';

interface FeatureFlagHistoryProps {
  onEventSelect: (timestamps: Date[] | null) => void;
  selectedTimestamp: Date | null;
  selectedTimestamps: Date[] | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
}

const FeatureFlagHistory: React.FC<FeatureFlagHistoryProps> = ({ 
  onEventSelect, 
  selectedTimestamp,
  selectedTimestamps,
  onHoverTimestamp
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('history');
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value !== 'history') {
      setSelectedRows([]);
      setHoveredRowId(null);
    }
  };

  const handleEventSelect = (timestamps: Date[] | null) => {
    onEventSelect(timestamps);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <HistoryTabs activeTab={activeTab} onChange={handleTabChange} />
        
        <TabsContent value="history" className="mt-0 space-y-4">
          <SearchInput 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Search history..."
          />
          
          <HistoryEventTable
            onEventSelect={handleEventSelect}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            lastSelectedId={lastSelectedId}
            setLastSelectedId={setLastSelectedId}
            hoveredRowId={hoveredRowId}
            setHoveredRowId={setHoveredRowId}
            searchQuery={searchQuery}
            onHoverTimestamp={onHoverTimestamp}
          />
        </TabsContent>
        
        <TabsContent value="sessions" className="mt-0">
          <SessionsTable 
            selectedTimestamp={selectedTimestamp}
            selectedTimestamps={selectedTimestamps}
          />
        </TabsContent>
        
        <TabsContent value="feedback" className="mt-0">
          <UserFeedbackTable 
            onFeedbackSelect={(timestamp) => {
              if (timestamp) {
                onEventSelect([timestamp]);
              } else {
                onEventSelect(null);
              }
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeatureFlagHistory;
