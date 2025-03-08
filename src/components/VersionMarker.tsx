
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
  x?: number | string;
  height?: number;
  version: string;
  position?: number;
  date?: string;
  details?: string;
  className?: string;
}

const VersionMarker = ({ 
  x, 
  height = 350, 
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
              stroke="black"
              strokeWidth="1.5"
              strokeOpacity="0.7"
            />
            
            {/* Version label at the top */}
            <text
              x="0"
              y="14"
              fontSize="10"
              textAnchor="middle"
              fill="black"
              fontWeight="bold"
            >
              v{version}
            </text>
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
