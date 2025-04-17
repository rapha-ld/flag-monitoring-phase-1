
import React from 'react';
import ErrorRateChart from './ErrorRateChart';
import LCPChart from './LCPChart';
import INPChart from './INPChart';

interface SystemWideChartsProps {
  timeframe?: string;
  environment?: string;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
  height?: number;
}

const SystemWideCharts: React.FC<SystemWideChartsProps> = ({
  timeframe = "7d",
  environment = "production",
  hoveredTimestamp,
  onHoverTimestamp,
  height = 198
}) => {
  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center">
        <h2 className="text-base font-medium text-gray-800">System-wide</h2>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <ErrorRateChart
          timeframe={timeframe}
          environment={environment}
          hoveredTimestamp={hoveredTimestamp}
          onHoverTimestamp={onHoverTimestamp}
          height={height}
        />
        <LCPChart
          timeframe={timeframe}
          environment={environment}
          hoveredTimestamp={hoveredTimestamp}
          onHoverTimestamp={onHoverTimestamp}
          height={height}
        />
        <INPChart
          timeframe={timeframe}
          environment={environment}
          hoveredTimestamp={hoveredTimestamp}
          onHoverTimestamp={onHoverTimestamp}
          height={height}
        />
      </div>
    </div>
  );
};

export default SystemWideCharts;
