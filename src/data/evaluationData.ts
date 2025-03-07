
import { formatDate, generatePastDates } from "../utils/dateUtils";

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
    environment: Math.random() > 0.5 ? "production" : "staging"
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
