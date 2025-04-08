
import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomTooltip from './CustomTooltip';

interface TelemetryChartProps {
  title: string;
  timeframe?: string;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
}

const TelemetryChart: React.FC<TelemetryChartProps> = ({ 
  title, 
  timeframe = "7d",
  hoveredTimestamp,
  onHoverTimestamp
}) => {
  // Generate data based on timeframe
  const data = React.useMemo(() => {
    if (timeframe === "1d") {
      // For 1-day timeframe, generate hourly data (24 hours)
      return Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0');
        return {
          time: `${hour}:00`,
          value: Math.random() * 100,
          // Adding the date property for hover coordination
          date: new Date().toISOString()
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
        
        // Adjust value generation based on chart title
        let value;
        if (title === "Error Rate") {
          // Set error rate between 5% and 15% with occasional spikes up to 30%
          const isSpike = Math.random() < 0.15; // 15% chance of spike
          value = isSpike 
            ? 15 + Math.random() * 15 // Spike between 15-30%
            : 5 + Math.random() * 10; // Normal between 5-15%
        } else {
          value = Math.random() * 100;
        }
        
        return {
          time: `${month} ${day}`,
          value: value,
          date: date.toISOString()
        };
      });
    }
  }, [timeframe, title]);

  // Use chart color based on title
  const chartColor = title === "Error Rate" ? "#DB2251" : "#7861C6";

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
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
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
                    isTelemetryChart={true}
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
