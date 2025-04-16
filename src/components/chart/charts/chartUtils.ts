
/**
 * Calculate appropriate bar size based on data length and timeframe
 */
export function getBarSize(dataLength: number, timeframe?: string): number {
  // For 7-day view, increase bar width
  if (timeframe === '7d') {
    if (dataLength <= 5) return 80;
    if (dataLength <= 10) return 60;
    if (dataLength <= 20) return 36;
    if (dataLength <= 30) return 24;
    if (dataLength <= 60) return 16;
    return 12;
  }

  // Default sizing for other timeframes
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
