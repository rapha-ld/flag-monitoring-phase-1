
import React from 'react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, MoreVertical, FilePdf, FileImage, Link } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface MetricCardHeaderProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  info?: string;
  timeframe?: string;
}

const MetricCardHeader = ({
  title,
  value,
  change,
  info,
  timeframe
}: MetricCardHeaderProps) => {
  // Extract the number of days from the timeframe
  const getDaysFromTimeframe = () => {
    if (!timeframe) return 14; // Default to 14 days

    if (timeframe.startsWith('custom-')) {
      return parseInt(timeframe.replace('custom-', '').replace('d', ''));
    } else {
      return parseInt(timeframe.replace('d', ''));
    }
  };

  // Handle menu actions
  const handleExportPDF = () => {
    // Placeholder for actual PDF export functionality
    toast.success(`Exporting ${title} chart as PDF`);
  };

  const handleExportJPEG = () => {
    // Placeholder for actual JPEG export functionality
    toast.success(`Exporting ${title} chart as JPEG`);
  };

  const handleCopyLink = () => {
    // Placeholder for actual copy link functionality
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'));
  };

  return <CardHeader className="p-4 pb-0">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium flex items-center gap-1.5 text-inherit">
          {title}
          {info && <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground/70" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">{info}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>}
        </CardTitle>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-slate-100">
            <MoreVertical className="h-4 w-4 text-slate-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
              <FilePdf className="mr-2 h-4 w-4" />
              <span>Export as PDF</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportJPEG} className="cursor-pointer">
              <FileImage className="mr-2 h-4 w-4" />
              <span>Export as JPEG</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
              <Link className="mr-2 h-4 w-4" />
              <span>Copy Link</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-2">
        <CardDescription className="text-2xl font-semibold text-foreground">
          {value}
        </CardDescription>
        {change && <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn("text-xs font-medium rounded-full px-1.5 py-0.5 flex items-center cursor-help", change.trend === 'up' ? 'text-green-600 bg-green-100' : change.trend === 'down' ? 'text-red-600 bg-red-100' : 'text-gray-600 bg-gray-100')}>
                  {change.value > 0 ? '+' : ''}{change.value}%
                </span>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-xs">Change from previous {getDaysFromTimeframe()} days</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>}
      </div>
    </CardHeader>;
};

export default MetricCardHeader;
