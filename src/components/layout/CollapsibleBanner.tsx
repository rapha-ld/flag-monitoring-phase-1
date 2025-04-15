import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import TelemetryChart from '@/components/chart/TelemetryChart';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  return <div className={cn("w-full space-y-3", className)}>
      <div className="flex items-center gap-2">
        <h2 className="text-base font-medium text-gray-800">System-wide</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-gray-500 hover:text-gray-700" />
            </TooltipTrigger>
            <TooltipContent>
              <p>These metrics are not scoped to the flag</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <TelemetryChart title="Error Rate" timeframe={timeframe} environment={environment} hoveredTimestamp={hoveredTimestamp} onHoverTimestamp={handleHoverEvent} height={198} />
        <TelemetryChart title="Largest Contentful Paint" timeframe={timeframe} environment={environment} hoveredTimestamp={hoveredTimestamp} onHoverTimestamp={handleHoverEvent} height={198} />
        <TelemetryChart title="Interaction to Next Paint" timeframe={timeframe} environment={environment} hoveredTimestamp={hoveredTimestamp} onHoverTimestamp={handleHoverEvent} height={198} />
      </div>
    </div>;
};
export default CollapsibleBanner;