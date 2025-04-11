
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TelemetryBarChart from './charts/TelemetryBarChart';
import TelemetryLineChart from './charts/TelemetryLineChart';
import TelemetryAreaChart from './charts/TelemetryAreaChart';
import { useTelemetryData } from '@/hooks/useTelemetryData';

interface TelemetryChartProps {
  title: string;
  timeframe?: string;
  environment?: string;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
  height?: number;
}

const TelemetryChart: React.FC<TelemetryChartProps> = ({ 
  title, 
  timeframe = "7d",
  environment = "production",
  hoveredTimestamp,
  onHoverTimestamp,
  height = 160
}) => {
  const { data, calculateTotal } = useTelemetryData(title, timeframe, environment);
  
  // Debug logging for hover events
  useEffect(() => {
    if (hoveredTimestamp) {
      console.log(`TelemetryChart ${title} has hoveredTimestamp: ${hoveredTimestamp}`);
    }
  }, [hoveredTimestamp, title]);
  
  // Forward hover events to parent component
  const handleHoverTimestamp = (timestamp: string | null) => {
    if (onHoverTimestamp) {
      console.log(`TelemetryChart ${title} forwarding hover: ${timestamp}`);
      onHoverTimestamp(timestamp);
    }
  };
  
  const displayTitle = title === "Error Rate" ? "Errors" : title;
  const useBarChart = title === "Error Rate" || title === "Errors";
  
  const chartColor = 
    title === "Error Rate" ? "#DB2251" : 
    title === "Largest Contentful Paint" ? "#8E9196" : 
    "#7861C6";

  return (
    <Card className="flex-1 bg-white">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{displayTitle}</CardTitle>
          {title === "Error Rate" ? (
            <span className="text-xs text-muted-foreground">{`Total: ${calculateTotal}`}</span>
          ) : (
            <span className="text-xs text-muted-foreground">{`Avg. ${calculateTotal}`}</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div style={{ height: `${height}px` }}>
          {useBarChart ? (
            <TelemetryBarChart 
              data={data}
              title={title}
              chartColor={chartColor}
              hoveredTimestamp={hoveredTimestamp}
              onHoverTimestamp={handleHoverTimestamp}
              timeframe={timeframe}
              height={height}
            />
          ) : title === "Largest Contentful Paint" ? (
            <TelemetryLineChart 
              data={data}
              title={title}
              chartColor={chartColor}
              hoveredTimestamp={hoveredTimestamp}
              onHoverTimestamp={handleHoverTimestamp}
              timeframe={timeframe}
              height={height}
            />
          ) : (
            <TelemetryAreaChart 
              data={data}
              title={title}
              chartColor={chartColor}
              hoveredTimestamp={hoveredTimestamp}
              onHoverTimestamp={handleHoverTimestamp}
              timeframe={timeframe}
              height={height}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TelemetryChart;
