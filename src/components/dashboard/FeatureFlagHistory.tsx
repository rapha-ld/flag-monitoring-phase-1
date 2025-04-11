
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import HistoryTabs from '@/components/history/HistoryTabs';
import SessionsTable from '@/components/history/SessionsTable';
import SearchInput from '@/components/history/SearchInput';
import HistoryEventTable from '@/components/history/HistoryEventTable';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FeatureFlagHistoryProps {
  onEventSelect: (timestamps: Date[] | null) => void;
  selectedTimestamp: Date | null;
  selectedTimestamps: Date[] | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
  defaultCollapsed?: boolean;
}

const FeatureFlagHistory: React.FC<FeatureFlagHistoryProps> = ({ 
  onEventSelect, 
  selectedTimestamp,
  selectedTimestamps,
  onHoverTimestamp,
  defaultCollapsed = true
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('history');
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value !== 'history') {
      setSelectedRows([]);
      setHoveredRowId(null);
      // Clear hover timestamp when switching tabs
      onHoverTimestamp?.(null);
    }
  };

  const handleEventSelect = (timestamps: Date[] | null) => {
    onEventSelect(timestamps);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="space-y-4 animate-fade-in border-t border-border mt-8 pt-4">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={toggleCollapse}
      >
        <h2 className="text-lg font-medium">Feature Flag History</h2>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            toggleCollapse();
          }}
        >
          {isCollapsed ? (
            <div className="flex items-center gap-2">
              <span>Show History</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Hide History</span>
              <ChevronUp className="h-4 w-4" />
            </div>
          )}
        </Button>
      </div>
      
      {!isCollapsed && (
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
              onHoverTimestamp={onHoverTimestamp}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default FeatureFlagHistory;
