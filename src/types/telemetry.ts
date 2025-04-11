
export interface TelemetryDataPoint {
  time: string;
  value: number;
  date: string;
  environment: string;
}

export interface TelemetryChartProps {
  title: string;
  timeframe?: string;
  environment?: string;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
}

export interface ChartComponentProps {
  data: TelemetryDataPoint[];
  chartColor: string;
  chartHeight: number;
  hoveredTimestamp?: string | null;
  tooltipValueFormatter: (value: number) => string;
  tooltipLabelFormatter: (label: string) => string;
  onHoverTimestamp?: (timestamp: string | null) => void;
}
