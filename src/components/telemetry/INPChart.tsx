
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TelemetryLineChart from '@/components/chart/charts/TelemetryLineChart';
import { useTelemetryData } from '@/hooks/useTelemetryData';

interface INPChartProps {
  timeframe?: string;
  environment?: string;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
  height?: number;
}

const INPChart: React.FC<INPChartProps> = ({
  timeframe = "7d",
  environment = "production",
  hoveredTimestamp,
  onHoverTimestamp,
  height = 160
}) => {
  const { data, calculateTotal } = useTelemetryData("Interaction to Next Paint", timeframe, environment);

  return (
    <Card className="flex-1 bg-white">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Interaction to Next Paint</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">
              Avg. {calculateTotal}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div style={{ height: `${height}px` }}>
          <TelemetryLineChart
            data={data}
            title="Interaction to Next Paint"
            chartColor="#7E69AB"
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

export default INPChart;
