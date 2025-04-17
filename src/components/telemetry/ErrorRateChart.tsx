
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TelemetryBarChart from '@/components/chart/charts/TelemetryBarChart';
import { useTelemetryData } from '@/hooks/useTelemetryData';

interface ErrorRateChartProps {
  timeframe?: string;
  environment?: string;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
  height?: number;
}

const ErrorRateChart: React.FC<ErrorRateChartProps> = ({
  timeframe = "7d",
  environment = "production",
  hoveredTimestamp,
  onHoverTimestamp,
  height = 160
}) => {
  const { data, calculateTotal } = useTelemetryData("Error Rate", timeframe, environment);

  return (
    <Card className="flex-1 bg-white">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">
              Total: {calculateTotal}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div style={{ height: `${height}px` }}>
          <TelemetryBarChart
            data={data}
            title="Error Rate"
            chartColor="#DB2251"
            hoveredTimestamp={hoveredTimestamp}
            onHoverTimestamp={onHoverTimestamp}
            timeframe={timeframe}
            height={height}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorRateChart;
