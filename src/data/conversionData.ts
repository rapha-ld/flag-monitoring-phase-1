
import { formatDate, generatePastDates } from "../utils/dateUtils";

// List of devices
const devices = ['windows', 'macos', 'linux', 'ios', 'android'];

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
