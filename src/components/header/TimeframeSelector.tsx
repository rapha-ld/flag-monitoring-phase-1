
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TimeframeSelectorProps {
  timeframe: string;
  onTimeframeChange: (value: string) => void;
}

const TimeframeSelector = ({ timeframe, onTimeframeChange }: TimeframeSelectorProps) => {
  const getButtonVariant = (currentTimeframe: string): "link" | "outline" | "default" | "destructive" | "secondary" | "ghost" => {
    return "outline";
  };

  const getButtonClassName = (currentTimeframe: string) => {
    return cn(
      "h-9",
      timeframe === currentTimeframe && "bg-[#F6F8FF] border-[#425EFF]"
    );
  };

  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant={getButtonVariant("1d")} 
        size="sm" 
        className={getButtonClassName("1d")}
        onClick={() => onTimeframeChange("1d")}
      >
        1D
      </Button>
      <Button 
        variant={getButtonVariant("7d")} 
        size="sm" 
        className={getButtonClassName("7d")}
        onClick={() => onTimeframeChange("7d")}
      >
        7D
      </Button>
      <Button 
        variant={getButtonVariant("14d")} 
        size="sm" 
        className={getButtonClassName("14d")}
        onClick={() => onTimeframeChange("14d")}
      >
        14D
      </Button>
      <Button 
        variant={getButtonVariant("30d")} 
        size="sm" 
        className={getButtonClassName("30d")}
        onClick={() => onTimeframeChange("30d")}
      >
        1M
      </Button>
      <Button 
        variant={getButtonVariant("90d")} 
        size="sm" 
        className={getButtonClassName("90d")}
        onClick={() => onTimeframeChange("90d")}
      >
        3M
      </Button>
    </div>
  );
};

export default TimeframeSelector;
