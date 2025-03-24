
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { HistoryEvent } from '@/types/historyTypes';
import { getEventIcon, formatTimestamp } from '@/utils/historyUtils';

interface HistoryTableProps {
  historyData: HistoryEvent[];
  selectedRows: string[];
  handleRowClick: (event: React.MouseEvent<HTMLTableRowElement>, historyEvent: HistoryEvent) => void;
  searchQuery: string;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ 
  historyData, 
  selectedRows, 
  handleRowClick, 
  searchQuery 
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Event</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right w-[200px]">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {historyData.length > 0 ? (
          historyData.map((event) => (
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
              No events found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default HistoryTable;
