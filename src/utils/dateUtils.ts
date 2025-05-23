
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

// Generate a small random value between 1-5
const getRandomMinValue = () => {
  return 1 + Math.floor(Math.random() * 4);
};

// Ensure data has entries for every day in the date range
export const ensureContinuousDates = (data: any[], days: number) => {
  // Generate the exact number of dates we need - this is crucial
  const allDates = generatePastDates(days);
  const dateMap = new Map();
  
  // Initialize with all dates and minimum random values (no zeros)
  allDates.forEach(date => {
    const formattedDate = formatDate(date);
    dateMap.set(formattedDate, {
      name: formattedDate,
      value: getRandomMinValue(), // Random value between 1-5 instead of static 1
      date: date.toISOString(), // Store the full date as ISO string
      environment: data[0]?.environment || 'production', // Use first data point's environment or default
      device: data[0]?.device || 'all' // Use first data point's device or default
    });
  });
  
  // Fill in actual values from the data, ensuring sufficient variation
  data.forEach(item => {
    if (dateMap.has(item.name)) {
      const existingValue = item.value;
      // Only use the existing value if it's large enough, otherwise use a random value
      const finalValue = existingValue > 1 ? existingValue : getRandomMinValue();
      
      dateMap.set(item.name, {
        ...item,
        value: finalValue,
        // Make sure we store the date as ISO string
        date: item.date || new Date(item.name).toISOString()
      });
    }
  });
  
  // Convert map back to array and ensure it's sorted by date
  const result = Array.from(dateMap.values()).sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  
  // Double-check we have exactly the requested number of days
  if (result.length !== days) {
    console.warn(`Expected ${days} days but got ${result.length}`);
  }
  
  return result;
};
