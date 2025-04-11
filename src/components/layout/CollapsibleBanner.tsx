
import React, { useEffect } from 'react';
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
  // Debug logging for hover events
  useEffect(() => {
    if (hoveredTimestamp) {
      console.log(`CollapsibleBanner has hoveredTimestamp: ${hoveredTimestamp}`);
    }
  }, [hoveredTimestamp]);

  // Create a handler that forwards hover events
  const handleHoverEvent = (timestamp: string | null) => {
    if (onHoverTimestamp) {
      console.log(`CollapsibleBanner forwarding hover: ${timestamp}`);
      onHoverTimestamp(timestamp);
    }
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      <h2 className="text-base font-medium text-gray-800">System-wide telemetry</h2>
      
      <div className="flex gap-4 mb-8">
        <TelemetryChart 
          title="Error Rate" 
          timeframe={timeframe} 
          environment={environment}
          hoveredTimestamp={hoveredTimestamp}
          onHoverTimestamp={handleHoverEvent}
          height={264}
        />
        <TelemetryChart 
          title="Largest Contentful Paint" 
          timeframe={timeframe} 
          environment={environment}
          hoveredTimestamp={hoveredTimestamp}
          onHoverTimestamp={handleHoverEvent}
          height={264}
        />
      </div>
    </div>
  );
};

export default CollapsibleBanner;
