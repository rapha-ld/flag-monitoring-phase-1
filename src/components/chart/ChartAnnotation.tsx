
import React from 'react';
import { Circle } from 'recharts';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Flag, Settings, CheckCircle2 } from 'lucide-react';

export interface AnnotationData {
  date: string;
  position: number;
  type: 'targeting' | 'approved' | 'variation';
  details: string;
}

interface ChartAnnotationProps {
  x?: number;
  y?: number;
  data: AnnotationData;
}

const ChartAnnotation: React.FC<ChartAnnotationProps> = ({ 
  x, 
  y, 
  data 
}) => {
  const getAnnotationIcon = () => {
    switch (data.type) {
      case 'targeting':
        return <Settings className="h-4 w-4 text-blue-500" />;
      case 'approved':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'variation':
        return <Flag className="h-4 w-4 text-amber-500" />;
      default:
        return <Flag className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAnnotationTitle = () => {
    switch (data.type) {
      case 'targeting':
        return 'Targeting Rules Changed';
      case 'approved':
        return 'Approved Changes Applied';
      case 'variation':
        return 'Default Variation Changed';
      default:
        return 'Flag Change';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <g transform={`translate(${x}, ${y})`} className="cursor-pointer">
            <Circle
              cx={0}
              cy={0}
              r={6}
              fill="#FFFFFF"
              stroke={data.type === 'targeting' ? '#3B82F6' : 
                     data.type === 'approved' ? '#10B981' : 
                     '#F59E0B'}
              strokeWidth={2}
            />
          </g>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="p-3 space-y-1.5 max-w-xs bg-white border border-gray-200 rounded-md shadow-sm z-50"
        >
          <div className="flex items-center gap-1.5">
            {getAnnotationIcon()}
            <p className="font-medium text-sm">{getAnnotationTitle()}</p>
          </div>
          <p className="text-xs text-muted-foreground">{data.details}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ChartAnnotation;
