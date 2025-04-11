
import { TelemetryDataPoint } from '@/types/telemetry';

export const generateTelemetryData = (
  title: string,
  timeframe: string,
  environment: string
): TelemetryDataPoint[] => {
  if (timeframe === "1h") {
    return Array.from({ length: 60 }, (_, i) => {
      const minutes = i;
      const minuteStr = minutes.toString().padStart(2, '0');
      
      let baseValue = Math.random() * 100;
      if (title === "Largest Contentful Paint") {
        const isSpike = Math.random() < 0.1;
        baseValue = isSpike 
          ? 2.5 + Math.random() * 0.8
          : 0.3 + Math.random() * 0.9;
      } else if (environment === "staging") {
        if (title === "Error Rate") {
          baseValue = Math.random() * 100 + 20;
        }
      }
      
      return {
        time: `${minuteStr}m`,
        value: baseValue,
        date: new Date().toISOString(),
        environment: environment
      };
    });
  } else if (timeframe === "1d") {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, '0');
      
      let baseValue = Math.random() * 100;
      if (title === "Largest Contentful Paint") {
        const isSpike = Math.random() < 0.1;
        baseValue = isSpike 
          ? 2.5 + Math.random() * 0.8
          : 0.3 + Math.random() * 0.9;
      } else if (environment === "staging") {
        if (title === "Error Rate") {
          baseValue = Math.random() * 100 + 20;
        }
      }
      
      return {
        time: `${hour}:00`,
        value: baseValue,
        date: new Date().toISOString(),
        environment: environment
      };
    });
  } else {
    let days = 30;
    if (timeframe.endsWith('d')) {
      days = parseInt(timeframe.replace('d', ''));
    }
    
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1) + i);
      
      const month = date.toLocaleString('en-US', { month: 'short' });
      const day = date.getDate();
      
      let value;
      if (title === "Largest Contentful Paint") {
        const isSpike = Math.random() < 0.1;
        value = isSpike 
          ? 2.5 + Math.random() * 0.8
          : 0.3 + Math.random() * 0.9;
      } else if (title === "Error Rate") {
        const isSpike = Math.random() < 0.15;
        
        if (environment === "staging") {
          const isStagingSpike = Math.random() < 0.25;
          value = isStagingSpike 
            ? 20 + Math.random() * 20
            : 10 + Math.random() * 15;
        } else {
          value = isSpike 
            ? 15 + Math.random() * 15
            : 5 + Math.random() * 10;
        }
      } else {
        value = Math.random() * 100;
      }
      
      return {
        time: `${month} ${day}`,
        value: value,
        date: date.toISOString(),
        environment: environment
      };
    });
  }
};

export const calculateAverageValue = (
  data: TelemetryDataPoint[], 
  title: string
): string => {
  const sum = data.reduce((acc, item) => acc + item.value, 0);
  const avg = sum / data.length;
  
  if (title === "Error Rate") {
    return `${Math.round(avg)}%`;
  } else if (title === "Largest Contentful Paint") {
    return `${avg.toFixed(1)}s`;
  } else {
    return Math.round(avg).toString();
  }
};

export const getBarSize = (dataLength: number): number => {
  if (dataLength <= 5) return 30;
  if (dataLength <= 10) return 20;
  if (dataLength <= 20) return 12;
  if (dataLength <= 30) return 8;
  if (dataLength <= 60) return 6;
  return 4;
};

export const getChartColor = (title: string): string => {
  return title === "Error Rate" ? "#DB2251" : 
         title === "Largest Contentful Paint" ? "#525EB7" : 
         "#7861C6";
};
