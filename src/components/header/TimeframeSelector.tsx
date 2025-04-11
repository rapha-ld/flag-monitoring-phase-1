import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Share } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

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
      "h-8",
      timeframe === currentTimeframe && "bg-[#F6F8FF] border-[#425EFF]"
    );
  };

  const handleExportPDF = () => {
    toast.success('Exporting chart as PDF');
  };

  const handleExportJPEG = () => {
    toast.success('Exporting chart as JPEG');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'));
  };

  return (
    <div className="flex items-center space-x-2 ml-auto">
      <Button 
        variant={getButtonVariant("1h")} 
        size="sm" 
        className={getButtonClassName("1h")}
        onClick={() => onTimeframeChange("1h")}
      >
        1H
      </Button>
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
        2W
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
      <Button 
        variant="outline" 
        size="sm" 
        className="ml-4 flex items-center gap-2" 
        onClick={() => {}} // Prevents default click behavior
      >
        <Share className="h-4 w-4" />
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <span className="sr-only">Share options</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
              <span>Export as PDF</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportJPEG} className="cursor-pointer">
              <span>Export as JPEG</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
              <span>Copy Link</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Button>
    </div>
  );
};

export default TimeframeSelector;
