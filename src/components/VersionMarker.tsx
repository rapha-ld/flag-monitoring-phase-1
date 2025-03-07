
import React from 'react';
import { cn } from '@/lib/utils';
import { Flag } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface VersionMarkerProps {
  x: number;
  height: number;
  version: string;
  date: string;
  details?: string;
  className?: string;
}

const VersionMarker = ({ 
  x, 
  height, 
  version, 
  date, 
  details,
  className 
}: VersionMarkerProps) => {
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
              className="stroke-primary stroke-[1.5] stroke-dasharray-2"
              strokeOpacity="0.8"
            />
            
            {/* Flag indicator */}
            <circle 
              cx="0" 
              cy="10" 
              r="6" 
              className="fill-primary/20 stroke-primary stroke-[1.5]" 
            />
            
            <Flag 
              className="text-primary w-3 h-3" 
              style={{ transform: `translate(-6px, 6.5px)` }} 
            />
          </g>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-3 space-y-1.5 max-w-xs">
          <p className="font-medium text-sm">Version {version}</p>
          <p className="text-xs text-muted-foreground">{date}</p>
          {details && <p className="text-xs text-muted-foreground">{details}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VersionMarker;
