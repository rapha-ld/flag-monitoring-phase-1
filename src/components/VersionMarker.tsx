
import React from 'react';
import { cn } from '@/lib/utils';
import { Flag, AlertTriangle, RefreshCw } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface VersionMarkerProps {
  x?: number | string;
  height?: number;
  version: string;
  position?: number;
  date?: string;
  details?: string;
  eventType?: 'feature' | 'bug' | 'update';
  color?: string;
  className?: string;
}

const VersionMarker = ({ 
  x, 
  height = 350, 
  version, 
  date, 
  details,
  eventType,
  color = "#8E9196", // Primary gray for fonts
  className 
}: VersionMarkerProps) => {
  // Determine which icon to render based on eventType or details
  const getEventIcon = () => {
    if (eventType) {
      switch(eventType) {
        case 'feature': return <Flag size={14} />;
        case 'bug': return <AlertTriangle size={14} />;
        case 'update': return <RefreshCw size={14} />;
      }
    } else if (details) {
      if (details.toLowerCase().includes('feature')) return <Flag size={14} />;
      if (details.toLowerCase().includes('bug')) return <AlertTriangle size={14} />;
      if (details.toLowerCase().includes('update')) return <RefreshCw size={14} />;
    }
    
    // Default to Flag icon
    return <Flag size={14} />;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <g 
            className={cn("version-marker cursor-pointer", className)} 
            transform={`translate(${x}, 0)`}
          >
            {/* Vertical line */}
            <line 
              x1="0" 
              y1="0" 
              x2="0" 
              y2={height} 
              stroke={color}
              strokeWidth="1.5"
              strokeOpacity="0.7"
              strokeDasharray="3 3"
            />
            
            {/* Icon at the top */}
            <foreignObject width={16} height={16} x={-8} y={-20}>
              <div className="flex justify-center items-center" style={{ color }}>
                {getEventIcon()}
              </div>
            </foreignObject>
          </g>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-3 space-y-1.5 max-w-xs">
          <p className="font-medium text-sm">Version {version}</p>
          {date && <p className="text-xs text-muted-foreground">{date}</p>}
          {details && <p className="text-xs text-muted-foreground">{details}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VersionMarker;
