
import { formatDate, generatePastDates } from "../utils/dateUtils";

// List of devices
const devices = ['windows', 'macos', 'linux', 'ios', 'android'];

// Generate conversion rate data for the past 90 days
export const conversionData = generatePastDates(90).map((date, index) => {
  // Create some variations in the data with more oscillation
  let value: number;

  if (index < 20) {
    // First 20 days - oscillating conversion rate
    value = 1.8 + Math.sin(index * 0.3) * 0.5 + Math.random() * 0.3;
  } else if (index < 40) {
    // Days 20-40 - gradual improvement with fluctuations
    value = 2.0 + (index - 20) * 0.03 + Math.sin(index * 0.4) * 0.4 + Math.random() * 0.2;
  } else if (index < 60) {
    // Days 40-60 - improved conversion after version change with some volatility
    value = 2.5 + Math.sin(index * 0.5) * 0.6 + Math.random() * 0.3;
  } else if (index < 80) {
    // Days 60-80 - new peak followed by plateau
    value = 2.8 + Math.sin((index - 60) * 0.4) * 0.7 + Math.random() * 0.2;
  } else {
    // Days 80-90 - stabilizing with minor oscillations
    value = 3.0 + Math.sin(index * 0.6) * 0.4 + Math.random() * 0.2;
  }

  return {
    name: formatDate(date),
    value: parseFloat(value.toFixed(1)),
    date: date.toISOString(),
    environment: Math.random() > 0.5 ? "production" : "staging",
    device: devices[Math.floor(Math.random() * devices.length)]
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
