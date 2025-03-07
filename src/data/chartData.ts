
// Mock data for the charts

// Helper function to generate dates for the past n days
const generatePastDates = (days: number) => {
  return Array.from({ length: days }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return date;
  });
};

// Format date as "Jan 1" or similar
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Generate time labels (Jan 1, Jan 2, etc.)
const generateTimeLabels = (days: number) => {
  return generatePastDates(days).map(date => formatDate(date));
};

// Generate evaluation data for the past 90 days (maximum time frame)
export const evaluationData = generatePastDates(90).map((date, index) => {
  // Create some variations in the data
  const baseValue = 85;
  let value: number;

  if (index < 30) {
    // First 30 days - stable around 85
    value = baseValue + Math.floor(Math.random() * 5);
  } else if (index < 60) {
    // Days 30-60 - slight drop after version change
    value = baseValue - 10 + Math.floor(Math.random() * 5);
  } else {
    // Days 60-90 - recovery and improvement
    value = baseValue + 5 + Math.floor(Math.random() * 8);
  }

  return {
    name: formatDate(date),
    value,
    date: date.toISOString(),
  };
});

// Version changes for evaluations
export const evaluationVersionChanges = [
  {
    date: formatDate(generatePastDates(90)[30]),
    position: 30,
    version: "2.1.0",
    details: "Major algorithm update to improve accuracy"
  },
  {
    date: formatDate(generatePastDates(90)[60]),
    position: 60,
    version: "2.1.5",
    details: "Optimization to reduce false positives"
  }
];

// Generate conversion rate data for the past 90 days
export const conversionData = generatePastDates(90).map((date, index) => {
  // Create some variations in the data
  let value: number;

  if (index < 40) {
    // First 40 days - moderate conversion rate
    value = 18 + Math.random() * 3;
  } else if (index < 70) {
    // Days 40-70 - improved conversion after version change
    value = 22 + Math.random() * 4;
  } else {
    // Days 70-90 - stabilizing at a higher level
    value = 24 + Math.random() * 3;
  }

  return {
    name: formatDate(date),
    value: parseFloat(value.toFixed(1)),
    date: date.toISOString(),
  };
});

// Version changes for conversion rate
export const conversionVersionChanges = [
  {
    date: formatDate(generatePastDates(90)[40]),
    position: 40,
    version: "1.8.2",
    details: "UI redesign of checkout flow"
  }
];

// Generate error rate data for the past 90 days
export const errorRateData = generatePastDates(90).map((date, index) => {
  // Create some variations in the data
  let value: number;

  if (index < 25) {
    // First 25 days - high error rate
    value = 4.2 + Math.random() * 1.0;
  } else if (index < 50) {
    // Days 25-50 - decreasing after version change
    value = 3.0 + Math.random() * 0.8;
  } else if (index < 75) {
    // Days 50-75 - further improvement
    value = 1.8 + Math.random() * 0.6;
  } else {
    // Days 75-90 - stabilizing at a lower level
    value = 1.5 + Math.random() * 0.5;
  }

  return {
    name: formatDate(date),
    value: parseFloat(value.toFixed(1)),
    date: date.toISOString(),
  };
});

// Version changes for error rate
export const errorRateVersionChanges = [
  {
    date: formatDate(generatePastDates(90)[25]),
    position: 25,
    version: "3.2.1",
    details: "Error handling improvements"
  },
  {
    date: formatDate(generatePastDates(90)[50]),
    position: 50,
    version: "3.3.0",
    details: "Major refactoring of error-prone modules"
  }
];

// Filter data based on the selected timeframe
export const getFilteredData = (data: any[], days: number) => {
  // Always pick the last 'days' items from the data array
  return data.slice(-days);
};

// Calculate current metrics and changes based on the filtered data (last 14 days by default)
const lastTwoWeeksData = {
  evaluations: evaluationData.slice(-14),
  conversion: conversionData.slice(-14),
  errorRate: errorRateData.slice(-14)
};

export const currentMetrics = {
  evaluations: {
    value: lastTwoWeeksData.evaluations[lastTwoWeeksData.evaluations.length - 1].value,
    change: {
      value: parseFloat(((lastTwoWeeksData.evaluations[lastTwoWeeksData.evaluations.length - 1].value / lastTwoWeeksData.evaluations[lastTwoWeeksData.evaluations.length - 8].value - 1) * 100).toFixed(1)),
      trend: (lastTwoWeeksData.evaluations[lastTwoWeeksData.evaluations.length - 1].value >= lastTwoWeeksData.evaluations[lastTwoWeeksData.evaluations.length - 8].value) ? 'up' as const : 'down' as const
    }
  },
  conversion: {
    value: lastTwoWeeksData.conversion[lastTwoWeeksData.conversion.length - 1].value,
    change: {
      value: parseFloat(((lastTwoWeeksData.conversion[lastTwoWeeksData.conversion.length - 1].value / lastTwoWeeksData.conversion[lastTwoWeeksData.conversion.length - 8].value - 1) * 100).toFixed(1)),
      trend: (lastTwoWeeksData.conversion[lastTwoWeeksData.conversion.length - 1].value >= lastTwoWeeksData.conversion[lastTwoWeeksData.conversion.length - 8].value) ? 'up' as const : 'down' as const
    }
  },
  errorRate: {
    value: lastTwoWeeksData.errorRate[lastTwoWeeksData.errorRate.length - 1].value,
    change: {
      value: parseFloat(((lastTwoWeeksData.errorRate[lastTwoWeeksData.errorRate.length - 1].value / lastTwoWeeksData.errorRate[lastTwoWeeksData.errorRate.length - 8].value - 1) * 100).toFixed(1)),
      trend: (lastTwoWeeksData.errorRate[lastTwoWeeksData.errorRate.length - 1].value <= lastTwoWeeksData.errorRate[lastTwoWeeksData.errorRate.length - 8].value) ? 'up' as const : 'down' as const
    }
  }
};
