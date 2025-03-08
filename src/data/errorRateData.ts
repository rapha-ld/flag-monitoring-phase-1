
import { formatDate, generatePastDates } from "../utils/dateUtils";

// List of devices
const devices = ['windows', 'macos', 'linux', 'ios', 'android'];

// Generate error rate data for the past 90 days
export const errorRateData = generatePastDates(90).map((date, index) => {
  // Create some variations in the data with more pronounced fluctuations
  let value: number;

  if (index < 15) {
    // First 15 days - high error rate with volatility
    value = 3.8 + Math.sin(index * 0.5) * 0.7 + Math.random() * 0.4;
  } else if (index < 25) {
    // Days 15-25 - spike in errors 
    value = 4.2 + Math.sin((index - 15) * 0.7) * 0.5 + Math.random() * 0.3;
  } else if (index < 40) {
    // Days 25-40 - decreasing after version change but with fluctuations
    value = 3.5 - (index - 25) * 0.07 + Math.sin(index * 0.4) * 0.6 + Math.random() * 0.3;
  } else if (index < 60) {
    // Days 40-60 - gradual improvement with setbacks
    value = 2.5 - (index - 40) * 0.04 + Math.sin(index * 0.6) * 0.5 + Math.random() * 0.2;
  } else if (index < 75) {
    // Days 60-75 - further improvement with oscillation
    value = 1.8 + Math.sin(index * 0.5) * 0.4 + Math.random() * 0.2;
  } else {
    // Days 75-90 - stabilizing at a lower level with minor fluctuations
    value = 1.3 + Math.sin(index * 0.4) * 0.3 + Math.random() * 0.15;
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
