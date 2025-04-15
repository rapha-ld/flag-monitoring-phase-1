
/**
 * Calculate appropriate bar size based on data length
 */
export function getBarSize(dataLength: number): number {
  if (dataLength <= 5) return 40;
  if (dataLength <= 10) return 30;
  if (dataLength <= 20) return 18;
  if (dataLength <= 30) return 12;
  if (dataLength <= 60) return 8;
  return 6;
}

/**
 * Format a timestamp for display in charts
 */
export function formatTimestamp(timestamp: string): string {
  // Add formatting logic as needed
  return timestamp;
}
