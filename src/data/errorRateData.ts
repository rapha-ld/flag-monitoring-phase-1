
import { formatDate, generatePastDates } from "../utils/dateUtils";

// List of devices
const devices = ['windows', 'macos', 'linux', 'ios', 'android'];

// Generate error rate data for the past 90 days
export const errorRateData = generatePastDates(90).map((date, index) => {
  // Create error rate data between 5-15% with occasional spikes up to 30%
  let value: number;
  
  // Determine if this should be a spike day (approximately 10% of days)
  const isSpike = Math.random() < 0.1;
  
  if (isSpike) {
    // Spike values between 15-30%
    value = 15 + Math.random() * 15;
  } else {
    // Normal values between 5-15%
    value = 5 + Math.random() * 10;
  }
  
  // Create specific patterns in the data
  if (index < 10) {
    // First 10 days - slightly elevated baseline
    value = isSpike ? 20 + Math.random() * 10 : 8 + Math.random() * 5;
  } else if (index > 25 && index < 35) {
    // Days 25-35 - create a pronounced spike period
    value = 12 + Math.random() * 18;
  } else if (index > 60 && index < 70) {
    // Days 60-70 - create another event period
    value = isSpike ? 25 + Math.random() * 5 : 10 + Math.random() * 5;
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
