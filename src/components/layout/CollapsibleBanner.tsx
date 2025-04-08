
import React from 'react';
import { cn } from '@/lib/utils';
import { Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn("w-full border-b border-border relative", className)}
      style={{ backgroundColor: '#F7F9FB' }}
    >
      <CollapsibleContent className={cn(
        "w-full py-4 transition-all duration-300 ease-in-out",
        isOpen ? "opacity-100 max-h-screen" : "opacity-0 max-h-0 overflow-hidden"
      )}>
        <div className="flex gap-4 px-4">
          <TelemetryChart 
            title="Error Rate" 
            timeframe={timeframe} 
            environment={environment}
            hoveredTimestamp={hoveredTimestamp}
            onHoverTimestamp={onHoverTimestamp}
          />
          <TelemetryChart 
            title="Latency p90" 
            timeframe={timeframe} 
            environment={environment}
            hoveredTimestamp={hoveredTimestamp}
            onHoverTimestamp={onHoverTimestamp}
          />
          <TelemetryChart 
            title="Checkout Conversion Rate" 
            timeframe={timeframe} 
            environment={environment}
            hoveredTimestamp={hoveredTimestamp}
            onHoverTimestamp={onHoverTimestamp}
          />
        </div>
      </CollapsibleContent>
      
      <CollapsibleTrigger className="absolute bottom-0 left-0 right-0 flex items-center justify-center w-full h-6 hover:bg-gray-50 transition-colors">
        <Activity className="h-3 w-3 text-gray-500 mr-1" />
        <span className="mr-2 text-xs text-gray-600">System-wide Telemetry</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </CollapsibleTrigger>
    </Collapsible>
  );
};

export default CollapsibleBanner;
