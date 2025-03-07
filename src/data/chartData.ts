
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

// Generate evaluation data for the past 14 days
export const evaluationData = generatePastDates(14).map((date, index) => {
  // Create some variations in the data
  const baseValue = 85;
  let value: number;

  if (index < 4) {
    // First 4 days - stable around 85
    value = baseValue + Math.floor(Math.random() * 5);
  } else if (index < 8) {
    // Days 5-8 - slight drop after version change
    value = baseValue - 10 + Math.floor(Math.random() * 5);
  } else {
    // Days 9-14 - recovery and improvement
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
    date: formatDate(generatePastDates(14)[4]),
    position: 4,
    version: "2.1.0",
    details: "Major algorithm update to improve accuracy"
  },
  {
    date: formatDate(generatePastDates(14)[9]),
    position: 9,
    version: "2.1.5",
    details: "Optimization to reduce false positives"
  }
];

// Generate conversion rate data for the past 14 days
export const conversionData = generatePastDates(14).map((date, index) => {
  // Create some variations in the data
  let value: number;

  if (index < 6) {
    // First 6 days - moderate conversion rate
    value = 18 + Math.random() * 3;
  } else if (index < 10) {
    // Days 7-10 - improved conversion after version change
    value = 22 + Math.random() * 4;
  } else {
    // Days 11-14 - stabilizing at a higher level
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
    date: formatDate(generatePastDates(14)[6]),
    position: 6,
    version: "1.8.2",
    details: "UI redesign of checkout flow"
  }
];

// Generate error rate data for the past 14 days
export const errorRateData = generatePastDates(14).map((date, index) => {
  // Create some variations in the data
  let value: number;

  if (index < 3) {
    // First 3 days - high error rate
    value = 4.2 + Math.random() * 1.0;
  } else if (index < 7) {
    // Days 4-7 - decreasing after version change
    value = 3.0 + Math.random() * 0.8;
  } else if (index < 11) {
    // Days 8-11 - further improvement
    value = 1.8 + Math.random() * 0.6;
  } else {
    // Days 12-14 - stabilizing at a lower level
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
    date: formatDate(generatePastDates(14)[3]),
    position: 3,
    version: "3.2.1",
    details: "Error handling improvements"
  },
  {
    date: formatDate(generatePastDates(14)[7]),
    position: 7,
    version: "3.3.0",
    details: "Major refactoring of error-prone modules"
  }
];

// Calculate current metrics and changes
export const currentMetrics = {
  evaluations: {
    value: evaluationData[evaluationData.length - 1].value,
    change: {
      value: parseFloat(((evaluationData[evaluationData.length - 1].value / evaluationData[evaluationData.length - 8].value - 1) * 100).toFixed(1)),
      trend: (evaluationData[evaluationData.length - 1].value >= evaluationData[evaluationData.length - 8].value) ? 'up' : 'down'
    }
  },
  conversion: {
    value: conversionData[conversionData.length - 1].value,
    change: {
      value: parseFloat(((conversionData[conversionData.length - 1].value / conversionData[conversionData.length - 8].value - 1) * 100).toFixed(1)),
      trend: (conversionData[conversionData.length - 1].value >= conversionData[conversionData.length - 8].value) ? 'up' : 'down'
    }
  },
  errorRate: {
    value: errorRateData[errorRateData.length - 1].value,
    change: {
      value: parseFloat(((errorRateData[errorRateData.length - 1].value / errorRateData[errorRateData.length - 8].value - 1) * 100).toFixed(1)),
      trend: (errorRateData[errorRateData.length - 1].value <= errorRateData[errorRateData.length - 8].value) ? 'up' : 'down'
    }
  }
};
