
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { formatTimestamp, getEventIcon, UserAvatar, SystemUser } from './HistoryEventUtils';
import { HistoryEvent, HistoryEventTableProps } from './types';
import { historyData } from './historyEventData';

const HistoryEventTable: React.FC<HistoryEventTableProps> = ({
  onEventSelect,
  selectedRows,
  setSelectedRows,
  setLastSelectedId,
  lastSelectedId,
  hoveredRowId,
  setHoveredRowId,
  searchQuery
}) => {
  const filteredHistoryData = historyData.filter(event => {
    const searchLower = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower) ||
      event.type.toLowerCase().includes(searchLower) ||
      (event.initiatedBy?.name && event.initiatedBy.name.toLowerCase().includes(searchLower))
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

  const handleRowMouseEnter = (rowId: string) => {
    if (selectedRows.length === 0) {
      setHoveredRowId(rowId);
      
      // Find the timestamp of the hovered row
      const hoveredEvent = sortedHistoryData.find(event => event.id === rowId);
      if (hoveredEvent) {
        onEventSelect([hoveredEvent.timestamp]);
      }
    }
  };

  const handleRowMouseLeave = () => {
    setHoveredRowId(null);
    
    // Clear the hover selection if no rows are selected
    if (selectedRows.length === 0) {
      onEventSelect(null);
    }
  };

  React.useEffect(() => {
    if (selectedRows.length === 0 && !hoveredRowId) {
      onEventSelect(null);
    } else if (selectedRows.length > 0) {
      // When rows are selected, show their timestamps
      const selectedEvents = sortedHistoryData.filter(event => selectedRows.includes(event.id));
      const selectedTimestamps = selectedEvents.map(event => event.timestamp);
      
      selectedTimestamps.sort((a, b) => a.getTime() - b.getTime());
      
      onEventSelect(selectedTimestamps);
    } else if (hoveredRowId) {
      // When a row is hovered but not selected, show just that timestamp
      const hoveredEvent = sortedHistoryData.find(event => event.id === hoveredRowId);
      if (hoveredEvent) {
        onEventSelect([hoveredEvent.timestamp]);
      }
    }
  }, [selectedRows, hoveredRowId, sortedHistoryData, onEventSelect]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Event</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="w-[100px] whitespace-nowrap">Initiated by</TableHead>
          <TableHead className="text-right w-[180px]">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedHistoryData.length > 0 ? (
          sortedHistoryData.map((event) => (
            <TableRow 
              key={event.id}
              onClick={(e) => handleRowClick(e, event)}
              onMouseEnter={() => handleRowMouseEnter(event.id)}
              onMouseLeave={handleRowMouseLeave}
              className={`cursor-pointer transition-colors ${
                selectedRows.includes(event.id) ? 'bg-primary/10' : 
                hoveredRowId === event.id ? 'bg-primary/5' : ''
              }`}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  {getEventIcon(event.type)}
                  <span className="font-medium">{event.title}</span>
                </div>
              </TableCell>
              <TableCell>{event.description}</TableCell>
              <TableCell>
                {event.type !== 'alert' && event.initiatedBy ? (
                  <UserAvatar name={event.initiatedBy.name} />
                ) : (
                  <SystemUser />
                )}
              </TableCell>
              <TableCell className="text-right">{formatTimestamp(event.timestamp)}</TableCell>
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
  );
};

export default HistoryEventTable;
