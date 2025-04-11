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
  }, [timeframe, title, environment]);

  const average = React.useMemo(() => {
    const sum = data.reduce((acc, item) => acc + item.value, 0);
    const avg = sum / data.length;
    
    if (title === "Error Rate") {
      return `${Math.round(avg)}%`;
    } else if (title === "Largest Contentful Paint") {
      return `${avg.toFixed(1)}s`;
    } else {
      return Math.round(avg);
    }
  }, [data, title]);

  const chartColor = 
    title === "Error Rate" ? "#DB2251" : 
    title === "Largest Contentful Paint" ? "#525EB7" : 
    "#7861C6";

  const tooltipLabelFormatter = (label: string) => label;
  const tooltipValueFormatter = (value: number) => {
    if (title === "Largest Contentful Paint") {
      return `${value.toFixed(1)}s`;
    }
    return Math.round(value).toString();
  };
  
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

  const chartHeight = 160; // Match flag-specific metrics chart height
  
  const useBarChart = title === "Error Rate" || title === "Errors";
  
  const goodZoneColor = "#F2FCE2";
  const needsImprovementZoneColor = "#FEF7CD";
  const poorZoneColor = "#FEC6A1";
  
  const dashedLineColor = "#8E9196";
  
  const goodThreshold = 2.5;
  const needsImprovementThreshold = 4;

  return (
    <Card className="flex-1 bg-white">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{displayTitle}</CardTitle>
          <span className="text-xs text-textSecondary">{`Avg. ${average}`}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height={chartHeight}>
            {useBarChart ? (
              <BarChart 
                data={data} 
                margin={{ top: 10, right: 5, left: 0, bottom: 5 }}
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
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  axisLine={{ stroke: '#eee' }} 
                  tickLine={false}
                  interval={timeframe === "1h" ? 4 : timeframe === "1d" ? 3 : "preserveEnd"}
                  tickMargin={10}
                  minTickGap={10}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                  width={20}
                  tickFormatter={(value) => Math.round(value).toString()}
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
                  cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }}
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
                margin={{ top: 10, right: 5, left: 0, bottom: 5 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <defs>
                  <linearGradient id={`colorGradient-${title.replace(/\s+/g, '')}`} x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor={chartColor} stopOpacity={0.05} />
                    <stop offset="100%" stopColor={chartColor} stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                
                {title === "Largest Contentful Paint" && (
                  <>
                    <ReferenceArea 
                      y1={needsImprovementThreshold} 
                      y2={6}
                      fill={poorZoneColor} 
                      fillOpacity={0.5}
                      ifOverflow="extendDomain"
                      label={{ 
                        value: "Poor", 
                        position: "insideTopRight",
                        fontSize: 8,
                        fill: "#B45309",
                        dy: 5,
                        dx: -5
                      }}
                    />
                    
                    <ReferenceLine
                      y={needsImprovementThreshold}
                      stroke={dashedLineColor}
                      strokeWidth={1}
                      strokeDasharray="3 3"
                      opacity={0.5}
                    />
                    
                    <ReferenceArea 
                      y1={goodThreshold} 
                      y2={needsImprovementThreshold} 
                      fill={needsImprovementZoneColor} 
                      fillOpacity={0.5}
                      ifOverflow="extendDomain"
                      label={{ 
                        value: "Needs improvement", 
                        position: "insideTopRight",
                        fontSize: 8,
                        fill: "#854D0E",
                        dy: 5,
                        dx: -5
                      }}
                    />
                    
                    <ReferenceLine
                      y={goodThreshold}
                      stroke={dashedLineColor}
                      strokeWidth={1}
                      strokeDasharray="3 3"
                      opacity={0.5}
                    />
                    
                    <ReferenceArea 
                      y1={0} 
                      y2={goodThreshold} 
                      fill={goodZoneColor} 
                      fillOpacity={0.5}
                      ifOverflow="extendDomain"
                      label={{ 
                        value: "Good", 
                        position: "insideTopRight",
                        fontSize: 8,
                        fill: "#3F6212",
                        dy: 5,
                        dx: -5
                      }}
                    />
                  </>
                )}
                
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  axisLine={{ stroke: '#eee' }} 
                  tickLine={false}
                  interval={timeframe === "1h" ? 4 : timeframe === "1d" ? 3 : "preserveEnd"}
                  tickMargin={10}
                  minTickGap={10}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                  width={20}
                  domain={title === "Largest Contentful Paint" ? [0, 6] : ['auto', 'auto']}
                  tickFormatter={(value) => Math.round(value).toString()}
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
                  cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }}
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
