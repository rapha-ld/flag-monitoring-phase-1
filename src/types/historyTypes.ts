
export interface HistoryEvent {
  id: string;
  type: HistoryEventType;
  title: string;
  description: string;
  timestamp: Date;
}

export type HistoryEventType = 'enabled' | 'disabled' | 'updated' | 'settings' | 'created' | 'alert';

export interface FeatureFlagHistoryProps {
  onEventSelect: (timestamps: Date[] | null) => void;
  selectedTimestamp: Date | null;
  selectedTimestamps: Date[] | null;
}
