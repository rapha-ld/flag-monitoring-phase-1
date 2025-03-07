
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
  // Generate EXACTLY the number of days requested
  const allDates = generatePastDates(days);
  
  // Create result array with default values for each date
  const result = allDates.map(date => {
    const formattedDate = formatDate(date);
    
    // Try to find matching data point from the input data
    const matchingData = data.find(item => item.name === formattedDate);
    
    if (matchingData) {
      // Use existing data if we found a match
      return matchingData;
    } else {
      // Create a default data point if no match is found
      return {
        name: formattedDate,
        value: 0,
        date: date.toISOString(),
        environment: data[0]?.environment || 'production',
        device: data[0]?.device || 'all'
      };
    }
  });

  // Sanity check to ensure we have exactly the right number of days
  if (result.length !== days) {
    console.error(`Date generation error: Expected ${days} days but got ${result.length}`);
  }
  
  return result;
};
