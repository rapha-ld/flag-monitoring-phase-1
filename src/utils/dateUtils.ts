
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
