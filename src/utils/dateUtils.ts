
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
  // Generate the exact number of dates we need - this is crucial
  const allDates = generatePastDates(days);
  const dateMap = new Map();
  
  // Get non-zero values from data
  const nonZeroData = data.filter(item => item.value > 0);
  
  // Initialize with all dates and placeholder values
  allDates.forEach(date => {
    const formattedDate = formatDate(date);
    dateMap.set(formattedDate, {
      name: formattedDate,
      value: null, // Use null instead of 0 to indicate no data
      valueTrue: null,
      valueFalse: null,
      date: date.toISOString(),
      environment: nonZeroData.length > 0 ? nonZeroData[0].environment || 'production' : 'production',
      device: nonZeroData.length > 0 ? nonZeroData[0].device || 'all' : 'all'
    });
  });
  
  // Fill in actual values from the data
  data.forEach(item => {
    if (dateMap.has(item.name) && item.value > 0) {
      dateMap.set(item.name, {
        ...item,
        // Ensure these properties exist with proper values
        value: item.value,
        valueTrue: item.valueTrue || Math.round(item.value * 0.6), // 60% true
        valueFalse: item.valueFalse || Math.round(item.value * 0.4), // 40% false
      });
    }
  });
  
  // Convert map back to array and ensure it's sorted by date
  const result = Array.from(dateMap.values()).sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  
  // Double-check we have exactly the requested number of days
  if (result.length !== days) {
    console.warn(`Expected ${days} days but got ${result.length}. Filling in missing dates.`);
    // If somehow we're still missing days, make sure we have exactly the right number
    while (result.length < days) {
      // Add placeholder data at the beginning (least recent)
      const placeholderDate = new Date(new Date(result[0].date).getTime() - 86400000); // 1 day earlier
      result.unshift({
        name: formatDate(placeholderDate),
        value: null,
        valueTrue: null,
        valueFalse: null,
        date: placeholderDate.toISOString(),
        environment: result[0].environment,
        device: result[0].device
      });
    }
    // If we have too many days, trim the earliest ones
    if (result.length > days) {
      result.splice(0, result.length - days);
    }
  }
  
  return result;
};
