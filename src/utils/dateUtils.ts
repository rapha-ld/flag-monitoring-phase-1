
// Helper function to generate dates for the past n days
export const generatePastDates = (days: number) => {
  return Array.from({ length: days }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return date;
  });
};

// Format date as "Jan 1" or similar
export const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Generate time labels (Jan 1, Jan 2, etc.)
export const generateTimeLabels = (days: number) => {
  return generatePastDates(days).map(date => formatDate(date));
};

// Ensure data has entries for every day in the date range
export const ensureContinuousDates = (data: any[], days: number) => {
  const dateMap = new Map();
  const allDates = generatePastDates(days);
  
  // Initialize with all dates and null values
  allDates.forEach(date => {
    const formattedDate = formatDate(date);
    dateMap.set(formattedDate, {
      name: formattedDate,
      value: 0,
      date: date.toISOString(),
      environment: 'production' // Default environment
    });
  });
  
  // Fill in actual values from the data
  data.forEach(item => {
    if (dateMap.has(item.name)) {
      dateMap.set(item.name, item);
    }
  });
  
  // Convert map back to array
  return Array.from(dateMap.values());
};
