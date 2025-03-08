
import { formatDate, generatePastDates } from "../utils/dateUtils";

// List of devices
const devices = ['windows', 'macos', 'linux', 'ios', 'android'];

// Generate evaluation data for the past 90 days (maximum time frame)
export const evaluationData = generatePastDates(90).map((date, index) => {
  // Create more pronounced variations in the data
  const baseValue = 40;
  let value: number;

  if (index < 15) {
    // First 15 days - variable around base
    value = baseValue + Math.sin(index * 0.4) * 15 + Math.random() * 5;
  } else if (index < 30) {
    // Days 15-30 - upward trend
    value = baseValue + 5 + (index - 15) * 1.2 + Math.sin(index * 0.3) * 8;
  } else if (index < 45) {
    // Days 30-45 - slight decline after version change
    value = baseValue + 25 - (index - 30) * 0.8 + Math.sin(index * 0.3) * 6;
  } else if (index < 60) {
    // Days 45-60 - stabilize
    value = baseValue + 15 + Math.sin(index * 0.5) * 10 + Math.random() * 3;
  } else if (index < 75) {
    // Days 60-75 - new improvement
    value = baseValue + 20 + (index - 60) * 0.6 + Math.sin(index * 0.4) * 7;
  } else {
    // Days 75-90 - continued growth with oscillation
    value = baseValue + 30 + Math.sin(index * 0.3) * 12 + Math.random() * 4;
  }

  return {
    name: formatDate(date),
    value: Math.max(5, Math.floor(value)), // Ensure minimum value of 5
    date: date.toISOString(),
    environment: Math.random() > 0.5 ? "production" : "staging",
    device: devices[Math.floor(Math.random() * devices.length)]
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
