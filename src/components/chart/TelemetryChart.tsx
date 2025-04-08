import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomTooltip from './CustomTooltip';

interface TelemetryChartProps {
  title: string;
  timeframe?: string;
  environment?: string;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
}

const TelemetryChart: React.FC<TelemetryChartProps> = ({ 
  title, 
  timeframe = "7d",
  environment = "production",
  hoveredTimestamp,
  onHoverTimestamp
}) => {
  const data = React.useMemo(() => {
    if (timeframe === "1d") {
      return Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0');
        
        let baseValue = Math.random() * 100;
        if (environment === "staging") {
          if (title === "Error Rate") {
            baseValue = Math.random() * 100 + 20;
          } else if (title === "Latency p90") {
            baseValue = Math.random() * 100 + 30;
          } else {
            baseValue = Math.max(10, Math.random() * 80);
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
        if (title === "Error Rate") {
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
        } else if (title === "Latency p90") {
          if (environment === "staging") {
            value = 90 + Math.random() * 80;
          } else {
            value = 60 + Math.random() * 60;
          }
        } else if (title === "Checkout Conversion Rate") {
          if (environment === "staging") {
            value = 5 + Math.random() * 10;
          } else {
            value = 10 + Math.random() * 15;
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

  const average = React.useMemo(() => {
    const sum = data.reduce((acc, item) => acc + item.value, 0);
    const avg = sum / data.length;
    
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
          <CardTitle className="text-sm font-medium mb-2">{title}</CardTitle>
          <span className="text-xs text-textSecondary">Avg. {average}</span>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 pb-1">
        <div className="h-[78px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={data} 
              margin={{ top: 5, right: 5, left: 5, bottom: 0 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <defs>
                <linearGradient id={`colorGradient-${title.replace(/\s+/g, '')}`} x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 8 }}
                axisLine={{ stroke: '#eee' }} 
                tickLine={{ stroke: '#eee' }} 
                interval={timeframe === "1d" ? 3 : "preserveEnd"}
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
