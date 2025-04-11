import React from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine, ReferenceArea } from 'recharts';
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
  const displayTitle = title === "Error Rate" ? "Errors" : title;
  
  const data = React.useMemo(() => {
    if (timeframe === "1h") {
      return Array.from({ length: 60 }, (_, i) => {
        const minutes = i;
        const minuteStr = minutes.toString().padStart(2, '0');
        
        let baseValue;
        if (title === "Largest Contentful Paint") {
          const shouldSpike = Math.random() < 0.15;
          baseValue = shouldSpike 
            ? 3000 + Math.random() * 800
            : 500 + Math.random() * 400;
        } else if (title === "Error Rate") {
          baseValue = Math.random() * 100;
          if (environment === "staging") {
            baseValue = Math.random() * 100 + 20;
          }
        } else {
          baseValue = Math.random() * 100;
          if (environment === "staging") {
            baseValue = Math.random() * 100 + 30;
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
        
        let baseValue;
        if (title === "Largest Contentful Paint") {
          const shouldSpike = Math.random() < 0.15;
          baseValue = shouldSpike 
            ? 3000 + Math.random() * 800
            : 500 + Math.random() * 400;
        } else if (title === "Error Rate") {
          baseValue = Math.random() * 100;
          if (environment === "staging") {
            baseValue = Math.random() * 100 + 20;
          }
        } else {
          baseValue = Math.random() * 100;
          if (environment === "staging") {
            baseValue = Math.random() * 100 + 30;
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
          const shouldSpike = Math.random() < 0.15;
          value = shouldSpike 
            ? 3000 + Math.random() * 800
            : 500 + Math.random() * 400;
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

  const average = React.useMemo(() => {
    const sum = data.reduce((acc, item) => acc + item.value, 0);
    const avg = sum / data.length;
    
    if (title === "Error Rate") {
      return `${avg.toFixed(1)}%`;
    } else if (title === "Largest Contentful Paint") {
      return `${(avg / 1000).toFixed(2)}s`;
    } else {
      return avg.toFixed(1);
    }
  }, [data, title]);

  const chartColor = 
    title === "Error Rate" ? "#DB2251" : 
    title === "Largest Contentful Paint" ? "#525EB7" : 
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

  const chartHeight = 78 * 1.3;
  
  const useBarChart = title === "Errors";
  
  // LCP performance zones
  const renderLCPZones = () => {
    if (title !== "Largest Contentful Paint") return null;
    
    return (
      <>
        {/* Good zone: under 2.5s */}
        <ReferenceArea 
          y1={0} 
          y2={2500} 
          fill="#F2FCE2" 
          fillOpacity={0.6}
          stroke="#96CF72"
          strokeOpacity={0.5}
          strokeWidth={1} 
        />
        
        {/* Needs improvement zone: between 2.5s and 4s */}
        <ReferenceArea 
          y1={2500} 
          y2={4000} 
          fill="#FEF7CD" 
          fillOpacity={0.6}
          stroke="#E9B94B"
          strokeOpacity={0.5}
          strokeWidth={1}
        />
        
        {/* Poor zone: above 4s */}
        <ReferenceArea 
          y1={4000} 
          y2={6000} 
          fill="#FFEBEC" 
          fillOpacity={0.7}
          stroke="#EA5555"
          strokeOpacity={0.6}
          strokeWidth={1}
        />
        
        {/* Zone dividers with more prominent labels */}
        <ReferenceLine 
          y={2500} 
          stroke="#96CF72" 
          strokeWidth={1.5}
          label={{ 
            position: 'right', 
            value: 'Good: < 2.5s', 
            fontSize: 9, 
            fill: '#4B9D38',
            offset: 5,
            fontWeight: 'bold'
          }} 
        />
        <ReferenceLine 
          y={4000} 
          stroke="#E9B94B" 
          strokeWidth={1.5}
          label={{ 
            position: 'right', 
            value: 'Needs Improvement: < 4s', 
            fontSize: 9, 
            fill: '#C98515',
            offset: 5,
            fontWeight: 'bold'
          }} 
        />
        <ReferenceLine 
          y={4001} 
          stroke="#EA5555"
          strokeWidth={0}
          label={{ 
            position: 'right', 
            value: 'Poor: > 4s', 
            fontSize: 9, 
            fill: '#D92C2C',
            offset: 5,
            fontWeight: 'bold'
          }} 
        />
      </>
    );
  };

  return (
    <Card className="flex-1 bg-white">
      <CardHeader className="p-3 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{displayTitle}</CardTitle>
          <span className="text-xs text-textSecondary">{`Avg. ${average}`}</span>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 pb-1">
        <div className={`h-[${chartHeight}px]`}>
          <ResponsiveContainer width="100%" height={chartHeight}>
            {useBarChart ? (
              <BarChart 
                data={data} 
                margin={{ top: 5, right: 5, left: 5, bottom: 0 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <defs>
                  <linearGradient id={`colorGradient-${title.replace(/\s+/g, '')}`} x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor={chartColor} stopOpacity={0.05} />
                    <stop offset="100%" stopColor={chartColor} stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 8 }}
                  axisLine={{ stroke: '#eee' }} 
                  tickLine={{ stroke: '#eee' }} 
                  interval={timeframe === "1h" ? 4 : timeframe === "1d" ? 3 : "preserveEnd"}
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
                
                <Bar 
                  dataKey="value" 
                  fill={chartColor}
                  radius={[2, 2, 0, 0]}
                  fillOpacity={0.3}  
                  isAnimationActive={false}
                />
              </BarChart>
            ) : (
              <AreaChart 
                data={data} 
                margin={{ top: 5, right: 5, left: 5, bottom: 0 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <defs>
                  <linearGradient id={`colorGradient-${title.replace(/\s+/g, '')}`} x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor={chartColor} stopOpacity={0.05} />
                    <stop offset="100%" stopColor={chartColor} stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                
                {renderLCPZones()}
                
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 8 }}
                  axisLine={{ stroke: '#eee' }} 
                  tickLine={{ stroke: '#eee' }} 
                  interval={timeframe === "1h" ? 4 : timeframe === "1d" ? 3 : "preserveEnd"}
                />
                <YAxis 
                  tick={{ fontSize: 8 }}
                  axisLine={{ stroke: '#eee' }} 
                  tickLine={{ stroke: '#eee' }}
                  width={20}
                  domain={title === "Largest Contentful Paint" ? [0, 6000] : undefined}
                  tickFormatter={(value) => {
                    if (title === "Largest Contentful Paint") {
                      return value === 0 ? "0" : `${value / 1000}s`;
                    }
                    return value.toString();
                  }}
                />
                <Tooltip 
                  content={
                    <CustomTooltip 
                      tooltipValueFormatter={(value) => {
                        if (title === "Largest Contentful Paint") {
                          return `${(value / 1000).toFixed(2)}s`;
                        }
                        return tooltipValueFormatter(value);
                      }}
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
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TelemetryChart;
