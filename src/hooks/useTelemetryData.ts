
import { useMemo } from 'react';

// Helper function to format hour in AM/PM
export const formatHourInAmPm = (hour: number): string => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}${period}`;
};

export const useTelemetryData = (title: string, timeframe: string, environment: string) => {
  // Generate telemetry data based on parameters
  const data = useMemo(() => {
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
        } else if (title === "Interaction to Next Paint") {
          const isSpike = Math.random() < 0.15;
          baseValue = isSpike 
            ? 0.5 + Math.random() * 0.2
            : 0.05 + Math.random() * 0.2;
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
        const hourInAmPm = formatHourInAmPm(i);
        
        let baseValue = Math.random() * 100;
        
        if (title === "Largest Contentful Paint") {
          const isSpike = Math.random() < 0.1;
          baseValue = isSpike 
            ? 2.5 + Math.random() * 0.8
            : 0.3 + Math.random() * 0.9;
        } else if (title === "Interaction to Next Paint") {
          const isSpike = Math.random() < 0.15;
          baseValue = isSpike 
            ? 0.5 + Math.random() * 0.2
            : 0.05 + Math.random() * 0.2;
        } else if (environment === "staging") {
          if (title === "Error Rate") {
            baseValue = Math.random() * 100 + 20;
          }
        }
        
        return {
          time: hourInAmPm,
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
        } else if (title === "Interaction to Next Paint") {
          const isSpike = Math.random() < 0.15;
          value = isSpike 
            ? 0.5 + Math.random() * 0.2
            : 0.05 + Math.random() * 0.2;
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
  }, [timeframe, title, environment]);

  // Calculate total or average
  const calculateTotal = useMemo(() => {
    if (title === "Error Rate") {
      const total = data.reduce((sum, item) => sum + Math.round(item.value), 0);
      return total;
    } else {
      const sum = data.reduce((acc, item) => acc + item.value, 0);
      const avg = sum / data.length;
      
      if (title === "Largest Contentful Paint" || title === "Interaction to Next Paint") {
        return `${avg.toFixed(1)}s`;
      } else {
        return Math.round(avg);
      }
    }
  }, [data, title]);

  return { data, calculateTotal };
};
