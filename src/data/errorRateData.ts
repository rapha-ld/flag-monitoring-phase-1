
import { formatDate, generatePastDates } from "../utils/dateUtils";

// List of devices
const devices = ['windows', 'macos', 'linux', 'ios', 'android'];

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
    environment: Math.random() > 0.5 ? "production" : "staging",
    device: devices[Math.floor(Math.random() * devices.length)]
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
