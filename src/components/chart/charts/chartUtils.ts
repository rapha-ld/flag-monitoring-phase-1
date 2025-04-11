
/**
 * Calculate appropriate bar size based on data length
 */
export function getBarSize(dataLength: number): number {
  if (dataLength <= 5) return 30;
  if (dataLength <= 10) return 20;
  if (dataLength <= 20) return 12;
  if (dataLength <= 30) return 8;
  if (dataLength <= 60) return 6;
  return 4;
}

/**
 * Format a timestamp for display in charts
 */
export function formatTimestamp(timestamp: string): string {
  // Add formatting logic as needed
  return timestamp;
}
