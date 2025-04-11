
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TelemetryChartProps, TelemetryDataPoint } from '@/types/telemetry';
import { generateTelemetryData, calculateAverageValue, getChartColor } from '@/utils/telemetryDataUtils';
import ErrorRateChart from './ErrorRateChart';
import LCPChart from './LCPChart';

const TelemetryChart: React.FC<TelemetryChartProps> = ({ 
  title, 
  timeframe = "7d",
  environment = "production",
  hoveredTimestamp,
  onHoverTimestamp
}) => {
  const displayTitle = title === "Error Rate" ? "Errors" : title;
  
  const data = React.useMemo(() => 
    generateTelemetryData(title, timeframe, environment), 
    [title, timeframe, environment]
  );

  const average = React.useMemo(() => 
    calculateAverageValue(data, title), 
    [data, title]
  );

  const chartColor = getChartColor(title);
  const chartHeight = 160;

  const tooltipLabelFormatter = (label: string) => label;
  
  const tooltipValueFormatter = (value: number) => {
    if (title === "Largest Contentful Paint") {
      return `${value.toFixed(1)}s`;
    }
    return Math.round(value).toString();
  };

  const useBarChart = title === "Error Rate" || title === "Errors";
  
  return (
    <Card className="flex-1 bg-white">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{displayTitle}</CardTitle>
          <span className="text-xs text-muted-foreground">{`Avg. ${average}`}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="h-[160px]">
          {useBarChart ? (
            <ErrorRateChart 
              data={data}
              chartColor={chartColor}
              chartHeight={chartHeight}
              hoveredTimestamp={hoveredTimestamp}
              tooltipValueFormatter={tooltipValueFormatter}
              tooltipLabelFormatter={tooltipLabelFormatter}
              onHoverTimestamp={onHoverTimestamp}
            />
          ) : (
            <LCPChart 
              data={data}
              chartColor={chartColor}
              chartHeight={chartHeight}
              hoveredTimestamp={hoveredTimestamp}
              tooltipValueFormatter={tooltipValueFormatter}
              tooltipLabelFormatter={tooltipLabelFormatter}
              onHoverTimestamp={onHoverTimestamp}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TelemetryChart;
