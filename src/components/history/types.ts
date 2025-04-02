
export interface Feedback {
  id: string;
  email: string;
  feedback: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  timestamp: Date;
}

export interface HistoryEvent {
  id: string;
  type: 'enabled' | 'disabled' | 'updated' | 'settings' | 'created' | 'alert';
  title: string;
  description: string;
  timestamp: Date;
  initiatedBy?: {
    name: string;
    email?: string;
  };
}

export interface HistoryEventTableProps {
  onEventSelect: (timestamps: Date[] | null) => void;
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  setLastSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
  lastSelectedId: string | null;
  hoveredRowId: string | null;
  setHoveredRowId: React.Dispatch<React.SetStateAction<string | null>>;
  searchQuery: string;
}
