
import React from 'react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreVertical } from 'lucide-react';
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
  timeframe?: string;
}

const MetricCardHeader = ({
  title,
  value,
  change,
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
    toast.success(`Exporting ${title} chart as PDF`);
  };

  const handleExportJPEG = () => {
    toast.success(`Exporting ${title} chart as JPEG`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'));
  };

  return <CardHeader className="p-4 pb-0">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium flex items-center gap-1.5 text-inherit">
          {title}
        </CardTitle>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-slate-100">
            <MoreVertical className="h-4 w-4 text-slate-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
              <FileDown className="mr-2 h-4 w-4" />
              <span>Export as PDF</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportJPEG} className="cursor-pointer">
              <Download className="mr-2 h-4 w-4" />
              <span>Export as JPEG</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
              <LinkIcon className="mr-2 h-4 w-4" />
              <span>Copy Link</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-2">
        <CardDescription className="text-2xl font-semibold text-foreground">
          {value}
        </CardDescription>
        {change && (
          <span className={cn("text-xs font-medium rounded-full px-1.5 py-0.5 flex items-center cursor-help", change.trend === 'up' ? 'text-green-600 bg-green-100' : change.trend === 'down' ? 'text-red-600 bg-red-100' : 'text-gray-600 bg-gray-100')}>
            {change.value > 0 ? '+' : ''}{change.value}%
          </span>
        )}
      </div>
    </CardHeader>;
};

export default MetricCardHeader;
