
import React from 'react';
import { Button } from '@/components/ui/button';

interface TimeframeSelectorProps {
  timeframe: string;
  onTimeframeChange: (value: string) => void;
}

const TimeframeSelector = ({ timeframe, onTimeframeChange }: TimeframeSelectorProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant={timeframe === "7d" ? "default" : "outline"} 
        size="sm" 
        className="h-9"
        onClick={() => onTimeframeChange("7d")}
      >
        7D
      </Button>
      <Button 
        variant={timeframe === "14d" ? "default" : "outline"} 
        size="sm" 
        className="h-9"
        onClick={() => onTimeframeChange("14d")}
      >
        14D
      </Button>
      <Button 
        variant={timeframe === "30d" ? "default" : "outline"} 
        size="sm" 
        className="h-9"
        onClick={() => onTimeframeChange("30d")}
      >
        1M
      </Button>
      <Button 
        variant={timeframe === "90d" ? "default" : "outline"} 
        size="sm" 
        className="h-9"
        onClick={() => onTimeframeChange("90d")}
      >
        3M
      </Button>
    </div>
  );
};

export default TimeframeSelector;
