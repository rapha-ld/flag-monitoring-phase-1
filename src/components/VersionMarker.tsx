
import React from 'react';
import { cn } from '@/lib/utils';
import { Flag, ToggleRight, ToggleLeft, RefreshCw, Settings, AlertTriangle } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { format, parseISO } from 'date-fns';

interface VersionMarkerProps {
  x?: number | string;
  height?: number;
  version: string;
  position?: number;
  date?: string;
  details?: string;
  className?: string;
  eventName?: string;
}

const VersionMarker = ({ 
  x, 
  height = 350, 
  version, 
  date, 
  details,
  className,
  eventName
}: VersionMarkerProps) => {
  // Format the date if provided
  const formattedDate = date ? format(parseISO(date), 'MMM d') : '';

  // Get the appropriate icon based on the event name
  const getEventIcon = () => {
    if (!eventName) return null;
    
    switch (eventName.toLowerCase()) {
      case 'flag enabled':
        return <ToggleRight className="h-4 w-4 text-green-500" />;
      case 'flag disabled':
        return <ToggleLeft className="h-4 w-4 text-red-500" />;
      case 'flag updated':
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case 'rules changed':
        return <Settings className="h-4 w-4 text-gray-500" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'flag created':
      default:
        return <Flag className="h-4 w-4 text-amber-500" />;
    }
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
            
            {/* Event name using icon */}
            {eventName && (
              <foreignObject x="-12" y="18" width="24" height="24">
                <div className="flex justify-center">
                  {getEventIcon()}
                </div>
              </foreignObject>
            )}
          </g>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-3 space-y-1.5 max-w-xs">
          <p className="font-medium text-sm">Version {version}</p>
          {date && <p className="text-xs text-muted-foreground">{format(parseISO(date), 'MMM d, yyyy')}</p>}
          {details && <p className="text-xs text-muted-foreground">{details}</p>}
          {eventName && <p className="text-xs font-medium">{eventName}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VersionMarker;
