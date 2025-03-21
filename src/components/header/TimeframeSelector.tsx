
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
        7d
      </Button>
      <Button 
        variant={timeframe === "14d" ? "default" : "outline"} 
        size="sm" 
        className="h-9"
        onClick={() => onTimeframeChange("14d")}
      >
        14d
      </Button>
      <Button 
        variant={timeframe === "30d" ? "default" : "outline"} 
        size="sm" 
        className="h-9"
        onClick={() => onTimeframeChange("30d")}
      >
        30d
      </Button>
      <Button 
        variant={timeframe === "90d" ? "default" : "outline"} 
        size="sm" 
        className="h-9"
        onClick={() => onTimeframeChange("90d")}
      >
        90d
      </Button>
    </div>
  );
};

export default TimeframeSelector;
