
// Calculate optimal interval for the X axis based on data length
export const getXAxisInterval = (dataLength: number) => {
  if (dataLength > 60) return 14;
  if (dataLength > 40) return 8;
  if (dataLength > 20) return 4;
  if (dataLength > 14) return 2;
  return 1;
};

// Calculate optimal bar size based on data length
export const getBarSize = (dataLength: number) => {
  if (dataLength > 60) return 2;
  if (dataLength > 30) return 4;
  if (dataLength > 14) return 8;
  return 24;
};

// Calculate Y axis domain with some padding
export const calculateYAxisDomain = (data: Array<{value: number}>) => {
  const maxValue = Math.max(...data.map(item => item.value));
  return [0, Math.ceil(maxValue * 1.1)];
};

// Process version changes to match filtered data positions
export const processVersionChanges = (
  versionChanges: Array<{
    date: string;
    position: number;
    version: string;
    details?: string;
  }>,
  originalData: Array<{name: string}>,
  filteredData: Array<{name: string}>
) => {
  return versionChanges
    .map(change => {
      // Find the date of the original version change
      const originalDate = originalData[change.position]?.name;
      // Find the new position in filtered data
      const newPosition = filteredData.findIndex(item => item.name === originalDate);
      return {
        ...change,
        position: newPosition >= 0 ? newPosition : 0 // Default to 0 if not found
      };
    })
    .filter(change => change.position >= 0);
};
