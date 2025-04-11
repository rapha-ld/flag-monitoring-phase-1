
import React from 'react';
import { cn } from '@/lib/utils';
import TelemetryChart from '@/components/chart/TelemetryChart';

interface CollapsibleBannerProps {
  className?: string;
  timeframe?: string;
  environment?: string;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
}

const CollapsibleBanner: React.FC<CollapsibleBannerProps> = ({ 
  className, 
  timeframe = "7d",
  environment = "production",
  hoveredTimestamp,
  onHoverTimestamp
}) => {
  return (
    <div 
      className={cn("w-full border-b border-border relative", className)}
      style={{ backgroundColor: '#F7F9FB' }}
    >
      <div className="px-4 py-3 flex items-center">
        <h2 className="text-base font-medium text-gray-800">System-wide Telemetry</h2>
      </div>
      
      <div className="flex gap-4 px-4 pb-5">
        <TelemetryChart 
          title="Error Rate" 
          timeframe={timeframe} 
          environment={environment}
          hoveredTimestamp={hoveredTimestamp}
          onHoverTimestamp={onHoverTimestamp}
        />
        <TelemetryChart 
          title="Largest Contentful Paint" 
          timeframe={timeframe} 
          environment={environment}
          hoveredTimestamp={hoveredTimestamp}
          onHoverTimestamp={onHoverTimestamp}
        />
      </div>
    </div>
  );
};

export default CollapsibleBanner;
