
import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomTooltip from './CustomTooltip';

interface TelemetryChartProps {
  title: string;
  timeframe?: string;
  environment?: string; // Add environment prop
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
}

const TelemetryChart: React.FC<TelemetryChartProps> = ({ 
  title, 
  timeframe = "7d",
  environment = "production", // Default to production
  hoveredTimestamp,
  onHoverTimestamp
}) => {
  // Generate data based on timeframe and environment
  const data = React.useMemo(() => {
    if (timeframe === "1d") {
      // For 1-day timeframe, generate hourly data (24 hours)
      return Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0');
        
        // Adjust values based on environment
        let baseValue = Math.random() * 100;
        if (environment === "staging") {
          // In staging, values are generally higher for error rates and latency
          if (title === "Error Rate") {
            baseValue = Math.random() * 100 + 20; // Higher error rates in staging
          } else if (title === "Latency p90") {
            baseValue = Math.random() * 100 + 30; // Higher latency in staging
          } else {
            baseValue = Math.max(10, Math.random() * 80); // Lower conversion in staging
          }
        }
        
        return {
          time: `${hour}:00`,
          value: baseValue,
          // Adding the date property for hover coordination
          date: new Date().toISOString(),
          environment: environment // Store environment with each data point
        };
      });
    } else {
      // For other timeframes, determine number of days
      let days = 30; // default
      if (timeframe.endsWith('d')) {
        days = parseInt(timeframe.replace('d', ''));
      }
      
      // Generate data based on the selected timeframe
      return Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1) + i);
        
        // Format date as Mar 25, etc.
        const month = date.toLocaleString('en-US', { month: 'short' });
        const day = date.getDate();
        
        // Adjust value generation based on chart title and environment
        let value;
        if (title === "Error Rate") {
          // Set error rate between 5% and 15% with occasional spikes up to 30%
          const isSpike = Math.random() < 0.15; // 15% chance of spike
          
          if (environment === "staging") {
            // Higher error rates and more spikes in staging
            const isStagingSpike = Math.random() < 0.25; // 25% chance of spike in staging
            value = isStagingSpike 
              ? 20 + Math.random() * 20 // Spike between 20-40% in staging
              : 10 + Math.random() * 15; // Normal between 10-25% in staging
          } else {
            value = isSpike 
              ? 15 + Math.random() * 15 // Spike between 15-30% in production
              : 5 + Math.random() * 10; // Normal between 5-15% in production
          }
        } else if (title === "Latency p90") {
          if (environment === "staging") {
            // Higher latency in staging
            value = 90 + Math.random() * 80; // 90-170ms in staging
          } else {
            value = 60 + Math.random() * 60; // 60-120ms in production
          }
        } else if (title === "Checkout Conversion Rate") {
          if (environment === "staging") {
            // Lower conversion in staging
            value = 5 + Math.random() * 10; // 5-15% in staging
          } else {
            value = 10 + Math.random() * 15; // 10-25% in production
          }
        } else {
          value = Math.random() * 100;
        }
        
        return {
          time: `${month} ${day}`,
          value: value,
          date: date.toISOString(),
          environment: environment // Store environment with each data point
        };
      });
    }
  }, [timeframe, title, environment]); // Add environment to dependencies

  // Calculate the average value for the entire dataset
  const average = React.useMemo(() => {
    const sum = data.reduce((acc, item) => acc + item.value, 0);
    const avg = sum / data.length;
    
    // Format based on chart type
    if (title === "Error Rate") {
      return `${avg.toFixed(1)}%`;
    } else if (title === "Latency p90") {
      return `${avg.toFixed(0)}ms`;
    } else if (title === "Checkout Conversion Rate") {
      return `${avg.toFixed(1)}%`;
    } else {
      return avg.toFixed(1);
    }
  }, [data, title]);

  // Use chart color based on title
  const chartColor = 
    title === "Error Rate" ? "#DB2251" : 
    title === "Latency p90" || title === "Checkout Conversion Rate" ? "#525EB7" : 
    "#7861C6";

  const tooltipLabelFormatter = (label: string) => label;
  const tooltipValueFormatter = (value: number) => value.toFixed(2);
  
  const handleMouseMove = (e: any) => {
    if (e && e.activeLabel && onHoverTimestamp) {
      onHoverTimestamp(e.activeLabel);
    }
  };

  const handleMouseLeave = () => {
    if (onHoverTimestamp) {
      onHoverTimestamp(null);
    }
  };

  return (
    <Card className="flex-1 bg-white">
      <CardHeader className="p-3 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <span className="text-xs text-textSecondary">Avg. {average}</span>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 pb-1">
        <div className="h-[60px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={data} 
              margin={{ top: 5, right: 5, left: 5, bottom: 0 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <defs>
                <linearGradient id={`colorGradient-${title.replace(/\s+/g, '')}`} x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.1} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 8 }}
                axisLine={{ stroke: '#eee' }} 
                tickLine={{ stroke: '#eee' }} 
                interval={timeframe === "1d" ? 3 : "preserveEnd"} // Show fewer ticks for the 1d view
              />
              <YAxis 
                tick={{ fontSize: 8 }}
                axisLine={{ stroke: '#eee' }} 
                tickLine={{ stroke: '#eee' }}
                width={20}
              />
              <Tooltip 
                content={
                  <CustomTooltip 
                    tooltipValueFormatter={tooltipValueFormatter}
                    tooltipLabelFormatter={tooltipLabelFormatter}
                    showTrue={false}
                    showFalse={false}
                  />
                }
              />
              
              {hoveredTimestamp && (
                <ReferenceLine
                  x={hoveredTimestamp}
                  stroke="#6E6F96"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  isFront={true}
                />
              )}
              
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={chartColor} 
                strokeWidth={1}
                fill={`url(#colorGradient-${title.replace(/\s+/g, '')})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TelemetryChart;
